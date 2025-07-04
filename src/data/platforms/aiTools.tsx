import { Platform } from "@/types/platform";
import { 
  Bot, Cpu, Palette, Video, Headphones 
} from "lucide-react";

export const aiToolsPlatforms: Platform[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    category: 'ai-tools',
    icon: <Bot size={22} />,
    description: 'GPT models, DALL-E, and AI capabilities',
    isConnected: false,
    requiresAuth: true,
    authType: 'api-key',
    capabilities: ['execute'],
    status: 'active'
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    category: 'ai-tools',
    icon: <Bot size={22} />,
    description: 'Claude AI assistant and language model',
    isConnected: false,
    requiresAuth: true,
    authType: 'api-key',
    capabilities: ['execute'],
    status: 'active'
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    category: 'ai-tools',
    icon: <Cpu size={22} />,
    description: 'Access to thousands of AI models',
    isConnected: false,
    requiresAuth: true,
    authType: 'api-key',
    capabilities: ['execute', 'search'],
    status: 'active'
  },
  // Leonardo, Runway ML, Veo, Sora, Luma, Krea, ElevenLabs
  {
    id: 'leonardo',
    name: 'Leonardo',
    category: 'ai-tools',
    icon: <Palette size={22} />,
    description: 'AI-powered image generation tool.',
    isConnected: false,
    requiresAuth: true,
    authType: 'oauth',
    capabilities: ['execute', 'upload'],
    status: 'coming-soon',
  },
  {
    id: 'runway-ml',
    name: 'Runway ML',
    category: 'ai-tools',
    icon: <Video size={22} />,
    description: 'AI for video and creative workflows.',
    isConnected: false,
    requiresAuth: true,
    authType: 'oauth',
    capabilities: ['execute', 'upload'],
    status: 'coming-soon',
  },
  {
    id: 'veo',
    name: 'Veo',
    category: 'ai-tools',
    icon: <Video size={22} />,
    description: 'Generative AI video creation.',
    isConnected: false,
    requiresAuth: true,
    authType: 'oauth',
    capabilities: ['execute', 'upload'],
    status: 'coming-soon',
  },
  {
    id: 'sora',
    name: 'Sora',
    category: 'ai-tools',
    icon: <Video size={22} />,
    description: 'Advanced video generative AI.',
    isConnected: false,
    requiresAuth: true,
    authType: 'oauth',
    capabilities: ['execute', 'upload'],
    status: 'coming-soon',
  },
  {
    id: 'luma',
    name: 'Luma',
    category: 'ai-tools',
    icon: <Video size={22} />,
    description: '3D video, photo, and AI imaging.',
    isConnected: false,
    requiresAuth: true,
    authType: 'oauth',
    capabilities: ['execute', 'upload'],
    status: 'coming-soon',
  },
  {
    id: 'krea',
    name: 'Krea',
    category: 'ai-tools',
    icon: <Palette size={22} />,
    description: 'Realtime generative AI art creation.',
    isConnected: false,
    requiresAuth: true,
    authType: 'oauth',
    capabilities: ['execute', 'upload'],
    status: 'coming-soon',
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    category: 'ai-tools',
    icon: <Headphones size={22} />,
    description: 'AI text-to-speech and voice synthesis.',
    isConnected: false,
    requiresAuth: true,
    authType: 'oauth',
    capabilities: ['execute'],
    status: 'coming-soon',
  },
];
