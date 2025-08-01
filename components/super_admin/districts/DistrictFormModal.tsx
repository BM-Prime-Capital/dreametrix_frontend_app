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

    // Validation simple
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
            
            <div className="space-y-2">
              <Label htmlFor="code">District Code*</Label>
              <Input
                id="code"
                name="code"
                placeholder="ND001"
                defaultValue={district?.code || ""}
                required
              />
              {formErrors.code && (
                <p className="text-sm text-red-500">{formErrors.code}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region">Region*</Label>
              <Input
                id="region"
                name="region"
                placeholder="Northern Region"
                defaultValue={district?.region || ""}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="superintendent">Superintendent*</Label>
              <Input
                id="superintendent"
                name="superintendent"
                placeholder="Dr. Emily Johnson"
                defaultValue={district?.superintendent || ""}
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Contact Information
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="contact@district.edu"
                defaultValue={district?.email || ""}
                required
              />
              {formErrors.email && (
                <p className="text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone*</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+1 (555) 123-4567"
                defaultValue={district?.phone || ""}
                required
              />
              {formErrors.phone && (
                <p className="text-sm text-red-500">{formErrors.phone}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                placeholder="https://district.edu"
                defaultValue={district?.website || ""}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-500" />
              Location
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address*</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Education Blvd"
                defaultValue={district?.address || ""}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City*</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Metropolis"
                  defaultValue={district?.city || ""}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State*</Label>
                <Input
                  id="state"
                  name="state"
                  placeholder="State"
                  defaultValue={district?.state || ""}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code*</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  placeholder="12345"
                  defaultValue={district?.postalCode || ""}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country*</Label>
                <Input
                  id="country"
                  name="country"
                  placeholder="Country"
                  defaultValue={district?.country || ""}
                  required
                />
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <School className="h-5 w-5 text-amber-500" />
              Statistics
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schoolsCount">Schools*</Label>
                <Input
                  id="schoolsCount"
                  name="schoolsCount"
                  type="number"
                  min="0"
                  placeholder="12"
                  defaultValue={district?.schoolsCount || ""}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studentsCount">Students*</Label>
                <Input
                  id="studentsCount"
                  name="studentsCount"
                  type="number"
                  min="0"
                  placeholder="8500"
                  defaultValue={district?.studentsCount || ""}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="staffCount">Staff*</Label>
                <Input
                  id="staffCount"
                  name="staffCount"
                  type="number"
                  min="0"
                  placeholder="650"
                  defaultValue={district?.staffCount || ""}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="establishedDate">Established Date*</Label>
              <Input
                id="establishedDate"
                name="establishedDate"
                type="date"
                defaultValue={district?.establishedDate || ""}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="status"
                name="status"
                defaultChecked={district?.status === "active" || true}
              />
              <Label htmlFor="status">Active District</Label>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief description of the district"
              className="min-h-[100px]"
              defaultValue={district?.description || ""}
            />
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