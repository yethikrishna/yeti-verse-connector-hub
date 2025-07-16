
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ReactNode } from "react";
import { YetiLayout } from "@/components/layout/YetiLayout";
import { Brain, Zap, Settings, Activity, TrendingUp, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface YetiModelsProps {
  userButton?: ReactNode;
}

const YetiModels = ({ userButton }: YetiModelsProps) => {
  const { toast } = useToast();
  const [models] = useState([
    {
      id: "yeti-core-2.5",
      name: "🧊 Yeti Core 2.5",
      description: "Advanced general-purpose AI model with enhanced reasoning",
      provider: "Google Gemini",
      status: "active",
      performance: 98,
      usage: "12.5K requests",
      cost: "$0.02/1K tokens",
      capabilities: ["Text Generation", "Code Analysis", "Reasoning", "Multi-modal"]
    },
    {
      id: "yeti-flash-2.0",
      name: "❄️ Yeti Flash 2.0", 
      description: "Ultra-fast model optimized for quick responses",
      provider: "Google Gemini",
      status: "active",
      performance: 95,
      usage: "8.7K requests",
      cost: "$0.01/1K tokens",
      capabilities: ["Text Generation", "Quick Responses", "Lightweight"]
    },
    {
      id: "yeti-reasoning-3.5",
      name: "🧠 Yeti Reasoning 3.5",
      description: "Specialized model for complex reasoning and analysis",
      provider: "Anthropic Claude",
      status: "active",
      performance: 97,
      usage: "5.2K requests", 
      cost: "$0.05/1K tokens",
      capabilities: ["Complex Reasoning", "Analysis", "Problem Solving", "Research"]
    },
    {
      id: "yeti-local-1.0",
      name: "🏠 Yeti Local 1.0",
      description: "On-device model for Indian languages and contexts",
      provider: "Sarvam AI",
      status: "active",
      performance: 92,
      usage: "3.1K requests",
      cost: "$0.03/1K tokens",
      capabilities: ["Indian Languages", "Cultural Context", "Local Processing"]
    },
    {
      id: "yeti-research-1.5",
      name: "🔍 Yeti Research 1.5",
      description: "Real-time web search and research capabilities",
      provider: "Perplexity",
      status: "active",
      performance: 94,
      usage: "4.8K requests",
      cost: "$0.04/1K tokens",
      capabilities: ["Web Search", "Real-time Data", "Fact Checking", "Research"]
    },
    {
      id: "yeti-creative-2.0",
      name: "🎨 Yeti Creative 2.0",
      description: "Optimized for creative writing and content generation",
      provider: "Mistral",
      status: "active",
      performance: 96,
      usage: "6.9K requests",
      cost: "$0.03/1K tokens",
      capabilities: ["Creative Writing", "Content Generation", "Multilingual", "Storytelling"]
    }
  ]);

  const [modelSettings, setModelSettings] = useState({
    temperature: [0.7],
    maxTokens: [1000],
    topP: [0.9],
    frequencyPenalty: [0.0]
  });

  const handleModelToggle = (modelId: string) => {
    toast({
      title: "🧊 Model Updated",
      description: `Yeti model configuration has been updated.`,
    });
  };

  return (
    <YetiLayout title="Yeti AI Models" icon={Brain} userButton={userButton}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🧊 Yeti AI Model Hub</h1>
            <p className="text-gray-600 mt-2">Manage and configure your AI models powered by industry leaders</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-green-600">
              <Activity className="h-4 w-4 mr-1" />
              {models.filter(m => m.status === 'active').length} Active Models
            </Badge>
            <Button>+ Add Model</Button>
          </div>
        </div>

        <Tabs defaultValue="models" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="models">Active Models</TabsTrigger>
            <TabsTrigger value="settings">Model Settings</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="marketplace">Model Store</TabsTrigger>
          </TabsList>

          <TabsContent value="models" className="space-y-6">
            <div className="grid gap-6">
              {models.map((model) => (
                <Card key={model.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {model.name}
                          <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                            {model.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-2">{model.description}</CardDescription>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                          <span>Provider: <strong>{model.provider}</strong></span>
                          <span>Usage: <strong>{model.usage}</strong></span>
                          <span>Cost: <strong>{model.cost}</strong></span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Performance</div>
                          <div className="text-2xl font-bold text-green-600">{model.performance}%</div>
                        </div>
                        <Switch 
                          checked={model.status === 'active'}
                          onCheckedChange={() => handleModelToggle(model.id)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {model.capabilities.map((capability, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  🧊 Yeti Model Configuration
                </CardTitle>
                <CardDescription>Fine-tune model parameters for optimal performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Temperature</label>
                        <span className="text-sm text-gray-500">{modelSettings.temperature[0]}</span>
                      </div>
                      <Slider
                        value={modelSettings.temperature}
                        onValueChange={(value) => setModelSettings({...modelSettings, temperature: value})}
                        max={2}
                        min={0}
                        step={0.1}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500">Controls randomness in responses</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Max Tokens</label>
                        <span className="text-sm text-gray-500">{modelSettings.maxTokens[0]}</span>
                      </div>
                      <Slider
                        value={modelSettings.maxTokens}
                        onValueChange={(value) => setModelSettings({...modelSettings, maxTokens: value})}
                        max={4000}
                        min={100}
                        step={100}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500">Maximum response length</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Top P</label>
                        <span className="text-sm text-gray-500">{modelSettings.topP[0]}</span>
                      </div>
                      <Slider
                        value={modelSettings.topP}
                        onValueChange={(value) => setModelSettings({...modelSettings, topP: value})}
                        max={1}
                        min={0}
                        step={0.1}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500">Controls diversity of responses</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Frequency Penalty</label>
                        <span className="text-sm text-gray-500">{modelSettings.frequencyPenalty[0]}</span>
                      </div>
                      <Slider
                        value={modelSettings.frequencyPenalty}
                        onValueChange={(value) => setModelSettings({...modelSettings, frequencyPenalty: value})}
                        max={2}
                        min={-2}
                        step={0.1}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500">Reduces repetitive content</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button className="flex-1">Save Configuration</Button>
                  <Button variant="outline">Reset to Default</Button>
                  <Button variant="outline">Export Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {models.slice(0, 3).map((model) => (
                <Card key={model.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <Badge variant="outline">{model.provider}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Performance</span>
                        <span className="font-bold text-green-600">{model.performance}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${model.performance}%` }}
                        ></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-gray-500">Requests</div>
                          <div className="font-semibold">{model.usage}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Cost</div>
                          <div className="font-semibold">{model.cost}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Analytics
                </CardTitle>
                <CardDescription>Detailed performance metrics for your Yeti models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">24.5K</div>
                    <div className="text-sm text-gray-600">Total Requests</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">98.2%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">1.2s</div>
                    <div className="text-sm text-gray-600">Avg Response</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">$127</div>
                    <div className="text-sm text-gray-600">Monthly Cost</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "🧊 Yeti Vision 3.0",
                  description: "Advanced computer vision and image understanding",
                  provider: "Google",
                  price: "$0.06/1K tokens",
                  rating: 4.8,
                  featured: true
                },
                {
                  name: "🎵 Yeti Audio 2.0", 
                  description: "Audio processing and music generation",
                  provider: "OpenAI",
                  price: "$0.04/1K tokens",
                  rating: 4.6,
                  featured: false
                },
                {
                  name: "📊 Yeti Analytics 1.5",
                  description: "Advanced data analysis and insights",
                  provider: "Anthropic",
                  price: "$0.08/1K tokens",
                  rating: 4.9,
                  featured: true
                },
                {
                  name: "🌐 Yeti Translator 2.5",
                  description: "Multi-language translation and localization",
                  provider: "Google",
                  price: "$0.02/1K tokens",
                  rating: 4.7,
                  featured: false
                },
                {
                  name: "🔒 Yeti Security 1.0",
                  description: "Cybersecurity analysis and threat detection",
                  provider: "Microsoft",
                  price: "$0.10/1K tokens",
                  rating: 4.5,
                  featured: false
                },
                {
                  name: "🤖 Yeti Assistant 3.0",
                  description: "General-purpose conversational AI",
                  provider: "OpenAI",
                  price: "$0.03/1K tokens",
                  rating: 4.9,
                  featured: true
                }
              ].map((model, index) => (
                <Card key={index} className={`${model.featured ? 'border-yellow-300 bg-yellow-50' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      {model.featured && <Badge className="bg-yellow-500">Featured</Badge>}
                    </div>
                    <CardDescription>{model.description}</CardDescription>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">by {model.provider}</span>
                      <div className="flex">
                        {"★".repeat(Math.floor(model.rating))}
                        <span className="ml-1">{model.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">{model.price}</span>
                      <Button size="sm">Add Model</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </YetiLayout>
  );
};

export default YetiModels;
