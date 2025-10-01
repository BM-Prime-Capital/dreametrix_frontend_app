"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiSearch,FiMail, FiUsers, FiPlus, FiX } from 'react-icons/fi';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { getPendingRelationship, requestNewLink } from '@/services/parent-services';
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

interface PendingRelation {
  id: number;
  relation_id: number;
  student_id: number;
  student_user_id: number;
  student_full_name: string;
  student_email?: string;
  parent_id: number;
  parent_full_name: string;
  parent_email?: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  student_code?: string;
}

const PendingRelationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [relations, setRelations] = useState<PendingRelation[]>([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [studentCode, setStudentCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { accessToken, tenantDomain } = useRequestInfo();

  useEffect(() => {
    fetchPendingRelations();
  }, [accessToken, tenantDomain]);

  const fetchPendingRelations = async () => {
    setIsLoading(true);
    try {
      const result = await getPendingRelationship(accessToken, tenantDomain);
      console.log("Pending relations result", result);
      
      const transformedRelations: PendingRelation[] = result.data.map((item: any) => ({
        id: item.id || item.relation_id,
        relation_id: item.relation_id,
        student_id: item.student_id,
        student_user_id: item.student_user_id,
        student_full_name: item.student_full_name,
        student_email: item.student_email,
        parent_id: item.parent_id,
        parent_full_name: item.parent_full_name,
        parent_email: item.parent_email,
        status: item.status || 'pending',
        requested_at: item.requested_at || new Date().toISOString(),
        student_code: item.student_code
      }));
      
      setRelations(transformedRelations);
    } catch (error) {
      console.error('Error fetching pending relations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewRelationRequest = async () => {
    if (!studentCode.trim()) {
      setError('Please enter a student code');
      return;
    }

    setIsRequesting(true);
    setError(null);
    
    try {
      const result = await requestNewLink(accessToken, tenantDomain, studentCode);
      console.log("New relation :", result);
      
      if (result.success) {
        setStudentCode('');
        setShowRequestForm(false);
        setError(null);
        fetchPendingRelations(); 
      } else {
        setError(result.message || 'Failed to send request');
      }
    } catch (error: any) {
      console.error('Error requesting new relation:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to send request';
      setError(errorMessage);
    } finally {
      setIsRequesting(false);
    }
  };

  const openRequestForm = () => {
    setShowRequestForm(true);
    setError(null);
    setStudentCode('');
  };

  const closeRequestForm = () => {
    setShowRequestForm(false);
    setError(null);
    setStudentCode('');
  };

  const filteredRelations = relations.filter(relation => 
    relation.student_full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    relation.parent_full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    relation.student_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
        {/* Header skeleton */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Search bar skeleton */}
        <div className="w-full bg-white p-4 rounded-xl shadow-sm mb-6">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Relations grid skeleton */}
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
      {/* Header with actions */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pending Relation Requests</h1>
          <p className="text-gray-600 mt-1">
            {filteredRelations.length} {filteredRelations.length === 1 ? 'request' : 'requests'} found
          </p>
        </div>
        
        <button
          onClick={openRequestForm}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <FiPlus className="text-lg" />
          New Relation
        </button>
      </div>

      {/* New Relation Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Request New Relation</h3>
              <button
                onClick={closeRequestForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="text-lg" />
              </button>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Code
                </label>
                <input
                  type="text"
                  placeholder="Enter student code"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={studentCode}
                  onChange={(e) => {
                    setStudentCode(e.target.value);
                    setError(null);
                  }}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeRequestForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNewRelationRequest}
                  disabled={isRequesting}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isRequesting ? (
                    <p>
                      Sending...
                    </p>
                  ) : (
                    'Send Request'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search bar */}
      <div className="w-full bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by student name, parent name, or student code..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Relations cards */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredRelations.map((relation) => {
            const initials = relation.student_full_name
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);
              
            const avatarClass = getAvatarColor(relation.student_full_name);
            
            return (
              <div 
                key={relation.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-medium text-lg ${avatarClass}`}>
                        {initials}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {relation.student_full_name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Student Code: {relation.student_code || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Parent: {relation.parent_full_name}
                      </p>
                      {relation.parent_email && (
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <FiMail className="text-gray-400" />
                          {relation.parent_email}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        Requested: {new Date(relation.requested_at).toLocaleDateString()}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(relation.status)}`}>
                        {getStatusText(relation.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty state */}
      {filteredRelations.length === 0 && !isLoading && (
        <div className="w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiUsers className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No pending requests</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try adjusting your search' : 'No pending relation requests found'}
          </p>
          <button 
            onClick={() => setSearchTerm('')}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};

export default PendingRelationsPage;