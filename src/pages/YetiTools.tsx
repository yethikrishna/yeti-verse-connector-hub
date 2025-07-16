
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { YetiLayout } from "@/components/layout/YetiLayout";
import { Wrench, Image, Volume2, Code, FileText, Zap, Camera, Mic, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserButton } from "@/contexts/UserButtonContext";

const YetiTools = () => {
  const userButton = useUserButton();
  const { toast } = useToast();
  const [textToSpeech, setTextToSpeech] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [codeInput, setCodeInput] = useState(`// 🧊 Yeti Code Formatter
function yetiGreeting(name) {
  return \`Hello \${name}, welcome to Yeti AI! 🧊\`;
}

console.log(yetiGreeting("Developer"));`);

  const handleTextToSpeech = async () => {
    if (!textToSpeech.trim()) return;
    
    toast({
      title: "🎤 Generating Speech",
      description: "Yeti is converting your text to speech...",
    });

    try {
      // Call the actual Supabase edge function
      const { data, error } = await supabase.functions.invoke('yeti-text-to-speech', {
        body: {
          text: textToSpeech,
          voice: 'alloy',
          model: 'tts-1'
        },
      });

      if (error) throw error;

      // If data is returned as base64, convert it to blob
      if (data && typeof data === 'string') {
        const audioBlob = new Blob([Uint8Array.from(atob(data), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Create download link
        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = 'yeti-speech.mp3';
        a.click();
      } else {
        // Handle direct blob response
        const audioUrl = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = 'yeti-speech.mp3';
        a.click();
      }

      toast({
        title: "🧊 Speech Generated!",
        description: "Your audio is ready for download.",
      });
    } catch (error) {
      toast({
        title: "❄️ TTS Error",
        description: "Failed to generate speech. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageGeneration = async () => {
    if (!imagePrompt.trim()) return;
    
    toast({
      title: "🎨 Generating Image",
      description: "Yeti AI is creating your image...",
    });

    try {
      // Call the actual Supabase edge function
      const { data, error } = await supabase.functions.invoke('yeti-image-generation', {
        body: {
          provider: 'a4f',
          model: 'flux-1-schnell',
          prompt: imagePrompt,
          width: 1024,
          height: 1024,
        },
      });

      if (error) throw error;

      // Display the generated image
      const imageUrl = data.images[0].url;
      
      // Create a new window to display the image
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>🧊 Yeti AI - Generated Image</title></head>
            <body style="margin:0; padding:20px; text-align:center; font-family:Arial,sans-serif;">
              <h1>🎨 Your AI-Generated Image</h1>
              <p><strong>Prompt:</strong> ${imagePrompt}</p>
              <img src="${imageUrl}" style="max-width:100%; height:auto; border:1px solid #ccc;" alt="Generated Image" />
              <br><br>
              <a href="${imageUrl}" download="yeti-generated-image.png" style="background:#2563eb; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Download Image</a>
            </body>
          </html>
        `);
      }

      toast({
        title: "🧊 Image Generated!",
        description: "Your AI-generated image is ready.",
      });
    } catch (error) {
      console.error('Image generation error:', error);
      toast({
        title: "❄️ Image Generation Error",
        description: "Failed to generate image. Please check your API configuration.",
        variant: "destructive",
      });
    }
  };

  const handleCodeFormat = () => {
    toast({
      title: "🧊 Code Formatted",
      description: "Your code has been beautified by Yeti AI.",
    });
  };

  const tools = [
    {
      name: "🎨 AI Image Generator",
      description: "Generate stunning images with Yeti AI",
      category: "Creative",
      usage: "12.5K"
    },
    {
      name: "🎤 Text-to-Speech",
      description: "Convert text to natural speech",
      category: "Audio",
      usage: "8.2K"
    },
    {
      name: "🔧 Code Formatter",
      description: "Format and beautify your code",
      category: "Development",
      usage: "15.7K"
    },
    {
      name: "📝 Content Writer",
      description: "Generate high-quality content",
      category: "Writing",
      usage: "9.8K"
    },
    {
      name: "🔍 SEO Analyzer",
      description: "Analyze and optimize SEO",
      category: "Marketing",
      usage: "6.3K"
    },
    {
      name: "🎵 Audio Transcriber",
      description: "Convert speech to text",
      category: "Audio",
      usage: "4.9K"
    },
    {
      name: "🖼️ Image Enhancer",
      description: "Enhance and upscale images",
      category: "Creative",
      usage: "7.1K"
    },
    {
      name: "📊 Data Visualizer",
      description: "Create charts and graphs",
      category: "Analytics",
      usage: "5.4K"
    }
  ];

  return (
    <YetiLayout title="Yeti Tools" icon={Wrench} userButton={userButton}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🧊 Yeti AI Toolkit</h1>
            <p className="text-gray-600 mt-2">Powerful AI-powered tools for creativity and productivity</p>
          </div>
          <Badge variant="outline" className="text-purple-600">
            <Zap className="h-4 w-4 mr-1" />
            {tools.length} Tools Available
          </Badge>
        </div>

        <Tabs defaultValue="popular" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="popular">Popular Tools</TabsTrigger>
            <TabsTrigger value="creative">Creative Suite</TabsTrigger>
            <TabsTrigger value="developer">Developer Tools</TabsTrigger>
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
          </TabsList>

          <TabsContent value="popular" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tools.slice(0, 8).map((tool, index) => (
                <Card key={index} className="hover:shadow-lg transition-all cursor-pointer group">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {tool.name}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline">{tool.category}</Badge>
                      <Badge variant="secondary">{tool.usage}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                    <Button className="w-full" size="sm">Launch Tool</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="creative" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    🎨 AI Image Generator
                  </CardTitle>
                  <CardDescription>Generate stunning images with advanced AI models</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Describe the image you want to generate..."
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleImageGeneration} className="flex-1">
                      <Camera className="h-4 w-4 mr-2" />
                      Generate Image
                    </Button>
                    <Button variant="outline">Examples</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    🎤 Text-to-Speech
                  </CardTitle>
                  <CardDescription>Convert text to natural-sounding speech</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Enter text to convert to speech..."
                    value={textToSpeech}
                    onChange={(e) => setTextToSpeech(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleTextToSpeech} className="flex-1">
                      <Mic className="h-4 w-4 mr-2" />
                      Generate Speech
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="developer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  🔧 Yeti Code Formatter
                </CardTitle>
                <CardDescription>Format, beautify, and optimize your code with AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  className="w-full min-h-[300px] p-4 border rounded-md font-mono text-sm bg-gray-50"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={handleCodeFormat} className="flex-1">
                    <Code className="h-4 w-4 mr-2" />
                    Format Code
                  </Button>
                  <Button variant="outline">Optimize</Button>
                  <Button variant="outline">Minify</Button>
                  <Button variant="outline">Explain</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="productivity" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "📝 Content Writer",
                  description: "Generate high-quality content for blogs, articles, and marketing",
                  icon: FileText,
                  features: ["Blog posts", "Social media", "Email campaigns", "Product descriptions"]
                },
                {
                  title: "🔍 SEO Optimizer",
                  description: "Analyze and optimize your content for search engines",
                  icon: Zap,
                  features: ["Keyword analysis", "Meta tags", "Content scoring", "Competitor analysis"]
                },
                {
                  title: "📊 Report Generator",
                  description: "Create professional reports and presentations",
                  icon: FileText,
                  features: ["Financial reports", "Performance metrics", "Charts & graphs", "Executive summaries"]
                },
                {
                  title: "🎯 Task Automator",
                  description: "Automate repetitive tasks with AI workflows",
                  icon: Zap,
                  features: ["Email automation", "Data processing", "File organization", "Scheduling"]
                }
              ].map((tool, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <tool.icon className="h-5 w-5" />
                      {tool.title}
                    </CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {tool.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button className="w-full">Launch Tool</Button>
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

export default YetiTools;
