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

import React, { useEffect, useState } from "react";
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
  SUCCESS = "success",
}

interface StepIndicatorProps {
  currentStep: RegistrationStep;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: RegistrationStep.SEARCH, label: 'Search', number: 1 },
    { id: RegistrationStep.SCHOOL_SUMMARY, label: 'Confirm', number: 2 },
    { id: RegistrationStep.MANUAL_FORM, label: 'Details', number: 3 },
    { id: RegistrationStep.SUCCESS, label: 'Success', number: 4 },
  ];

  return (
    <div className="mb-8" role="navigation" aria-label="Registration progress">
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {index > 0 && (
              <div className={cn(
                "w-8 sm:w-12 h-0.5 transition-colors",
                steps.findIndex(s => s.id === currentStep) >= index
                  ? "bg-[#25AAE1]"
                  : "bg-gray-300"
              )} />
            )}
            <div className="flex items-center">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 font-semibold text-xs sm:text-sm transition-all",
                currentStep === step.id
                  ? "border-[#25AAE1] bg-[#25AAE1] text-white shadow-md scale-110"
                  : steps.findIndex(s => s.id === currentStep) > index
                  ? "border-[#25AAE1] bg-[#25AAE1] text-white"
                  : "border-gray-300 bg-white text-gray-500"
              )}>
                {steps.findIndex(s => s.id === currentStep) > index ? (
                  <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  step.number
                )}
              </div>
              <span className={cn(
                "ml-2 text-xs sm:text-sm font-medium hidden md:inline transition-colors",
                currentStep === step.id ? "text-gray-900" : "text-gray-500"
              )}>
                {step.label}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

interface RegisterProps {
  userType: string;
  userBasePath: string;
}
export default function SchoolAdminRegister({}: RegisterProps) {
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
  const [apiError, setApiError] = useState<string | null>(null); 

  // Select school from search results
  const handleSchoolSelect = (school: SchoolDisplay) => {
    setSelectedSchool(school);
    setCurrentStep(RegistrationStep.SCHOOL_SUMMARY);
  };

  // Go to manual form
  const goToManualForm = () => {
    setCurrentStep(RegistrationStep.MANUAL_FORM);
    setSelectedSchool(null);
    // Set default country when going to manual form
    handleInputChange("country", "USA");
    setApiError(null);
  };

  // Go back to search
  const goBackToSearch = () => {
    setCurrentStep(RegistrationStep.SEARCH);
    setSelectedSchool(null);
    clearSearch();
    setApiError(null);
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

useEffect(() => {
  if (currentStep !== RegistrationStep.MANUAL_FORM || !formData.state) {
    setCities([]);
    return;
  }

  const loadCities = async () => {
    setLoadingCities(true);
    try {
      const normalizedState = formData.state
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const citiesData = await fetchCitiesByState(normalizedState);
      
      const uniqueCities = [...new Set(citiesData)].sort();
      setCities(uniqueCities);

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

  // Validation function for required fields
  const isFormValid = () => {
    const requiredFields = [
      'name', 'school_email', 'administrator_email', 'phone', 
      'state', 'city', 'address', 'country'
    ];
    
    const isValid = requiredFields.every(field => {
      const value = formData[field as keyof typeof formData];
      return value && value.toString().trim() !== '';
    });

    console.log("Form validation check:", {
      formData,
      requiredFields,
      isValid
    });

    return isValid;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    
    console.log("✅ onSubmit called");
    console.log("📝 Form data:", formData);
    
    if (!isFormValid()) {
      console.log("❌ Form validation failed - missing required fields");
      setApiError("Please fill in all required fields");
      return;
    }

    console.log("✅ Form is valid, proceeding with submission...");
    
    try {
      console.log("🔄 Calling handleSubmit...");
      const result = await handleSubmit();
      console.log("✅ Registration result:", result);

      if (result?.task_id) {
        console.log("🎉 Success, moving to success step");
        setCurrentStep(RegistrationStep.SUCCESS);
      } else {
        console.log("❌ No task_id in result");
        setApiError("Registration completed but no task ID received. Please contact support.");
      }
    } catch (error: any) {
      console.error("❌ Registration failed:", error);
      
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error.message) {
        setApiError(error.message);
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
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
        {(!hasSearched && isSearching) && (
          <div className="text-center py-8 flex flex-col items-center gap-3">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#25AAE1] border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-600">Searching for schools...</p>
          </div>
        )}
        {(hasSearched && isSearching) && (
          <div className="mt-6 space-y-2">
            <h3 className="font-medium text-gray-700">Search Results:</h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-lg animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        )}
        {hasSearched && !isSearching && (
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
                  We couldn&apos;t find your school in our database.
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
                  handleInputChange("country", selectedSchool.country || "USA");
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
                This isn&apos;t my school
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render success step
  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-green-100 p-4">
          <Check className="h-12 w-12 text-green-600" strokeWidth={3} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Registration Submitted Successfully!
        </h2>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-green-800 text-sm leading-relaxed">
            Your school registration request has been submitted successfully. 
            You will receive an email regarding the status of your request within the next 24 hours.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Button
          onClick={() => router.push(userPath.LOGIN)}
          className="bg-[#25AAE1] hover:bg-[#1453B8] text-white h-12 px-6"
        >
          Back to Login
        </Button>
        <Button
          onClick={() => {
            setCurrentStep(RegistrationStep.SEARCH);
            clearSearch();
            setSelectedSchool(null);
          }}
          variant="outline"
          className="h-12 px-6"
        >
          Register Another School
        </Button>
      </div>
    </div>
  );

  // Render manual form step
  const renderManualForm = () => {
    const renderErrorMessage = (errorMessage: string | null, fieldId: string) => {
      if (!errorMessage) return null;
      return (
        <div
          id={`${fieldId}-error`}
          className="mt-1.5 flex items-start gap-2 text-sm text-red-600 animate-in slide-in-from-top-1"
          role="alert"
          aria-live="polite"
        >
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <span>{errorMessage}</span>
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

        {/* Display API error message */}
        {apiError && (
          <div
            className="p-4 border border-red-200 bg-red-50 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-1"
            role="alert"
            aria-live="assertive"
          >
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-medium text-red-800">Registration Error</p>
              <p className="text-sm text-red-700 mt-1">{apiError} : Please change the administrator email.</p>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* School Name */}
            <div className="space-y-1.5">
              <label htmlFor="school-name" className="block text-sm font-medium text-gray-700">
                School Name <span className="text-red-500" aria-label="required">*</span>
              </label>
              <div className={cn(
                "relative flex items-center border rounded-lg transition-all",
                errors.name
                  ? "border-red-500 ring-2 ring-red-100"
                  : "border-gray-300 focus-within:border-[#25AAE1] focus-within:ring-2 focus-within:ring-[#25AAE1]/20"
              )}>
                <Building2
                  className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="school-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter school name"
                  className="h-12 pl-11 pr-4 w-full bg-transparent focus:outline-none rounded-lg"
                  disabled={isLoading}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "school-name-error" : undefined}
                  required
                />
              </div>
              {renderErrorMessage(errors.name, "school-name")}
            </div>

            {/* School Email */}
            <div className="space-y-1.5">
              <label htmlFor="school-email" className="block text-sm font-medium text-gray-700">
                School Email <span className="text-red-500" aria-label="required">*</span>
              </label>
              <div className={cn(
                "relative flex items-center border rounded-lg transition-all",
                errors.school_email
                  ? "border-red-500 ring-2 ring-red-100"
                  : "border-gray-300 focus-within:border-[#25AAE1] focus-within:ring-2 focus-within:ring-[#25AAE1]/20"
              )}>
                <Mail
                  className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="school-email"
                  type="email"
                  value={formData.school_email}
                  onChange={(e) => handleInputChange("school_email", e.target.value)}
                  placeholder="Enter school email"
                  className="h-12 pl-11 pr-4 w-full bg-transparent focus:outline-none rounded-lg"
                  disabled={isLoading}
                  aria-invalid={!!errors.school_email}
                  aria-describedby={errors.school_email ? "school-email-error" : undefined}
                  required
                />
              </div>
              {renderErrorMessage(errors.school_email, "school-email")}
            </div>

            {/* Administrator Email */}
            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700">
                Administrator Email <span className="text-red-500" aria-label="required">*</span>
              </label>
              <div className={cn(
                "relative flex items-center border rounded-lg transition-all",
                errors.administrator_email
                  ? "border-red-500 ring-2 ring-red-100"
                  : "border-gray-300 focus-within:border-[#25AAE1] focus-within:ring-2 focus-within:ring-[#25AAE1]/20"
              )}>
                <Mail
                  className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="admin-email"
                  type="email"
                  value={formData.administrator_email}
                  onChange={(e) => handleInputChange("administrator_email", e.target.value)}
                  placeholder="Enter administrator email"
                  className="h-12 pl-11 pr-4 w-full bg-transparent focus:outline-none rounded-lg"
                  disabled={isLoading}
                  aria-invalid={!!errors.administrator_email}
                  aria-describedby={errors.administrator_email ? "admin-email-error" : undefined}
                  required
                />
              </div>
              {renderErrorMessage(errors.administrator_email, "admin-email")}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500" aria-label="required">*</span>
              </label>
              <div className={cn(
                "relative flex items-center border rounded-lg transition-all",
                errors.phone
                  ? "border-red-500 ring-2 ring-red-100"
                  : "border-gray-300 focus-within:border-[#25AAE1] focus-within:ring-2 focus-within:ring-[#25AAE1]/20"
              )}>
                <Phone
                  className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                  className="h-12 pl-11 pr-4 w-full bg-transparent focus:outline-none rounded-lg"
                  disabled={isLoading}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  required
                />
              </div>
              {renderErrorMessage(errors.phone, "phone")}
            </div>

            {/* Country Information Banner */}
            <div className="md:col-span-2">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                <Globe className="h-5 w-5 text-blue-600 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Registration Location</p>
                  <p className="text-sm text-blue-700">Currently available for schools in the United States</p>
                </div>
              </div>
              {/* Hidden country field that's actually connected to form state */}
              <input 
                type="hidden" 
                value={formData.country || "USA"}
                onChange={(e) => handleInputChange("country", e.target.value)}
              />
            </div>

            {/* State Select */}
            <div className="space-y-1.5">
              <label htmlFor="state-select" className="block text-sm font-medium text-gray-700">
                State <span className="text-red-500" aria-label="required">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="state-select"
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full h-12 justify-between",
                      !formData.state && "text-muted-foreground",
                      errors.state && "border-red-500 ring-2 ring-red-100"
                    )}
                    disabled={loadingStates || isLoading}
                    aria-invalid={!!errors.state}
                    aria-describedby={errors.state ? "state-error" : undefined}
                  >
                    <div className="flex items-center flex-1">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
                      <span className="truncate">
                        {loadingStates
                          ? "Loading states..."
                          : formData.state || "Select a state"}
                      </span>
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[400px] p-0">
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
              {renderErrorMessage(errors.state, "state")}
            </div>

            {/* City Select */}
            <div className="space-y-1.5">
              <label htmlFor="city-select" className="block text-sm font-medium text-gray-700">
                City <span className="text-red-500" aria-label="required">*</span>
              </label>
              <Popover open={openCityPopover} onOpenChange={setOpenCityPopover}>
                <PopoverTrigger asChild>
                  <Button
                    id="city-select"
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full h-12 justify-between",
                      !formData.city && "text-muted-foreground",
                      errors.city && "border-red-500 ring-2 ring-red-100"
                    )}
                    disabled={!formData.state || loadingCities || isLoading}
                    aria-invalid={!!errors.city}
                    aria-describedby={errors.city ? "city-error" : undefined}
                  >
                    <div className="flex items-center flex-1">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
                      <span className="truncate">
                        {loadingCities
                          ? "Loading cities..."
                          : formData.city || "Select a city"}
                      </span>
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[400px] p-0">
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
              {renderErrorMessage(errors.city, "city")}
            </div>

            {/* Region */}
            <div className="space-y-1.5">
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                Region
              </label>
              <div className={cn(
                "relative flex items-center border rounded-lg transition-all",
                errors.region
                  ? "border-red-500 ring-2 ring-red-100"
                  : "border-gray-300 focus-within:border-[#25AAE1] focus-within:ring-2 focus-within:ring-[#25AAE1]/20"
              )}>
                <Globe
                  className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="region"
                  type="text"
                  value={formData.region}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                  placeholder="Enter region"
                  className="h-12 pl-11 pr-4 w-full bg-transparent focus:outline-none rounded-lg"
                  disabled={isLoading}
                  aria-invalid={!!errors.region}
                  aria-describedby={errors.region ? "region-error" : undefined}
                />
              </div>
              {renderErrorMessage(errors.region, "region")}
            </div>

            {/* Address - Full Width */}
            <div className="md:col-span-2 space-y-1.5">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Full Address <span className="text-red-500" aria-label="required">*</span>
              </label>
              <div className={cn(
                "relative flex items-center border rounded-lg transition-all",
                errors.address
                  ? "border-red-500 ring-2 ring-red-100"
                  : "border-gray-300 focus-within:border-[#25AAE1] focus-within:ring-2 focus-within:ring-[#25AAE1]/20"
              )}>
                <MapPin
                  className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter full address"
                  className="h-12 pl-11 pr-4 w-full bg-transparent focus:outline-none rounded-lg"
                  disabled={isLoading}
                  aria-invalid={!!errors.address}
                  aria-describedby={errors.address ? "address-error" : undefined}
                  required
                />
              </div>
              {renderErrorMessage(errors.address, "address")}
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
      </div>
    );
  };

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case RegistrationStep.SEARCH:
        return renderSchoolSearch();
      case RegistrationStep.SCHOOL_SUMMARY:
        return renderSchoolSummary();
      case RegistrationStep.MANUAL_FORM:
        return renderManualForm();
      case RegistrationStep.SUCCESS:
        return renderSuccessStep();
      default:
        return renderSchoolSearch();
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: `url('/assets/images/bg.png')` }}
    >
      <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-[90vw] sm:max-w-2xl  ">
        <div className="flex justify-center mb-6">
          <DreaMetrixLogo />
        </div>

        {isLoading && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            role="status"
            aria-live="assertive"
            aria-label="Loading, please wait"
          >
            <div className="bg-white rounded-xl p-8 shadow-2xl flex flex-col items-center gap-4 max-w-sm mx-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-[#25AAE1] border-t-transparent animate-spin"></div>
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg text-gray-900">Processing Registration</p>
                <p className="text-sm text-gray-600 mt-2">
                  Please wait while we create your school profile...
                </p>
              </div>
            </div>
          </div>
        )}

        <>
          <StepIndicator currentStep={currentStep} />
          {getCurrentStepContent()}

          {/* Login Link - Only show on non-success steps */}
          {currentStep !== RegistrationStep.SUCCESS && (
            <div className="mt-6">
              <p className="text-center text-sm text-gray-600">
                Already registered?{" "}
                <Link
                  href={userPath.LOGIN}
                  className="text-[#25AAE1] hover:text-[#1453B8] font-medium underline-offset-2 hover:underline"
                >
                  Login here
                </Link>
              </p>
            </div>
          )}
        </>
      </div>
    </div>
  );
}