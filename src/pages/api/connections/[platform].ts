import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import McpService from '@/lib/mcp/McpService';
import ConnectionService from '@/lib/services/ConnectionService';
import { Platform } from '@/types/platform';
import { IMcpRequest } from '@/types/mcp';

/**
 * API handler for platform connection operations
 * Handles dynamic platform routes for connection actions
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get user session for authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Extract platform from URL params
    const { platform } = req.query;
    if (typeof platform !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid platform parameter'
      });
    }

    // Get connected platforms for the user
    const connectedPlatforms = await ConnectionService.getUserConnectedPlatforms(
      session.user.id
    );

    // Verify user has connected this platform
    const isConnected = connectedPlatforms.some(
      (p: Platform) => p.platformId === platform
    );

    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        // Get platform connection status or data
        return res.status(200).json({
          success: true,
          connected: isConnected,
          platform,
          data: isConnected ? await ConnectionService.getPlatformConnectionData(session.user.id, platform) : null
        });

      case 'POST':
        // Execute an action on the platform
        const { action, parameters } = req.body;

        if (!action) {
          return res.status(400).json({
            success: false,
            error: 'Action parameter is required'
          });
        }

        if (!isConnected) {
          return res.status(403).json({
            success: false,
            error: `Not connected to ${platform}`
          });
        }

        // Create MCP request
        const mcpRequest: IMcpRequest = {
          platform,
          action,
          parameters: parameters || {},
          userId: session.user.id
        };

        // Execute through MCP service
        const result = await McpService.getInstance().executeRequest(
          mcpRequest,
          connectedPlatforms
        );

        return res.status(result.success ? 200 : 400).json(result);

      case 'DELETE':
        // Disconnect the platform
        await ConnectionService.disconnectPlatform(session.user.id, platform);
        return res.status(200).json({
          success: true,
          message: `Successfully disconnected from ${platform}`
        });

      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error(`Platform API error:`, error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
}