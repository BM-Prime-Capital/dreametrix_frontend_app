"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Key,
  Plus,
  Search,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Server,
  Code,
  Settings,
  Zap,
  Lock,
  Globe,
  Activity,
  Filter
} from "lucide-react";
import { toast } from "sonner";

type ApiKey = {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed?: string;
  permissions: string[];
  status: "active" | "revoked";
};

type ApiEndpoint = {
  id: string;
  path: string;
  method: string;
  description: string;
  rateLimit: string;
  accessLevel: "public" | "restricted" | "admin";
};

export default function ApiManagementPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [, setActiveTab] = useState("keys");
  const [showKey, setShowKey] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  // Sample API keys data with generic values
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "School Integration",
      key: "sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      created: "2023-10-15",
      lastUsed: "2024-02-20",
      permissions: ["schools:read", "schools:write", "students:read"],
      status: "active"
    },
    {
      id: "2",
      name: "Reporting Dashboard",
      key: "sk_test_yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",
      created: "2023-11-20",
      lastUsed: "2024-01-15",
      permissions: ["analytics:read", "reports:generate"],
      status: "active"
    },
    {
      id: "3",
      name: "Mobile App (Dev)",
      key: "sk_test_zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
      created: "2024-01-05",
      permissions: ["schools:read", "students:read"],
      status: "revoked"
    }
  ]);

  // Sample API endpoints data
  const apiEndpoints: ApiEndpoint[] = [
    {
      id: "1",
      path: "/api/v1/schools",
      method: "GET",
      description: "List all schools",
      rateLimit: "100 requests/hour",
      accessLevel: "restricted"
    },
    {
      id: "2",
      path: "/api/v1/schools/{id}",
      method: "GET",
      description: "Get school details",
      rateLimit: "100 requests/hour",
      accessLevel: "restricted"
    },
    {
      id: "3",
      path: "/api/v1/schools",
      method: "POST",
      description: "Create new school",
      rateLimit: "50 requests/hour",
      accessLevel: "admin"
    },
    {
      id: "4",
      path: "/api/v1/students",
      method: "GET",
      description: "List students",
      rateLimit: "100 requests/hour",
      accessLevel: "restricted"
    },
    {
      id: "5",
      path: "/api/v1/analytics/schools",
      method: "GET",
      description: "Get school analytics",
      rateLimit: "30 requests/hour",
      accessLevel: "admin"
    },
    {
      id: "6",
      path: "/api/v1/system/status",
      method: "GET",
      description: "Check system status",
      rateLimit: "unlimited",
      accessLevel: "public"
    }
  ];

  const filteredKeys = apiKeys.filter(key =>
    key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    key.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateNewKey = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      const newKey: ApiKey = {
        id: Math.random().toString(36).substring(2, 9),
        name: `New Integration ${apiKeys.length + 1}`,
        key: `sk_test_${Math.random().toString(36).substring(2, 10)}xxxxxxxx${Math.random().toString(36).substring(2, 10)}`,
        created: new Date().toISOString().split('T')[0],
        permissions: ["schools:read"],
        status: "active"
      };
      setApiKeys([...apiKeys, newKey]);
      setIsGenerating(false);
      toast.success("New API key generated");
    }, 1000);
  };

  const revokeKey = (id: string) => {
    setIsRevoking(true);
    // Simulate API call
    setTimeout(() => {
      setApiKeys(apiKeys.map(key => 
        key.id === id ? { ...key, status: "revoked" } : key
      ));
      setIsRevoking(false);
      toast.warning("API key revoked");
    }, 800);
  };

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(keyId);
    toast.info("Copied to clipboard");
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey(showKey === keyId ? null : keyId);
  };

  const getAccessLevelBadge = (level: string) => {
    switch (level) {
      case "public":
        return <Badge variant="secondary">Public</Badge>;
      case "restricted":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Restricted</Badge>;
      case "admin":
        return <Badge variant="destructive">Admin</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "GET":
        return <Badge className="bg-green-500 hover:bg-green-600">{method}</Badge>;
      case "POST":
        return <Badge className="bg-blue-500 hover:bg-blue-600">{method}</Badge>;
      case "PUT":
        return <Badge className="bg-amber-500 hover:bg-amber-600">{method}</Badge>;
      case "DELETE":
        return <Badge variant="destructive">{method}</Badge>;
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">API Management</h1>
          <p className="text-sm text-gray-500">
            Manage API keys and endpoints for system integration
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => router.push('/super_admin/api/documentation')}
          >
            <Code className="h-4 w-4" />
            Documentation
          </Button>
          <Button
            className="gap-2"
            onClick={generateNewKey}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            New API Key
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="keys" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="keys" onClick={() => setActiveTab("keys")}>
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="endpoints" onClick={() => setActiveTab("endpoints")}>
            <Server className="h-4 w-4 mr-2" />
            Endpoints
          </TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="keys">
          <Card className="p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search API keys by name or key..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </Card>

          {filteredKeys.length > 0 ? (
            <div className="grid gap-4">
              {filteredKeys.map((apiKey) => (
                <Card key={apiKey.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{apiKey.name}</h3>
                        <Badge
                          variant={apiKey.status === "active" ? "default" : "destructive"}
                        >
                          {apiKey.status === "active" ? "Active" : "Revoked"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex items-center">
                          {showKey === apiKey.id ? apiKey.key : 'sk_test_••••••••••••••••••••••••••••••••'}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-1"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {showKey === apiKey.id ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                        >
                          {copiedKeyId === apiKey.id ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {apiKey.permissions.map((permission, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 text-sm text-gray-500 min-w-[120px]">
                      <div>Created: {apiKey.created}</div>
                      {apiKey.lastUsed && (
                        <div>Last used: {apiKey.lastUsed}</div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 gap-2"
                        onClick={() => revokeKey(apiKey.id)}
                        disabled={apiKey.status === "revoked" || isRevoking}
                      >
                        <Trash2 className="h-3 w-3" />
                        Revoke
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 flex flex-col items-center justify-center gap-4">
              <Key className="h-12 w-12 text-gray-400" />
              <h3 className="font-medium text-lg">No API keys found</h3>
              <p className="text-sm text-gray-500 max-w-md text-center">
                {searchQuery 
                  ? "No keys match your search criteria. Try adjusting your search."
                  : "You haven't created any API keys yet."}
              </p>
              {!searchQuery && (
                <Button onClick={generateNewKey} disabled={isGenerating}>
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Generate First Key
                </Button>
              )}
            </Card>
          )}
        </TabsContent>

        {/* API Endpoints Tab */}
        <TabsContent value="endpoints">
          <div className="grid gap-4">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Available API Endpoints
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    List of all available API endpoints and their specifications
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Activity className="h-4 w-4" />
                    Usage Analytics
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Configure
                  </Button>
                </div>
              </div>
            </Card>

            <div className="grid gap-4">
              {apiEndpoints.map((endpoint) => (
                <Card key={endpoint.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        {getMethodBadge(endpoint.method)}
                        <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {endpoint.path}
                        </code>
                        {getAccessLevelBadge(endpoint.accessLevel)}
                      </div>
                      <p className="text-sm text-gray-600">{endpoint.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Zap className="h-3 w-3" />
                        <span>Rate limit: {endpoint.rateLimit}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 self-start md:self-center">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Code className="h-3 w-3" />
                        Try it
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Lock className="h-3 w-3" />
                        Permissions
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    API Base URL
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Use this base URL for all API requests
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded">
                    https://api.edumanager.com/v1
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard("https://api.edumanager.com/v1", "base-url")}
                  >
                    {copiedKeyId === "base-url" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Usage Guidelines */}
      <Card className="p-6 mt-4 bg-blue-50 border-blue-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600 w-fit h-fit">
            <Lock className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">API Security Guidelines</h3>
            <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
              <li>Keep your API keys secret and never expose them in client-side code</li>
              <li>Rotate your API keys regularly (every 3-6 months)</li>
              <li>Use the principle of least privilege when assigning permissions</li>
              <li>Implement rate limiting in your application to avoid hitting our limits</li>
              <li>All API requests must be made over HTTPS</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}