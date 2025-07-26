import { IMcpRequest, IMcpResponse } from '@/lib/mcp/IMcpServer';
import { Platform, ConnectionConfig } from '@/types/platform';
import { IPlatformHandler, BasePlatformHandler } from '@/types/platformHandler';

interface LinkedInProfile {
  id: string;
  firstName: {
    localized: Record<string, string>;
    preferredLocale: {
      country: string;
      language: string;
    };
  };
  lastName: {
    localized: Record<string, string>;
    preferredLocale: {
      country: string;
      language: string;
    };
  };
  headline?: {
    localized: Record<string, string>;
    preferredLocale: {
      country: string;
      language: string;
    };
  };
  profilePicture?: {
    displayImage: string;
  };
  vanityName?: string;
}

interface LinkedInPost {
  id: string;
  author: string;
  lifecycleState: 'PUBLISHED' | 'DRAFT';
  created: {
    time: number;
  };
  lastModified: {
    time: number;
  };
  specificContent: {
    'com.linkedin.ugc.ShareContent': {
      shareCommentary: {
        text: string;
      };
      shareMediaCategory: 'NONE' | 'ARTICLE' | 'IMAGE';
      media?: Array<{
        status: 'READY';
        description: {
          text: string;
        };
        media: string;
        title: {
          text: string;
        };
      }>;
    };
  };
  visibility: {
    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' | 'CONNECTIONS';
  };
}

interface LinkedInCompany {
  id: number;
  name: {
    localized: Record<string, string>;
    preferredLocale: {
      country: string;
      language: string;
    };
  };
  vanityName: string;
  description?: {
    localized: Record<string, string>;
    preferredLocale: {
      country: string;
      language: string;
    };
  };
  website?: {
    localized: Record<string, string>;
    preferredLocale: {
      country: string;
      language: string;
    };
  };
  industries: string[];
  companyType: string;
  employeeCountRange: {
    start: number;
    end?: number;
  };
}

export class LinkedInHandler extends BasePlatformHandler implements IPlatformHandler {
  private baseUrl = 'https://api.linkedin.com/v2';

  supportsPlatform(platformId: string): boolean {
    return platformId.toLowerCase() === 'linkedin';
  }

  async connect(credentials: Record<string, string>): Promise<boolean> {
    console.log('LinkedIn connect called');
    
    if (!credentials.access_token && !credentials.code) {
      throw new Error('Missing LinkedIn access token or OAuth code. You need LinkedIn OAuth 2.0 credentials.');
    }

    try {
      const token = credentials.access_token;
      if (!token) {
        throw new Error('OAuth flow not yet fully implemented. Please provide an access token.');
      }

      // Verify the token by getting user profile
      const response = await fetch(`${this.baseUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        let errorMessage = 'Invalid LinkedIn access token or connection failed';
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          console.log('Could not parse LinkedIn error response');
        }
        
        if (response.status === 401) {
          errorMessage = 'Invalid or expired LinkedIn access token. Please re-authenticate with LinkedIn.';
        } else if (response.status === 403) {
          errorMessage = 'LinkedIn API access forbidden. Please ensure your app has the required permissions.';
        }
        
        throw new Error(errorMessage);
      }

      const profileData = await response.json();
      console.log('LinkedIn connection successful!', {
        id: profileData.id,
        name: `${Object.values(profileData.firstName?.localized || {})[0] || ''} ${Object.values(profileData.lastName?.localized || {})[0] || ''}`.trim()
      });
      
      return true;
    } catch (error) {
      console.error('LinkedIn connection error:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred while connecting to LinkedIn. Please try again.');
      }
    }
  }

  async test(config: ConnectionConfig): Promise<boolean> {
    console.log("Testing LinkedIn connection...");
    
    try {
      const token = config.credentials.access_token;
      if (!token) return false;

      const response = await fetch(`${this.baseUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('LinkedIn test failed:', error);
      return false;
    }
  }

  async disconnect(config: ConnectionConfig): Promise<boolean> {
    console.log("Disconnecting from LinkedIn...");
    
    try {
      const token = config.credentials.access_token;
      if (token) {
        // LinkedIn doesn't provide a direct token revocation endpoint
        // The token will expire naturally or can be revoked from LinkedIn developer portal
        console.log('LinkedIn token should be revoked manually from the developer portal if needed');
      }
      return true;
    } catch (error) {
      console.error('LinkedIn disconnect error:', error);
      return false;
    }
  }

  async executeRequest(request: IMcpRequest, connectedPlatforms: Platform[]): Promise<IMcpResponse> {
    try {
      const platform = connectedPlatforms.find(p => p.id === 'linkedin' && p.isConnected);
      if (!platform) {
        return {
          success: false,
          error: 'LinkedIn is not connected',
          data: null
        };
      }

      const connectionConfig = this.getConnectionConfig(platform);
      if (!connectionConfig?.credentials.access_token) {
        return {
          success: false,
          error: 'LinkedIn access token not found',
          data: null
        };
      }

      const token = connectionConfig.credentials.access_token;

      switch (request.action) {
        case 'share_post':
          return {
            success: true,
            error: null,
            data: await this.sharePost(token, request.params)
          };
        
        case 'read_profile':
          return {
            success: true,
            error: null,
            data: await this.getProfile(token, request.params.personId)
          };
        
        case 'get_companies':
          return {
            success: true,
            error: null,
            data: await this.getCompanies(token)
          };
        
        case 'share_article':
          return {
            success: true,
            error: null,
            data: await this.shareArticle(token, request.params)
          };
        
        case 'upload_media':
          return {
            success: true,
            error: null,
            data: await this.uploadMedia(token, request.params)
          };
        
        default:
          return {
            success: false,
            error: `Unsupported LinkedIn action: ${request.action}`,
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

  // LinkedIn API v2 Methods

  async getProfile(token: string, personId?: string): Promise<LinkedInProfile> {
    try {
      const endpoint = personId ? `people/id=${personId}` : 'me';
      
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `LinkedIn API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('LinkedIn get profile failed:', error);
      throw error;
    }
  }

  async sharePost(
    token: string,
    postData: {
      text: string;
      visibility?: 'PUBLIC' | 'CONNECTIONS';
      media?: Array<{
        url?: string;
        title?: string;
        description?: string;
      }>;
    }
  ): Promise<{ id: string }> {
    try {
      const { text, visibility = 'PUBLIC', media = [] } = postData;

      // First get the person URN
      const profile = await this.getProfile(token);
      const authorUrn = `urn:li:person:${profile.id}`;

      const shareContent: any = {
        author: authorUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text
            },
            shareMediaCategory: media.length > 0 ? 'ARTICLE' : 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': visibility
        }
      };

      if (media.length > 0) {
        shareContent.specificContent['com.linkedin.ugc.ShareContent'].media = media.map(item => ({
          status: 'READY',
          description: {
            text: item.description || ''
          },
          originalUrl: item.url || '',
          title: {
            text: item.title || ''
          }
        }));
      }

      const response = await fetch(`${this.baseUrl}/ugcPosts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify(shareContent)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `LinkedIn API error: ${response.statusText}`);
      }

      const result = await response.json();
      return { id: result.id };
    } catch (error) {
      console.error('LinkedIn share post failed:', error);
      throw error;
    }
  }

  async shareArticle(
    token: string,
    articleData: {
      text: string;
      articleUrl: string;
      title?: string;
      description?: string;
      visibility?: 'PUBLIC' | 'CONNECTIONS';
    }
  ): Promise<{ id: string }> {
    try {
      const { text, articleUrl, title, description, visibility = 'PUBLIC' } = articleData;

      // First get the person URN
      const profile = await this.getProfile(token);
      const authorUrn = `urn:li:person:${profile.id}`;

      const shareContent = {
        author: authorUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text
            },
            shareMediaCategory: 'ARTICLE',
            media: [{
              status: 'READY',
              description: {
                text: description || ''
              },
              originalUrl: articleUrl,
              title: {
                text: title || ''
              }
            }]
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': visibility
        }
      };

      const response = await fetch(`${this.baseUrl}/ugcPosts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify(shareContent)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `LinkedIn API error: ${response.statusText}`);
      }

      const result = await response.json();
      return { id: result.id };
    } catch (error) {
      console.error('LinkedIn share article failed:', error);
      throw error;
    }
  }

  async getCompanies(token: string): Promise<{ elements: LinkedInCompany[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&projection=(elements*(organizationalTarget~(id,vanityName,name,description,website,industries,companyType,employeeCountRange)))`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `LinkedIn API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('LinkedIn get companies failed:', error);
      throw error;
    }
  }

  async uploadMedia(
    token: string,
    mediaData: {
      file: File | Blob;
      uploadType: 'UGCPOST_IMAGE' | 'UGCPOST_VIDEO';
    }
  ): Promise<{ uploadUrl: string; asset: string }> {
    try {
      const { file, uploadType } = mediaData;

      // First get the person URN
      const profile = await this.getProfile(token);
      const ownerUrn = `urn:li:person:${profile.id}`;

      // Step 1: Initialize upload
      const initResponse = await fetch(`${this.baseUrl}/assets?action=registerUpload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          registerUploadRequest: {
            recipes: [uploadType],
            owner: ownerUrn,
            serviceRelationships: [{
              relationshipType: 'OWNER',
              identifier: 'urn:li:userGeneratedContent'
            }]
          }
        })
      });

      if (!initResponse.ok) {
        const error = await initResponse.json();
        throw new Error(error.message || `LinkedIn API error: ${initResponse.statusText}`);
      }

      const initResult = await initResponse.json();
      const uploadUrl = initResult.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
      const asset = initResult.value.asset;

      // Step 2: Upload the file
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: file,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload media: ${uploadResponse.statusText}`);
      }

      return { uploadUrl, asset };
    } catch (error) {
      console.error('LinkedIn upload media failed:', error);
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
    // Implementation for fetching LinkedIn execution history
    return [];
  }

  getServerType(): string {
    return 'linkedin';
  }

  async handleCallback(code: string): Promise<void> {
    try {
      // Exchange authorization code for access token
      const response = await fetch('/.netlify/functions/linkedin-oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      if (!response.ok) throw new Error('Failed to exchange code');
      const { accessToken } = await response.json();

      // Store token securely (implement with your auth system)
      localStorage.setItem('linkedinAccessToken', accessToken);
    } catch (error) {
      console.error('LinkedIn callback failed:', error);
      throw error;
    }
  }
}

export const linkedinHandler = new LinkedInHandler();

  async disconnect(userId: string): Promise<boolean> {
    try {
      // Remove stored access token
      localStorage.removeItem('linkedinAccessToken');
      // In a real implementation, you might also revoke the token with LinkedIn's API
      return true;
    } catch (error) {
      console.error('Failed to disconnect LinkedIn:', error);
      return false;
    }
  }
}

export const linkedinHandler = new LinkedInHandler();