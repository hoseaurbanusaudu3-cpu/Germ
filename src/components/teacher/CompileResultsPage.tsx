import { useState, useMemo } from "react";
import {
  FileText,
  Send,
  Eye,
  Download,
  AlertCircle,
  CheckCircle,
  Edit,
  Lock,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useSchool } from "../../contexts/SchoolContext";
import { toast } from "sonner@2.0.3";

export function CompileResultsPage() {
  const {
    currentUser,
    teachers,
    students,
    classes,
    scores,
    affectiveDomains,
    psychomotorDomains,
    compiledResults,
    addCompiledResult,
    updateCompiledResult,
    currentTerm,
    currentAcademicYear,
    subjectAssignments,
    createNotification
  } = useSchool();

  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [classTeacherComments, setClassTeacherComments] = useState<Record<number, string>>({});
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [currentCommentStudentId, setCurrentCommentStudentId] = useState<number | null>(null);

  // Get current teacher
  const currentTeacher = currentUser ? teachers.find(t => t.id === currentUser.linkedId) : null;
  const isClassTeacher = currentTeacher?.isClassTeacher || false;

  // Get classes where this teacher is class teacher
  const classTeacherClasses = useMemo(() => {
    if (!currentTeacher) return [];
    return classes.filter(c => c.classTeacherId === currentTeacher.id && c.status === 'Active');
  }, [currentTeacher, classes]);

  // Get students in selected class
  const classStudents = useMemo(() => {
    if (!selectedClassId) return [];
    return students
      .filter(s => s.classId === Number(selectedClassId) && s.status === 'Active')
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [selectedClassId, students]);

  // Get all subject assignments for the class
  const classSubjects = useMemo(() => {
    if (!selectedClassId) return [];
    return subjectAssignments.filter(
      sa => sa.classId === Number(selectedClassId) &&
            sa.term === currentTerm &&
            sa.academicYear === currentAcademicYear
    );
  }, [selectedClassId, subjectAssignments, currentTerm, currentAcademicYear]);

  // Calculate student results
  const studentResults = useMemo(() => {
    return classStudents.map(student => {
      // Get all scores for this student
      const studentScores = scores.filter(s => 
        s.studentId === student.id &&
        classSubjects.some(cs => cs.id === s.subjectAssignmentId)
      );

      // Get affective and psychomotor
      const affective = affectiveDomains.find(a => 
        a.studentId === student.id &&
        a.classId === Number(selectedClassId) &&
        a.term === currentTerm &&
        a.academicYear === currentAcademicYear
      );

      const psychomotor = psychomotorDomains.find(p => 
        p.studentId === student.id &&
        p.classId === Number(selectedClassId) &&
        p.term === currentTerm &&
        p.academicYear === currentAcademicYear
      );

      // Calculate totals
      const totalScore = studentScores.reduce((sum, s) => sum + s.total, 0);
      const averageScore = studentScores.length > 0 
        ? Math.round((totalScore / studentScores.length) * 100) / 100 
        : 0;

      // Get or generate comment
      const existingResult = compiledResults.find(r =>
        r.studentId === student.id &&
        r.classId === Number(selectedClassId) &&
        r.term === currentTerm &&
        r.academicYear === currentAcademicYear
      );

      let autoComment = '';
      if (averageScore >= 70) {
        autoComment = 'Excellent performance! Keep up the outstanding work.';
      } else if (averageScore >= 60) {
        autoComment = 'Very good performance. Continue to work hard.';
      } else if (averageScore >= 50) {
        autoComment = 'Good effort. There is room for improvement.';
      } else if (averageScore >= 40) {
        autoComment = 'Fair performance. More effort is needed.';
      } else if (averageScore > 0) {
        autoComment = 'Needs serious improvement. Please put in more effort.';
      }

      const classTeacherComment = classTeacherComments[student.id] || 
                                   existingResult?.classTeacherComment || 
                                   autoComment;

      // Check if complete
      const isComplete = studentScores.length === classSubjects.length &&
                        affective !== undefined &&
                        psychomotor !== undefined &&
                        classTeacherComment.trim() !== '';

      return {
        student,
        scores: studentScores,
        affective,
        psychomotor,
        totalScore,
        averageScore,
        subjectsCompleted: studentScores.filter(s => s.status === 'Submitted').length,
        totalSubjects: classSubjects.length,
        classTeacherComment,
        autoComment,
        isComplete,
        existingResult
      };
    });
  }, [classStudents, scores, classSubjects, affectiveDomains, psychomotorDomains, classTeacherComments, compiledResults, selectedClassId, currentTerm, currentAcademicYear]);

  // Calculate positions
  const rankedStudents = useMemo(() => {
    const withScores = studentResults.filter(r => r.averageScore > 0);
    const sorted = [...withScores].sort((a, b) => b.averageScore - a.averageScore);
    
    return sorted.map((result, index) => ({
      ...result,
      position: index + 1
    }));
  }, [studentResults]);

  // Handle comment change
  const handleCommentChange = (studentId: number, comment: string) => {
    setClassTeacherComments(prev => ({
      ...prev,
      [studentId]: comment
    }));
  };

  // Open comment modal
  const openCommentModal = (studentId: number, currentComment: string) => {
    setCurrentCommentStudentId(studentId);
    setClassTeacherComments(prev => ({
      ...prev,
      [studentId]: currentComment
    }));
    setShowCommentModal(true);
  };

  // Submit results to Admin
  const handleSubmitResults = () => {
    if (!selectedClassId || !currentTeacher) {
      toast.error("Please select a class");
      return;
    }

    // Check if all students have complete data
    const incompleteStudents = rankedStudents.filter(r => !r.isComplete);
    if (incompleteStudents.length > 0) {
      toast.error(`${incompleteStudents.length} student(s) have incomplete data. Please ensure all scores, affective/psychomotor assessments, and comments are entered.`);
      return;
    }

    // Calculate class average
    const classAverage = rankedStudents.reduce((sum, r) => sum + r.averageScore, 0) / rankedStudents.length;

    let submittedCount = 0;

    rankedStudents.forEach((result) => {
      const compiledData = {
        studentId: result.student.id,
        classId: Number(selectedClassId),
        term: currentTerm,
        academicYear: currentAcademicYear,
        scores: result.scores,
        affective: result.affective || null,
        psychomotor: result.psychomotor || null,
        totalScore: result.totalScore,
        averageScore: result.averageScore,
        classAverage: Math.round(classAverage * 100) / 100,
        position: result.position,
        totalStudents: rankedStudents.length,
        timesPresent: 0, // To be implemented
        timesAbsent: 0,
        totalAttendanceDays: 0,
        termBegin: '',
        termEnd: '',
        nextTermBegin: '',
        classTeacherName: `${currentTeacher.firstName} ${currentTeacher.lastName}`,
        classTeacherComment: result.classTeacherComment,
        principalName: 'Dr. Ibrahim Musa',
        principalComment: '',
        principalSignature: '',
        compiledBy: currentTeacher.id,
        compiledDate: new Date().toISOString(),
        status: 'Submitted' as const,
        approvedBy: null,
        approvedDate: null,
        rejectionReason: null
      };

      if (result.existingResult) {
        updateCompiledResult(result.existingResult.id, compiledData);
      } else {
        addCompiledResult(compiledData);
      }
      submittedCount++;
    });

    // Notify admin
    createNotification({
      title: "Class Results Submitted for Approval",
      message: `${currentTeacher.firstName} ${currentTeacher.lastName} has submitted compiled results for ${classes.find(c => c.id === Number(selectedClassId))?.name} - ${currentTerm} ${currentAcademicYear}`,
      type: "info",
      targetAudience: "all",
      sentBy: currentUser!.id
    });

    toast.success(`Results submitted successfully for ${submittedCount} students`);
  };

  // Export class summary CSV
  const handleExportSummary = () => {
    if (!selectedClassId) {
      toast.error("Please select a class");
      return;
    }

    const className = classes.find(c => c.id === Number(selectedClassId))?.name || 'Class';
    
    let csv = `${className} - ${currentTerm} ${currentAcademicYear}\n\n`;
    csv += `Student Name,Admission Number,Subjects Completed,Total Score,Average,Position,Status\n`;
    
    rankedStudents.forEach((result) => {
      csv += `${result.student.firstName} ${result.student.lastName},`;
      csv += `${result.student.admissionNumber},`;
      csv += `${result.subjectsCompleted}/${result.totalSubjects},`;
      csv += `${result.totalScore},`;
      csv += `${result.averageScore},`;
      csv += `${result.position},`;
      csv += `${result.isComplete ? 'Complete' : 'Incomplete'}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${className}_Summary_${currentTerm}_${currentAcademicYear}.csv`;
    a.click();
    
    toast.success("Summary exported successfully!");
  };

  if (!isClassTeacher) {
    return (
      <Card className="rounded-xl bg-white border border-[#E5E7EB] shadow-clinical">
        <CardContent className="p-12 text-center">
          <Lock className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
          <h3 className="text-[#1F2937] mb-2">Class Teacher Only</h3>
          <p className="text-[#6B7280]">
            This feature is only available to Class Teachers. Please contact the administrator if you believe you should have access.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-[#1F2937] mb-2">Compile Results</h1>
        <p className="text-[#6B7280]">Review and finalize term results for your class</p>
      </div>

      {/* Class Selection */}
      <Card className="rounded-xl bg-white border border-[#E5E7EB] shadow-clinical">
        <CardHeader className="p-6 border-b border-[#E5E7EB]">
          <CardTitle className="text-[#1F2937]">Select Class</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-[#1F2937] mb-2 block">Class</Label>
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger className="rounded-lg border-[#E5E7EB] focus:border-[#2563EB]">
                  <SelectValue placeholder="Select your class" />
                </SelectTrigger>
                <SelectContent>
                  {classTeacherClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedClassId && (
              <div className="flex items-end">
                <Button
                  onClick={handleExportSummary}
                  variant="outline"
                  className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/10 rounded-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Summary
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Class Statistics */}
      {selectedClassId && rankedStudents.length > 0 && (
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white border-0 shadow-clinical">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
              <p className="text-white/80 text-sm mb-1">Total Students</p>
              <h3 className="text-white">{rankedStudents.length}</h3>
            </CardContent>
          </Card>

          <Card className="rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] text-white border-0 shadow-clinical">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
              <p className="text-white/80 text-sm mb-1">Complete</p>
              <h3 className="text-white">
                {rankedStudents.filter(r => r.isComplete).length}
              </h3>
            </CardContent>
          </Card>

          <Card className="rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#F4B400] text-white border-0 shadow-clinical">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>
              <p className="text-white/80 text-sm mb-1">Incomplete</p>
              <h3 className="text-white">
                {rankedStudents.filter(r => !r.isComplete).length}
              </h3>
            </CardContent>
          </Card>

          <Card className="rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-white border-0 shadow-clinical">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <p className="text-white/80 text-sm mb-1">Class Average</p>
              <h3 className="text-white">
                {rankedStudents.length > 0 
                  ? (rankedStudents.reduce((sum, r) => sum + r.averageScore, 0) / rankedStudents.length).toFixed(1)
                  : '0'
                }%
              </h3>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Student Results Table */}
      {selectedClassId && rankedStudents.length > 0 && (
        <Card className="rounded-xl bg-white border border-[#E5E7EB] shadow-clinical">
          <CardHeader className="p-6 border-b border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#1F2937]">Student Results Overview</CardTitle>
              <Button
                onClick={handleSubmitResults}
                className="bg-[#10B981] hover:bg-[#059669] text-white rounded-xl shadow-clinical"
                disabled={rankedStudents.some(r => !r.isComplete)}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit to Admin
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#2563EB] text-white">
                    <th className="text-left p-4">Position</th>
                    <th className="text-left p-4">Student Name</th>
                    <th className="text-center p-4">Subjects</th>
                    <th className="text-center p-4">Total</th>
                    <th className="text-center p-4">Average</th>
                    <th className="text-center p-4">Affective</th>
                    <th className="text-center p-4">Psychomotor</th>
                    <th className="text-center p-4">Comment</th>
                    <th className="text-center p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedStudents.map((result) => (
                    <tr key={result.student.id} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]">
                      <td className="p-4 text-center">
                        <Badge className="bg-[#8B5CF6] text-white rounded-full">
                          {result.position}
                        </Badge>
                      </td>
                      <td className="p-4 text-[#1F2937]">
                        {result.student.firstName} {result.student.lastName}
                      </td>
                      <td className="p-4 text-center text-[#6B7280]">
                        {result.subjectsCompleted}/{result.totalSubjects}
                      </td>
                      <td className="p-4 text-center text-[#1F2937]">
                        {result.totalScore}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`
                          ${result.averageScore >= 70 ? 'text-[#10B981]' : ''}
                          ${result.averageScore >= 50 && result.averageScore < 70 ? 'text-[#F59E0B]' : ''}
                          ${result.averageScore < 50 ? 'text-[#EF4444]' : ''}
                        `}>
                          {result.averageScore}%
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {result.affective ? (
                          <CheckCircle className="w-5 h-5 text-[#10B981] mx-auto" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-[#F59E0B] mx-auto" />
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {result.psychomotor ? (
                          <CheckCircle className="w-5 h-5 text-[#10B981] mx-auto" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-[#F59E0B] mx-auto" />
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <Button
                          onClick={() => openCommentModal(result.student.id, result.classTeacherComment)}
                          variant="outline"
                          size="sm"
                          className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/10 rounded-lg"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          {result.classTeacherComment ? 'Edit' : 'Add'}
                        </Button>
                      </td>
                      <td className="p-4 text-center">
                        {result.isComplete ? (
                          <Badge className="bg-[#10B981] text-white rounded-full">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Complete
                          </Badge>
                        ) : (
                          <Badge className="bg-[#F59E0B] text-white rounded-full">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Incomplete
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedClassId && rankedStudents.length === 0 && (
        <Card className="rounded-xl bg-white border border-[#E5E7EB] shadow-clinical">
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
            <p className="text-[#6B7280]">No students found in this class</p>
          </CardContent>
        </Card>
      )}

      {!selectedClassId && (
        <Card className="rounded-xl bg-white border border-[#E5E7EB] shadow-clinical">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
            <p className="text-[#6B7280] mb-2">Select a class to view and compile results</p>
            <p className="text-sm text-[#9CA3AF]">You can only compile results for classes where you are the Class Teacher</p>
          </CardContent>
        </Card>
      )}

      {/* Comment Modal */}
      <Dialog open={showCommentModal} onOpenChange={setShowCommentModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Class Teacher Comment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {currentCommentStudentId && (
              <>
                <div>
                  <Label className="text-[#1F2937] mb-2 block">
                    Student: {rankedStudents.find(r => r.student.id === currentCommentStudentId)?.student.firstName} {rankedStudents.find(r => r.student.id === currentCommentStudentId)?.student.lastName}
                  </Label>
                  <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] mb-4">
                    <p className="text-sm text-[#6B7280] mb-2">Suggested Comment:</p>
                    <p className="text-[#1F2937]">
                      {rankedStudents.find(r => r.student.id === currentCommentStudentId)?.autoComment}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-[#1F2937] mb-2 block">Your Comment</Label>
                  <Textarea
                    value={classTeacherComments[currentCommentStudentId] || ''}
                    onChange={(e) => handleCommentChange(currentCommentStudentId, e.target.value)}
                    placeholder="Enter your comment for this student..."
                    className="min-h-32 rounded-lg border-[#E5E7EB] focus:border-[#2563EB]"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    onClick={() => {
                      handleCommentChange(
                        currentCommentStudentId,
                        rankedStudents.find(r => r.student.id === currentCommentStudentId)?.autoComment || ''
                      );
                    }}
                    variant="outline"
                    className="rounded-lg"
                  >
                    Use Suggested
                  </Button>
                  <Button
                    onClick={() => setShowCommentModal(false)}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg"
                  >
                    Save Comment
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Instructions */}
      <Card className="rounded-xl bg-gradient-to-r from-[#F59E0B]/10 to-[#F59E0B]/5 border border-[#F59E0B]/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#F59E0B] mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm text-[#1F2937]">
              <p><strong>Result Compilation Workflow:</strong></p>
              <ol className="list-decimal list-inside space-y-1 text-[#6B7280]">
                <li>Verify all subject teachers have submitted scores for all students</li>
                <li>Ensure affective and psychomotor assessments are completed (use Affective & Psychomotor page)</li>
                <li>Add or edit class teacher comments for each student</li>
                <li>Review the class rankings and averages</li>
                <li>Submit to Admin for final approval and publishing to parents</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
