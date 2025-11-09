import axios, { AxiosInstance, AxiosError } from 'axios';

// ==================== API CONFIGURATION ====================

// Support both Vite (VITE_) and Create React App (REACT_APP_) environment variables
const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) || 
  'http://localhost:8080/api';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    console.log('Request to:', config.url);
    console.log('Token exists:', !!token);
    console.log('Token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set');
    } else {
      console.warn('No token found in localStorage!');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      console.log('401 Unauthorized - clearing token and redirecting to login');
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== HELPER FUNCTIONS ====================

export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// ==================== AUTHENTICATION API ====================

export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    console.log('Attempting login with:', { email: credentials.email });
    const response = await apiClient.post('/auth/login', credentials);
    console.log('Login response:', response.data);
    
    // Backend returns 'accessToken' in data object
    const token = response.data.data?.accessToken || response.data.accessToken;
    const user = response.data.data?.user || response.data.user;
    
    if (token) {
      console.log('Storing token and user in localStorage');
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      console.error('No token in response!', response.data);
    }
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    return { success: true };
  },

  changePassword: async (data: { oldPassword: string; newPassword: string }) => {
    const response = await apiClient.put('/auth/change-password', data);
    return response.data;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },
};

// ==================== ADMISSIONS API ====================

export const admissionsAPI = {
  getStatus: async () => {
    const response = await apiClient.get('/admissions/status');
    return response.data;
  },

  apply: async (applicationData: any) => {
    const response = await apiClient.post('/admissions/apply', applicationData);
    return response.data;
  },
};

// ==================== USERS API ====================

export const usersAPI = {
  create: async (userData: any) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  update: async (id: number, userData: any) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};

// ==================== CLASSES API ====================

export const classesAPI = {
  create: async (classData: any) => {
    const response = await apiClient.post('/classes', classData);
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get('/classes');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/classes/${id}`);
    return response.data;
  },

  update: async (id: number, classData: any) => {
    const response = await apiClient.put(`/classes/${id}`, classData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/classes/${id}`);
    return response.data;
  },

  getStudents: async (classId: number) => {
    const response = await apiClient.get(`/class/${classId}/students`);
    return response.data;
  },
};

// ==================== SUBJECTS API ====================

export const subjectsAPI = {
  create: async (subjectData: any) => {
    const response = await apiClient.post('/subjects', subjectData);
    return response.data;
  },

  getAll: async (params?: { classId?: number }) => {
    const response = await apiClient.get('/subjects', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/subjects/${id}`);
    return response.data;
  },

  update: async (id: number, subjectData: any) => {
    const response = await apiClient.put(`/subjects/${id}`, subjectData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/subjects/${id}`);
    return response.data;
  },
};

// ==================== CLASS-SUBJECTS (ASSIGNMENTS) API ====================

export const classSubjectsAPI = {
  create: async (assignmentData: any) => {
    const response = await apiClient.post('/class-subjects', assignmentData);
    return response.data;
  },

  getAll: async (params?: { teacherId?: number; classId?: number }) => {
    const response = await apiClient.get('/class-subjects', { params });
    return response.data;
  },

  update: async (id: number, assignmentData: any) => {
    const response = await apiClient.put(`/class-subjects/${id}`, assignmentData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/class-subjects/${id}`);
    return response.data;
  },
};

// ==================== STUDENTS API ====================

export const studentsAPI = {
  create: async (studentData: any) => {
    const response = await apiClient.post('/students', studentData);
    return response.data;
  },

  getAll: async (params?: { parentId?: number; classId?: number }) => {
    const response = await apiClient.get('/students', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/students/${id}`);
    return response.data;
  },

  update: async (id: number, studentData: any) => {
    const response = await apiClient.put(`/students/${id}`, studentData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/students/${id}`);
    return response.data;
  },

  linkParent: async (studentId: number, parentData: any) => {
    const response = await apiClient.post(`/students/${studentId}/link-parent`, parentData);
    return response.data;
  },
};

// ==================== SESSIONS API ====================

export const sessionsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/sessions');
    return response.data;
  },

  activate: async (sessionId: number) => {
    const response = await apiClient.put(`/sessions/${sessionId}/activate`);
    return response.data;
  },
};

// ==================== TERMS API ====================

export const termsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/terms');
    return response.data;
  },

  activate: async (termId: number) => {
    const response = await apiClient.put(`/terms/${termId}/activate`);
    return response.data;
  },
};

// ==================== SCORES API ====================

export const scoresAPI = {
  bulkCreate: async (scoresData: any[]) => {
    const response = await apiClient.post('/scores/bulk', { scores: scoresData });
    return response.data;
  },

  submit: async (scoreIds: number[]) => {
    const response = await apiClient.post('/scores/submit', { scoreIds });
    return response.data;
  },

  getByClass: async (classId: number, params?: { subjectId?: number; term?: string; session?: string }) => {
    const response = await apiClient.get(`/scores/class/${classId}`, { params });
    return response.data;
  },

  export: async (params: { class?: number; subject?: number; term?: string; session?: string }) => {
    const response = await apiClient.get('/scores/export', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  import: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/scores/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// ==================== COMPILED RESULTS API ====================

export const compiledResultsAPI = {
  getByClass: async (classId: number, params?: { term?: string; session?: string }) => {
    const response = await apiClient.get(`/compiled/${classId}`, { params });
    return response.data;
  },

  save: async (classId: number, resultData: any) => {
    const response = await apiClient.post(`/compiled/${classId}/save`, resultData);
    return response.data;
  },

  submit: async (classId: number) => {
    const response = await apiClient.post(`/compiled/${classId}/submit`);
    return response.data;
  },

  getStudentResult: async (studentId: number, params?: { term?: string; session?: string }) => {
    const response = await apiClient.get(`/results/student/${studentId}`, { params });
    return response.data;
  },

  getStudentResultPDF: async (studentId: number, params?: { term?: string; session?: string }) => {
    const response = await apiClient.get(`/results/student/${studentId}/pdf`, { 
      params,
      responseType: 'blob'
    });
    return response.data;
  },
};

// ==================== RESULTS API ====================

export const resultsAPI = {
  getPending: async () => {
    const response = await apiClient.get('/results/pending');
    return response.data;
  },

  approve: async (resultId: number, approvalData?: any) => {
    const response = await apiClient.post(`/results/${resultId}/approve`, approvalData);
    return response.data;
  },

  reject: async (resultId: number, rejectionData: { reason: string }) => {
    const response = await apiClient.post(`/results/${resultId}/reject`, rejectionData);
    return response.data;
  },
};

// ==================== FEES API ====================

export const feesAPI = {
  create: async (feeData: any) => {
    const response = await apiClient.post('/fees', feeData);
    return response.data;
  },

  getAll: async (params?: { class?: number; term?: string; session?: string }) => {
    const response = await apiClient.get('/fees', { params });
    return response.data;
  },

  update: async (id: number, feeData: any) => {
    const response = await apiClient.put(`/fees/${id}`, feeData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/fees/${id}`);
    return response.data;
  },
};

// ==================== PAYMENTS API ====================

export const paymentsAPI = {
  create: async (paymentData: any) => {
    const response = await apiClient.post('/payments', paymentData);
    return response.data;
  },

  manual: async (paymentData: any) => {
    const response = await apiClient.post('/payments/manual', paymentData);
    return response.data;
  },

  verify: async (paymentId: number) => {
    const response = await apiClient.post(`/payments/${paymentId}/verify`);
    return response.data;
  },

  getPending: async () => {
    const response = await apiClient.get('/payments/pending');
    return response.data;
  },

  uploadProof: async (file: File, paymentData?: any) => {
    const formData = new FormData();
    formData.append('proof', file);
    if (paymentData) {
      Object.keys(paymentData).forEach(key => {
        formData.append(key, paymentData[key]);
      });
    }
    const response = await apiClient.post(`/payments/proof`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getByStudent: async (studentId: number) => {
    const response = await apiClient.get(`/payments/student/${studentId}`);
    return response.data;
  },
};

// ==================== NOTIFICATIONS API ====================

export const notificationsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/notifications');
    return response.data;
  },

  send: async (notificationData: any) => {
    const response = await apiClient.post('/notifications/send', notificationData);
    return response.data;
  },

  markAsRead: async (notificationId: number) => {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  delete: async (notificationId: number) => {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};

// ==================== PROMOTIONS API ====================

export const promotionsAPI = {
  compute: async (params: { session: string }) => {
    const response = await apiClient.post('/promotions/compute', null, { params });
    return response.data;
  },

  promoteStudents: async (promotionData: any) => {
    const response = await apiClient.post('/promotions/promote', promotionData);
    return response.data;
  },
};

// ==================== TEACHERS API ====================

export const teachersAPI = {
  create: async (teacherData: any) => {
    const response = await apiClient.post('/teachers', teacherData);
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get('/teachers');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/teachers/${id}`);
    return response.data;
  },

  update: async (id: number, teacherData: any) => {
    const response = await apiClient.put(`/teachers/${id}`, teacherData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/teachers/${id}`);
    return response.data;
  },
};

// ==================== PARENTS API ====================

export const parentsAPI = {
  create: async (parentData: any) => {
    const response = await apiClient.post('/parents', parentData);
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get('/parents');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/parents/${id}`);
    return response.data;
  },

  update: async (id: number, parentData: any) => {
    const response = await apiClient.put(`/parents/${id}`, parentData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/parents/${id}`);
    return response.data;
  },
};

// ==================== ACCOUNTANTS API ====================

export const accountantsAPI = {
  create: async (accountantData: any) => {
    const response = await apiClient.post('/accountants', accountantData);
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get('/accountants');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/accountants/${id}`);
    return response.data;
  },

  update: async (id: number, accountantData: any) => {
    const response = await apiClient.put(`/accountants/${id}`, accountantData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/accountants/${id}`);
    return response.data;
  },
};

// ==================== ACTIVITY LOGS API ====================

export const activityLogsAPI = {
  getAll: async (params?: { action?: string; date?: string }) => {
    const response = await apiClient.get('/activity-logs', { params });
    return response.data;
  },
};

// ==================== SETTINGS API ====================

export const settingsAPI = {
  getSchool: async () => {
    const response = await apiClient.get('/settings/school');
    return response.data;
  },

  updateSchool: async (settingsData: any) => {
    const response = await apiClient.put('/settings/school', settingsData);
    return response.data;
  },

  getBankAccount: async () => {
    const response = await apiClient.get('/settings/bank-account');
    return response.data;
  },

  updateBankAccount: async (bankData: any) => {
    const response = await apiClient.put('/settings/bank-account', bankData);
    return response.data;
  },
};

// ==================== EXPORT ALL ====================

export default {
  auth: authAPI,
  admissions: admissionsAPI,
  users: usersAPI,
  classes: classesAPI,
  subjects: subjectsAPI,
  classSubjects: classSubjectsAPI,
  students: studentsAPI,
  sessions: sessionsAPI,
  terms: termsAPI,
  scores: scoresAPI,
  compiledResults: compiledResultsAPI,
  results: resultsAPI,
  fees: feesAPI,
  payments: paymentsAPI,
  notifications: notificationsAPI,
  promotions: promotionsAPI,
  teachers: teachersAPI,
  parents: parentsAPI,
  accountants: accountantsAPI,
  activityLogs: activityLogsAPI,
  settings: settingsAPI,
};
