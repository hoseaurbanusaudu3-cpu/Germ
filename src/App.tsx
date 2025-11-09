import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { AccountantDashboard } from "./components/AccountantDashboard";
import { ParentDashboard } from "./components/ParentDashboard";
import { ResultReportCard } from "./components/ResultReportCard";
import { Toaster } from "./components/ui/sonner";
import { SchoolProvider } from "./contexts/SchoolContext";

type Page = "landing" | "login" | "dashboard" | "report-card";
type Role = "" | "admin" | "teacher" | "accountant" | "parent";

export default function App() {
  // Initialize state from localStorage to persist across page refreshes
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const savedPage = localStorage.getItem('currentPage');
    return (savedPage as Page) || "landing";
  });
  
  const [userRole, setUserRole] = useState<Role>(() => {
    const savedRole = localStorage.getItem('userRole');
    return (savedRole as Role) || "";
  });
  
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem('userRole', userRole);
  }, [userRole]);

  // Check if user is authenticated on mount and restore session
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const currentUser = localStorage.getItem('currentUser');
    const savedPage = localStorage.getItem('currentPage');
    const savedRole = localStorage.getItem('userRole');
    
    // If user has valid auth token, restore their session
    if (authToken && currentUser) {
      // User is authenticated, restore their page and role
      if (savedPage && savedRole) {
        setCurrentPage(savedPage as Page);
        setUserRole(savedRole as Role);
      }
    } else {
      // No auth token - redirect to login if on protected pages
      if (currentPage === 'dashboard' || currentPage === 'report-card') {
        setCurrentPage('login');
        setUserRole('');
        localStorage.removeItem('currentPage');
        localStorage.removeItem('userRole');
      }
    }
  }, []);

  const handlePageTransition = (page: Page, role?: Role) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      if (role !== undefined) {
        setUserRole(role);
      }
      setIsTransitioning(false);
    }, 300);
  };

  const handleNavigateToLogin = () => {
    handlePageTransition("login");
  };

  const handleNavigateToLanding = () => {
    handlePageTransition("landing", "");
  };

  const handleLogin = (role: Role) => {
    handlePageTransition("dashboard", role);
  };

  const handleLogout = () => {
    // Clear localStorage on logout
    localStorage.removeItem('currentPage');
    localStorage.removeItem('userRole');
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    handlePageTransition("landing", "");
  };

  const handleCloseReportCard = () => {
    handlePageTransition("dashboard");
  };

  return (
    <SchoolProvider>
      <div className={`transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
        {currentPage === "landing" && (
          <LandingPage 
            onNavigateToLogin={handleNavigateToLogin}
          />
        )}

        {currentPage === "login" && (
          <LoginPage
            onLogin={handleLogin}
            onNavigateToLanding={handleNavigateToLanding}
          />
        )}

        {currentPage === "dashboard" && userRole === "admin" && (
          <AdminDashboard onLogout={handleLogout} />
        )}

        {currentPage === "dashboard" && userRole === "teacher" && (
          <TeacherDashboard onLogout={handleLogout} />
        )}

        {currentPage === "dashboard" && userRole === "accountant" && (
          <AccountantDashboard onLogout={handleLogout} />
        )}

        {currentPage === "dashboard" && userRole === "parent" && (
          <ParentDashboard onLogout={handleLogout} />
        )}

        {currentPage === "report-card" && (
          <ResultReportCard onClose={handleCloseReportCard} />
        )}

        {currentPage === "test-forms" && (
          <TestFormsPage />
        )}

        <Toaster />
      </div>
    </SchoolProvider>
  );
}