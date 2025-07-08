
import SecureStorage from '@/lib/security/SecureStorage';
import { netlifyService } from '@/lib/netlify/netlifyService';
import { ConnectionConfig } from '@/types/platform';

export const netlifyHandler = {
  async connect(credentials: Record<string, string>): Promise<boolean> {
    try {
      console.log('Connecting to Netlify...');
      
      if (!credentials.accessToken) {
        throw new Error('Netlify Access Token is required');
      }

      // Test the connection by fetching user info
      const isValid = await netlifyService.testConnection(credentials.accessToken);
      
      if (isValid) {
        console.log('Netlify connection successful');
        // Store credentials securely
        await secureStorage.setItem('netlify_credentials', JSON.stringify(credentials));
        return true;
      } else {
        console.error('Netlify connection failed: Invalid credentials');
        return false;
      }
    } catch (error) {
      console.error('Netlify connection error:', error);
      return false;
    }
  },

  async disconnect(connection: ConnectionConfig): Promise<void> {
    console.log('Disconnecting from Netlify...');
    // No specific cleanup needed for Netlify
  },

  async test(connection: ConnectionConfig): Promise<boolean> {
    try {
      const accessToken = connection.credentials.accessToken;
      if (!accessToken) return false;
      
      return await netlifyService.testConnection(accessToken);
    } catch (error) {
      console.error('Netlify test connection error:', error);
      return false;
    }
  }
};
