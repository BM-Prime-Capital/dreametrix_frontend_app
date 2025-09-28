"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Building2,
  MapPin,
  Globe,
  Phone,
  Check,
  ChevronsUpDown,
  Search,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { userPath } from "@/constants/userConstants";
import DreaMetrixLogo from "../ui/dreametrix-logo";
import { useSchoolRegistration } from "@/hooks/SchoolAdmin/useSchoolRegistration";
import { useSchoolSearch } from "@/hooks/SchoolAdmin/useSchoolSearch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, useMemo } from "react";
import {
  fetchUSStates,
  fetchCitiesByState,
  SchoolDisplay,
} from "@/services/user-service";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/tailwind";

// Enum for steps
enum RegistrationStep {
  SEARCH = "search",
  SCHOOL_SUMMARY = "summary",
  MANUAL_FORM = "manual",
}

interface RegisterProps {
  userType: string;
  userBasePath: string;
}
export default function SchoolAdminRegister({ userType, userBasePath }: RegisterProps) {
  const router = useRouter();
  const { formData, errors, isLoading, handleInputChange, handleSubmit } =
    useSchoolRegistration();

  // Multi-step states
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(
    RegistrationStep.SEARCH
  );
  const [selectedSchool, setSelectedSchool] = useState<SchoolDisplay | null>(
    null
  );

  // Search functionality
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    hasSearched,
    clearSearch,
  } = useSchoolSearch();

  // Existing states for manual form
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [openCityPopover, setOpenCityPopover] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Select school from search results
  const handleSchoolSelect = (school: SchoolDisplay) => {
    setSelectedSchool(school);
    setCurrentStep(RegistrationStep.SCHOOL_SUMMARY);
  };

  // Go to manual form
  const goToManualForm = () => {
    setCurrentStep(RegistrationStep.MANUAL_FORM);
  };

  // Go back to search
  const goBackToSearch = () => {
    setCurrentStep(RegistrationStep.SEARCH);
    setSelectedSchool(null);
    clearSearch();
  };

  // Fetch US states only when manual form is accessed
  useEffect(() => {
    if (currentStep === RegistrationStep.MANUAL_FORM) {
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
    }
  }, [currentStep]);

  // Fetch cities when state changes (only in manual form)
  useEffect(() => {
    if (currentStep !== RegistrationStep.MANUAL_FORM || !formData.state) {
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
          handleInputChange("city", "");
        }
      } catch (error) {
        console.error("Cities loading error:", error);
        setCities([]);
        handleInputChange("city", "");
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, [formData.state, currentStep]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await handleSubmit();
      console.log("Registration result:", result);

      if (result?.task_id) {
        setSuccessMessage(
          "School created successfully. Credentials will be sent to the provided email shortly."
        );
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  // Render school search step
  const renderSchoolSearch = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#25AAE1] mb-2">
          Find Your School
        </h2>
        <p className="text-gray-600">
          Search for your school in our database or create a new one
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">
            School Name or Location
          </label>
          <div className="flex items-center px-4 py-2 bg-white border rounded-full">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none"
              placeholder="Enter school name, city, or state..."
            />
            {isSearching && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#25AAE1]"></div>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Type at least 2 characters to search automatically
          </p>
        </div>

        {hasSearched && (
          <div className="mt-6">
            {searchResults.length > 0 ? (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Search Results:</h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {searchResults.map((school) => (
                    <div
                      key={school.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleSchoolSelect(school)}
                    >
                      <div className="font-medium text-gray-900">
                        {school.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {school.address}
                        {school.address && school.city && ", "}
                        {school.city}
                        {school.city && school.state && ", "}
                        {school.state}
                        {school.zip_code && ` ${school.zip_code}`}
                      </div>
                      {school.district && (
                        <div className="text-xs text-gray-500 mt-1">
                          District: {school.district}
                        </div>
                      )}
                      {school.phone && (
                        <div className="text-xs text-gray-500">
                          Phone: {school.phone}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No schools found
                </h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find your school in our database.
                </p>
                <Button
                  onClick={goToManualForm}
                  className="bg-[#25AAE1] hover:bg-[#1453B8] text-white"
                >
                  Create New School Profile
                </Button>
              </div>
            )}
          </div>
        )}

        {!hasSearched && (
          <div className="text-center py-8">
            <Button
              variant="outline"
              onClick={goToManualForm}
              className="text-[#25AAE1] border-[#25AAE1] hover:bg-[#25AAE1] hover:text-white"
            >
              Skip Search - Create New School
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // Render school summary step
  const renderSchoolSummary = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#25AAE1]">
          Confirm Your School
        </h2>
        <Button
          variant="outline"
          onClick={goBackToSearch}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Button>
      </div>

      {selectedSchool && (
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#25AAE1] bg-opacity-10 rounded-lg">
              <Building2 className="h-8 w-8 text-[#25AAE1]" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedSchool.name}
              </h3>
              <div className="mt-2 space-y-1 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {selectedSchool.address}, {selectedSchool.city},{" "}
                  {selectedSchool.state}
                  {selectedSchool.zip_code && ` ${selectedSchool.zip_code}`}
                </div>
                {selectedSchool.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {selectedSchool.phone}
                  </div>
                )}
                {selectedSchool.district && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    District: {selectedSchool.district}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-4">
              Is this your school? Click continue to proceed with creating your
              administrator account.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  // Pre-fill form data with selected school info
                  handleInputChange("name", selectedSchool.name);
                  handleInputChange("address", selectedSchool.address);
                  handleInputChange("city", selectedSchool.city);
                  handleInputChange("state", selectedSchool.state);
                  if (selectedSchool.phone) {
                    handleInputChange("phone", selectedSchool.phone);
                  }
                  // Set region based on state for now
                  handleInputChange("region", selectedSchool.state);
                  setCurrentStep(RegistrationStep.MANUAL_FORM);
                }}
                className="bg-[#25AAE1] hover:bg-[#1453B8] text-white flex items-center gap-2"
              >
                Continue with this School
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={goBackToSearch}
                className="text-gray-600"
              >
                This isn't my school
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render manual form step
  const renderManualForm = () => {
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#25AAE1]">
            Create School Profile
          </h2>
          <Button
            variant="outline"
            onClick={goBackToSearch}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* School Name */}
            <div className="relative">
              <div
                className={`relative overflow-hidden border ${
                  errors.name ? "border-red-500" : "border-gray-200"
                } rounded-lg`}
              >
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Building2 size={20} />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="School Name"
                  className="h-12 pl-10 w-full rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#25AAE1]"
                  disabled={isLoading}
                />
              </div>
              {errors.name && renderErrorMessage(errors.name)}
            </div>

            {/* School Email */}
            <div className="relative">
              <div
                className={`relative overflow-hidden border ${
                  errors.school_email ? "border-red-500" : "border-gray-200"
                } rounded-lg`}
              >
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={formData.school_email}
                  onChange={(e) =>
                    handleInputChange("school_email", e.target.value)
                  }
                  placeholder="School Email"
                  className="h-12 pl-10 w-full rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#25AAE1]"
                  disabled={isLoading}
                />
              </div>
              {errors.school_email && renderErrorMessage(errors.school_email)}
            </div>

            {/* Administrator Email */}
            <div className="relative">
              <div
                className={`relative overflow-hidden border ${
                  errors.administrator_email
                    ? "border-red-500"
                    : "border-gray-200"
                } rounded-lg`}
              >
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={formData.administrator_email}
                  onChange={(e) =>
                    handleInputChange("administrator_email", e.target.value)
                  }
                  placeholder="Administrator Email"
                  className="h-12 pl-10 w-full rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#25AAE1]"
                  disabled={isLoading}
                />
              </div>
              {errors.administrator_email &&
                renderErrorMessage(errors.administrator_email)}
            </div>

            {/* Phone */}
            <div className="relative">
              <div
                className={`relative overflow-hidden border ${
                  errors.phone ? "border-red-500" : "border-gray-200"
                } rounded-lg`}
              >
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Phone size={20} />
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Phone Number"
                  className="h-12 pl-10 w-full rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#25AAE1]"
                  disabled={isLoading}
                />
              </div>
              {errors.phone && renderErrorMessage(errors.phone)}
            </div>

            {/* Country (readonly) */}
            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">
                  Country <span className="text-red-500">*</span>
                </span>
                <div className="flex items-center px-4 py-2 bg-white border rounded-full">
                  <Globe className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    name="country"
                    value="United States"
                    className="flex-1 bg-transparent focus:outline-none"
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    readOnly
                    disabled
                  />
                </div>
              </label>
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
                        {loadingStates
                          ? "Loading states..."
                          : formData.state || "Select a state"}
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
                            onSelect={() => handleInputChange("state", state)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.state === state
                                  ? "opacity-100"
                                  : "opacity-0"
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
                        {loadingCities
                          ? "Loading cities..."
                          : formData.city || "Select a city"}
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
                              handleInputChange("city", city);
                              setOpenCityPopover(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.city === city
                                  ? "opacity-100"
                                  : "opacity-0"
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
              <div
                className={`relative overflow-hidden border ${
                  errors.region ? "border-red-500" : "border-gray-200"
                } rounded-lg`}
              >
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Globe size={20} />
                </div>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                  placeholder="Region"
                  className="h-12 pl-10 w-full rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#25AAE1]"
                  disabled={isLoading}
                />
              </div>
              {errors.region && renderErrorMessage(errors.region)}
            </div>

            {/* Address - Full Width */}
            <div className="relative md:col-span-2">
              <div
                className={`relative overflow-hidden border ${
                  errors.address ? "border-red-500" : "border-gray-200"
                } rounded-lg`}
              >
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <MapPin size={20} />
                </div>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Full Address"
                  className="h-12 pl-10 w-full rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#25AAE1]"
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
        </form>

        {successMessage && (
          <div
            className={`p-4 mb-4 mt-4 text-sm rounded-lg ${
              successMessage.includes("successfully")
                ? "text-green-700 bg-green-100"
                : "text-red-700 bg-red-100"
            }`}
          >
            {successMessage}
          </div>
        )}
      </div>
    );
  };

  // Get current step content
  const getCurrentStepContent = () => {
    switch (currentStep) {
      case RegistrationStep.SEARCH:
        return renderSchoolSearch();
      case RegistrationStep.SCHOOL_SUMMARY:
        return renderSchoolSummary();
      case RegistrationStep.MANUAL_FORM:
        return renderManualForm();
      default:
        return renderSchoolSearch();
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

        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25AAE1]"></div>
          </div>
        )}

        {getCurrentStepContent()}

        {/* Login Link */}
        <div className="mt-6">
          <p className="text-center text-sm text-gray-500">
            Already registered?{" "}
            <Link
              href={userPath.LOGIN}
              className="text-[#25AAE1] hover:text-[#1453B8]"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
