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
  Settings,
  MessageCircle
} from "lucide-react"
import { useParents } from "@/hooks/useParents"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { useState } from "react"
import { confirmParentLink, rejectParentLink, requestUnlinkParent } from "@/services/parent-service"
import { toast } from "sonner"

export default function RelationshipPage() {
  const { accessToken, tenantDomain, isLoading: tokenLoading } = useRequestInfo();
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({});
  
  const {
    linkedParents,
    pendingLinks,
    loading,
    error,
    refetch,
    clearError
  } = useParents({ includePendingRequests: true }, accessToken, tenantDomain);

  const handleAction = async (action: () => Promise<any>, actionKey: string, successMessage: string) => {
    setLoadingActions(prev => ({ ...prev, [actionKey]: true }));
    try {
      await action();
      toast.success(successMessage);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoadingActions(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  const handleRequestUnlinkParent = async (parentId: number) => {
    if (!tenantDomain || !accessToken) return;
    await handleAction(
      () => requestUnlinkParent(parentId, tenantDomain, accessToken),
      `unlink-${parentId}`,
      "Unlink request sent successfully"
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <section className="flex flex-col gap-6 w-full">
        {/* Modern Header Section */}
        <div className="bg-gradient-to-r from-[#25AAE1] via-[#25AAE1] to-[#1D8CB3] p-8 rounded-2xl shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between text-white">
            <div className="flex items-center gap-6 mb-6 md:mb-0">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-white/30 shadow-xl">
                  <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                    <Heart className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#4CAF50] rounded-full flex items-center justify-center border-2 border-white">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Parent Relationships</h1>
                <p className="text-white/90 text-lg">
                  Manage your parent connections and requests
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{linkedParents?.length || 0} Linked</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{pendingLinks?.length || 0} Pending</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 bg-white/10 hover:bg-white/20 text-white border-white/20 relative rounded-xl transition-all duration-300 hover:scale-110"
              >
                <Bell className="h-6 w-6" />
                {pendingLinks?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FF5252] text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                    {pendingLinks.length}
                  </span>
                )}
              </Button>
              <Button
                onClick={refetch}
                disabled={loading}
                variant="ghost"
                size="icon"
                className="h-12 w-12 bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl transition-all duration-300 hover:scale-110"
              >
                <RefreshCw className={`h-6 w-6 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl transition-all duration-300 hover:scale-110"
              >
                <Settings className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-[#4CAF50] to-[#45A049] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">Linked Parents</p>
                <p className="text-3xl font-bold">{linkedParents?.length || 0}</p>
                <p className="text-white/70 text-xs">Active connections</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#FF9800] to-[#F57C00] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Clock className="h-8 w-8" />
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">Pending Requests</p>
                <p className="text-3xl font-bold">{pendingLinks?.length || 0}</p>
                <p className="text-white/70 text-xs">Awaiting approval</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#25AAE1] to-[#1D8CB3] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Heart className="h-8 w-8" />
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">Total Relationships</p>
                <p className="text-3xl font-bold">{(linkedParents?.length || 0) + (pendingLinks?.length || 0)}</p>
                <p className="text-white/70 text-xs">All connections</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#9C27B0] to-[#7B1FA2] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">Status</p>
                <p className="text-3xl font-bold">Active</p>
                <p className="text-white/70 text-xs">Account verified</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="border-red-200 bg-red-50 rounded-2xl shadow-lg">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Linked Parents */}
          <div className="space-y-6">
            <Card className="p-8 shadow-xl border-0 bg-white rounded-2xl">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
                Linked Parents
              </h2>
              <p className="text-gray-600 mb-6">Parents who are connected to your account</p>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading parents...</span>
                </div>
              ) : linkedParents?.length ? (
                <div className="space-y-4">
                  {linkedParents.map((parent) => (
                    <Card key={parent.parent_id} className="p-6 border-0 bg-gradient-to-r from-green-50 to-blue-50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-[#4CAF50] to-[#45A049] rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {parent.parent_full_name.split(' ').map(name => name.charAt(0)).join('').slice(0, 2)}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{parent.parent_full_name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                              <User className="h-4 w-4" />
                              Parent ID: {parent.parent_id}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <CheckCircle className="h-4 w-4" />
                              Relationship ID: {parent.relation_id}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-gradient-to-r from-[#4CAF50] to-[#45A049] text-white border-0 px-3 py-1 rounded-full shadow-lg">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Linked
                          </Badge>
                          <Button
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                            size="sm"
                            onClick={() => handleRequestUnlinkParent(parent.parent_id)}
                            disabled={loadingActions[`unlink-${parent.parent_id}`]}
                          >
                            {loadingActions[`unlink-${parent.parent_id}`] ? (
                              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <UserMinus className="h-4 w-4 mr-2" />
                            )}
                            Request Unlink
                          </Button>
                        </div>
                      </div>
                      
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Parents Linked</h3>
                  <p className="text-gray-500">You don't have any parents connected to your account yet.</p>
                </div>
              )}
            </Card>
          </div>

          {/* Pending Requests */}
          <div className="space-y-6">
            <Card className="p-8 shadow-xl border-0 bg-white rounded-2xl">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-[#FF9800] to-[#F57C00] rounded-xl">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                Pending Requests
              </h2>
              <p className="text-gray-600 mb-6">Parents requesting to link with your account</p>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-orange-600" />
                  <span className="ml-2 text-gray-600">Loading requests...</span>
                </div>
              ) : pendingLinks?.length ? (
                <div className="space-y-4">
                  {pendingLinks.map((parent) => (
                    <Card key={parent.parent_id} className="p-6 border-0 bg-gradient-to-r from-orange-50 to-yellow-50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-[#FF9800] to-[#F57C00] rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {parent.parent_full_name.split(' ').map(name => name.charAt(0)).join('').slice(0, 2)}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{parent.parent_full_name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                              <User className="h-4 w-4" />
                              Parent ID: {parent.parent_id}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              Pending link request
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-[#FF9800] to-[#F57C00] text-white border-0 px-3 py-1 rounded-full shadow-lg">
                          <Clock className="h-4 w-4 mr-1" />
                          Pending
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          className="bg-gradient-to-r from-[#4CAF50] to-[#45A049] hover:from-[#45A049] hover:to-[#4CAF50] text-white border-0 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
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
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
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
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Pending Requests</h3>
                  <p className="text-gray-500">You don't have any pending parent link requests.</p>
                </div>
              )}
            </Card>

            {/* Summary Card */}
            <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-[#9C27B0] to-[#7B1FA2] rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                Relationship Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-6 bg-white bg-opacity-70 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {linkedParents?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Linked Parents</div>
                </div>
                <div className="text-center p-6 bg-white bg-opacity-70 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {pendingLinks?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Pending Requests</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}