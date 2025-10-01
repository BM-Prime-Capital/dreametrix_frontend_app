"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiSearch, FiChevronRight, FiUser, FiMail, FiUsers } from 'react-icons/fi';
import { Loader } from "@/components/ui/loader";
import AddParentModal from './AddParentModal';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

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
  id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  children: {
    name: string;
    grade: string;
    class: string;
  }[];
  status: 'active' | 'inactive';
  last_contact: string;
}

const ParentsListPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Default data
  const parents: Parent[] = [
    {
      id: 1,
      user: {
        first_name: "Michael",
        last_name: "Johnson",
        email: "michael.johnson@example.com",
        phone: "+1555123456"
      },
      children: [
        { name: "Emma Johnson", grade: "5", class: "B" },
        { name: "Lucas Johnson", grade: "8", class: "A" }
      ],
      status: 'active',
      last_contact: "2023-10-15"
    },
    {
      id: 2,
      user: {
        first_name: "Sarah",
        last_name: "Williams",
        email: "sarah.williams@example.com",
        phone: "+1555234567"
      },
      children: [
        { name: "Olivia Williams", grade: "3", class: "C" }
      ],
      status: 'active',
      last_contact: "2023-11-02"
    },
    {
      id: 3,
      user: {
        first_name: "Robert",
        last_name: "Brown",
        email: "robert.brown@example.com",
        phone: "+1555345678"
      },
      children: [
        { name: "Noah Brown", grade: "10", class: "A" },
        { name: "Sophia Brown", grade: "7", class: "B" }
      ],
      status: 'inactive',
      last_contact: "2023-09-20"
    },
    {
      id: 4,
      user: {
        first_name: "Jennifer",
        last_name: "Davis",
        email: "jennifer.davis@example.com",
        phone: "+1555456789"
      },
      children: [
        { name: "Liam Davis", grade: "2", class: "A" }
      ],
      status: 'active',
      last_contact: "2023-11-10"
    },
    {
      id: 5,
      user: {
        first_name: "David",
        last_name: "Miller",
        email: "david.miller@example.com",
        phone: "+1555567890"
      },
      children: [
        { name: "Ava Miller", grade: "6", class: "C" },
        { name: "Mason Miller", grade: "4", class: "B" }
      ],
      status: 'active',
      last_contact: "2023-10-28"
    },
    {
      id: 6,
      user: {
        first_name: "Jessica",
        last_name: "Wilson",
        email: "jessica.wilson@example.com",
        phone: "+1555678901"
      },
      children: [
        { name: "Isabella Wilson", grade: "9", class: "A" }
      ],
      status: 'inactive',
      last_contact: "2023-08-15"
    }
  ];

  const filteredParents = parents
    .filter(parent => 
      `${parent.user.first_name} ${parent.user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(parent => 
      activeFilter === 'all' || parent.status === activeFilter
    );

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-white bg-opacity-75 z-50">
        <div className="flex flex-col items-center">
          <Loader className="text-blue-600 w-12 h-12" />
          <p className="mt-4 text-sm text-slate-500">
            Loading parents...
          </p>
        </div>
      </div>
    );
  }

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

        {/* Filter bar skeleton */}
        <div className="w-full bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Students grid skeleton */}
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
          <h1 className="text-3xl font-bold text-gray-900">Parent Directory</h1>
          <p className="text-gray-600 mt-1">
            {filteredParents.length} {filteredParents.length === 1 ? 'parent' : 'parents'} found
          </p>
        </div>
        
        
          <AddParentModal />
        
      </div>

      {/* Control bar */}
      <div className="w-full bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg border transition-all ${activeFilter === 'all' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-4 py-2 rounded-lg border transition-all ${activeFilter === 'active' ? 'bg-green-100 border-green-300 text-green-700' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveFilter('inactive')}
            className={`px-4 py-2 rounded-lg border transition-all ${activeFilter === 'inactive' ? 'bg-red-100 border-red-300 text-red-700' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Parent cards - full width container */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredParents.map((parent) => {
            const initials = `${parent.user.first_name[0]}${parent.user.last_name[0]}`;
            const avatarClass = getAvatarColor(parent.user.first_name + parent.user.last_name);
            const lastContactDate = new Date(parent.last_contact).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
            
            return (
              <div 
                key={parent.id}
                onClick={() => router.push(`/school_admin/parents/details/${parent.id}`)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
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
                        {parent.user.first_name} {parent.user.last_name}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FiUsers className="text-gray-400" />
                        {parent.children.length} {parent.children.length === 1 ? 'child' : 'children'}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <FiMail className="text-gray-400" />
                        <span className="truncate">{parent.user.email}</span>
                      </p>
                    </div>
                    
                    <FiChevronRight className="text-gray-400" />
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="space-y-2">
                      {parent.children.slice(0, 2).map((child, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {child.name} (Grade {child.grade} - Class {child.class})
                        </div>
                      ))}
                      {parent.children.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{parent.children.length - 2} more children
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        Last contact: {lastContactDate}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${parent.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {parent.status === 'active' ? 'Active' : 'Inactive'}
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
      {filteredParents.length === 0 && !isLoading && (
        <div className="w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiUser className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No parents found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try adjusting your search' : 'No parents in this category'}
          </p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setActiveFilter('all');
            }}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ParentsListPage;