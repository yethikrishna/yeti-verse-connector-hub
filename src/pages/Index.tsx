import { useState } from "react";
import { YetiSidebar } from "@/components/YetiSidebar";
import { YetiChatInterface } from "@/components/YetiChatInterface";
import { AuthenticatedConnectionsView } from "@/components/AuthenticatedConnectionsView";
import { useIsMobile } from "@/hooks/use-mobile";

type View = 'chat' | 'connections';

import { useUserButton } from "@/contexts/UserButtonContext";

const Index = () => {
  const userButton = useUserButton();
  const [currentView, setCurrentView] = useState<View>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleShowConnections = () => {
    console.log('Switching to connections view');
    setCurrentView('connections');
    if (isMobile) setSidebarOpen(false);
  };

  const handleShowChat = () => {
    console.log('Switching to chat view');
    setCurrentView('chat');
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex bg-slate-50 relative">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        ${isMobile 
          ? `fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`
          : 'relative'
        }
      `}>
        <YetiSidebar 
          onShowConnections={handleShowConnections}
          currentView={currentView}
          onShowChat={handleShowChat}
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {currentView === 'chat' ? (
          <YetiChatInterface userButton={userButton} />
        ) : (
          <div className="flex-1 overflow-auto p-3 sm:p-6">
            <div className="max-w-7xl mx-auto">
              <AuthenticatedConnectionsView />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;