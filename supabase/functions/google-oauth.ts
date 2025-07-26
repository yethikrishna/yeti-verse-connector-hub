import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Environment variables for Google OAuth credentials
const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Define scopes for different Google services
const GOOGLE_SCOPES = {
  gmail: [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.modify",
    "openid",
    "email",
    "profile"
  ],
  drive: [
    "https://www.googleapis.com/auth/drive.file",
    "openid",
    "email",
    "profile"
  ],
  sheets: [
    "https://www.googleapis.com/auth/spreadsheets",
    "openid",
    "email",
    "profile"
  ],
  docs: [
    "https://www.googleapis.com/auth/documents",
    "openid",
    "email",
    "profile"
  ]
};

interface OAuthRequest {
  action: 'initiate' | 'exchange' | 'refresh';
  service: 'gmail' | 'drive' | 'sheets' | 'docs';
  code?: string;
  refresh_token?: string;
  user_id?: string;
  redirect_uri?: string;
  state?: string;
}

serve(async (req) => {
  // CORS headers for development
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers, status: 204 });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers }
    );
  }

  try {
    const requestData: OAuthRequest = await req.json();
    const { action, service, code, refresh_token, user_id, redirect_uri, state } = requestData;

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      throw new Error("Google OAuth credentials not configured");
    }

    switch (action) {
      case 'initiate':
        return handleInitiate(service, redirect_uri, state, headers);
      
      case 'exchange':
        return await handleExchange(service, code!, redirect_uri!, user_id, headers);
      
      case 'refresh':
        return await handleRefresh(refresh_token!, headers);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Google OAuth error:', error);
    return new Response(
      JSON.stringify({ 
        error: "OAuth operation failed", 
        details: error.message 
      }),
      { status: 500, headers }
    );
  }
});

function handleInitiate(service: string, redirectUri?: string, state?: string, headers: Record<string, string>) {
  try {
    const scopes = GOOGLE_SCOPES[service as keyof typeof GOOGLE_SCOPES];
    if (!scopes) {
      throw new Error(`Unknown service: ${service}`);
    }

    const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID!,
      redirect_uri: redirectUri || `${new URL(Deno.env.get("SUPABASE_URL")!).origin}/functions/v1/google-oauth`,
      response_type: "code",
      scope: scopes.join(" "),
      access_type: "offline",
      prompt: "consent"
    });

    if (state) {
      params.append("state", state);
    }

    const authUrl = `${baseUrl}?${params.toString()}`;

    return new Response(
      JSON.stringify({
        success: true,
        authUrl,
        message: "Redirect user to this URL to start OAuth flow"
      }),
      { status: 200, headers }
    );
  } catch (error) {
    throw new Error(`Failed to initiate OAuth: ${error.message}`);
  }
}

async function handleExchange(service: string, code: string, redirectUri: string, userId?: string, headers: Record<string, string>) {
  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(`Token exchange failed: ${errorData.error_description || errorData.error}`);
    }

    const tokenData = await tokenResponse.json();
    
    // Get user information
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to get user information");
    }

    const userData = await userResponse.json();

    // Store the connection in Supabase if user_id is provided
    if (userId) {
      try {
        await supabase
          .from('user_connections')
          .upsert({
            user_id: userId,
            platform_id: `google-${service}`,
            platform_name: `Google ${service.charAt(0).toUpperCase() + service.slice(1)}`,
            credentials: {
              access_token: tokenData.access_token,
              refresh_token: tokenData.refresh_token,
              expires_in: tokenData.expires_in,
              scope: tokenData.scope,
              token_type: tokenData.token_type,
            },
            settings: {
              google_user_id: userData.id,
              email: userData.email,
              name: userData.name,
              picture: userData.picture,
            },
            is_active: true,
            last_connected: new Date().toISOString(),
          }, {
            onConflict: 'user_id,platform_id'
          });
      } catch (dbError) {
        console.error('Failed to store connection in database:', dbError);
        // Continue anyway, return the tokens to the client
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        user: userData,
        message: "OAuth exchange successful"
      }),
      { status: 200, headers }
    );
  } catch (error) {
    throw new Error(`Token exchange failed: ${error.message}`);
  }
}

async function handleRefresh(refreshToken: string, headers: Record<string, string>) {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Token refresh failed: ${errorData.error_description || errorData.error}`);
    }

    const tokenData = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        access_token: tokenData.access_token,
        expires_in: tokenData.expires_in,
        message: "Token refreshed successfully"
      }),
      { status: 200, headers }
    );
  } catch (error) {
    throw new Error(`Token refresh failed: ${error.message}`);
  }
}

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { 
      headers, 
      status: 405 
    });
  }

  try {
    const requestData = await req.json();
    const { code, redirectUri, service, refresh_token } = requestData;

    // Handle token refresh if refresh token is provided
    if (refresh_token) {
      return await handleTokenRefresh(refresh_token, service, headers);
    }

    // Validate required parameters for new token requests
    if (!code || !redirectUri || !service) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }), 
        { headers, status: 400 }
      );
    }

    // Validate service type
    if (!GOOGLE_SCOPES[service]) {
      return new Response(
        JSON.stringify({ error: `Unsupported service: ${service}` }), 
        { headers, status: 400 }
      );
    }

    // Exchange authorization code for tokens
    const tokenUrl = "https://oauth2.googleapis.com/token";
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      })
    });

    const tokenData = await tokenResponse.json();

    // Check for OAuth errors
    if (tokenData.error) {
      console.error(`Google OAuth error: ${tokenData.error}`, tokenData.error_description);
      return new Response(
        JSON.stringify({ 
          error: tokenData.error, 
          description: tokenData.error_description 
        }), 
        { headers, status: 400 }
      );
    }

    // Return the tokens
    return new Response(JSON.stringify(tokenData), { headers });
  } catch (error) {
    console.error("Error in Google OAuth function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: error.message }), 
      { headers, status: 500 }
    );
  }
});

/**
 * Handle refreshing an expired access token
 */
async function handleTokenRefresh(refreshToken: string, service: string, headers: any) {
  try {
    const tokenUrl = "https://oauth2.googleapis.com/token";
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        grant_type: "refresh_token"
      })
    });

    const tokenData = await response.json();

    // Check for OAuth errors
    if (tokenData.error) {
      console.error(`Google token refresh error: ${tokenData.error}`, tokenData.error_description);
      return new Response(
        JSON.stringify({ 
          error: tokenData.error, 
          description: tokenData.error_description 
        }), 
        { headers, status: 400 }
      );
    }

    // Add the refresh token back since Google doesn't return it again
    tokenData.refresh_token = refreshToken;
    
    return new Response(JSON.stringify(tokenData), { headers });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return new Response(
      JSON.stringify({ error: "Token refresh failed", message: error.message }), 
      { headers, status: 500 }
    );
  }
}
