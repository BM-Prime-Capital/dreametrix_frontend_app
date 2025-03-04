"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Building2, MapPin, Globe, Phone } from "lucide-react";
import { userPath } from "@/constants/userConstants";
import DreaMetrixLogo from "../ui/dreametrix-logo";
import { useSchoolRegistration } from "@/hooks/SchoolAdmin/useSchoolRegistration";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SchoolAdminRegister({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userBasePath,
}: {
  userType: string;
  userBasePath: string;
}) {
  const router = useRouter();
  const {
    formData,
    errors,
    isLoading,
    countries,
    handleInputChange,
    handleSubmit,
  } = useSchoolRegistration();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleSubmit();
      router.push(userPath.SCHOOL_ADMIN_LOGIN_PATH);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/assets/images/bg.png')` }}
    >
      <div className="bg-[#f1f1f1e6] p-6 sm:p-8 rounded-[15px] shadow-[0px_4px_20px_rgba(0,0,0,0.1)] w-full max-w-[600px] mx-4">
        <div className="flex justify-center mb-6">
          <DreaMetrixLogo />
        </div>

        <div className="text-left mb-6">
          <h2 className="text-2xl font-bold text-[#25AAE1]">{`Register Your School`}</h2>
        </div>

        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25AAE1]"></div>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">School Name</span>
                <div className="flex items-center px-4 py-2 bg-white border rounded-full">
                  <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="flex-1 bg-transparent focus:outline-none"
                    placeholder="Enter school name"
                    maxLength={255}
                  />
                </div>
                {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
              </label>
            </div>

            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">School Email</span>
                <div className="flex items-center px-4 py-2 bg-white border rounded-full">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="email"
                    value={formData.school_email}
                    onChange={(e) => handleInputChange('school_email', e.target.value)}
                    className="flex-1 bg-transparent focus:outline-none"
                    placeholder="Enter school email"
                  />
                </div>
                {errors.school_email && <span className="text-red-500 text-sm">{errors.school_email}</span>}
              </label>
            </div>

            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">Administrator Email</span>
                <div className="flex items-center px-4 py-2 bg-white border rounded-full">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="email"
                    value={formData.administrator_email}
                    onChange={(e) => handleInputChange('administrator_email', e.target.value)}
                    className="flex-1 bg-transparent focus:outline-none"
                    placeholder="Enter administrator email"
                  />
                </div>
                {errors.administrator_email && <span className="text-red-500 text-sm">{errors.administrator_email}</span>}
              </label>
            </div>

            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">Phone</span>
                <div className="flex items-center px-4 py-2 bg-white border rounded-full">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="flex-1 bg-transparent focus:outline-none"
                    placeholder="Enter phone number"
                    maxLength={20}
                  />
                </div>
                {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
              </label>
            </div>

            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">Country</span>
                <Select
                  value={formData.country}
                  onValueChange={(value) => handleInputChange('country', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && <span className="text-red-500 text-sm">{errors.country}</span>}
              </label>
            </div>

            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">City</span>
                <div className="flex items-center px-4 py-2 bg-white border rounded-full">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="flex-1 bg-transparent focus:outline-none"
                    placeholder="Enter city"
                    maxLength={255}
                  />
                </div>
                {errors.city && <span className="text-red-500 text-sm">{errors.city}</span>}
              </label>
            </div>
          </div>

          <div>
            <label className="flex flex-col space-y-1">
              <span className="text-sm text-gray-600">Region (Optional)</span>
              <div className="flex items-center px-4 py-2 bg-white border rounded-full">
                <Globe className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className="flex-1 bg-transparent focus:outline-none"
                  placeholder="Enter region (optional)"
                  maxLength={255}
                />
              </div>
              {errors.region && <span className="text-red-500 text-sm">{errors.region}</span>}
            </label>
          </div>

          <div>
            <label className="flex flex-col space-y-1">
              <span className="text-sm text-gray-600">Address (Optional)</span>
              <div className="flex items-center px-4 py-2 bg-white border rounded-full">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="flex-1 bg-transparent focus:outline-none"
                  placeholder="Enter full address (optional)"
                  maxLength={255}
                />
              </div>
              {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#25AAE1] text-white py-3 rounded-full 
                     transition-colors focus:outline-none focus:ring-2 focus:ring-[#25AAE1] 
                     focus:ring-offset-2 disabled:opacity-50 text-base font-medium"
          >
            {isLoading ? "REGISTERING..." : "REGISTER SCHOOL"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already registered?{" "}
            <Link
              href={userPath.SCHOOL_ADMIN_LOGIN_PATH}
              className="text-[#25AAE1] hover:text-[#1453B8]"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}