<!--
SEO Keywords: integration hub, AI platform, React TypeScript, Vite, Supabase, Clerk authentication, Tailwind CSS, shadcn UI, AI chat, image generation, video creation, multi-platform integration, connector hub, AI tools platform
-->

<div align="center">

# YetiVerse Connector Hub

**Integration Hub for YetiVerse AI Platforms — Connect, Orchestrate, Create**

*AI Chat · Image Generation · Video Creation · Multi-Platform Integration · Real-time Sync*

[![React 18/19](https://img.shields.io/badge/react-latest-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/supabase-database-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Clerk](https://img.shields.io/badge/clerk-auth-violet?logo=clerk)](https://clerk.com/)
[![Vitest](https://img.shields.io/badge/vitest-testing-yellow?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Vercel](https://img.shields.io/badge/vercel-deploy-black?logo=vercel)](https://vercel.com/)
[![Netlify](https://img.shields.io/badge/netlify-deploy-00C7B7?logo=netlify)](https://netlify.com/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?logo=opensourceinitiative)](LICENSE)

<p align="center">
  <strong>AI Chat</strong> | <strong>Image Generation</strong> | <strong>Video Creation</strong> | <strong>Integrations</strong> | <strong>Authentication</strong>
</p>

</div>

---

## Overview

**YetiVerse Connector Hub** is the central integration hub for YetiVerse platforms — a comprehensive AI-powered application that connects multiple AI services, enabling chat, image generation, video creation, and advanced AI tooling through a unified interface. Built with React, TypeScript, and Vite, the hub leverages Supabase for data persistence, Clerk for authentication, and a rich ecosystem of integrations.

Transform your ideas into reality with a platform that brings together the best AI capabilities in one place — from conversational AI to creative media generation, all connected through a powerful hub architecture.

---

## Features

### AI Capabilities
- **AI Chat** — Intelligent conversational AI with context awareness
- **Image Generation** — AI-powered image creation and editing tools
- **Video Creation** — Video generation and processing capabilities
- **Advanced AI Tools** — Suite of AI-powered utilities for productivity and creativity
- **Multi-Model Support** — Connect to multiple AI providers through a unified interface

### Integration Hub
- **Multi-Platform Connectors** — Pre-built integrations with popular AI services
- **Real-time Data Sync** — Supabase-powered real-time data synchronization
- **Webhook Support** — Event-driven integration with external services
- **API Gateway** — Unified API layer for all connected services
- **Custom Integrations** — Framework for building your own connectors
- **Data Handlers** — Modular data processing pipelines

### Authentication & Security
- **Clerk Authentication** — Secure, modern authentication with social login, MFA, and more
- **Protected Routes** — Route-level authentication guards
- **User Management** — Profiles, sessions, and account management
- **Row Level Security** — Supabase RLS for data isolation

### Frontend & UX
- **Modern React** — Latest React with hooks and concurrent features
- **Tailwind CSS** — Utility-first responsive styling
- **shadcn/ui** — Premium UI components built on Radix UI
- **Framer Motion Ready** — Animation support for smooth interactions
- **React Hook Form** — Form handling with validation
- **Lucide Icons** — Consistent, beautiful iconography
- **Accessibility** — WCAG-compliant components via Radix UI primitives

### Testing & Quality
- **Vitest** — Fast unit testing with coverage reports
- **Accessibility Testing** — Automated a11y test suite
- **Performance Testing** — Performance benchmark tests
- **Integration Testing** — End-to-end integration tests
- **UI Testing** — Component-level test infrastructure

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18/19 |
| Language | TypeScript 5.x |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3, PostCSS |
| UI Components | shadcn/ui, Radix UI |
| Backend/Database | Supabase |
| Authentication | Clerk |
| Testing | Vitest (unit, a11y, performance, integration) |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Deployment | Vercel, Netlify |
| Development | Nix (dev.nix) |
| Code Quality | ESLint, Prettier |
| License | MIT |

---

## Quick Start

### Prerequisites

- Node.js >= 18
- npm or pnpm
- Supabase account (free tier available)
- Clerk account (free tier available)

### Installation

```bash
git clone https://github.com/yethikrishna/yeti-verse-connector-hub.git
cd yeti-verse-connector-hub

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase URL, anon key, Clerk publishable key, etc.

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev              # Start dev server on port 3000
npm run build            # Build for production
npm run build:dev        # Build in development mode
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run test             # Run Vitest tests
npm run test:run         # Run tests once (no watch)
npm run test:ui          # Run tests with UI
npm run test:coverage    # Run tests with coverage
npm run test:watch       # Run tests in watch mode
npm run test:accessibility  # Run accessibility tests
npm run test:performance    # Run performance tests
npm run test:integration    # Run integration tests
```

---

## Project Structure

```
yeti-verse-connector-hub/
├── src/
│   ├── components/            # React UI components
│   ├── pages/                 # Page-level components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions and helpers
│   ├── integrations/          # Platform integrations & connectors
│   ├── handlers/              # Data processing handlers
│   ├── data/                  # Static data and configurations
│   ├── types/                 # TypeScript type definitions
│   ├── test/                  # Test suites (accessibility, performance, integration)
│   ├── App.tsx                # Root App component
│   ├── App.css                # App-level styles
│   ├── main.tsx               # Application entry point
│   ├── index.css              # Global styles (Tailwind)
│   └── vite-env.d.ts          # Vite type definitions
├── supabase/                  # Supabase migrations and configs
├── scripts/                   # Build and utility scripts
├── public/                    # Static assets
├── netlify/                   # Netlify serverless functions
├── netlify.toml               # Netlify configuration
├── vercel.json                # Vercel configuration
├── components.json            # shadcn/ui configuration
├── tailwind.config.ts         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── vite.config.ts             # Vite configuration
├── vitest.config.ts           # Vitest configuration
├── tsconfig.json              # TypeScript base config
├── tsconfig.app.json          # App TypeScript config
├── tsconfig.node.json         # Node TypeScript config
├── eslint.config.js           # ESLint configuration
├── index.html                 # HTML entry point
├── dev.nix                    # Nix development environment
├── fix-build.patch            # Build fix patch
├── .env.example               # Environment variable template
├── package.json               # Dependencies and scripts
├── YETI_AI_SETUP_GUIDE.md     # Setup guide
├── YETI_AI_ANALYSIS_REPORT.md # Analysis report
└── README.md                  # This file
```

---

## Deployment

### Vercel

```bash
# Connect your repo to Vercel and deploy automatically
vercel deploy
```

### Netlify

```bash
# Build and deploy to Netlify
npm run build
netlify deploy --prod
```

### Environment Variables

Required environment variables (see `.env.example`):

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anonymous key
- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk publishable key

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes and add tests
4. Run `npm run lint` and `npm run test:run`
5. Submit a pull request

---

## Setup Guide & Documentation

- [Yeti AI Setup Guide](YETI_AI_SETUP_GUIDE.md)
- [Yeti AI Analysis Report](YETI_AI_ANALYSIS_REPORT.md)

---

## License

This project is licensed under the MIT License.

---

<div align="center">

**[YetiVerse Connector Hub](https://github.com/yethikrishna/yeti-verse-connector-hub)** — Connect your AI universe.

[Get Started](#quick-start) · [Report Bug](https://github.com/yethikrishna/yeti-verse-connector-hub/issues) · [Request Feature](https://github.com/yethikrishna/yeti-verse-connector-hub/issues)

</div>
