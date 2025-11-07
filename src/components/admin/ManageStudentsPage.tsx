import { useState } from "react";
import { Search, Edit, Trash2, Eye, UserPlus, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { toast } from "sonner@2.0.3";

interface ManageStudentsPageProps {
  onNavigateToLink?: () => void;
}

export function ManageStudentsPage({ onNavigateToLink }: ManageStudentsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");

  const students = [
    { id: 1, name: "Aisha Mohammed", class: "JSS 2A", admissionNo: "GRA/2024/001", parent: "Mr. Mohammed Ali", status: "Active" },
    { id: 2, name: "Ibrahim Yusuf", class: "SS 1B", admissionNo: "GRA/2024/002", parent: "Dr. Yusuf Ibrahim", status: "Active" },
    { id: 3, name: "Fatima Abubakar", class: "Primary 5", admissionNo: "GRA/2024/003", parent: "Mr. Abubakar Ibrahim", status: "Active" },
    { id: 4, name: "Musa Hassan", class: "JSS 3A", admissionNo: "GRA/2024/004", parent: "Mrs. Hassan Zainab", status: "Active" },
    { id: 5, name: "Zainab Aliyu", class: "SS 2A", admissionNo: "GRA/2024/005", parent: "Alhaji Aliyu Musa", status: "Active" },
  ];

  const handleEdit = (studentId: number) => {
    toast.info(`Editing student ID: ${studentId}`);
  };

  const handleDelete = (studentId: number) => {
    toast.error(`Student ID: ${studentId} removed`);
  };

  const handleView = (studentId: number) => {
    toast.info(`Viewing details for student ID: ${studentId}`);
  };

  const handleLinkToParent = () => {
    if (onNavigateToLink) {
      onNavigateToLink();
    } else {
      toast.info("Navigating to Link Student-Parent page");
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-white mb-2">Manage Students</h1>
        <p className="text-[#C0C8D3]">View, edit, and manage all registered students</p>
      </div>

      <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
        <CardHeader className="p-5 border-b border-white/10">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#C0C8D3]" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or admission number..."
                className="h-12 pl-10 rounded-xl border border-white/10 bg-[#0F243E] text-white"
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="h-12 w-full md:w-40 rounded-xl border border-white/10 bg-[#0F243E] text-white">
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F243E] border-white/10">
                  <SelectItem value="all" className="text-white hover:bg-[#1E90FF]">All Classes</SelectItem>
                  <SelectItem value="Primary" className="text-white hover:bg-[#1E90FF]">Primary</SelectItem>
                  <SelectItem value="JSS" className="text-white hover:bg-[#1E90FF]">JSS</SelectItem>
                  <SelectItem value="SS" className="text-white hover:bg-[#1E90FF]">SS</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                onClick={handleLinkToParent}
                className="h-12 bg-[#28A745] hover:bg-[#28A745]/90 text-white rounded-xl shadow-md hover:scale-105 transition-all whitespace-nowrap"
              >
                <LinkIcon className="w-5 h-5 mr-2" />
                Link to Parent
              </Button>

              <Button className="h-12 bg-[#1E90FF] hover:bg-[#00BFFF] text-white rounded-xl shadow-md hover:scale-105 transition-all whitespace-nowrap">
                <UserPlus className="w-5 h-5 mr-2" />
                Add New
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-[#1E90FF] to-[#00BFFF] border-none hover:bg-gradient-to-r">
                  <TableHead className="text-white">Admission No.</TableHead>
                  <TableHead className="text-white">Student Name</TableHead>
                  <TableHead className="text-white">Class</TableHead>
                  <TableHead className="text-white">Parent/Guardian</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id} className="bg-[#0F243E] border-b border-white/5 hover:bg-[#132C4A]">
                    <TableCell className="text-[#C0C8D3]">{student.admissionNo}</TableCell>
                    <TableCell className="text-white">{student.name}</TableCell>
                    <TableCell className="text-[#C0C8D3]">{student.class}</TableCell>
                    <TableCell className="text-[#C0C8D3]">{student.parent}</TableCell>
                    <TableCell>
                      <Badge className="bg-[#28A745] text-white border-0">
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          onClick={() => handleView(student.id)}
                          size="sm"
                          className="h-8 w-8 p-0 bg-[#1E90FF] hover:bg-[#00BFFF] rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={handleLinkToParent}
                          size="sm"
                          className="h-8 w-8 p-0 bg-[#28A745] hover:bg-[#28A745]/90 rounded-lg"
                          title="Link to Parent"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleEdit(student.id)}
                          size="sm"
                          className="h-8 w-8 p-0 bg-[#FFC107] hover:bg-[#FFC107]/90 rounded-lg"
                          title="Edit Student"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(student.id)}
                          size="sm"
                          className="h-8 w-8 p-0 bg-[#DC3545] hover:bg-[#DC3545]/90 rounded-lg"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
          <CardContent className="p-4">
            <p className="text-[#C0C8D3] mb-1">Total Students</p>
            <p className="text-white">1,245</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
          <CardContent className="p-4">
            <p className="text-[#C0C8D3] mb-1">Active</p>
            <p className="text-[#28A745]">1,198</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
          <CardContent className="p-4">
            <p className="text-[#C0C8D3] mb-1">New This Term</p>
            <p className="text-[#1E90FF]">156</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
          <CardContent className="p-4">
            <p className="text-[#C0C8D3] mb-1">Inactive</p>
            <p className="text-[#DC3545]">47</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
