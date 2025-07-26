
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { ReactNode } from 'react';

interface AuthWrapperProps {
  children: ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  // Temporary bypass for development
  return (
    <>
      <div className="absolute top-4 right-4 z-50">
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
      </div>
      {children}
    </>
  );
};
