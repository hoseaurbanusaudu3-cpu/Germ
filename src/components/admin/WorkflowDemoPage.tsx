import { useState } from 'react';
import { useSchool } from '../../contexts/SchoolContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  CheckCircle, 
  Play, 
  FileText, 
  Users, 
  BookOpen, 
  ClipboardCheck,
  FileCheck,
  Download,
  Printer
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { StudentResultSheet } from '../StudentResultSheet';

export function WorkflowDemoPage() {
  const {
    currentUser,
    currentTerm,
    currentAcademicYear,
    addClass,
    addSubject,
    addTeacher,
    addStudent,
    addParent,
    addSubjectAssignment,
    addScore,
    submitScores,
    addAffectiveDomain,
    addPsychomotorDomain,
    compileResult,
    submitResult,
    approveResult,
    classes,
    subjects,
    teachers,
    students,
    parents,
    subjectAssignments,
    scores,
    affectiveDomains,
    psychomotorDomains,
    compiledResults,
    addUser,
  } = useSchool();

  const [step, setStep] = useState(0);
  const [demoData, setDemoData] = useState<{
    classId?: number;
    teacherId?: number;
    studentId?: number;
    parentId?: number;
    assignmentId?: number;
    resultId?: number;
  }>({});
  const [showResultSheet, setShowResultSheet] = useState(false);

  const steps = [
    { title: 'Create Class', icon: Users },
    { title: 'Create Subject', icon: BookOpen },
    { title: 'Create Teacher', icon: Users },
    { title: 'Create Student & Parent', icon: Users },
    { title: 'Assign Subject to Class', icon: ClipboardCheck },
    { title: 'Enter Scores (Teacher)', icon: FileText },
    { title: 'Enter Affective/Psychomotor', icon: FileCheck },
    { title: 'Compile Result (Class Teacher)', icon: FileCheck },
    { title: 'Approve Result (Admin)', icon: CheckCircle },
    { title: 'View/Print PDF', icon: Printer },
  ];

  const runStep1 = () => {
    // Create a class
    addClass({
      name: 'JSS 1A',
      level: 'JSS 1',
      section: 'A',
      capacity: 35,
      currentStudents: 0,
      classTeacherId: null,
      classTeacher: '',
      academicYear: currentAcademicYear,
      status: 'Active',
    });

    const newClassId = classes.length + 1;
    setDemoData({ ...demoData, classId: newClassId });
    toast.success('✓ Class "JSS 1A" created successfully!');
    setStep(1);
  };

  const runStep2 = () => {
    // Create subjects
    const subjectsToAdd = [
      { name: 'Mathematics', code: 'MTH101', department: 'Sciences', isCore: true, status: 'Active' as const },
      { name: 'English Language', code: 'ENG101', department: 'Languages', isCore: true, status: 'Active' as const },
      { name: 'Physics', code: 'PHY101', department: 'Sciences', isCore: true, status: 'Active' as const },
    ];

    subjectsToAdd.forEach(subject => {
      addSubject(subject);
    });

    toast.success('✓ 3 Subjects created successfully!');
    setStep(2);
  };

  const runStep3 = () => {
    // Create teacher and user account
    const teacherId = addTeacher({
      firstName: 'John',
      lastName: 'Doe',
      employeeId: 'GRA/T/001',
      email: 'john.doe@gra.edu.ng',
      phone: '08012345671',
      qualification: 'B.Ed Mathematics',
      specialization: ['Mathematics'],
      status: 'Active',
      isClassTeacher: true,
      classTeacherId: demoData.classId || 1,
    });

    // Create user account for teacher
    addUser({
      username: 'teacher_demo',
      password: 'teacher123',
      role: 'teacher',
      linkedId: teacherId,
      email: 'john.doe@gra.edu.ng',
      status: 'Active',
    });

    // Update class to assign class teacher
    const classToUpdate = classes.find(c => c.id === demoData.classId);
    if (classToUpdate) {
      classToUpdate.classTeacherId = teacherId;
      classToUpdate.classTeacher = 'Mr. John Doe';
    }

    setDemoData({ ...demoData, teacherId });
    toast.success('✓ Teacher "John Doe" created with login credentials!');
    setStep(3);
  };

  const runStep4 = () => {
    // Create parent
    const parentId = addParent({
      firstName: 'Musa',
      lastName: 'Abubakar',
      email: 'musa.abubakar@email.com',
      phone: '08011111111',
      studentIds: [],
      status: 'Active',
    });

    // Create parent user account
    addUser({
      username: 'parent_demo',
      password: 'parent123',
      role: 'parent',
      linkedId: parentId,
      email: 'musa.abubakar@email.com',
      status: 'Active',
    });

    // Create student
    const studentId = addStudent({
      firstName: 'Abdul',
      lastName: 'Abubakar',
      admissionNumber: 'GRA/2024/001',
      classId: demoData.classId || 1,
      className: 'JSS 1A',
      level: 'JSS 1',
      parentId,
      dateOfBirth: '2010-05-15',
      gender: 'Male',
      status: 'Active',
      academicYear: currentAcademicYear,
    });

    // Link student to parent
    const parentToUpdate = parents.find(p => p.id === parentId);
    if (parentToUpdate) {
      parentToUpdate.studentIds.push(studentId);
    }

    setDemoData({ ...demoData, studentId, parentId });
    toast.success('✓ Student "Abdul Abubakar" and Parent created!');
    setStep(4);
  };

  const runStep5 = () => {
    // Assign subjects to class
    const mathSubject = subjects.find(s => s.name === 'Mathematics');
    const englishSubject = subjects.find(s => s.name === 'English Language');
    const physicsSubject = subjects.find(s => s.name === 'Physics');

    if (mathSubject && englishSubject && physicsSubject) {
      addSubjectAssignment({
        subjectId: mathSubject.id,
        subjectName: mathSubject.name,
        classId: demoData.classId || 1,
        className: 'JSS 1A',
        teacherId: demoData.teacherId || 1,
        teacherName: 'Mr. John Doe',
        academicYear: currentAcademicYear,
        term: currentTerm,
      });

      const assignmentId = subjectAssignments.length + 1;

      addSubjectAssignment({
        subjectId: englishSubject.id,
        subjectName: englishSubject.name,
        classId: demoData.classId || 1,
        className: 'JSS 1A',
        teacherId: demoData.teacherId || 1,
        teacherName: 'Mr. John Doe',
        academicYear: currentAcademicYear,
        term: currentTerm,
      });

      addSubjectAssignment({
        subjectId: physicsSubject.id,
        subjectName: physicsSubject.name,
        classId: demoData.classId || 1,
        className: 'JSS 1A',
        teacherId: demoData.teacherId || 1,
        teacherName: 'Mr. John Doe',
        academicYear: currentAcademicYear,
        term: currentTerm,
      });

      setDemoData({ ...demoData, assignmentId });
      toast.success('✓ 3 Subjects assigned to JSS 1A!');
      setStep(5);
    }
  };

  const runStep6 = () => {
    // Enter scores for all subjects
    const studentAssignments = subjectAssignments.filter(
      a => a.classId === demoData.classId && a.term === currentTerm
    );

    const scoreData = [
      { ca1: 18, ca2: 19, exam: 55 }, // Mathematics - 92
      { ca1: 16, ca2: 17, exam: 52 }, // English - 85
      { ca1: 17, ca2: 18, exam: 54 }, // Physics - 89
    ];

    studentAssignments.forEach((assignment, index) => {
      const data = scoreData[index];
      addScore({
        studentId: demoData.studentId || 1,
        subjectAssignmentId: assignment.id,
        subjectName: assignment.subjectName,
        ca1: data.ca1,
        ca2: data.ca2,
        exam: data.exam,
        classAverage: 0,
        classMin: 0,
        classMax: 0,
        subjectTeacher: 'Mr. John Doe',
        enteredBy: demoData.teacherId || 1,
        enteredDate: new Date().toISOString(),
        status: 'Draft',
      });
    });

    // Submit scores
    const scoreIds = scores.slice(-3).map(s => s.id);
    submitScores(scoreIds);

    toast.success('✓ Scores entered and submitted for all subjects!');
    setStep(6);
  };

  const runStep7 = () => {
    // Add affective domain assessment
    addAffectiveDomain({
      studentId: demoData.studentId || 1,
      classId: demoData.classId || 1,
      term: currentTerm,
      academicYear: currentAcademicYear,
      attentiveness: 4,
      attentivenessRemark: 'Excellent',
      honesty: 5,
      honestyRemark: 'Outstanding',
      neatness: 4,
      neatnessRemark: 'Very Good',
      obedience: 5,
      obedienceRemark: 'Excellent',
      senseOfResponsibility: 4,
      senseOfResponsibilityRemark: 'Good',
      enteredBy: demoData.teacherId || 1,
      enteredDate: new Date().toISOString(),
    });

    // Add psychomotor domain assessment
    addPsychomotorDomain({
      studentId: demoData.studentId || 1,
      classId: demoData.classId || 1,
      term: currentTerm,
      academicYear: currentAcademicYear,
      attentionToDirection: 4,
      attentionToDirectionRemark: 'Very Good',
      considerateOfOthers: 5,
      considerateOfOthersRemark: 'Excellent',
      handwriting: 4,
      handwritingRemark: 'Good',
      sports: 5,
      sportsRemark: 'Outstanding',
      verbalFluency: 4,
      verbalFluencyRemark: 'Very Good',
      worksWellIndependently: 4,
      worksWellIndependentlyRemark: 'Good',
      enteredBy: demoData.teacherId || 1,
      enteredDate: new Date().toISOString(),
    });

    toast.success('✓ Affective and Psychomotor assessments completed!');
    setStep(7);
  };

  const runStep8 = () => {
    // Compile result
    const studentScores = scores.filter(
      s => s.studentId === demoData.studentId && s.status === 'Submitted'
    );

    const affective = affectiveDomains.find(
      a => a.studentId === demoData.studentId && a.term === currentTerm
    );

    const psychomotor = psychomotorDomains.find(
      p => p.studentId === demoData.studentId && p.term === currentTerm
    );

    const totalScore = studentScores.reduce((sum, s) => sum + s.total, 0);
    const averageScore = totalScore / studentScores.length;

    compileResult({
      studentId: demoData.studentId || 1,
      classId: demoData.classId || 1,
      term: currentTerm,
      academicYear: currentAcademicYear,
      scores: studentScores,
      affective: affective || null,
      psychomotor: psychomotor || null,
      totalScore,
      averageScore,
      classAverage: averageScore,
      position: 1,
      totalStudents: 1,
      timesPresent: 85,
      timesAbsent: 5,
      totalAttendanceDays: 90,
      termBegin: '2024-09-15',
      termEnd: '2024-12-20',
      nextTermBegin: '2025-01-13',
      classTeacherName: 'Mr. John Doe',
      classTeacherComment: 'Excellent performance! Abdul is a dedicated student who consistently demonstrates strong academic abilities and good character. Keep up the excellent work!',
      principalName: 'Mrs. Grace Okoro',
      principalComment: '',
      principalSignature: '',
      compiledBy: demoData.teacherId || 1,
      compiledDate: new Date().toISOString(),
      status: 'Draft',
      approvedBy: null,
      approvedDate: null,
      rejectionReason: null,
    });

    const resultId = compiledResults.length + 1;
    setDemoData({ ...demoData, resultId });

    // Submit result to admin
    submitResult(resultId);

    toast.success('✓ Result compiled and submitted to Admin!');
    setStep(8);
  };

  const runStep9 = () => {
    // Admin approves result
    if (demoData.resultId) {
      const result = compiledResults.find(r => r.id === demoData.resultId);
      if (result) {
        // Add principal's comment
        result.principalComment = 'Outstanding performance! We are proud of your achievements. Continue to excel in your studies.';
        result.principalName = 'Mrs. Grace Okoro';
      }

      approveResult(demoData.resultId, currentUser?.id || 1);
      toast.success('✓ Result approved by Admin! Ready for printing.');
      setStep(9);
    }
  };

  const runStep10 = () => {
    // Show PDF result sheet
    setShowResultSheet(true);
    toast.success('✓ Result sheet ready! You can now print or download PDF.');
  };

  const runAllSteps = async () => {
    toast.info('Starting complete workflow demonstration...');
    
    for (let i = 0; i <= 9; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch (i) {
        case 0: runStep1(); break;
        case 1: runStep2(); break;
        case 2: runStep3(); break;
        case 3: runStep4(); break;
        case 4: runStep5(); break;
        case 5: runStep6(); break;
        case 6: runStep7(); break;
        case 7: runStep8(); break;
        case 8: runStep9(); break;
        case 9: runStep10(); break;
      }
    }
  };

  const approvedResult = compiledResults.find(r => r.id === demoData.resultId && r.status === 'Approved');

  if (showResultSheet && approvedResult) {
    return <StudentResultSheet result={approvedResult} onClose={() => setShowResultSheet(false)} />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-[#0A2540] mb-2">Complete Workflow Demonstration</h1>
        <p className="text-gray-600">
          See the complete process from score entry to final PDF generation
        </p>
      </div>

      {/* Quick Actions */}
      <Card className="border-[#0A2540]/10 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#0A2540] mb-2">Quick Start</h3>
              <p className="text-sm text-gray-600">
                Run the complete workflow automatically or step by step
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={runAllSteps}
                className="bg-[#10B981] hover:bg-[#10B981]/90 text-white rounded-xl"
              >
                <Play className="w-4 h-4 mr-2" />
                Run All Steps
              </Button>
              <Button
                onClick={() => {
                  setStep(0);
                  setDemoData({});
                  toast.info('Workflow reset. Click on steps to run individually.');
                }}
                variant="outline"
                className="border-[#0A2540] text-[#0A2540] rounded-xl"
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {steps.map((stepInfo, index) => {
          const Icon = stepInfo.icon;
          const isCompleted = step > index;
          const isCurrent = step === index;

          return (
            <Card
              key={index}
              className={`border rounded-xl cursor-pointer transition-all ${
                isCompleted
                  ? 'border-[#10B981] bg-green-50'
                  : isCurrent
                  ? 'border-[#3B82F6] bg-blue-50'
                  : 'border-[#0A2540]/10 bg-white'
              }`}
              onClick={() => {
                if (index === step) {
                  switch (index) {
                    case 0: runStep1(); break;
                    case 1: runStep2(); break;
                    case 2: runStep3(); break;
                    case 3: runStep4(); break;
                    case 4: runStep5(); break;
                    case 5: runStep6(); break;
                    case 6: runStep7(); break;
                    case 7: runStep8(); break;
                    case 8: runStep9(); break;
                    case 9: runStep10(); break;
                  }
                }
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-[#10B981]'
                        : isCurrent
                        ? 'bg-[#3B82F6]'
                        : 'bg-gray-200'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Icon
                        className={`w-5 h-5 ${
                          isCurrent ? 'text-white' : 'text-gray-500'
                        }`}
                      />
                    )}
                  </div>
                  <div className="text-sm text-[#0A2540]">Step {index + 1}</div>
                </div>
                <h3 className="text-sm text-[#0A2540]">{stepInfo.title}</h3>
                {isCompleted && (
                  <Badge className="mt-2 bg-[#10B981] text-white rounded-xl text-xs">
                    Completed
                  </Badge>
                )}
                {isCurrent && (
                  <Badge className="mt-2 bg-[#3B82F6] text-white rounded-xl text-xs">
                    Click to Run
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current Step Details */}
      {step < 10 && (
        <Card className="border-[#0A2540]/10">
          <CardHeader className="border-b border-[#0A2540]/10 bg-[#0A2540]/5">
            <CardTitle className="text-[#0A2540]">Step {step + 1}: {steps[step].title}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {step === 0 && (
              <div className="space-y-4">
                <p className="text-gray-600">Create a new class for students.</p>
                <Button onClick={runStep1} className="bg-[#3B82F6] text-white rounded-xl">
                  Create Class "JSS 1A"
                </Button>
              </div>
            )}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-gray-600">Add subjects that will be taught in the school.</p>
                <Button onClick={runStep2} className="bg-[#3B82F6] text-white rounded-xl">
                  Create 3 Subjects
                </Button>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <p className="text-gray-600">Register a teacher with login credentials.</p>
                <Button onClick={runStep3} className="bg-[#3B82F6] text-white rounded-xl">
                  Create Teacher & User Account
                </Button>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <p className="text-gray-600">Register a student and parent with login credentials.</p>
                <Button onClick={runStep4} className="bg-[#3B82F6] text-white rounded-xl">
                  Create Student & Parent
                </Button>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-4">
                <p className="text-gray-600">Assign subjects to the class with teachers.</p>
                <Button onClick={runStep5} className="bg-[#3B82F6] text-white rounded-xl">
                  Assign 3 Subjects to Class
                </Button>
              </div>
            )}
            {step === 5 && (
              <div className="space-y-4">
                <p className="text-gray-600">Teacher enters CA and exam scores for all subjects.</p>
                <Button onClick={runStep6} className="bg-[#3B82F6] text-white rounded-xl">
                  Enter & Submit Scores
                </Button>
              </div>
            )}
            {step === 6 && (
              <div className="space-y-4">
                <p className="text-gray-600">Class teacher assesses affective and psychomotor domains.</p>
                <Button onClick={runStep7} className="bg-[#3B82F6] text-white rounded-xl">
                  Complete Assessments
                </Button>
              </div>
            )}
            {step === 7 && (
              <div className="space-y-4">
                <p className="text-gray-600">Class teacher compiles the complete result with comments.</p>
                <Button onClick={runStep8} className="bg-[#3B82F6] text-white rounded-xl">
                  Compile & Submit Result
                </Button>
              </div>
            )}
            {step === 8 && (
              <div className="space-y-4">
                <p className="text-gray-600">Admin reviews and approves the final result.</p>
                <Button onClick={runStep9} className="bg-[#10B981] text-white rounded-xl">
                  Approve Result
                </Button>
              </div>
            )}
            {step === 9 && (
              <div className="space-y-4">
                <p className="text-gray-600">View and download the final result sheet as PDF.</p>
                <Button onClick={runStep10} className="bg-[#2563EB] text-white rounded-xl">
                  <Printer className="w-4 h-4 mr-2" />
                  View Result Sheet PDF
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Workflow Summary */}
      {step === 10 && (
        <Card className="border-[#10B981] bg-green-50">
          <CardHeader className="border-b border-[#10B981]/20">
            <CardTitle className="text-[#10B981] flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Workflow Completed Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-gray-700">
                The complete workflow has been demonstrated:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Class created and configured</li>
                <li>Subjects added to the system</li>
                <li>Teacher registered with login credentials</li>
                <li>Student and parent registered</li>
                <li>Subjects assigned to class</li>
                <li>Scores entered and submitted by teacher</li>
                <li>Affective and psychomotor assessments completed</li>
                <li>Result compiled by class teacher</li>
                <li>Result approved by admin</li>
                <li>PDF result sheet generated and ready for printing</li>
              </ul>
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setShowResultSheet(true)}
                  className="bg-[#2563EB] text-white rounded-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  View PDF Result Sheet
                </Button>
                <Button
                  onClick={() => {
                    setStep(0);
                    setDemoData({});
                    toast.info('Workflow reset. You can run it again.');
                  }}
                  variant="outline"
                  className="border-[#0A2540] text-[#0A2540] rounded-xl"
                >
                  Reset & Run Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
