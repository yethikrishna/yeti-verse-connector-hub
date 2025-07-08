import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { code } = JSON.parse(event.body || '{}');
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI;

    if (!code || !clientId || !clientSecret || !redirectUri) {
      return { statusCode: 400, body: 'Missing required parameters' };
    }

    // Exchange code for access token
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri
      }).toString()
    });

    if (!response.ok) throw new Error('Token exchange failed');
    const data = await response.json();

    return { statusCode: 200, body: JSON.stringify({ accessToken: data.access_token }) };
  } catch (error) {
    console.error('OAuth error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error instanceof Error ? error.message : 'Authentication failed' }) };
  }
};

export { handler };