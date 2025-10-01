"use client";
import { useState } from 'react';
import { FiX, FiUser, FiMail, FiPhone, FiPlus, FiChevronDown, FiUsers } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const AddParentModal = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    children: [{ name: '', grade: '', class: '' }]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChildChange = (index: number, field: string, value: string) => {
    const updatedChildren = [...formData.children];
    updatedChildren[index] = {
      ...updatedChildren[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      children: updatedChildren
    }));
  };

  const addChild = () => {
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, { name: '', grade: '', class: '' }]
    }));
  };

  const removeChild = (index: number) => {
    if (formData.children.length > 1) {
      const updatedChildren = formData.children.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        children: updatedChildren
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    
    formData.children.forEach((child, index) => {
      if (!child.name.trim()) newErrors[`childName-${index}`] = 'Child name is required';
      if (!child.grade) newErrors[`childGrade-${index}`] = 'Grade is required';
      if (!child.class) newErrors[`childClass-${index}`] = 'Class is required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Submit logic would go here
      console.log('Form submitted:', formData);
      // In a real app, you would call an API here
      setIsOpen(false);
      router.refresh(); // Refresh the parent list
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
      >
        <FiPlus className="text-lg" />
        <span>Add Parent</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 p-5 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-900">Add New Parent</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Parent Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <FiUser className="text-indigo-500" />
                    Parent Information
                  </h3>
                  
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md ${errors.firstName ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md ${errors.lastName ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md ${errors.phone ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>
                </div>
                
                {/* Children Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <FiUsers className="text-indigo-500" />
                    Children Information
                  </h3>
                  
                  {formData.children.map((child, index) => (
                    <div key={index} className="space-y-3 border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-700">Child {index + 1}</h4>
                        {formData.children.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeChild(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor={`childName-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id={`childName-${index}`}
                          value={child.name}
                          onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md ${errors[`childName-${index}`] ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                        />
                        {errors[`childName-${index}`] && <p className="mt-1 text-sm text-red-600">{errors[`childName-${index}`]}</p>}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor={`childGrade-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Grade *
                          </label>
                          <div className="relative">
                            <select
                              id={`childGrade-${index}`}
                              value={child.grade}
                              onChange={(e) => handleChildChange(index, 'grade', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md appearance-none ${errors[`childGrade-${index}`] ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                            >
                              <option value="">Select Grade</option>
                              {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                              ))}
                            </select>
                            <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
                          </div>
                          {errors[`childGrade-${index}`] && <p className="mt-1 text-sm text-red-600">{errors[`childGrade-${index}`]}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor={`childClass-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Class *
                          </label>
                          <div className="relative">
                            <select
                              id={`childClass-${index}`}
                              value={child.class}
                              onChange={(e) => handleChildChange(index, 'class', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md appearance-none ${errors[`childClass-${index}`] ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                            >
                              <option value="">Select Class</option>
                              {['A', 'B', 'C', 'D'].map((cls) => (
                                <option key={cls} value={cls}>{cls}</option>
                              ))}
                            </select>
                            <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
                          </div>
                          {errors[`childClass-${index}`] && <p className="mt-1 text-sm text-red-600">{errors[`childClass-${index}`]}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addChild}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    <FiPlus className="mr-1" />
                    Add Another Child
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Save Parent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddParentModal;