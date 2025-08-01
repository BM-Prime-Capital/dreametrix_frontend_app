"use client";

import { User, UserFormData, UserRole } from "@/types";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2, Save, Plus } from "lucide-react";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  onSubmit: (data: UserFormData) => Promise<void>;
  isLoading: boolean;
}

const roles: UserRole[] = [
  'super_admin',
  'school_admin',
  'teacher',
  'student',
  'parent'
];

export function UserFormModal({
  isOpen,
  onClose,
  user,
  onSubmit,
  isLoading,
}: UserFormModalProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const userData: UserFormData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as UserRole,
      schoolId: formData.get("schoolId") as string || undefined,
      districtId: formData.get("districtId") as string || undefined,
      isActive: formData.get("isActive") === "on",
    };

    await onSubmit(userData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? "Edit User" : "Create User"}
      description={user ? "Update user information" : "Add a new user to the system"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name*</Label>
            <Input
              id="firstName"
              name="firstName"
              defaultValue={user?.firstName || ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name*</Label>
            <Input
              id="lastName"
              name="lastName"
              defaultValue={user?.lastName || ""}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email*</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={user?.email || ""}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role*</Label>
            <Select name="role" defaultValue={user?.role || ""} required>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem 
                    key={role} 
                    value={role}
                    className="capitalize"
                  >
                    {role.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schoolId">School ID</Label>
            <Input
              id="schoolId"
              name="schoolId"
              defaultValue={user?.schoolId || ""}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="districtId">District ID</Label>
          <Input
            id="districtId"
            name="districtId"
            defaultValue={user?.districtId || ""}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            name="isActive"
            defaultChecked={user?.isActive ?? true}
          />
          <Label htmlFor="isActive">Active User</Label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : user ? (
              <Save className="h-4 w-4 mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {user ? "Update User" : "Create User"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}