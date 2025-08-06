"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiArrowLeft, FiUser, FiHome, FiMail, FiPhone,
  FiUsers, FiEdit2, FiMessageSquare, FiClipboard
} from 'react-icons/fi';

interface ParentDetail {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  contact: {
    address: string;
    emergency_contact: string;
    emergency_phone: string;
    preferred_contact: 'email' | 'phone' | 'text';
  };
  children: {
    name: string;
    grade: string;
    class: string;
    teacher: string;
  }[];
  documents: {
    name: string;
    type: string;
    date: string;
  }[];
  last_contact: string;
  status: 'active' | 'inactive';
}

const ParentDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // Test data
  const parent: ParentDetail = {
    id: Number(params.id),
    user: {
      first_name: "Michael",
      last_name: "Johnson",
      email: "michael.johnson@example.com",
      phone: "+1555123456"
    },
    contact: {
      address: "123 Oak Street, Boston, MA 02115",
      emergency_contact: "Sarah Johnson",
      emergency_phone: "+1555987654",
      preferred_contact: 'email'
    },
    children: [
      {
        name: "Emma Johnson",
        grade: "5",
        class: "B",
        teacher: "Mrs. Williams"
      },
      {
        name: "Lucas Johnson",
        grade: "8",
        class: "A",
        teacher: "Mr. Davis"
      }
    ],
    documents: [
      {
        name: "Parent Agreement",
        type: "Administrative",
        date: "2023-08-15"
      },
      {
        name: "Emergency Contact Form",
        type: "Medical",
        date: "2023-08-20"
      }
    ],
    last_contact: "2023-11-10",
    status: 'active'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const getPreferredContactMethod = () => {
    switch(parent.contact.preferred_contact) {
      case 'email': return 'Email';
      case 'phone': return 'Phone Call';
      case 'text': return 'Text Message';
      default: return 'Email';
    }
  };

  return (
    <div className="w-full bg-light min-h-screen">
      {/* Header Section */}
      <div className="bg-white py-6 rounded-lg shadow border border-gray-100">
        <div className="w-full mx-auto p-0 sm:px-6">
          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <FiArrowLeft className="mr-2" />
              Back to Parents
            </button>
            <div className="flex gap-2">
              <button className="px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center">
                <FiEdit2 className="mr-2" />
                Edit
              </button>
              <button className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 flex items-center">
                <FiMessageSquare className="mr-2" />
                Message
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <span className="text-xl font-medium text-blue-600">
                {parent.user.first_name[0]}{parent.user.last_name[0]}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{parent.user.first_name} {parent.user.last_name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-gray-600">
                  Parent of {parent.children.length} {parent.children.length === 1 ? 'child' : 'children'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  parent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {parent.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body Section */}
      <div className="mt-8 mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white p-6 rounded-lg shadow border border-gray-100">
        {/* Tabs Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FiHome className="mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'contact' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FiUser className="mr-2" />
              Contact
            </button>
            <button
              onClick={() => setActiveTab('children')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'children' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FiUsers className="mr-2" />
              Children
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'documents' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FiClipboard className="mr-2" />
              Documents
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Card */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUser className="text-gray-400 mr-2" />
                  Personal Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium">{parent.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-sm font-medium">{parent.user.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Preferred Contact Method</p>
                    <p className="text-sm font-medium">{getPreferredContactMethod()}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUsers className="text-gray-400 mr-2" />
                  Emergency Contact
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Contact Name</p>
                    <p className="text-sm font-medium">{parent.contact.emergency_contact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Phone</p>
                    <p className="text-sm font-medium">{parent.contact.emergency_phone}</p>
                  </div>
                  <div className="flex space-x-4 pt-2">
                    <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm">
                      <FiPhone className="mr-1" /> Call Emergency
                    </button>
                  </div>
                </div>
              </div>

              {/* Children Summary Card */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUsers className="text-gray-400 mr-2" />
                  Children Summary
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Number of Children</p>
                      <p className="text-xl font-semibold">{parent.children.length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Last Contact</p>
                      <p className="text-sm font-medium">{formatDate(parent.last_contact)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Children</p>
                    <div className="space-y-2">
                      {parent.children.slice(0, 2).map((child, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {child.name} (Grade {child.grade} - Class {child.class})
                        </div>
                      ))}
                      {parent.children.length > 2 && (
                        <div className="text-xs text-blue-600">
                          +{parent.children.length - 2} more children
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiHome className="text-gray-400 mr-2" />
                  Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">{parent.contact.address}</p>
                  </div>
                  <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View on Map
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUser className="text-gray-400 mr-2" />
                  Contact Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">First Name</p>
                      <p className="text-sm font-medium">{parent.user.first_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Name</p>
                      <p className="text-sm font-medium">{parent.user.last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-sm font-medium">{parent.user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-sm font-medium">{parent.user.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Preferred Contact Method</p>
                      <p className="text-sm font-medium">{getPreferredContactMethod()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-sm font-medium">{parent.contact.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUsers className="text-gray-400 mr-2" />
                  Emergency Contact
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Contact Name</p>
                      <p className="text-sm font-medium">{parent.contact.emergency_contact}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Relationship</p>
                      <p className="text-sm font-medium">Spouse</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Contact Phone</p>
                      <p className="text-sm font-medium">{parent.contact.emergency_phone}</p>
                    </div>
                    <div className="flex space-x-4 pt-2">
                      <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm">
                        <FiPhone className="mr-1" /> Call Emergency
                      </button>
                      <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm">
                        <FiMail className="mr-1" /> Email Parent
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Children Tab */}
          {activeTab === 'children' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Children ({parent.children.length})
                </h2>
                <div className="space-y-3">
                  {parent.children.map((child, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{child.name}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Grade {child.grade} - Class {child.class} • Teacher: {child.teacher}
                          </p>
                        </div>
                        <button 
                          onClick={() => router.push(`/school_admin/students/details/${index + 1}`)} // This would link to actual student ID
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Children Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                    <p className="text-sm text-gray-500">Total Children</p>
                    <p className="text-2xl font-semibold">{parent.children.length}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                    <p className="text-sm text-gray-500">Youngest Grade</p>
                    <p className="text-2xl font-semibold">
                      {Math.min(...parent.children.map(c => parseInt(c.grade)))}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                    <p className="text-sm text-gray-500">Oldest Grade</p>
                    <p className="text-2xl font-semibold">
                      {Math.max(...parent.children.map(c => parseInt(c.grade)))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiClipboard className="text-gray-400 mr-2" />
                  Parent Documents ({parent.documents.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {parent.documents.map((doc, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500 mt-1">{doc.type}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Uploaded on {formatDate(doc.date)}
                          </p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDetailsPage;