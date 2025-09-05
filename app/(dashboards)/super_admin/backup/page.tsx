"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  Upload,
  Database,
  HardDrive,
  RefreshCw,
  Shield,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  History
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Modal } from "@/components/ui/Modal";

type Backup = {
  id: string;
  name: string;
  type: "full" | "partial";
  size: string;
  date: string;
  status: "completed" | "failed" | "in-progress";
};

export default function BackupPage() {
  const [backupName, setBackupName] = useState("");
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  // Sample backup data
  const [backups, setBackups] = useState<Backup[]>([
    {
      id: "1",
      name: "System_Full_Backup_2024-03-15",
      type: "full",
      size: "2.4 GB",
      date: "2024-03-15 14:30:45",
      status: "completed"
    },
    {
      id: "2",
      name: "Database_Only_2024-03-10",
      type: "partial",
      size: "1.1 GB",
      date: "2024-03-10 03:15:22",
      status: "completed"
    },
    {
      id: "3",
      name: "System_Full_Backup_2024-03-05",
      type: "full",
      size: "2.3 GB",
      date: "2024-03-05 23:45:18",
      status: "completed"
    },
    {
      id: "4",
      name: "Incremental_Backup_2024-03-03",
      type: "partial",
      size: "450 MB",
      date: "2024-03-03 12:10:05",
      status: "failed"
    },
    {
      id: "5",
      name: "System_Full_Backup_2024-02-28",
      type: "full",
      size: "2.2 GB",
      date: "2024-02-28 08:20:33",
      status: "completed"
    }
  ]);

  const handleCreateBackup = async () => {
    if (!backupName) return;
    
    setIsCreatingBackup(true);
    setProgress(0);
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCreatingBackup(false);
          
          // Add the new backup to the list
          const newBackup: Backup = {
            id: Date.now().toString(),
            name: backupName,
            type: "full",
            size: "2.5 GB",
            date: new Date().toISOString(),
            status: "completed"
          };
          
          setBackups(prevBackups => [newBackup, ...prevBackups]);
          setBackupName("");
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleRestoreBackup = async () => {
    if (!selectedBackup) return;
    
    setIsRestoring(true);
    setProgress(0);
    
    // Simulate restore progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRestoring(false);
          setIsRestoreModalOpen(false);
          return 100;
        }
        return prev + 5;
      });
    }, 300);
  };

  const handleDeleteBackup = async () => {
    if (!selectedBackup) return;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setBackups(prev => prev.filter(b => b.id !== selectedBackup.id));
    setSelectedBackup(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Backup & Restore</h1>
          <p className="text-sm text-gray-500">
            Manage system backups and restore points
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsRestoreModalOpen(true)}
            disabled={backups.length === 0}
          >
            <History className="h-4 w-4" />
            Restore History
          </Button>
        </div>
      </div>

      {/* Backup Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Backup Card */}
        <Card className="p-6 border-l-4 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Database className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">Create New Backup</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backup-name">Backup Name</Label>
              <Input
                id="backup-name"
                placeholder="System_Backup_2024..."
                value={backupName}
                onChange={(e) => setBackupName(e.target.value)}
                disabled={isCreatingBackup}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Backup Type</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="full-backup" 
                    name="backup-type" 
                    value="full" 
                    defaultChecked 
                    className="h-4 w-4 text-blue-600"
                    disabled={isCreatingBackup}
                  />
                  <Label htmlFor="full-backup">Full System</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="partial-backup" 
                    name="backup-type" 
                    value="partial" 
                    className="h-4 w-4 text-blue-600"
                    disabled={isCreatingBackup}
                  />
                  <Label htmlFor="partial-backup">Database Only</Label>
                </div>
              </div>
            </div>
            
            {isCreatingBackup ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Creating backup...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            ) : null}
            
            <Button 
              className="w-full gap-2" 
              onClick={handleCreateBackup}
              disabled={!backupName || isCreatingBackup}
            >
              {isCreatingBackup ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <HardDrive className="h-4 w-4" />
              )}
              {isCreatingBackup ? "Creating Backup..." : "Create Backup"}
            </Button>
          </div>
        </Card>

        {/* System Status Card */}
        <Card className="p-6 border-l-4 border-green-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <Shield className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">Backup Status</h2>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Last Backup</p>
                <p className="font-medium">
                  {backups.length > 0 ? backups[0].date : "N/A"}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Backups</p>
                <p className="font-medium">{backups.length}</p>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Storage Usage</p>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={65} className="h-2 flex-1" />
                <span className="text-sm">65%</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Estimated 15.2 GB of 25 GB used
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 flex-1">
                <Download className="h-4 w-4" />
                Download All
              </Button>
              <Button variant="outline" className="gap-2 flex-1">
                <Upload className="h-4 w-4" />
                Upload Backup
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Backups List */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 pb-0">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Database className="h-5 w-5 text-gray-500" />
            Available Backups
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {backups.length} backup{backups.length !== 1 ? "s" : ""} available
          </p>
        </div>
        
        {backups.length > 0 ? (
          <Table className="mt-2">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backups.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-gray-400" />
                      {backup.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={backup.type === "full" ? "default" : "secondary"}>
                      {backup.type === "full" ? "Full System" : "Partial"}
                    </Badge>
                  </TableCell>
                  <TableCell>{backup.size}</TableCell>
                  <TableCell>{backup.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {backup.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : backup.status === "failed" ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                      )}
                      <span className="capitalize">{backup.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setSelectedBackup(backup);
                          setIsRestoreModalOpen(true);
                        }}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setSelectedBackup(backup);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-12 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <Database className="h-10 w-10 text-gray-400" />
              <h3 className="font-medium">No backups available</h3>
              <p className="text-sm text-gray-500 max-w-md">
                Create your first backup to protect your system data
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Restore Modal */}
      <Modal
        isOpen={isRestoreModalOpen}
        onClose={() => {
          setIsRestoreModalOpen(false);
          setSelectedBackup(null);
        }}
        title={selectedBackup ? `Restore ${selectedBackup.name}` : "Restore Backup"}
        description={
          selectedBackup 
            ? "This will restore the system to the state captured in this backup" 
            : "Select a backup to restore from"
        }
        size="lg"
      >
        {!selectedBackup ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Available Backups</Label>
              <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
                {backups.map(backup => (
                  <div 
                    key={backup.id} 
                    className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                    onClick={() => setSelectedBackup(backup)}
                  >
                    <div>
                      <p className="font-medium">{backup.name}</p>
                      <p className="text-sm text-gray-500">{backup.date}</p>
                    </div>
                    <Badge variant={backup.type === "full" ? "default" : "secondary"}>
                      {backup.type === "full" ? "Full" : "Partial"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsRestoreModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                disabled={!selectedBackup}
                onClick={() => selectedBackup && handleRestoreBackup()}
              >
                Continue
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {isRestoring ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Restoring backup...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-gray-500">
                  The system will be temporarily unavailable during restoration.
                </p>
              </div>
            ) : (
              <>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Important Notice</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Restoring this backup will overwrite all current system data. 
                        Make sure to create a new backup before proceeding.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Backup Name:</span>
                    <span className="text-sm font-medium">{selectedBackup.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Backup Type:</span>
                    <span className="text-sm font-medium capitalize">{selectedBackup.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="text-sm font-medium">{selectedBackup.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Size:</span>
                    <span className="text-sm font-medium">{selectedBackup.size}</span>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedBackup(null)}
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleRestoreBackup}
                    className="bg-yellow-500 hover:bg-yellow-600"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Confirm Restore
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={`Delete ${selectedBackup?.name}`}
        description="This action cannot be undone. The backup will be permanently deleted."
        size="md"
      >
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDeleteBackup}
          >
            Delete Backup
          </Button>
        </div>
      </Modal>
    </div>
  );
}