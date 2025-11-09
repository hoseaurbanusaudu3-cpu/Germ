import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";

interface SimpleSubjectFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function SimpleSubjectForm({ onClose, onSuccess }: SimpleSubjectFormProps) {
  // Separate state for each field
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [level, setLevel] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("Active");
  const [isCore, setIsCore] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !code || !level || !department) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // TODO: Add API call here
      toast.success("Subject created successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to create subject");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Subject Name */}
        <div className="space-y-2">
          <Label className="text-white">Subject Name *</Label>
          <Input
            placeholder="e.g., Mathematics, English"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 rounded-xl border border-white/10 bg-[#0F243E] text-white"
          />
        </div>

        {/* Subject Code */}
        <div className="space-y-2">
          <Label className="text-white">Subject Code *</Label>
          <Input
            placeholder="e.g., MTH101"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="h-12 rounded-xl border border-white/10 bg-[#0F243E] text-white"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* School Level */}
        <div className="space-y-2">
          <Label className="text-white">School Level *</Label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="h-12 rounded-xl border border-white/10 bg-[#0F243E] text-white">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent className="bg-[#0F243E] border-white/10">
              <SelectItem value="Primary" className="text-white">Primary</SelectItem>
              <SelectItem value="Secondary" className="text-white">Secondary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Department */}
        <div className="space-y-2">
          <Label className="text-white">Department *</Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="h-12 rounded-xl border border-white/10 bg-[#0F243E] text-white">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent className="bg-[#0F243E] border-white/10">
              <SelectItem value="Sciences" className="text-white">Sciences</SelectItem>
              <SelectItem value="Languages" className="text-white">Languages</SelectItem>
              <SelectItem value="Social Sciences" className="text-white">Social Sciences</SelectItem>
              <SelectItem value="Mathematics" className="text-white">Mathematics</SelectItem>
              <SelectItem value="Arts" className="text-white">Arts</SelectItem>
              <SelectItem value="Vocational" className="text-white">Vocational</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Status */}
        <div className="space-y-2">
          <Label className="text-white">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-12 rounded-xl border border-white/10 bg-[#0F243E] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0F243E] border-white/10">
              <SelectItem value="Active" className="text-white">Active</SelectItem>
              <SelectItem value="Inactive" className="text-white">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Core Subject Checkbox */}
        <div className="flex items-center space-x-3 p-4 bg-[#0F243E] rounded-xl border border-white/10 h-12">
          <Checkbox
            id="isCore"
            checked={isCore}
            onCheckedChange={(checked: boolean) => setIsCore(checked)}
            className="border-white/20"
          />
          <Label htmlFor="isCore" className="text-white cursor-pointer text-sm">
            Mark as Core Subject
          </Label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          className="border-white/20 text-white hover:bg-white/10"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-[#1E90FF] hover:bg-[#1E90FF]/90">
          Create Subject
        </Button>
      </div>
    </form>
  );
}
