"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Plus,
  School as SchoolIcon,
  MapPin,
  Phone,
  User,
  BookOpen,
  Globe,
  Settings,
  Save,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { School } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { useState } from "react";

// Schéma de validation complet
const schoolFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  shortName: z.string().min(2, "Short name must be at least 2 characters"),
  district: z.string().min(2, "District must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  principal: z.string().min(2, "Principal name must be at least 2 characters"),
  vicePrincipal: z.string().optional(),
  description: z.string().optional(),
  studentCount: z.number().min(0, "Student count cannot be negative"),
  teacherCount: z.number().min(0, "Teacher count cannot be negative"),
  courseCount: z.number().min(0, "Course count cannot be negative"),
  establishmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  isActive: z.boolean(),
  hasInternetAccess: z.boolean(),
  internetSpeed: z.string().optional(),
  facilities: z.array(z.string()).optional(),
  additionalInfo: z.string().optional(),
});

type SchoolFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: z.infer<typeof schoolFormSchema>) => Promise<void>;
  initialData?: School | null;
};

export function SchoolFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: SchoolFormModalProps) {
  const form = useForm<z.infer<typeof schoolFormSchema>>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: initialData || {
      name: "",
      shortName: "",
      district: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      phone: "",
      email: "",
      website: "",
      principal: "",
      vicePrincipal: "",
      description: "",
      studentCount: 0,
      teacherCount: 0,
      courseCount: 0,
      establishmentDate: new Date().toISOString().split('T')[0],
      isActive: true,
      hasInternetAccess: false,
      internetSpeed: "",
      facilities: [],
      additionalInfo: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: z.infer<typeof schoolFormSchema>) {
    setIsLoading(true);
    try {
      await onSubmit(values);
      onClose();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <SchoolIcon className="h-5 w-5" />
          School Form
        </div>
      }
      description={
        initialData
          ? "Update all school information"
          : "Fill in all required details for the new school"
      }
      size="2xl"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <SchoolIcon className="h-4 w-4" />
                Basic Information
              </h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Central High School" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="CHS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District*</FormLabel>
                    <FormControl>
                      <Input placeholder="North District" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the school"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </h3>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address*</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Education Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City*</FormLabel>
                      <FormControl>
                        <Input placeholder="Metropolis" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code*</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country*</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Information
              </h3>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone*</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@school.edu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://school.edu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Administration */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Administration
              </h3>

              <FormField
                control={form.control}
                name="principal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Principal*</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. Sarah Johnson" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vicePrincipal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vice Principal</FormLabel>
                    <FormControl>
                      <Input placeholder="Mr. John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Statistics */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Statistics
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="studentCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Students*</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="500"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="teacherCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teachers*</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="30"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="courseCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Courses*</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="20"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="establishmentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Establishment Date*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </h3>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Active School</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Is this school currently active?
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasInternetAccess"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Internet Access</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Does the school have internet access?
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("hasInternetAccess") && (
                <FormField
                  control={form.control}
                  name="internetSpeed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internet Speed</FormLabel>
                      <FormControl>
                        <Input placeholder="100 Mbps" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Additional Information */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="font-medium flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Additional Information
              </h3>

              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information about the school"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : initialData ? (
                <Save className="h-4 w-4 mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {initialData ? "Update School" : "Create School"}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}