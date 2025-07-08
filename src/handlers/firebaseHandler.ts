
import SecureStorage from '@/lib/security/SecureStorage';
import { firebaseService } from '@/lib/firebase/firebaseService';
import { ConnectionConfig } from '@/types/platform';

export const firebaseHandler = {
  async connect(credentials: Record<string, string>): Promise<boolean> {
    try {
      console.log('Connecting to Firebase...');
      
      if (!credentials.projectId || !credentials.apiKey) {
        throw new Error('Firebase Project ID and API Key are required');
      }

      const config = {
        projectId: credentials.projectId,
        apiKey: credentials.apiKey,
        authDomain: credentials.authDomain,
        databaseURL: credentials.databaseURL,
        storageBucket: credentials.storageBucket
      };

      // Test the connection
      const isValid = await firebaseService.testConnection(config);
      
      if (isValid) {
        console.log('Firebase connection successful');
        // Store credentials securely
        await secureStorage.setItem(`firebase_${credentials.projectId}_credentials`, JSON.stringify(credentials));
        return true;
      } else {
        console.error('Firebase connection failed: Invalid credentials');
        return false;
      }
    } catch (error) {
      console.error('Firebase connection error:', error);
      return false;
    }
  },

  async disconnect(connection: ConnectionConfig): Promise<void> {
    console.log('Disconnecting from Firebase...');
    // No specific cleanup needed for Firebase REST API
  },

  async test(connection: ConnectionConfig): Promise<boolean> {
    try {
      const config = {
        projectId: connection.credentials.projectId,
        apiKey: connection.credentials.apiKey,
        authDomain: connection.credentials.authDomain,
        databaseURL: connection.credentials.databaseURL,
        storageBucket: connection.credentials.storageBucket
      };
      
      if (!config.projectId || !config.apiKey) return false;
      
      return await firebaseService.testConnection(config);
    } catch (error) {
      console.error('Firebase test connection error:', error);
      return false;
    }
  },

  // Firebase-specific operations
  async firestoreRead(connection: ConnectionConfig, collection: string, documentId?: string): Promise<any> {
    const config = {
      projectId: connection.credentials.projectId,
      apiKey: connection.credentials.apiKey,
      authDomain: connection.credentials.authDomain,
      databaseURL: connection.credentials.databaseURL,
      storageBucket: connection.credentials.storageBucket
    };
    
    const service = firebaseService.create(config);
    return await service.firestoreRead({ collection, documentId });
  },

  async firestoreWrite(connection: ConnectionConfig, collection: string, data: any, documentId?: string): Promise<any> {
    const config = {
      projectId: connection.credentials.projectId,
      apiKey: connection.credentials.apiKey,
      authDomain: connection.credentials.authDomain,
      databaseURL: connection.credentials.databaseURL,
      storageBucket: connection.credentials.storageBucket
    };
    
    const service = firebaseService.create(config);
    return await service.firestoreWrite({ collection, documentId, data });
  },

  async realtimeDBRead(connection: ConnectionConfig, path: string): Promise<any> {
    const config = {
      projectId: connection.credentials.projectId,
      apiKey: connection.credentials.apiKey,
      authDomain: connection.credentials.authDomain,
      databaseURL: connection.credentials.databaseURL,
      storageBucket: connection.credentials.storageBucket
    };
    
    const service = firebaseService.create(config);
    return await service.realtimeDBRead({ path });
  },

  async realtimeDBWrite(connection: ConnectionConfig, path: string, data: any): Promise<any> {
    const config = {
      projectId: connection.credentials.projectId,
      apiKey: connection.credentials.apiKey,
      authDomain: connection.credentials.authDomain,
      databaseURL: connection.credentials.databaseURL,
      storageBucket: connection.credentials.storageBucket
    };
    
    const service = firebaseService.create(config);
    return await service.realtimeDBWrite({ path, data });
  },

  async executeCloudFunction(connection: ConnectionConfig, functionName: string, payload?: any, region?: string): Promise<any> {
    const config = {
      projectId: connection.credentials.projectId,
      apiKey: connection.credentials.apiKey,
      authDomain: connection.credentials.authDomain,
      databaseURL: connection.credentials.databaseURL,
      storageBucket: connection.credentials.storageBucket
    };
    
    const service = firebaseService.create(config);
    return await service.executeCloudFunction({ functionName, payload, region });
  }
};
