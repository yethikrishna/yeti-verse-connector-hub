import { IMcpRequest, IMcpResponse } from '@/lib/mcp/IMcpServer';
import { Platform, ConnectionConfig } from '@/types/platform';
import { IPlatformHandler, BasePlatformHandler } from '@/types/platformHandler';

interface TwitterUser {
  id: string;
  name: string;
  username: string;
  created_at?: string;
  description?: string;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
}

interface TwitterTweet {
  id: string;
  text: string;
  created_at?: string;
  author_id?: string;
  public_metrics?: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
  };
  edit_history_tweet_ids?: string[];
}

interface TwitterAPIResponse<T> {
  data?: T;
  meta?: {
    result_count?: number;
    next_token?: string;
    previous_token?: string;
  };
  errors?: Array<{
    message: string;
    type: string;
  }>;
}

export class TwitterHandler extends BasePlatformHandler implements IPlatformHandler {
  private baseUrl = 'https://api.twitter.com/2';

  supportsPlatform(platformId: string): boolean {
    return platformId.toLowerCase() === 'twitter';
  }

  async executeRequest(request: IMcpRequest, connectedPlatforms: Platform[]): Promise<IMcpResponse> {
    console.log('Twitter handler executing request:', request);

    const twitterConnection = connectedPlatforms.find(p => p.id === 'twitter' && p.isConnected);
    if (!twitterConnection) {
      return {
        success: false,
        error: 'User not connected to Twitter',
        data: null
      };
    }

    const connectionConfig = this.getConnectionConfig(twitterConnection);
    if (!connectionConfig) {
      return {
        success: false,
        error: 'Twitter connection configuration not found',
        data: null
      };
    }

    const accessToken = connectionConfig.credentials.accessToken || connectionConfig.credentials.bearer_token;
    if (!accessToken) {
      return {
        success: false,
        error: 'Twitter access token not found',
        data: null
      };
    }

    try {
      let result;
      switch (request.action) {
        case 'post_tweet':
          if (!request.params.text) throw new Error("Missing 'text' parameter for post_tweet");
          result = await this.postTweet(accessToken, request.params.text, request.params.media_ids);
          break;
        
        case 'read_timeline':
          result = await this.getUserTimeline(accessToken, request.params.user_id, request.params.options);
          break;
        
        case 'search_tweets':
          if (!request.params.query) throw new Error("Missing 'query' parameter for search_tweets");
          result = await this.searchTweets(accessToken, request.params.query, request.params.options);
          break;
        
        case 'get_user':
          if (!request.params.username && !request.params.user_id) {
            throw new Error("Missing 'username' or 'user_id' parameter for get_user");
          }
          result = await this.getUser(accessToken, request.params.username, request.params.user_id);
          break;
        
        case 'like_tweet':
          if (!request.params.tweet_id) throw new Error("Missing 'tweet_id' parameter for like_tweet");
          result = await this.likeTweet(accessToken, request.params.tweet_id);
          break;
        
        case 'retweet':
          if (!request.params.tweet_id) throw new Error("Missing 'tweet_id' parameter for retweet");
          result = await this.retweet(accessToken, request.params.tweet_id);
          break;
        
        case 'delete_tweet':
          if (!request.params.tweet_id) throw new Error("Missing 'tweet_id' parameter for delete_tweet");
          result = await this.deleteTweet(accessToken, request.params.tweet_id);
          break;
        
        default:
          return {
            success: false,
            error: `Unsupported Twitter action: ${request.action}`,
            data: null
          };
      }

      return {
        success: true,
        error: null,
        data: result
      };
    } catch (error) {
      console.error(`Twitter ${request.action} failed:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        data: null
      };
    }
  }

  async connect(credentials: Record<string, string>): Promise<boolean> {
    console.log('Twitter connect called with credentials');
    
    if (!credentials.bearer_token && !credentials.accessToken) {
      throw new Error('Missing Twitter bearer token or access token. You need a Twitter API v2 Bearer Token.');
    }

    const token = credentials.bearer_token || credentials.accessToken;
    
    try {
      // Verify the token by getting the authenticated user's information
      const response = await fetch(`${this.baseUrl}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Yeti-Platform/2.0'
        }
      });

      if (!response.ok) {
        let errorMessage = 'Invalid Twitter token or connection failed';
        try {
          const errorData = await response.json();
          if (errorData.errors && errorData.errors.length > 0) {
            errorMessage = errorData.errors[0].message;
          }
        } catch (parseError) {
          console.log('Could not parse Twitter error response');
        }
        
        if (response.status === 401) {
          errorMessage = 'Invalid Twitter Bearer Token. Please verify:\n1. The token is correct and not expired\n2. The token has the required permissions\n3. You have copied the entire token without extra spaces';
        } else if (response.status === 403) {
          errorMessage = 'Twitter API access forbidden. This could be due to:\n1. Insufficient permissions\n2. Rate limit exceeded\n3. Account restrictions';
        }
        
        throw new Error(errorMessage);
      }

      const userData = await response.json();
      console.log('Twitter connection successful!', {
        username: userData.data?.username,
        id: userData.data?.id,
        name: userData.data?.name
      });
      
      return true;
    } catch (error) {
      console.error('Twitter connection error:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred while connecting to Twitter. Please try again.');
      }
    }
  }

  async test(config: ConnectionConfig): Promise<boolean> {
    console.log("Testing Twitter connection...");
    
    try {
      const token = config.credentials.bearer_token || config.credentials.accessToken;
      if (!token) return false;

      const response = await fetch(`${this.baseUrl}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'Yeti-Platform/2.0'
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Twitter test failed:', error);
      return false;
    }
  }

  async disconnect(config: ConnectionConfig): Promise<boolean> {
    console.log("Disconnecting from Twitter...");
    // For Twitter API v2, we just need to remove the stored credentials
    // The token itself cannot be revoked via API without additional OAuth setup
    return true;
  }

  // Twitter API v2 Methods

  async postTweet(token: string, text: string, mediaIds?: string[]): Promise<TwitterTweet> {
    try {
      const payload: any = { text };
      if (mediaIds && mediaIds.length > 0) {
        payload.media = {
          media_ids: mediaIds
        };
      }

      const response = await fetch(`${this.baseUrl}/tweets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Yeti-Platform/2.0'
        },
        body: JSON.stringify(payload)
      });

      const data: TwitterAPIResponse<TwitterTweet> = await response.json();

      if (!response.ok || data.errors) {
        const errorMessage = data.errors?.[0]?.message || `Twitter API error: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      if (!data.data) {
        throw new Error('No data returned from Twitter API');
      }

      return data.data;
    } catch (error) {
      console.error('Twitter post tweet failed:', error);
      throw error;
    }
  }

  async getUserTimeline(
    token: string, 
    userId?: string, 
    options: {
      max_results?: number;
      pagination_token?: string;
      tweet_fields?: string[];
      expansions?: string[];
    } = {}
  ): Promise<TwitterAPIResponse<TwitterTweet[]>> {
    try {
      const { 
        max_results = 10, 
        pagination_token, 
        tweet_fields = ['created_at', 'public_metrics', 'author_id'],
        expansions = ['author_id']
      } = options;

      const endpoint = userId ? 
        `${this.baseUrl}/users/${userId}/tweets` : 
        `${this.baseUrl}/users/me/tweets`;

      const params = new URLSearchParams({
        max_results: max_results.toString(),
        'tweet.fields': tweet_fields.join(','),
        expansions: expansions.join(',')
      });

      if (pagination_token) {
        params.append('pagination_token', pagination_token);
      }

      const response = await fetch(`${endpoint}?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'Yeti-Platform/2.0'
        }
      });

      const data: TwitterAPIResponse<TwitterTweet[]> = await response.json();

      if (!response.ok || data.errors) {
        const errorMessage = data.errors?.[0]?.message || `Twitter API error: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('Twitter get user timeline failed:', error);
      throw error;
    }
  }

  async searchTweets(
    token: string, 
    query: string, 
    options: {
      max_results?: number;
      next_token?: string;
      tweet_fields?: string[];
      expansions?: string[];
      sort_order?: 'recency' | 'relevancy';
    } = {}
  ): Promise<TwitterAPIResponse<TwitterTweet[]>> {
    try {
      const { 
        max_results = 10, 
        next_token, 
        tweet_fields = ['created_at', 'public_metrics', 'author_id'],
        expansions = ['author_id'],
        sort_order = 'recency'
      } = options;

      const params = new URLSearchParams({
        query,
        max_results: max_results.toString(),
        'tweet.fields': tweet_fields.join(','),
        expansions: expansions.join(','),
        sort_order
      });

      if (next_token) {
        params.append('next_token', next_token);
      }

      const response = await fetch(`${this.baseUrl}/tweets/search/recent?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'Yeti-Platform/2.0'
        }
      });

      const data: TwitterAPIResponse<TwitterTweet[]> = await response.json();

      if (!response.ok || data.errors) {
        const errorMessage = data.errors?.[0]?.message || `Twitter API error: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('Twitter search tweets failed:', error);
      throw error;
    }
  }

  async getUser(token: string, username?: string, userId?: string): Promise<TwitterUser> {
    try {
      let endpoint;
      if (userId) {
        endpoint = `${this.baseUrl}/users/${userId}`;
      } else if (username) {
        endpoint = `${this.baseUrl}/users/by/username/${username}`;
      } else {
        endpoint = `${this.baseUrl}/users/me`;
      }

      const params = new URLSearchParams({
        'user.fields': 'created_at,description,public_metrics'
      });

      const response = await fetch(`${endpoint}?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'Yeti-Platform/2.0'
        }
      });

      const data: TwitterAPIResponse<TwitterUser> = await response.json();

      if (!response.ok || data.errors) {
        const errorMessage = data.errors?.[0]?.message || `Twitter API error: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      if (!data.data) {
        throw new Error('No user data returned from Twitter API');
      }

      return data.data;
    } catch (error) {
      console.error('Twitter get user failed:', error);
      throw error;
    }
  }

  async likeTweet(token: string, tweetId: string): Promise<{ liked: boolean }> {
    try {
      // First get the current user's ID
      const userResponse = await this.getUser(token);
      const userId = userResponse.id;

      const response = await fetch(`${this.baseUrl}/users/${userId}/likes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Yeti-Platform/2.0'
        },
        body: JSON.stringify({
          tweet_id: tweetId
        })
      });

      const data = await response.json();

      if (!response.ok || data.errors) {
        const errorMessage = data.errors?.[0]?.message || `Twitter API error: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return data.data || { liked: true };
    } catch (error) {
      console.error('Twitter like tweet failed:', error);
      throw error;
    }
  }

  async retweet(token: string, tweetId: string): Promise<{ retweeted: boolean }> {
    try {
      // First get the current user's ID
      const userResponse = await this.getUser(token);
      const userId = userResponse.id;

      const response = await fetch(`${this.baseUrl}/users/${userId}/retweets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Yeti-Platform/2.0'
        },
        body: JSON.stringify({
          tweet_id: tweetId
        })
      });

      const data = await response.json();

      if (!response.ok || data.errors) {
        const errorMessage = data.errors?.[0]?.message || `Twitter API error: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return data.data || { retweeted: true };
    } catch (error) {
      console.error('Twitter retweet failed:', error);
      throw error;
    }
  }

  async deleteTweet(token: string, tweetId: string): Promise<{ deleted: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/tweets/${tweetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'Yeti-Platform/2.0'
        }
      });

      const data = await response.json();

      if (!response.ok || data.errors) {
        const errorMessage = data.errors?.[0]?.message || `Twitter API error: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return data.data || { deleted: true };
    } catch (error) {
      console.error('Twitter delete tweet failed:', error);
      throw error;
    }
  }

  // Helper method to get connection config from Platform
  private getConnectionConfig(platform: Platform): ConnectionConfig | null {
    // This is a placeholder - in real implementation, you'd fetch the actual connection config
    // from the platform's stored credentials
    return null;
  }

  async getExecutionHistory(userId: string, limit?: number, platform?: string): Promise<any[]> {
    // Implementation for fetching Twitter execution history
    return [];
  }

  getServerType(): string {
    return 'twitter';
  }
}

export const twitterHandler = new TwitterHandler();
