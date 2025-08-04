import { Search, Filter, MessageSquare, Users, User, Megaphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/utils/tailwind";
import { Conversation } from "./types";

interface SidebarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onOpenCompose: () => void;
  loading: boolean;
  error: string | null;
}

export function Sidebar({
  searchQuery,
  onSearchChange,
  conversations,
  selectedConversation,
  onSelectConversation,
  onOpenCompose,
  loading,
  error,
}: SidebarProps) {
  return (
    <Card className="p-3 lg:col-span-1 h-[calc(100vh-190px)] flex flex-col bg-white/80 backdrop-blur-sm border-0 shadow-md rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />
          <Input
            placeholder="Search messages..."
            className="pl-9 border-blue-100 bg-blue-50/50 focus-visible:ring-blue-200 rounded-full"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-blue-100 bg-blue-50/50 hover:bg-blue-100/50"
              title="Filter messages"
            >
              <Filter className="h-4 w-4 text-blue-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-xl shadow-lg border-blue-100"
          >
            <DropdownMenuItem className="cursor-pointer">
              All Messages
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Unread
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              Students
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Parents
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Classes
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Announcements
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="all" className="mb-4">
        <TabsList className="grid grid-cols-4 bg-blue-50/50 p-1 rounded-xl">
          <TabsTrigger
            value="all"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="students"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
          >
            Students
          </TabsTrigger>
          <TabsTrigger
            value="classes"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
          >
            Classes
          </TabsTrigger>
          <TabsTrigger
            value="parents"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
          >
            Parents
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-muted-foreground">
              Chargement des conversations...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <MessageSquare className="h-12 w-12 text-red-300 mb-2" />
            <p className="text-red-500 text-sm">Erreur: {error}</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-2 opacity-20" />
            <p className="text-muted-foreground">No conversations found</p>
            <Button
              variant="link"
              className="mt-2"
              onClick={onOpenCompose}
            >
              Start a new conversation
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all animate-fade-in",
                  selectedConversation?.id === conversation.id
                    ? "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 shadow-sm"
                    : "hover:bg-blue-50/50 border-l-4 border-transparent"
                )}
                onClick={() => onSelectConversation(conversation)}
              >
                <Avatar
                  className={cn(
                    "h-12 w-12 rounded-xl shadow-sm border-2",
                    conversation.type === "announcement"
                      ? "border-purple-200 bg-purple-50"
                      : conversation.type === "class"
                      ? "border-green-200 bg-green-50"
                      : conversation.type === "parent"
                      ? "border-amber-200 bg-amber-50"
                      : "border-blue-200 bg-blue-50"
                  )}
                >
                  <AvatarImage
                    src={conversation.participants[0].avatar}
                    alt={conversation.participants[0].name}
                    className="object-cover rounded-lg"
                  />
                  <AvatarFallback className="rounded-lg">
                    {conversation.participants[0].name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p
                      className={cn(
                        "font-medium truncate",
                        conversation.unreadCount > 0
                          ? "text-blue-800 font-semibold"
                          : ""
                      )}
                    >
                      {conversation.participants[0].name}
                      {conversation.unreadCount > 0 && (
                        <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                      )}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {conversation.lastMessage.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mt-0.5">
                    {conversation.type === "announcement" && (
                      <Badge
                        variant="outline"
                        className="text-xs py-0 h-5 bg-purple-50 text-purple-700 border-purple-200"
                      >
                        <Megaphone className="h-3 w-3 mr-1" />
                        Announcement
                      </Badge>
                    )}
                    {conversation.type === "class" && (
                      <Badge
                        variant="outline"
                        className="text-xs py-0 h-5 bg-green-50 text-green-700 border-green-200"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        Class
                      </Badge>
                    )}
                    {conversation.type === "parent" && (
                      <Badge
                        variant="outline"
                        className="text-xs py-0 h-5 bg-amber-50 text-amber-700 border-amber-200"
                      >
                        <User className="h-3 w-3 mr-1" />
                        Parent
                      </Badge>
                    )}
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage.content}
                    </p>
                  </div>
                </div>

                {conversation.unreadCount > 0 && (
                  <Badge className="h-6 w-6 flex items-center justify-center p-0 rounded-full bg-blue-500 text-white font-medium shadow-sm">
                    {conversation.unreadCount}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}