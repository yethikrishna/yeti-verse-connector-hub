import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

const PUBLISHABLE_KEY = (import.meta as { env?: { VITE_CLERK_PUBLISHABLE_KEY?: string } }).env?.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn("Missing Clerk Publishable Key - Please set VITE_CLERK_PUBLISHABLE_KEY in your environment variables");
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/"
        appearance={{
          baseTheme: undefined,
          variables: {
            colorPrimary: "#2563eb"
          }
        }}
        localization={{
          signIn: {
            start: {
              title: "Sign in to Yeti",
              subtitle: "Welcome back! Please sign in to continue"
            }
          },
          signUp: {
            start: {
              title: "Create your account", 
              subtitle: "Welcome! Please fill in the details to get started"
            }
          }
        }}
        telemetry={false}
        standardBrowser={true}
      >
        <App />
      </ClerkProvider>
    ) : (
      <App />
    )}
  </StrictMode>
);
