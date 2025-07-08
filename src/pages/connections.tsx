import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Box, Button, Card, CardContent, Grid, Heading, Text, Alert, CircularProgress, Divider, Flex, Icon, Tooltip } from '@radix-ui/themes';
import { CheckCircle, CircleDot, Disconnect, Loader2, PlusCircle, Settings, XCircle } from 'lucide-react';
import { Platform } from '@/types/platform';
import { getPlatformIcon, getPlatformName } from '@/lib/utils/platformUtils';
import { useToast } from '@/components/ui/use-toast';

// List of all supported platforms
const SUPPORTED_PLATFORMS = [
  'linkedin',
  'twitter',
  'github',
  'facebook',
  'instagram',
  'github_pages'
] as const;

type SupportedPlatform = typeof SUPPORTED_PLATFORMS[number];

export default function ConnectionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [connectedPlatforms, setConnectedPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/connections');
    } else if (status === 'authenticated') {
      fetchConnectedPlatforms();
    }
  }, [status, session, router]);

  // Fetch connected platforms from API
  const fetchConnectedPlatforms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/connections');
      if (!response.ok) throw new Error('Failed to fetch connections');
      const data = await response.json();
      setConnectedPlatforms(data.platforms || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load your connections' });
    } finally {
      setLoading(false);
    }
  };

  // Check if a platform is connected
  const isPlatformConnected = (platformId: string): boolean => {
    return connectedPlatforms.some(p => p.platformId === platformId);
  };

  // Get connection data for a platform
  const getPlatformConnection = (platformId: string): Platform | undefined => {
    return connectedPlatforms.find(p => p.platformId === platformId);
  };

  // Connect to a platform
  const handleConnect = async (platform: SupportedPlatform) => {
    try {
      setActionLoading(prev => ({ ...prev, [platform]: true }));
      router.push(`/auth/${platform}`);
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      toast({ variant: 'destructive', title: 'Connection failed', description: `Could not connect to ${getPlatformName(platform)}` });
      setActionLoading(prev => ({ ...prev, [platform]: false }));
    }
  };

  // Disconnect from a platform
  const handleDisconnect = async (platform: SupportedPlatform) => {
    if (!confirm(`Are you sure you want to disconnect from ${getPlatformName(platform)}?`)) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [platform]: true }));
      const response = await fetch(`/api/connections/${platform}`, { method: 'DELETE' });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Disconnection failed');

      toast({ title: 'Disconnected', description: `Successfully disconnected from ${getPlatformName(platform)}` });
      fetchConnectedPlatforms();
    } catch (error) {
      console.error(`Error disconnecting from ${platform}:`, error);
      toast({ variant: 'destructive', title: 'Disconnection failed', description: error instanceof Error ? error.message : 'Could not disconnect' });
    } finally {
      setActionLoading(prev => ({ ...prev, [platform]: false }));
    }
  };

  // Execute a platform action
  const executePlatformAction = async (platform: SupportedPlatform, action: string) => {
    try {
      setActionLoading(prev => ({ ...prev, [platform]: true }));
      const response = await fetch(`/api/connections/${platform}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Action failed');

      toast({ title: 'Action completed', description: `Successfully executed ${action} on ${getPlatformName(platform)}` });
    } catch (error) {
      console.error(`Error executing ${action} on ${platform}:`, error);
      toast({ variant: 'destructive', title: 'Action failed', description: error instanceof Error ? error.message : 'Could not execute action' });
    } finally {
      setActionLoading(prev => ({ ...prev, [platform]: false }));
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Box className="flex items-center justify-center min-h-screen p-4">
        <CircularProgress size="large" />
      </Box>
    );
  }

  return (
    <>:
      <Head>
        <title>Platform Connections | Yeti Verse Connector Hub</title>
        <meta name="description" content="Manage your platform connections" />
      </Head>

      <Box className="container mx-auto py-8 px-4">
        <Flex justify="space-between" align="center" mb-8>
          <Heading size="2">Platform Connections</Heading>
          <Link href="/">
            <Button variant="secondary">Return to Home</Button>
          </Link>
        </Flex>

        <Alert variant="outline" className="mb-8">
          <Text>
            Connect and manage your social media and service accounts. The AI will use these connections to perform actions on your behalf.
          </Text>
        </Alert>

        <Grid columns={{ initial: 1, md: 2, lg: 3 }} gap={6}>
          {SUPPORTED_PLATFORMS.map((platform) => {
            const connected = isPlatformConnected(platform);
            const connection = getPlatformConnection(platform);
            const IconComponent = getPlatformIcon(platform);
            const platformName = getPlatformName(platform);

            return (
              <Card key={platform} className="overflow-hidden transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <Flex justify="space-between" align="start" mb-4>
                    <Flex align="center" gap={3}>
                      <Box className={`p-3 rounded-full ${connected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                        <IconComponent size={24} />
                      </Box>
                      <Box>
                        <Heading size="4">{platformName}</Heading>
                        <Text size="2" color={connected ? 'green' : 'gray'}>
                          {connected ? 'Connected' : 'Not Connected'}
                        </Text>
                      </Box>
                    </Flex>
                    {connected && (
                      <Tooltip content="Connected">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </Tooltip>
                    )}
                  </Flex>

                  {connected && connection?.metadata?.accountName && (
                    <Box mb-4 p-3 bg-gray-50 rounded-md>
                      <Text size="2" className="truncate">
                        Connected as: <strong>{connection.metadata.accountName}</strong>
                      </Text>
                    </Box>
                  )}

                  <Divider className="my-4" />

                  <Flex gap={3}>
                    {connected ? (
                      <>:
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDisconnect(platform)}
                          disabled={actionLoading[platform]}
                        >
                          {actionLoading[platform] ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Disconnect className="mr-2 h-4 w-4" />
                          )}
                          Disconnect
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => executePlatformAction(platform, 'test_connection')}
                          disabled={actionLoading[platform]}
                        >
                          Test Connection
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => router.push(`/connections/${platform}/settings`)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => handleConnect(platform)}
                        disabled={actionLoading[platform]}
                      >
                        {actionLoading[platform] ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <PlusCircle className="mr-2 h-4 w-4" />
                        )}
                        Connect {platformName}
                      </Button>
                    )}
                  </Flex>
                </CardContent>
              </Card>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}

// Server-side authentication check
export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: `/auth/signin?callbackUrl=/connections`,
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}