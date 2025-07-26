
import { ConnectionConfig } from "@/types/platform";
import { IMcpRequest, IMcpResponse } from '@/lib/mcp/IMcpServer';
import { Platform } from '@/types/platform';
import { IPlatformHandler, BasePlatformHandler } from '@/types/platformHandler';

interface GoogleDriveFile {
  kind: 'drive#file';
  id: string;
  name: string;
  mimeType: string;
  description?: string;
  starred: boolean;
  trashed: boolean;
  explicitlyTrashed: boolean;
  parents?: string[];
  properties?: Record<string, string>;
  appProperties?: Record<string, string>;
  spaces: string[];
  version: string;
  webContentLink?: string;
  webViewLink?: string;
  iconLink?: string;
  hasThumbnail: boolean;
  thumbnailLink?: string;
  thumbnailVersion?: string;
  viewedByMe: boolean;
  viewedByMeTime?: string;
  createdTime: string;
  modifiedTime: string;
  modifiedByMeTime?: string;
  modifiedByMe: boolean;
  sharedWithMeTime?: string;
  sharingUser?: {
    kind: 'drive#user';
    displayName: string;
    photoLink?: string;
    me: boolean;
    permissionId: string;
    emailAddress: string;
  };
  owners: Array<{
    kind: 'drive#user';
    displayName: string;
    photoLink?: string;
    me: boolean;
    permissionId: string;
    emailAddress: string;
  }>;
  teamDriveId?: string;
  driveId?: string;
  lastModifyingUser: {
    kind: 'drive#user';
    displayName: string;
    photoLink?: string;
    me: boolean;
    permissionId: string;
    emailAddress: string;
  };
  shared: boolean;
  ownedByMe: boolean;
  capabilities: {
    canAddChildren: boolean;
    canChangeCopyRequiresWriterPermission: boolean;
    canChangeViewersCanCopyContent: boolean;
    canComment: boolean;
    canCopy: boolean;
    canDelete: boolean;
    canDownload: boolean;
    canEdit: boolean;
    canListChildren: boolean;
    canMoveItemIntoTeamDrive: boolean;
    canMoveItemOutOfTeamDrive: boolean;
    canMoveItemWithinTeamDrive: boolean;
    canMoveTeamDriveItem: boolean;
    canReadRevisions: boolean;
    canRemoveChildren: boolean;
    canRename: boolean;
    canShare: boolean;
    canTrash: boolean;
    canUntrash: boolean;
  };
  viewersCanCopyContent: boolean;
  copyRequiresWriterPermission: boolean;
  writersCanShare: boolean;
  permissions?: GoogleDrivePermission[];
  permissionIds?: string[];
  hasAugmentedPermissions: boolean;
  folderColorRgb?: string;
  originalFilename?: string;
  fullFileExtension?: string;
  fileExtension?: string;
  md5Checksum?: string;
  sha1Checksum?: string;
  sha256Checksum?: string;
  size?: string;
  quotaBytesUsed?: string;
  headRevisionId: string;
  contentHints?: {
    thumbnail?: {
      image: string;
      mimeType: string;
    };
    indexableText?: string;
  };
  imageMediaMetadata?: {
    width: number;
    height: number;
    rotation: number;
    location?: {
      latitude: number;
      longitude: number;
      altitude: number;
    };
    time?: string;
    cameraMake?: string;
    cameraModel?: string;
    exposureTime?: number;
    aperture?: number;
    flashUsed?: boolean;
    focalLength?: number;
    isoSpeed?: number;
    meteringMode?: string;
    sensor?: string;
    exposureMode?: string;
    colorSpace?: string;
    whiteBalance?: string;
    exposureBias?: number;
    maxApertureValue?: number;
    subjectDistance?: number;
    lens?: string;
  };
  videoMediaMetadata?: {
    width: number;
    height: number;
    durationMillis: string;
  };
  isAppAuthorized: boolean;
  exportLinks?: Record<string, string>;
}

interface GoogleDrivePermission {
  kind: 'drive#permission';
  id: string;
  type: 'user' | 'group' | 'domain' | 'anyone';
  emailAddress?: string;
  domain?: string;
  role: 'owner' | 'organizer' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader';
  allowFileDiscovery?: boolean;
  displayName?: string;
  photoLink?: string;
  expirationTime?: string;
  teamDrivePermissionDetails?: Array<{
    teamDrivePermissionType: 'file' | 'member';
    role: 'organizer' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader';
    inheritedFrom?: string;
    inherited: boolean;
  }>;
  permissionDetails?: Array<{
    permissionType: 'file' | 'member';
    role: 'organizer' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader';
    inheritedFrom?: string;
    inherited: boolean;
  }>;
  deleted: boolean;
}

interface GoogleDriveComment {
  kind: 'drive#comment';
  id: string;
  createdTime: string;
  modifiedTime: string;
  author: {
    kind: 'drive#user';
    displayName: string;
    photoLink?: string;
    me: boolean;
  };
  htmlContent: string;
  content: string;
  deleted: boolean;
  resolved: boolean;
  quotedFileContent?: {
    mimeType: string;
    value: string;
  };
  anchor?: string;
  replies?: Array<{
    kind: 'drive#reply';
    id: string;
    createdTime: string;
    modifiedTime: string;
    author: {
      kind: 'drive#user';
      displayName: string;
      photoLink?: string;
      me: boolean;
    };
    htmlContent: string;
    content: string;
    deleted: boolean;
    action: 'resolve' | 'reopen';
  }>;
}

export class GoogleDriveHandler extends BasePlatformHandler implements IPlatformHandler {
  private baseUrl = 'https://www.googleapis.com/drive/v3';
  private uploadUrl = 'https://www.googleapis.com/upload/drive/v3';

  supportsPlatform(platformId: string): boolean {
    return platformId.toLowerCase() === 'google-drive';
  }

  async connect(credentials: Record<string, string>): Promise<boolean> {
    console.log('Google Drive connect called');
    
    if (!credentials.access_token && !credentials.code) {
      throw new Error('Missing Google Drive access token or OAuth code. You need Google OAuth 2.0 credentials.');
    }

    try {
      const token = credentials.access_token;
      if (!token) {
        throw new Error('OAuth flow not yet fully implemented. Please provide an access token.');
      }

      // Verify the token by getting user information
      const response = await fetch(`${this.baseUrl}/about?fields=user,storageQuota`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        let errorMessage = 'Invalid Google Drive access token or connection failed';
        try {
          const errorData = await response.json();
          if (errorData.error && errorData.error.message) {
            errorMessage = errorData.error.message;
          }
        } catch (parseError) {
          console.log('Could not parse Google Drive error response');
        }
        
        if (response.status === 401) {
          errorMessage = 'Invalid or expired Google Drive access token. Please re-authenticate with Google.';
        } else if (response.status === 403) {
          errorMessage = 'Google Drive API access forbidden. Please ensure the Drive API is enabled and you have the required scopes.';
        }
        
        throw new Error(errorMessage);
      }

      const aboutData = await response.json();
      console.log('Google Drive connection successful!', {
        user: aboutData.user?.displayName,
        email: aboutData.user?.emailAddress,
        storageLimit: aboutData.storageQuota?.limit,
        storageUsed: aboutData.storageQuota?.usage
      });
      
      return true;
    } catch (error) {
      console.error('Google Drive connection error:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred while connecting to Google Drive. Please try again.');
      }
    }
  }

  async test(config: ConnectionConfig): Promise<boolean> {
    console.log("Testing Google Drive connection...");
    
    try {
      const token = config.credentials.access_token;
      if (!token) return false;

      const response = await fetch(`${this.baseUrl}/about`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Google Drive test failed:', error);
      return false;
    }
  }

  async disconnect(config: ConnectionConfig): Promise<boolean> {
    console.log("Disconnecting from Google Drive...");
    
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
      console.error('Google Drive disconnect error:', error);
      return false;
    }
  }

  async executeRequest(request: IMcpRequest, connectedPlatforms: Platform[]): Promise<IMcpResponse> {
    try {
      const platform = connectedPlatforms.find(p => p.id === 'google-drive' && p.isConnected);
      if (!platform) {
        return {
          success: false,
          error: 'Google Drive is not connected',
          data: null
        };
      }

      const connectionConfig = this.getConnectionConfig(platform);
      if (!connectionConfig?.credentials.access_token) {
        return {
          success: false,
          error: 'Google Drive access token not found',
          data: null
        };
      }

      const token = connectionConfig.credentials.access_token;

      switch (request.action) {
        case 'list_files':
          return {
            success: true,
            error: null,
            data: await this.listFiles(token, request.params.options)
          };
        
        case 'get_file':
          return {
            success: true,
            error: null,
            data: await this.getFile(token, request.params.fileId)
          };
        
        case 'create_file':
          return {
            success: true,
            error: null,
            data: await this.createFile(token, request.params)
          };
        
        case 'update_file':
          return {
            success: true,
            error: null,
            data: await this.updateFile(token, request.params.fileId, request.params.metadata, request.params.media)
          };
        
        case 'delete_file':
          return {
            success: true,
            error: null,
            data: await this.deleteFile(token, request.params.fileId)
          };
        
        case 'copy_file':
          return {
            success: true,
            error: null,
            data: await this.copyFile(token, request.params.fileId, request.params.metadata)
          };
        
        case 'create_folder':
          return {
            success: true,
            error: null,
            data: await this.createFolder(token, request.params.name, request.params.parentId)
          };
        
        case 'share_file':
          return {
            success: true,
            error: null,
            data: await this.shareFile(token, request.params.fileId, request.params.permissions)
          };
        
        case 'download_file':
          return {
            success: true,
            error: null,
            data: await this.downloadFile(token, request.params.fileId)
          };
        
        default:
          return {
            success: false,
            error: `Unsupported Google Drive action: ${request.action}`,
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

  // Google Drive API Methods

  async listFiles(
    token: string,
    options: {
      q?: string; // Query string
      spaces?: string; // 'drive', 'appDataFolder', 'photos'
      corpora?: 'user' | 'domain' | 'teamDrive' | 'allTeamDrives';
      teamDriveId?: string;
      includeTeamDriveItems?: boolean;
      supportsTeamDrives?: boolean;
      pageSize?: number;
      pageToken?: string;
      orderBy?: string;
      fields?: string;
    } = {}
  ): Promise<{ files: GoogleDriveFile[]; nextPageToken?: string; incompleteSearch: boolean }> {
    try {
      const {
        q,
        spaces = 'drive',
        corpora = 'user',
        pageSize = 100,
        pageToken,
        orderBy = 'modifiedTime desc',
        fields = '*'
      } = options;

      const params = new URLSearchParams({
        spaces,
        corpora,
        pageSize: pageSize.toString(),
        orderBy,
        fields
      });

      if (q) params.append('q', q);
      if (pageToken) params.append('pageToken', pageToken);

      const response = await fetch(`${this.baseUrl}/files?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Google Drive API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Google Drive list files failed:', error);
      throw error;
    }
  }

  async getFile(token: string, fileId: string, fields: string = '*'): Promise<GoogleDriveFile> {
    try {
      const params = new URLSearchParams({ fields });

      const response = await fetch(`${this.baseUrl}/files/${fileId}?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Google Drive API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Google Drive get file failed:', error);
      throw error;
    }
  }

  async createFile(
    token: string,
    fileData: {
      name: string;
      parents?: string[];
      mimeType?: string;
      content?: string | Blob | File;
      description?: string;
      properties?: Record<string, string>;
    }
  ): Promise<GoogleDriveFile> {
    try {
      const { name, parents, mimeType, content, description, properties } = fileData;

      const metadata = {
        name,
        parents,
        mimeType,
        description,
        properties
      };

      if (!content) {
        // Create metadata-only file (like a folder)
        const response = await fetch(`${this.baseUrl}/files`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(metadata)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || `Google Drive API error: ${response.statusText}`);
        }

        return await response.json();
      } else {
        // Create file with content using multipart upload
        const boundary = '-------314159265358979323846';
        const delimiter = `\r\n--${boundary}\r\n`;
        const close_delim = `\r\n--${boundary}--`;

        let body = delimiter;
        body += 'Content-Type: application/json\r\n\r\n';
        body += JSON.stringify(metadata) + delimiter;
        body += `Content-Type: ${mimeType || 'application/octet-stream'}\r\n\r\n`;

        const uint8Array = new Uint8Array(body.length + (content instanceof Blob ? await content.arrayBuffer().then(ab => ab.byteLength) : new TextEncoder().encode(content as string).length) + close_delim.length);
        let offset = 0;

        // Add metadata
        const bodyBytes = new TextEncoder().encode(body);
        uint8Array.set(bodyBytes, offset);
        offset += bodyBytes.length;

        // Add content
        if (content instanceof Blob) {
          const contentBytes = new Uint8Array(await content.arrayBuffer());
          uint8Array.set(contentBytes, offset);
          offset += contentBytes.length;
        } else {
          const contentBytes = new TextEncoder().encode(content as string);
          uint8Array.set(contentBytes, offset);
          offset += contentBytes.length;
        }

        // Add closing delimiter
        const closeBytes = new TextEncoder().encode(close_delim);
        uint8Array.set(closeBytes, offset);

        const response = await fetch(`${this.uploadUrl}/files?uploadType=multipart`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': `multipart/related; boundary="${boundary}"`
          },
          body: uint8Array
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || `Google Drive API error: ${response.statusText}`);
        }

        return await response.json();
      }
    } catch (error) {
      console.error('Google Drive create file failed:', error);
      throw error;
    }
  }

  async updateFile(
    token: string,
    fileId: string,
    metadata?: Partial<GoogleDriveFile>,
    media?: string | Blob | File
  ): Promise<GoogleDriveFile> {
    try {
      if (!media && metadata) {
        // Update metadata only
        const response = await fetch(`${this.baseUrl}/files/${fileId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(metadata)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || `Google Drive API error: ${response.statusText}`);
        }

        return await response.json();
      } else {
        // Update with media content
        const response = await fetch(`${this.uploadUrl}/files/${fileId}?uploadType=media`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/octet-stream'
          },
          body: media
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || `Google Drive API error: ${response.statusText}`);
        }

        return await response.json();
      }
    } catch (error) {
      console.error('Google Drive update file failed:', error);
      throw error;
    }
  }

  async deleteFile(token: string, fileId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Google Drive API error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Google Drive delete file failed:', error);
      throw error;
    }
  }

  async copyFile(
    token: string,
    fileId: string,
    metadata: {
      name?: string;
      parents?: string[];
      description?: string;
    } = {}
  ): Promise<GoogleDriveFile> {
    try {
      const response = await fetch(`${this.baseUrl}/files/${fileId}/copy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metadata)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Google Drive API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Google Drive copy file failed:', error);
      throw error;
    }
  }

  async createFolder(token: string, name: string, parentId?: string): Promise<GoogleDriveFile> {
    try {
      const metadata = {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentId ? [parentId] : undefined
      };

      return await this.createFile(token, metadata);
    } catch (error) {
      console.error('Google Drive create folder failed:', error);
      throw error;
    }
  }

  async shareFile(
    token: string,
    fileId: string,
    permissions: {
      type: 'user' | 'group' | 'domain' | 'anyone';
      role: 'owner' | 'organizer' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader';
      emailAddress?: string;
      domain?: string;
      allowFileDiscovery?: boolean;
    }
  ): Promise<GoogleDrivePermission> {
    try {
      const response = await fetch(`${this.baseUrl}/files/${fileId}/permissions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(permissions)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Google Drive API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Google Drive share file failed:', error);
      throw error;
    }
  }

  async downloadFile(token: string, fileId: string): Promise<ArrayBuffer> {
    try {
      const response = await fetch(`${this.baseUrl}/files/${fileId}?alt=media`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Google Drive API error: ${response.statusText}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Google Drive download file failed:', error);
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
    // Implementation for fetching Google Drive execution history
    return [];
  }

  getServerType(): string {
    return 'google-drive';
  }
}

export const googleDriveHandler = new GoogleDriveHandler();
