import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import ConnectionService from '@/lib/services/ConnectionService';

/**
 * API endpoint to get all connected platforms for the current user
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }

    // Get user session
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Fetch connected platforms
    const platforms = await ConnectionService.getUserConnectedPlatforms(
      session.user.id
    );

    return res.status(200).json({
      success: true,
      platforms,
      count: platforms.length
    });
  } catch (error) {
    console.error('Error fetching connections:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch connections'
    });
  }
}