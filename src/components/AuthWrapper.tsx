
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { ReactNode } from 'react';
import { Landing } from './Landing';

interface AuthWrapperProps {
  children: ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
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
