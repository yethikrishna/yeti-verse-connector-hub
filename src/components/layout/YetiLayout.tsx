
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { YetiSidebar } from "@/components/YetiSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface YetiLayoutProps {
  children: ReactNode;
  title:string;
  icon: React.ComponentType<{ className?: string }>;
  showBackButton?: boolean;
  userButton?: ReactNode;
}

export function YetiLayout({ children, title, icon: Icon, showBackButton = true, userButton }: YetiLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleShowConnections = () => {
    navigate('/');
    setSidebarOpen(false);
  };

  const handleShowChat = () => {
    navigate('/');
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Mobile sidebar */}
      {isMobile && (
        <div className={`
          fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }
        `}>
          <YetiSidebar 
            onShowConnections={handleShowConnections}
            currentView="other"
            onShowChat={handleShowChat}
          />
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-4">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSidebarOpen(true)}
              className="text-xs sm:text-sm"
            >
              <Menu className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}
          {showBackButton && (
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back to Chat</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
          )}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Icon className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900 text-sm sm:text-base">{title}</h1>
              <p className="text-xs sm:text-sm text-gray-500">Yeti AI v18.0</p>
            </div>
          </div>
          <div className="ml-auto">
            {userButton}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
