
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import React, { ReactNode } from 'react';

interface AuthWrapperProps {
  children: ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const userButton = <UserButton afterSignOutUrl="/" />;

  return (
    <>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Yeti</h1>
              <p className="text-gray-600 mb-6">Sign in to access your AI assistant and platform connections</p>
              <SignInButton mode="modal">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { userButton } as any);
          }
          return child;
        })}
      </SignedIn>
    </>
  );
};
