import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import { useSchool, Subject } from "../../contexts/SchoolContext";
import { subjectsAPI } from "../../services/api";

interface CreateSubjectPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function CreateSubjectPage({ onBack, onSuccess }: CreateSubjectPageProps) {
  const { addSubject } = useSchool();
  
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("");
  const [department, setDepartment] = useState("");
  const [isCoreSubject, setIsCoreSubject] = useState(false);
  const [status, setStatus] = useState("Active");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !code || !schoolLevel) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const subjectData = {
        name,
        code,
        department: department || "General",
        isCore: isCoreSubject,
        status: status as "Active" | "Inactive"
      };

      const response = await subjectsAPI.create(subjectData);
      
      if (response.success) {
        const newSubject: Subject = {
          id: response.data.id,
          name: response.data.name,
          code: response.data.code,
          department: response.data.department,
          isCore: response.data.isCore,
          status: response.data.status
        };
        
        addSubject(newSubject);
        toast.success("Subject created successfully!");
        
        // Reset form
        setName("");
        setCode("");
        setSchoolLevel("");
        setDepartment("");
        setIsCoreSubject(false);
        setStatus("Active");
        
        onSuccess();
      } else {
        toast.error(response.message || "Failed to create subject");
      }
    } catch (error: any) {
      console.error("Error creating subject:", error);
      toast.error(error.response?.data?.message || "Failed to create subject");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="rounded-lg">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Subjects
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">Create New Subject</h1>
          <p className="text-[#6B7280] mt-1">Add a new subject to the curriculum</p>
        </div>
      </div>

      <Card className="max-w-4xl rounded-lg bg-white border border-[#E5E7EB]">
        <CardHeader className="border-b border-[#E5E7EB] p-6">
          <h2 className="text-xl font-semibold text-[#1F2937]">Subject Information</h2>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[#1F2937] font-medium">Subject Name *</Label>
                <Input
                  placeholder="e.g., Mathematics, English Language"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 rounded-lg border-[#E5E7EB]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#1F2937] font-medium">Subject Code *</Label>
                <Input
                  placeholder="e.g., MATH101, ENG101"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-12 rounded-lg border-[#E5E7EB]"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[#1F2937] font-medium">School Level *</Label>
                <Select value={schoolLevel} onValueChange={setSchoolLevel}>
                  <SelectTrigger className="h-12 rounded-lg border-[#E5E7EB]">
                    <SelectValue placeholder="Select school level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Primary">Primary</SelectItem>
                    <SelectItem value="Secondary">Secondary</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[#1F2937] font-medium">Department (Optional)</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="h-12 rounded-lg border-[#E5E7EB]">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sciences">Sciences</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[#1F2937] font-medium">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-12 rounded-lg border-[#E5E7EB]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[#1F2937] font-medium">Subject Type</Label>
                <div className="flex items-center space-x-2 h-12">
                  <Checkbox
                    id="coreSubject"
                    checked={isCoreSubject}
                    onCheckedChange={(checked) => setIsCoreSubject(checked as boolean)}
                  />
                  <label
                    htmlFor="coreSubject"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Core Subject (Compulsory for all students)
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
              <Button type="button" variant="outline" onClick={onBack} className="rounded-lg">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg">
                <Save className="w-4 h-4 mr-2" />
                Create Subject
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-4xl rounded-lg bg-blue-50 border border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for Creating Subjects</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use clear, standard subject names</li>
            <li>• Subject codes should be unique and easy to remember</li>
            <li>• Core subjects are compulsory for all students in that level</li>
            <li>• You can assign teachers to subjects later</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
