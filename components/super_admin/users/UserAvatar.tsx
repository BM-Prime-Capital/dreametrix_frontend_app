import { User } from "@/types";

interface UserAvatarProps {
  user: Pick<User, 'firstName' | 'lastName'> & { avatarUrl?: string };
  size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  };

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <div className={`inline-flex items-center justify-center rounded-full bg-gray-200 ${sizeClasses[size]}`}>
      {user.avatarUrl ? (
        <img 
          src={user.avatarUrl} 
          alt={`${user.firstName} ${user.lastName}`}
          className="rounded-full object-cover h-full w-full"
        />
      ) : (
        <span className="font-medium text-gray-600">{initials}</span>
      )}
    </div>
  );
}