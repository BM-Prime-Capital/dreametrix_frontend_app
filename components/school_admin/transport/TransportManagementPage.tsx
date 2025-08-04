"use client";
import { useState, useEffect } from 'react';
import { 
  FiSearch, FiPlus, FiChevronRight, 
  FiTruck, 
  FiMapPin, FiClock, FiEdit2, FiAlertCircle, FiPhone,
  FiUser,
  FiX
} from 'react-icons/fi';
//import { Loader } from "@/components/ui/loader";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import AddTransportModal from './add-transport-modal';

interface Transport {
  id: string;
  route_name: string;
  bus_number: string;
  driver: {
    name: string;
    phone: string;
  };
  schedule: {
    morning_pickup: string;
    afternoon_dropoff: string;
  };
  stops: {
    name: string;
    time: string;
  }[];
  capacity: number;
  current_riders: number;
  status: 'active' | 'inactive' | 'maintenance';
}

const defaultTransports: Transport[] = [
  {
    id: 't1',
    route_name: 'North District Route',
    bus_number: 'SCH-001',
    driver: {
      name: 'Robert Johnson',
      phone: '(555) 123-4567'
    },
    schedule: {
      morning_pickup: '07:30 AM',
      afternoon_dropoff: '03:45 PM'
    },
    stops: [
      { name: 'Main Street Station', time: '07:30 AM' },
      { name: 'Oakwood Apartments', time: '07:45 AM' },
      { name: 'Pine Valley Community', time: '08:00 AM' }
    ],
    capacity: 48,
    current_riders: 32,
    status: 'active'
  },
  {
    id: 't2',
    route_name: 'South District Route',
    bus_number: 'SCH-002',
    driver: {
      name: 'Maria Garcia',
      phone: '(555) 234-5678'
    },
    schedule: {
      morning_pickup: '07:15 AM',
      afternoon_dropoff: '03:30 PM'
    },
    stops: [
      { name: 'Riverside Park', time: '07:15 AM' },
      { name: 'Hillside Village', time: '07:30 AM' },
      { name: 'Greenfield Plaza', time: '07:45 AM' }
    ],
    capacity: 48,
    current_riders: 45,
    status: 'active'
  },
  {
    id: 't3',
    route_name: 'East District Route',
    bus_number: 'SCH-003',
    driver: {
      name: 'James Wilson',
      phone: '(555) 345-6789'
    },
    schedule: {
      morning_pickup: '07:45 AM',
      afternoon_dropoff: '04:00 PM'
    },
    stops: [
      { name: 'Sunset Boulevard', time: '07:45 AM' },
      { name: 'Lakeside Community', time: '08:00 AM' },
      { name: 'Mountain View Apartments', time: '08:15 AM' }
    ],
    capacity: 36,
    current_riders: 28,
    status: 'active'
  },
  {
    id: 't4',
    route_name: 'West District Route',
    bus_number: 'SCH-004',
    driver: {
      name: 'Sarah Davis',
      phone: '(555) 456-7890'
    },
    schedule: {
      morning_pickup: '07:00 AM',
      afternoon_dropoff: '03:15 PM'
    },
    stops: [
      { name: 'Downtown Terminal', time: '07:00 AM' },
      { name: 'University Heights', time: '07:20 AM' },
      { name: 'Westfield Mall', time: '07:35 AM' }
    ],
    capacity: 36,
    current_riders: 36,
    status: 'inactive'
  },
  {
    id: 't5',
    route_name: 'Central District Route',
    bus_number: 'SCH-005',
    driver: {
      name: 'Michael Brown',
      phone: '(555) 567-8901'
    },
    schedule: {
      morning_pickup: '08:00 AM',
      afternoon_dropoff: '04:15 PM'
    },
    stops: [
      { name: 'City Hall', time: '08:00 AM' },
      { name: 'Central Park', time: '08:15 AM' },
      { name: 'Main Campus', time: '08:30 AM' }
    ],
    capacity: 24,
    current_riders: 18,
    status: 'maintenance'
  }
];

const TransportList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive' | 'maintenance'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error,] = useState<Error | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<Transport | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleTransportClick = (transport: Transport) => {
    setSelectedTransport(transport);
    setIsDetailModalOpen(true);
  };

  const handleTransportAdded = () => {
    setIsAddModalOpen(false);
  };

  const filteredTransports = defaultTransports
    .filter(transport => 
      transport.route_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transport.bus_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transport.driver.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(transport => 
      activeFilter === 'all' || transport.status === activeFilter
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

        <div className="w-full bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-white z-50">
        <div className="flex flex-col items-center text-red-500">
          <FiAlertCircle className="text-3xl mb-2" />
          <p className="text-lg font-medium">Data loading error</p>
          <p className="text-sm text-gray-500 mt-2">
            {error.message || "Failed to load transport information"}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      {/* Header section */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transport Management</h1>
          <p className="text-gray-600 mt-1">
            {filteredTransports.length} {filteredTransports.length === 1 ? 'route' : 'routes'} available
          </p>
        </div>
        
        <button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          onClick={() => setIsAddModalOpen(true)}
        >
          <FiPlus className="text-lg" />
          <span>Add New Route</span>
        </button>
      </div>

      <AddTransportModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onTransportAdded={handleTransportAdded}
      />

      {/* Filter and search bar */}
      <div className="w-full bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by route, bus number or driver..."
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
            All Routes
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
          <button
            onClick={() => setActiveFilter('maintenance')}
            className={`px-4 py-2 rounded-lg border transition-all ${activeFilter === 'maintenance' ? 'bg-yellow-100 border-yellow-300 text-yellow-700' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            Maintenance
          </button>
        </div>
      </div>

      {/* Transports grid */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTransports.map((transport) => (
            <div 
              key={transport.id}
              onClick={() => handleTransportClick(transport)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                    <FiTruck className="text-2xl" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {transport.route_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Bus {transport.bus_number}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <FiUser className="text-gray-400" />
                      {transport.driver.name}
                    </p>
                  </div>
                  
                  <FiChevronRight className="text-gray-400" />
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <FiClock className="text-gray-400" />
                        Schedule
                      </p>
                      <p className="text-sm font-medium">
                        {transport.schedule.morning_pickup} - {transport.schedule.afternoon_dropoff}
                      </p>
                    </div>
                    
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      transport.status === 'active' ? 'bg-green-100 text-green-800' :
                      transport.status === 'inactive' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transport.status.charAt(0).toUpperCase() + transport.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <div className="text-xs text-gray-500">
                      {transport.stops.length} stops
                    </div>
                    <div className="text-xs text-gray-500">
                      {transport.current_riders}/{transport.capacity} students
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedTransport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedTransport.route_name} Details
                </h2>
                <button 
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FiTruck className="text-indigo-500" />
                    Bus Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Bus Number</p>
                      <p className="font-medium">{selectedTransport.bus_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`font-medium ${
                        selectedTransport.status === 'active' ? 'text-green-600' :
                        selectedTransport.status === 'inactive' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {selectedTransport.status.charAt(0).toUpperCase() + selectedTransport.status.slice(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Capacity</p>
                      <p className="font-medium">
                        {selectedTransport.current_riders}/{selectedTransport.capacity} students
                      </p>
                    </div>
                  </div>
                </div>

                {/* Driver Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FiUser className="text-indigo-500" />
                    Driver Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Driver Name</p>
                      <p className="font-medium">{selectedTransport.driver.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact Number</p>
                      <p className="font-medium flex items-center gap-1">
                        <FiPhone className="text-gray-400" />
                        {selectedTransport.driver.phone}
                      </p>
                    </div>
                    <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center">
                      <FiPhone className="mr-1" /> Call Driver
                    </button>
                  </div>
                </div>

                {/* Schedule */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FiClock className="text-indigo-500" />
                    Daily Schedule
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Morning Pickup</p>
                      <p className="font-medium">{selectedTransport.schedule.morning_pickup}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Afternoon Dropoff</p>
                      <p className="font-medium">{selectedTransport.schedule.afternoon_dropoff}</p>
                    </div>
                  </div>
                </div>

                {/* Route Stops */}
                <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FiMapPin className="text-indigo-500" />
                    Route Stops ({selectedTransport.stops.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedTransport.stops.map((stop, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-md border border-gray-200">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 mt-0.5">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{stop.name}</p>
                          <p className="text-sm text-gray-500">Pickup time: {stop.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-all flex items-center gap-2">
                  <FiEdit2 className="text-lg" />
                  Edit Route
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredTransports.length === 0 && !isLoading && (
        <div className="w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiTruck className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No transport routes found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No matches for your search criteria' : 'Currently no transport routes in this category'}
          </p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setActiveFilter('all');
            }}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default TransportList;