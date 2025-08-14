"use client";
import { useState } from 'react';
import { 
  FiX, 
  FiDownload, 
  FiPrinter, 
  FiMail, 
  FiShare2, 
  FiClock,
  FiUser,
  FiBarChart2,
  FiBook,
  FiDollarSign,
  FiCalendar,
  FiFileText
} from 'react-icons/fi';
import { Button } from "@/components/ui/button";

interface ReportDetailModalProps {
  report: {
    id: number;
    title: string;
    type: 'student' | 'teacher' | 'financial' | 'attendance';
    description: string;
    dateGenerated: string;
    period: string;
    generatedBy: string;
    status: 'ready' | 'processing' | 'failed';
    downloadUrl?: string;
    parameters: {
      name: string;
      value: string;
    }[];
    summary?: {
      label: string;
      value: string;
    }[];
  };
  onClose: () => void;
}

const ReportDetailModal = ({ report, onClose }: ReportDetailModalProps) => {
  const [isSending, setIsSending] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const getReportIcon = () => {
    switch (report.type) {
      case 'student':
        return <FiUser className="text-blue-500 w-6 h-6" />;
      case 'teacher':
        return <FiUser className="text-purple-500 w-6 h-6" />;
      case 'financial':
        return <FiDollarSign className="text-green-500 w-6 h-6" />;
      case 'attendance':
        return <FiBook className="text-orange-500 w-6 h-6" />;
      default:
        return <FiBarChart2 className="text-gray-500 w-6 h-6" />;
    }
  };

  const getStatusBadge = () => {
    switch (report.status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendEmail = () => {
    setIsSending(true);
    // Simulate email sending
    setTimeout(() => {
      setIsSending(false);
      // In a real app, you would handle the email sending logic
    }, 1500);
  };

  const handleShare = () => {
    setIsSharing(true);
    // Simulate sharing
    setTimeout(() => {
      setIsSharing(false);
      // In a real app, you would handle the sharing logic
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal container */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="mt-1 flex-shrink-0">
                  {getReportIcon()}
                </div>
                <div>
                  <h3 className="text-2xl leading-6 font-bold text-gray-900">
                    {report.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge()}`}>
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report
                    </span>
                    <span className="inline-flex items-center text-sm text-gray-500">
                      <FiClock className="mr-1.5 h-4 w-4 text-gray-400" />
                      Generated on {new Date(report.dateGenerated).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* Description */}
            {report.description && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">{report.description}</p>
              </div>
            )}

            {/* Divider */}
            <div className="mt-6 border-t border-gray-200"></div>

            {/* Report details grid */}
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Left column */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Report Details</h4>
                
                <div className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Period Covered</dt>
                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                      <FiCalendar className="mr-2 h-4 w-4 text-gray-400" />
                      {report.period}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Generated By</dt>
                    <dd className="mt-1 text-sm text-gray-900">{report.generatedBy}</dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge()}`}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </dd>
                  </div>

                  {/* Parameters */}
                  {report.parameters && report.parameters.length > 0 && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Parameters</dt>
                      <dd className="mt-1">
                        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                          {report.parameters.map((param, index) => (
                            <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                              <div className="w-0 flex-1 flex items-center">
                                <FiFileText className="flex-shrink-0 h-4 w-4 text-gray-400" />
                                <span className="ml-2 flex-1 w-0 truncate">{param.name}</span>
                              </div>
                              <div className="ml-4 flex-shrink-0 font-medium text-gray-900">
                                {param.value}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  )}
                </div>
              </div>

              {/* Right column - Summary */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Key Metrics</h4>
                
                {report.summary && report.summary.length > 0 ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {report.summary.map((item, index) => (
                        <div key={index} className="px-4 py-3 bg-white shadow rounded-lg overflow-hidden">
                          <dt className="text-sm font-medium text-gray-500 truncate">{item.label}</dt>
                          <dd className="mt-1 text-2xl font-semibold text-gray-900">{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FiBarChart2 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No summary available</h3>
                    <p className="mt-1 text-sm text-gray-500">This report doesn't include key metrics.</p>
                  </div>
                )}

                {/* Preview placeholder */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Preview</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Report preview</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {report.downloadUrl 
                        ? "Click download to view full report" 
                        : "No preview available for this report"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with actions */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <div className="flex space-x-3">
              {report.downloadUrl && (
                <Button
                  variant="primary"
                  className="inline-flex items-center"
                  onClick={() => window.open(report.downloadUrl, '_blank')}
                >
                  <FiDownload className="-ml-1 mr-2 h-5 w-5" />
                  Download
                </Button>
              )}
              
              <Button
                variant="outline"
                className="inline-flex items-center"
                onClick={handleSendEmail}
                disabled={isSending}
              >
                <FiMail className="-ml-1 mr-2 h-5 w-5" />
                {isSending ? 'Sending...' : 'Email'}
              </Button>
              
              <Button
                variant="outline"
                className="inline-flex items-center"
                onClick={handleShare}
                disabled={isSharing}
              >
                <FiShare2 className="-ml-1 mr-2 h-5 w-5" />
                {isSharing ? 'Sharing...' : 'Share'}
              </Button>
              
              <Button
                variant="outline"
                className="inline-flex items-center"
              >
                <FiPrinter className="-ml-1 mr-2 h-5 w-5" />
                Print
              </Button>
            </div>
            
            <Button
              variant="ghost"
              onClick={onClose}
              className="mt-3 sm:mt-0 sm:mr-3"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
      
    </div>

    
  );

  
};

export default ReportDetailModal;