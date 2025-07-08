
import { ConnectionConfig } from '@/types/platform';
import { TikTokApiClient } from './apiClient';
import { TikTokOAuthHandler } from './oauthHandler';
import SecureStorage from '@/lib/security/SecureStorage';
const secureStorage = SecureStorage.getInstance();

export const tiktokHandler = {
  async connect(credentials: Record<string, string>): Promise<boolean> {
    console.log('tiktokHandler.connect called', { credentials: { clientId: credentials.clientId, clientSecret: 'REDACTED' } });
    
    const { clientId, clientSecret } = credentials;
    
    if (!clientId || !clientSecret) {
      console.error('Error in tiktokHandler.connect: TikTok Client ID and Client Secret are required.');
      throw new Error('TikTok Client ID and Client Secret are required');
    }

    try {
      const oauthHandler = new TikTokOAuthHandler(clientId, clientSecret);
      const authUrl = oauthHandler.getAuthUrl();
      
      secureStorage.setItem('tiktok_oauth_credentials', { clientId, clientSecret });
      console.log('tiktokHandler.connect: Redirecting to TikTok OAuth.');
      window.location.href = authUrl;
      
      return true; // Note: execution stops here due to redirect
    } catch (error) {
      console.error('Error in tiktokHandler.connect: TikTok OAuth initiation failed.', error);
      throw new Error(`Failed to start TikTok OAuth: ${error instanceof Error ? error.message : String(error)}`);
    }
  },

  async disconnect(connection: ConnectionConfig): Promise<void> {
    console.log('tiktokHandler.disconnect called', { connectionId: connection.id });
    
    try {
      const { clientId, clientSecret, accessToken } = connection.credentials;
      
      if (accessToken && clientId && clientSecret) {
        const oauthHandler = new TikTokOAuthHandler(clientId, clientSecret);
        await oauthHandler.revokeToken(accessToken);
        console.log('tiktokHandler.disconnect: Token revoked successfully.');
      } else {
        console.log('tiktokHandler.disconnect: No access token or client credentials to revoke.');
      }
      
      secureStorage.removeItem('tiktok_oauth_credentials');
      console.log('tiktokHandler.disconnect: TikTok disconnected successfully.');
    } catch (error) {
      console.error('Error in tiktokHandler.disconnect:', error);
      // Don't throw - allow disconnect to continue even if revocation fails
    }
  },

  async test(connection: ConnectionConfig): Promise<boolean> {
    console.log('tiktokHandler.test called', { connectionId: connection.id });
    let success = false;
    let testError: any = null;

    try {
      const { accessToken } = connection.credentials;
      
      if (!accessToken) {
        console.log('tiktokHandler.test: No access token found.');
        return false; // success remains false
      }

      const apiClient = new TikTokApiClient(accessToken);
      await apiClient.getUserInfo();
      success = true;
      console.log('tiktokHandler.test: TikTok connection test successful.');
      return true;
    } catch (error) {
      testError = error;
      console.error('Error in tiktokHandler.test: TikTok connection test failed.', error);
      return false; // success remains false
    } finally {
      // More explicit logging of test outcome
      console.log('tiktokHandler.test result:', { success, error: testError ? String(testError) : null });
    }
  },

  // Additional methods for TikTok-specific operations
  async getUserInfo(connection: ConnectionConfig) {
    console.log('tiktokHandler.getUserInfo called', { connectionId: connection.id });
    try {
      const { accessToken } = connection.credentials;
      if (!accessToken) throw new Error('Access token is required for getUserInfo.');
      const apiClient = new TikTokApiClient(accessToken);
      return await apiClient.getUserInfo();
    } catch (error) {
      console.error('Error in tiktokHandler.getUserInfo:', error);
      throw error;
    }
  },

  async getCreatorInfo(connection: ConnectionConfig) {
    console.log('tiktokHandler.getCreatorInfo called', { connectionId: connection.id });
    try {
      const { accessToken } = connection.credentials;
      if (!accessToken) throw new Error('Access token is required for getCreatorInfo.');
      const apiClient = new TikTokApiClient(accessToken);
      return await apiClient.getCreatorInfo();
    } catch (error) {
      console.error('Error in tiktokHandler.getCreatorInfo:', error);
      throw error;
    }
  },

  async getVideos(connection: ConnectionConfig, cursor?: string, maxCount: number = 20) {
    console.log('tiktokHandler.getVideos called', { connectionId: connection.id, cursor, maxCount });
    try {
      const { accessToken } = connection.credentials;
      if (!accessToken) throw new Error('Access token is required for getVideos.');
      const apiClient = new TikTokApiClient(accessToken);
      return await apiClient.getVideos(cursor, maxCount);
    } catch (error) {
      console.error('Error in tiktokHandler.getVideos:', error);
      throw error;
    }
  },

  async postVideo(connection: ConnectionConfig, videoData: {
    title: string;
    privacy: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'FOLLOWER_OF_CREATOR' | 'SELF_ONLY';
    disableComment?: boolean;
    videoFile: File; // Note: File object cannot be fully logged without reading it
  }) {
    console.log('tiktokHandler.postVideo called', { connectionId: connection.id, videoTitle: videoData.title, privacy: videoData.privacy });
    try {
      const { accessToken } = connection.credentials;
      if (!accessToken) throw new Error('Access token is required for postVideo.');
      const apiClient = new TikTokApiClient(accessToken);

      // Initialize video post
    const initResponse = await apiClient.initVideoPost({
      post_info: {
        privacy_level: videoData.privacy,
        title: videoData.title,
        disable_comment: videoData.disableComment || false,
      },
      source_info: {
        source: 'FILE_UPLOAD',
        video_size: videoData.videoFile.size,
        chunk_size: videoData.videoFile.size,
        total_chunk_count: 1,
      },
    });

    if (initResponse.error) {
      const errorMessage = `Failed to initialize video post: ${initResponse.error.message} (Log ID: ${initResponse.error.log_id || 'N/A'})`;
      console.error('Error in tiktokHandler.postVideo (initResponse):', errorMessage, initResponse.error);
      throw new Error(errorMessage);
    }

    // Upload video
    if (initResponse.data.upload_url) {
      const uploadResponse = await apiClient.uploadVideo(
        initResponse.data.upload_url,
        videoData.videoFile,
        `bytes 0-${videoData.videoFile.size - 1}/${videoData.videoFile.size}`
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text().catch(() => 'Could not retrieve error text from upload.');
        const errorMessage = `Failed to upload video: ${uploadResponse.status} ${uploadResponse.statusText}. ${errorText}`;
        console.error('Error in tiktokHandler.postVideo (uploadResponse):', errorMessage, { status: uploadResponse.status, statusText: uploadResponse.statusText });
        throw new Error(errorMessage);
      }
    }
    console.log('tiktokHandler.postVideo: Video posted successfully, publishId:', initResponse.data.publish_id);
    return initResponse.data.publish_id;
   } catch (error) {
      console.error('Error in tiktokHandler.postVideo:', error);
      throw error;
   }
  },

  async createDraftVideo(connection: ConnectionConfig, videoUrl: string) {
    console.log('tiktokHandler.createDraftVideo called', { connectionId: connection.id, videoUrl });
    try {
      const { accessToken } = connection.credentials;
      if (!accessToken) throw new Error('Access token is required for createDraftVideo.');
      const apiClient = new TikTokApiClient(accessToken);

      return await apiClient.initInboxVideo({
        source_info: {
          source: 'PULL_FROM_URL',
          video_url: videoUrl,
        },
      });
    } catch (error) {
      console.error('Error in tiktokHandler.createDraftVideo:', error);
      throw error;
    }
  },

  async getPublishStatus(connection: ConnectionConfig, publishId: string) {
    console.log('tiktokHandler.getPublishStatus called', { connectionId: connection.id, publishId });
    try {
      const { accessToken } = connection.credentials;
      if (!accessToken) throw new Error('Access token is required for getPublishStatus.');
      const apiClient = new TikTokApiClient(accessToken);
      return await apiClient.getPublishStatus(publishId);
    } catch (error) {
      console.error('Error in tiktokHandler.getPublishStatus:', error);
      throw error;
    }
  },

  async getResearchApiHealthStatus(connection: ConnectionConfig): Promise<any> {
    console.log('tiktokHandler.getResearchApiHealthStatus called', { connectionId: connection.id });
    const { clientId, clientSecret } = connection.credentials;

    if (!clientId || !clientSecret) {
      console.error('Error in tiktokHandler.getResearchApiHealthStatus: TikTok Client ID and Client Secret are required.');
      throw new Error('TikTok Client ID and Client Secret are required for this operation.');
    }

    try {
      const oauthHandler = new TikTokOAuthHandler(clientId, clientSecret);
      const clientToken = await oauthHandler.getClientAccessToken();

      if (!clientToken || !clientToken.access_token) {
        console.error('Error in tiktokHandler.getResearchApiHealthStatus: Failed to obtain client access token.', clientToken);
        throw new Error('Failed to obtain client access token.');
      }

      const apiClient = new TikTokApiClient(clientToken.access_token);
      const status = await apiClient.checkResearchApiStatus();
      console.log('tiktokHandler.getResearchApiHealthStatus: Research API Health Status:', status);
      return status;
    } catch (error) {
      console.error('Error in tiktokHandler.getResearchApiHealthStatus: Failed to get Research API health status.', error);
      throw error;
    }
  },
};
