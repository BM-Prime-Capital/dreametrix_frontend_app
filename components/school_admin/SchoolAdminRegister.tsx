"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Building2, MapPin, Globe, Phone, Check, ChevronsUpDown } from "lucide-react";
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
import { useEffect, useState } from "react";
import { fetchUSStates, fetchCitiesByState } from "@/services/user-service";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/tailwind";


export default function SchoolAdminRegister({
  userType,
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
    handleInputChange,
    handleSubmit,
  } = useSchoolRegistration();

  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [openCityPopover, setOpenCityPopover] = useState(false);

  // Fetch US states on component mount
  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const statesData = await fetchUSStates();
        setStates(statesData);
      } catch (error) {
        console.error("States loading error:", error);
      } finally {
        setLoadingStates(false);
      }
    };

    loadStates();
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    if (!formData.state) {
      setCities([]);
      return;
    }

    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const citiesData = await fetchCitiesByState(formData.state);
        // Remove duplicates and sort alphabetically
        const uniqueCities = [...new Set(citiesData)].sort();
        setCities(uniqueCities);
        
        // Reset city selection if the current city is not in the new list
        if (formData.city && !uniqueCities.includes(formData.city)) {
          handleInputChange('city', '');
        }
      } catch (error) {
        console.error("Cities loading error:", error);
        setCities([]);
        handleInputChange('city', '');
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, [formData.state]);

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
            {/* School Name */}
            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">School Name <span className="text-red-500">*</span></span>
                <div className="flex items-center px-4 py-2 bg-white border rounded-full">
                  <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="flex-1 bg-transparent focus:outline-none"
                    placeholder="Enter school name"
                    maxLength={255}
                    required
                  />
                </div>
                {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
              </label>
            </div>

            {/* School Email */}
            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">School Email <span className="text-red-500">*</span></span>
                <div className="flex items-center px-4 py-2 bg-white border rounded-full">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="email"
                    value={formData.school_email}
                    onChange={(e) => handleInputChange('school_email', e.target.value)}
                    className="flex-1 bg-transparent focus:outline-none"
                    placeholder="Enter school email"
                    required
                  />
                </div>
                {errors.school_email && <span className="text-red-500 text-sm">{errors.school_email}</span>}
              </label>
            </div>

            {/* Administrator Email */}
            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">Administrator Email <span className="text-red-500">*</span></span>
                <div className="flex items-center px-4 py-2 bg-white border rounded-full">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="email"
                    value={formData.administrator_email}
                    onChange={(e) => handleInputChange('administrator_email', e.target.value)}
                    className="flex-1 bg-transparent focus:outline-none"
                    placeholder="Enter administrator email"
                    required
                  />
                </div>
                {errors.administrator_email && <span className="text-red-500 text-sm">{errors.administrator_email}</span>}
              </label>
            </div>

            {/* Phone */}
            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">Phone <span className="text-red-500">*</span></span>
                <div className="flex items-center px-4 py-2 bg-white border rounded-full">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="flex-1 bg-transparent focus:outline-none"
                    placeholder="Enter phone number"
                    maxLength={20}
                    required
                  />
                </div>
                {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
              </label>
            </div>

            {/* Country (readonly) */}
            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">Country <span className="text-red-500">*</span></span>
                <div className="flex items-center px-4 py-2 bg-white border rounded-full">
                  <Globe className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    value="United States"
                    className="flex-1 bg-transparent focus:outline-none"
                    readOnly
                    disabled
                  />
                </div>
              </label>
            </div>

            {/* State Select with Search */}
            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">State <span className="text-red-500">*</span></span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full flex justify-between items-center px-3",
                        !formData.state && "text-muted-foreground"
                      )}
                      disabled={loadingStates}
                    >
                      <span className="truncate flex-1 text-left">
                        {loadingStates ? "Loading states..." : formData.state || "Select a state"}
                      </span>
                      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search state..." />
                      <CommandList>
                        <CommandEmpty>No state found.</CommandEmpty>
                        <CommandGroup>
                          {states.map((state) => (
                            <CommandItem
                              value={state}
                              key={state}
                              onSelect={() => {
                                handleInputChange('state', state);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.state === state ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {state}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.state && <span className="text-red-500 text-sm">{errors.state}</span>}
              </label>
            </div>

            {/* City Select with Search */}
            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">City <span className="text-red-500">*</span></span>
                <Popover open={openCityPopover} onOpenChange={setOpenCityPopover}>
                  <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCityPopover}
                    className={cn(
                      "w-full flex justify-between items-center",
                      !formData.city && "text-muted-foreground"
                    )}
                    disabled={!formData.state || loadingCities}
                  >
                    <span className="truncate">
                      {loadingCities 
                        ? "Loading cities..." 
                        : formData.city || "Select a city"}
                    </span>
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50 !ml-auto" />
                  </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search city..." />
                      <CommandList>
                        <CommandEmpty>No city found.</CommandEmpty>
                        <CommandGroup>
                          {cities.map((city) => (
                            <CommandItem
                              value={city}
                              key={city}
                              onSelect={() => {
                                handleInputChange('city', city);
                                setOpenCityPopover(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.city === city ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {city}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.city && <span className="text-red-500 text-sm">{errors.city}</span>}
              </label>
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="flex flex-col space-y-1">
              <span className="text-sm text-gray-600">Region <span className="text-red-500">*</span></span>
              <div className="flex items-center px-4 py-2 bg-white border rounded-full">
                <Globe className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className="flex-1 bg-transparent focus:outline-none"
                  placeholder="Enter region"
                  maxLength={255}
                  required
                />
              </div>
              {errors.region && <span className="text-red-500 text-sm">{errors.region}</span>}
            </label>
          </div>

          {/* Address */}
          <div>
            <label className="flex flex-col space-y-1">
              <span className="text-sm text-gray-600">Address <span className="text-red-500">*</span></span>
              <div className="flex items-center px-4 py-2 bg-white border rounded-full">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="flex-1 bg-transparent focus:outline-none"
                  placeholder="Enter full address"
                  maxLength={255}
                  required
                />
              </div>
              {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#25AAE1] text-white py-3 rounded-full 
                     transition-colors focus:outline-none focus:ring-2 focus:ring-[#25AAE1] 
                     focus:ring-offset-2 disabled:opacity-50 text-base font-medium"
          >
            {isLoading ? "REGISTERING..." : "REGISTER SCHOOL"}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500">
            Already registered?{" "}
            <Link
              href={userPath.LOGIN}
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