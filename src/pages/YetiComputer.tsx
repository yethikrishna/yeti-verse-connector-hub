
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { YetiLayout } from "@/components/layout/YetiLayout";
import { Computer, Terminal, Folder, FileText, Play, Download, Upload, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserButton } from "@/contexts/UserButtonContext";

const YetiComputer = () => {
  const userButton = useUserButton();
  const { toast } = useToast();
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState([
    "🧊 Yeti Virtual Computer v18.0 - Initialized",
    "Welcome to your virtual development environment!",
    "Type 'help' for available commands."
  ]);

  const handleTerminalCommand = () => {
    if (!terminalInput.trim()) return;
    
    const newHistory = [...terminalHistory, `$ ${terminalInput}`];
    
    // Simulate command responses
    switch (terminalInput.toLowerCase()) {
      case 'help':
        newHistory.push("Available commands: ls, pwd, whoami, date, clear, yeti-info");
        break;
      case 'ls':
        newHistory.push("projects/  documents/  downloads/  yeti-workspace/");
        break;
      case 'pwd':
        newHistory.push("/home/yeti-user");
        break;
      case 'whoami':
        newHistory.push("yeti-user (Yethikrishna R)");
        break;
      case 'date':
        newHistory.push(new Date().toString());
        break;
      case 'yeti-info':
        newHistory.push("🧊 Yeti AI Virtual Computer v18.0");
        newHistory.push("Created by: Yethikrishna R");
        newHistory.push("Capabilities: Full Linux environment with AI integration");
        break;
      case 'clear':
        setTerminalHistory(["🧊 Yeti Virtual Computer v18.0 - Terminal Cleared"]);
        setTerminalInput("");
        return;
      default:
        newHistory.push(`Command '${terminalInput}' not found. Type 'help' for available commands.`);
    }
    
    setTerminalHistory(newHistory);
    setTerminalInput("");
    
    toast({
      title: "🧊 Command Executed",
      description: `Executed: ${terminalInput}`,
    });
  };

  const fileSystem = [
    { name: "projects", type: "folder", size: "-", modified: "2 hours ago" },
    { name: "yeti-workspace", type: "folder", size: "-", modified: "5 minutes ago" },
    { name: "documents", type: "folder", size: "-", modified: "1 day ago" },
    { name: "app.py", type: "file", size: "2.4 KB", modified: "10 minutes ago" },
    { name: "README.md", type: "file", size: "1.2 KB", modified: "1 hour ago" },
    { name: "config.json", type: "file", size: "845 B", modified: "30 minutes ago" }
  ];

  return (
    <YetiLayout title="Yeti Computer" icon={Computer} userButton={userButton}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🧊 Yeti Virtual Computer</h1>
            <p className="text-gray-600 mt-2">Full Linux environment with AI-powered development tools</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-green-600">
              <Computer className="h-4 w-4 mr-1" />
              Online
            </Badge>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
          </div>
        </div>

        <Tabs defaultValue="terminal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="terminal">Terminal</TabsTrigger>
            <TabsTrigger value="files">File Manager</TabsTrigger>
            <TabsTrigger value="editor">Code Editor</TabsTrigger>
            <TabsTrigger value="system">System Info</TabsTrigger>
          </TabsList>

          <TabsContent value="terminal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  🧊 Yeti Terminal
                </CardTitle>
                <CardDescription>Full bash terminal with AI integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-80 overflow-y-auto">
                  {terminalHistory.map((line, index) => (
                    <div key={index} className="mb-1">{line}</div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="Enter command..."
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTerminalCommand()}
                    className="font-mono"
                  />
                  <Button onClick={handleTerminalCommand}>
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  File Manager
                </CardTitle>
                <CardDescription>Browse and manage your virtual file system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Button size="sm" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">New Folder</Button>
                  <Button size="sm" variant="outline">New File</Button>
                </div>
                
                <div className="border rounded-lg">
                  <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 border-b font-semibold text-sm">
                    <div>Name</div>
                    <div>Type</div>
                    <div>Size</div>
                    <div>Modified</div>
                  </div>
                  {fileSystem.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 p-3 border-b hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        {item.type === 'folder' ? 
                          <Folder className="h-4 w-4 text-blue-500" /> : 
                          <FileText className="h-4 w-4 text-gray-500" />
                        }
                        {item.name}
                      </div>
                      <div>{item.type}</div>
                      <div>{item.size}</div>
                      <div>{item.modified}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  🧊 Yeti Code Editor
                </CardTitle>
                <CardDescription>AI-powered code editor with syntax highlighting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Badge variant="outline">app.py</Badge>
                    <Badge variant="outline">config.json</Badge>
                    <Button size="sm" variant="outline">+ New File</Button>
                  </div>
                  
                  <textarea
                    className="w-full h-80 p-4 border rounded-lg font-mono text-sm bg-gray-50"
                    defaultValue={`# 🧊 Yeti AI Application
# Created by: Yethikrishna R

import yeti_ai as yeti
from flask import Flask, request, jsonify

app = Flask(__name__)
yeti_client = yeti.Client(api_key="your-api-key")

@app.route('/ai/chat', methods=['POST'])
def chat():
    """Handle AI chat requests"""
    message = request.json.get('message')
    response = yeti_client.generate_response(message)
    
    return jsonify({
        'response': response,
        'model': 'yeti-core-2.5',
        'created_by': 'Yethikrishna R'
    })

if __name__ == '__main__':
    print("🧊 Yeti AI Server Starting...")
    app.run(debug=True, port=5000)`}
                  />
                  
                  <div className="flex gap-2">
                    <Button>
                      <Play className="h-4 w-4 mr-2" />
                      Run Code
                    </Button>
                    <Button variant="outline">Save</Button>
                    <Button variant="outline">AI Assist</Button>
                    <Button variant="outline">Format</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">OS:</div>
                    <div>Yeti Linux v18.0</div>
                    <div className="text-gray-500">Architecture:</div>
                    <div>x86_64</div>
                    <div className="text-gray-500">Memory:</div>
                    <div>8 GB RAM</div>
                    <div className="text-gray-500">Storage:</div>
                    <div>100 GB SSD</div>
                    <div className="text-gray-500">CPU:</div>
                    <div>8-Core Virtual</div>
                    <div className="text-gray-500">Uptime:</div>
                    <div>2 hours 34 minutes</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resource Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU Usage</span>
                      <span>23%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory Usage</span>
                      <span>45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Storage Usage</span>
                      <span>67%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>🧊 Yeti AI Integration</CardTitle>
                <CardDescription>AI-powered development environment features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">5</div>
                    <div className="text-sm text-gray-600">AI Models Active</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <div className="text-sm text-gray-600">Code Suggestions</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">3</div>
                    <div className="text-sm text-gray-600">Workflows Running</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </YetiLayout>
  );
};

export default YetiComputer;
