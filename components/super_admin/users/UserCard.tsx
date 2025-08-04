import { User } from "@/types";
import { UserAvatar } from "./UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Mail, School, Calendar } from "lucide-react";

interface UserCardProps {
  user: User;
  onClick: () => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  const roleColors = {
    super_admin: 'bg-purple-100 text-purple-800',
    school_admin: 'bg-blue-100 text-blue-800',
    teacher: 'bg-green-100 text-green-800',
    student: 'bg-yellow-100 text-yellow-800',
    parent: 'bg-orange-100 text-orange-800'
  };

  return (
    <div 
      className="hover:shadow-md transition-shadow cursor-pointer h-full border rounded-lg p-4 flex flex-col"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <UserAvatar user={user} size="lg" />
          <div>
            <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
            <Badge className={`${roleColors[user.role]} capitalize mt-1`}>
              {user.role.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        <Badge variant={user.isActive ? 'default' : 'destructive'}>
          {user.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <div className="space-y-2 mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="h-4 w-4" />
          <span className="truncate">{user.email}</span>
        </div>
        {user.schoolId && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <School className="h-4 w-4" />
            <span>School ID: {user.schoolId}</span>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 mt-auto pt-3 border-t flex justify-between">
        <span>Created: {new Date(user.createdAt).toLocaleDateString()}</span>
        {user.lastLogin && (
          <span>Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
}