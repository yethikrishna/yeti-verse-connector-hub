
import { supabase } from '@/integrations/supabase/client';
import { ConnectionConfig } from '@/types/platform';

export interface SupabaseConnection {
  id: string;
  user_id: string;
  platform_id: string;
  platform_name: string;
  credentials: Record<string, any>;
  settings: Record<string, any>;
  is_active: boolean;
  last_connected: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExecutionLog {
  id: string;
  user_id: string;
  platform_id: string;
  action: string;
  request_data: Record<string, any> | null;
  response_data: Record<string, any> | null;
  status: 'success' | 'error' | 'pending';
  error_message: string | null;
  execution_time_ms: number | null;
  created_at: string;
}

export interface OAuthState {
  id: string;
  user_id: string;
  platform_id: string;
  state_token: string;
  redirect_uri: string | null;
  expires_at: string;
  created_at: string;
}

// Helper function to safely convert Json to Record<string, any>
const jsonToRecord = (json: any): Record<string, any> => {
  if (typeof json === 'object' && json !== null && !Array.isArray(json)) {
    return json as Record<string, any>;
  }
  return {};
};

// Helper function to safely cast status to the expected union type
const castStatus = (status: string): 'success' | 'error' | 'pending' => {
  if (status === 'success' || status === 'error' || status === 'pending') {
    return status;
  }
  return 'pending'; // fallback to pending if status is not one of the expected values
};

export class ConnectionService {
  static async getUserConnections(userId: string): Promise<SupabaseConnection[]> {
    try {
      const { data, error } = await supabase
        .from('user_connections')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user connections:', error);
        throw new Error(`Failed to fetch connections: ${error.message}`);
      }

      return data.map(row => ({
        id: row.id,
        user_id: row.user_id,
        platform_id: row.platform_id,
        platform_name: row.platform_name,
        credentials: jsonToRecord(row.credentials),
        settings: jsonToRecord(row.settings),
        is_active: row.is_active,
        last_connected: row.last_connected,
        created_at: row.created_at,
        updated_at: row.updated_at
      }));
    } catch (error) {
      console.error('Database error in getUserConnections:', error);
      // Fallback to empty array if table doesn't exist yet
      return [];
    }
  }

  static async saveConnection(userId: string, connection: ConnectionConfig, platformName: string): Promise<SupabaseConnection> {
    try {
      const connectionData = {
        user_id: userId,
        platform_id: connection.platformId,
        platform_name: platformName,
        credentials: connection.credentials,
        settings: connection.settings,
        is_active: connection.isActive,
        last_connected: connection.lastConnected?.toISOString() || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_connections')
        .upsert(connectionData, {
          onConflict: 'user_id,platform_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving connection:', error);
        throw new Error(`Failed to save connection: ${error.message}`);
      }

      return {
        id: data.id,
        user_id: data.user_id,
        platform_id: data.platform_id,
        platform_name: data.platform_name,
        credentials: jsonToRecord(data.credentials),
        settings: jsonToRecord(data.settings),
        is_active: data.is_active,
        last_connected: data.last_connected,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Database error in saveConnection:', error);
      // Fallback to mock data if table doesn't exist yet
      return {
        id: crypto.randomUUID(),
        user_id: userId,
        platform_id: connection.platformId,
        platform_name: platformName,
        credentials: connection.credentials,
        settings: connection.settings,
        is_active: connection.isActive,
        last_connected: connection.lastConnected?.toISOString() || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  }

  static async deactivateConnection(userId: string, platformId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_connections')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('platform_id', platformId);

      if (error) {
        console.error('Error deactivating connection:', error);
        throw new Error(`Failed to deactivate connection: ${error.message}`);
      }
    } catch (error) {
      console.error('Database error in deactivateConnection:', error);
      // Ignore error if table doesn't exist yet
    }
  }

  static async logExecution(
    userId: string,
    platformId: string,
    action: string,
    requestData?: any,
    responseData?: any,
    status: 'success' | 'error' | 'pending' = 'pending',
    errorMessage?: string,
    executionTimeMs?: number
  ): Promise<ExecutionLog> {
    try {
      const logData = {
        user_id: userId,
        platform_id: platformId,
        action,
        request_data: requestData || null,
        response_data: responseData || null,
        status,
        error_message: errorMessage || null,
        execution_time_ms: executionTimeMs || null
      };

      const { data, error } = await supabase
        .from('mcp_execution_logs')
        .insert(logData)
        .select()
        .single();

      if (error) {
        console.error('Error logging execution:', error);
        throw new Error(`Failed to log execution: ${error.message}`);
      }

      return {
        id: data.id,
        user_id: data.user_id,
        platform_id: data.platform_id,
        action: data.action,
        request_data: data.request_data,
        response_data: data.response_data,
        status: castStatus(data.status),
        error_message: data.error_message,
        execution_time_ms: data.execution_time_ms,
        created_at: data.created_at
      };
    } catch (error) {
      console.error('Database error in logExecution:', error);
      // Fallback to mock data if table doesn't exist yet
      return {
        id: crypto.randomUUID(),
        user_id: userId,
        platform_id: platformId,
        action,
        request_data: requestData || null,
        response_data: responseData || null,
        status,
        error_message: errorMessage || null,
        execution_time_ms: executionTimeMs || null,
        created_at: new Date().toISOString()
      };
    }
  }

  static async getExecutionLogs(userId: string, platformId?: string, limit: number = 50): Promise<ExecutionLog[]> {
    try {
      let query = supabase
        .from('mcp_execution_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (platformId) {
        query = query.eq('platform_id', platformId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching execution logs:', error);
        throw new Error(`Failed to fetch execution logs: ${error.message}`);
      }

      return data.map(row => ({
        id: row.id,
        user_id: row.user_id,
        platform_id: row.platform_id,
        action: row.action,
        request_data: row.request_data,
        response_data: row.response_data,
        status: castStatus(row.status),
        error_message: row.error_message,
        execution_time_ms: row.execution_time_ms,
        created_at: row.created_at
      }));
    } catch (error) {
      console.error('Database error in getExecutionLogs:', error);
      return [];
    }
  }

  static async createOAuthState(
    userId: string,
    platformId: string,
    stateToken: string,
    redirectUri?: string
  ): Promise<OAuthState> {
    try {
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
      
      const oauthData = {
        user_id: userId,
        platform_id: platformId,
        state_token: stateToken,
        redirect_uri: redirectUri || null,
        expires_at: expiresAt.toISOString()
      };

      const { data, error } = await supabase
        .from('oauth_states')
        .insert(oauthData)
        .select()
        .single();

      if (error) {
        console.error('Error creating OAuth state:', error);
        throw new Error(`Failed to create OAuth state: ${error.message}`);
      }

      return {
        id: data.id,
        user_id: data.user_id,
        platform_id: data.platform_id,
        state_token: data.state_token,
        redirect_uri: data.redirect_uri,
        expires_at: data.expires_at,
        created_at: data.created_at
      };
    } catch (error) {
      console.error('Database error in createOAuthState:', error);
      // Fallback to mock data if table doesn't exist yet
      return {
        id: crypto.randomUUID(),
        user_id: userId,
        platform_id: platformId,
        state_token: stateToken,
        redirect_uri: redirectUri || null,
        expires_at: new Date(Date.now() + 3600000).toISOString(),
        created_at: new Date().toISOString()
      };
    }
  }

  static async validateOAuthState(stateToken: string): Promise<OAuthState | null> {
    try {
      const { data, error } = await supabase
        .from('oauth_states')
        .select('*')
        .eq('state_token', stateToken)
        .gte('expires_at', new Date().toISOString())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        console.error('Error validating OAuth state:', error);
        throw new Error(`Failed to validate OAuth state: ${error.message}`);
      }

      return {
        id: data.id,
        user_id: data.user_id,
        platform_id: data.platform_id,
        state_token: data.state_token,
        redirect_uri: data.redirect_uri,
        expires_at: data.expires_at,
        created_at: data.created_at
      };
    } catch (error) {
      console.error('Database error in validateOAuthState:', error);
      return null;
    }
  }

  static async cleanupExpiredOAuthStates(): Promise<void> {
    try {
      const { error } = await supabase
        .rpc('cleanup_expired_oauth_states');

      if (error) {
        console.error('Error cleaning up expired OAuth states:', error);
        throw new Error(`Failed to cleanup expired OAuth states: ${error.message}`);
      }
    } catch (error) {
      console.error('Database error in cleanupExpiredOAuthStates:', error);
      // Ignore error if function doesn't exist yet
    }
  }
}
