
import { ConnectionConfig } from "@/types/platform";
import { IMcpRequest, IMcpResponse } from '@/lib/mcp/IMcpServer';
import { Platform } from '@/types/platform';
import { IPlatformHandler, BasePlatformHandler } from '@/types/platformHandler';

interface NotionDatabase {
  object: 'database';
  id: string;
  created_time: string;
  created_by: {
    object: 'user';
    id: string;
  };
  last_edited_time: string;
  last_edited_by: {
    object: 'user';
    id: string;
  };
  title: Array<{
    type: 'text';
    text: {
      content: string;
      link?: {
        url: string;
      };
    };
    annotations: {
      bold: boolean;
      italic: boolean;
      strikethrough: boolean;
      underline: boolean;
      code: boolean;
      color: string;
    };
    plain_text: string;
    href?: string;
  }>;
  description: any[];
  icon?: {
    type: 'emoji' | 'external' | 'file';
    emoji?: string;
    external?: {
      url: string;
    };
    file?: {
      url: string;
      expiry_time: string;
    };
  };
  cover?: {
    type: 'external' | 'file';
    external?: {
      url: string;
    };
    file?: {
      url: string;
      expiry_time: string;
    };
  };
  properties: Record<string, any>;
  parent: {
    type: 'page_id' | 'workspace';
    page_id?: string;
    workspace?: boolean;
  };
  url: string;
  archived: boolean;
  is_inline: boolean;
  public_url?: string;
}

interface NotionPage {
  object: 'page';
  id: string;
  created_time: string;
  created_by: {
    object: 'user';
    id: string;
  };
  last_edited_time: string;
  last_edited_by: {
    object: 'user';
    id: string;
  };
  cover?: {
    type: 'external' | 'file';
    external?: {
      url: string;
    };
    file?: {
      url: string;
      expiry_time: string;
    };
  };
  icon?: {
    type: 'emoji' | 'external' | 'file';
    emoji?: string;
    external?: {
      url: string;
    };
    file?: {
      url: string;
      expiry_time: string;
    };
  };
  parent: {
    type: 'database_id' | 'page_id' | 'workspace';
    database_id?: string;
    page_id?: string;
    workspace?: boolean;
  };
  archived: boolean;
  properties: Record<string, any>;
  url: string;
  public_url?: string;
}

interface NotionBlock {
  object: 'block';
  id: string;
  parent: {
    type: 'database_id' | 'page_id' | 'workspace' | 'block_id';
    database_id?: string;
    page_id?: string;
    workspace?: boolean;
    block_id?: string;
  };
  created_time: string;
  created_by: {
    object: 'user';
    id: string;
  };
  last_edited_time: string;
  last_edited_by: {
    object: 'user';
    id: string;
  };
  archived: boolean;
  has_children: boolean;
  type: string;
  [key: string]: any; // Dynamic type properties
}

interface NotionUser {
  object: 'user';
  id: string;
  name?: string;
  avatar_url?: string;
  type: 'person' | 'bot';
  person?: {
    email: string;
  };
  bot?: {
    owner: {
      type: 'workspace' | 'user';
      workspace?: boolean;
      user?: {
        object: 'user';
        id: string;
      };
    };
    workspace_name?: string;
  };
}

export class NotionHandler extends BasePlatformHandler implements IPlatformHandler {
  private baseUrl = 'https://api.notion.com/v1';
  private readonly notionVersion = '2022-06-28';

  supportsPlatform(platformId: string): boolean {
    return platformId.toLowerCase() === 'notion';
  }

  async connect(credentials: Record<string, string>): Promise<boolean> {
    console.log('Notion connect called');
    
    if (!credentials.access_token && !credentials.code) {
      throw new Error('Missing Notion access token or OAuth code. You need Notion Integration token.');
    }

    try {
      const token = credentials.access_token;
      if (!token) {
        throw new Error('OAuth flow not yet fully implemented. Please provide an access token.');
      }

      // Verify the token by getting the bot user
      const response = await fetch(`${this.baseUrl}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Notion-Version': this.notionVersion
        }
      });

      if (!response.ok) {
        let errorMessage = 'Invalid Notion access token or connection failed';
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          console.log('Could not parse Notion error response');
        }
        
        if (response.status === 401) {
          errorMessage = 'Invalid or expired Notion integration token. Please check your token.';
        } else if (response.status === 403) {
          errorMessage = 'Notion API access forbidden. Please ensure your integration has the required permissions.';
        }
        
        throw new Error(errorMessage);
      }

      const userData = await response.json();
      console.log('Notion connection successful!', {
        id: userData.id,
        name: userData.name,
        type: userData.type,
        workspace_name: userData.bot?.workspace_name
      });
      
      return true;
    } catch (error) {
      console.error('Notion connection error:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred while connecting to Notion. Please try again.');
      }
    }
  }

  async test(config: ConnectionConfig): Promise<boolean> {
    console.log("Testing Notion connection...");
    
    try {
      const token = config.credentials.access_token;
      if (!token) return false;

      const response = await fetch(`${this.baseUrl}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Notion-Version': this.notionVersion
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Notion test failed:', error);
      return false;
    }
  }

  async disconnect(config: ConnectionConfig): Promise<boolean> {
    console.log("Disconnecting from Notion...");
    
    try {
      // Notion doesn't provide a direct token revocation endpoint
      // The integration will need to be removed manually from the Notion workspace
      console.log('Notion integration should be removed manually from the workspace if needed');
      return true;
    } catch (error) {
      console.error('Notion disconnect error:', error);
      return false;
    }
  }

  async executeRequest(request: IMcpRequest, connectedPlatforms: Platform[]): Promise<IMcpResponse> {
    try {
      const platform = connectedPlatforms.find(p => p.id === 'notion' && p.isConnected);
      if (!platform) {
        return {
          success: false,
          error: 'Notion is not connected',
          data: null
        };
      }

      const connectionConfig = this.getConnectionConfig(platform);
      if (!connectionConfig?.credentials.access_token) {
        return {
          success: false,
          error: 'Notion access token not found',
          data: null
        };
      }

      const token = connectionConfig.credentials.access_token;

      switch (request.action) {
        case 'list_databases':
          return {
            success: true,
            error: null,
            data: await this.listDatabases(token, request.params.options)
          };
        
        case 'query_database':
          return {
            success: true,
            error: null,
            data: await this.queryDatabase(token, request.params.database_id, request.params.filter, request.params.sorts)
          };
        
        case 'create_page':
          return {
            success: true,
            error: null,
            data: await this.createPage(token, request.params)
          };
        
        case 'get_page':
          return {
            success: true,
            error: null,
            data: await this.getPage(token, request.params.page_id)
          };
        
        case 'update_page':
          return {
            success: true,
            error: null,
            data: await this.updatePage(token, request.params.page_id, request.params.properties)
          };
        
        case 'get_block_children':
          return {
            success: true,
            error: null,
            data: await this.getBlockChildren(token, request.params.block_id, request.params.options)
          };
        
        case 'append_block_children':
          return {
            success: true,
            error: null,
            data: await this.appendBlockChildren(token, request.params.block_id, request.params.children)
          };
        
        case 'create_database':
          return {
            success: true,
            error: null,
            data: await this.createDatabase(token, request.params)
          };
        
        default:
          return {
            success: false,
            error: `Unsupported Notion action: ${request.action}`,
            data: null
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null
      };
    }
  }

  // Notion API Methods

  async listDatabases(
    token: string,
    options: {
      start_cursor?: string;
      page_size?: number;
    } = {}
  ): Promise<{ object: 'list'; results: NotionDatabase[]; next_cursor?: string; has_more: boolean }> {
    try {
      const { start_cursor, page_size = 100 } = options;

      const params = new URLSearchParams({
        page_size: page_size.toString()
      });

      if (start_cursor) {
        params.append('start_cursor', start_cursor);
      }

      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Notion-Version': this.notionVersion
        },
        body: JSON.stringify({
          filter: {
            value: 'database',
            property: 'object'
          },
          page_size,
          start_cursor
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Notion API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Notion list databases failed:', error);
      throw error;
    }
  }

  async queryDatabase(
    token: string,
    databaseId: string,
    filter?: any,
    sorts?: any[],
    options: {
      start_cursor?: string;
      page_size?: number;
    } = {}
  ): Promise<{ object: 'list'; results: NotionPage[]; next_cursor?: string; has_more: boolean }> {
    try {
      const { start_cursor, page_size = 100 } = options;

      const body: any = {
        page_size
      };

      if (filter) body.filter = filter;
      if (sorts) body.sorts = sorts;
      if (start_cursor) body.start_cursor = start_cursor;

      const response = await fetch(`${this.baseUrl}/databases/${databaseId}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Notion-Version': this.notionVersion
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Notion API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Notion query database failed:', error);
      throw error;
    }
  }

  async createPage(
    token: string,
    pageData: {
      parent: {
        database_id?: string;
        page_id?: string;
        type?: 'database_id' | 'page_id';
      };
      properties: Record<string, any>;
      children?: NotionBlock[];
      icon?: {
        type: 'emoji' | 'external';
        emoji?: string;
        external?: {
          url: string;
        };
      };
      cover?: {
        type: 'external';
        external: {
          url: string;
        };
      };
    }
  ): Promise<NotionPage> {
    try {
      const response = await fetch(`${this.baseUrl}/pages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Notion-Version': this.notionVersion
        },
        body: JSON.stringify(pageData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Notion API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Notion create page failed:', error);
      throw error;
    }
  }

  async getPage(token: string, pageId: string): Promise<NotionPage> {
    try {
      const response = await fetch(`${this.baseUrl}/pages/${pageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Notion-Version': this.notionVersion
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Notion API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Notion get page failed:', error);
      throw error;
    }
  }

  async updatePage(
    token: string,
    pageId: string,
    properties: Record<string, any>
  ): Promise<NotionPage> {
    try {
      const response = await fetch(`${this.baseUrl}/pages/${pageId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Notion-Version': this.notionVersion
        },
        body: JSON.stringify({ properties })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Notion API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Notion update page failed:', error);
      throw error;
    }
  }

  async getBlockChildren(
    token: string,
    blockId: string,
    options: {
      start_cursor?: string;
      page_size?: number;
    } = {}
  ): Promise<{ object: 'list'; results: NotionBlock[]; next_cursor?: string; has_more: boolean }> {
    try {
      const { start_cursor, page_size = 100 } = options;

      const params = new URLSearchParams({
        page_size: page_size.toString()
      });

      if (start_cursor) {
        params.append('start_cursor', start_cursor);
      }

      const response = await fetch(`${this.baseUrl}/blocks/${blockId}/children?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Notion-Version': this.notionVersion
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Notion API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Notion get block children failed:', error);
      throw error;
    }
  }

  async appendBlockChildren(
    token: string,
    blockId: string,
    children: NotionBlock[]
  ): Promise<{ object: 'list'; results: NotionBlock[]; next_cursor?: string; has_more: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/blocks/${blockId}/children`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Notion-Version': this.notionVersion
        },
        body: JSON.stringify({ children })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Notion API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Notion append block children failed:', error);
      throw error;
    }
  }

  async createDatabase(
    token: string,
    databaseData: {
      parent: {
        type: 'page_id';
        page_id: string;
      };
      title: Array<{
        type: 'text';
        text: {
          content: string;
        };
      }>;
      properties: Record<string, any>;
      icon?: {
        type: 'emoji' | 'external';
        emoji?: string;
        external?: {
          url: string;
        };
      };
      cover?: {
        type: 'external';
        external: {
          url: string;
        };
      };
    }
  ): Promise<NotionDatabase> {
    try {
      const response = await fetch(`${this.baseUrl}/databases`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Notion-Version': this.notionVersion
        },
        body: JSON.stringify(databaseData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Notion API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Notion create database failed:', error);
      throw error;
    }
  }

  // Helper method to get connection config from Platform
  private getConnectionConfig(platform: Platform): ConnectionConfig | null {
    // This is a placeholder - in real implementation, you'd fetch the actual connection config
    // from the platform's stored credentials
    return null;
  }

  async getExecutionHistory(userId: string, limit?: number, platform?: string): Promise<any[]> {
    // Implementation for fetching Notion execution history
    return [];
  }

  getServerType(): string {
    return 'notion';
  }
}

export const notionHandler = new NotionHandler();
