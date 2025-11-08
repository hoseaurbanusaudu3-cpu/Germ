import { useState, useEffect } from "react";
import { Search, Link as LinkIcon, Unlink, Users, UserCheck, Upload, CheckCircle, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { studentsAPI, usersAPI } from "../../services/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

export function LinkStudentParentPage() {
  const [studentSearch, setStudentSearch] = useState("");
  const [parentSearch, setParentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedParent, setSelectedParent] = useState<any>(null);
  const [notifyParent, setNotifyParent] = useState(true);
  const [showUnlinkDialog, setShowUnlinkDialog] = useState(false);
  const [unlinkChild, setUnlinkChild] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsRes, usersRes] = await Promise.all([
        studentsAPI.getAll(),
        usersAPI.getAll()
      ]);

      if (studentsRes.success) {
        setStudents(studentsRes.data);
      }

      if (usersRes.success) {
        const parentUsers = usersRes.data.filter((u: any) => u.role === 'parent');
        setParents(parentUsers);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.full_name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.reg_no?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.Class?.name?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredParents = parents.filter(p => 
    p.name?.toLowerCase().includes(parentSearch.toLowerCase()) ||
    p.email?.toLowerCase().includes(parentSearch.toLowerCase()) ||
    p.phone?.includes(parentSearch)
  );

  const handleLinkStudentParent = () => {
    if (!selectedStudent || !selectedParent) {
      toast.error("Please select both a student and a parent");
      return;
    }

    const notifyMsg = notifyParent ? " — Parent notified" : "";
    toast.success(`${selectedStudent.name} linked to ${selectedParent.name}${notifyMsg}`);
    
    setSelectedStudent(null);
    setSelectedParent(null);
  };

  const handleUnlinkChild = (child: any) => {
    setUnlinkChild(child);
    setShowUnlinkDialog(true);
  };

  const confirmUnlink = () => {
    toast.success(`${unlinkChild.name} unlinked successfully`);
    setShowUnlinkDialog(false);
    setUnlinkChild(null);
  };

  const handleBulkImport = () => {
    toast.info("Bulk CSV import functionality");
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-white mb-2">Link Student to Parent</h1>
        <p className="text-[#C0C8D3]">Connect students with their parents/guardians for portal access</p>
      </div>

      {/* Bulk Import Option */}
      <Card className="rounded-xl bg-[#132C4A] border border-[#1E90FF] shadow-lg">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#1E90FF]/20 flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#1E90FF]" />
              </div>
              <div>
                <h3 className="text-white mb-1">Bulk Link (CSV Import)</h3>
                <p className="text-sm text-[#C0C8D3]">Upload CSV with format: admission_no, parent_phone_or_email</p>
              </div>
            </div>
            <Button 
              onClick={handleBulkImport}
              className="bg-[#1E90FF] hover:bg-[#00BFFF] text-white rounded-xl shadow-md"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Linking Interface */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Student Selection */}
        <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
          <CardHeader className="p-5 bg-gradient-to-r from-[#1E90FF] to-[#00BFFF] rounded-t-xl">
            <h3 className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Select Student
            </h3>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#C0C8D3]" />
              <Input
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search by name, admission no, or class..."
                className="h-12 pl-10 rounded-xl border border-white/10 bg-[#0F243E] text-white"
              />
            </div>

            {/* Selected Student */}
            {selectedStudent && (
              <div className="p-4 bg-[#28A745]/10 border border-[#28A745] rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-[#28A745]">
                      <AvatarFallback className="bg-[#28A745] text-white">
                        {selectedStudent.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white">{selectedStudent.name}</p>
                      <p className="text-sm text-[#C0C8D3]">{selectedStudent.admissionNo}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setSelectedStudent(null)}
                    size="sm"
                    className="h-8 w-8 p-0 bg-[#DC3545] hover:bg-[#DC3545]/90 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#1E90FF] text-white border-0">{selectedStudent.class}</Badge>
                  {selectedStudent.hasParent && (
                    <Badge className="bg-[#FFC107] text-white border-0">Already Linked</Badge>
                  )}
                </div>
              </div>
            )}

            {/* Student List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`w-full p-3 rounded-xl transition-all text-left ${
                    selectedStudent?.id === student.id
                      ? 'bg-[#28A745]/20 border-2 border-[#28A745]'
                      : 'bg-[#0F243E] border border-white/10 hover:border-[#1E90FF] hover:bg-[#132C4A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-[#1E90FF] text-white text-sm">
                        {student.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-white">{student.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-[#C0C8D3]">{student.admissionNo}</p>
                        <span className="text-[#C0C8D3]">•</span>
                        <p className="text-xs text-[#C0C8D3]">{student.class}</p>
                      </div>
                    </div>
                    {student.hasParent && (
                      <CheckCircle className="w-4 h-4 text-[#28A745]" />
                    )}
                  </div>
                </button>
              ))}

              {filteredStudents.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-[#C0C8D3]">No students found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Parent Selection */}
        <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
          <CardHeader className="p-5 bg-gradient-to-r from-[#28A745] to-[#28A745]/80 rounded-t-xl">
            <h3 className="text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Select Parent
            </h3>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#C0C8D3]" />
              <Input
                value={parentSearch}
                onChange={(e) => setParentSearch(e.target.value)}
                placeholder="Search by name, phone, or email..."
                className="h-12 pl-10 rounded-xl border border-white/10 bg-[#0F243E] text-white"
              />
            </div>

            {/* Selected Parent */}
            {selectedParent && (
              <div className="p-4 bg-[#28A745]/10 border border-[#28A745] rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-[#28A745]">
                      <AvatarFallback className="bg-[#28A745] text-white">
                        {selectedParent.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white">{selectedParent.name}</p>
                      <p className="text-sm text-[#C0C8D3]">{selectedParent.phone}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setSelectedParent(null)}
                    size="sm"
                    className="h-8 w-8 p-0 bg-[#DC3545] hover:bg-[#DC3545]/90 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-[#C0C8D3]">{selectedParent.email}</p>
                <div className="mt-2">
                  <Badge className="bg-[#1E90FF] text-white border-0">
                    {selectedParent.linkedChildren.length} child(ren) linked
                  </Badge>
                </div>
              </div>
            )}

            {/* Parent List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredParents.map((parent) => (
                <div key={parent.id}>
                  <button
                    onClick={() => setSelectedParent(parent)}
                    className={`w-full p-3 rounded-xl transition-all text-left ${
                      selectedParent?.id === parent.id
                        ? 'bg-[#28A745]/20 border-2 border-[#28A745]'
                        : 'bg-[#0F243E] border border-white/10 hover:border-[#28A745] hover:bg-[#132C4A]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-[#28A745] text-white text-sm">
                          {parent.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-white">{parent.name}</p>
                        <p className="text-xs text-[#C0C8D3] mt-1">{parent.phone}</p>
                      </div>
                      <Badge className="bg-[#1E90FF] text-white border-0 text-xs">
                        {parent.linkedChildren.length}
                      </Badge>
                    </div>
                  </button>

                  {/* Linked Children (when parent is selected) */}
                  {selectedParent?.id === parent.id && parent.linkedChildren.length > 0 && (
                    <div className="ml-4 mt-2 space-y-2">
                      <p className="text-xs text-[#C0C8D3]">Currently linked children:</p>
                      {parent.linkedChildren.map((child, idx) => (
                        <div 
                          key={idx}
                          className="p-2 bg-[#0F243E] rounded-lg border border-white/5 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-white text-sm">{child.name}</p>
                            <p className="text-xs text-[#C0C8D3]">{child.class} • Linked {child.linkDate}</p>
                          </div>
                          <Button
                            onClick={() => handleUnlinkChild(child)}
                            size="sm"
                            className="h-7 px-3 bg-[#DC3545] hover:bg-[#DC3545]/90 rounded-lg text-xs"
                          >
                            <Unlink className="w-3 h-3 mr-1" />
                            Unlink
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {filteredParents.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-[#C0C8D3]">No parents found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Link Action */}
      <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1E90FF]/20 flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-[#1E90FF]" />
                </div>
                <div>
                  <Label className="text-white">Notify Parent of Link</Label>
                  <p className="text-sm text-[#C0C8D3]">Send in-app notification and optional email/SMS</p>
                </div>
              </div>
              <Switch 
                checked={notifyParent} 
                onCheckedChange={setNotifyParent}
              />
            </div>

            <Button
              onClick={handleLinkStudentParent}
              disabled={!selectedStudent || !selectedParent}
              className="h-12 px-8 bg-[#28A745] hover:bg-[#28A745]/90 text-white rounded-xl shadow-md hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              <LinkIcon className="w-5 h-5 mr-2" />
              Link Selected
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Unlink Confirmation Dialog */}
      <AlertDialog open={showUnlinkDialog} onOpenChange={setShowUnlinkDialog}>
        <AlertDialogContent className="bg-[#132C4A] border border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Unlink Child?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#C0C8D3]">
              Are you sure you want to unlink {unlinkChild?.name}? The parent will lose access to this child's information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#0F243E] text-white border-white/10 hover:bg-[#132C4A]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmUnlink}
              className="bg-[#DC3545] hover:bg-[#DC3545]/90"
            >
              Unlink
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
