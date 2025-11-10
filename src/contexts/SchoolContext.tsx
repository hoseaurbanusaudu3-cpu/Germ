import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { classesAPI, subjectsAPI, studentsAPI, sessionsAPI, termsAPI } from '../services/api';

// ==================== INTERFACES ====================

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  admissionNumber: string;
  classId: number;
  className: string;
  level: string;
  parentId: number | null;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  photoUrl?: string;
  status: 'Active' | 'Inactive';
  academicYear: string;
}

export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  employeeId: string;
  email: string;
  phone: string;
  qualification: string;
  specialization: string[];
  status: 'Active' | 'Inactive';
  isClassTeacher: boolean;
  classTeacherId: number | null; // which class they're class teacher for
}

export interface Parent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  studentIds: number[];
  status: 'Active' | 'Inactive';
}

export interface Class {
  id: number;
  name: string;
  level: string;
  class_teacher_id?: number | null;
  capacity: number;
  status: 'active' | 'inactive';
  // Optional frontend-only fields
  section?: string;
  currentStudents?: number;
  classTeacherId?: number | null;
  classTeacher?: string;
  academicYear?: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  department: string;
  isCore: boolean;
  status: 'Active' | 'Inactive';
}

export interface SubjectAssignment {
  id: number;
  subjectId: number;
  subjectName: string;
  classId: number;
  className: string;
  teacherId: number;
  teacherName: string;
  academicYear: string;
  term: string;
}

export interface Score {
  id: number;
  studentId: number;
  subjectAssignmentId: number;
  subjectName: string;
  ca1: number;
  ca2: number;
  exam: number;
  total: number;
  classAverage: number;
  classMin: number;
  classMax: number;
  grade: string;
  remark: string;
  subjectTeacher: string;
  enteredBy: number;
  enteredDate: string;
  status: 'Draft' | 'Submitted';
}

export interface AffectiveDomain {
  id: number;
  studentId: number;
  classId: number;
  term: string;
  academicYear: string;
  attentiveness: number;
  attentivenessRemark: string;
  honesty: number;
  honestyRemark: string;
  neatness: number;
  neatnessRemark: string;
  obedience: number;
  obedienceRemark: string;
  senseOfResponsibility: number;
  senseOfResponsibilityRemark: string;
  enteredBy: number;
  enteredDate: string;
}

export interface PsychomotorDomain {
  id: number;
  studentId: number;
  classId: number;
  term: string;
  academicYear: string;
  attentionToDirection: number;
  attentionToDirectionRemark: string;
  considerateOfOthers: number;
  considerateOfOthersRemark: string;
  handwriting: number;
  handwritingRemark: string;
  sports: number;
  sportsRemark: string;
  verbalFluency: number;
  verbalFluencyRemark: string;
  worksWellIndependently: number;
  worksWellIndependentlyRemark: string;
  enteredBy: number;
  enteredDate: string;
}

export interface CompiledResult {
  id: number;
  studentId: number;
  classId: number;
  term: string;
  academicYear: string;
  scores: Score[];
  affective: AffectiveDomain | null;
  psychomotor: PsychomotorDomain | null;
  totalScore: number;
  averageScore: number;
  classAverage: number;
  position: number;
  totalStudents: number;
  timesPresent: number;
  timesAbsent: number;
  totalAttendanceDays: number;
  termBegin: string;
  termEnd: string;
  nextTermBegin: string;
  classTeacherName: string;
  classTeacherComment: string;
  principalName: string;
  principalComment: string;
  principalSignature: string;
  compiledBy: number;
  compiledDate: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  approvedBy: number | null;
  approvedDate: string | null;
  rejectionReason: string | null;
}

export interface FeeStructure {
  id: number;
  classId: number;
  className: string;
  level: string;
  term: string;
  academicYear: string;
  tuitionFee: number;
  developmentLevy: number;
  sportsFee: number;
  examFee: number;
  booksFee: number;
  uniformFee: number;
  transportFee: number;
  totalFee: number;
}

export interface StudentFeeBalance {
  id: number;
  studentId: number;
  classId: number;
  term: string;
  academicYear: string;
  totalFeeRequired: number;
  totalPaid: number;
  balance: number;
  status: 'Paid' | 'Partial' | 'Unpaid';
}

export interface Payment {
  id: number;
  studentId: number;
  studentName: string;
  amount: number;
  paymentType: string;
  term: string;
  academicYear: string;
  paymentMethod: string;
  reference: string;
  recordedBy: number;
  recordedDate: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  receiptNumber: string;
}

export interface User {
  id: number;
  username: string;
  password: string; // In production, this would be hashed
  role: 'admin' | 'teacher' | 'accountant' | 'parent';
  linkedId: number; // links to teacher/parent/accountant id
  email: string;
  status: 'Active' | 'Inactive';
}

export interface Accountant {
  id: number;
  firstName: string;
  lastName: string;
  employeeId: string;
  email: string;
  phone: string;
  department?: string;
  status: 'Active' | 'Inactive';
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  targetAudience: 'all' | 'teachers' | 'parents' | 'students' | 'accountants';
  sentBy: number; // admin user id
  sentDate: string;
  isRead: boolean;
  readBy: number[]; // user ids who have read this
}

export interface ActivityLog {
  id: number;
  actor: string;
  actorRole: 'Admin' | 'Teacher' | 'Accountant' | 'Parent' | 'System';
  action: string;
  target: string;
  timestamp: string;
  ip: string;
  status: 'Success' | 'Failed';
  details?: string;
}

export interface SchoolSettings {
  schoolName: string;
  schoolMotto: string;
  schoolLogoUrl?: string;
  principalName: string;
  principalSignature?: string;
}

export interface BankAccountSettings {
  id: number;
  bankName: string;
  accountName: string;
  accountNumber: string;
  paymentMethods: {
    bankTransfer: boolean;
    onlinePayment: boolean;
    cash: boolean;
  };
  updatedBy: number;
  updatedDate: string;
}

// ==================== CONTEXT ====================

interface SchoolContextType {
  // Data
  students: Student[];
  teachers: Teacher[];
  parents: Parent[];
  accountants: Accountant[];
  classes: Class[];
  subjects: Subject[];
  subjectAssignments: SubjectAssignment[];
  scores: Score[];
  affectiveDomains: AffectiveDomain[];
  psychomotorDomains: PsychomotorDomain[];
  compiledResults: CompiledResult[];
  payments: Payment[];
  users: User[];
  currentUser: User | null;
  feeStructures: FeeStructure[];
  studentFeeBalances: StudentFeeBalance[];
  notifications: Notification[];
  activityLogs: ActivityLog[];

  // Settings
  currentTerm: string;
  currentAcademicYear: string;
  schoolSettings: SchoolSettings;
  bankAccountSettings: BankAccountSettings | null;

  // Student Methods
  addStudent: (student: Omit<Student, 'id'>) => Promise<number>;
  updateStudent: (id: number, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: number) => void;
  getStudentsByClass: (classId: number) => Student[];
  fetchStudents: () => Promise<void>;

  // Teacher Methods
  addTeacher: (teacher: Omit<Teacher, 'id'>) => number;
  updateTeacher: (id: number, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: number) => void;
  getTeacherAssignments: (teacherId: number) => SubjectAssignment[];
  fetchTeachers: () => Promise<void>;

  // Parent Methods
  addParent: (parent: Omit<Parent, 'id'>) => number;
  updateParent: (id: number, parent: Partial<Parent>) => void;
  deleteParent: (id: number) => void;
  getParentStudents: (parentId: number) => Student[];

  // Accountant Methods
  addAccountant: (accountant: Omit<Accountant, 'id'>) => number;
  updateAccountant: (id: number, accountant: Partial<Accountant>) => void;
  deleteAccountant: (id: number) => void;

  // Class Methods
  addClass: (cls: Omit<Class, 'id'>) => Promise<void>;
  updateClass: (id: number, cls: Partial<Class>) => Promise<void>;
  deleteClass: (id: number) => void;
  fetchClasses: () => Promise<void>;

  // Subject Methods
  addSubject: (subject: Omit<Subject, 'id'>) => Promise<void>;
  updateSubject: (id: number, subject: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: number) => void;
  fetchSubjects: () => Promise<void>;

  // Subject Assignment Methods
  addSubjectAssignment: (assignment: Omit<SubjectAssignment, 'id'>) => void;
  updateSubjectAssignment: (id: number, assignment: Partial<SubjectAssignment>) => void;
  deleteSubjectAssignment: (id: number) => void;
  getAssignmentsByClass: (classId: number) => SubjectAssignment[];
  getAssignmentsByTeacher: (teacherId: number) => SubjectAssignment[];

  // Score Methods
  addScore: (score: Omit<Score, 'id' | 'total' | 'grade' | 'remark'>) => void;
  updateScore: (id: number, score: Partial<Score>) => void;
  deleteScore: (id: number) => void;
  submitScores: (scoreIds: number[]) => void;
  getScoresByAssignment: (assignmentId: number) => Score[];
  getScoresByStudent: (studentId: number) => Score[];

  // Affective/Psychomotor Methods
  addAffectiveDomain: (domain: Omit<AffectiveDomain, 'id'>) => void;
  updateAffectiveDomain: (id: number, domain: Partial<AffectiveDomain>) => void;
  addPsychomotorDomain: (domain: Omit<PsychomotorDomain, 'id'>) => void;
  updatePsychomotorDomain: (id: number, domain: Partial<PsychomotorDomain>) => void;

  // Result Compilation Methods
  compileResult: (result: Omit<CompiledResult, 'id'>) => void;
  addCompiledResult: (result: Omit<CompiledResult, 'id'>) => void; // Alias
  updateCompiledResult: (id: number, result: Partial<CompiledResult>) => void;
  submitResult: (id: number) => void;
  approveResult: (id: number, approvedBy: number) => void;
  rejectResult: (id: number, reason: string) => void;
  getResultsByClass: (classId: number) => CompiledResult[];
  getPendingApprovals: () => CompiledResult[];

  // Payment Methods
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePayment: (id: number, payment: Partial<Payment>) => void;
  verifyPayment: (id: number) => void;
  getPaymentsByStudent: (studentId: number) => Payment[];

  // Fee Structure Methods
  addFeeStructure: (feeStructure: Omit<FeeStructure, 'id' | 'totalFee'>) => void;
  updateFeeStructure: (id: number, feeStructure: Partial<FeeStructure>) => void;
  getFeeStructureByClass: (classId: number, term: string, academicYear: string) => FeeStructure | undefined;

  // Student Fee Balance Methods
  getStudentFeeBalance: (studentId: number, term: string, academicYear: string) => StudentFeeBalance | undefined;
  updateStudentFeeBalance: (studentId: number) => void;
  linkParentToStudent: (parentId: number, studentId: number) => void;

  // User Methods
  addUser: (user: Omit<User, 'id'>) => number;
  updateUser: (id: number, user: Partial<User>) => void;
  deleteUser: (id: number) => void;
  setCurrentUser: (user: User | null) => void;
  login: (username: string, password: string) => User | null;
  changePassword: (userId: number, oldPassword: string, newPassword: string) => boolean;

  // Notification Methods
  addNotification: (notification: Omit<Notification, 'id' | 'sentDate' | 'isRead' | 'readBy'>) => void;
  createNotification: (notification: Omit<Notification, 'id' | 'sentDate' | 'isRead' | 'readBy'>) => void; // Alias
  markNotificationAsRead: (notificationId: number, userId: number) => void;
  getUnreadNotifications: (userId: number, userRole: string) => Notification[];
  getAllNotifications: (userId: number, userRole: string) => Notification[];

  // Activity Log Methods
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  getActivityLogs: (filterAction?: string, filterDate?: string) => ActivityLog[];

  // Promotion Methods
  promoteStudent: (studentId: number, newClassId: number, newAcademicYear: string) => void;
  promoteMultipleStudents: (studentIds: number[], classMapping: { [studentId: number]: number }, newAcademicYear: string) => void;

  // Class Helper Methods
  getClassTeacher: (classId: number) => Teacher | null;
  getClassSubjects: (classId: number) => SubjectAssignment[];
  updateClassStudentCount: (classId: number) => void;

  // System Settings Methods
  updateCurrentTerm: (term: string) => void;
  updateCurrentAcademicYear: (year: string) => void;
  updateSchoolSettings: (settings: Partial<SchoolSettings>) => void;
  getTeacherClassTeacherAssignments: (teacherId: number) => number[]; // Returns class IDs where teacher is class teacher
  validateClassTeacherAssignment: (teacherId: number, newClassId: number) => { valid: boolean; message: string };

  // Bank Account Settings Methods
  updateBankAccountSettings: (settings: Omit<BankAccountSettings, 'id' | 'updatedDate'>) => void;
  getBankAccountSettings: () => BankAccountSettings | null;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export function useSchool() {
  const context = useContext(SchoolContext);
  if (context === undefined) {
    throw new Error('useSchool must be used within SchoolProvider');
  }
  return context;
}

// ==================== PROVIDER ====================

export function SchoolProvider({ children }: { children: ReactNode }) {
  const [currentTerm, setCurrentTerm] = useState('First Term');
  const [currentAcademicYear, setCurrentAcademicYear] = useState('2024/2025');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>({
    schoolName: 'Graceland Royal Academy Gombe',
    schoolMotto: 'Wisdom & Illumination',
    principalName: 'Mrs. Grace Okoro',
  });

  const [bankAccountSettings, setBankAccountSettings] = useState<BankAccountSettings | null>(null);

  // Initialize empty data arrays - All data created through the system
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [subjectAssignments, setSubjectAssignments] = useState<SubjectAssignment[]>([]);

  const [scores, setScores] = useState<Score[]>([]);
  const [affectiveDomains, setAffectiveDomains] = useState<AffectiveDomain[]>([]);
  const [psychomotorDomains, setPsychomotorDomains] = useState<PsychomotorDomain[]>([]);
  const [compiledResults, setCompiledResults] = useState<CompiledResult[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [studentFeeBalances, setStudentFeeBalances] = useState<StudentFeeBalance[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [accountants, setAccountants] = useState<Accountant[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Initialize with only admin user - all other users created through registration
  const [users, setUsers] = useState<User[]>([
    { id: 1, username: 'admin', password: 'admin123', role: 'admin', linkedId: 0, email: 'admin@gra.edu.ng', status: 'Active' },
  ]);

  // Fetch data from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from API...');
        await Promise.all([
          fetchClasses(),
          fetchSubjects(),
          fetchStudents(),
        ]);
        console.log('Data fetched successfully');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array = run once on mount

  // Helper function to calculate grade
  const calculateGrade = (total: number): string => {
    if (total >= 80) return 'A';
    if (total >= 70) return 'B';
    if (total >= 60) return 'C';
    if (total >= 50) return 'D';
    if (total >= 40) return 'E';
    return 'F';
  };

  // Helper function to get remark
  const getRemark = (grade: string): string => {
    const remarks: { [key: string]: string } = {
      A: 'Excellent',
      B: 'Very Good',
      C: 'Good',
      D: 'Fair',
      E: 'Pass',
      F: 'Fail',
    };
    return remarks[grade] || 'N/A';
  };

  // ==================== IMPLEMENTATION ====================

  // Fetch Students from API
  const fetchStudents = async () => {
    try {
      const response = await studentsAPI.getAll();
      if (response.success && response.data) {
        setStudents(response.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Student Methods
  const addStudent = async (student: Omit<Student, 'id'>) => {
    try {
      const response = await studentsAPI.create(student);
      if (response.success) {
        await fetchStudents(); // Refresh the list
        return response.data.id;
      }
      return 0;
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  };

  const updateStudent = async (id: number, student: Partial<Student>) => {
    try {
      const response = await studentsAPI.update(id, student);
      if (response.success) {
        await fetchStudents(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  };

  const deleteStudent = (id: number) => {
    // Delete student and all associated data
    setStudents(students.filter(s => s.id !== id));
    setScores(scores.filter(s => s.studentId !== id));
    setAffectiveDomains(affectiveDomains.filter(a => a.studentId !== id));
    setPsychomotorDomains(psychomotorDomains.filter(p => p.studentId !== id));
    setCompiledResults(compiledResults.filter(r => r.studentId !== id));
    setPayments(payments.filter(p => p.studentId !== id));
    setStudentFeeBalances(studentFeeBalances.filter(b => b.studentId !== id));
    
    // Remove from parent's student list
    setParents(parents.map(p => ({
      ...p,
      studentIds: p.studentIds.filter(sid => sid !== id)
    })));
  };

  const getStudentsByClass = (classId: number) => {
    return students.filter(s => s.classId === classId);
  };

  // Teacher Methods
  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newId = teachers.length > 0 ? Math.max(...teachers.map(t => t.id)) + 1 : 1;
    const newTeacher = { ...teacher, id: newId };
    setTeachers([...teachers, newTeacher]);
    return newId;
  };

  const updateTeacher = (id: number, teacher: Partial<Teacher>) => {
    setTeachers(teachers.map(t => (t.id === id ? { ...t, ...teacher } : t)));
  };

  const deleteTeacher = (id: number) => {
    // Delete teacher and all associated data
    setTeachers(teachers.filter(t => t.id !== id));
    setSubjectAssignments(subjectAssignments.filter(a => a.teacherId !== id));
    
    // Remove as class teacher from classes
    setClasses(classes.map(c => 
      c.classTeacherId === id ? { ...c, classTeacherId: null, classTeacher: '' } : c
    ));
    
    // Delete associated user account
    const teacherUser = users.find(u => u.role === 'teacher' && u.linkedId === id);
    if (teacherUser) {
      setUsers(users.filter(u => u.id !== teacherUser.id));
    }
  };

  const getTeacherAssignments = (teacherId: number) => {
    return subjectAssignments.filter(a => a.teacherId === teacherId);
  };

  const fetchTeachers = async () => {
    // TODO: Implement when teachers API is available
    // For now, teachers are managed locally
    console.log('fetchTeachers: Using local state');
  };

  // Parent Methods
  const addParent = (parent: Omit<Parent, 'id'>) => {
    const newId = parents.length > 0 ? Math.max(...parents.map(p => p.id)) + 1 : 1;
    const newParent = { ...parent, id: newId };
    setParents([...parents, newParent]);
    return newId;
  };

  // Accountant Methods
  const addAccountant = (accountant: Omit<Accountant, 'id'>) => {
    const newId = accountants.length > 0 ? Math.max(...accountants.map(a => a.id)) + 1 : 1;
    const newAccountant = { ...accountant, id: newId };
    setAccountants([...accountants, newAccountant]);
    return newId;
  };

  const updateAccountant = (id: number, accountant: Partial<Accountant>) => {
    setAccountants(accountants.map(a => (a.id === id ? { ...a, ...accountant } : a)));
  };

  const deleteAccountant = (id: number) => {
    setAccountants(accountants.filter(a => a.id !== id));
    // Also delete associated user account
    const accountantUser = users.find(u => u.role === 'accountant' && u.linkedId === id);
    if (accountantUser) {
      setUsers(users.filter(u => u.id !== accountantUser.id));
    }
  };

  const updateParent = (id: number, parent: Partial<Parent>) => {
    setParents(parents.map(p => (p.id === id ? { ...p, ...parent } : p)));
  };

  const deleteParent = (id: number) => {
    // Delete parent and associated data
    setParents(parents.filter(p => p.id !== id));
    
    // Remove parent reference from students
    setStudents(students.map(s => 
      s.parentId === id ? { ...s, parentId: null } : s
    ));
    
    // Delete associated user account
    const parentUser = users.find(u => u.role === 'parent' && u.linkedId === id);
    if (parentUser) {
      setUsers(users.filter(u => u.id !== parentUser.id));
    }
  };

  const getParentStudents = (parentId: number) => {
    const parent = parents.find(p => p.id === parentId);
    if (!parent) return [];
    return students.filter(s => parent.studentIds.includes(s.id));
  };

  // Fetch Classes from API
  const fetchClasses = async () => {
    try {
      const response = await classesAPI.getAll();
      if (response.success && response.data) {
        setClasses(response.data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  // Class Methods
  const addClass = async (cls: Omit<Class, 'id'>) => {
    try {
      const response = await classesAPI.create(cls);
      if (response.success) {
        await fetchClasses(); // Refresh the list
      }
    } catch (error) {
      console.error('Error adding class:', error);
      throw error;
    }
  };

  const updateClass = async (id: number, cls: Partial<Class>) => {
    try {
      const response = await classesAPI.update(id, cls);
      if (response.success) {
        await fetchClasses(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  };

  const deleteClass = (id: number) => {
    // Delete class and all associated data
    setClasses(classes.filter(c => c.id !== id));
    setSubjectAssignments(subjectAssignments.filter(a => a.classId !== id));
    setFeeStructures(feeStructures.filter(f => f.classId !== id));
    
    // Note: Students in this class should be reassigned before deleting
    // For now, we'll just clear their class reference
    setStudents(students.map(s => 
      s.classId === id ? { ...s, classId: 0, className: '' } : s
    ));
  };

  // Fetch Subjects from API
  const fetchSubjects = async () => {
    try {
      const response = await subjectsAPI.getAll();
      if (response.success && response.data) {
        setSubjects(response.data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  // Subject Methods
  const addSubject = async (subject: Omit<Subject, 'id'>) => {
    try {
      const response = await subjectsAPI.create(subject);
      if (response.success) {
        await fetchSubjects(); // Refresh the list
      }
    } catch (error) {
      console.error('Error adding subject:', error);
      throw error;
    }
  };

  const updateSubject = async (id: number, subject: Partial<Subject>) => {
    try {
      const response = await subjectsAPI.update(id, subject);
      if (response.success) {
        await fetchSubjects(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating subject:', error);
      throw error;
    }
  };

  const deleteSubject = (id: number) => {
    // Delete subject and all associated assignments
    setSubjects(subjects.filter(s => s.id !== id));
    setSubjectAssignments(subjectAssignments.filter(a => a.subjectId !== id));
  };

  // Subject Assignment Methods
  const addSubjectAssignment = (assignment: Omit<SubjectAssignment, 'id'>) => {
    const newAssignment = { ...assignment, id: subjectAssignments.length + 1 };
    setSubjectAssignments([...subjectAssignments, newAssignment]);
  };

  const updateSubjectAssignment = (id: number, assignment: Partial<SubjectAssignment>) => {
    setSubjectAssignments(subjectAssignments.map(a => (a.id === id ? { ...a, ...assignment } : a)));
  };

  const deleteSubjectAssignment = (id: number) => {
    setSubjectAssignments(subjectAssignments.filter(a => a.id !== id));
  };

  const getAssignmentsByClass = (classId: number) => {
    return subjectAssignments.filter(a => a.classId === classId);
  };

  const getAssignmentsByTeacher = (teacherId: number) => {
    return subjectAssignments.filter(a => a.teacherId === teacherId);
  };

  // Score Methods
  const addScore = (score: Omit<Score, 'id' | 'total' | 'grade' | 'remark' | 'classAverage' | 'classMin' | 'classMax'>) => {
    const total = score.ca1 + score.ca2 + score.exam;
    const grade = calculateGrade(total);
    const remark = getRemark(grade);
    
    // Calculate class statistics for this subject/assignment
    const assignmentScores = scores.filter(s => s.subjectAssignmentId === score.subjectAssignmentId);
    const allTotals = [...assignmentScores.map(s => s.total), total];
    const classAverage = allTotals.reduce((sum, t) => sum + t, 0) / allTotals.length;
    const classMin = Math.min(...allTotals);
    const classMax = Math.max(...allTotals);
    
    const newScore: Score = {
      ...score,
      id: scores.length + 1,
      total,
      grade,
      remark,
      classAverage,
      classMin,
      classMax,
    };
    setScores([...scores, newScore]);
    
    // Recalculate class stats for existing scores
    const updatedScores = assignmentScores.map(s => ({
      ...s,
      classAverage,
      classMin,
      classMax,
    }));
    
    if (updatedScores.length > 0) {
      setScores(scores.map(s => {
        const updated = updatedScores.find(us => us.id === s.id);
        return updated || s;
      }));
    }
  };

  const updateScore = (id: number, score: Partial<Score>) => {
    setScores(
      scores.map(s => {
        if (s.id === id) {
          const updated = { ...s, ...score };
          if ('ca1' in score || 'ca2' in score || 'exam' in score) {
            updated.total = updated.ca1 + updated.ca2 + updated.exam;
            updated.grade = calculateGrade(updated.total);
            updated.remark = getRemark(updated.grade);
          }
          return updated;
        }
        return s;
      })
    );
  };

  const deleteScore = (id: number) => {
    setScores(scores.filter(s => s.id !== id));
  };

  const submitScores = (scoreIds: number[]) => {
    setScores(
      scores.map(s => (scoreIds.includes(s.id) ? { ...s, status: 'Submitted' } : s))
    );
  };

  const getScoresByAssignment = (assignmentId: number) => {
    return scores.filter(s => s.subjectAssignmentId === assignmentId);
  };

  const getScoresByStudent = (studentId: number) => {
    return scores.filter(s => s.studentId === studentId);
  };

  // Affective/Psychomotor Methods
  const addAffectiveDomain = (domain: Omit<AffectiveDomain, 'id'>) => {
    const newDomain = { ...domain, id: affectiveDomains.length + 1 };
    setAffectiveDomains([...affectiveDomains, newDomain]);
  };

  const updateAffectiveDomain = (id: number, domain: Partial<AffectiveDomain>) => {
    setAffectiveDomains(affectiveDomains.map(a => (a.id === id ? { ...a, ...domain } : a)));
  };

  const addPsychomotorDomain = (domain: Omit<PsychomotorDomain, 'id'>) => {
    const newDomain = { ...domain, id: psychomotorDomains.length + 1 };
    setPsychomotorDomains([...psychomotorDomains, newDomain]);
  };

  const updatePsychomotorDomain = (id: number, domain: Partial<PsychomotorDomain>) => {
    setPsychomotorDomains(psychomotorDomains.map(p => (p.id === id ? { ...p, ...domain } : p)));
  };

  // Result Compilation Methods
  const compileResult = (result: Omit<CompiledResult, 'id'>) => {
    const newId = compiledResults.length > 0 ? Math.max(...compiledResults.map(r => r.id)) + 1 : 1;
    
    // Get teacher info for additional fields
    const teacherInfo = teachers.find(t => t.id === result.compiledBy);
    
    // Calculate class average from all students' scores
    const classResults = compiledResults.filter(r => r.classId === result.classId && r.term === result.term && r.academicYear === result.academicYear);
    const allAverages = [...classResults.map(r => r.averageScore), result.averageScore];
    const classAverage = allAverages.reduce((sum, avg) => sum + avg, 0) / allAverages.length;
    
    const newResult: CompiledResult = { 
      ...result, 
      id: newId,
      classAverage,
      classTeacherName: teacherInfo ? `${teacherInfo.firstName} ${teacherInfo.lastName}` : '',
      principalName: 'Mrs. Grace Okoro',
      principalComment: '',
      principalSignature: '',
      timesPresent: result.timesPresent || 0,
      timesAbsent: result.timesAbsent || 0,
      totalAttendanceDays: result.totalAttendanceDays || 0,
      termBegin: result.termBegin || '',
      termEnd: result.termEnd || '',
      nextTermBegin: result.nextTermBegin || '',
    };
    setCompiledResults([...compiledResults, newResult]);
  };

  const updateCompiledResult = (id: number, result: Partial<CompiledResult>) => {
    setCompiledResults(compiledResults.map(r => (r.id === id ? { ...r, ...result } : r)));
  };

  const submitResult = (id: number) => {
    setCompiledResults(
      compiledResults.map(r => (r.id === id ? { ...r, status: 'Submitted' } : r))
    );
  };

  const approveResult = (id: number, approvedBy: number) => {
    setCompiledResults(
      compiledResults.map(r =>
        r.id === id
          ? { ...r, status: 'Approved', approvedBy, approvedDate: new Date().toISOString() }
          : r
      )
    );
  };

  const rejectResult = (id: number, reason: string) => {
    setCompiledResults(
      compiledResults.map(r =>
        r.id === id ? { ...r, status: 'Rejected', rejectionReason: reason } : r
      )
    );
  };

  const getResultsByClass = (classId: number) => {
    return compiledResults.filter(r => r.classId === classId);
  };

  const getPendingApprovals = () => {
    return compiledResults.filter(r => r.status === 'Submitted');
  };

  // Payment Methods
  const addPayment = (payment: Omit<Payment, 'id'>) => {
    const newPayment = { ...payment, id: payments.length + 1 };
    setPayments([...payments, newPayment]);
  };

  const updatePayment = (id: number, payment: Partial<Payment>) => {
    setPayments(payments.map(p => (p.id === id ? { ...p, ...payment } : p)));
  };

  const verifyPayment = (id: number) => {
    setPayments(payments.map(p => (p.id === id ? { ...p, status: 'Verified' } : p)));
  };

  const getPaymentsByStudent = (studentId: number) => {
    return payments.filter(p => p.studentId === studentId);
  };

  // Fee Structure Methods
  const addFeeStructure = (feeStructure: Omit<FeeStructure, 'id' | 'totalFee'>) => {
    const totalFee = feeStructure.tuitionFee + feeStructure.developmentLevy + feeStructure.sportsFee + 
                     feeStructure.examFee + feeStructure.booksFee + feeStructure.uniformFee + feeStructure.transportFee;
    const newFeeStructure = { ...feeStructure, id: feeStructures.length + 1, totalFee };
    setFeeStructures([...feeStructures, newFeeStructure]);
  };

  const updateFeeStructure = (id: number, feeStructure: Partial<FeeStructure>) => {
    setFeeStructures(feeStructures.map(fs => {
      if (fs.id === id) {
        const updated = { ...fs, ...feeStructure };
        updated.totalFee = updated.tuitionFee + updated.developmentLevy + updated.sportsFee + 
                          updated.examFee + updated.booksFee + updated.uniformFee + updated.transportFee;
        return updated;
      }
      return fs;
    }));
  };

  const getFeeStructureByClass = (classId: number, term: string, academicYear: string) => {
    return feeStructures.find(fs => fs.classId === classId && fs.term === term && fs.academicYear === academicYear);
  };

  // Student Fee Balance Methods
  const getStudentFeeBalance = (studentId: number, term: string, academicYear: string) => {
    return studentFeeBalances.find(sfb => sfb.studentId === studentId && sfb.term === term && sfb.academicYear === academicYear);
  };

  const updateStudentFeeBalance = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const studentPayments = payments.filter(
      p => p.studentId === studentId && p.term === currentTerm && p.academicYear === currentAcademicYear && p.status === 'Verified'
    );

    const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);

    const feeStructure = getFeeStructureByClass(student.classId, currentTerm, currentAcademicYear);
    const totalFeeRequired = feeStructure?.totalFee || 0;
    const balance = totalFeeRequired - totalPaid;

    const status: 'Paid' | 'Partial' | 'Unpaid' = 
      balance <= 0 ? 'Paid' : totalPaid > 0 ? 'Partial' : 'Unpaid';

    const existingBalance = studentFeeBalances.find(
      sfb => sfb.studentId === studentId && sfb.term === currentTerm && sfb.academicYear === currentAcademicYear
    );

    if (existingBalance) {
      setStudentFeeBalances(studentFeeBalances.map(sfb =>
        sfb.id === existingBalance.id
          ? { ...sfb, totalPaid, balance, status }
          : sfb
      ));
    } else {
      const newBalance: StudentFeeBalance = {
        id: studentFeeBalances.length + 1,
        studentId,
        classId: student.classId,
        term: currentTerm,
        academicYear: currentAcademicYear,
        totalFeeRequired,
        totalPaid,
        balance,
        status,
      };
      setStudentFeeBalances([...studentFeeBalances, newBalance]);
    }
  };

  const linkParentToStudent = (parentId: number, studentId: number) => {
    // Update parent's studentIds array
    setParents(parents.map(p => {
      if (p.id === parentId) {
        const studentIds = p.studentIds.includes(studentId) ? p.studentIds : [...p.studentIds, studentId];
        return { ...p, studentIds };
      }
      return p;
    }));

    // Update student's parentId
    setStudents(students.map(s => (s.id === studentId ? { ...s, parentId } : s)));
  };

  // User Methods
  const addUser = (user: Omit<User, 'id'>) => {
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = { ...user, id: newId };
    setUsers([...users, newUser]);
    return newId;
  };

  const updateUser = (id: number, user: Partial<User>) => {
    setUsers(users.map(u => (u.id === id ? { ...u, ...user } : u)));
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const login = (username: string, password: string): User | null => {
    const user = users.find(u => u.username === username && u.password === password && u.status === 'Active');
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const changePassword = (userId: number, oldPassword: string, newPassword: string): boolean => {
    const user = users.find(u => u.id === userId && u.password === oldPassword);
    if (user) {
      setUsers(users.map(u => (u.id === userId ? { ...u, password: newPassword } : u)));
      return true;
    }
    return false;
  };

  // Notification Methods
  const addNotification = (notification: Omit<Notification, 'id' | 'sentDate' | 'isRead' | 'readBy'>) => {
    const newId = notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1;
    const newNotification: Notification = {
      ...notification,
      id: newId,
      sentDate: new Date().toISOString(),
      isRead: false,
      readBy: [],
    };
    setNotifications([...notifications, newNotification]);
  };

  const markNotificationAsRead = (notificationId: number, userId: number) => {
    setNotifications(notifications.map(n => {
      if (n.id === notificationId && !n.readBy.includes(userId)) {
        return { ...n, readBy: [...n.readBy, userId], isRead: true };
      }
      return n;
    }));
  };

  const getUnreadNotifications = (userId: number, userRole: string): Notification[] => {
    return notifications.filter(n => {
      const isForUser = n.targetAudience === 'all' || n.targetAudience === userRole + 's';
      const isUnread = !n.readBy.includes(userId);
      return isForUser && isUnread;
    });
  };

  const getAllNotifications = (_userId: number, userRole: string): Notification[] => {
    return notifications.filter(n => {
      return n.targetAudience === 'all' || n.targetAudience === userRole + 's';
    }).sort((a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime());
  };

  // Class Helper Methods
  const getClassTeacher = (classId: number): Teacher | null => {
    const cls = classes.find(c => c.id === classId);
    if (!cls || !cls.classTeacherId) return null;
    return teachers.find(t => t.id === cls.classTeacherId) || null;
  };

  const getClassSubjects = (classId: number): SubjectAssignment[] => {
    return subjectAssignments.filter(sa => sa.classId === classId);
  };

  const updateClassStudentCount = (classId: number) => {
    const classStudents = students.filter(s => s.classId === classId && s.status === 'Active');
    setClasses(classes.map(c => 
      c.id === classId ? { ...c, currentStudents: classStudents.length } : c
    ));
  };

  // System Settings Methods
  const updateCurrentTerm = (term: string) => {
    setCurrentTerm(term);
  };

  const updateCurrentAcademicYear = (year: string) => {
    setCurrentAcademicYear(year);
  };

  const getTeacherClassTeacherAssignments = (teacherId: number): number[] => {
    return classes.filter(c => c.classTeacherId === teacherId).map(c => c.id);
  };

  const validateClassTeacherAssignment = (teacherId: number, newClassId: number): { valid: boolean; message: string } => {
    const currentAssignments = getTeacherClassTeacherAssignments(teacherId);
    
    // Check if already assigned to this class
    if (currentAssignments.includes(newClassId)) {
      return { valid: false, message: 'Teacher is already class teacher for this class' };
    }
    
    // Check if limit of 3 classes will be exceeded
    if (currentAssignments.length >= 3) {
      return { 
        valid: false, 
        message: 'Teacher cannot be class teacher for more than 3 classes. Current assignments: ' + currentAssignments.length 
      };
    }
    
    return { valid: true, message: 'Valid assignment' };
  };

  const updateSchoolSettings = (settings: Partial<SchoolSettings>) => {
    setSchoolSettings({ ...schoolSettings, ...settings });
  };

  // Bank Account Settings Methods
  const updateBankAccountSettings = (settings: Omit<BankAccountSettings, 'id' | 'updatedDate'>) => {
    const newSettings: BankAccountSettings = {
      ...settings,
      id: 1,
      updatedDate: new Date().toISOString(),
    };
    setBankAccountSettings(newSettings);
    
    if (currentUser) {
      addActivityLog({
        actor: currentUser.username,
        actorRole: 'Accountant',
        action: 'Update Bank Settings',
        target: settings.bankName,
        ip: '127.0.0.1',
        status: 'Success',
        details: `Updated bank account to ${settings.accountNumber}`,
      });
    }
  };

  const getBankAccountSettings = () => {
    return bankAccountSettings;
  };

  // Activity Log Methods
  const addActivityLog = (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newId = activityLogs.length > 0 ? Math.max(...activityLogs.map(l => l.id)) + 1 : 1;
    const newLog: ActivityLog = {
      ...log,
      id: newId,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs([newLog, ...activityLogs]);
  };

  const getActivityLogs = (filterAction?: string, filterDate?: string): ActivityLog[] => {
    let filtered = activityLogs;
    
    if (filterAction && filterAction !== 'all') {
      filtered = filtered.filter(log => log.action === filterAction);
    }
    
    if (filterDate && filterDate !== 'all') {
      const now = new Date();
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        if (filterDate === 'today') {
          return logDate.toDateString() === now.toDateString();
        } else if (filterDate === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return logDate >= weekAgo;
        } else if (filterDate === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return logDate >= monthAgo;
        }
        return true;
      });
    }
    
    return filtered;
  };

  // Promotion Methods
  const promoteStudent = (studentId: number, newClassId: number, newAcademicYear: string) => {
    const student = students.find(s => s.id === studentId);
    const newClass = classes.find(c => c.id === newClassId);
    
    if (!student || !newClass) return;
    
    setStudents(students.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          classId: newClassId,
          className: newClass.name,
          level: newClass.level,
          academicYear: newAcademicYear,
        };
      }
      return s;
    }));
    
    // Update class student counts
    updateClassStudentCount(student.classId);
    updateClassStudentCount(newClassId);
    
    // Log the promotion activity
    if (currentUser) {
      addActivityLog({
        actor: currentUser.username,
        actorRole: 'Admin',
        action: 'Promote Student',
        target: `${student.firstName} ${student.lastName} → ${newClass.name}`,
        ip: 'System',
        status: 'Success',
        details: `Promoted from ${student.className} to ${newClass.name} for ${newAcademicYear}`,
      });
    }
  };

  const promoteMultipleStudents = (studentIds: number[], classMapping: { [studentId: number]: number }, newAcademicYear: string) => {
    studentIds.forEach(studentId => {
      const newClassId = classMapping[studentId];
      if (newClassId) {
        promoteStudent(studentId, newClassId, newAcademicYear);
      }
    });
  };

  const value: SchoolContextType = {
    // Data
    students,
    teachers,
    parents,
    accountants,
    classes,
    subjects,
    subjectAssignments,
    scores,
    affectiveDomains,
    psychomotorDomains,
    compiledResults,
    payments,
    users,
    currentUser,
    feeStructures,
    studentFeeBalances,
    notifications,
    activityLogs,

    // Settings
    currentTerm,
    currentAcademicYear,
    schoolSettings,
    bankAccountSettings,

    // Methods
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentsByClass,
    fetchStudents,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherAssignments,
    fetchTeachers,
    addParent,
    updateParent,
    deleteParent,
    getParentStudents,
    addAccountant,
    updateAccountant,
    deleteAccountant,
    addClass,
    updateClass,
    deleteClass,
    fetchClasses,
    addSubject,
    updateSubject,
    deleteSubject,
    fetchSubjects,
    addSubjectAssignment,
    updateSubjectAssignment,
    deleteSubjectAssignment,
    getAssignmentsByClass,
    getAssignmentsByTeacher,
    addScore,
    updateScore,
    deleteScore,
    submitScores,
    getScoresByAssignment,
    getScoresByStudent,
    addAffectiveDomain,
    updateAffectiveDomain,
    addPsychomotorDomain,
    updatePsychomotorDomain,
    compileResult,
    updateCompiledResult,
    submitResult,
    approveResult,
    rejectResult,
    getResultsByClass,
    getPendingApprovals,
    addPayment,
    updatePayment,
    verifyPayment,
    getPaymentsByStudent,
    addFeeStructure,
    updateFeeStructure,
    getFeeStructureByClass,
    getStudentFeeBalance,
    updateStudentFeeBalance,
    linkParentToStudent,
    addUser,
    updateUser,
    deleteUser,
    setCurrentUser,
    login,
    changePassword,
    addNotification,
    createNotification: addNotification, // Alias for consistency
    markNotificationAsRead,
    getUnreadNotifications,
    getAllNotifications,
    getClassTeacher,
    getClassSubjects,
    updateClassStudentCount,
    updateCurrentTerm,
    updateCurrentAcademicYear,
    updateSchoolSettings,
    getTeacherClassTeacherAssignments,
    validateClassTeacherAssignment,
    updateBankAccountSettings,
    getBankAccountSettings,
    addActivityLog,
    getActivityLogs,
    promoteStudent,
    promoteMultipleStudents,
    addCompiledResult: compileResult, // Alias for consistency
  };

  return <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>;
}
