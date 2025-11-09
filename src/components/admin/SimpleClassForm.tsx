import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";

interface SimpleClassFormProps {
  onClose: () => void;
  onSuccess: () => void;
  teachers: any[];
}

export function SimpleClassForm({ onClose, onSuccess, teachers }: SimpleClassFormProps) {
  // Separate state for each field - no complex objects
  const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const [capacity, setCapacity] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [status, setStatus] = useState("Active");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !capacity || !schoolLevel || !teacherId) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // TODO: Add API call here
      toast.success("Class created successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to create class");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid md:grid-cols-2 gap-4">
        {/* School Level */}
        <div className="space-y-2">
          <Label>School Level *</Label>
          <Select value={schoolLevel} onValueChange={setSchoolLevel}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Primary">Primary</SelectItem>
              <SelectItem value="Secondary">Secondary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Class Name */}
        <div className="space-y-2">
          <Label>Class Name *</Label>
          <Input
            placeholder="e.g., JSS 1A, SS 2B"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Section */}
        <div className="space-y-2">
          <Label>Section (Optional)</Label>
          <Input
            placeholder="e.g., A, B, C"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="h-12"
          />
        </div>

        {/* Capacity */}
        <div className="space-y-2">
          <Label>Class Capacity *</Label>
          <Input
            type="number"
            placeholder="e.g., 35"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="h-12"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Class Teacher */}
        <div className="space-y-2">
          <Label>Class Teacher *</Label>
          <Select value={teacherId} onValueChange={setTeacherId}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id.toString()}>
                  {teacher.firstName} {teacher.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Create Class
        </Button>
      </div>
    </form>
  );
}
