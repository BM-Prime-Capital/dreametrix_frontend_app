"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiSearch, FiBook, FiCalendar, FiUser, FiClock, FiEye, FiEdit, FiX } from 'react-icons/fi';
import { Loader } from "@/components/ui/loader";
//import { SkeletonCard } from '@/components/ui/SkeletonCard';
import AddBookModal from '@/components/school_admin/library/AddBookModal';

const coverColors = [
  'bg-blue-100 text-blue-600',
  'bg-green-100 text-green-600',
  'bg-yellow-100 text-yellow-600',
  'bg-purple-100 text-purple-600',
  'bg-red-100 text-red-600',
  'bg-indigo-100 text-indigo-600'
];

const getCoverColor = (title: string) => {
  const charCode = title.charCodeAt(0) + (title.length > 1 ? title.charCodeAt(1) : 0);
  return coverColors[charCode % coverColors.length];
};

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  publisher: string;
  category: string;
  status: 'available' | 'checked-out' | 'lost' | 'reserved';
  dueDate?: string;
  checkedOutBy?: {
    name: string;
    grade: string;
  };
  lastCheckout?: string;
}

const LibraryPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'available' | 'checked-out' | 'reserved'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Sample library data
  const books: Book[] = [
    {
      id: 1,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "9780446310789",
      publicationYear: 1960,
      publisher: "J. B. Lippincott & Co.",
      category: "Fiction",
      status: 'available'
    },
    {
      id: 2,
      title: "1984",
      author: "George Orwell",
      isbn: "9780451524935",
      publicationYear: 1949,
      publisher: "Secker & Warburg",
      category: "Dystopian",
      status: 'checked-out',
      dueDate: "2023-12-15",
      checkedOutBy: {
        name: "Emma Johnson",
        grade: "10"
      },
      lastCheckout: "2023-11-15"
    },
    {
      id: 3,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "9780743273565",
      publicationYear: 1925,
      publisher: "Charles Scribner's Sons",
      category: "Classic",
      status: 'available'
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      isbn: "9781503290563",
      publicationYear: 1813,
      publisher: "T. Egerton, Whitehall",
      category: "Romance",
      status: 'reserved',
      lastCheckout: "2023-10-20"
    },
    {
      id: 5,
      title: "The Catcher in the Rye",
      author: "J. D. Salinger",
      isbn: "9780316769488",
      publicationYear: 1951,
      publisher: "Little, Brown and Company",
      category: "Coming-of-age",
      status: 'available'
    },
    {
      id: 6,
      title: "The Hobbit",
      author: "J. R. R. Tolkien",
      isbn: "9780547928227",
      publicationYear: 1937,
      publisher: "George Allen & Unwin",
      category: "Fantasy",
      status: 'checked-out',
      dueDate: "2023-12-10",
      checkedOutBy: {
        name: "Liam Davis",
        grade: "8"
      },
      lastCheckout: "2023-11-10"
    }
  ];

  const filteredBooks = books
    .filter(book => 
      `${book.title} ${book.author}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm)
    )
    .filter(book => 
      activeFilter === 'all' || book.status === activeFilter
    );

  const openViewModal = (book: Book) => {
    setSelectedBook(book);
    setViewModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setSelectedBook(book);
    setEditModalOpen(true);
  };

  const handleSaveBook = (updatedBook: Book) => {
    // Ici vous devriez mettre à jour le livre dans votre état ou votre API
    console.log('Book updated:', updatedBook);
    setEditModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-white bg-opacity-75 z-50">
        <div className="flex flex-col items-center">
          <Loader className="text-blue-600 w-12 h-12" />
          <p className="mt-4 text-sm text-slate-500">
            Loading library inventory...
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'checked-out': return 'bg-yellow-100 text-yellow-800';
      case 'reserved': return 'bg-blue-100 text-blue-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      {/* Header with actions */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Library Management</h1>
          <p className="text-gray-600 mt-1">
            {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
          </p>
        </div>
        
        <AddBookModal />
      </div>

      {/* Control bar */}
      <div className="w-full bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title, author or ISBN..."
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
            onClick={() => setActiveFilter('available')}
            className={`px-4 py-2 rounded-lg border transition-all ${activeFilter === 'available' ? 'bg-green-100 border-green-300 text-green-700' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            Available
          </button>
          <button
            onClick={() => setActiveFilter('checked-out')}
            className={`px-4 py-2 rounded-lg border transition-all ${activeFilter === 'checked-out' ? 'bg-yellow-100 border-yellow-300 text-yellow-700' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            Checked Out
          </button>
          <button
            onClick={() => setActiveFilter('reserved')}
            className={`px-4 py-2 rounded-lg border transition-all ${activeFilter === 'reserved' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            Reserved
          </button>
        </div>
      </div>

      {/* Books cards - full width container */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredBooks.map((book) => {
            //const initials = `${book.title.split(' ').map(word => word[0]).join('').substring(0, 2)}`;
            const coverClass = getCoverColor(book.title);
            const lastCheckoutDate = book.lastCheckout ? new Date(book.lastCheckout).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) : 'Never';
            
            return (
              <div 
                key={book.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 relative"
              >
                {/* Action buttons */}
                <div className="absolute top-3 right-3 flex gap-2 z-10">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openViewModal(book);
                    }}
                    className="p-1.5 bg-white rounded-full shadow-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="View details"
                  >
                    <FiEye className="text-lg" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(book);
                    }}
                    className="p-1.5 bg-white rounded-full shadow-sm text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                    title="Edit book"
                  >
                    <FiEdit className="text-lg" />
                  </button>
                </div>

                <div 
                  className="p-5 cursor-pointer"
                  onClick={() => router.push(`/school_admin/library/details/${book.id}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-20 rounded-md flex items-center justify-center font-medium text-lg ${coverClass}`}>
                      <FiBook className="text-2xl" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        by {book.author}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        ISBN: {book.isbn}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-600">
                        <div className="font-medium">Category</div>
                        <div>{book.category}</div>
                      </div>
                      <div className="text-gray-600">
                        <div className="font-medium">Year</div>
                        <div>{book.publicationYear}</div>
                      </div>
                      <div className="text-gray-600">
                        <div className="font-medium">Publisher</div>
                        <div className="truncate">{book.publisher}</div>
                      </div>
                      <div className="text-gray-600">
                        <div className="font-medium">Last Checkout</div>
                        <div>{lastCheckoutDate}</div>
                      </div>
                    </div>
                    
                    {book.status === 'checked-out' && book.checkedOutBy && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiUser className="text-gray-400" />
                          <span>Checked out by {book.checkedOutBy.name} (Grade {book.checkedOutBy.grade})</span>
                        </div>
                        {book.dueDate && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <FiCalendar className="text-gray-400" />
                            <span>Due: {new Date(book.dueDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        {book.status === 'available' ? (
                          <span className="flex items-center gap-1">
                            <FiClock className="text-gray-400" />
                            Available for checkout
                          </span>
                        ) : null}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                        {book.status === 'checked-out' ? 'Checked Out' : 
                         book.status === 'available' ? 'Available' : 
                         book.status === 'reserved' ? 'Reserved' : 'Lost'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

     
      {viewModalOpen && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-900">Book Details</h2>
              <button
                onClick={() => setViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-20 h-28 rounded-md flex items-center justify-center font-medium text-2xl ${getCoverColor(selectedBook.title)}`}>
                  <FiBook className="text-3xl" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedBook.title}
                  </h3>
                  <p className="text-md text-gray-600">
                    by {selectedBook.author}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    ISBN: {selectedBook.isbn}
                  </p>
                  <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBook.status)}`}>
                    {selectedBook.status === 'checked-out' ? 'Checked Out' : 
                     selectedBook.status === 'available' ? 'Available' : 
                     selectedBook.status === 'reserved' ? 'Reserved' : 'Lost'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Publication Year</h4>
                    <p className="text-gray-900">{selectedBook.publicationYear}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Category</h4>
                    <p className="text-gray-900">{selectedBook.category}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Publisher</h4>
                  <p className="text-gray-900">{selectedBook.publisher}</p>
                </div>
                
                {selectedBook.lastCheckout && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Last Checkout</h4>
                    <p className="text-gray-900">
                      {new Date(selectedBook.lastCheckout).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                
                {selectedBook.status === 'checked-out' && selectedBook.checkedOutBy && (
                  <>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Checked Out By</h4>
                      <p className="text-gray-900">
                        {selectedBook.checkedOutBy.name} (Grade {selectedBook.checkedOutBy.grade})
                      </p>
                    </div>
                    {selectedBook.dueDate && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Due Date</h4>
                        <p className="text-gray-900">
                          {new Date(selectedBook.dueDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="p-5 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  setEditModalOpen(true);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
              >
                Edit Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {editModalOpen && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-900">Edit Book</h2>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveBook(selectedBook);
              }} 
              className="p-5"
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="edit-title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={selectedBook.title}
                    onChange={(e) => setSelectedBook({...selectedBook, title: e.target.value})}
                  />
                </div>

                <div>
                  <label htmlFor="edit-author" className="block text-sm font-medium text-gray-700 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    id="edit-author"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={selectedBook.author}
                    onChange={(e) => setSelectedBook({...selectedBook, author: e.target.value})}
                  />
                </div>

                <div>
                  <label htmlFor="edit-isbn" className="block text-sm font-medium text-gray-700 mb-1">
                    ISBN
                  </label>
                  <input
                    type="text"
                    id="edit-isbn"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={selectedBook.isbn}
                    onChange={(e) => setSelectedBook({...selectedBook, isbn: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-year" className="block text-sm font-medium text-gray-700 mb-1">
                      Publication Year
                    </label>
                    <input
                      type="number"
                      id="edit-year"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={selectedBook.publicationYear}
                      onChange={(e) => setSelectedBook({...selectedBook, publicationYear: parseInt(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="edit-category"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={selectedBook.category}
                      onChange={(e) => setSelectedBook({...selectedBook, category: e.target.value})}
                    >
                      <option value="Fiction">Fiction</option>
                      <option value="Non-Fiction">Non-Fiction</option>
                      <option value="Science Fiction">Science Fiction</option>
                      <option value="Fantasy">Fantasy</option>
                      <option value="Mystery">Mystery</option>
                      <option value="Romance">Romance</option>
                      <option value="Biography">Biography</option>
                      <option value="History">History</option>
                      <option value="Science">Science</option>
                      <option value="Poetry">Poetry</option>
                      <option value="Drama">Drama</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="edit-publisher" className="block text-sm font-medium text-gray-700 mb-1">
                    Publisher
                  </label>
                  <input
                    type="text"
                    id="edit-publisher"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={selectedBook.publisher}
                    onChange={(e) => setSelectedBook({...selectedBook, publisher: e.target.value})}
                  />
                </div>

                <div>
                  <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="edit-status"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={selectedBook.status}
                    onChange={(e) => setSelectedBook({...selectedBook, status: e.target.value as any})}
                  >
                    <option value="available">Available</option>
                    <option value="checked-out">Checked Out</option>
                    <option value="reserved">Reserved</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredBooks.length === 0 && !isLoading && (
        <div className="w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiBook className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No books found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try adjusting your search' : 'No books match the current filters'}
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

export default LibraryPage;