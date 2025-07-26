
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { ReactNode } from 'react';
import { Landing } from './Landing';

interface AuthWrapperProps {
  children: ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  // Check if we have a Clerk publishable key
  const hasClerkKey = !!((import.meta as { env?: { VITE_CLERK_PUBLISHABLE_KEY?: string } }).env?.VITE_CLERK_PUBLISHABLE_KEY);
  
  // If no Clerk key is available, always show the Landing page
  if (!hasClerkKey) {
    return <Landing />;
  }

  return (
    <>
      <SignedOut>
        <Landing />
      </SignedOut>
      <SignedIn>
        <div className="absolute top-4 right-4 z-50">
          <UserButton afterSignOutUrl="/" />
        </div>
        {children}
      </SignedIn>
    </>
  );
};
