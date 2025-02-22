'use client';

import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function AllClassFiltersPopUp() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col relative">
      <div className="flex items-center gap-4">
        <span className="text-gray-600">All Classes</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <X className="h-4 w-4" />
          ) : (
            <Filter className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {open && (
        <div className="absolute top-12 right-0 z-50 w-64 bg-white rounded-lg shadow-lg border p-4">
          <h2 className="font-semibold text-gray-900 pb-3 border-b">Filter by</h2>
          
          <div className="flex flex-col gap-3 mt-3">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="c1">Class 5N</SelectItem>
                <SelectItem value="c2">Class 5M</SelectItem>
                <SelectItem value="c3">Class 6A</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="s1">Science</SelectItem>
                <SelectItem value="s2">Mathematics</SelectItem>
                <SelectItem value="s3">English</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="g1">Grade 5</SelectItem>
                <SelectItem value="g2">Grade 6</SelectItem>
                <SelectItem value="g3">Grade 7</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button>Apply</Button>
          </div>
        </div>
      )}
    </div>
  );
}