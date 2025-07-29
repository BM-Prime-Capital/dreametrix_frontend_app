// app/school-admin/finance/page.tsx
"use client";
import { useState } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiEye, FiDollarSign, FiCreditCard, FiPieChart } from 'react-icons/fi';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import FinanceTransactionModal from '@/components/school_admin/finance/FinanceTransactionModal';

interface FinancialTransaction {
  id: string;
  transactionId: string;
  date: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  paymentMethod: 'Cash' | 'Check' | 'Credit Card' | 'Bank Transfer' | 'Other';
  description: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  studentId?: string;
  staffId?: string;
  invoiceNumber?: string;
}

const FinancePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<FinancialTransaction | null>(null);
  const [actionType, setActionType] = useState<'view' | 'edit' | 'create'>('create');
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all');

  // Données de démonstration
  const transactions: FinancialTransaction[] = [
    {
      id: '1',
      transactionId: 'TXN-2023-001',
      date: '2023-09-15',
      type: 'Income',
      category: 'Tuition Fee',
      amount: 1500,
      paymentMethod: 'Bank Transfer',
      description: 'Annual tuition fee for John Doe',
      status: 'Completed',
      studentId: 'STU-001',
      invoiceNumber: 'INV-2023-001'
    },
    {
      id: '2',
      transactionId: 'TXN-2023-002',
      date: '2023-09-18',
      type: 'Expense',
      category: 'Salaries',
      amount: 4500,
      paymentMethod: 'Bank Transfer',
      description: 'Monthly salaries for teaching staff',
      status: 'Completed',
      staffId: 'STAFF-001'
    },
    {
      id: '3',
      transactionId: 'TXN-2023-003',
      date: '2023-09-20',
      type: 'Income',
      category: 'Extracurricular',
      amount: 200,
      paymentMethod: 'Cash',
      description: 'Music club fees',
      status: 'Completed',
      studentId: 'STU-005'
    },
    {
      id: '4',
      transactionId: 'TXN-2023-004',
      date: '2023-09-22',
      type: 'Expense',
      category: 'Maintenance',
      amount: 1200,
      paymentMethod: 'Check',
      description: 'Building repairs',
      status: 'Pending',
      invoiceNumber: 'INV-2023-004'
    },
    {
      id: '5',
      transactionId: 'TXN-2023-005',
      date: '2023-09-25',
      type: 'Income',
      category: 'Donation',
      amount: 5000,
      paymentMethod: 'Bank Transfer',
      description: 'Donation from alumni association',
      status: 'Completed'
    }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.studentId && transaction.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.invoiceNumber && transaction.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'income' && transaction.type === 'Income') || 
      (activeTab === 'expense' && transaction.type === 'Expense');
    
    return matchesSearch && matchesTab;
  });

  // Calcul des totaux
  const totalIncome = transactions
    .filter(t => t.type === 'Income' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'Expense' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpense;

  const handleAddTransaction = () => {
    setCurrentTransaction(null);
    setActionType('create');
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction: FinancialTransaction) => {
    setCurrentTransaction(transaction);
    setActionType('edit');
    setIsModalOpen(true);
  };

  const handleViewTransaction = (transaction: FinancialTransaction) => {
    setCurrentTransaction(transaction);
    setActionType('view');
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    // Logique de suppression ici
    console.log('Deleting transaction:', currentTransaction);
    setIsDeleteModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'Income' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  return (
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
          <p className="text-gray-600 mt-1">
            {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transaction' : 'transactions'} found
          </p>
        </div>
        
        <button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          onClick={handleAddTransaction}
        >
          <FiPlus className="text-lg" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Income</p>
              <p className="text-2xl font-bold text-green-600 mt-1">${totalIncome.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg text-green-600">
              <FiDollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600 mt-1">${totalExpense.toLocaleString()}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg text-red-600">
              <FiCreditCard className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Current Balance</p>
              <p className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                ${balance.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
              <FiPieChart className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="w-full bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by transaction ID, category, description..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${activeTab === 'income' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
            >
              <FiDollarSign className="h-4 w-4" />
              Income
            </button>
            <button
              onClick={() => setActiveTab('expense')}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${activeTab === 'expense' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
            >
              <FiCreditCard className="h-4 w-4" />
              Expenses
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction, index) => (
                <tr 
                  key={transaction.id} 
                  className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="font-semibold">{transaction.transactionId}</div>
                    {transaction.invoiceNumber && (
                      <div className="text-xs text-gray-500 mt-1">Invoice: {transaction.invoiceNumber}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(transaction.type)}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="font-medium">{transaction.category}</div>
                    <div className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                      {transaction.description}
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'Income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleViewTransaction(transaction)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                        title="View"
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditTransaction(transaction)}
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50"
                        title="Edit"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredTransactions.length === 0 && (
          <div className="w-full p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiDollarSign className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No transactions found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No matches for your search criteria' : 'Currently no financial transactions available'}
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setActiveTab('all');
              }}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {searchTerm ? 'Clear search' : 'Add a new transaction'}
            </button>
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      <FinanceTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionData={currentTransaction}
        actionType={actionType}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete transaction ${currentTransaction?.transactionId}? This action cannot be undone.`}
      />
    </div>
  );
};

export default FinancePage;