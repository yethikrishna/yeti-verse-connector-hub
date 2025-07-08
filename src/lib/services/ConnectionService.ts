import { createClient } from '@supabase/supabase-js';
import { Platform } from '@/types/platform';
import { Database } from '@/lib/supabase/database.types';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

class ConnectionService {
  /**
   * Get all connected platforms for a user
   * @param userId - The ID of the user
   * @returns Array of connected platforms
   */
  static async getUserConnectedPlatforms(userId: string): Promise<Platform[]> {
    try {
      const { data, error } = await supabase
        .from('connections')
        .select('*
          ,platforms(name, display_name, icon)
        ')
        .eq('user_id', userId)
        .eq('is_connected', true);

      if (error) throw error;

      if (!data || data.length === 0) return [];

      // Map to Platform type
      return data.map(item => ({
        platformId: item.platform_id,
        name: item.platforms?.display_name || item.platform_id,
        icon: item.platforms?.icon || 'default-icon',
        isConnected: true,
        metadata: item.metadata ? JSON.parse(item.metadata) : {},
        connectedAt: new Date(item.connected_at),
        lastUsedAt: item.last_used_at ? new Date(item.last_used_at) : null
      }));
    } catch (error) {
      console.error('Error fetching user connections:', error);
      return [];
    }
  }

  /**
   * Get a specific connection for a user
   * @param userId - The ID of the user
   * @param platformId - The platform ID
   * @returns The connection if exists, null otherwise
   */
  static async getUserConnection(
    userId: string,
    platformId: string
  ): Promise<Platform | null> {
    try {
      const { data, error } = await supabase
        .from('connections')
        .select('*
          ,platforms(name, display_name, icon)
        ')
        .eq('user_id', userId)
        .eq('platform_id', platformId)
        .eq('is_connected', true)
        .single();

      if (error || !data) return null;

      return {
        platformId: data.platform_id,
        name: data.platforms?.display_name || data.platform_id,
        icon: data.platforms?.icon || 'default-icon',
        isConnected: true,
        metadata: data.metadata ? JSON.parse(data.metadata) : {},
        connectedAt: new Date(data.connected_at),
        lastUsedAt: data.last_used_at ? new Date(data.last_used_at) : null
      };
    } catch (error) {
      console.error(`Error fetching ${platformId} connection:`, error);
      return null;
    }
  }

  /**
   * Update connection metadata
   * @param userId - The ID of the user
   * @param platformId - The platform ID
   * @param metadata - The metadata to update
   * @returns True if successful, false otherwise
   */
  static async updateConnectionMetadata(
    userId: string,
    platformId: string,
    metadata: Record<string, any>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('connections')
        .update({
          metadata: JSON.stringify(metadata),
          last_used_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('platform_id', platformId);

      return !error;
    } catch (error) {
      console.error(`Error updating ${platformId} metadata:`, error);
      return false;
    }
  }

  /**
   * Disconnect a platform
   * @param userId - The ID of the user
   * @param platformId - The platform ID
   * @returns True if successful, false otherwise
   */
  static async disconnectPlatform(
    userId: string,
    platformId: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('connections')
        .update({
          is_connected: false,
          access_token: null,
          refresh_token: null,
          expires_at: null,
          disconnected_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('platform_id', platformId);

      return !error;
    } catch (error) {
      console.error(`Error disconnecting ${platformId}:`, error);
      return false;
    }
  }
}

export default ConnectionService;