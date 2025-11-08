import { useState } from "react";
import { LayoutDashboard, Edit, FileText, Bell, BookOpen, Users, UserCheck, FileSpreadsheet, Lock, LogOut } from "lucide-react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopBar } from "./DashboardTopBar";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AffectivePsychomotorPage } from "./teacher/AffectivePsychomotorPage";
import { ScoreEntryPage } from "./teacher/ScoreEntryPage";
import { CompileResultsPage } from "./teacher/CompileResultsPage";
import { ClassListPage } from "./teacher/ClassListPage";
import { ViewResultsPage } from "./teacher/ViewResultsPage";
import { ChangePasswordPage } from "./ChangePasswordPage";
import { NotificationsPage } from "./NotificationsPage";
import { useSchool } from "../contexts/SchoolContext";

interface TeacherDashboardProps {
  onLogout: () => void;
}

export function TeacherDashboard({ onLogout }: TeacherDashboardProps) {
  const { currentUser, teachers, getTeacherAssignments, students, getUnreadNotifications } = useSchool();
  const [activeItem, setActiveItem] = useState("dashboard");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  // Get current teacher data
  const currentTeacher = currentUser ? teachers.find(t => t.id === currentUser.linkedId) : null;
  const isClassTeacher = currentTeacher?.isClassTeacher || false;
  const teacherName = currentTeacher ? `${currentTeacher.firstName} ${currentTeacher.lastName}` : 'Teacher';
  const teacherAssignments = currentTeacher ? getTeacherAssignments(currentTeacher.id) : [];
  
  // Get unread notifications count
  const unreadNotifications = currentUser ? getUnreadNotifications(currentUser.id, currentUser.role) : [];

  const sidebarItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", id: "dashboard" },
    { icon: <Users className="w-5 h-5" />, label: "Class List", id: "class-list" },
    { icon: <Edit className="w-5 h-5" />, label: "Enter Scores", id: "enter-scores" },
    { icon: <FileSpreadsheet className="w-5 h-5" />, label: "Compile Results", id: "compile-results", classTeacherOnly: true },
    { icon: <UserCheck className="w-5 h-5" />, label: "Affective & Psychomotor", id: "affective-psychomotor", classTeacherOnly: true },
    { icon: <FileText className="w-5 h-5" />, label: "View Results", id: "view-results" },
    { icon: <Bell className="w-5 h-5" />, label: "Notifications", id: "notifications" },
    { icon: <Lock className="w-5 h-5" />, label: "Change Password", id: "change-password" },
    { icon: <LogOut className="w-5 h-5" />, label: "Logout", id: "logout" },
  ].filter(item => !item.classTeacherOnly || isClassTeacher);

  const handleItemClick = (id: string) => {
    if (id === "logout") {
      onLogout();
    } else {
      setActiveItem(id);
    }
  };



  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <DashboardSidebar
        items={sidebarItems}
        activeItem={activeItem}
        onItemClick={handleItemClick}
      />

      <div className="lg:pl-64">
        <DashboardTopBar
          userName={teacherName}
          userRole={isClassTeacher ? "Class Teacher" : "Subject Teacher"}
          notificationCount={unreadNotifications.length}
          onLogout={onLogout}
          onNotificationClick={() => setActiveItem("notifications")}
        />

        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          {activeItem === "dashboard" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h1 className="text-[#1F2937] mb-2">Teacher Dashboard</h1>
                <p className="text-[#6B7280]">
                  {isClassTeacher 
                    ? 'Welcome, Class Teacher. You can enter scores, compile results, and assess students for your class.'
                    : 'Welcome, Subject Teacher. Enter scores for your assigned subjects to submit to the Class Teacher.'
                  }
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <Card className="rounded-lg bg-white border border-[#E5E7EB] shadow-clinical hover:shadow-clinical-lg transition-all hover-lift group">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[#6B7280] text-sm">Role</p>
                      <UserCheck className="w-5 h-5 text-[#F59E0B] group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-[#1F2937] mb-1 font-medium">{isClassTeacher ? "Class Teacher" : "Subject Teacher"}</p>
                    <Badge className={isClassTeacher ? "bg-[#F59E0B] text-white border-0 text-xs" : "bg-[#3B82F6] text-white border-0 text-xs"}>
                      {isClassTeacher ? "Full Access" : "Score Entry"}
                    </Badge>
                  </CardContent>
                </Card>

                <Card 
                  className="rounded-lg bg-white border border-[#E5E7EB] shadow-clinical hover:shadow-clinical-lg transition-all hover-lift group cursor-pointer"
                  onClick={() => setActiveItem('enter-scores')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[#6B7280] text-sm">Classes Assigned</p>
                      <BookOpen className="w-5 h-5 text-[#3B82F6] group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-[#1F2937] mb-1 font-semibold">{teacherAssignments.length}</p>
                    <p className="text-xs text-[#6B7280]">Active classes</p>
                  </CardContent>
                </Card>

                <Card 
                  className="rounded-lg bg-white border border-[#E5E7EB] shadow-clinical hover:shadow-clinical-lg transition-all hover-lift group cursor-pointer"
                  onClick={() => setActiveItem('class-list')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[#6B7280] text-sm">Total Students</p>
                      <Users className="w-5 h-5 text-[#3B82F6] group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-[#1F2937] mb-1 font-semibold">{students.filter(s => s.status === 'Active').length}</p>
                    <p className="text-xs text-[#6B7280]">Across all classes</p>
                  </CardContent>
                </Card>

                <Card 
                  className="rounded-lg bg-white border border-[#E5E7EB] shadow-clinical hover:shadow-clinical-lg transition-all hover-lift group cursor-pointer"
                  onClick={() => setActiveItem('notifications')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[#6B7280] text-sm">Notifications</p>
                      <Bell className="w-5 h-5 text-[#F59E0B] group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-[#1F2937] mb-1 font-semibold">{unreadNotifications.length}</p>
                    <p className="text-xs text-[#F59E0B]">{unreadNotifications.length > 0 ? 'Unread messages' : 'All caught up'}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Role-based Workflow Info */}
              {isClassTeacher ? (
                <Card className="rounded-lg bg-gradient-to-r from-[#F59E0B]/10 to-[#F59E0B]/5 border border-[#F59E0B]/20">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <UserCheck className="w-6 h-6 text-[#F59E0B] mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-[#1F2937] font-medium mb-2">Class Teacher Workflow</p>
                        <ol className="text-sm text-[#6B7280] space-y-1 list-decimal list-inside">
                          <li>Enter scores for subjects you teach (CA1, CA2, Exam)</li>
                          <li>Review and verify all subject teacher submissions for your class</li>
                          <li>Enter Affective & Psychomotor assessments for each student</li>
                          <li>Add class teacher comments on student performance</li>
                          <li>Compile and submit results to Admin for approval</li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="rounded-lg bg-gradient-to-r from-[#3B82F6]/10 to-[#3B82F6]/5 border border-[#3B82F6]/20">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-6 h-6 text-[#3B82F6] mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-[#1F2937] font-medium mb-2">Subject Teacher Workflow</p>
                        <ol className="text-sm text-[#6B7280] space-y-1 list-decimal list-inside">
                          <li>Select your assigned class and subject</li>
                          <li>Enter CA1 (20 marks), CA2 (20 marks), and Exam (60 marks) for each student</li>
                          <li>Scores are auto-calculated with total, grade, and remark</li>
                          <li>Submit scores to the Class Teacher for final compilation</li>
                          <li>Class Teacher will compile all subjects and submit for approval</li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="rounded-lg bg-white border border-[#E5E7EB] shadow-clinical">
                <CardHeader className="p-5 border-b border-[#E5E7EB]">
                  <h3 className="text-[#1F2937]">Your Classes</h3>
                </CardHeader>
                <CardContent className="space-y-3 p-5 pt-5">
                  {teacherAssignments.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
                      <p className="text-[#6B7280]">No class assignments yet</p>
                    </div>
                  ) : (
                    teacherAssignments.map((assignment) => {
                      const classStudents = students.filter(s => s.classId === assignment.classId && s.status === 'Active');
                      return (
                        <div key={assignment.id} className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] hover:border-[#3B82F6] hover:shadow-clinical transition-all">
                          <div>
                            <p className="text-[#1F2937] font-medium">{assignment.className} - {assignment.subjectName}</p>
                            <p className="text-[#6B7280] text-sm">{classStudents.length} students</p>
                          </div>
                          <Button 
                            onClick={() => {
                              setSelectedClass(assignment.className);
                              setSelectedSubject(assignment.subjectName);
                              setActiveItem("enter-scores");
                            }}
                            className="bg-[#3B82F6] text-white hover:bg-[#2563EB] rounded-lg shadow-clinical hover:shadow-clinical-lg transition-all"
                          >
                            Enter Scores
                          </Button>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeItem === "class-list" && <ClassListPage />}
          {activeItem === "enter-scores" && <ScoreEntryPage />}
          {activeItem === "compile-results" && <CompileResultsPage />}
          {activeItem === "affective-psychomotor" && <AffectivePsychomotorPage />}
          {activeItem === "view-results" && <ViewResultsPage />}
          {activeItem === "notifications" && <NotificationsPage />}
          {activeItem === "change-password" && <ChangePasswordPage />}
          
          {!["dashboard", "class-list", "enter-scores", "compile-results", "affective-psychomotor", "view-results", "notifications", "change-password"].includes(activeItem) && (
            <div className="space-y-6">
              <div className="flex items-center justify-center min-h-[400px]">
                <Card className="rounded-lg bg-white border border-[#E5E7EB] shadow-clinical max-w-md w-full">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#3B82F6] flex items-center justify-center mx-auto mb-4 text-white">
                      {sidebarItems.find(item => item.id === activeItem)?.icon}
                    </div>
                    <h3 className="text-[#1F2937] mb-3">
                      {sidebarItems.find(item => item.id === activeItem)?.label}
                    </h3>
                    <p className="text-[#6B7280]">
                      This section contains the functionality for {sidebarItems.find(item => item.id === activeItem)?.label.toLowerCase()}.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
