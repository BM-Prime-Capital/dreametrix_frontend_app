// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import {
//   Search,
//   Plus,
//   MessageSquare,
//   Users,
//   User,
//   Bell,
//   Send,
//   Paperclip,
//   Calendar,
//   ChevronDown,
//   X,
//   Megaphone,
//   Star,
//   Filter,
//   Image as ImageIcon,
//   Smile,
//   MoreHorizontal,
//   Clock,
//   CheckCheck,
// } from "lucide-react";
// import { useChatRooms, useChatMessages } from "@/hooks/useChat";
// import { useTypingIndicator } from "@/hooks/useChatWebSocket";
// import { useChatNotifications } from "@/hooks/useChatNotifications";
// import { useCommunicationData } from "@/hooks/useCommunicationData";
// import { EnhancedChatRoom, EnhancedChatMessage } from "@/types/chat";
// import TypingIndicatorComponent from "@/components/chat/TypingIndicator";
// import ConnectionStatus from "@/components/chat/ConnectionStatus";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import PageTitleH1 from "@/components/ui/page-title-h1";
// import { cn } from "@/utils/tailwind";
// import DebugCommunicationData from "./DebugCommunicationData";

// // Types
// interface Message {
//   id: string;
//   sender: {
//     id: string;
//     name: string;
//     avatar: string;
//     role: "teacher" | "student" | "parent";
//   };
//   content: string;
//   timestamp: string;
//   attachments?: { name: string; url: string }[];
//   read: boolean;
// }

// interface Conversation {
//   id: string;
//   type: "individual" | "class" | "parent" | "announcement";
//   participants: {
//     id: string;
//     name: string;
//     avatar: string;
//     role: "teacher" | "student" | "parent";
//   }[];
//   lastMessage: Message;
//   unreadCount: number;
// }

// export default function TeacherCommunication() {
//   const [activeTab, setActiveTab] = useState("messages");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [newMessage, setNewMessage] = useState("");
//   const [composeDialogOpen, setComposeDialogOpen] = useState(false);
//   const [announceDialogOpen, setAnnounceDialogOpen] = useState(false);
//   const [recipientType, setRecipientType] = useState<
//     "student" | "class" | "parent"
//   >("student");
//   const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
//   const [isCreatingConversation, setIsCreatingConversation] = useState(false);
//   const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false);

//   // ID utilisateur actuel (à récupérer depuis le contexte d'auth)
//   const currentUserId = 1; // À remplacer par l'ID réel de l'utilisateur connecté

//   // Fetch real data instead of using mock data
//   const {
//     classes,
//     students,
//     parents,
//     teachers,
//     loading: dataLoading,
//     error: dataError,
//     refetch: refetchData,
//   } = useCommunicationData();

//   // Debug: Log the data to see what we're getting
//   useEffect(() => {
//     console.log("🔍 DEBUG TeacherCommunication Data:", {
//       dataLoading,
//       dataError,
//       studentsCount: students?.length || 0,
//       classesCount: classes?.length || 0,
//       parentsCount: parents?.length || 0,
//       teachersCount: teachers?.length || 0,
//       sampleStudent: students?.[0],
//       sampleClass: classes?.[0],
//     });
//   }, [dataLoading, dataError, students, classes, parents, teachers]);

//   // Hook pour les notifications
//   const {
//     notifyConversationCreated,
//     notifyAnnouncementSent,
//     notifyMessageSent,
//     notifyCreationError,
//     notifyMessageError,
//   } = useChatNotifications();

//   // Utilisation des hooks de chat avec API REST uniquement (WebSocket désactivé temporairement)
//   const {
//     rooms,
//     selectedRoom,
//     setSelectedRoom,
//     loading: roomsLoading,
//     error: roomsError,
//     createRoom,
//     // isConnected,
//     // reconnect,
//   } = useChatRooms(currentUserId);

//   const {
//     messages,
//     loading: messagesLoading,
//     error: messagesError,
//     sendMessage,
//     // typing,
//     // userStatuses,
//   } = useChatMessages(selectedRoom?.id || null);

//   // Gestion de l'indicateur de frappe (désactivé temporairement)
//   // const { isTyping, setIsTyping } = useTypingIndicator(
//   //   selectedRoom?.id || null
//   // );

//   // Variables temporaires pour remplacer les fonctionnalités WebSocket
//   const typing: any[] = [];
//   const userStatuses = {};
//   const isTyping = false;
//   const setIsTyping = (_value?: boolean) => {};

//   // Conversion des rooms en format de conversations pour l'interface existante
//   const conversations: Conversation[] = useMemo(() => {
//     return rooms.map((room) => ({
//       id: room.id.toString(),
//       type: room.is_group ? "class" : "individual",
//       participants: room.participants.map((p) => ({
//         id: p.id.toString(),
//         name: p.name,
//         avatar: p.avatar || "/assets/images/general/student.png",
//         role:
//           p.role === "admin"
//             ? "teacher"
//             : (p.role as "teacher" | "student" | "parent"),
//       })),
//       lastMessage: room.last_message
//         ? {
//             id: room.last_message.id.toString(),
//             sender: {
//               id: room.last_message.sender_info.id.toString(),
//               name: room.last_message.sender_info.name,
//               avatar:
//                 room.last_message.sender_info.avatar ||
//                 "/assets/images/general/student.png",
//               role:
//                 room.last_message.sender_info.role === "admin"
//                   ? "teacher"
//                   : (room.last_message.sender_info.role as
//                       | "teacher"
//                       | "student"
//                       | "parent"),
//             },
//             content: room.last_message.content,
//             timestamp: new Date(
//               room.last_message.created_at
//             ).toLocaleTimeString("fr-FR", {
//               hour: "2-digit",
//               minute: "2-digit",
//             }),
//             read: room.last_message.status !== "sent",
//           }
//         : {
//             id: "",
//             sender: {
//               id: "",
//               name: "",
//               avatar: "",
//               role: "student" as const,
//             },
//             content: "Aucun message",
//             timestamp: "",
//             read: true,
//           },
//       unreadCount: room.unread_count,
//     }));
//   }, [rooms]);

//   // Conversion des messages pour l'interface existante
//   const chatMessages: Message[] = useMemo(() => {
//     return messages.map((msg) => ({
//       id: msg.id.toString(),
//       sender: {
//         id: msg.sender_info.id.toString(),
//         name: msg.sender_info.name,
//         avatar: msg.sender_info.avatar || "/assets/images/general/student.png",
//         role:
//           msg.sender_info.role === "admin"
//             ? "teacher"
//             : (msg.sender_info.role as "teacher" | "student" | "parent"),
//       },
//       content: msg.content,
//       timestamp: new Date(msg.created_at).toLocaleTimeString("fr-FR", {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//       read: msg.status !== "sent",
//     }));
//   }, [messages]);

//   // Conversation sélectionnée basée sur la room sélectionnée
//   const selectedConversation = useMemo(() => {
//     return selectedRoom
//       ? conversations.find((c) => c.id === selectedRoom.id.toString()) || null
//       : null;
//   }, [selectedRoom, conversations]);

//   // Filter conversations based on search query
//   const filteredConversations = useMemo(() => {
//     return conversations.filter((conversation) => {
//       const participantNames = conversation.participants.map((p) =>
//         p.name.toLowerCase()
//       );
//       return participantNames.some((name) =>
//         name.includes(searchQuery.toLowerCase())
//       );
//     });
//   }, [conversations, searchQuery]);

//   // Handle sending a new message
//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !selectedRoom) return;

//     try {
//       await sendMessage(newMessage.trim());
//       setNewMessage("");
//       setIsTyping(false); // Arrêter l'indicateur de frappe
//       notifyMessageSent(); // Notification de succès
//     } catch (error) {
//       console.error("Erreur lors de l'envoi du message:", error);
//       notifyMessageError(); // Notification d'erreur
//     }
//   };

//   // Gérer les changements dans le champ de message
//   const handleMessageChange = (value: string) => {
//     setNewMessage(value);

//     // Gérer l'indicateur de frappe
//     if (value.trim()) {
//       setIsTyping(true);
//     } else {
//       setIsTyping(false);
//     }
//   };

//   // Handle selecting a conversation
//   const handleSelectConversation = (conversation: Conversation) => {
//     const room = rooms.find((r) => r.id.toString() === conversation.id);
//     if (room) {
//       setSelectedRoom(room);
//     }
//   };

//   // Handle creating a new conversation
//   const handleCreateConversation = async () => {
//     if (selectedRecipients.length === 0 || isCreatingConversation) return;

//     setIsCreatingConversation(true);

//     try {
//       // Déterminer le nom de la conversation basé sur le type et les destinataires
//       let conversationName = "";

//       if (recipientType === "student") {
//         const selectedStudentNames = students
//           .filter((student) => selectedRecipients.includes(student.id))
//           .map((student) => student.name);
//         conversationName =
//           selectedStudentNames.length === 1
//             ? `Conversation avec ${selectedStudentNames[0]}`
//             : `Conversation avec ${selectedStudentNames.length} étudiants`;
//       } else if (recipientType === "class") {
//         const selectedClassNames = classes
//           .filter((cls) => selectedRecipients.includes(cls.id))
//           .map((cls) => cls.name);
//         conversationName =
//           selectedClassNames.length === 1
//             ? `Classe ${selectedClassNames[0]}`
//             : `${selectedClassNames.length} classes`;
//       } else if (recipientType === "parent") {
//         const selectedParentNames = parents
//           .filter((parent) => selectedRecipients.includes(parent.id))
//           .map((parent) => parent.name);
//         conversationName =
//           selectedParentNames.length === 1
//             ? `Conversation avec ${selectedParentNames[0]}`
//             : `Conversation avec ${selectedParentNames.length} parents`;
//       }

//       // Créer la nouvelle conversation via l'API
//       await createRoom(conversationName);

//       // Close the dialog and reset state
//       setComposeDialogOpen(false);
//       setSelectedRecipients([]);

//       // Notification de succès
//       notifyConversationCreated(conversationName);
//     } catch (error) {
//       console.error("Erreur lors de la création de la conversation:", error);
//       notifyCreationError("conversation");
//     } finally {
//       setIsCreatingConversation(false);
//     }
//   };

//   // Handle creating a new announcement
//   const handleCreateAnnouncement = async () => {
//     if (
//       !newMessage.trim() ||
//       selectedRecipients.length === 0 ||
//       isCreatingAnnouncement
//     )
//       return;

//     setIsCreatingAnnouncement(true);

//     try {
//       // Déterminer le nom de l'annonce basé sur les destinataires
//       const selectedClassNames = classes
//         .filter((cls) => selectedRecipients.includes(cls.id))
//         .map((cls) => cls.name);

//       const announcementName =
//         selectedClassNames.length === 1
//           ? `Annonce - ${selectedClassNames[0]}`
//           : `Annonce - ${selectedClassNames.length} classes`;

//       // Créer une conversation de groupe pour l'annonce
//       const newRoom = await createRoom(announcementName);

//       // Si la room est créée avec succès, envoyer le message d'annonce
//       if (newRoom && selectedRoom) {
//         // Attendre un peu pour que la room soit sélectionnée
//         setTimeout(async () => {
//           try {
//             await sendMessage(newMessage.trim());
//           } catch (error) {
//             console.error(
//               "Erreur lors de l'envoi du message d'annonce:",
//               error
//             );
//           }
//         }, 500);
//       }

//       // Close the dialog and reset state
//       setAnnounceDialogOpen(false);
//       setSelectedRecipients([]);
//       setNewMessage("");

//       // Notification de succès
//       notifyAnnouncementSent(selectedRecipients.length);
//     } catch (error) {
//       console.error("Erreur lors de la création de l'annonce:", error);
//       notifyCreationError("announcement");
//     } finally {
//       setIsCreatingAnnouncement(false);
//     }
//   };

//   // Show error state if data loading failed
//   if (dataError) {
//     return (
//       <div className="flex flex-col gap-4 w-full">
//         <div className="flex justify-center items-center h-64">
//           <div className="text-center">
//             <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//               <h3 className="text-lg font-semibold text-red-800 mb-2">
//                 Error Loading Data
//               </h3>
//               <p className="text-red-600 mb-4">{dataError}</p>
//               <Button
//                 onClick={refetchData}
//                 className="bg-red-600 hover:bg-red-700"
//               >
//                 Try Again
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <section className="flex flex-col gap-4 w-full">
//         {/* Header */}
//         <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 px-6 py-5 rounded-xl shadow-lg overflow-hidden relative animate-fade-in">
//           <div className="absolute inset-0 bg-[url('/assets/images/bg.png')] bg-cover bg-center opacity-10"></div>
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-purple-500/80 to-pink-500/80"></div>

//           <div className="flex items-center gap-3 relative z-10">
//             <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm shadow-inner border border-white/30">
//               <MessageSquare className="h-6 w-6 text-white" />
//             </div>
//             <div>
//               <PageTitleH1
//                 title="Communication Center"
//                 className="text-white font-bold"
//               />
//               <p className="text-blue-100 text-sm mt-1">
//                 Connect with students, parents & colleagues
//               </p>
//             </div>
//           </div>

//           <div className="flex gap-3 relative z-10">
//             <Dialog
//               open={composeDialogOpen}
//               onOpenChange={setComposeDialogOpen}
//             >
//               <DialogTrigger asChild>
//                 <Button className="bg-white text-blue-600 hover:bg-blue-50 shadow-md border border-white/30 font-medium">
//                   <MessageSquare className="h-4 w-4 mr-2" />
//                   New Message
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl bg-gradient-to-b from-white to-blue-50/50">
//                 <DialogHeader className="pb-2 border-b">
//                   <DialogTitle className="text-xl font-semibold text-blue-700 flex items-center gap-2">
//                     <MessageSquare className="h-5 w-5" />
//                     New Message
//                   </DialogTitle>
//                 </DialogHeader>

//                 <div className="py-4 space-y-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Send to:</label>
//                     <div className="flex gap-2">
//                       <Button
//                         variant={
//                           recipientType === "student" ? "default" : "outline"
//                         }
//                         size="sm"
//                         onClick={() => setRecipientType("student")}
//                       >
//                         <User className="h-4 w-4 mr-1" />
//                         Student
//                       </Button>
//                       <Button
//                         variant={
//                           recipientType === "class" ? "default" : "outline"
//                         }
//                         size="sm"
//                         onClick={() => setRecipientType("class")}
//                       >
//                         <Users className="h-4 w-4 mr-1" />
//                         Class
//                       </Button>
//                       <Button
//                         variant={
//                           recipientType === "parent" ? "default" : "outline"
//                         }
//                         size="sm"
//                         onClick={() => setRecipientType("parent")}
//                       >
//                         <User className="h-4 w-4 mr-1" />
//                         Parent
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     {recipientType === "student" && (
//                       <div>
//                         <label className="text-sm font-medium">
//                           Select Students:
//                         </label>
//                         <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2">
//                           {dataLoading ? (
//                             <div className="text-center py-4">
//                               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
//                               <p className="text-sm text-muted-foreground mt-2">
//                                 Loading students...
//                               </p>
//                             </div>
//                           ) : dataError ? (
//                             <div className="text-center py-4">
//                               <p className="text-sm text-red-500 mb-2">
//                                 Error loading students: {dataError}
//                               </p>
//                               <Button
//                                 onClick={refetchData}
//                                 size="sm"
//                                 variant="outline"
//                               >
//                                 Retry
//                               </Button>
//                             </div>
//                           ) : students.length === 0 ? (
//                             <p className="text-sm text-muted-foreground text-center py-4">
//                               No students available
//                             </p>
//                           ) : (
//                             students
//                               .filter(
//                                 (student) =>
//                                   student && student.id && student.name
//                               ) // Filter out invalid students
//                               .map((student) => (
//                                 <div
//                                   key={student.id}
//                                   className="flex items-center space-x-2 py-1"
//                                 >
//                                   <Checkbox
//                                     id={student.id}
//                                     checked={selectedRecipients.includes(
//                                       student.id
//                                     )}
//                                     onCheckedChange={(checked) => {
//                                       if (checked) {
//                                         setSelectedRecipients([
//                                           ...selectedRecipients,
//                                           student.id,
//                                         ]);
//                                       } else {
//                                         setSelectedRecipients(
//                                           selectedRecipients.filter(
//                                             (id) => id !== student.id
//                                           )
//                                         );
//                                       }
//                                     }}
//                                   />
//                                   <label
//                                     htmlFor={student.id}
//                                     className="text-sm cursor-pointer flex-1"
//                                   >
//                                     {student.name}{" "}
//                                     <span className="text-muted-foreground">
//                                       ({student.class})
//                                     </span>
//                                   </label>
//                                 </div>
//                               ))
//                           )}
//                         </div>
//                       </div>
//                     )}

//                     {recipientType === "class" && (
//                       <div>
//                         <label className="text-sm font-medium">
//                           Select Classes:
//                         </label>
//                         <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2">
//                           {dataLoading ? (
//                             <div className="text-center py-4">
//                               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
//                               <p className="text-sm text-muted-foreground mt-2">
//                                 Loading classes...
//                               </p>
//                             </div>
//                           ) : dataError ? (
//                             <div className="text-center py-4">
//                               <p className="text-sm text-red-500 mb-2">
//                                 Error loading classes: {dataError}
//                               </p>
//                               <Button
//                                 onClick={refetchData}
//                                 size="sm"
//                                 variant="outline"
//                               >
//                                 Retry
//                               </Button>
//                             </div>
//                           ) : classes.length === 0 ? (
//                             <p className="text-sm text-muted-foreground text-center py-4">
//                               No classes available
//                             </p>
//                           ) : (
//                             classes
//                               .filter((cls) => cls && cls.id && cls.name) // Filter out invalid classes
//                               .map((cls) => (
//                                 <div
//                                   key={cls.id}
//                                   className="flex items-center space-x-2 py-1"
//                                 >
//                                   <Checkbox
//                                     id={cls.id}
//                                     checked={selectedRecipients.includes(
//                                       cls.id
//                                     )}
//                                     onCheckedChange={(checked) => {
//                                       if (checked) {
//                                         setSelectedRecipients([
//                                           ...selectedRecipients,
//                                           cls.id,
//                                         ]);
//                                       } else {
//                                         setSelectedRecipients(
//                                           selectedRecipients.filter(
//                                             (id) => id !== cls.id
//                                           )
//                                         );
//                                       }
//                                     }}
//                                   />
//                                   <label
//                                     htmlFor={cls.id}
//                                     className="text-sm cursor-pointer flex-1"
//                                   >
//                                     {cls.name}
//                                   </label>
//                                 </div>
//                               ))
//                           )}
//                         </div>
//                       </div>
//                     )}

//                     {recipientType === "parent" && (
//                       <div>
//                         <label className="text-sm font-medium">
//                           Select Parents:
//                         </label>
//                         <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2">
//                           {dataLoading ? (
//                             <div className="text-center py-4">
//                               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
//                               <p className="text-sm text-muted-foreground mt-2">
//                                 Loading parents...
//                               </p>
//                             </div>
//                           ) : parents.length === 0 ? (
//                             <p className="text-sm text-muted-foreground text-center py-4">
//                               No parents available
//                             </p>
//                           ) : (
//                             parents.map((parent) => (
//                               <div
//                                 key={parent?.id || Math.random()}
//                                 className="flex items-center space-x-2 py-1"
//                               >
//                                 <Checkbox
//                                   id={parent?.id || `parent-${Math.random()}`}
//                                   checked={selectedRecipients.includes(
//                                     parent?.id || ""
//                                   )}
//                                   onCheckedChange={(checked) => {
//                                     if (checked && parent?.id) {
//                                       setSelectedRecipients([
//                                         ...selectedRecipients,
//                                         parent.id,
//                                       ]);
//                                     } else if (parent?.id) {
//                                       setSelectedRecipients(
//                                         selectedRecipients.filter(
//                                           (id) => id !== parent.id
//                                         )
//                                       );
//                                     }
//                                   }}
//                                 />
//                                 <label
//                                   htmlFor={
//                                     parent?.id || `parent-${Math.random()}`
//                                   }
//                                   className="text-sm cursor-pointer flex-1"
//                                 >
//                                   {parent?.name || "Unknown Parent"}{" "}
//                                   <span className="text-muted-foreground">
//                                     (Parent of{" "}
//                                     {parent?.student || "Unknown Student"})
//                                   </span>
//                                 </label>
//                               </div>
//                             ))
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Message:</label>
//                     <Textarea
//                       placeholder="Type your message here..."
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       className="min-h-[100px]"
//                     />
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <Button variant="outline" size="sm">
//                       <Paperclip className="h-4 w-4 mr-1" />
//                       Attach File
//                     </Button>
//                     <Button variant="outline" size="sm">
//                       <Calendar className="h-4 w-4 mr-1" />
//                       Schedule
//                     </Button>
//                   </div>
//                 </div>

//                 <DialogFooter>
//                   <Button
//                     variant="outline"
//                     onClick={() => setComposeDialogOpen(false)}
//                     disabled={isCreatingConversation}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     onClick={handleCreateConversation}
//                     disabled={
//                       isCreatingConversation || selectedRecipients.length === 0
//                     }
//                   >
//                     {isCreatingConversation ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Creating...
//                       </>
//                     ) : (
//                       "Send Message"
//                     )}
//                   </Button>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>

//             <Dialog
//               open={announceDialogOpen}
//               onOpenChange={setAnnounceDialogOpen}
//             >
//               <DialogTrigger asChild>
//                 <Button
//                   variant="secondary"
//                   className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 shadow-md font-medium"
//                 >
//                   <Megaphone className="h-4 w-4 mr-2" />
//                   Announcement
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl bg-gradient-to-b from-white to-purple-50/50">
//                 <DialogHeader className="pb-2 border-b">
//                   <DialogTitle className="text-xl font-semibold text-purple-700 flex items-center gap-2">
//                     <Megaphone className="h-5 w-5" />
//                     Create Announcement
//                   </DialogTitle>
//                 </DialogHeader>

//                 <div className="py-4 space-y-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Announce to:</label>
//                     <Select defaultValue="all_classes">
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select audience" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all_classes">
//                           All My Classes
//                         </SelectItem>
//                         <SelectItem value="all_parents">All Parents</SelectItem>
//                         <SelectItem value="specific">
//                           Specific Classes
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Select Classes:
//                     </label>
//                     <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2">
//                       {dataLoading ? (
//                         <div className="text-center py-4">
//                           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
//                           <p className="text-sm text-muted-foreground mt-2">
//                             Loading classes...
//                           </p>
//                         </div>
//                       ) : classes.length === 0 ? (
//                         <p className="text-sm text-muted-foreground text-center py-4">
//                           No classes available
//                         </p>
//                       ) : (
//                         classes.map((cls) => (
//                           <div
//                             key={cls?.id || Math.random()}
//                             className="flex items-center space-x-2 py-1"
//                           >
//                             <Checkbox
//                               id={`announce-${cls?.id || Math.random()}`}
//                               checked={selectedRecipients.includes(
//                                 cls?.id || ""
//                               )}
//                               onCheckedChange={(checked) => {
//                                 if (checked && cls?.id) {
//                                   setSelectedRecipients([
//                                     ...selectedRecipients,
//                                     cls.id,
//                                   ]);
//                                 } else if (cls?.id) {
//                                   setSelectedRecipients(
//                                     selectedRecipients.filter(
//                                       (id) => id !== cls.id
//                                     )
//                                   );
//                                 }
//                               }}
//                             />
//                             <label
//                               htmlFor={`announce-${cls?.id || Math.random()}`}
//                               className="text-sm cursor-pointer flex-1"
//                             >
//                               {cls?.name || "Unknown Class"}
//                             </label>
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Announcement Title:
//                     </label>
//                     <Input placeholder="Enter a title for your announcement" />
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Announcement Content:
//                     </label>
//                     <Textarea
//                       placeholder="Type your announcement here..."
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       className="min-h-[100px]"
//                     />
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <Button variant="outline" size="sm">
//                       <Paperclip className="h-4 w-4 mr-1" />
//                       Attach File
//                     </Button>
//                     <Button variant="outline" size="sm">
//                       <Calendar className="h-4 w-4 mr-1" />
//                       Schedule
//                     </Button>
//                   </div>
//                 </div>

//                 <DialogFooter>
//                   <Button
//                     variant="outline"
//                     onClick={() => setAnnounceDialogOpen(false)}
//                     disabled={isCreatingAnnouncement}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     onClick={handleCreateAnnouncement}
//                     disabled={
//                       isCreatingAnnouncement ||
//                       !newMessage.trim() ||
//                       selectedRecipients.length === 0
//                     }
//                   >
//                     {isCreatingAnnouncement ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Posting...
//                       </>
//                     ) : (
//                       "Post Announcement"
//                     )}
//                   </Button>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in">
//           {/* Sidebar */}
//           <Card className="p-3 lg:col-span-1 h-[calc(100vh-190px)] flex flex-col bg-white/80 backdrop-blur-sm border-0 shadow-md rounded-xl overflow-hidden">
//             <div className="flex items-center gap-2 mb-4">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />
//                 <Input
//                   placeholder="Search messages..."
//                   className="pl-9 border-blue-100 bg-blue-50/50 focus-visible:ring-blue-200 rounded-full"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     className="rounded-full border-blue-100 bg-blue-50/50 hover:bg-blue-100/50"
//                     title="Filter messages"
//                   >
//                     <Filter className="h-4 w-4 text-blue-500" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent
//                   align="end"
//                   className="rounded-xl shadow-lg border-blue-100"
//                 >
//                   <DropdownMenuItem className="cursor-pointer">
//                     All Messages
//                   </DropdownMenuItem>
//                   <DropdownMenuItem className="cursor-pointer">
//                     Unread
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem className="cursor-pointer">
//                     Students
//                   </DropdownMenuItem>
//                   <DropdownMenuItem className="cursor-pointer">
//                     Parents
//                   </DropdownMenuItem>
//                   <DropdownMenuItem className="cursor-pointer">
//                     Classes
//                   </DropdownMenuItem>
//                   <DropdownMenuItem className="cursor-pointer">
//                     Announcements
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>

//             <Tabs defaultValue="all" className="mb-4">
//               <TabsList className="grid grid-cols-4 bg-blue-50/50 p-1 rounded-xl">
//                 <TabsTrigger
//                   value="all"
//                   className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
//                 >
//                   All
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="students"
//                   className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
//                 >
//                   Students
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="classes"
//                   className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
//                 >
//                   Classes
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="parents"
//                   className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
//                 >
//                   Parents
//                 </TabsTrigger>
//               </TabsList>
//             </Tabs>

//             <div className="overflow-y-auto flex-1">
//               {roomsLoading ? (
//                 <div className="flex flex-col items-center justify-center h-full text-center p-4">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
//                   <p className="text-muted-foreground">
//                     Chargement des conversations...
//                   </p>
//                 </div>
//               ) : roomsError ? (
//                 <div className="flex flex-col items-center justify-center h-full text-center p-4">
//                   <MessageSquare className="h-12 w-12 text-red-300 mb-2" />
//                   <p className="text-red-500 text-sm">Erreur: {roomsError}</p>
//                 </div>
//               ) : filteredConversations.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full text-center p-4">
//                   <MessageSquare className="h-12 w-12 text-muted-foreground mb-2 opacity-20" />
//                   <p className="text-muted-foreground">
//                     No conversations found
//                   </p>
//                   <Button
//                     variant="link"
//                     className="mt-2"
//                     onClick={() => setComposeDialogOpen(true)}
//                   >
//                     Start a new conversation
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="space-y-1">
//                   {filteredConversations.map((conversation) => (
//                     <div
//                       key={conversation.id}
//                       className={cn(
//                         "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all animate-fade-in",
//                         selectedConversation?.id === conversation.id
//                           ? "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 shadow-sm"
//                           : "hover:bg-blue-50/50 border-l-4 border-transparent"
//                       )}
//                       onClick={() => handleSelectConversation(conversation)}
//                     >
//                       <Avatar
//                         className={cn(
//                           "h-12 w-12 rounded-xl shadow-sm border-2",
//                           conversation.type === "announcement"
//                             ? "border-purple-200 bg-purple-50"
//                             : conversation.type === "class"
//                             ? "border-green-200 bg-green-50"
//                             : conversation.type === "parent"
//                             ? "border-amber-200 bg-amber-50"
//                             : "border-blue-200 bg-blue-50"
//                         )}
//                       >
//                         <AvatarImage
//                           src={conversation.participants[0].avatar}
//                           alt={conversation.participants[0].name}
//                           className="object-cover rounded-lg"
//                         />
//                         <AvatarFallback className="rounded-lg">
//                           {conversation.participants[0].name.charAt(0)}
//                         </AvatarFallback>
//                       </Avatar>

//                       <div className="flex-1 min-w-0">
//                         <div className="flex justify-between items-center">
//                           <p
//                             className={cn(
//                               "font-medium truncate",
//                               conversation.unreadCount > 0
//                                 ? "text-blue-800 font-semibold"
//                                 : ""
//                             )}
//                           >
//                             {conversation.participants[0].name}
//                             {conversation.unreadCount > 0 && (
//                               <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
//                             )}
//                           </p>
//                           <span className="text-xs text-muted-foreground">
//                             {conversation.lastMessage.timestamp}
//                           </span>
//                         </div>

//                         <div className="flex items-center gap-1 mt-0.5">
//                           {conversation.type === "announcement" && (
//                             <Badge
//                               variant="outline"
//                               className="text-xs py-0 h-5 bg-purple-50 text-purple-700 border-purple-200"
//                             >
//                               <Megaphone className="h-3 w-3 mr-1" />
//                               Announcement
//                             </Badge>
//                           )}
//                           {conversation.type === "class" && (
//                             <Badge
//                               variant="outline"
//                               className="text-xs py-0 h-5 bg-green-50 text-green-700 border-green-200"
//                             >
//                               <Users className="h-3 w-3 mr-1" />
//                               Class
//                             </Badge>
//                           )}
//                           {conversation.type === "parent" && (
//                             <Badge
//                               variant="outline"
//                               className="text-xs py-0 h-5 bg-amber-50 text-amber-700 border-amber-200"
//                             >
//                               <User className="h-3 w-3 mr-1" />
//                               Parent
//                             </Badge>
//                           )}
//                           <p className="text-sm text-muted-foreground truncate">
//                             {conversation.lastMessage.content}
//                           </p>
//                         </div>
//                       </div>

//                       {conversation.unreadCount > 0 && (
//                         <Badge className="h-6 w-6 flex items-center justify-center p-0 rounded-full bg-blue-500 text-white font-medium shadow-sm">
//                           {conversation.unreadCount}
//                         </Badge>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </Card>

//           {/* Message Content */}
//           <Card className="p-3 lg:col-span-2 h-[calc(100vh-190px)] flex flex-col bg-white/80 backdrop-blur-sm border-0 shadow-md rounded-xl overflow-hidden">
//             {selectedConversation ? (
//               <>
//                 {/* Conversation Header */}
//                 <div className="flex items-center justify-between pb-2 mb-1 border-b border-blue-100">
//                   <div className="flex items-center gap-3">
//                     <Avatar
//                       className={cn(
//                         "h-12 w-12 rounded-xl shadow-sm border-2",
//                         selectedConversation.type === "announcement"
//                           ? "border-purple-200 bg-purple-50"
//                           : selectedConversation.type === "class"
//                           ? "border-green-200 bg-green-50"
//                           : selectedConversation.type === "parent"
//                           ? "border-amber-200 bg-amber-50"
//                           : "border-blue-200 bg-blue-50"
//                       )}
//                     >
//                       <AvatarImage
//                         src={selectedConversation.participants[0].avatar}
//                         alt={selectedConversation.participants[0].name}
//                         className="object-cover rounded-lg"
//                       />
//                       <AvatarFallback className="rounded-lg">
//                         {selectedConversation.participants[0].name.charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <h3 className="font-semibold text-lg">
//                         {selectedConversation.participants[0].name}
//                       </h3>
//                       <div className="flex items-center gap-2">
//                         <Badge
//                           className={cn(
//                             "text-xs py-0.5 px-2",
//                             selectedConversation.type === "announcement"
//                               ? "bg-purple-50 text-purple-700 border-purple-200"
//                               : selectedConversation.type === "class"
//                               ? "bg-green-50 text-green-700 border-green-200"
//                               : selectedConversation.type === "parent"
//                               ? "bg-amber-50 text-amber-700 border-amber-200"
//                               : "bg-blue-50 text-blue-700 border-blue-200"
//                           )}
//                         >
//                           {selectedConversation.type === "class"
//                             ? "Class"
//                             : selectedConversation.type === "parent"
//                             ? "Parent"
//                             : selectedConversation.type === "announcement"
//                             ? "Announcement"
//                             : "Student"}
//                         </Badge>
//                         <span className="text-xs text-muted-foreground flex items-center">
//                           <Clock className="h-3 w-3 mr-1" />
//                           Last active: Today
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Button
//                             variant="outline"
//                             size="icon"
//                             className="rounded-full border-blue-100 hover:bg-blue-50"
//                           >
//                             <Star className="h-4 w-4 text-amber-400" />
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>Mark as important</TooltipContent>
//                       </Tooltip>

//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Button
//                             variant="outline"
//                             size="icon"
//                             className="rounded-full border-blue-100 hover:bg-blue-50"
//                           >
//                             <Bell className="h-4 w-4 text-blue-500" />
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>Notification settings</TooltipContent>
//                       </Tooltip>

//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Button
//                             variant="outline"
//                             size="icon"
//                             className="rounded-full border-blue-100 hover:bg-blue-50"
//                           >
//                             <MoreHorizontal className="h-4 w-4 text-gray-500" />
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>More options</TooltipContent>
//                       </Tooltip>

//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Button
//                             variant="outline"
//                             size="icon"
//                             onClick={() => setSelectedRoom(null)}
//                             className="rounded-full border-blue-100 hover:bg-blue-50 ml-2"
//                           >
//                             <X className="h-4 w-4 text-gray-500" />
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>Close conversation</TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                   </div>
//                 </div>

//                 {/* Messages */}
//                 <div className="flex-1 overflow-y-auto py-1 space-y-4 px-2 mb-1">
//                   {messagesLoading ? (
//                     <div className="flex justify-center items-center h-full">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                     </div>
//                   ) : chatMessages.length === 0 ? (
//                     <div className="flex justify-center items-center h-full text-gray-500">
//                       <p>Aucun message dans cette conversation</p>
//                     </div>
//                   ) : (
//                     <>
//                       {chatMessages.map((message, index) => (
//                         <div
//                           key={message.id}
//                           className={`flex gap-3 max-w-[85%] animate-fade-in ${
//                             message.sender.role === "teacher"
//                               ? "ml-auto flex-row-reverse"
//                               : ""
//                           }`}
//                         >
//                           <Avatar
//                             className={cn(
//                               "h-9 w-9 mt-1 rounded-xl border-2 shadow-sm flex-shrink-0",
//                               message.sender.role === "teacher"
//                                 ? "border-blue-200 bg-blue-50"
//                                 : "border-blue-100"
//                             )}
//                           >
//                             <AvatarImage
//                               src={message.sender.avatar}
//                               alt={message.sender.name}
//                               className="object-cover rounded-lg"
//                             />
//                             <AvatarFallback className="rounded-lg">
//                               {message.sender.name.charAt(0)}
//                             </AvatarFallback>
//                           </Avatar>

//                           <div
//                             className={cn(
//                               "rounded-2xl p-3 shadow-sm",
//                               message.sender.role === "teacher"
//                                 ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white mr-0"
//                                 : "bg-gradient-to-br from-gray-50 to-blue-50 border border-blue-100"
//                             )}
//                           >
//                             <div className="flex justify-between items-center mb-1">
//                               <span
//                                 className={cn(
//                                   "text-xs font-medium",
//                                   message.sender.role === "teacher"
//                                     ? "text-blue-100"
//                                     : "text-blue-700"
//                                 )}
//                               >
//                                 {message.sender.name}
//                               </span>
//                               <span
//                                 className={cn(
//                                   "text-xs flex items-center gap-1",
//                                   message.sender.role === "teacher"
//                                     ? "text-blue-100"
//                                     : "text-blue-400"
//                                 )}
//                               >
//                                 {message.timestamp}
//                                 {message.sender.role === "teacher" && (
//                                   <CheckCheck className="h-3 w-3 ml-1" />
//                                 )}
//                               </span>
//                             </div>
//                             <p
//                               className={cn(
//                                 "text-sm leading-relaxed",
//                                 message.sender.role === "teacher"
//                                   ? "text-white"
//                                   : "text-gray-800"
//                               )}
//                             >
//                               {message.content}
//                             </p>

//                             {message.attachments &&
//                               message.attachments.length > 0 && (
//                                 <div
//                                   className={cn(
//                                     "mt-3 pt-2",
//                                     message.sender.role === "teacher"
//                                       ? "border-t border-white/20"
//                                       : "border-t border-blue-100"
//                                   )}
//                                 >
//                                   {message.attachments.map((attachment, i) => (
//                                     <div
//                                       key={i}
//                                       className="flex items-center gap-1 text-xs mt-1"
//                                     >
//                                       <Paperclip
//                                         className={cn(
//                                           "h-3 w-3",
//                                           message.sender.role === "teacher"
//                                             ? "text-blue-100"
//                                             : "text-blue-500"
//                                         )}
//                                       />
//                                       <a
//                                         href={attachment.url}
//                                         className={cn(
//                                           "underline",
//                                           message.sender.role === "teacher"
//                                             ? "text-blue-100"
//                                             : "text-blue-600"
//                                         )}
//                                       >
//                                         {attachment.name}
//                                       </a>
//                                     </div>
//                                   ))}
//                                 </div>
//                               )}
//                           </div>
//                         </div>
//                       ))}

//                       {/* Indicateur de frappe (désactivé temporairement) */}
//                       {/* <TypingIndicatorComponent
//                         typing={typing}
//                         className="px-3 pb-2"
//                       /> */}
//                     </>
//                   )}
//                 </div>

//                 {/* Message Input */}
//                 <div className="pt-1 border-t border-blue-100 mt-auto">
//                   <div className="bg-blue-50/50 rounded-xl p-1 shadow-sm border border-blue-100">
//                     <div className="flex items-center gap-2">
//                       <Textarea
//                         placeholder="Type your message..."
//                         className="min-h-[40px] h-[40px] resize-none bg-white border-blue-100 focus-visible:ring-blue-200 rounded-xl"
//                         value={newMessage}
//                         onChange={(e) => handleMessageChange(e.target.value)}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter" && !e.shiftKey) {
//                             e.preventDefault();
//                             handleSendMessage();
//                           }
//                         }}
//                       />
//                       <div className="flex gap-2">
//                         <TooltipProvider>
//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <Button
//                                 variant="outline"
//                                 size="icon"
//                                 className="rounded-full border-blue-200 bg-white hover:bg-blue-50 h-9 w-9 flex-shrink-0"
//                               >
//                                 <Paperclip className="h-4 w-4 text-blue-500" />
//                               </Button>
//                             </TooltipTrigger>
//                             <TooltipContent>Attach file</TooltipContent>
//                           </Tooltip>

//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <Button
//                                 size="icon"
//                                 className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md h-9 w-9 flex-shrink-0"
//                                 onClick={handleSendMessage}
//                                 disabled={messagesLoading || !newMessage.trim()}
//                               >
//                                 {messagesLoading ? (
//                                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                                 ) : (
//                                   <Send className="h-4 w-4 text-white" />
//                                 )}
//                               </Button>
//                             </TooltipTrigger>
//                             <TooltipContent>Send message</TooltipContent>
//                           </Tooltip>
//                         </TooltipProvider>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div className="flex flex-col items-center justify-center h-full text-center">
//                 <div className="relative">
//                   <div className="absolute -inset-4 rounded-full bg-blue-100/50 animate-pulse"></div>
//                   <div className="relative bg-gradient-to-br from-blue-500 to-purple-500 p-6 rounded-full shadow-lg">
//                     <MessageSquare className="h-12 w-12 text-white" />
//                   </div>
//                 </div>
//                 <h3 className="text-2xl font-semibold mt-6 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                   No Conversation Selected
//                 </h3>
//                 <p className="text-muted-foreground mb-6 max-w-md">
//                   Select a conversation from the sidebar or start a new one to
//                   begin messaging with students, parents, or entire classes.
//                 </p>
//                 <div className="flex gap-3">
//                   <Button
//                     onClick={() => setComposeDialogOpen(true)}
//                     className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md px-6"
//                   >
//                     <MessageSquare className="h-4 w-4 mr-2" />
//                     New Message
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={() => setAnnounceDialogOpen(true)}
//                     className="border-blue-200 hover:bg-blue-50 shadow-sm px-6"
//                   >
//                     <Megaphone className="h-4 w-4 mr-2 text-blue-500" />
//                     Create Announcement
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </Card>
//         </div>
//       </section>

//       {/* Debug Component - only shows in development */}
//       <DebugCommunicationData />
//     </div>
//   );
// }
