"use client";

import { useState } from "react";
import { District, DistrictFormData } from "@/types";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, Plus, MapPin, Globe, Users, School } from "lucide-react";

interface DistrictFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  district?: District;
  onSubmit: (data: DistrictFormData) => Promise<void>;
  isLoading: boolean;
}

export function DistrictFormModal({
  isOpen,
  onClose,
  district,
  onSubmit,
  isLoading,
}: DistrictFormModalProps) {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const districtData: DistrictFormData = {
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      region: formData.get("region") as string,
      superintendent: formData.get("superintendent") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      postalCode: formData.get("postalCode") as string,
      country: formData.get("country") as string,
      website: formData.get("website") as string || undefined,
      description: formData.get("description") as string || undefined,
      schoolsCount: parseInt(formData.get("schoolsCount") as string),
      studentsCount: parseInt(formData.get("studentsCount") as string),
      staffCount: parseInt(formData.get("staffCount") as string),
      status: formData.get("status") === "on" ? "active" : "inactive",
      establishedDate: formData.get("establishedDate") as string,
    };

    const errors: Record<string, string> = {};
    if (!districtData.name) errors.name = "Name is required";
    if (!districtData.code) errors.code = "Code is required";
    if (!districtData.email) errors.email = "Email is required";
    if (!districtData.phone) errors.phone = "Phone is required";
    
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    await onSubmit(districtData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={district ? "Edit District" : "Create New District"}
      description={
        district
          ? "Update the district information"
          : "Fill in the details for the new district"
      }
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5 text-indigo-500" />
              Basic Information
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">District Name*</Label>
              <Input
                id="name"
                name="name"
                placeholder="North District"
                defaultValue={district?.name || ""}
                required
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>
            
            {/* ... autres champs du formulaire ... */}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : district ? (
              <Save className="h-4 w-4 mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {district ? "Update District" : "Create District"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}