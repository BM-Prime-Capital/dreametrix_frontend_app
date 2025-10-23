"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  Mail,
  Calendar,
  UserMinus,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  Heart,
  User,
  Bell,
  Sparkles,
  TrendingUp,
  ArrowLeft,
  MoreVertical,
  XOctagon
} from "lucide-react"
import { useParents } from "@/hooks/useParents"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { useState } from "react"
import { confirmParentLink, rejectParentLink, requestUnlinkParent, unlinkParent, cancelUnlinkRequest } from "@/services/parent-service"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function RelationshipPage() {
  const { accessToken, tenantDomain, isLoading: tokenLoading } = useRequestInfo();
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();
  
  // Pagination state for linked parents
  const [currentPageLinked, setCurrentPageLinked] = useState(1);
  const [itemsPerPageLinked] = useState(3);
  
  // Pagination state for pending requests
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [itemsPerPagePending] = useState(3);

  // Pagination state for unlink requests
  const [currentPageUnlink, setCurrentPageUnlink] = useState(1);
  const [itemsPerPageUnlink] = useState(3);

  const {
    linkedParents,
    pendingLinks,
    unlinkRequests,
    loading,
    error,
    refetch,
    clearError
  } = useParents({ includePendingRequests: true, includeUnlinkRequests: true }, accessToken, tenantDomain);

  const handleAction = async (action: () => Promise<any>, actionKey: string, successMessage: string) => {
    setLoadingActions(prev => ({ ...prev, [actionKey]: true }));
    try {
      const response = await action();
      
      // Check for specific response messages
      if (response?.message) {
        const message = response.message;
        
        if (message.includes('demande de déliaison existe déjà') || 
            message.includes('Notification renvoyée à l\'administrateur')) {
          toast.info("ℹ️ Reminder: An unlink request already exists. Administrator has been notified again.");
          // No refetch needed for reminder - no data changed
        } else {
          // Show the actual message from the server if it's different
          toast.success('Parent link confirmed successfully');
          refetch();
        }
      } else {
        toast.success(successMessage);
        refetch();
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoadingActions(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  const handleRequestUnlinkParent = async (parentId: number) => {
    if (!tenantDomain || !accessToken) return;
    await handleAction(
      () => unlinkParent(parentId, tenantDomain, accessToken),
      `unlink-${parentId}`,
      "Parent unlinked successfully"
    );
  };

  const handleConfirmLink = async (parentId: number) => {
    if (!tenantDomain || !accessToken) return;
    await handleAction(
      () => confirmParentLink(parentId, tenantDomain, accessToken),
      `confirm-${parentId}`,
      "Parent link confirmed successfully"
    );
  };

  const handleRejectLink = async (parentId: number) => {
    if (!tenantDomain || !accessToken) return;
    await handleAction(
      () => rejectParentLink(parentId, tenantDomain, accessToken),
      `reject-${parentId}`,
      "Parent link rejected successfully"
    );
  };

  const handleCancelUnlinkRequest = async (requestId: number) => {
    if (!tenantDomain || !accessToken) return;
    await handleAction(
      () => cancelUnlinkRequest(requestId, tenantDomain, accessToken),
      `cancel-unlink-${requestId}`,
      "Unlink request canceled successfully"
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Pagination logic functions
  const paginateLinkedParents = () => {
    if (!linkedParents) return [];
    const startIndex = (currentPageLinked - 1) * itemsPerPageLinked;
    const endIndex = startIndex + itemsPerPageLinked;
    return linkedParents.slice(startIndex, endIndex);
  };

  const paginatePendingLinks = () => {
    if (!pendingLinks) return [];
    const startIndex = (currentPagePending - 1) * itemsPerPagePending;
    const endIndex = startIndex + itemsPerPagePending;
    return pendingLinks.slice(startIndex, endIndex);
  };

  const getTotalPagesLinked = () => {
    if (!linkedParents) return 0;
    return Math.ceil(linkedParents.length / itemsPerPageLinked);
  };

  const getTotalPagesPending = () => {
    if (!pendingLinks) return 0;
    return Math.ceil(pendingLinks.length / itemsPerPagePending);
  };

  const handleLinkedPageChange = (page: number) => {
    setCurrentPageLinked(page);
  };

  const handlePendingPageChange = (page: number) => {
    setCurrentPagePending(page);
  };

  // Pagination for unlink requests
  const paginateUnlinkRequests = () => {
    if (!unlinkRequests) return [];
    const startIndex = (currentPageUnlink - 1) * itemsPerPageUnlink;
    const endIndex = startIndex + itemsPerPageUnlink;
    return unlinkRequests.slice(startIndex, endIndex);
  };

  const getTotalPagesUnlink = () => {
    if (!unlinkRequests) return 0;
    return Math.ceil(unlinkRequests.length / itemsPerPageUnlink);
  };

  const handleUnlinkPageChange = (page: number) => {
    setCurrentPageUnlink(page);
  };

  // Reusable Pagination Controls Component
  const PaginationControls = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    totalItems, 
    itemsPerPage,
    itemName 
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
    itemName: string;
  }) => {
    if (totalPages <= 1) return null;
    
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-600 order-2 sm:order-1">
          Showing {startItem}-{endItem} of {totalItems} {itemName}
        </div>
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-gray-600 border-gray-300 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                  className={
                    currentPage === pageNumber
                      ? "bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white hover:from-[#1D8CB3] hover:to-[#25AAE1] rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                      : "text-gray-600 border-gray-300 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-105"
                  }
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-gray-600 border-gray-300 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  if (tokenLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-[#25AAE1]" />
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!tokenLoading && (!accessToken || accessToken.trim() === '')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to view your parent relationships.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header avec le même style que le dashboard */}
      <div className="rounded-2xl p-8 mx-4 mt-4 bg-gradient-to-r from-slate-700 via-slate-600 to-gray-700 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Parent Relationships
              </h1>
              <p className="text-gray-200 text-lg opacity-90">
                Manage your parent connections and requests
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-white/30 shadow-2xl">
              <AvatarFallback className="bg-white/20 text-xl font-bold text-white">
                <Heart className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 shadow-sm">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{linkedParents?.length || 0}</p>
                  <p className="text-sm text-gray-600 font-medium">Linked Parents</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-50 text-amber-600 shadow-sm">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{pendingLinks?.length || 0}</p>
                  <p className="text-sm text-gray-600 font-medium">Pending Requests</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-rose-50 text-rose-600 shadow-sm">
                  <XOctagon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{unlinkRequests?.length || 0}</p>
                  <p className="text-sm text-gray-600 font-medium">Unlink Requests</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-50 text-slate-600 shadow-sm">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">Active</p>
                  <p className="text-sm text-gray-600 font-medium">Account Status</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="border-red-200 bg-red-50 rounded-2xl shadow-lg mb-6">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
                <Button 
                  onClick={clearError} 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Linked Parents Section */}
            <div className="space-y-6">
              <Card className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Linked Parents</h2>
                        <p className="text-emerald-50">Parents connected to your account</p>
                      </div>
                    </div>
                    
                    <Button
                      onClick={refetch}
                      disabled={loading}
                      variant="ghost"
                      className="text-white hover:bg-white/20 border-0 rounded-xl transition-all duration-300"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-600">Loading parents...</span>
                    </div>
                  ) : linkedParents?.length ? (
                    <>
                      <div className="space-y-4">
                        {paginateLinkedParents().map((parent) => (
                          <Card key={parent.parent_id} className="p-5 border border-gray-200 bg-white hover:shadow-md transition-all duration-300 hover:border-emerald-300 rounded-xl group">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform duration-300">
                                    {parent.parent_full_name.split(' ').map(name => name.charAt(0)).join('').slice(0, 2)}
                                  </div>
                                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <CheckCircle className="h-3 w-3 text-white" />
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">{parent.parent_full_name}</h3>
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      ID: {parent.parent_id}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <CheckCircle className="h-3 w-3" />
                                      Relation ID: {parent.relation_id}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Button
                                  className="bg-gradient-to-r from-rose-400 to-red-500 hover:from-rose-500 hover:to-red-600 text-white border-0 rounded-lg shadow-sm transition-all duration-300 hover:scale-[1.02] text-sm px-4 py-2"
                                  onClick={() => handleRequestUnlinkParent(parent.parent_id)}
                                  disabled={loadingActions[`unlink-${parent.parent_id}`]}
                                >
                                  {loadingActions[`unlink-${parent.parent_id}`] ? (
                                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                  ) : (
                                    <UserMinus className="h-4 w-4 mr-2" />
                                  )}
                                  Unlink
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                      
                      <PaginationControls
                        currentPage={currentPageLinked}
                        totalPages={getTotalPagesLinked()}
                        onPageChange={handleLinkedPageChange}
                        totalItems={linkedParents.length}
                        itemsPerPage={itemsPerPageLinked}
                        itemName="linked parents"
                      />
                    </>
                  
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No Parents Linked</h3>
                      <p className="text-gray-500">You don't have any parents connected to your account yet.</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Pending Requests Section */}
            <div className="space-y-6">
              <Card className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Bell className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Pending Requests</h2>
                        <p className="text-amber-50">Parents requesting to link with your account</p>
                      </div>
                    </div>

                    {pendingLinks?.length > 0 && (
                      <Badge className="bg-white text-amber-700 border-0 px-3 py-1 rounded-full shadow-md font-semibold">
                        {pendingLinks.length} Pending
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin text-orange-600" />
                      <span className="ml-2 text-gray-600">Loading requests...</span>
                    </div>
                  ) : pendingLinks?.length ? (
                    <>
                      <div className="space-y-4">
                        {paginatePendingLinks().map((parent) => (
                          <Card key={parent.parent_id} className="p-5 border border-gray-200 bg-white hover:shadow-md transition-all duration-300 hover:border-amber-300 rounded-xl group">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform duration-300">
                                    {parent.parent_full_name.split(' ').map(name => name.charAt(0)).join('').slice(0, 2)}
                                  </div>
                                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <Clock className="h-3 w-3 text-white" />
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">{parent.parent_full_name}</h3>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <User className="h-3 w-3" />
                                    Parent ID: {parent.parent_id}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <Button
                                className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white border-0 rounded-lg shadow-sm transition-all duration-300 hover:scale-[1.02]"
                                onClick={() => handleConfirmLink(parent.parent_id)}
                                disabled={loadingActions[`confirm-${parent.parent_id}`]}
                              >
                                {loadingActions[`confirm-${parent.parent_id}`] ? (
                                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                Approve
                              </Button>
                              <Button
                                className="bg-gradient-to-r from-rose-400 to-red-500 hover:from-rose-500 hover:to-red-600 text-white border-0 rounded-lg shadow-sm transition-all duration-300 hover:scale-[1.02]"
                                onClick={() => handleRejectLink(parent.parent_id)}
                                disabled={loadingActions[`reject-${parent.parent_id}`]}
                              >
                                {loadingActions[`reject-${parent.parent_id}`] ? (
                                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <XCircle className="h-4 w-4 mr-2" />
                                )}
                                Reject
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                      
                      <PaginationControls
                        currentPage={currentPagePending}
                        totalPages={getTotalPagesPending()}
                        onPageChange={handlePendingPageChange}
                        totalItems={pendingLinks.length}
                        itemsPerPage={itemsPerPagePending}
                        itemName="pending requests"
                      />
                    </>
                  
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bell className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No Pending Requests</h3>
                      <p className="text-gray-500">You don't have any pending parent link requests.</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Quick Stats Card */}
              <Card className="rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-600 to-gray-700 text-white shadow-lg">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Quick Overview</h3>
                      <p className="text-gray-200">Your relationship status at a glance</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                      <div className="text-2xl font-bold text-white mb-1">
                        {linkedParents?.length || 0}
                      </div>
                      <div className="text-sm text-gray-200 font-medium">Active Links</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                      <div className="text-2xl font-bold text-white mb-1">
                        {pendingLinks?.length || 0}
                      </div>
                      <div className="text-sm text-gray-200 font-medium">Awaiting Review</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* My Unlink Requests Section - Full Width */}
          <div className="mt-8">
            <Card className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <XOctagon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">My Unlink Requests</h2>
                      <p className="text-rose-50">Pending requests to unlink from parents</p>
                    </div>
                  </div>

                  {unlinkRequests?.length > 0 && (
                    <Badge className="bg-white text-rose-700 border-0 px-3 py-1 rounded-full shadow-md font-semibold">
                      {unlinkRequests.filter(req => !req.approved).length} Pending
                    </Badge>
                  )}
                </div>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-red-600" />
                    <span className="ml-2 text-gray-600">Loading unlink requests...</span>
                  </div>
                ) : unlinkRequests?.length ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {paginateUnlinkRequests().map((request) => (
                        <Card key={request.id} className="p-5 border border-gray-200 bg-white hover:shadow-md transition-all duration-300 hover:border-rose-300 rounded-xl group">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className={`w-12 h-12 ${request.approved ? 'bg-gradient-to-br from-emerald-400 to-teal-500' : 'bg-gradient-to-br from-rose-400 to-pink-500'} rounded-xl flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform duration-300`}>
                                  {request.parent_name.split(' ').map(name => name.charAt(0)).join('').slice(0, 2)}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${request.approved ? 'bg-emerald-500' : 'bg-amber-500'} rounded-full border-2 border-white flex items-center justify-center`}>
                                  {request.approved ? (
                                    <CheckCircle className="h-3 w-3 text-white" />
                                  ) : (
                                    <Clock className="h-3 w-3 text-white" />
                                  )}
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-base font-semibold text-gray-900 truncate mb-1">{request.parent_name}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <User className="h-3 w-3" />
                                  Parent ID: {request.parent}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Created:
                              </span>
                              <span className="text-gray-900 font-medium">
                                {request.created_at ? formatDate(request.created_at) : 'N/A'}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Status:</span>
                              <Badge className={request.approved ? "bg-emerald-50 text-emerald-700 border-0" : "bg-amber-50 text-amber-700 border-0"}>
                                {request.approved ? 'Approved' : 'Pending'}
                              </Badge>
                            </div>

                            {request.approved && request.approved_at && (
                              <div className="flex items-center justify-between text-sm pt-2 border-t">
                                <span className="text-gray-600 flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Approved:
                                </span>
                                <span className="text-gray-900 font-medium">
                                  {formatDate(request.approved_at)}
                                </span>
                              </div>
                            )}

                            {!request.approved && (
                              <Button
                                className="w-full bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700 text-white border-0 rounded-lg shadow-sm transition-all duration-300 hover:scale-[1.02] text-sm"
                                onClick={() => handleCancelUnlinkRequest(request.id)}
                                disabled={loadingActions[`cancel-unlink-${request.id}`]}
                              >
                                {loadingActions[`cancel-unlink-${request.id}`] ? (
                                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <XCircle className="h-4 w-4 mr-2" />
                                )}
                                Cancel Request
                              </Button>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>

                    <PaginationControls
                      currentPage={currentPageUnlink}
                      totalPages={getTotalPagesUnlink()}
                      onPageChange={handleUnlinkPageChange}
                      totalItems={unlinkRequests.length}
                      itemsPerPage={itemsPerPageUnlink}
                      itemName="unlink requests"
                    />
                  </>

                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <XOctagon className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Unlink Requests</h3>
                    <p className="text-gray-500">You haven't requested to unlink from any parents yet.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}