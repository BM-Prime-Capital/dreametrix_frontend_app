"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiSearch, FiChevronRight, FiUser, FiX } from 'react-icons/fi';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { getAllChildren } from '@/services/parent-services';
import { useRequestInfo } from '@/hooks/useRequestInfo';

const avatarColors = [
  'bg-blue-100 text-blue-600',
  'bg-green-100 text-green-600',
  'bg-yellow-100 text-yellow-600',
  'bg-purple-100 text-purple-600',
  'bg-pink-100 text-pink-600',
  'bg-indigo-100 text-indigo-600',
  'bg-teal-100 text-teal-600',
  'bg-orange-100 text-orange-600'
];

const getAvatarColor = (name: string) => {
  const charCode = name.charCodeAt(0) + (name.length > 1 ? name.charCodeAt(1) : 0);
  return avatarColors[charCode % avatarColors.length];
};

interface Parent {
  relation_id: number;
  student_id: number;
  student_user_id: number;
  student_full_name: string;
  email?: string;
  status?: 'active' | 'inactive';
  last_update?: string;
}

const ParentsListPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [parents, setParents] = useState<Parent[]>([]);
  const { accessToken, tenantDomain } = useRequestInfo();
  const [showUnlinkModal, setShowUnlinkModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const getVaParents = async () => {
      setIsLoading(true);
      try {
        const result = await getAllChildren(accessToken, tenantDomain);
        console.log("result", result);
        
        const transformedParents: Parent[] = result.data.map((item: any) => ({
          relation_id: item.relation_id,
          student_id: item.student_id,
          student_user_id: item.student_user_id,
          student_full_name: item.student_full_name,
          status: 'active' as const,
          last_update: new Date().toISOString().split('T')[0]
        }));
        
        setParents(transformedParents);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getVaParents();
  }, [accessToken, tenantDomain]);

  const handleRequestUnlink = async () => {
    if (!selectedParent) return;
    
    setIsProcessing(true);
    setErrorMessage(null);
    
    try {
      const url = `${tenantDomain}/parents/request-unlink/`;
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          relation_id: selectedParent.relation_id
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error requesting unlink:', errorData);
        setErrorMessage(errorData || "Une erreur s'est produite lors de la demande de dissociation.");
        return;
      }

      const data = await response.json();
      console.log('Unlink request successful:', data);
      
      setShowUnlinkModal(false);
      setSelectedParent(null);
      
    } catch (error) {
      console.error('Network error:', error);
      setErrorMessage("Erreur réseau lors de la demande de dissociation");
    } finally {
      setIsProcessing(false);
    }
  };

  const openUnlinkModal = (parent: Parent) => {
    setSelectedParent(parent);
    setShowUnlinkModal(true);
    setErrorMessage(null);
  };

  const closeUnlinkModal = () => {
    setShowUnlinkModal(false);
    setSelectedParent(null);
    setErrorMessage(null);
  };

  const filteredParents = parents.filter(parent => 
    parent.student_full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        <div className="w-full bg-white p-4 rounded-xl shadow-sm mb-6">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Children Directory</h1>
          <p className="text-gray-600 mt-1">
            {filteredParents.length} {filteredParents.length === 1 ? 'child' : 'children'} found
          </p>
        </div>
      </div>

      <div className="w-full bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by child's name..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredParents.map((parent) => {
            const nameParts = parent.student_full_name.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            const initials = `${firstName[0] || ''}${lastName[0] || ''}`;
            const avatarClass = getAvatarColor(parent.student_full_name);
            
            return (
              <div 
                key={parent.relation_id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-medium text-lg ${avatarClass}`}>
                        {initials}
                      </div>
                      {parent.status === 'active' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {parent.student_full_name}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <FiUser className="text-gray-400" />
                        Student ID: {parent.student_id}
                      </p>
                    </div>
                    
                    <FiChevronRight 
                      className="text-gray-400 cursor-pointer" 
                      onClick={() => router.push(`/school_admin/parents/details/${parent.student_id}`)}
                    />
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        Relation ID: {parent.relation_id}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${parent.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {parent.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => openUnlinkModal(parent)}
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <span className="text-sm font-medium">Request Unlink</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filteredParents.length === 0 && !isLoading && (
        <div className="w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiUser className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No children found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try adjusting your search' : 'No children registered'}
          </p>
          <button 
            onClick={() => setSearchTerm('')}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Clear search
          </button>
        </div>
      )}

      {showUnlinkModal && selectedParent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Unlink Request</h3>
              <button 
                onClick={closeUnlinkModal}
                className="text-gray-400 hover:text-gray-600"
                disabled={isProcessing}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Are you sure you want to request unlinking from {selectedParent.student_full_name}? 
              This action will send a request to administrators for approval.
            </p>
            
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <button
                onClick={closeUnlinkModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleRequestUnlink}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2 disabled:bg-red-400 disabled:cursor-not-allowed"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentsListPage;