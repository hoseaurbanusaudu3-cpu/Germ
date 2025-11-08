import { useState, useEffect } from "react";
import { Search, Edit, Trash2, Eye, UserPlus, Link as LinkIcon, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { studentsAPI, classesAPI } from "../../services/api";

interface ManageStudentsPageProps {
  onNavigateToLink?: () => void;
}

export function ManageStudentsPage({ onNavigateToLink }: ManageStudentsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    loadStudents();
    loadClasses();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await studentsAPI.getAll();
      if (response.success) {
        setStudents(response.data);
      }
    } catch (error: any) {
      console.error('Error loading students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    try {
      const response = await classesAPI.getAll();
      if (response.success) {
        setClasses(response.data);
      }
    } catch (error: any) {
      console.error('Error loading classes:', error);
    }
  };

  const handleView = (student: any) => {
    setSelectedStudent(student);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (student: any) => {
    toast.info(`Edit functionality coming soon for ${student.full_name}`);
  };

  const handleDelete = async (studentId: number, studentName: string) => {
    if (!confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await studentsAPI.delete(studentId);
      if (response.success) {
        toast.success('Student deleted successfully');
        loadStudents();
      }
    } catch (error: any) {
      console.error('Error deleting student:', error);
      toast.error(error.response?.data?.message || 'Failed to delete student');
    }
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#1E90FF]" />
                      <p className="text-[#C0C8D3] mt-2">Loading students...</p>
                    </TableCell>
                  </TableRow>
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-[#C0C8D3]">No students found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  students
                    .filter(student => {
                      const matchesSearch = student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                          student.reg_no?.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchesClass = !filterClass || filterClass === 'all' || student.Class?.name?.includes(filterClass);
                      return matchesSearch && matchesClass;
                    })
                    .map((student) => (
                      <TableRow key={student.id} className="bg-[#0F243E] border-b border-white/5 hover:bg-[#132C4A]">
                        <TableCell className="text-[#C0C8D3]">{student.reg_no || 'N/A'}</TableCell>
                        <TableCell className="text-white">{student.full_name}</TableCell>
                        <TableCell className="text-[#C0C8D3]">{student.Class?.name || 'N/A'}</TableCell>
                        <TableCell className="text-[#C0C8D3]">Not linked</TableCell>
                        <TableCell>
                          <Badge className={student.status === 'active' ? "bg-[#28A745] text-white border-0" : "bg-[#DC3545] text-white border-0"}>
                            {student.status || 'active'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              onClick={() => handleView(student)}
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
                              onClick={() => handleEdit(student)}
                              size="sm"
                              className="h-8 w-8 p-0 bg-[#FFC107] hover:bg-[#FFC107]/90 rounded-lg"
                              title="Edit Student"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDelete(student.id, student.full_name)}
                              size="sm"
                              className="h-8 w-8 p-0 bg-[#DC3545] hover:bg-[#DC3545]/90 rounded-lg"
                              title="Delete Student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                )}
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
            <p className="text-white text-2xl font-bold">{students.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
          <CardContent className="p-4">
            <p className="text-[#C0C8D3] mb-1">Active</p>
            <p className="text-[#28A745] text-2xl font-bold">
              {students.filter(s => s.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
          <CardContent className="p-4">
            <p className="text-[#C0C8D3] mb-1">Classes</p>
            <p className="text-[#1E90FF] text-2xl font-bold">{classes.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
          <CardContent className="p-4">
            <p className="text-[#C0C8D3] mb-1">Inactive</p>
            <p className="text-[#DC3545] text-2xl font-bold">
              {students.filter(s => s.status === 'inactive').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* View Student Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-[#132C4A] text-white border-white/10">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div>
                <Label className="text-[#C0C8D3]">Full Name</Label>
                <p className="text-white font-medium">{selectedStudent.full_name}</p>
              </div>
              <div>
                <Label className="text-[#C0C8D3]">Registration Number</Label>
                <p className="text-white">{selectedStudent.reg_no || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-[#C0C8D3]">Class</Label>
                <p className="text-white">{selectedStudent.Class?.name || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-[#C0C8D3]">Gender</Label>
                <p className="text-white">{selectedStudent.gender || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-[#C0C8D3]">Date of Birth</Label>
                <p className="text-white">
                  {selectedStudent.dob ? new Date(selectedStudent.dob).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <Label className="text-[#C0C8D3]">Status</Label>
                <Badge className={selectedStudent.status === 'active' ? "bg-[#28A745]" : "bg-[#DC3545]"}>
                  {selectedStudent.status || 'active'}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
