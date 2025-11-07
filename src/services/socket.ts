import { io, Socket } from 'socket.io-client';

// Support both Vite (VITE_) and Create React App (REACT_APP_) environment variables
const SOCKET_URL = 
  import.meta.env.VITE_SOCKET_URL || 
  (typeof process !== 'undefined' && process.env?.REACT_APP_SOCKET_URL) || 
  'http://localhost:8080';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(token?: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token: token || localStorage.getItem('authToken'),
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });

    // Re-attach all listeners
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.socket?.on(event, callback as any);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);

    if (this.socket) {
      this.socket.on(event, callback as any);
    }
  }

  off(event: string, callback?: Function) {
    if (callback) {
      this.listeners.get(event)?.delete(callback);
      if (this.socket) {
        this.socket.off(event, callback as any);
      }
    } else {
      this.listeners.delete(event);
      if (this.socket) {
        this.socket.off(event);
      }
    }
  }

  emit(event: string, data?: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;

// Event types for type safety
export const SOCKET_EVENTS = {
  // Notifications
  NEW_NOTIFICATION: 'notification:new',
  NOTIFICATION_READ: 'notification:read',
  
  // Results
  RESULT_SUBMITTED: 'result:submitted',
  RESULT_APPROVED: 'result:approved',
  RESULT_REJECTED: 'result:rejected',
  
  // Payments
  PAYMENT_RECEIVED: 'payment:received',
  PAYMENT_VERIFIED: 'payment:verified',
  
  // General
  ANNOUNCEMENT: 'announcement',
  SYSTEM_UPDATE: 'system:update',
} as const;
