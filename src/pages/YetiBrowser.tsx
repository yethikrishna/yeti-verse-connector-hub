
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";
import { YetiLayout } from "@/components/layout/YetiLayout";
import { Globe, Bookmark, History, Shield, Zap, RefreshCw, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface YetiBrowserProps {
  userButton?: ReactNode;
}

const YetiBrowser = ({ userButton }: YetiBrowserProps) => {
  const { toast } = useToast();
  const [url, setUrl] = useState("https://yeti-ai.com");
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = async () => {
    setIsLoading(true);
    toast({
      title: "🧊 Yeti Browser",
      description: `Navigating to ${url}...`,
    });
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "✅ Page Loaded",
        description: "AI-enhanced browsing ready!",
      });
    }, 2000);
  };

  const bookmarks = [
    { name: "🧊 Yeti AI", url: "https://yeti-ai.com", category: "AI Tools" },
    { name: "GitHub", url: "https://github.com", category: "Development" },
    { name: "Stack Overflow", url: "https://stackoverflow.com", category: "Development" },
    { name: "OpenAI", url: "https://openai.com", category: "AI Tools" },
    { name: "Google Cloud AI", url: "https://cloud.google.com/ai", category: "AI Tools" },
    { name: "Hugging Face", url: "https://huggingface.co", category: "AI Tools" }
  ];

  const browserHistory = [
    { title: "🧊 Yeti AI Platform", url: "https://yeti-ai.com", time: "2 minutes ago" },
    { title: "OpenAI Documentation", url: "https://docs.openai.com", time: "5 minutes ago" },
    { title: "GitHub - Yeti Project", url: "https://github.com/yeti-ai", time: "10 minutes ago" },
    { title: "Google Gemini API", url: "https://ai.google.dev", time: "15 minutes ago" },
    { title: "Anthropic Claude", url: "https://claude.ai", time: "20 minutes ago" }
  ];

  const aiFeatures = [
    {
      name: "🤖 Smart Summarization",
      description: "Automatically summarize web pages with AI",
      active: true
    },
    {
      name: "🔍 Intelligent Search",
      description: "Enhanced search with AI-powered suggestions",
      active: true
    },
    {
      name: "🛡️ AI Security Shield",
      description: "Real-time threat detection and blocking",
      active: true
    },
    {
      name: "📝 Auto Translation",
      description: "Translate pages in real-time",
      active: false
    },
    {
      name: "🎯 Content Filtering",
      description: "AI-powered content filtering and recommendations",
      active: true
    }
  ];

  return (
    <YetiLayout title="Yeti Browser" icon={Globe} userButton={userButton}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🧊 Yeti AI Browser</h1>
            <p className="text-gray-600 mt-2">AI-enhanced web browsing with intelligent features</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-green-600">
              <Shield className="h-4 w-4 mr-1" />
              Secure
            </Badge>
            <Badge variant="outline" className="text-blue-600">
              <Zap className="h-4 w-4 mr-1" />
              AI Enhanced
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="browser" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browser">Browser</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="ai-features">AI Features</TabsTrigger>
          </TabsList>

          <TabsContent value="browser" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  🧊 Yeti Web Browser
                </CardTitle>
                <CardDescription>AI-powered browsing with enhanced security and intelligence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Browser Controls */}
                <div className="flex gap-2 items-center">
                  <Button size="sm" variant="outline" disabled>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" disabled>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleNavigate}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Enter URL or search..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleNavigate()}
                      className="flex-1"
                    />
                    <Button onClick={handleNavigate} disabled={isLoading}>
                      {isLoading ? "Loading..." : "Go"}
                    </Button>
                  </div>
                </div>

                {/* Browser Window */}
                <div className="border rounded-lg h-96 bg-white">
                  <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-600">🧊 Yeti Browser - Secure Connection</div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-green-600">
                        <Shield className="h-3 w-3 mr-1" />
                        HTTPS
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6 h-full">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
                          <p className="text-gray-600">🧊 Yeti AI is loading the page...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="text-center">
                          <h2 className="text-2xl font-bold text-blue-600 mb-2">🧊 Welcome to Yeti AI</h2>
                          <p className="text-gray-600">Advanced AI Platform by Yethikrishna R</p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <Card className="p-4">
                            <h3 className="font-semibold mb-2">🤖 AI Models</h3>
                            <p className="text-sm text-gray-600">Access powerful AI models</p>
                          </Card>
                          <Card className="p-4">
                            <h3 className="font-semibold mb-2">🔧 Tools</h3>
                            <p className="text-sm text-gray-600">AI-powered productivity tools</p>
                          </Card>
                          <Card className="p-4">
                            <h3 className="font-semibold mb-2">📊 Analytics</h3>
                            <p className="text-sm text-gray-600">Detailed AI usage analytics</p>
                          </Card>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-blue-800 mb-2">🧊 AI Summary</h3>
                          <p className="text-sm text-blue-700">
                            This page showcases the Yeti AI platform, featuring advanced AI models, 
                            productivity tools, and comprehensive analytics. The platform is designed 
                            to provide enterprise-grade AI capabilities with user-friendly interfaces.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookmarks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5" />
                  Bookmarks
                </CardTitle>
                <CardDescription>Your saved AI and development resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookmarks.map((bookmark, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="font-medium">{bookmark.name}</div>
                          <div className="text-sm text-gray-500">{bookmark.url}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{bookmark.category}</Badge>
                        <Button size="sm" variant="outline">Visit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Browsing History
                </CardTitle>
                <CardDescription>Your recent AI-enhanced browsing activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {browserHistory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-gray-500">{item.url}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{item.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  🧊 AI-Enhanced Features
                </CardTitle>
                <CardDescription>Intelligent browsing features powered by Yeti AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{feature.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      </div>
                      <Badge variant={feature.active ? 'default' : 'secondary'}>
                        {feature.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">🧊 Yeti AI Integration</h3>
                  <p className="text-sm text-blue-700">
                    All AI features are powered by Yeti's advanced machine learning models, 
                    providing real-time analysis, content enhancement, and security protection 
                    as you browse the web.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </YetiLayout>
  );
};

export default YetiBrowser;
