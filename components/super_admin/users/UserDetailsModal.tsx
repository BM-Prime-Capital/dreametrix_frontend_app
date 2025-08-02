import { User } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Mail, School, Calendar, Edit } from "lucide-react";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onEdit: () => void;
}

export function UserDetailsModal({
  isOpen,
  onClose,
  user,
  onEdit,
}: UserDetailsModalProps) {
  const roleColors = {
    super_admin: 'bg-purple-100 text-purple-800',
    school_admin: 'bg-blue-100 text-blue-800',
    teacher: 'bg-green-100 text-green-800',
    student: 'bg-yellow-100 text-yellow-800',
    parent: 'bg-orange-100 text-orange-800'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      description={`${user.firstName} ${user.lastName}`}
      size="lg"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <UserAvatar user={user} size="lg" />
          <div>
            <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
            <Badge className={`${roleColors[user.role]} capitalize mt-1`}>
              {user.role.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-500" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Account Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <Badge variant={user.isActive ? 'default' : 'destructive'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              {user.lastLogin && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Last login:</span>
                  <span>{new Date(user.lastLogin).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit User
          </Button>
        </div>
      </div>
    </Modal>
  );
}