"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  Sparkles
} from "lucide-react"
import { useParents } from "@/hooks/useParents"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { useState } from "react"
import { confirmParentLink, rejectParentLink, unlinkParent } from "@/services/parent-service"
import { toast } from "sonner"

export default function RelationshipPage() {
  const { accessToken, tenantDomain, isLoading: tokenLoading } = useRequestInfo();
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({});
  
  const {
    data: parentsData,
    pendingRequests,
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

  const handleUnlinkParent = async (parentId: number) => {
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
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-pink-600" />
              <h1 className="text-4xl font-bold text-gray-800">
                Parent Relationships
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={refetch} 
                variant="outline" 
                className="flex items-center gap-2"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          <p className="text-gray-600 mt-2">Manage your parent connections and requests</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Linked Parents */}
          <div className="space-y-6">
            <Card className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Linked Parents</h2>
                  <p className="text-gray-600">Parents who are connected to your account</p>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading parents...</span>
                </div>
              ) : parentsData?.results?.length ? (
                <div className="space-y-4">
                  {parentsData.results.map((parent) => (
                    <Card key={parent.id} className="p-4 border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                            {parent.user.first_name.charAt(0)}{parent.user.last_name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{parent.user.full_name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-3 w-3" />
                              {parent.user.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <Calendar className="h-3 w-3" />
                              Linked {formatDate(parent.created_at)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Linked
                          </Badge>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleUnlinkParent(parent.id)}
                            disabled={loadingActions[`unlink-${parent.id}`]}
                          >
                            {loadingActions[`unlink-${parent.id}`] ? (
                              <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                            ) : (
                              <UserMinus className="h-3 w-3 mr-1" />
                            )}
                            Unlink
                          </Button>
                        </div>
                      </div>
                      
                      {parent.children?.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600 mb-2">
                            Also parent to: {parent.children.length} other student(s)
                          </p>
                        </div>
                      )}
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
            <Card className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Bell className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Pending Requests</h2>
                  <p className="text-gray-600">Parents requesting to link with your account</p>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-orange-600" />
                  <span className="ml-2 text-gray-600">Loading requests...</span>
                </div>
              ) : pendingRequests?.length ? (
                <div className="space-y-4">
                  {pendingRequests.map((parent) => (
                    <Card key={parent.id} className="p-4 border border-orange-100 bg-orange-50 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold">
                            {parent.user.first_name.charAt(0)}{parent.user.last_name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{parent.user.full_name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-3 w-3" />
                              {parent.user.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <Clock className="h-3 w-3" />
                              Requested {formatDate(parent.created_at)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                          onClick={() => handleConfirmLink(parent.id)}
                          disabled={loadingActions[`confirm-${parent.id}`]}
                        >
                          {loadingActions[`confirm-${parent.id}`] ? (
                            <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          )}
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1"
                          size="sm"
                          onClick={() => handleRejectLink(parent.id)}
                          disabled={loadingActions[`reject-${parent.id}`]}
                        >
                          {loadingActions[`reject-${parent.id}`] ? (
                            <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
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
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">Relationship Summary</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white bg-opacity-60 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {parentsData?.count || 0}
                  </div>
                  <div className="text-sm text-gray-600">Linked Parents</div>
                </div>
                <div className="text-center p-3 bg-white bg-opacity-60 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {pendingRequests?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Pending Requests</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}