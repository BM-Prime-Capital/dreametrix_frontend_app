"use client";

import { useRequestInfo } from "@/hooks/useRequestInfo";
import { requestApprobationList, approveParentRequest } from "@/services/admin-service";
import { useEffect, useState } from "react";

interface ParentRequest {
  id: number;
  student_id: number;
  student_name: string;
  parent_id: number;
  parent_name: string;
  initiated_by_parent: boolean;
  requested_at: string;
}

const ParentsListPage = () => {
  const { accessToken, tenantDomain } = useRequestInfo();
  const [parents, setParents] = useState<ParentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState<ParentRequest | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const getVaParents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await requestApprobationList(accessToken, tenantDomain);
        console.log("result", result);
        
        // Use mock data for demonstration
        setParents([
          {
            "id": 15,
            "student_id": 22,
            "student_name": "John Doe",
            "parent_id": 7,
            "parent_name": "Marie Doe",
            "initiated_by_parent": true,
            "requested_at": "2025-09-14T12:45:23Z"
          },
          {
            "id": 16,
            "student_id": 23,
            "student_name": "Jane Doe",
            "parent_id": 7,
            "parent_name": "Marie Doe",
            "initiated_by_parent": true,
            "requested_at": "2025-09-14T12:50:10Z"
          },
          {
            "id": 17,
            "student_id": 24,
            "student_name": "Robert Smith",
            "parent_id": 8,
            "parent_name": "Jennifer Smith",
            "initiated_by_parent": false,
            "requested_at": "2025-09-14T13:15:30Z"
          },
          {
            "id": 18,
            "student_id": 25,
            "student_name": "Emily Johnson",
            "parent_id": 9,
            "parent_name": "Michael Johnson",
            "initiated_by_parent": true,
            "requested_at": "2025-09-14T14:20:45Z"
          },
          {
            "id": 19,
            "student_id": 26,
            "student_name": "Daniel Brown",
            "parent_id": 10,
            "parent_name": "Sarah Brown",
            "initiated_by_parent": false,
            "requested_at": "2025-09-14T15:30:20Z"
          },
          {
            "id": 20,
            "student_id": 27,
            "student_name": "Olivia Wilson",
            "parent_id": 11,
            "parent_name": "James Wilson",
            "initiated_by_parent": true,
            "requested_at": "2025-09-14T16:40:10Z"
          }
        ]);
      } catch (error) {
        console.error('Error:', error);
        setError("Error loading data");
      } finally {
        setIsLoading(false);
      }
    };
    
    getVaParents();
  }, [accessToken, tenantDomain]);

  // Function to get initials from a name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Handle approval button click
  const handleApproveClick = (parent: ParentRequest) => {
    setSelectedParent(parent);
    setShowModal(true);
  };

  // Handle approval confirmation
  const handleConfirmApprove = async () => {
    if (!selectedParent) return;
    
    setProcessing(true);
    try {
      // Call the approval API
      const result = await approveParentRequest( accessToken, tenantDomain, selectedParent.id);
      
      if (result.success) {
        // Remove the approved parent from the list
        setParents(prev => prev.filter(p => p.id !== selectedParent.id));
        setShowModal(false);
        setSelectedParent(null);
      } else {
        setError("Failed to approve the request");
      }
    } catch (error) {
      console.error('Approval error:', error);
      setError("Error processing approval");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 w-full">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Parent Approval Requests</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {isLoading ? (
          // Loading skeletons in grid layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <div className="h-4 bg-gray-400 rounded w-1/2"></div>
                  </div>
                  <div className="ml-3 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : parents.length > 0 ? (
          // Parents list in grid layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {parents.map((parent) => (
              <div key={parent.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-800 font-bold text-lg">
                      {getInitials(parent.parent_name)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">{parent.parent_name}</h3>
                    <p className="text-sm text-gray-500">Parent ID: {parent.parent_id}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Student:</span> {parent.student_name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Requested:</span> {formatDate(parent.requested_at)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {parent.initiated_by_parent 
                      ? "Initiated by parent" 
                      : "Initiated by school"}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleApproveClick(parent)}
                    className="flex-1 px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
                  >
                    Approve
                  </button>
                  <button className="flex-1 px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition">
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // No data
          <div className="bg-white p-8 text-center text-gray-500 rounded-lg shadow">
            No pending approval requests
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Approval</h2>
            
            {selectedParent && (
              <div className="mb-4">
                <p>Are you sure you want to approve the link request between:</p>
                <div className="mt-2 p-3 bg-gray-50 rounded">
                  <p className="font-semibold">{selectedParent.parent_name}</p>
                  <p className="text-sm">and</p>
                  <p className="font-semibold">{selectedParent.student_name}</p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApprove}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentsListPage;