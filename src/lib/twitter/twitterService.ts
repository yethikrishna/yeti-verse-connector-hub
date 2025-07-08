
import { TwitterHandler } from '@/handlers/twitterHandler';
const twitterHandler = new TwitterHandler();
import { Platform, ConnectionConfig } from '@/types/platform';
import { twitterApiClient } from '@/handlers/twitter/apiClient';
import { twitterOAuthHandler } from '@/handlers/twitter/oauthHandler';
import { TwitterApiResponse, TwitterTokens } from '@/types/twitter';

export class TwitterService {
  private static instance: TwitterService | null = null;
  
  private constructor() {}
  
  public static getInstance(): TwitterService {
    if (!TwitterService.instance) {
      TwitterService.instance = new TwitterService();
    }
    return TwitterService.instance;
  }
  
  private getAccessToken(connectedPlatforms: Platform[]): string | null {
    const twitterPlatform = connectedPlatforms.find(p => p.id === 'twitter');
    if (!twitterPlatform) return null;
    
    // In a real app, you'd get this from secure storage
    const connections = JSON.parse(localStorage.getItem('yeti-connections') || '[]');
    const connection = connections.find((c: any) => c.platformId === 'twitter');
    return connection?.credentials?.accessToken || null;
  }

  private createConnectionConfig(platform: Platform): ConnectionConfig {
    // Get connection data from storage
    const connections = JSON.parse(localStorage.getItem('yeti-connections') || '[]');
    const connection = connections.find((c: any) => c.platformId === platform.id);
    
    return {
      id: `${platform.id}-connection`,
      platformId: platform.id,
      credentials: connection?.credentials || {},
      settings: connection?.settings || {},
      isActive: platform.isConnected
    };
  }
  
  // Authentication and Connection
  async connect(
    options: {
      clientId: string;
      clientSecret: string;
    }
  ): Promise<any> {
    try {
      return await twitterHandler.connect(options);
    } catch (error) {
      console.error('Error connecting Twitter account:', error);
      throw new Error(`Failed to connect Twitter account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  async disconnect(platform: Platform): Promise<void> {
    try {
      const connectionConfig = this.createConnectionConfig(platform);
      await twitterHandler.disconnect(connectionConfig);
    } catch (error) {
      console.error('Error disconnecting Twitter account:', error);
      throw new Error(`Failed to disconnect Twitter account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  async test(platform: Platform): Promise<any> {
    try {
      const connectionConfig = this.createConnectionConfig(platform);
      return await twitterHandler.test(connectionConfig);
    } catch (error) {
      console.error('Error testing Twitter connection:', error);
      throw new Error(`Failed to test Twitter connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // Tweet Operations
  async postTweet(
    connectedPlatforms: Platform[],
    text: string,
    mediaIds?: string[]
  ): Promise<TwitterApiResponse> {
    const accessToken = this.getAccessToken(connectedPlatforms);
    if (!accessToken) {
      throw new Error('Twitter not connected');
    }
    
    try {
      return await twitterApiClient.postTweet(text, accessToken, mediaIds);
    } catch (error) {
      console.error('Error posting tweet:', error);
      throw new Error(`Failed to post tweet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  async getUserTweets(
    connectedPlatforms: Platform[],
    userId: string,
    maxResults: number = 10
  ): Promise<TwitterApiResponse> {
    const accessToken = this.getAccessToken(connectedPlatforms);
    if (!accessToken) {
      throw new Error('Twitter not connected');
    }
    
    try {
      return await twitterApiClient.getUserTweets(userId, accessToken, maxResults);
    } catch (error) {
      console.error('Error fetching user tweets:', error);
      throw new Error(`Failed to get user tweets: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  async searchTweets(
    connectedPlatforms: Platform[],
    query: string,
    maxResults: number = 10
  ): Promise<TwitterApiResponse> {
    const accessToken = this.getAccessToken(connectedPlatforms);
    if (!accessToken) {
      throw new Error('Twitter not connected');
    }
    
    try {
      return await twitterApiClient.searchTweets(query, accessToken, maxResults);
    } catch (error) {
      console.error('Error searching tweets:', error);
      throw new Error(`Failed to search tweets: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // User Operations
  async followUser(
    connectedPlatforms: Platform[],
    targetUserId: string
  ): Promise<TwitterApiResponse> {
    const accessToken = this.getAccessToken(connectedPlatforms);
    if (!accessToken) {
      throw new Error('Twitter not connected');
    }
    
    try {
      return await twitterApiClient.followUser(targetUserId, accessToken);
    } catch (error) {
      console.error('Error following user:', error);
      throw new Error(`Failed to follow user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  async unfollowUser(
    connectedPlatforms: Platform[],
    targetUserId: string
  ): Promise<TwitterApiResponse> {
    const accessToken = this.getAccessToken(connectedPlatforms);
    if (!accessToken) {
      throw new Error('Twitter not connected');
    }
    
    try {
      return await twitterApiClient.unfollowUser(targetUserId, accessToken);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw new Error(`Failed to unfollow user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  async getUserByUsername(
    connectedPlatforms: Platform[],
    username: string
  ): Promise<TwitterApiResponse> {
    const accessToken = this.getAccessToken(connectedPlatforms);
    if (!accessToken) {
      throw new Error('Twitter not connected');
    }
    
    try {
      return await twitterApiClient.getUserByUsername(username, accessToken);
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw new Error(`Failed to get user by username: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  async getCurrentUser(
    connectedPlatforms: Platform[]
  ): Promise<TwitterApiResponse> {
    const accessToken = this.getAccessToken(connectedPlatforms);
    if (!accessToken) {
      throw new Error('Twitter not connected');
    }
    
    try {
      return await twitterApiClient.getCurrentUser(accessToken);
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw new Error(`Failed to get current user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export default TwitterService.getInstance();
