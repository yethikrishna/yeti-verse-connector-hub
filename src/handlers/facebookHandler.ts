import { IMcpRequest, IMcpResponse } from '@/lib/mcp/IMcpServer';
import { Platform, ConnectionConfig } from '@/types/platform';
import { IPlatformHandler, BasePlatformHandler } from '@/types/platformHandler';

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  category: string;
  tasks: string[];
  perms: string[];
}

interface FacebookPost {
  id: string;
  message?: string;
  story?: string;
  created_time: string;
  updated_time: string;
  permalink_url?: string;
  shares?: {
    count: number;
  };
  reactions?: {
    data: Array<{
      id: string;
      name: string;
      type: string;
    }>;
    summary: {
      total_count: number;
    };
  };
}

interface FacebookUser {
  id: string;
  name: string;
  email?: string;
  picture?: {
    data: {
      url: string;
      is_silhouette: boolean;
    };
  };
}

interface FacebookPhoto {
  id: string;
  created_time: string;
  name?: string;
  picture: string;
  source: string;
  height: number;
  width: number;
}

export class FacebookHandler extends BasePlatformHandler implements IPlatformHandler {
  private baseUrl = 'https://graph.facebook.com/v19.0';
  private readonly apiVersion = 'v19.0';

  supportsPlatform(platformId: string): boolean {
    return platformId.toLowerCase() === 'facebook';
  }

  async connect(credentials: Record<string, string>): Promise<boolean> {
    console.log('Facebook connect called');
    
    if (!credentials.access_token && !credentials.code) {
      throw new Error('Missing Facebook access token or OAuth code. You need Facebook App access token.');
    }

    try {
      const token = credentials.access_token;
      if (!token) {
        throw new Error('OAuth flow not yet fully implemented. Please provide an access token.');
      }

      // Verify the token by getting user information
      const response = await fetch(`${this.baseUrl}/me?fields=id,name,email&access_token=${token}`);

      if (!response.ok) {
        let errorMessage = 'Invalid Facebook access token or connection failed';
        try {
          const errorData = await response.json();
          if (errorData.error && errorData.error.message) {
            errorMessage = errorData.error.message;
          }
        } catch (parseError) {
          console.log('Could not parse Facebook error response');
        }
        
        if (response.status === 401) {
          errorMessage = 'Invalid or expired Facebook access token. Please re-authenticate with Facebook.';
        } else if (response.status === 403) {
          errorMessage = 'Facebook API access forbidden. Please ensure your app has the required permissions.';
        }
        
        throw new Error(errorMessage);
      }

      const userData = await response.json();
      console.log('Facebook connection successful!', {
        id: userData.id,
        name: userData.name,
        email: userData.email
      });
      
      return true;
    } catch (error) {
      console.error('Facebook connection error:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred while connecting to Facebook. Please try again.');
      }
    }
  }

  async test(config: ConnectionConfig): Promise<boolean> {
    console.log("Testing Facebook connection...");
    
    try {
      const token = config.credentials.access_token;
      if (!token) return false;

      const response = await fetch(`${this.baseUrl}/me?access_token=${token}`);
      return response.ok;
    } catch (error) {
      console.error('Facebook test failed:', error);
      return false;
    }
  }

  async disconnect(config: ConnectionConfig): Promise<boolean> {
    console.log("Disconnecting from Facebook...");
    
    try {
      const token = config.credentials.access_token;
      if (token) {
        // Revoke the token permissions
        await fetch(`${this.baseUrl}/me/permissions?access_token=${token}`, {
          method: 'DELETE'
        });
      }
      return true;
    } catch (error) {
      console.error('Facebook disconnect error:', error);
      return false;
    }
  }

  async executeRequest(request: IMcpRequest, connectedPlatforms: Platform[]): Promise<IMcpResponse> {
    try {
      const platform = connectedPlatforms.find(p => p.id === 'facebook' && p.isConnected);
      if (!platform) {
        return {
          success: false,
          error: 'Facebook is not connected',
          data: null
        };
      }

      const connectionConfig = this.getConnectionConfig(platform);
      if (!connectionConfig?.credentials.access_token) {
        return {
          success: false,
          error: 'Facebook access token not found',
          data: null
        };
      }

      const token = connectionConfig.credentials.access_token;

      switch (request.action) {
        case 'create_post':
          return {
            success: true,
            error: null,
            data: await this.createPost(token, request.params)
          };
        
        case 'get_pages':
          return {
            success: true,
            error: null,
            data: await this.getPages(token)
          };
        
        case 'get_posts':
          return {
            success: true,
            error: null,
            data: await this.getPosts(token, request.params.pageId, request.params.options)
          };
        
        case 'upload_photo':
          return {
            success: true,
            error: null,
            data: await this.uploadPhoto(token, request.params)
          };
        
        case 'get_user_info':
          return {
            success: true,
            error: null,
            data: await this.getUserInfo(token)
          };
        
        case 'get_insights':
          return {
            success: true,
            error: null,
            data: await this.getInsights(token, request.params.objectId, request.params.metrics)
          };
        
        default:
          return {
            success: false,
            error: `Unsupported Facebook action: ${request.action}`,
            data: null
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null
      };
    }
  }

  // Facebook Graph API Methods

  async getUserInfo(token: string): Promise<FacebookUser> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me?fields=id,name,email,picture&access_token=${token}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Facebook API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Facebook get user info failed:', error);
      throw error;
    }
  }

  async getPages(token: string): Promise<{ data: FacebookPage[] }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me/accounts?fields=id,name,access_token,category,tasks,perms&access_token=${token}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Facebook API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Facebook get pages failed:', error);
      throw error;
    }
  }

  async createPost(
    token: string,
    postData: {
      message?: string;
      link?: string;
      picture?: string;
      name?: string;
      description?: string;
      pageId?: string;
      published?: boolean;
      scheduled_publish_time?: number;
    }
  ): Promise<{ id: string; post_id?: string }> {
    try {
      const { pageId, ...postParams } = postData;
      const endpoint = pageId ? `${pageId}/feed` : 'me/feed';

      const formData = new FormData();
      Object.entries(postParams).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
      formData.append('access_token', token);

      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Facebook API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Facebook create post failed:', error);
      throw error;
    }
  }

  async getPosts(
    token: string,
    pageId?: string,
    options: {
      fields?: string[];
      limit?: number;
      since?: string;
      until?: string;
    } = {}
  ): Promise<{ data: FacebookPost[] }> {
    try {
      const { 
        fields = ['id', 'message', 'created_time', 'updated_time', 'permalink_url', 'shares', 'reactions.summary(total_count)'],
        limit = 25,
        since,
        until
      } = options;

      const params = new URLSearchParams({
        fields: fields.join(','),
        limit: limit.toString(),
        access_token: token
      });

      if (since) params.append('since', since);
      if (until) params.append('until', until);

      const endpoint = pageId ? `${pageId}/posts` : 'me/posts';
      const response = await fetch(`${this.baseUrl}/${endpoint}?${params}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Facebook API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Facebook get posts failed:', error);
      throw error;
    }
  }

  async uploadPhoto(
    token: string,
    photoData: {
      url?: string;
      source?: File | Blob;
      caption?: string;
      pageId?: string;
      published?: boolean;
    }
  ): Promise<{ id: string; post_id?: string }> {
    try {
      const { pageId, url, source, caption, published = true } = photoData;
      const endpoint = pageId ? `${pageId}/photos` : 'me/photos';

      const formData = new FormData();
      
      if (url) {
        formData.append('url', url);
      } else if (source) {
        formData.append('source', source);
      } else {
        throw new Error('Either url or source must be provided');
      }

      if (caption) formData.append('caption', caption);
      formData.append('published', String(published));
      formData.append('access_token', token);

      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Facebook API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Facebook upload photo failed:', error);
      throw error;
    }
  }

  async getInsights(
    token: string,
    objectId: string,
    metrics: string[] = ['post_impressions', 'post_engaged_users']
  ): Promise<{ data: any[] }> {
    try {
      const params = new URLSearchParams({
        metric: metrics.join(','),
        access_token: token
      });

      const response = await fetch(`${this.baseUrl}/${objectId}/insights?${params}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Facebook API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Facebook get insights failed:', error);
      throw error;
    }
  }

  async deletePost(token: string, postId: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/${postId}?access_token=${token}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Facebook API error: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Facebook delete post failed:', error);
      throw error;
    }
  }

  async getComments(
    token: string,
    postId: string,
    options: {
      fields?: string[];
      limit?: number;
      order?: 'chronological' | 'reverse_chronological';
    } = {}
  ): Promise<{ data: any[] }> {
    try {
      const { 
        fields = ['id', 'message', 'created_time', 'from', 'like_count'],
        limit = 25,
        order = 'chronological'
      } = options;

      const params = new URLSearchParams({
        fields: fields.join(','),
        limit: limit.toString(),
        order,
        access_token: token
      });

      const response = await fetch(`${this.baseUrl}/${postId}/comments?${params}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Facebook API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Facebook get comments failed:', error);
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
    // Implementation for fetching Facebook execution history
    return [];
  }

  getServerType(): string {
    return 'facebook';
  }
}

export const facebookHandler = new FacebookHandler();