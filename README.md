# 🧊 Yeti AI Platform - Complete AI-Powered Application

[![Deploy](https://img.shields.io/badge/Deploy-Ready-brightgreen)](https://your-deployment-url.com)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)
[![AI Powered](https://img.shields.io/badge/AI-Powered-purple)](https://github.com/your-username/yeti-ai)

> **Transform your ideas into reality with Yeti AI - A comprehensive AI platform featuring chat, image generation, video creation, and advanced AI tools.**

## 🚀 What is Yeti AI?

Yeti AI is a **production-ready AI platform** that provides:

- **🧠 Multi-Model AI Chat** - GPT-4, Claude, Gemini, Llama with automatic fallbacks
- **🎨 AI Image Generation** - Flux models for stunning artwork
- **🎬 AI Video Creation** - Minimax for video generation
- **🎤 Text-to-Speech** - Natural voice synthesis
- **🧊 Smart Memory** - Persistent conversation history
- **🔧 AI Tools Suite** - Comprehensive productivity tools
- **👥 Team Collaboration** - Multi-user support
- **🔒 Enterprise Security** - Production-grade safety

## ⚡ Quick Start

### 1. Environment Setup (2 minutes)
```bash
# Clone and setup
git clone <your-repo>
cd yeti-ai
cp .env.example .env.local

# Install dependencies
npm install  # or bun install
```

### 2. Configure API Keys (5 minutes)
Edit `.env.local` with your API keys:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Get these from respective providers:
OPENAI_API_KEY=your_openai_key
OPENROUTER_API_KEY=your_openrouter_key
GEMINI_API_KEY=your_gemini_key
A4F_API_KEY=your_a4f_key
```

### 3. Deploy & Run (3 minutes)
```bash
# Use the automated deployment script
./scripts/deploy-yeti.sh full

# Or step by step:
./scripts/deploy-yeti.sh setup
./scripts/deploy-yeti.sh functions
./scripts/deploy-yeti.sh dev
```

**🎉 Your Yeti AI platform is now running at `http://localhost:3000`**

## 🔗 Platform Connections

### Real API Integrations

Yeti AI now includes **real API implementations** for major platforms:

#### **Social Media**
- **Twitter/X API v2** - Post tweets, read timelines, search, like, retweet
- **Facebook Graph API v19** - Create posts, manage pages, upload media, get insights  
- **LinkedIn API v2** - Share posts, manage company pages, upload media
- **Instagram Basic Display** - View posts, media, user info

#### **Productivity**
- **Gmail API v1** - Send/receive emails, search, labels, drafts
- **Google Drive API v3** - File management, sharing, folder operations
- **Google Sheets API v4** - Spreadsheet read/write operations
- **Google Docs API v1** - Document creation and editing
- **Notion API v1** - Database queries, page creation, block operations
- **Slack API** - Send messages, manage channels, file uploads

#### **Development**
- **GitHub API v3** - Repository management, issues, pull requests
- **GitHub Pages** - Enable/disable, configure deployments

### Database Integration

All platform connections are now stored in **Supabase with RLS**:
- **user_connections** - Secure credential storage
- **mcp_execution_logs** - Platform operation logging  
- **oauth_states** - OAuth flow state management

### Authentication Flow

1. **OAuth 2.0** - Proper authorization flows for each platform
2. **Token Management** - Secure storage and refresh handling
3. **Fallback Support** - Graceful degradation to localStorage
4. **Error Handling** - Comprehensive error messages and recovery

### Setup Platform Connections

```bash
# 1. Run database migrations
supabase migration up

# 2. Set up OAuth credentials in Supabase Edge Functions
# Add these environment variables:
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_secret
# ... (add more as needed)

# 3. Deploy edge functions
supabase functions deploy

# 4. Test platform connections in the UI
npm run dev
```

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **Radix UI** components
- **Clerk** authentication
- **Supabase** client integration

### Backend
- **Supabase Edge Functions** (Deno runtime)
- **PostgreSQL** database
- **Real-time subscriptions**
- **Multi-provider AI integration**

### AI Providers
- **OpenAI** (GPT-4, GPT-4 Turbo, TTS)
- **OpenRouter** (Claude, Llama, Mixtral)
- **Google Gemini** (Gemini 1.5 Pro/Flash)
- **A4F** (Flux image, Minimax video)
- **Automatic fallbacks** for 99% uptime

## 🎯 Features

### Core AI Features
- [x] **Multi-model Chat** - 7 AI providers with smart fallbacks
- [x] **Image Generation** - Flux 1.0 Schnell for instant art
- [x] **Video Generation** - Minimax for short video clips
- [x] **Text-to-Speech** - OpenAI TTS with 6 voices
- [x] **Voice Input** - Speech-to-text for hands-free use
- [x] **Smart Memory** - Persistent conversation history
- [x] **Session Management** - Multiple conversation threads

### Advanced Features
- [x] **Tool Launcher** - 8+ AI-powered productivity tools
- [x] **Real-time Processing** - Instant AI responses
- [x] **Mobile Responsive** - Works on all devices
- [x] **Dark/Light Mode** - Customizable interface
- [x] **Team Collaboration** - Multi-user support
- [x] **Usage Analytics** - Performance monitoring
- [x] **Security Center** - Advanced safety features

## 🔧 Development

### Project Structure
```
yeti-ai/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Application pages
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilities and helpers
│   └── integrations/  # API integrations
├── supabase/
│   ├── functions/     # Edge functions
│   └── migrations/    # Database migrations
├── scripts/           # Deployment scripts
└── docs/             # Documentation
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript
```

## 🌟 Getting API Keys

### Required API Keys
1. **OpenAI**: [platform.openai.com](https://platform.openai.com) - For GPT-4 and TTS
2. **OpenRouter**: [openrouter.ai](https://openrouter.ai) - For Claude, Llama, etc.
3. **Google Gemini**: [aistudio.google.com](https://aistudio.google.com) - For Gemini models
4. **A4F**: [a4f.co](https://a4f.co) - For image/video generation
5. **Clerk**: [clerk.com](https://clerk.com) - For authentication
6. **Supabase**: [supabase.com](https://supabase.com) - For database/backend

### Optional API Keys
- **Novita AI**: [novita.ai](https://novita.ai) - Additional AI models
- **Anthropic**: [anthropic.com](https://anthropic.com) - Direct Claude access

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Self-Hosted
```bash
npm run build
# Deploy dist/ folder to your server
```

## 🧪 Testing

### Manual Testing
1. **Chat**: Send messages and verify AI responses
2. **Image Gen**: Generate images with various prompts
3. **Video Gen**: Create short videos (may take 2-3 minutes)
4. **TTS**: Convert text to speech and download
5. **Memory**: Check conversation persistence

### Automated Testing
```bash
npm run test        # Run unit tests
npm run test:e2e    # Run end-to-end tests
```

## 🔍 Troubleshooting

### Common Issues

**Q: Chat not responding?**
A: Check API keys in Supabase dashboard → Settings → Edge Functions

**Q: Image generation fails?**
A: Verify A4F API key and account credits

**Q: Functions not found?**
A: Run `supabase functions deploy` to deploy edge functions

**Q: CORS errors?**
A: Check Supabase URL and anon key in .env.local

### Debug Mode
```bash
# Enable debug logging
export VITE_DEBUG=true
npm run dev
```

## 📊 Performance

### Expected Performance
- **Chat Response**: 2-5 seconds (with fallbacks)
- **Image Generation**: 10-30 seconds (1024x1024)
- **Video Generation**: 60-180 seconds (5-second clips)
- **TTS Generation**: 2-10 seconds
- **Memory Operations**: <1 second

### Optimization Tips
1. Use OpenAI for fastest chat responses
2. Cache frequently used images/videos
3. Implement request queuing for high load
4. Monitor API usage and costs

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

### Q1 2024
- [ ] Advanced RAG integration
- [ ] Custom model fine-tuning
- [ ] API documentation
- [ ] Advanced analytics

### Q2 2024
- [ ] Plugin system
- [ ] Enterprise features
- [ ] Multi-language support
- [ ] Advanced security features

## 🆘 Support

- **Documentation**: [Full Setup Guide](YETI_AI_SETUP_GUIDE.md)
- **Analysis**: [Technical Analysis](YETI_AI_ANALYSIS_REPORT.md)
- **Issues**: [GitHub Issues](https://github.com/your-username/yeti-ai/issues)

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 and TTS APIs
- **Anthropic** for Claude models
- **Google** for Gemini AI
- **Supabase** for backend infrastructure
- **Clerk** for authentication
- **Vercel** for deployment platform

---

**🧊 Built with Yeti AI Platform** - From concept to production in hours, not months.

### Quick Links
- [🚀 Setup Guide](YETI_AI_SETUP_GUIDE.md)
- [📊 Technical Analysis](YETI_AI_ANALYSIS_REPORT.md)
- [🔧 API Documentation](docs/API.md)
- [🎯 Deployment Script](scripts/deploy-yeti.sh)
