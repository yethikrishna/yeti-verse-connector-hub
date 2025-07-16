import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  User, 
  Key, 
  MessageSquare, 
  Palette, 
  Download, 
  Upload, 
  Shield, 
  Globe, 
  HelpCircle,
  Settings,
  Bell,
  Eye,
  Lock,
  Trash2,
  FileText,
  Moon,
  Sun,
  Monitor,
  Save,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { useToast } from '@/hooks/use-toast';

export interface DoubaoSettingsPanelProps {
  className?: string;
  onClose?: () => void;
}

interface SettingsState {
  profile: {
    name: string;
    email: string;
    avatar: string;
    bio: string;
  };
  apiKeys: {
    openai: string;
    anthropic: string;
    google: string;
  };
  conversation: {
    autoSave: boolean;
    maxHistory: number;
    defaultModel: string;
    temperature: number[];
    maxTokens: number[];
    streamResponse: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    compactMode: boolean;
    showTimestamps: boolean;
  };
  privacy: {
    dataCollection: boolean;
    analytics: boolean;
    crashReports: boolean;
    shareUsage: boolean;
  };
  notifications: {
    desktop: boolean;
    sound: boolean;
    newFeatures: boolean;
    updates: boolean;
  };
  language: string;
  region: string;
}

export const DoubaoSettingsPanel: React.FC<DoubaoSettingsPanelProps> = ({
  className,
  onClose
}) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingsState>({
    profile: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '',
      bio: 'AI enthusiast and developer'
    },
    apiKeys: {
      openai: '',
      anthropic: '',
      google: ''
    },
    conversation: {
      autoSave: true,
      maxHistory: 100,
      defaultModel: 'gpt-4',
      temperature: [0.7],
      maxTokens: [2048],
      streamResponse: true
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
      compactMode: false,
      showTimestamps: true
    },
    privacy: {
      dataCollection: false,
      analytics: true,
      crashReports: true,
      shareUsage: false
    },
    notifications: {
      desktop: true,
      sound: false,
      newFeatures: true,
      updates: true
    },
    language: 'en',
    region: 'us'
  });

  const updateSettings = (section: keyof SettingsState, updates: Partial<SettingsState[keyof SettingsState]>) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
  };

  const handleSaveSettings = () => {
    // Save settings to localStorage or API
    localStorage.setItem('doubao-settings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your preferences have been saved successfully.",
    });
  };

  const handleResetSettings = () => {
    // Reset to default settings
    setSettings({
      profile: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '',
        bio: 'AI enthusiast and developer'
      },
      apiKeys: {
        openai: '',
        anthropic: '',
        google: ''
      },
      conversation: {
        autoSave: true,
        maxHistory: 100,
        defaultModel: 'gpt-4',
        temperature: [0.7],
        maxTokens: [2048],
        streamResponse: true
      },
      appearance: {
        theme: 'light',
        fontSize: 'medium',
        compactMode: false,
        showTimestamps: true
      },
      privacy: {
        dataCollection: false,
        analytics: true,
        crashReports: true,
        shareUsage: false
      },
      notifications: {
        desktop: true,
        sound: false,
        newFeatures: true,
        updates: true
      },
      language: 'en',
      region: 'us'
    });
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults.",
    });
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'doubao-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Settings Exported",
      description: "Your settings have been exported successfully.",
    });
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          toast({
            title: "Settings Imported",
            description: "Your settings have been imported successfully.",
          });
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "Failed to import settings. Please check the file format.",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={cn("h-full overflow-auto bg-doubao-bg-secondary", className)}>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div
          variants={doubaoAnimations.fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-semibold text-doubao-text-primary">Settings</h1>
            <p className="text-doubao-text-muted mt-1">Manage your account and application preferences</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportSettings} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              <label htmlFor="import-settings" className="cursor-pointer">
                Import
              </label>
              <input
                id="import-settings"
                type="file"
                accept=".json"
                onChange={handleImportSettings}
                className="hidden"
              />
            </Button>
            <Button onClick={handleSaveSettings} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          variants={doubaoAnimations.fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7 bg-doubao-bg-primary">
              <TabsTrigger value="profile" className="flex items-center gap-1 text-xs">
                <User className="h-3 w-3" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-1 text-xs">
                <Key className="h-3 w-3" />
                API
              </TabsTrigger>
              <TabsTrigger value="conversation" className="flex items-center gap-1 text-xs">
                <MessageSquare className="h-3 w-3" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-1 text-xs">
                <Palette className="h-3 w-3" />
                Theme
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-1 text-xs">
                <Shield className="h-3 w-3" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-1 text-xs">
                <Bell className="h-3 w-3" />
                Alerts
              </TabsTrigger>
              <TabsTrigger value="general" className="flex items-center gap-1 text-xs">
                <Settings className="h-3 w-3" />
                General
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-4 w-4" />
                    User Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={settings.profile.avatar} />
                      <AvatarFallback>
                        {settings.profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <Button variant="outline" size="sm">Change</Button>
                      <Button variant="ghost" size="sm" className="text-red-600">Remove</Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="name" className="text-sm">Name</Label>
                      <Input
                        id="name"
                        value={settings.profile.name}
                        onChange={(e) => updateSettings('profile', { name: e.target.value })}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-sm">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => updateSettings('profile', { email: e.target.value })}
                        className="h-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="bio" className="text-sm">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={settings.profile.bio}
                      onChange={(e) => updateSettings('profile', { bio: e.target.value })}
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Keys Tab */}
            <TabsContent value="api" className="space-y-4">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Key className="h-4 w-4" />
                    API Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'openai', label: 'OpenAI', placeholder: 'sk-...', badge: 'GPT-4' },
                    { key: 'anthropic', label: 'Anthropic', placeholder: 'sk-ant-...', badge: 'Claude' },
                    { key: 'google', label: 'Google AI', placeholder: 'AIza...', badge: 'Gemini' }
                  ].map(({ key, label, placeholder, badge }) => (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">{label}</Label>
                        <Badge variant="secondary" className="text-xs">{badge}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="password"
                          placeholder={placeholder}
                          value={settings.apiKeys[key as keyof typeof settings.apiKeys]}
                          onChange={(e) => updateSettings('apiKeys', { [key]: e.target.value })}
                          className="h-9"
                        />
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Conversation Tab */}
            <TabsContent value="conversation" className="space-y-4">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageSquare className="h-4 w-4" />
                    Chat Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Auto-save Conversations</Label>
                      <p className="text-xs text-doubao-text-muted">Automatically save chat history</p>
                    </div>
                    <Switch
                      checked={settings.conversation.autoSave}
                      onCheckedChange={(checked) => updateSettings('conversation', { autoSave: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Stream Responses</Label>
                      <p className="text-xs text-doubao-text-muted">Show responses as generated</p>
                    </div>
                    <Switch
                      checked={settings.conversation.streamResponse}
                      onCheckedChange={(checked) => updateSettings('conversation', { streamResponse: checked })}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm">Default Model</Label>
                    <Select
                      value={settings.conversation.defaultModel}
                      onValueChange={(value) => updateSettings('conversation', { defaultModel: value })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3">Claude 3</SelectItem>
                        <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <Label className="text-sm">Temperature</Label>
                      <span className="text-xs text-doubao-text-muted">
                        {settings.conversation.temperature[0]}
                      </span>
                    </div>
                    <Slider
                      value={settings.conversation.temperature}
                      onValueChange={(value) => updateSettings('conversation', { temperature: value })}
                      max={2}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-4">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-4 w-4" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Data Collection</Label>
                      <p className="text-xs text-doubao-text-muted">Allow usage data collection</p>
                    </div>
                    <Switch
                      checked={settings.privacy.dataCollection}
                      onCheckedChange={(checked) => updateSettings('privacy', { dataCollection: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Analytics</Label>
                      <p className="text-xs text-doubao-text-muted">Anonymous analytics</p>
                    </div>
                    <Switch
                      checked={settings.privacy.analytics}
                      onCheckedChange={(checked) => updateSettings('privacy', { analytics: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Crash Reports</Label>
                      <p className="text-xs text-doubao-text-muted">Auto-send crash reports</p>
                    </div>
                    <Switch
                      checked={settings.privacy.crashReports}
                      onCheckedChange={(checked) => updateSettings('privacy', { crashReports: checked })}
                    />
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      Export Data
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Desktop Notifications</Label>
                      <p className="text-xs text-doubao-text-muted">Show desktop notifications</p>
                    </div>
                    <Switch
                      checked={settings.notifications.desktop}
                      onCheckedChange={(checked) => updateSettings('notifications', { desktop: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Sound Notifications</Label>
                      <p className="text-xs text-doubao-text-muted">Play notification sounds</p>
                    </div>
                    <Switch
                      checked={settings.notifications.sound}
                      onCheckedChange={(checked) => updateSettings('notifications', { sound: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">New Features</Label>
                      <p className="text-xs text-doubao-text-muted">Notify about new features</p>
                    </div>
                    <Switch
                      checked={settings.notifications.newFeatures}
                      onCheckedChange={(checked) => updateSettings('notifications', { newFeatures: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Product Updates</Label>
                      <p className="text-xs text-doubao-text-muted">Receive product updates</p>
                    </div>
                    <Switch
                      checked={settings.notifications.updates}
                      onCheckedChange={(checked) => updateSettings('notifications', { updates: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Palette className="h-4 w-4" />
                    Theme & Display
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Theme</Label>
                    <RadioGroup
                      value={settings.appearance.theme}
                      onValueChange={(value: 'light' | 'dark' | 'system') => 
                        updateSettings('appearance', { theme: value })
                      }
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="light" />
                        <Label htmlFor="light" className="flex items-center gap-1 text-sm">
                          <Sun className="h-3 w-3" />
                          Light
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="dark" />
                        <Label htmlFor="dark" className="flex items-center gap-1 text-sm">
                          <Moon className="h-3 w-3" />
                          Dark
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="system" />
                        <Label htmlFor="system" className="flex items-center gap-1 text-sm">
                          <Monitor className="h-3 w-3" />
                          System
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Compact Mode</Label>
                      <p className="text-xs text-doubao-text-muted">Reduce spacing</p>
                    </div>
                    <Switch
                      checked={settings.appearance.compactMode}
                      onCheckedChange={(checked) => updateSettings('appearance', { compactMode: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe className="h-4 w-4" />
                    Language & Region
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-sm">Language</Label>
                      <Select
                        value={settings.language}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="zh">中文</SelectItem>
                          <SelectItem value="ja">日本語</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Region</Label>
                      <Select
                        value={settings.region}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, region: value }))}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="cn">China</SelectItem>
                          <SelectItem value="jp">Japan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Version</span>
                    <Badge variant="secondary">v1.0.0</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Build</span>
                    <span className="text-doubao-text-muted">2024.01.15</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Add other tabs as needed */}
          </Tabs>
        </motion.div>

        {/* Footer Actions */}
        <motion.div
          variants={doubaoAnimations.fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="flex justify-between items-center pt-4 border-t border-doubao-border-light"
        >
          <Button variant="outline" onClick={handleResetSettings} size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            {onClose && (
              <Button variant="outline" onClick={onClose} size="sm">
                Cancel
              </Button>
            )}
            <Button onClick={handleSaveSettings} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoubaoSettingsPanel;