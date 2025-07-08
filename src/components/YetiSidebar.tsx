
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  Settings, 
  Zap, 
  BarChart3, 
  Users,
  Workflow,
  Shield,
  Brain,
  PlusCircle,
  Activity,
  TrendingUp,
  Wrench,
  Computer,
  Globe,
  Mic2,
  Image,
  Sparkles
} from "lucide-react";
import { usePlatforms } from "@/hooks/usePlatforms";
import { useToast } from "@/hooks/use-toast";

interface YetiSidebarProps {
  onShowConnections: () => void;
  currentView: string;
  onShowChat: () => void;
}

export function YetiSidebar({ onShowConnections, currentView, onShowChat }: YetiSidebarProps) {
  const { connectedPlatforms } = usePlatforms();
  const [activeSection, setActiveSection] = useState<string>('chat');
  const { toast } = useToast();
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: 'chat',
      label: 'AI Chat',
      icon: MessageCircle,
      onClick: () => {
        setActiveSection('chat');
        onShowChat();
      },
      badge: null
    },
    {
      id: 'connections',
      label: 'Platforms',
      icon: Zap,
      onClick: () => {
        setActiveSection('connections');
        navigate('/connections');
      },
      badge: connectedPlatforms.length > 0 ? connectedPlatforms.length : null
    },
    {
      id: 'workflows',
      label: 'Workflows',
      icon: Workflow,
      onClick: () => {
        setActiveSection('workflows');
        navigate('/workflows');
      },
      badge: null
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      onClick: () => {
        setActiveSection('analytics');
        navigate('/analytics');
      },
      badge: null
    }
  ];

  const toolsItems = [
    {
      id: 'ai-tools',
      label: 'AI Tools',
      icon: Wrench,
      onClick: () => navigate('/tools'),
      badge: null
    },
    {
      id: 'model-config',
      label: 'AI Models',
      icon: Brain,
      onClick: () => navigate('/models'),
      badge: null
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      onClick: () => navigate('/security'),
      badge: null
    },
    {
      id: 'teams',
      label: 'Teams',
      icon: Users,
      onClick: () => navigate('/teams'),
      badge: null
    }
  ];

  const powerAppsItems = [
    {
      id: 'computer',
      label: 'Virtual Computer',
      icon: Computer,
      onClick: () => navigate('/computer'),
      badge: null
    },
    {
      id: 'browser',
      label: 'AI Browser',
      icon: Globe,
      onClick: () => navigate('/browser'),
      badge: null
    },
    {
      id: 'vocoder',
      label: 'Voice Studio',
      icon: Mic2,
      onClick: () => navigate('/vocoder'),
      badge: null
    },
    {
      id: 'image-studio',
      label: 'Image Studio',
      icon: Image,
      onClick: () => navigate('/image-studio'),
      badge: null
    },
    {
      id: 'multimodal-studio',
      label: 'Multimodal Studio',
      icon: Sparkles,
      onClick: () => navigate('/studio'),
      badge: 'NEW'
    }
  ];

  const quickStats = [
    {
      label: 'Active Models',
      value: '6',
      icon: Brain,
      color: 'text-blue-600'
    },
    {
      label: 'Connected',
      value: connectedPlatforms.length.toString(),
      icon: Zap,
      color: 'text-green-600'
    },
    {
      label: 'Workflows',
      value: '3',
      icon: Workflow,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">🧊</span>
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-900">Yeti AI</h1>
            <p className="text-sm text-gray-500">v18.0 Builder</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {/* Quick Stats */}
        <div className="p-4 space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Dashboard</h3>
          <div className="grid grid-cols-1 gap-2">
            {quickStats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-sm text-gray-600">{stat.label}</span>
                </div>
                <Badge variant="outline">{stat.value}</Badge>
              </div>
            ))}
          </div>
        </div>

        <Separator className="mx-4" />

        {/* Main Navigation */}
        <div className="p-4 space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Navigation</h3>
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id || activeSection === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={item.onClick}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        <Separator className="mx-4" />

        {/* AI Tools & Models */}
        <div className="p-4 space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">AI Tools</h3>
          {toolsItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start"
              onClick={item.onClick}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        <Separator className="mx-4" />

        {/* Power Apps */}
        <div className="p-4 space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Power Apps</h3>
          {powerAppsItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start"
              onClick={item.onClick}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        <Separator className="mx-4" />

        {/* Recent Activity */}
        <div className="p-4 space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recent Activity</h3>
          <div className="space-y-2">
            <div className="text-xs text-gray-600 p-2 bg-blue-50 rounded">
              <div className="flex items-center space-x-2">
                <Activity className="h-3 w-3 text-blue-500" />
                <span>AI model deployed</span>
              </div>
              <div className="text-gray-500 mt-1">2 minutes ago</div>
            </div>
            <div className="text-xs text-gray-600 p-2 bg-green-50 rounded">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>Workflow executed</span>
              </div>
              <div className="text-gray-500 mt-1">5 minutes ago</div>
            </div>
            <div className="text-xs text-gray-600 p-2 bg-purple-50 rounded">
              <div className="flex items-center space-x-2">
                <Brain className="h-3 w-3 text-purple-500" />
                <span>New AI chat session</span>
              </div>
              <div className="text-gray-500 mt-1">8 minutes ago</div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <Button
          variant="outline"
          className="w-full mb-2"
          onClick={() => navigate('/system-test')}
        >
          <Activity className="h-4 w-4 mr-2" />
          System Test
        </Button>
        <Button
          variant="outline"
          className="w-full mb-2"
          onClick={() => {
            // Show debug panel in a modal or redirect
            console.log('Debug panel requested');
            toast({
              title: "🔧 Debug Mode",
              description: "Use System Test page for comprehensive debugging",
            });
          }}
        >
          <Wrench className="h-4 w-4 mr-2" />
          Debug Chat
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('/models')}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
}
