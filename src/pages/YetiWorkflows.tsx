
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { YetiLayout } from "@/components/layout/YetiLayout";
import { WorkflowBuilder } from "@/components/workflow/YetiWorkflowBuilder";
import { Workflow, Play, Pause, Settings, Zap, GitBranch, Timer, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserButton } from "@/contexts/UserButtonContext";

const YetiWorkflows = () => {
  const userButton = useUserButton();
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState([
    {
      id: "1",
      name: "🧊 Yeti Content Generator",
      description: "Automatically generate and publish content across platforms",
      status: "active",
      triggers: 3,
      actions: 7,
      lastRun: "2 minutes ago",
      successRate: 98
    },
    {
      id: "2", 
      name: "🤖 AI Response Optimizer",
      description: "Optimize AI responses based on user feedback patterns",
      status: "paused",
      triggers: 2,
      actions: 4,
      lastRun: "1 hour ago",
      successRate: 95
    },
    {
      id: "3",
      name: "📊 Analytics Collector",
      description: "Collect and process analytics data from all connected platforms",
      status: "active",
      triggers: 5,
      actions: 12,
      lastRun: "5 minutes ago",
      successRate: 99
    }
  ]);

  const handleRunWorkflow = (id: string) => {
    toast({
      title: "🧊 Workflow Started",
      description: "Your Yeti workflow is now running in the background.",
    });
  };

  const handleToggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === id ? {...w, status: w.status === 'active' ? 'paused' : 'active'} : w
    ));
  };

  return (
    <YetiLayout title="Yeti Workflows" icon={Workflow} userButton={userButton}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🧊 Yeti Workflow Engine</h1>
            <p className="text-gray-600 mt-2">Automate your AI workflows with powerful visual programming</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-green-600">
              <Zap className="h-4 w-4 mr-1" />
              {workflows.filter(w => w.status === 'active').length} Active
            </Badge>
            <Button>+ New Workflow</Button>
          </div>
        </div>

        <Tabs defaultValue="workflows" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
            <TabsTrigger value="builder">Workflow Builder</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="workflows" className="space-y-6">
            <div className="grid gap-6">
              {workflows.map((workflow) => (
                <Card key={workflow.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {workflow.name}
                          <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                            {workflow.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-2">{workflow.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleWorkflow(workflow.id)}
                        >
                          {workflow.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={() => handleRunWorkflow(workflow.id)}>
                          <Play className="h-4 w-4 mr-1" />
                          Run
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-gray-500" />
                        <span>{workflow.triggers} Triggers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-gray-500" />
                        <span>{workflow.actions} Actions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-gray-500" />
                        <span>{workflow.lastRun}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${workflow.successRate > 97 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span>{workflow.successRate}% Success</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="builder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🧊 Visual Workflow Builder</CardTitle>
                <CardDescription>Drag and drop components to build powerful AI workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <WorkflowBuilder />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "🧊 Yeti Social Automation",
                  description: "Automatically post content across social media platforms",
                  category: "Social Media",
                  complexity: "Beginner"
                },
                {
                  name: "📧 Email Campaign AI",
                  description: "Generate and send personalized email campaigns using AI",
                  category: "Marketing",
                  complexity: "Intermediate"
                },
                {
                  name: "🔍 Content Analyzer",
                  description: "Analyze content performance and suggest improvements",
                  category: "Analytics",
                  complexity: "Advanced"
                },
                {
                  name: "🤖 Customer Support Bot",
                  description: "Automated customer support with escalation rules",
                  category: "Support",
                  complexity: "Intermediate"
                },
                {
                  name: "📊 Data Pipeline",
                  description: "Process and transform data from multiple sources",
                  category: "Data",
                  complexity: "Advanced"
                },
                {
                  name: "🎯 Lead Scoring",
                  description: "Automatically score and qualify leads using AI",
                  category: "Sales",
                  complexity: "Intermediate"
                }
              ].map((template, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline">{template.category}</Badge>
                      <Badge variant={template.complexity === 'Beginner' ? 'default' : template.complexity === 'Intermediate' ? 'secondary' : 'destructive'}>
                        {template.complexity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{template.description}</p>
                    <Button className="w-full">Use Template</Button>
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

export default YetiWorkflows;
