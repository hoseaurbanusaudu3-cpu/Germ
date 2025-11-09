import { useRef } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";

interface UncontrolledClassFormProps {
  onClose: () => void;
  onSuccess: () => void;
  teachers: any[];
}

export function UncontrolledClassForm({ onClose, onSuccess, teachers }: UncontrolledClassFormProps) {
  // Use refs instead of state - completely uncontrolled
  const nameRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLInputElement>(null);
  const capacityRef = useRef<HTMLInputElement>(null);
  const schoolLevelRef = useRef<string>("");
  const teacherIdRef = useRef<string>("");
  const statusRef = useRef<string>("Active");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = nameRef.current?.value || "";
    const section = sectionRef.current?.value || "";
    const capacity = capacityRef.current?.value || "";
    const schoolLevel = schoolLevelRef.current;
    const teacherId = teacherIdRef.current;

    if (!name || !capacity || !schoolLevel || !teacherId) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // TODO: Add API call here
      console.log({ name, section, capacity, schoolLevel, teacherId, status: statusRef.current });
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
          <Select 
            defaultValue="" 
            onValueChange={(value: string) => { schoolLevelRef.current = value; }}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Primary">Primary</SelectItem>
              <SelectItem value="Secondary">Secondary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Class Name - UNCONTROLLED */}
        <div className="space-y-2">
          <Label>Class Name *</Label>
          <input
            ref={nameRef}
            type="text"
            placeholder="e.g., JSS 1A, SS 2B"
            className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Section - UNCONTROLLED */}
        <div className="space-y-2">
          <Label>Section (Optional)</Label>
          <input
            ref={sectionRef}
            type="text"
            placeholder="e.g., A, B, C"
            className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Capacity - UNCONTROLLED */}
        <div className="space-y-2">
          <Label>Class Capacity *</Label>
          <input
            ref={capacityRef}
            type="number"
            placeholder="e.g., 35"
            className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Class Teacher */}
        <div className="space-y-2">
          <Label>Class Teacher *</Label>
          <Select 
            defaultValue="" 
            onValueChange={(value: string) => { teacherIdRef.current = value; }}
          >
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
          <Select 
            defaultValue="Active" 
            onValueChange={(value: string) => { statusRef.current = value; }}
          >
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
