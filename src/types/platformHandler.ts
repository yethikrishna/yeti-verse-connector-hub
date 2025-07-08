import { IMcpRequest, IMcpResponse } from '@/lib/mcp/IMcpServer';
import { Platform } from './platform';
import { ConnectionConfig } from './connection';

/**
 * Standard interface for all platform handlers
 * Ensures consistent implementation across different platforms
 */
export interface IPlatformHandler {
  /**
   * Check if the handler supports the given platform ID
   * @param platformId - The platform ID to check
   * @returns True if supported, false otherwise
   */
  supportsPlatform(platformId: string): boolean;

  /**
   * Execute a request/action on the platform
   * @param request - The MCP request containing action and parameters
   * @param connectedPlatforms - List of user's connected platforms
   * @returns The MCP response with action result
   */
  executeRequest(request: IMcpRequest, connectedPlatforms: Platform[]): Promise<IMcpResponse>;

  /**
   * Handle OAuth callback for the platform
   * @param code - The authorization code from OAuth flow
   * @returns Promise resolving when callback is processed
   */
  handleCallback?(code: string): Promise<void>;

  /**
   * Connect to the platform using credentials
   * @param credentials - The connection credentials
   * @returns True if connection successful, false otherwise
   */
  connect?(credentials: ConnectionConfig): Promise<boolean>;

  /**
   * Disconnect from the platform
   * @param connection - The existing connection
   * @returns Promise resolving when disconnection is processed
   */
  disconnect?(connection: ConnectionConfig): Promise<void>;

  /**
   * Get execution history for the platform
   * @param userId - The user ID
   * @param limit - Maximum number of records to return
   * @param platform - Optional platform filter
   * @returns Array of execution records
   */
  getExecutionHistory?(userId: string, limit?: number, platform?: string): Promise<any[]>;

  /**
   * Get the server type for the platform
   * @returns The server type string
   */
  getServerType(): string;
}

/**
 * Abstract base class implementing IPlatformHandler
 * Provides default implementations for optional methods
 */
export abstract class BasePlatformHandler implements IPlatformHandler {
  abstract supportsPlatform(platformId: string): boolean;
  abstract executeRequest(request: IMcpRequest, connectedPlatforms: Platform[]): Promise<IMcpResponse>;
  abstract getServerType(): string;

  async handleCallback?(code: string): Promise<void> {
    throw new Error(`handleCallback not implemented for ${this.getServerType()}`);
  }

  async connect?(credentials: ConnectionConfig): Promise<boolean> {
    throw new Error(`connect not implemented for ${this.getServerType()}`);
  }

  async disconnect?(connection: ConnectionConfig): Promise<void> {
    throw new Error(`disconnect not implemented for ${this.getServerType()}`);
  }

  async getExecutionHistory?(userId: string, limit?: number, platform?: string): Promise<any[]> {
    console.warn(`getExecutionHistory not implemented for ${this.getServerType()}`);
    return [];
  }
}