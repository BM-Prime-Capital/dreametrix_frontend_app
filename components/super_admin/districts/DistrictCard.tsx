import { District } from "@/types";
import { Badge } from "@/components/ui/badge";
import { MapPin, School, Users, Globe } from "lucide-react";

interface DistrictCardProps {
  district: District;
  onClick: () => void;
}

export function DistrictCard({ district, onClick }: DistrictCardProps) {
  return (
    <div 
      className="hover:shadow-md transition-shadow cursor-pointer h-full border rounded-lg p-4 flex flex-col bg-white"
      onClick={onClick}
    >
      <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 w-fit mb-3">
        <Globe className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-lg truncate">{district.name}</h3>
          <Badge variant={district.status === "active" ? "default" : "destructive"}>
            {district.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">Code:</span> {district.code}
        </p>
        <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{district.region}</span>
        </p>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
            <School className="h-4 w-4 text-gray-500 mb-1" />
            <span>{district.schoolsCount}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
            <Users className="h-4 w-4 text-gray-500 mb-1" />
            <span>{district.studentsCount}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
            <Users className="h-4 w-4 text-gray-500 mb-1" />
            <span>{district.staffCount}</span>
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-3 pt-2 border-t">
        <div className="flex justify-between">
          <span>Est: {new Date(district.establishedDate).toLocaleDateString()}</span>
          <span>Updated: {new Date(district.lastUpdated).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}