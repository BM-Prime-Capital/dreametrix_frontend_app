"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Building2, MapPin, Globe, Phone, Check, ChevronsUpDown, AlertTriangle } from "lucide-react";
import { userPath } from "@/constants/userConstants";
import DreaMetrixLogo from "../ui/dreametrix-logo";
import { useSchoolRegistration } from "@/hooks/SchoolAdmin/useSchoolRegistration";
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
import { Input } from "@/components/ui/input";

export default function SchoolAdminRegister() {
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

  const renderErrorMessage = (errorMessage: string | null) => {
    if (!errorMessage) return null;
    return (
      <div className="absolute right-[-160px] top-1/2 transform -translate-y-1/2 bg-red-100 text-red-700 px-3 py-1 rounded-md shadow-md">
        <div className="absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-red-100"></div>
        <div className="flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <span className="text-sm">{errorMessage}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[url('/assets/images/bg.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-2">
      <div className="w-full max-w-[600px] bg-[rgba(230,230,230,0.95)] p-6 sm:p-8 rounded-[20px] shadow-[0px_4px_20px_rgba(0,0,0,0.15)]">
        <div className="flex justify-center mb-6">
          <DreaMetrixLogo />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-[#1A73E8] text-2xl font-semibold">
            Register Your School
          </h2>
          <p className="text-gray-600 mt-2">
            Fill in your school details to create an account
          </p>
        </div>

        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25AAE1]"></div>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* School Name */}
            <div className="relative">
              <div className={`relative overflow-hidden border ${errors.name ? "border-red-500" : "border-gray-200"} rounded-lg`}>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Building2 size={20} />
                </div>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="School Name"
                  className="h-12 pl-10 rounded-lg"
                  disabled={isLoading}
                />
              </div>
              {errors.name && renderErrorMessage(errors.name)}
            </div>

            {/* School Email */}
            <div className="relative">
              <div className={`relative overflow-hidden border ${errors.school_email ? "border-red-500" : "border-gray-200"} rounded-lg`}>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail size={20} />
                </div>
                <Input
                  type="email"
                  value={formData.school_email}
                  onChange={(e) => handleInputChange('school_email', e.target.value)}
                  placeholder="School Email"
                  className="h-12 pl-10 rounded-lg"
                  disabled={isLoading}
                />
              </div>
              {errors.school_email && renderErrorMessage(errors.school_email)}
            </div>

            {/* Administrator Email */}
            <div className="relative">
              <div className={`relative overflow-hidden border ${errors.administrator_email ? "border-red-500" : "border-gray-200"} rounded-lg`}>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail size={20} />
                </div>
                <Input
                  type="email"
                  value={formData.administrator_email}
                  onChange={(e) => handleInputChange('administrator_email', e.target.value)}
                  placeholder="Administrator Email"
                  className="h-12 pl-10 rounded-lg"
                  disabled={isLoading}
                />
              </div>
              {errors.administrator_email && renderErrorMessage(errors.administrator_email)}
            </div>

            {/* Phone */}
            <div className="relative">
              <div className={`relative overflow-hidden border ${errors.phone ? "border-red-500" : "border-gray-200"} rounded-lg`}>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Phone size={20} />
                </div>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Phone Number"
                  className="h-12 pl-10 rounded-lg"
                  disabled={isLoading}
                />
              </div>
              {errors.phone && renderErrorMessage(errors.phone)}
            </div>

            {/* Country (readonly) */}
            <div className="relative">
              <div className="relative overflow-hidden border border-gray-200 rounded-lg">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Globe size={20} />
                </div>
                <Input
                  type="text"
                  value="United States"
                  className="h-12 pl-10 rounded-lg bg-gray-50"
                  readOnly
                  disabled
                />
              </div>
            </div>

            {/* State Select */}
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full h-12 flex justify-between items-center px-3 rounded-lg",
                      !formData.state && "text-muted-foreground"
                    )}
                    disabled={loadingStates || isLoading}
                  >
                    <div className="flex items-center justify-between flex-1">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="truncate">
                        {loadingStates ? "Loading states..." : formData.state || "Select a state"}
                      </span>
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-20" />
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
                            onSelect={() => handleInputChange('state', state)}
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
              {errors.state && renderErrorMessage(errors.state)}
            </div>

            {/* City Select */}
            <div className="relative">
              <Popover open={openCityPopover} onOpenChange={setOpenCityPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full h-12 flex justify-between items-center px-3 rounded-lg",
                      !formData.city && "text-muted-foreground"
                    )}
                    disabled={!formData.state || loadingCities || isLoading}
                  >
                    <div className="flex items-center flex-1">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="truncate">
                        {loadingCities ? "Loading cities..." : formData.city || "Select a city"}
                      </span>
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-20" />
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
              {errors.city && renderErrorMessage(errors.city)}
            </div>

            {/* Region */}
            <div className="relative">
              <div className={`relative overflow-hidden border ${errors.region ? "border-red-500" : "border-gray-200"} rounded-lg`}>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Globe size={20} />
                </div>
                <Input
                  type="text"
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  placeholder="Region"
                  className="h-12 pl-10 rounded-lg"
                  disabled={isLoading}
                />
              </div>
              {errors.region && renderErrorMessage(errors.region)}
            </div>

            {/* Address - Full Width */}
            <div className="relative md:col-span-2">
              <div className={`relative overflow-hidden border ${errors.address ? "border-red-500" : "border-gray-200"} rounded-lg`}>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <MapPin size={20} />
                </div>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Full Address"
                  className="h-12 pl-10 rounded-lg"
                  disabled={isLoading}
                />
              </div>
              {errors.address && renderErrorMessage(errors.address)}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#25AAE1] hover:bg-[#1453B8] text-white py-3 rounded-lg
                     transition-colors focus:outline-none focus:ring-2 focus:ring-[#25AAE1]
                     focus:ring-offset-2 disabled:opacity-50 text-base font-semibold mt-6"
          >
            {isLoading ? "Registering..." : "Register School"}
          </button>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already registered?{" "}
              <Link
                href={userPath.LOGIN}
                className="text-[#1A73E8] hover:text-[#1453B8] font-medium"
              >
                Login instead
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
