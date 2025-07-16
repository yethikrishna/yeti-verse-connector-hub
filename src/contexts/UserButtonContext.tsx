import { createContext, useContext, ReactNode } from 'react';

const UserButtonContext = createContext<ReactNode | undefined>(undefined);

export const UserButtonProvider = ({ children, userButton }: { children: ReactNode, userButton: ReactNode }) => {
  return (
    <UserButtonContext.Provider value={userButton}>
      {children}
    </UserButtonContext.Provider>
  );
};

export const useUserButton = () => {
  return useContext(UserButtonContext);
};
