"use client";

import { useState } from "react";
//import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LifeBuoy,
  Plus,
  Search,
  Frown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Mail,
  MessageSquare,
  AlertCircle,
  User,
  Loader2,
  X,
  FileText
} from "lucide-react";

type Ticket = {
  id: string;
  title: string;
  description: string;
  category: "technical" | "billing" | "general" | "feature-request";
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "pending" | "resolved" | "closed";
  requester: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: string;
    message: string;
    timestamp: string;
    isAdmin: boolean;
  }[];
};

export default function SupportPage() {
  //const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "general" as "technical" | "billing" | "general" | "feature-request",
    priority: "medium" as "low" | "medium" | "high" | "critical"
  });

  // Sample data - replace with actual API calls
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "1",
      title: "Unable to add new school",
      description: "Getting an error when trying to add a new school to the system.",
      category: "technical",
      priority: "high",
      status: "open",
      requester: "admin@district1.edu",
      assignedTo: "support@edumanager.com",
      createdAt: "2024-02-15T10:30:00Z",
      updatedAt: "2024-02-15T10:30:00Z",
      messages: [
        {
          id: "1-1",
          sender: "admin@district1.edu",
          message: "I'm trying to add a new school but keep getting a 500 error.",
          timestamp: "2024-02-15T10:30:00Z",
          isAdmin: false
        },
        {
          id: "1-2",
          sender: "support@edumanager.com",
          message: "We're looking into this issue. Can you provide the exact error message?",
          timestamp: "2024-02-15T11:15:00Z",
          isAdmin: true
        }
      ]
    },
    {
      id: "2",
      title: "Billing discrepancy",
      description: "Our invoice shows incorrect charges for additional schools.",
      category: "billing",
      priority: "medium",
      status: "pending",
      requester: "finance@central.edu",
      assignedTo: "billing@edumanager.com",
      createdAt: "2024-02-10T14:45:00Z",
      updatedAt: "2024-02-12T09:20:00Z",
      messages: [
        {
          id: "2-1",
          sender: "finance@central.edu",
          message: "Our February invoice shows charges for 45 schools but we only have 42.",
          timestamp: "2024-02-10T14:45:00Z",
          isAdmin: false
        },
        {
          id: "2-2",
          sender: "billing@edumanager.com",
          message: "Thank you for reporting this. We'll verify and get back to you within 24 hours.",
          timestamp: "2024-02-10T15:30:00Z",
          isAdmin: true
        },
        {
          id: "2-3",
          sender: "billing@edumanager.com",
          message: "We've identified the issue and will issue a corrected invoice.",
          timestamp: "2024-02-12T09:20:00Z",
          isAdmin: true
        }
      ]
    },
    {
      id: "3",
      title: "Feature request: Custom reports",
      description: "Would like to request ability to generate custom reports.",
      category: "feature-request",
      priority: "low",
      status: "open",
      requester: "principal@sunnyvale.edu",
      assignedTo: "product@edumanager.com",
      createdAt: "2024-02-05T08:15:00Z",
      updatedAt: "2024-02-05T08:15:00Z",
      messages: [
        {
          id: "3-1",
          sender: "principal@sunnyvale.edu",
          message: "We'd like to be able to create custom reports with specific data fields.",
          timestamp: "2024-02-05T08:15:00Z",
          isAdmin: false
        }
      ]
    },
    {
      id: "4",
      title: "Login issues after update",
      description: "Several teachers reporting login problems after system update.",
      category: "technical",
      priority: "critical",
      status: "resolved",
      requester: "it@northdistrict.edu",
      assignedTo: "support@edumanager.com",
      createdAt: "2024-01-28T16:20:00Z",
      updatedAt: "2024-01-29T11:45:00Z",
      messages: [
        {
          id: "4-1",
          sender: "it@northdistrict.edu",
          message: "Multiple teachers can't login after yesterday's update.",
          timestamp: "2024-01-28T16:20:00Z",
          isAdmin: false
        },
        {
          id: "4-2",
          sender: "support@edumanager.com",
          message: "We've identified the issue and deployed a fix. Please try again.",
          timestamp: "2024-01-29T11:45:00Z",
          isAdmin: true
        }
      ]
    }
  ]);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.requester.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && ticket.status === activeTab;
  });

  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-green-100 text-green-800",
    high: "bg-yellow-100 text-yellow-800",
    critical: "bg-red-100 text-red-800"
  };

  const categoryIcons = {
    technical: <AlertCircle className="h-4 w-4" />,
    billing: <FileText className="h-4 w-4" />,
    general: <MessageSquare className="h-4 w-4" />,
    "feature-request": <Plus className="h-4 w-4" />
  };

  const statusBadges = {
    open: <Badge variant="default">Open</Badge>,
    pending: <Badge variant="secondary">Pending</Badge>,
    resolved: <Badge variant="outline">Resolved</Badge>,
    closed: <Badge variant="destructive">Closed</Badge>
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMsg = {
        id: `${selectedTicket.id}-${selectedTicket.messages.length + 1}`,
        sender: "superadmin@system.edu",
        message: newMessage,
        timestamp: new Date().toISOString(),
        isAdmin: true
      };
      
      setTickets(tickets.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { 
              ...ticket, 
              messages: [...ticket.messages, newMsg],
              updatedAt: new Date().toISOString()
            } 
          : ticket
      ));
      
      setNewMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTicketData: Ticket = {
        id: `${tickets.length + 1}`,
        title: newTicket.title,
        description: newTicket.description,
        category: newTicket.category,
        priority: newTicket.priority,
        status: "open",
        requester: "superadmin@system.edu",
        assignedTo: "support@edumanager.com",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [{
          id: `${tickets.length + 1}-1`,
          sender: "superadmin@system.edu",
          message: newTicket.description,
          timestamp: new Date().toISOString(),
          isAdmin: true
        }]
      };
      
      setTickets([newTicketData, ...tickets]);
      setNewTicket({
        title: "",
        description: "",
        category: "general",
        priority: "medium"
      });
      setIsTicketModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <LifeBuoy className="h-6 w-6" />
            Support Center
          </h1>
          <p className="text-sm text-gray-500">
            Manage support tickets and customer inquiries ({tickets.length} total)
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button
            className="gap-2"
            onClick={() => setIsTicketModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tickets by title, description or requester..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="all" className="py-2">
            All Tickets
          </TabsTrigger>
          <TabsTrigger value="open" className="py-2">
            Open
          </TabsTrigger>
          <TabsTrigger value="pending" className="py-2">
            Pending
          </TabsTrigger>
          <TabsTrigger value="resolved" className="py-2">
            Resolved
          </TabsTrigger>
          <TabsTrigger value="closed" className="py-2">
            Closed
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tickets List */}
      {filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredTickets.map((ticket) => (
            <Card 
              key={ticket.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg truncate">{ticket.title}</h3>
                      {statusBadges[ticket.status]}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{ticket.description}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {categoryIcons[ticket.category]}
                        {ticket.category.replace("-", " ")}
                      </Badge>
                      <Badge className={`${priorityColors[ticket.priority]} flex items-center gap-1`}>
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(ticket.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                    <div className="text-sm text-gray-600 truncate">
                      {ticket.requester}
                    </div>
                    <div className="text-xs text-gray-500">
                      Last updated: {new Date(ticket.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 flex flex-col items-center justify-center gap-4">
          <Frown className="h-12 w-12 text-gray-400" />
          <h3 className="font-medium text-lg">No tickets found</h3>
          <p className="text-sm text-gray-500 max-w-md text-center">
            No tickets match your search criteria. Try adjusting your search or filters.
          </p>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear search
          </Button>
        </Card>
      )}

      {/* Pagination */}
      {filteredTickets.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm text-gray-500">
            Page 1 of 1
          </div>
          <Button variant="outline" className="gap-2">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{selectedTicket.title}</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedTicket(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {/* Ticket Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-gray-500">Status</Label>
                  <div>{statusBadges[selectedTicket.status]}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Priority</Label>
                  <Badge className={`${priorityColors[selectedTicket.priority]}`}>
                    {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Category</Label>
                  <Badge variant="outline" className="flex items-center gap-1 w-fit">
                    {categoryIcons[selectedTicket.category]}
                    {selectedTicket.category.replace("-", " ")}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Requester</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{selectedTicket.requester}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Assigned To</Label>
                  <div>{selectedTicket.assignedTo}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Created</Label>
                  <div>{new Date(selectedTicket.createdAt).toLocaleString()}</div>
                </div>
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <Label className="text-gray-500">Description</Label>
                <Card className="p-4 bg-gray-50">
                  <p>{selectedTicket.description}</p>
                </Card>
              </div>
              
              {/* Messages */}
              <div className="space-y-4">
                <Label className="text-gray-500">Conversation</Label>
                <div className="space-y-4">
                  {selectedTicket.messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.isAdmin ? "justify-end" : "justify-start"}`}
                    >
                      <div 
                        className={`max-w-[80%] p-3 rounded-lg ${message.isAdmin ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                      >
                        <div className="text-xs font-medium mb-1">
                          {message.sender} • {new Date(message.timestamp).toLocaleString()}
                        </div>
                        <p>{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Reply */}
              <div className="space-y-2">
                <Label className="text-gray-500">Reply</Label>
                <Textarea
                  placeholder="Type your response here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedTicket(null)}
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Mail className="h-4 w-4 mr-2" />
                    )}
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* New Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Create New Support Ticket</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsTicketModalOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <form onSubmit={handleCreateTicket} className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title*</Label>
                <Input 
                  id="title" 
                  placeholder="Brief description of the issue"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description*</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed explanation of the issue or request"
                  className="min-h-[150px]"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category*</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({
                      ...newTicket, 
                      category: e.target.value as "technical" | "billing" | "general" | "feature-request"
                    })}
                    required
                  >
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing Question</option>
                    <option value="general">General Inquiry</option>
                    <option value="feature-request">Feature Request</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority*</Label>
                  <select
                    id="priority"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({
                      ...newTicket, 
                      priority: e.target.value as "low" | "medium" | "high" | "critical"
                    })}
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Create Ticket
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}