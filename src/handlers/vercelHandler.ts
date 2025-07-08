
import SecureStorage from '@/lib/security/SecureStorage';
import { vercelService } from '@/lib/vercel/vercelService';
import { ConnectionConfig } from '@/types/platform';

export const vercelHandler = {
  async connect(credentials: Record<string, string>): Promise<boolean> {
    try {
      console.log('Connecting to Vercel...');
      
      if (!credentials.accessToken) {
        throw new Error('Vercel Access Token is required');
      }

      // Test the connection by fetching user info
      const isValid = await vercelService.testConnection(credentials.accessToken);
      
      if (isValid) {
        console.log('Vercel connection successful');
        // Store credentials securely
        await secureStorage.setItem('vercel_credentials', JSON.stringify(credentials));
        return true;
      } else {
        console.error('Vercel connection failed: Invalid credentials');
        return false;
      }
    } catch (error) {
      console.error('Vercel connection error:', error);
      return false;
    }
  },

  async disconnect(connection: ConnectionConfig): Promise<void> {
    console.log('Disconnecting from Vercel...');
    // No specific cleanup needed for Vercel
  },

  async test(connection: ConnectionConfig): Promise<boolean> {
    try {
      const accessToken = connection.credentials.accessToken;
      if (!accessToken) return false;
      
      return await vercelService.testConnection(accessToken);
    } catch (error) {
      console.error('Vercel test connection error:', error);
      return false;
    }
  }
};
