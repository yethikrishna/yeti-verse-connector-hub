import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Grid } from "@/components/ui/grid";
import { useToast } from "@/hooks/use-toast";
import { Zap, Code, Image as ImageIcon, Video as VideoIcon, Globe, Database, BarChart3, Settings } from "lucide-react";
import { useState } from "react";

// Define AI Tool interface
interface AITool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export function AIToolsLauncher() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Define available AI tools
  const aiTools: AITool[] = [
    {
      id: "code-assistant",
      name: "Code Assistant",
      description: "AI-powered code generation and debugging",
      icon: <Code className="h-6 w-6" />,
      color: "bg-blue-500"
    },
    {
      id: "image-generator",
      name: "Image Generator",
      description: "Create images from text descriptions",
      icon: <ImageIcon className="h-6 w-6" />,
      color: "bg-purple-500"
    },
    {
      id: "video-creator",
      name: "Video Creator",
      description: "Generate videos from text prompts",
      icon: <VideoIcon className="h-6 w-6" />,
      color: "bg-red-500"
    },
    {
      id: "web-scraper",
      name: "Web Scraper",
      description: "Extract information from websites",
      icon: <Globe className="h-6 w-6" />,
      color: "bg-green-500"
    },
    {
      id: "data-analyzer",
      name: "Data Analyzer",
      description: "Analyze and visualize data",
      icon: <Database className="h-6 w-6" />,
      color: "bg-yellow-500"
    },
    {
      id: "analytics-dashboard",
      name: "Analytics Dashboard",
      description: "View system and usage analytics",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "bg-indigo-500"
    },
    {
      id: "workflow-automator",
      name: "Workflow Automator",
      description: "Create AI-powered workflows",
      icon: <Zap className="h-6 w-6" />,
      color: "bg-orange-500"
    },
    {
      id: "settings-manager",
      name: "Settings Manager",
      description: "Configure AI models and preferences",
      icon: <Settings className="h-6 w-6" />,
      color: "bg-gray-500"
    }
  ];

  // Handle tool launch
  const handleLaunchTool = async (toolId: string) => {
    setIsLoading(toolId);
    try {
      // In a real implementation, this would launch the actual tool
      // For now, we'll simulate loading and show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Tool Launched",
        description: `Successfully launched ${aiTools.find(t => t.id === toolId)?.name}`,
      });

      // In a complete implementation, this would open the tool interface
      // Example: navigate to tool page, open modal, or initialize tool component
    } catch (error) {
      console.error(`Failed to launch tool ${toolId}:`, error);
      toast({
        title: "Launch Failed",
        description: `Could not launch the selected tool. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">AI Tools Launcher</h2>
      <Grid cols={1} sm={2} md={3} lg={4} gap={4}>
        {aiTools.map((tool) => (
          <Card key={tool.id} className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className={`w-10 h-10 rounded-full ${tool.color} flex items-center justify-center text-white mb-2`}>
                {tool.icon}
              </div>
              <CardTitle>{tool.name}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow"></CardContent>
            <CardFooter>
              <Button
                onClick={() => handleLaunchTool(tool.id)}
                disabled={isLoading !== null && isLoading !== tool.id}
                className="w-full"
              >
                {isLoading === tool.id ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    Launching...
                  </div>
                ) : (
                  "Launch Tool"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </Grid>
    </div>
  );
}