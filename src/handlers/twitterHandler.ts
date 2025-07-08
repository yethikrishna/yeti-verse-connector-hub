import { IMcpRequest, IMcpResponse } from '@/lib/mcp/IMcpServer';
import { Platform } from '@/types/platform';
import { IPlatformHandler } from '@/types/platformHandler';
import { twitterOAuthHandler } from './twitter/oauthHandler';

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

    try {
      let result;
      switch (request.action) {
        case 'post_tweet':
          result = await postTweet(twitterConnection, request.params.text);
          break;
        case 'read_timeline':
          result = await readTimeline(twitterConnection, request.params.limit || 10);
          break;
        case 'search_tweets':
          result = await searchTweets(twitterConnection, request.params.query, request.params.limit || 10);
          break;
        case 'manage_followers':
          result = await manageFollowers(twitterConnection, request.params.action, request.params.username);
          break;
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
  }

  getExecutionHistory = async (userId: string, limit: number = 10): Promise<any[]> => ({
    // In a real implementation, this would fetch from a database
    console.log(`Fetching Twitter execution history for user ${userId}, limit ${limit}`);
    return [];
  }

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
}