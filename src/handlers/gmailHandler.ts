
import { ConnectionConfig } from "@/types/platform";
import { IPlatformHandler, BasePlatformHandler } from '@/types/platformHandler';
import { IMcpRequest, IMcpResponse } from '@/lib/mcp/IMcpServer';

interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  historyId: string;
  internalDate: string;
  payload: {
    mimeType: string;
    headers: Array<{ name: string; value: string }>;
    body?: { data?: string; size?: number };
    parts?: Array<{
      partId?: string;
      mimeType?: string;
      filename?: string;
      headers?: Array<{ name: string; value: string }>;
      body?: { data?: string; size?: number };
    }>;
  };
  sizeEstimate: number;
  labelIds: string[];
}

interface GmailSearchResult {
  messages: Array<{ id: string; threadId: string }>;
  nextPageToken?: string;
  resultSizeEstimate: number;
}

interface GmailLabel {
  id: string;
  name: string;
  type: 'system' | 'user';
  messageListVisibility?: 'show' | 'hide';
  labelListVisibility?: 'labelShow' | 'labelShowIfUnread' | 'labelHide';
  color?: {
    textColor: string;
    backgroundColor: string;
  };
  messagesTotal?: number;
  messagesUnread?: number;
  threadsTotal?: number;
  threadsUnread?: number;
}

interface GmailDraft {
  id: string;
  message: GmailMessage;
}

interface GmailSendRequest {
  raw: string; // Base64url encoded email
}

export class GmailHandler extends BasePlatformHandler implements IPlatformHandler {
  private baseUrl = 'https://gmail.googleapis.com/gmail/v1';

  supportsPlatform(platformId: string): boolean {
    return platformId.toLowerCase() === 'gmail';
  }

  async connect(credentials: Record<string, string>): Promise<boolean> {
    console.log('Gmail connect called');
    
    if (!credentials.access_token && !credentials.code) {
      throw new Error('Missing Gmail access token or OAuth code. You need Google OAuth 2.0 credentials.');
    }

    try {
      const token = credentials.access_token;
      if (!token) {
        throw new Error('OAuth flow not yet fully implemented. Please provide an access token.');
      }

      // Verify the token by getting user profile
      const response = await fetch(`${this.baseUrl}/users/me/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        let errorMessage = 'Invalid Gmail access token or connection failed';
        try {
          const errorData = await response.json();
          if (errorData.error && errorData.error.message) {
            errorMessage = errorData.error.message;
          }
        } catch (parseError) {
          console.log('Could not parse Gmail error response');
        }
        
        if (response.status === 401) {
          errorMessage = 'Invalid or expired Gmail access token. Please re-authenticate with Google.';
        } else if (response.status === 403) {
          errorMessage = 'Gmail API access forbidden. Please ensure the Gmail API is enabled and you have the required scopes.';
        }
        
        throw new Error(errorMessage);
      }

      const profileData = await response.json();
      console.log('Gmail connection successful!', {
        email: profileData.emailAddress,
        messagesTotal: profileData.messagesTotal,
        threadsTotal: profileData.threadsTotal
      });
      
      return true;
    } catch (error) {
      console.error('Gmail connection error:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred while connecting to Gmail. Please try again.');
      }
    }
  }

  async test(config: ConnectionConfig): Promise<boolean> {
    console.log("Testing Gmail connection...");
    
    try {
      const token = config.credentials.access_token;
      if (!token) return false;

      const response = await fetch(`${this.baseUrl}/users/me/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Gmail test failed:', error);
      return false;
    }
  }

  async disconnect(config: ConnectionConfig): Promise<boolean> {
    console.log("Disconnecting from Gmail...");
    
    try {
      const token = config.credentials.access_token;
      if (token) {
        // Revoke the token with Google
        await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
      }
      return true;
    } catch (error) {
      console.error('Gmail disconnect error:', error);
      return false;
    }
  }

  async executeRequest(request: IMcpRequest, connectedPlatforms: any[]): Promise<IMcpResponse> {
    try {
      const platform = connectedPlatforms.find(p => p.platformId === 'gmail');
      if (!platform?.isConnected || !platform.credentials?.access_token) {
        return { success: false, error: 'Gmail is not connected', data: null };
      }

      const token = platform.credentials.access_token;

      switch (request.action) {
        case 'read_emails':
          return { 
            success: true, 
            data: await this.searchMessages(token, request.params.query, request.params.options) 
          };
        
        case 'send_email':
          return { 
            success: true, 
            data: await this.sendEmail(token, request.params) 
          };
        
        case 'get_labels':
          return { 
            success: true, 
            data: await this.getLabels(token) 
          };
        
        case 'create_label':
          return { 
            success: true, 
            data: await this.createLabel(token, request.params) 
          };
        
        case 'mark_as_read':
          return { 
            success: true, 
            data: await this.markAsRead(token, request.params.messageIds) 
          };
        
        case 'mark_as_unread':
          return { 
            success: true, 
            data: await this.markAsUnread(token, request.params.messageIds) 
          };
        
        case 'delete_message':
          return { 
            success: true, 
            data: await this.deleteMessage(token, request.params.messageId) 
          };
        
        case 'create_draft':
          return { 
            success: true, 
            data: await this.createDraft(token, request.params) 
          };
        
        default:
          return { success: false, error: `Unsupported Gmail action: ${request.action}`, data: null };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error', data: null };
    }
  }

  // Gmail API Methods

  async getUserProfile(token: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/users/me/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Gmail API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Gmail get user profile failed:', error);
      throw error;
    }
  }

  async searchMessages(
    token: string,
    query: string = '',
    options: {
      labelIds?: string[];
      maxResults?: number;
      pageToken?: string;
      includeSpamTrash?: boolean;
    } = {}
  ): Promise<GmailSearchResult> {
    try {
      const { maxResults = 10, pageToken, includeSpamTrash = false, labelIds = [] } = options;
      
      const params = new URLSearchParams({
        q: query,
        maxResults: maxResults.toString(),
        includeSpamTrash: includeSpamTrash.toString()
      });

      if (pageToken) {
        params.append('pageToken', pageToken);
      }

      if (labelIds.length > 0) {
        labelIds.forEach(labelId => params.append('labelIds', labelId));
      }

      const response = await fetch(`${this.baseUrl}/users/me/messages?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Gmail API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Gmail search messages failed:', error);
      throw error;
    }
  }

  async getMessage(token: string, messageId: string, format: 'minimal' | 'full' | 'raw' | 'metadata' = 'full'): Promise<GmailMessage> {
    try {
      const params = new URLSearchParams({ format });

      const response = await fetch(`${this.baseUrl}/users/me/messages/${messageId}?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Gmail API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Gmail get message failed:', error);
      throw error;
    }
  }

  async sendEmail(
    token: string,
    emailData: {
      to: string;
      subject: string;
      body: string;
      from?: string;
      cc?: string;
      bcc?: string;
      isHtml?: boolean;
    }
  ): Promise<GmailMessage> {
    try {
      const { to, subject, body, from, cc, bcc, isHtml = false } = emailData;

      // Create email in RFC 2822 format
      let email = '';
      if (from) email += `From: ${from}\r\n`;
      email += `To: ${to}\r\n`;
      if (cc) email += `Cc: ${cc}\r\n`;
      if (bcc) email += `Bcc: ${bcc}\r\n`;
      email += `Subject: ${subject}\r\n`;
      email += `Content-Type: ${isHtml ? 'text/html' : 'text/plain'}; charset=UTF-8\r\n`;
      email += `\r\n${body}`;

      // Encode email as base64url
      const encodedEmail = btoa(email)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await fetch(`${this.baseUrl}/users/me/messages/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          raw: encodedEmail
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Gmail API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Gmail send email failed:', error);
      throw error;
    }
  }

  async getLabels(token: string): Promise<{ labels: GmailLabel[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/users/me/labels`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Gmail API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Gmail get labels failed:', error);
      throw error;
    }
  }

  async createLabel(
    token: string,
    labelData: {
      name: string;
      messageListVisibility?: 'show' | 'hide';
      labelListVisibility?: 'labelShow' | 'labelShowIfUnread' | 'labelHide';
      color?: {
        textColor: string;
        backgroundColor: string;
      };
    }
  ): Promise<GmailLabel> {
    try {
      const response = await fetch(`${this.baseUrl}/users/me/labels`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(labelData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Gmail API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Gmail create label failed:', error);
      throw error;
    }
  }

  async markAsRead(token: string, messageIds: string[]): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/users/me/messages/batchModify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ids: messageIds,
          removeLabelIds: ['UNREAD']
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Gmail API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Gmail mark as read failed:', error);
      throw error;
    }
  }

  async markAsUnread(token: string, messageIds: string[]): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/users/me/messages/batchModify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ids: messageIds,
          addLabelIds: ['UNREAD']
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Gmail API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Gmail mark as unread failed:', error);
      throw error;
    }
  }

  async deleteMessage(token: string, messageId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/users/me/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Gmail API error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Gmail delete message failed:', error);
      throw error;
    }
  }

  async createDraft(
    token: string,
    draftData: {
      to: string;
      subject: string;
      body: string;
      from?: string;
      cc?: string;
      bcc?: string;
      isHtml?: boolean;
    }
  ): Promise<GmailDraft> {
    try {
      const { to, subject, body, from, cc, bcc, isHtml = false } = draftData;

      // Create email in RFC 2822 format
      let email = '';
      if (from) email += `From: ${from}\r\n`;
      email += `To: ${to}\r\n`;
      if (cc) email += `Cc: ${cc}\r\n`;
      if (bcc) email += `Bcc: ${bcc}\r\n`;
      email += `Subject: ${subject}\r\n`;
      email += `Content-Type: ${isHtml ? 'text/html' : 'text/plain'}; charset=UTF-8\r\n`;
      email += `\r\n${body}`;

      // Encode email as base64url
      const encodedEmail = btoa(email)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await fetch(`${this.baseUrl}/users/me/drafts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: {
            raw: encodedEmail
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Gmail API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Gmail create draft failed:', error);
      throw error;
    }
  }

  // Helper method to decode Gmail message body
  decodeBody(data: string): string {
    try {
      // Gmail API returns base64url encoded data
      const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
      return atob(base64);
    } catch (error) {
      console.error('Error decoding base64:', error);
      return '';
    }
  }

  async getExecutionHistory(userId: string, limit?: number, platform?: string): Promise<any[]> {
    // Implementation for fetching Gmail execution history
    return [];
  }

  getServerType(): string {
    return 'gmail';
  }
}

export const gmailHandler = new GmailHandler();
