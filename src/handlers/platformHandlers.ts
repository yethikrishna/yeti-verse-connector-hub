import { githubHandler } from './githubHandler';
import { gmailHandler } from './gmailHandler';
import { googleDriveHandler } from './googleDriveHandler';
import { openaiHandler } from './openaiHandler';
import { slackHandler } from './slackHandler';
import { notionHandler } from './notionHandler';
import { stripeHandler } from './stripeHandler';
import { twitterHandler } from './twitterHandler';
import { facebookHandler } from './facebookHandler';
import { instagramHandler } from './instagramHandler';
import { linkedinHandler } from './linkedinHandler';
import { tiktokHandler } from './tiktokHandler';
import { twitterHandler } from './twitter';
import { facebookHandler } from './facebook';
import { instagramHandler } from './instagram';
import { linkedinHandler } from './linkedin';
import { tiktokHandler } from './tiktok';
import { kooHandler } from './koo';
import { sharechatHandler } from './sharechat';
import { huggingfaceHandler } from './huggingfaceHandler';
import { anthropicHandler } from './anthropicHandler';
import { vercelHandler } from './vercelHandler';
import { netlifyHandler } from './netlifyHandler';
import { firebaseHandler } from './firebaseHandler';
import { airtableHandler } from './airtableHandler';
import { githubPagesHandler } from './githubPagesHandler';
import { googleDocsHandler } from './googleDocsHandler';
import { googleSheetsHandler } from './googleSheetsHandler';
import { notionHandler } from './notionHandler';

// Export platform handlers with proper mapping to MCP server implementations
export const platformHandlers = {
  'github': githubHandler,
  'github_pages': githubPagesHandler, // Updated to match McpServerType.GITHUB_PAGES
  'gmail': gmailHandler,
  'google-drive': googleDriveHandler,
  'openai': openaiHandler,
  'slack': slackHandler,
  'notion': notionHandler,
  'stripe': stripeHandler,
  'twitter': twitterHandler,
  'facebook': facebookHandler,
  'instagram': instagramHandler,
  'linkedin': linkedinHandler,
  'tiktok': tiktokHandler,
  'twitter': twitterHandler,
  'facebook': facebookHandler,
  'instagram': instagramHandler,
  'linkedin': linkedinHandler,
  'tiktok': tiktokHandler,
  'koo': kooHandler,
  'sharechat': sharechatHandler,
  'huggingface': huggingfaceHandler,
  'anthropic': anthropicHandler,
  'vercel': vercelHandler,
  'netlify': netlifyHandler,
  'firebase': firebaseHandler,
  'airtable': airtableHandler,
  'google-docs': googleDocsHandler,
  'google-sheets': googleSheetsHandler,
  'notion': notionHandler
};

export const isPlatformSupported = (platformId: string): boolean => {
  return platformId in platformHandlers;
};

export const getPlatformHandler = (platformId: string) => {
  return platformHandlers[platformId as keyof typeof platformHandlers];
};

// Export specific handlers for MCP server implementations
export { githubHandler };
export { githubPagesHandler };
export { instagramHandler };
export { facebookHandler };
export { twitterHandler };