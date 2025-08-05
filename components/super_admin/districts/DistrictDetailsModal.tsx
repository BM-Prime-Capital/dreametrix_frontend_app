import { District } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { School, Users, Edit } from "lucide-react";

interface DistrictDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  district: District;
  onEdit: () => void;
}

export function DistrictDetailsModal({
  isOpen,
  onClose,
  district,
  onEdit,
}: DistrictDetailsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={district.name}
      description={`District Code: ${district.code}`}
      size="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Basic Information</h3>
            <div>
              <p className="text-sm text-gray-500">Region</p>
              <p>{district.region}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Superintendent</p>
              <p>{district.superintendent}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge variant={district.status === "active" ? "default" : "destructive"}>
                {district.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <School className="h-6 w-6 text-gray-500 mb-1" />
                <span className="font-medium">{district.schoolsCount}</span>
                <span className="text-xs text-gray-500">Schools</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <Users className="h-6 w-6 text-gray-500 mb-1" />
                <span className="font-medium">{district.studentsCount}</span>
                <span className="text-xs text-gray-500">Students</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <Users className="h-6 w-6 text-gray-500 mb-1" />
                <span className="font-medium">{district.staffCount}</span>
                <span className="text-xs text-gray-500">Staff</span>
              </div>
            </div>
          </div>
        </div>

        {district.description && (
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{district.description}</p>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit District
          </Button>
        </div>
      </div>
    </Modal>
  );
}