
import { ConnectionConfig } from '@/types/platform';
import { LinkedInApiClient } from './apiClient';
import { LinkedInOAuthHandler } from './oauthHandler';
import SecureStorage from '@/lib/security/SecureStorage';
const secureStorage = SecureStorage.getInstance();

export const linkedinHandler = {
  async connect(credentials: Record<string, string>): Promise<boolean> {
    try {
      console.log('Connecting to LinkedIn...');
      
      const { clientId, clientSecret } = credentials;
      
      if (!clientId || !clientSecret) {
        throw new Error('LinkedIn Client ID and Client Secret are required');
      }

      // Store credentials for OAuth flow
      secureStorage.setItem('linkedin-oauth-credentials', {
        clientId,
        clientSecret
      }));

      // Initialize OAuth handler
      const oauthHandler = new LinkedInOAuthHandler(clientId, clientSecret);
      
      // Start OAuth flow
      const authUrl = oauthHandler.getAuthUrl();
      console.log('Redirecting to LinkedIn OAuth:', authUrl);
      
      // Open OAuth in popup or redirect
      window.open(authUrl, 'linkedin-oauth', 'width=600,height=600,scrollbars=yes,resizable=yes');
      
      // In a real implementation, you'd handle the callback and token exchange
      // For now, we'll simulate success
      return true;
    } catch (error) {
      console.error('LinkedIn connection failed:', error);
      throw error;
    }
  },

  async disconnect(connection: ConnectionConfig): Promise<void> {
    try {
      console.log('Disconnecting from LinkedIn...');
      
      // Clean up stored credentials and tokens
      secureStorage.removeItem('linkedin-oauth-credentials');
      secureStorage.removeItem('linkedin-access-token');
      
      console.log('LinkedIn disconnected successfully');
    } catch (error) {
      console.error('LinkedIn disconnect failed:', error);
      throw error;
    }
  },

  async test(connection: ConnectionConfig): Promise<boolean> {
    try {
      console.log('Testing LinkedIn connection...');
      
      const accessToken = secureStorage.getItem('linkedin-access-token');
      if (!accessToken) {
        console.log('No LinkedIn access token found');
        return false;
      }

      const client = new LinkedInApiClient(accessToken);
      const isValid = await client.testConnection();
      
      console.log('LinkedIn connection test result:', isValid);
      return isValid;
    } catch (error) {
      console.error('LinkedIn connection test failed:', error);
      return false;
    }
  },

  async executeAction(connection: ConnectionConfig, action: string, parameters: Record<string, any>): Promise<any> {
    try {
      console.log('Executing LinkedIn action:', action, parameters);
      
      const accessToken = localStorage.getItem('linkedin-access-token');
      if (!accessToken) {
        throw new Error('No LinkedIn access token available');
      }

      const client = new LinkedInApiClient(accessToken);
      
      switch (action) {
        case 'getProfile':
          return await client.getProfile();
          
        case 'getEmail':
          return await client.getEmail();
          
        case 'sharePost':
          return await client.sharePost({
            lifecycleState: 'PUBLISHED',
            specificContent: {
              'com.linkedin.ugc.ShareContent': {
                shareCommentary: {
                  text: parameters.text || ''
                },
                shareMediaCategory: 'NONE'
              }
            },
            visibility: {
              'com.linkedin.ugc.MemberNetworkVisibility': parameters.visibility || 'PUBLIC'
            }
          });
          
        case 'searchOrganizations':
          return await client.searchOrganizations(parameters.vanityName || '');
          
        default:
          throw new Error(`Unknown LinkedIn action: ${action}`);
      }
    } catch (error) {
      console.error('LinkedIn action execution failed:', error);
      throw error;
    }
  }
};
