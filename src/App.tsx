import { Suspense, lazy, useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { SchoolProvider } from './contexts/SchoolContext';
import './index.css';

// Lazy load components for better performance
const LandingPage = lazy(() => import("./components/LandingPage").then(module => ({ default: module.LandingPage })));
const LoginPage = lazy(() => import("./components/LoginPage").then(module => ({ default: module.LoginPage })));
const AdminDashboard = lazy(() => import("./components/AdminDashboard").then(module => ({ default: module.AdminDashboard })));
const TeacherDashboard = lazy(() => import("./components/TeacherDashboard").then(module => ({ default: module.TeacherDashboard })));
const AccountantDashboard = lazy(() => import("./components/AccountantDashboard").then(module => ({ default: module.AccountantDashboard })));
const ParentDashboard = lazy(() => import("./components/ParentDashboard").then(module => ({ default: module.ParentDashboard })));
const ResultReportCard = lazy(() => import("./components/ResultReportCard").then(module => ({ default: module.ResultReportCard })));

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
    const currentUser = localStorage.getItem('currentUser');
    const savedPage = localStorage.getItem('currentPage');
    const savedRole = localStorage.getItem('userRole');
    
    // If user has valid user data, restore their session
    if (currentUser) {
      // User is authenticated, restore their page and role
      if (savedPage && savedRole) {
        setCurrentPage(savedPage as Page);
        setUserRole(savedRole as Role);
      }
    } else {
      // No user data - redirect to login if on protected pages
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

  const handleLogin = (role: string) => {
    handlePageTransition("dashboard", role as Role);
  };

  const handleLogout = () => {
    // Clear localStorage on logout (tokens are cleared by backend)
    localStorage.removeItem('currentPage');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    handlePageTransition("landing", "");
  };

  const handleCloseReportCard = () => {
    handlePageTransition("dashboard");
  };

  return (
    <SchoolProvider>
      <div className={`transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading Graceland School...</p>
            </div>
          </div>
        }>
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

          {/* Removed test-forms route due to missing component */}
        </Suspense>
        <Toaster />
      </div>
    </SchoolProvider>
  );
}