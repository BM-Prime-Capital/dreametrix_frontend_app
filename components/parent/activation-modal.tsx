"use client";
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  parentName: string;
  action: 'activate' | 'deactivate';
  isLoading?: boolean;
}

const ActivationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  parentName, 
  action,
  isLoading = false
}: ActivationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          {action === 'activate' 
            ? <FiCheckCircle className="text-green-600 mr-2" /> 
            : <FiXCircle className="text-red-600 mr-2" />
          }
          {action === 'activate' ? 'Activate Parent' : 'Deactivate Parent'}
        </h2>
        <p className="mb-6 text-gray-600">
          Are you sure you want to {action === 'activate' ? 'activate' : 'deactivate'} the parent <strong>{parentName}</strong>?
          A notification email will be sent.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-white transition-colors disabled:opacity-50 ${
              action === 'activate' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isLoading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivationModal;