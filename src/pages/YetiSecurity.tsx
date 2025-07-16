
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ReactNode } from "react";
import { YetiLayout } from "@/components/layout/YetiLayout";
import { Shield, AlertTriangle, CheckCircle, Lock, Eye, Activity, Zap, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface YetiSecurityProps {
  userButton?: ReactNode;
}

const YetiSecurity = ({ userButton }: YetiSecurityProps) => {
  const { toast } = useToast();
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    dataEncryption: true,
    auditLogging: true,
    threatDetection: true,
    accessControl: true,
    apiSecurity: true
  });

  const securityAlerts = [
    {
      id: 1,
      type: "warning",
      title: "Unusual API Access Pattern",
      description: "Detected unusual API usage from IP 192.168.1.100",
      time: "5 minutes ago",
      severity: "medium"
    },
    {
      id: 2,
      type: "info",
      title: "Security Scan Complete",
      description: "Daily security scan completed successfully",
      time: "2 hours ago",
      severity: "low"
    },
    {
      id: 3,
      type: "success",
      title: "Vulnerability Patched",
      description: "Critical vulnerability in AI model endpoint resolved",
      time: "1 day ago",
      severity: "high"
    }
  ];

  const threatIntelligence = [
    { source: "Global Threat DB", threats: 1247, blocked: 1243, success: 99.7 },
    { source: "AI Model Security", threats: 89, blocked: 89, success: 100 },
    { source: "API Endpoint Monitor", threats: 156, blocked: 153, success: 98.1 },
    { source: "Data Access Control", threats: 45, blocked: 45, success: 100 }
  ];

  const handleSecurityToggle = (setting: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
    
    toast({
      title: "🧊 Security Updated",
      description: `${setting} has been ${securitySettings[setting as keyof typeof securitySettings] ? 'disabled' : 'enabled'}.`,
    });
  };

  return (
    <YetiLayout title="Yeti Security" icon={Shield} userButton={userButton}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🧊 Yeti Security Center</h1>
            <p className="text-gray-600 mt-2">Advanced AI-powered security monitoring and protection</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Secure
            </Badge>
            <Badge variant="outline" className="text-blue-600">
              <Activity className="h-4 w-4 mr-1" />
              Monitoring Active
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Security Overview</TabsTrigger>
            <TabsTrigger value="threats">Threat Intelligence</TabsTrigger>
            <TabsTrigger value="settings">Security Settings</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Security Score */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Security Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">98.5%</div>
                    <p className="text-gray-600">Excellent Security Posture</p>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                      <div className="bg-green-600 h-3 rounded-full" style={{ width: '98.5%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Threats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">3</div>
                    <p className="text-sm text-gray-600">Being Monitored</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Blocked Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">127</div>
                    <p className="text-sm text-gray-600">Malicious Requests</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  🧊 Security Alerts
                </CardTitle>
                <CardDescription>Recent security events and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className={`p-2 rounded-full ${
                        alert.type === 'warning' ? 'bg-orange-100' :
                        alert.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {alert.type === 'warning' ? 
                          <AlertTriangle className="h-4 w-4 text-orange-600" /> :
                          alert.type === 'success' ?
                          <CheckCircle className="h-4 w-4 text-green-600" /> :
                          <Activity className="h-4 w-4 text-blue-600" />
                        }
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{alert.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                            <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
                          </div>
                          <Badge variant={
                            alert.severity === 'high' ? 'destructive' :
                            alert.severity === 'medium' ? 'default' : 'secondary'
                          }>
                            {alert.severity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="threats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  🧊 Threat Intelligence Dashboard
                </CardTitle>
                <CardDescription>Real-time threat detection and analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {threatIntelligence.map((intel, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{intel.source}</h3>
                        <p className="text-sm text-gray-600">
                          {intel.blocked}/{intel.threats} threats blocked
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{intel.success}%</div>
                        <p className="text-sm text-gray-500">Success Rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>🔒 AI Model Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Model Access Control</span>
                      <Badge variant="outline" className="text-green-600">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Input Validation</span>
                      <Badge variant="outline" className="text-green-600">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Output Filtering</span>
                      <Badge variant="outline" className="text-green-600">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Rate Limiting</span>
                      <Badge variant="outline" className="text-green-600">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🛡️ Data Protection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>End-to-End Encryption</span>
                      <Badge variant="outline" className="text-green-600">Enabled</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Data Anonymization</span>
                      <Badge variant="outline" className="text-green-600">Enabled</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Secure Backup</span>
                      <Badge variant="outline" className="text-green-600">Enabled</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Access Logging</span>
                      <Badge variant="outline" className="text-green-600">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  🧊 Security Configuration
                </CardTitle>
                <CardDescription>Configure your security settings and policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries({
                  twoFactorAuth: "Two-Factor Authentication",
                  dataEncryption: "Data Encryption at Rest",
                  auditLogging: "Comprehensive Audit Logging",
                  threatDetection: "Real-time Threat Detection",
                  accessControl: "Role-based Access Control",
                  apiSecurity: "API Security Monitoring"
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{label}</div>
                      <p className="text-sm text-gray-500">
                        {key === 'twoFactorAuth' && "Require 2FA for all user accounts"}
                        {key === 'dataEncryption' && "Encrypt all data using AES-256"}
                        {key === 'auditLogging' && "Log all user and system activities"}
                        {key === 'threatDetection' && "AI-powered threat analysis"}
                        {key === 'accessControl' && "Granular permission management"}
                        {key === 'apiSecurity' && "Monitor API endpoints for threats"}
                      </p>
                    </div>
                    <Switch 
                      checked={securitySettings[key as keyof typeof securitySettings]}
                      onCheckedChange={() => handleSecurityToggle(key)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>🧊 Compliance Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "GDPR", status: "Compliant", score: 100 },
                      { name: "SOC 2 Type II", status: "Certified", score: 98 },
                      { name: "ISO 27001", status: "Compliant", score: 96 },
                      { name: "HIPAA", status: "Compliant", score: 99 }
                    ].map((compliance, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{compliance.name}</div>
                          <div className="text-sm text-gray-500">{compliance.status}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">{compliance.score}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📋 Audit Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Monthly Security Audit", date: "Dec 2024", status: "Available" },
                      { name: "Compliance Assessment", date: "Nov 2024", status: "Available" },
                      { name: "Penetration Test Report", date: "Oct 2024", status: "Available" },
                      { name: "Risk Assessment", date: "Sep 2024", status: "Available" }
                    ].map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium text-sm">{report.name}</div>
                          <div className="text-xs text-gray-500">{report.date}</div>
                        </div>
                        <Button size="sm" variant="outline">Download</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </YetiLayout>
  );
};

export default YetiSecurity;
