"use client";
import { useState } from 'react';
import { FiX, FiTruck, FiUser, FiClock, FiMapPin, FiAlertTriangle, FiPlus } from 'react-icons/fi';

const AddTransportModal = ({ isOpen, onClose, onTransportAdded }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onTransportAdded: () => void 
}) => {
  const [formData, setFormData] = useState({
    route_name: '',
    bus_number: '',
    driver_name: '',
    driver_phone: '',
    morning_pickup: '',
    afternoon_dropoff: '',
    capacity: '',
    status: 'active',
    stops: [{ name: '', time: '' }]
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleStopChange = (index: number, field: string, value: string) => {
    const newStops = [...formData.stops];
    newStops[index] = {
      ...newStops[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      stops: newStops
    }));
  };

  const addStop = () => {
    setFormData(prev => ({
      ...prev,
      stops: [...prev.stops, { name: '', time: '' }]
    }));
  };

  const removeStop = (index: number) => {
    if (formData.stops.length > 1) {
      const newStops = [...formData.stops];
      newStops.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        stops: newStops
      }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.route_name) newErrors.route_name = 'Route name is required';
    if (!formData.bus_number) newErrors.bus_number = 'Bus number is required';
    if (!formData.driver_name) newErrors.driver_name = 'Driver name is required';
    if (!formData.driver_phone) newErrors.driver_phone = 'Driver phone is required';
    if (!formData.morning_pickup) newErrors.morning_pickup = 'Morning pickup time is required';
    if (!formData.afternoon_dropoff) newErrors.afternoon_dropoff = 'Afternoon dropoff time is required';
    if (!formData.capacity) newErrors.capacity = 'Capacity is required';
    
    formData.stops.forEach((stop, index) => {
      if (!stop.name) newErrors[`stop_name_${index}`] = 'Stop name is required';
      if (!stop.time) newErrors[`stop_time_${index}`] = 'Stop time is required';
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onTransportAdded();
      setFormData({
        route_name: '',
        bus_number: '',
        driver_name: '',
        driver_phone: '',
        morning_pickup: '',
        afternoon_dropoff: '',
        capacity: '',
        status: 'active',
        stops: [{ name: '', time: '' }]
      });
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Add New Transport Route</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FiX className="text-xl" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Route Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiTruck className="text-indigo-500" />
                  Route Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Route Name*</label>
                    <input
                      type="text"
                      name="route_name"
                      value={formData.route_name}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${
                        errors.route_name ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="North District Route"
                    />
                    {errors.route_name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertTriangle className="mr-1" /> {errors.route_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bus Number*</label>
                    <input
                      type="text"
                      name="bus_number"
                      value={formData.bus_number}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${
                        errors.bus_number ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="SCH-001"
                    />
                    {errors.bus_number && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertTriangle className="mr-1" /> {errors.bus_number}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity*</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${
                        errors.capacity ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="48"
                    />
                    {errors.capacity && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertTriangle className="mr-1" /> {errors.capacity}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Driver Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiUser className="text-indigo-500" />
                  Driver Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name*</label>
                    <input
                      type="text"
                      name="driver_name"
                      value={formData.driver_name}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${
                        errors.driver_name ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.driver_name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertTriangle className="mr-1" /> {errors.driver_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Driver Phone*</label>
                    <input
                      type="tel"
                      name="driver_phone"
                      value={formData.driver_phone}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${
                        errors.driver_phone ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                    {errors.driver_phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertTriangle className="mr-1" /> {errors.driver_phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiClock className="text-indigo-500" />
                  Daily Schedule
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Morning Pickup*</label>
                    <input
                      type="time"
                      name="morning_pickup"
                      value={formData.morning_pickup}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${
                        errors.morning_pickup ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                    {errors.morning_pickup && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertTriangle className="mr-1" /> {errors.morning_pickup}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Afternoon Dropoff*</label>
                    <input
                      type="time"
                      name="afternoon_dropoff"
                      value={formData.afternoon_dropoff}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${
                        errors.afternoon_dropoff ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                    {errors.afternoon_dropoff && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertTriangle className="mr-1" /> {errors.afternoon_dropoff}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Route Stops */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiMapPin className="text-indigo-500" />
                  Route Stops
                </h3>
                <div className="space-y-4">
                  {formData.stops.map((stop, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stop Name*</label>
                        <input
                          type="text"
                          value={stop.name}
                          onChange={(e) => handleStopChange(index, 'name', e.target.value)}
                          className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${
                            errors[`stop_name_${index}`] ? 'border-red-300' : 'border-gray-200'
                          }`}
                          placeholder={`Stop ${index + 1}`}
                        />
                        {errors[`stop_name_${index}`] && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <FiAlertTriangle className="mr-1" /> {errors[`stop_name_${index}`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time*</label>
                        <input
                          type="time"
                          value={stop.time}
                          onChange={(e) => handleStopChange(index, 'time', e.target.value)}
                          className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${
                            errors[`stop_time_${index}`] ? 'border-red-300' : 'border-gray-200'
                          }`}
                        />
                        {errors[`stop_time_${index}`] && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <FiAlertTriangle className="mr-1" /> {errors[`stop_time_${index}`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => removeStop(index)}
                          className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addStop}
                    className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                  >
                    <FiPlus /> Add Another Stop
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-all flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Saving...'
                ) : (
                  <>
                    <FiPlus /> Add Route
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransportModal;