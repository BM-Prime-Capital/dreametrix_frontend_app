"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  User,
  Clock,
  Database,
  AlertCircle,
  Info,
  CheckCircle2,
  XCircle,
  CalendarDays,
  MoreHorizontal,
  School,
  Settings,
  Shield,
  Clipboard,
  HardDrive,
  Network,
  Key,
  Activity
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";

type AuditLog = {
  id: string;
  timestamp: string;
  action: string;
  entityType: "user" | "school" | "system" | "settings" | "api";
  entityId: string;
  userId: string;
  userEmail: string;
  userRole: "super_admin" | "school_admin" | "teacher" | "student" | "parent";
  ipAddress: string;
  userAgent?: string;
  status: "success" | "failed" | "warning";
  details?: string;
  metadata?: Record<string, any>;
};

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Sample data
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: "1",
      timestamp: "2024-02-15T09:30:45Z",
      action: "login",
      entityType: "user",
      entityId: "user_123",
      userId: "admin_1",
      userEmail: "admin@example.com",
      userRole: "super_admin",
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      status: "success",
      details: "User logged in successfully",
      metadata: {
        authMethod: "password",
        device: "Desktop",
        location: "Paris, FR",
        browser: "Chrome 120.0.0.0",
        os: "Windows 10"
      }
    },
    {
      id: "2",
      timestamp: "2024-02-15T10:15:22Z",
      action: "update_school",
      entityType: "school",
      entityId: "school_456",
      userId: "admin_1",
      userEmail: "admin@example.com",
      userRole: "super_admin",
      ipAddress: "192.168.1.1",
      status: "success",
      details: "Updated school information for Central High",
      metadata: {
        changes: {
          name: "Central Elementary → Central High",
          principal: "Dr. Smith → Dr. Johnson"
        },
        method: "PATCH",
        endpoint: "/api/schools/456"
      }
    },
    {
      id: "3",
      timestamp: "2024-02-14T14:05:33Z",
      action: "create_user",
      entityType: "user",
      entityId: "user_789",
      userId: "admin_2",
      userEmail: "superadmin@example.com",
      userRole: "super_admin",
      ipAddress: "203.0.113.42",
      status: "success",
      details: "Created new teacher account",
      metadata: {
        role: "teacher",
        email: "teacher@example.com",
        school: "Central High"
      }
    },
    {
      id: "4",
      timestamp: "2024-02-14T16:45:12Z",
      action: "delete_user",
      entityType: "user",
      entityId: "user_101",
      userId: "admin_1",
      userEmail: "admin@example.com",
      userRole: "super_admin",
      ipAddress: "192.168.1.1",
      status: "failed",
      details: "Failed to delete user - permission denied",
      metadata: {
        error: "PermissionDenied",
        message: "User does not have sufficient privileges"
      }
    },
    {
      id: "5",
      timestamp: "2024-02-13T11:20:18Z",
      action: "system_update",
      entityType: "system",
      entityId: "sys_202",
      userId: "system",
      userEmail: "system@example.com",
      userRole: "super_admin",
      ipAddress: "127.0.0.1",
      status: "warning",
      details: "Applied security patches (v2.4.1)",
      metadata: {
        version: "2.4.1",
        changes: "Security fixes for XSS vulnerabilities",
        downtime: "2 minutes"
      }
    }
  ]);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = 
      (!dateRange.start || new Date(log.timestamp) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(log.timestamp) <= new Date(dateRange.end));
    
    return matchesSearch && matchesDate;
  });

  const refreshLogs = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Refreshed audit logs");
    } finally {
      setIsLoading(false);
    }
  };

  const exportLogs = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const headers = Object.keys(auditLogs[0]).join(',');
      const csvContent = auditLogs.map(log => 
        Object.values(log).map(field => 
          typeof field === 'string' ? `"${field.replace(/"/g, '""')}"` : 
          typeof field === 'object' ? `"${JSON.stringify(field).replace(/"/g, '""')}"` : 
          field
        ).join(',')
      ).join('\n');
      
      const blob = new Blob([`${headers}\n${csvContent}`], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit-logs-${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed": return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning": return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case "user": return <User className="h-4 w-4" />;
      case "school": return <School className="h-4 w-4" />;
      case "system": return <Activity className="h-4 w-4" />;
      case "api": return <Database className="h-4 w-4" />;
      case "settings": return <Settings className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDetailsOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatMetadataValue = (value: any) => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      return Object.entries(value).map(([k, v]) => (
        <div key={k} className="ml-4">
          <span className="font-medium">{k}:</span> {String(v)}
        </div>
      ));
    }
    return String(value);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-sm text-muted-foreground">
          Track all system activities and administrative changes
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter logs by action, user or entity..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>Date range</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Logs</p>
              <p className="text-2xl font-bold">{auditLogs.length}</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Database className="h-5 w-5" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Successful</p>
              <p className="text-2xl font-bold">
                {auditLogs.filter(l => l.status === 'success').length}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Warnings</p>
              <p className="text-2xl font-bold">
                {auditLogs.filter(l => l.status === 'warning').length}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold">
                {auditLogs.filter(l => l.status === 'failed').length}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-red-100 text-red-600">
              <XCircle className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="divide-y">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div 
                key={log.id} 
                className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleViewDetails(log)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-muted mt-1">
                      {getEntityIcon(log.entityType)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium truncate">
                          {log.action.replace(/_/g, ' ')}
                        </h3>
                        <Badge 
                          variant={
                            log.status === "success" 
                              ? "default" 
                              : log.status === "failed" 
                              ? "destructive" 
                              : "secondary"
                          }
                          className="gap-1"
                        >
                          {getStatusIcon(log.status)}
                          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {log.details}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{log.userEmail}</span>
                          <span className="text-muted-foreground/70">
                            {log.userRole.split('_')
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          <span>{log.ipAddress}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-muted"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => handleViewDetails(log)}>
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyToClipboard(JSON.stringify(log))}>
                        Copy details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Flagged log:", log.id);
                        }}
                      >
                        Flag issue
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 flex flex-col items-center justify-center gap-4">
              <Shield className="h-12 w-12 text-muted-foreground" />
              <h3 className="font-medium text-lg">No audit logs found</h3>
              <p className="text-sm text-muted-foreground max-w-md text-center">
                No logs match your search criteria. Try adjusting your filters or search query.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setDateRange({ start: "", end: "" });
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Audit Log Details"
        description={`Action: ${selectedLog?.action}`}
        size="4xl"
      >
        {selectedLog && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Action</Label>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  {getEntityIcon(selectedLog.entityType)}
                  <span className="font-medium">
                    {selectedLog.action.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Badge 
                  variant={
                    selectedLog.status === "success" 
                      ? "default" 
                      : selectedLog.status === "failed" 
                      ? "destructive" 
                      : "secondary"
                  }
                  className="gap-1 w-full justify-start p-2"
                >
                  {getStatusIcon(selectedLog.status)}
                  {selectedLog.status.charAt(0).toUpperCase() + selectedLog.status.slice(1)}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label>User</Label>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <User className="h-4 w-4" />
                  <div>
                    <p className="font-medium">{selectedLog.userEmail}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedLog.userRole.split('_')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Timestamp</Label>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(selectedLog.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Details</Label>
              <Card className="p-4 bg-muted/50">
                <p>{selectedLog.details || "No additional details"}</p>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Technical Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>IP Address</Label>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <Network className="h-4 w-4" />
                      <span>{selectedLog.ipAddress}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(selectedLog.ipAddress)}
                    >
                      <Clipboard className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Entity</Label>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      {getEntityIcon(selectedLog.entityType)}
                      <span>
                        {selectedLog.entityType}: {selectedLog.entityId}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(selectedLog.entityId)}
                    >
                      <Clipboard className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {selectedLog.userAgent && (
                  <div className="space-y-2 col-span-full">
                    <Label>User Agent</Label>
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span className="truncate">{selectedLog.userAgent}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(selectedLog.userAgent!)}
                      >
                        <Clipboard className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Network className="h-4 w-4" />
                Metadata
              </h3>

              {selectedLog.metadata ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedLog.metadata).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label>
                        {key.split(/(?=[A-Z])/)
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                      </Label>
                      <div className="flex flex-col gap-1 p-2 bg-muted rounded">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {typeof value === 'object' ? (
                              <div className="flex flex-col">
                                {formatMetadataValue(value)}
                              </div>
                            ) : (
                              <span>{String(value)}</span>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(
                              typeof value === 'object' ? 
                              JSON.stringify(value, null, 2) : 
                              String(value)
                            )}
                          >
                            <Clipboard className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center bg-muted/50 rounded">
                  <Key className="h-6 w-6 text-muted-foreground mb-2" />
                  <h4 className="font-medium">No metadata available</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    This action didn't generate additional metadata
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-6">
          <Button 
            variant="outline" 
            onClick={() => setIsDetailsOpen(false)}
          >
            Close
          </Button>
          <Button 
            variant="default"
            onClick={() => selectedLog && copyToClipboard(JSON.stringify(selectedLog, null, 2))}
          >
            <Clipboard className="h-4 w-4 mr-2" />
            Copy Full Details
          </Button>
        </div>
      </Modal>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredLogs.length} of {auditLogs.length} logs
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={exportLogs}
            disabled={isLoading}
          >
            {isLoading ? (
              <Download className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={refreshLogs}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
          
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}