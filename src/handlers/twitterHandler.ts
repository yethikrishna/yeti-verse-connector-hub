import { IMcpRequest, IMcpResponse } from '@/lib/mcp/IMcpServer';
import { Platform, ConnectionConfig } from '@/types/platform'; // Added ConnectionConfig
import { IPlatformHandler, BasePlatformHandler } from '@/types/platformHandler'; // Added BasePlatformHandler
import { twitterOAuthHandler } from './twitter/oauthHandler';
import { twitterApiClient } from './twitter/apiClient'; // Added twitterApiClient

export class TwitterHandler extends BasePlatformHandler implements IPlatformHandler {


  supportsPlatform(platformId: string): boolean {
    return platformId.toLowerCase() === 'twitter';
  }

  async executeRequest(request: IMcpRequest, connectedPlatforms: Platform[]): Promise<IMcpResponse> {
    console.log('Twitter handler executing request:', request);

    // Find the Twitter connection for the user
    const twitterConnection = connectedPlatforms.find(p => p.platformId === 'twitter');
    if (!twitterConnection) {
      return {
        success: false,
        error: 'User not connected to Twitter',
        data: null
      };
    }

    // TODO: Review how accessToken is reliably obtained from 'twitterConnection: Platform'.
    // Assuming credentials might be part of Platform or accessible via it.
    // For now, trying to access via a hypothetical 'credentials.token'.
    // This might need adjustment based on actual data structure for Platform credentials.
    const accessToken = (twitterConnection as any).credentials?.token || (twitterConnection as any).credentials?.accessToken;

    if (!accessToken) {
      return {
        success: false,
        error: 'Twitter access token not found for the user.',
        data: null
      };
    }

    try {
      let result;
      switch (request.action) {
        case 'post_tweet':
          if (!request.params.text) throw new Error("Missing 'text' parameter for post_tweet");
          result = await twitterApiClient.postTweet(request.params.text, accessToken);
          break;
        case 'read_timeline':
          // Assuming twitterConnection.userId or a similar field exists for the user's Twitter ID
          // This is a placeholder; the actual user ID source needs verification.
          const twitterUserId = (twitterConnection as any).platformUserId || twitterConnection.id;
          if (!twitterUserId) throw new Error("Missing Twitter User ID for read_timeline");
          result = await twitterApiClient.getUserTweets(twitterUserId, accessToken, request.params.limit || 10);
          break;
        case 'search_tweets':
          if (!request.params.query) throw new Error("Missing 'query' parameter for search_tweets");
          result = await twitterApiClient.searchTweets(request.params.query, accessToken, request.params.limit || 10);
          break;
        case 'manage_followers':
          // TODO: Implement manage_followers. This requires:
          // 1. Get target user ID from request.params.username using twitterApiClient.getUserByUsername().
          // 2. Call twitterApiClient.followUser() or twitterApiClient.unfollowUser() based on request.params.action.
          console.warn('manage_followers action is not fully implemented yet.');
          return {
            success: false,
            error: 'manage_followers action is not fully implemented.',
            data: null
          };
        default:
          return {
            success: false,
            error: `Unsupported action: ${request.action}`,
            data: null
          };
      }

      // Log successful execution
      await this.getExecutionHistory(twitterConnection.userId, 1);

      return {
        success: true,
        error: null,
        data: result
      };
    } catch (error) {
      console.error('Twitter API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        data: null
      };
    } // This closes the catch block of executeRequest
  } // This closes the executeRequest method body

  getExecutionHistory = async (userId: string, limit: number = 10): Promise<any[]> => {
    // In a real implementation, this would fetch from a database
    console.log(`Fetching Twitter execution history for user ${userId}, limit ${limit}`);
    return [];
  };

  async connect(credentials: ConnectionConfig): Promise<boolean> {
    console.log('Starting Twitter OAuth connection...');
    
    if (credentials.clientId && credentials.clientSecret) {
      // Assuming TwitterOAuthHandler is available and properly imported
      twitterOAuthHandler.setCredentials(credentials.clientId, credentials.clientSecret);
      twitterOAuthHandler.initiateOAuthFlow();
      return true;
    }
    
    throw new Error('Twitter Client ID and Client Secret are required');
  }

  async disconnect(connection: ConnectionConfig): Promise<void> {
    console.log('Disconnecting from Twitter...');
    // Implementation for disconnecting from Twitter
    if (connection.id) {
      // Assuming twitterOAuthHandler is available
      twitterOAuthHandler.clearStoredTokens();
    }
  }

  getServerType(): string {
    return 'twitter';
  }
}

export const twitterHandler = new TwitterHandler();