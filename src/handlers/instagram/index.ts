
import { ConnectionConfig } from '@/types/platform';
import { InstagramApiClient } from './apiClient';
import { InstagramOAuthHandler } from './oauthHandler';
import SecureStorage from '@/lib/security/SecureStorage';
const secureStorage = SecureStorage.getInstance();

export const instagramHandler = {
  async connect(credentials: Record<string, string>): Promise<boolean> {
    console.log('Connecting to Instagram...');
    
    const { appId, appSecret } = credentials;
    
    if (!appId || !appSecret) {
      throw new Error('Instagram App ID and App Secret are required');
    }

    try {
      const oauthHandler = new InstagramOAuthHandler(appId, appSecret);
      const authUrl = oauthHandler.getAuthUrl();
      
      // Open popup for OAuth
      const popup = window.open(
        authUrl,
        'instagram-oauth',
        'width=600,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for OAuth.');
      }

      // Listen for the OAuth callback
      return new Promise((resolve, reject) => {
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            reject(new Error('OAuth cancelled by user'));
          }
        }, 1000);

        const messageListener = async (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'INSTAGRAM_OAUTH_SUCCESS') {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            popup.close();

            try {
              const { code } = event.data;
              const tokens = await oauthHandler.exchangeCodeForToken(code);
              const longLivedTokens = await oauthHandler.getLongLivedToken(tokens.access_token);
              const { pageAccessToken, instagramAccountId } = await oauthHandler.getInstagramAccountId(longLivedTokens.access_token);
              
              // Store tokens securely (in real app, this would go to backend)
              secureStorage.setItem('instagram-tokens', {
                ...longLivedTokens,
                pageAccessToken,
                instagramAccountId,
                appId,
                appSecret,
              });

              console.log('Instagram connected successfully');
              resolve(true);
            } catch (error) {
              console.error('Instagram OAuth completion failed:', error);
              reject(error);
            }
          } else if (event.data.type === 'INSTAGRAM_OAUTH_ERROR') {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            popup.close();
            reject(new Error(event.data.error));
          }
        };

        window.addEventListener('message', messageListener);
      });
    } catch (error) {
      console.error('Instagram connection failed:', error);
      throw error;
    }
  },

  async disconnect(connection: ConnectionConfig): Promise<void> {
    console.log('Disconnecting Instagram...');
    secureStorage.removeItem('instagram-tokens');
  },

  async test(connection: ConnectionConfig): Promise<boolean> {
    console.log('Testing Instagram connection...');
    
    try {
      const stored = secureStorage.getItem('instagram-tokens');
      if (!stored) return false;

      const tokens = JSON.parse(stored);
      const client = new InstagramApiClient(tokens.pageAccessToken, tokens.instagramAccountId);
      
      return await client.testConnection();
    } catch (error) {
      console.error('Instagram connection test failed:', error);
      return false;
    }
  },

  // Additional methods for Instagram functionality
  async getPosts(limit: number = 10) {
    const stored = localStorage.getItem('instagram-tokens');
    if (!stored) throw new Error('Instagram not connected');

    const tokens = JSON.parse(stored);
    const client = new InstagramApiClient(tokens.pageAccessToken, tokens.instagramAccountId);
    
    return await client.getPosts(limit);
  },

  async postImage(imageUrl: string, caption?: string) {
    const stored = localStorage.getItem('instagram-tokens');
    if (!stored) throw new Error('Instagram not connected');

    const tokens = JSON.parse(stored);
    const client = new InstagramApiClient(tokens.pageAccessToken, tokens.instagramAccountId);
    
    const container = await client.createMediaContainer(imageUrl, caption);
    return await client.publishMedia(container.id);
  },

  async postCarousel(imageUrls: string[], caption?: string) {
    const stored = localStorage.getItem('instagram-tokens');
    if (!stored) throw new Error('Instagram not connected');

    const tokens = JSON.parse(stored);
    const client = new InstagramApiClient(tokens.pageAccessToken, tokens.instagramAccountId);
    
    return await client.createCarouselPost(imageUrls, caption);
  },

  async getAccountInfo() {
    const stored = localStorage.getItem('instagram-tokens');
    if (!stored) throw new Error('Instagram not connected');

    const tokens = JSON.parse(stored);
    const client = new InstagramApiClient(tokens.pageAccessToken, tokens.instagramAccountId);
    
    return await client.getAccountInfo();
  },
};
