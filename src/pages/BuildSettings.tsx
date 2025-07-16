
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { YetiLayout } from "@/components/layout/YetiLayout";
import { Settings, Zap, Code, Rocket, Shield, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserButton } from "@/contexts/UserButtonContext";

const BuildSettings = () => {
  const userButton = useUserButton();
  const { toast } = useToast();
  const [buildProgress, setBuildProgress] = useState(0);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildConfig, setBuildConfig] = useState({
    environment: "development",
    optimization: true,
    minification: true,
    compression: true,
    sourceMap: false,
    bundleAnalysis: true,
    treeshaking: true,
    codesplitting: true
  });

  const handleBuild = async () => {
    setIsBuilding(true);
    setBuildProgress(0);
    
    const steps = ["Analyzing dependencies", "Optimizing code", "Building assets", "Compressing files", "Finalizing build"];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBuildProgress((i + 1) * 20);
      toast({
        title: `Build Progress`,
        description: steps[i],
      });
    }
    
    setIsBuilding(false);
    toast({
      title: "🧊 Build Complete!",
      description: "Your Yeti AI application is ready for deployment.",
    });
  };

  return (
    <YetiLayout title="Build Settings" icon={Settings} userButton={userButton}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🧊 Yeti Build Configuration</h1>
            <p className="text-gray-600 mt-2">Configure your application build settings and deployment options</p>
          </div>
          <Badge variant="outline" className="text-blue-600">
            <Zap className="h-4 w-4 mr-1" />
            v18.0 Builder
          </Badge>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Build Environment
                </CardTitle>
                <CardDescription>Configure your build environment settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="environment">Environment</Label>
                    <Select value={buildConfig.environment} onValueChange={(value) => setBuildConfig({...buildConfig, environment: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target">Build Target</Label>
                    <Select defaultValue="web">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web">Web Application</SelectItem>
                        <SelectItem value="pwa">Progressive Web App</SelectItem>
                        <SelectItem value="desktop">Desktop (Electron)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Source Maps</Label>
                    <p className="text-sm text-gray-500">Generate source maps for debugging</p>
                  </div>
                  <Switch 
                    checked={buildConfig.sourceMap}
                    onCheckedChange={(checked) => setBuildConfig({...buildConfig, sourceMap: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Rocket className="h-5 w-5 mr-2" />
                  Performance Optimization
                </CardTitle>
                <CardDescription>Configure optimization settings for better performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries({
                  optimization: "Enable code optimization",
                  minification: "Minify JavaScript and CSS",
                  compression: "Enable Gzip compression",
                  bundleAnalysis: "Generate bundle analysis report",
                  treeshaking: "Remove unused code (tree shaking)",
                  codesplitting: "Enable code splitting"
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>{label}</Label>
                      <p className="text-sm text-gray-500">Recommended for production builds</p>
                    </div>
                    <Switch 
                      checked={buildConfig[key as keyof typeof buildConfig] as boolean}
                      onCheckedChange={(checked) => setBuildConfig({...buildConfig, [key]: checked})}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Deployment Configuration
                </CardTitle>
                <CardDescription>Configure deployment settings and CI/CD pipeline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cdn">CDN Provider</Label>
                    <Select defaultValue="cloudflare">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cloudflare">Cloudflare</SelectItem>
                        <SelectItem value="aws">AWS CloudFront</SelectItem>
                        <SelectItem value="vercel">Vercel Edge Network</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Primary Region</Label>
                    <Select defaultValue="auto">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto (Closest to users)</SelectItem>
                        <SelectItem value="us-east">US East</SelectItem>
                        <SelectItem value="eu-west">EU West</SelectItem>
                        <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Advanced Configuration
                </CardTitle>
                <CardDescription>Advanced build settings for power users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webpack-config">Custom Webpack Config</Label>
                  <textarea 
                    className="w-full h-32 p-3 border rounded-md font-mono text-sm"
                    placeholder="// Add custom webpack configuration here
module.exports = {
  // Your custom config
};"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="env-vars">Environment Variables</Label>
                  <textarea 
                    className="w-full h-24 p-3 border rounded-md font-mono text-sm"
                    placeholder="YETI_API_URL=https://api.yeti.ai
YETI_VERSION=18.0
NODE_ENV=production"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>🚀 Build & Deploy</CardTitle>
            <CardDescription>Start the build process for your Yeti AI application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isBuilding && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Building your application...</span>
                  <span>{buildProgress}%</span>
                </div>
                <Progress value={buildProgress} className="w-full" />
              </div>
            )}
            <div className="flex gap-4">
              <Button onClick={handleBuild} disabled={isBuilding} className="flex-1">
                {isBuilding ? "Building..." : "🧊 Start Build"}
              </Button>
              <Button variant="outline">Preview Build</Button>
              <Button variant="outline">Download Build</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </YetiLayout>
  );
};

export default BuildSettings;
