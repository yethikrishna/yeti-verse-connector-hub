
import { ConnectionConfig } from "@/types/platform";
import { IMcpRequest, IMcpResponse } from '@/lib/mcp/IMcpServer';
import { Platform } from '@/types/platform';
import { IPlatformHandler, BasePlatformHandler } from '@/types/platformHandler';

interface SlackChannel {
  id: string;
  name: string;
  is_channel: boolean;
  is_group: boolean;
  is_im: boolean;
  is_mpim: boolean;
  is_private: boolean;
  created: number;
  is_archived: boolean;
  is_general: boolean;
  unlinked: number;
  name_normalized: string;
  is_shared: boolean;
  is_ext_shared: boolean;
  is_org_shared: boolean;
  pending_shared: string[];
  is_pending_ext_shared: boolean;
  is_member: boolean;
  is_open: boolean;
  topic: {
    value: string;
    creator: string;
    last_set: number;
  };
  purpose: {
    value: string;
    creator: string;
    last_set: number;
  };
  previous_names: string[];
  num_members?: number;
}

interface SlackUser {
  id: string;
  team_id: string;
  name: string;
  deleted: boolean;
  color: string;
  real_name: string;
  tz: string;
  tz_label: string;
  tz_offset: number;
  profile: {
    title: string;
    phone: string;
    skype: string;
    real_name: string;
    real_name_normalized: string;
    display_name: string;
    display_name_normalized: string;
    status_text: string;
    status_emoji: string;
    status_expiration: number;
    avatar_hash: string;
    email?: string;
    first_name: string;
    last_name: string;
    image_24: string;
    image_32: string;
    image_48: string;
    image_72: string;
    image_192: string;
    image_512: string;
  };
  is_admin: boolean;
  is_owner: boolean;
  is_primary_owner: boolean;
  is_restricted: boolean;
  is_ultra_restricted: boolean;
  is_bot: boolean;
  is_app_user: boolean;
  updated: number;
  has_2fa?: boolean;
}

interface SlackMessage {
  type: string;
  ts: string;
  user?: string;
  bot_id?: string;
  app_id?: string;
  text: string;
  thread_ts?: string;
  reply_count?: number;
  reply_users_count?: number;
  latest_reply?: string;
  reply_users?: string[];
  is_locked?: boolean;
  subscribed?: boolean;
  blocks?: any[];
  attachments?: any[];
  files?: any[];
  upload?: boolean;
  display_as_bot?: boolean;
  reactions?: Array<{
    name: string;
    users: string[];
    count: number;
  }>;
  permalink?: string;
}

interface SlackTeam {
  id: string;
  name: string;
  url: string;
  domain: string;
  email_domain: string;
  icon: {
    image_34: string;
    image_44: string;
    image_68: string;
    image_88: string;
    image_102: string;
    image_132: string;
    image_230: string;
    image_default: boolean;
  };
  enterprise_id?: string;
  enterprise_name?: string;
}

export class SlackHandler extends BasePlatformHandler implements IPlatformHandler {
  private baseUrl = 'https://slack.com/api';

  supportsPlatform(platformId: string): boolean {
    return platformId.toLowerCase() === 'slack';
  }

  async connect(credentials: Record<string, string>): Promise<boolean> {
    console.log('Slack connect called');
    
    if (!credentials.access_token && !credentials.bot_token && !credentials.code) {
      throw new Error('Missing Slack access token, bot token, or OAuth code. You need Slack OAuth 2.0 credentials.');
    }

    try {
      const token = credentials.bot_token || credentials.access_token;
      if (!token) {
        throw new Error('OAuth flow not yet fully implemented. Please provide a bot token or access token.');
      }

      // Verify the token by testing auth
      const response = await fetch(`${this.baseUrl}/auth.test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const authData = await response.json();
      
      if (!authData.ok) {
        let errorMessage = 'Invalid Slack token or connection failed';
        if (authData.error) {
          switch (authData.error) {
            case 'invalid_auth':
              errorMessage = 'Invalid Slack token. Please check your token and try again.';
              break;
            case 'account_inactive':
              errorMessage = 'Slack account is inactive.';
              break;
            case 'token_revoked':
              errorMessage = 'Slack token has been revoked. Please re-authenticate.';
              break;
            case 'no_permission':
              errorMessage = 'Slack token does not have required permissions.';
              break;
            default:
              errorMessage = `Slack API error: ${authData.error}`;
          }
        }
        throw new Error(errorMessage);
      }

      console.log('Slack connection successful!', {
        team: authData.team,
        user: authData.user,
        bot_id: authData.bot_id,
        team_id: authData.team_id,
        user_id: authData.user_id
      });
      
      return true;
    } catch (error) {
      console.error('Slack connection error:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred while connecting to Slack. Please try again.');
      }
    }
  }

  async test(config: ConnectionConfig): Promise<boolean> {
    console.log("Testing Slack connection...");
    
    try {
      const token = config.credentials.bot_token || config.credentials.access_token;
      if (!token) return false;

      const response = await fetch(`${this.baseUrl}/auth.test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) return false;
      
      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Slack test failed:', error);
      return false;
    }
  }

  async disconnect(config: ConnectionConfig): Promise<boolean> {
    console.log("Disconnecting from Slack...");
    
    try {
      const token = config.credentials.bot_token || config.credentials.access_token;
      if (token) {
        // Slack doesn't provide a direct token revocation endpoint for bot tokens
        // The token will need to be revoked manually from the Slack app settings
        console.log('Slack token should be revoked manually from the app settings if needed');
      }
      return true;
    } catch (error) {
      console.error('Slack disconnect error:', error);
      return false;
    }
  }

  async executeRequest(request: IMcpRequest, connectedPlatforms: Platform[]): Promise<IMcpResponse> {
    try {
      const platform = connectedPlatforms.find(p => p.id === 'slack' && p.isConnected);
      if (!platform) {
        return {
          success: false,
          error: 'Slack is not connected',
          data: null
        };
      }

      const connectionConfig = this.getConnectionConfig(platform);
      const token = connectionConfig?.credentials.bot_token || connectionConfig?.credentials.access_token;
      
      if (!token) {
        return {
          success: false,
          error: 'Slack access token not found',
          data: null
        };
      }

      switch (request.action) {
        case 'send_message':
          return {
            success: true,
            error: null,
            data: await this.sendMessage(token, request.params)
          };
        
        case 'get_channels':
          return {
            success: true,
            error: null,
            data: await this.getChannels(token, request.params.options)
          };
        
        case 'get_users':
          return {
            success: true,
            error: null,
            data: await this.getUsers(token)
          };
        
        case 'get_team_info':
          return {
            success: true,
            error: null,
            data: await this.getTeamInfo(token)
          };
        
        case 'get_channel_history':
          return {
            success: true,
            error: null,
            data: await this.getChannelHistory(token, request.params.channel, request.params.options)
          };
        
        case 'upload_file':
          return {
            success: true,
            error: null,
            data: await this.uploadFile(token, request.params)
          };
        
        case 'create_channel':
          return {
            success: true,
            error: null,
            data: await this.createChannel(token, request.params)
          };
        
        case 'join_channel':
          return {
            success: true,
            error: null,
            data: await this.joinChannel(token, request.params.channel)
          };
        
        case 'leave_channel':
          return {
            success: true,
            error: null,
            data: await this.leaveChannel(token, request.params.channel)
          };
        
        default:
          return {
            success: false,
            error: `Unsupported Slack action: ${request.action}`,
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

  // Slack API Methods

  async sendMessage(
    token: string,
    messageData: {
      channel: string;
      text?: string;
      blocks?: any[];
      attachments?: any[];
      thread_ts?: string;
      as_user?: boolean;
      username?: string;
      icon_emoji?: string;
      icon_url?: string;
    }
  ): Promise<SlackMessage> {
    try {
      const response = await fetch(`${this.baseUrl}/chat.postMessage`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      return data.message;
    } catch (error) {
      console.error('Slack send message failed:', error);
      throw error;
    }
  }

  async getChannels(
    token: string,
    options: {
      exclude_archived?: boolean;
      types?: string;
      limit?: number;
      cursor?: string;
    } = {}
  ): Promise<{ channels: SlackChannel[]; response_metadata?: { next_cursor: string } }> {
    try {
      const { 
        exclude_archived = true, 
        types = 'public_channel,private_channel', 
        limit = 100,
        cursor 
      } = options;

      const params = new URLSearchParams({
        exclude_archived: exclude_archived.toString(),
        types,
        limit: limit.toString()
      });

      if (cursor) {
        params.append('cursor', cursor);
      }

      const response = await fetch(`${this.baseUrl}/conversations.list?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(data.error || 'Failed to get channels');
      }

      return {
        channels: data.channels,
        response_metadata: data.response_metadata
      };
    } catch (error) {
      console.error('Slack get channels failed:', error);
      throw error;
    }
  }

  async getUsers(token: string): Promise<{ members: SlackUser[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/users.list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(data.error || 'Failed to get users');
      }

      return { members: data.members };
    } catch (error) {
      console.error('Slack get users failed:', error);
      throw error;
    }
  }

  async getTeamInfo(token: string): Promise<SlackTeam> {
    try {
      const response = await fetch(`${this.baseUrl}/team.info`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(data.error || 'Failed to get team info');
      }

      return data.team;
    } catch (error) {
      console.error('Slack get team info failed:', error);
      throw error;
    }
  }

  async getChannelHistory(
    token: string,
    channel: string,
    options: {
      count?: number;
      latest?: string;
      oldest?: string;
      inclusive?: boolean;
      cursor?: string;
    } = {}
  ): Promise<{ messages: SlackMessage[]; has_more?: boolean; response_metadata?: { next_cursor: string } }> {
    try {
      const { count = 100, latest, oldest, inclusive = false, cursor } = options;

      const params = new URLSearchParams({
        channel,
        limit: count.toString(),
        inclusive: inclusive.toString()
      });

      if (latest) params.append('latest', latest);
      if (oldest) params.append('oldest', oldest);
      if (cursor) params.append('cursor', cursor);

      const response = await fetch(`${this.baseUrl}/conversations.history?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(data.error || 'Failed to get channel history');
      }

      return {
        messages: data.messages,
        has_more: data.has_more,
        response_metadata: data.response_metadata
      };
    } catch (error) {
      console.error('Slack get channel history failed:', error);
      throw error;
    }
  }

  async uploadFile(
    token: string,
    fileData: {
      channels?: string;
      content?: string;
      file?: File | Blob;
      filename?: string;
      filetype?: string;
      initial_comment?: string;
      title?: string;
      thread_ts?: string;
    }
  ): Promise<{ file: any }> {
    try {
      const formData = new FormData();
      
      Object.entries(fileData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'file' && value instanceof File || value instanceof Blob) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const response = await fetch(`${this.baseUrl}/files.upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(data.error || 'Failed to upload file');
      }

      return { file: data.file };
    } catch (error) {
      console.error('Slack upload file failed:', error);
      throw error;
    }
  }

  async createChannel(
    token: string,
    channelData: {
      name: string;
      is_private?: boolean;
    }
  ): Promise<{ channel: SlackChannel }> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations.create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(channelData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(data.error || 'Failed to create channel');
      }

      return { channel: data.channel };
    } catch (error) {
      console.error('Slack create channel failed:', error);
      throw error;
    }
  }

  async joinChannel(token: string, channel: string): Promise<{ channel: SlackChannel }> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations.join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ channel })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(data.error || 'Failed to join channel');
      }

      return { channel: data.channel };
    } catch (error) {
      console.error('Slack join channel failed:', error);
      throw error;
    }
  }

  async leaveChannel(token: string, channel: string): Promise<{ ok: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations.leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ channel })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(data.error || 'Failed to leave channel');
      }

      return { ok: data.ok };
    } catch (error) {
      console.error('Slack leave channel failed:', error);
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
    // Implementation for fetching Slack execution history
    return [];
  }

  getServerType(): string {
    return 'slack';
  }
}

export const slackHandler = new SlackHandler();
