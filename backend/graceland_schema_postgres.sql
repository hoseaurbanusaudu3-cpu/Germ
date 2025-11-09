-- Graceland Royal Academy Database Schema
-- PostgreSQL (Supabase Compatible)

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  role VARCHAR(20) NOT NULL DEFAULT 'teacher' CHECK (role IN ('admin', 'teacher', 'class_teacher', 'accountant', 'parent')),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20) DEFAULT NULL,
  password_hash VARCHAR(255) NOT NULL,
  status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  last_login TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_is_active ON sessions(is_active);

-- Terms table
CREATE TABLE IF NOT EXISTS terms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  session_id INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  start_date DATE DEFAULT NULL,
  end_date DATE DEFAULT NULL,
  next_term_begins DATE DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

CREATE INDEX idx_terms_session_id ON terms(session_id);
CREATE INDEX idx_terms_is_active ON terms(is_active);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  level VARCHAR(50) NOT NULL,
  class_teacher_id INTEGER DEFAULT NULL,
  capacity INTEGER DEFAULT 40,
  status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_teacher_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_classes_level ON classes(level);
CREATE INDEX idx_classes_class_teacher_id ON classes(class_teacher_id);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(20) DEFAULT NULL UNIQUE,
  is_core BOOLEAN DEFAULT TRUE,
  status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Class Subjects (Teacher Assignments)
CREATE TABLE IF NOT EXISTS class_subjects (
  id SERIAL PRIMARY KEY,
  class_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  teacher_id INTEGER NOT NULL,
  session_id INTEGER DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL,
  UNIQUE (class_id, subject_id, session_id)
);

CREATE INDEX idx_class_subjects_teacher_id ON class_subjects(teacher_id);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  reg_no VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL,
  dob DATE NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female')),
  class_id INTEGER NOT NULL,
  parent_id INTEGER DEFAULT NULL,
  photo_path VARCHAR(255) DEFAULT NULL,
  genotype VARCHAR(10) DEFAULT NULL,
  blood_group VARCHAR(10) DEFAULT NULL,
  health_note TEXT DEFAULT NULL,
  address TEXT DEFAULT NULL,
  parent_phone VARCHAR(20) DEFAULT NULL,
  parent_email VARCHAR(100) DEFAULT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'withdrawn')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE RESTRICT,
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_students_reg_no ON students(reg_no);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_parent_id ON students(parent_id);
CREATE INDEX idx_students_status ON students(status);

-- Scores table
CREATE TABLE IF NOT EXISTS scores (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  class_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  term_id INTEGER NOT NULL,
  session_id INTEGER NOT NULL,
  ca1 DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (ca1 >= 0 AND ca1 <= 20),
  ca2 DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (ca2 >= 0 AND ca2 <= 20),
  exam DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (exam >= 0 AND exam <= 60),
  total DECIMAL(5,2) NOT NULL DEFAULT 0,
  grade VARCHAR(2) DEFAULT NULL,
  remark VARCHAR(50) DEFAULT NULL,
  class_average DECIMAL(5,2) DEFAULT NULL,
  class_min DECIMAL(5,2) DEFAULT NULL,
  class_max DECIMAL(5,2) DEFAULT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'locked')),
  submitted_by INTEGER DEFAULT NULL,
  submitted_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (student_id, subject_id, term_id, session_id)
);

CREATE INDEX idx_scores_class_id ON scores(class_id);
CREATE INDEX idx_scores_status ON scores(status);

-- Compiled Results table
CREATE TABLE IF NOT EXISTS compiled_results (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  class_id INTEGER NOT NULL,
  term_id INTEGER NOT NULL,
  session_id INTEGER NOT NULL,
  total_score DECIMAL(8,2) NOT NULL DEFAULT 0,
  average DECIMAL(5,2) NOT NULL DEFAULT 0,
  position INTEGER DEFAULT NULL,
  total_students INTEGER DEFAULT NULL,
  times_present INTEGER DEFAULT 0,
  times_absent INTEGER DEFAULT 0,
  class_teacher_comment TEXT DEFAULT NULL,
  principal_comment TEXT DEFAULT NULL,
  remarks TEXT DEFAULT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  submitted_by INTEGER DEFAULT NULL,
  submitted_at TIMESTAMP DEFAULT NULL,
  approved_by INTEGER DEFAULT NULL,
  approved_at TIMESTAMP DEFAULT NULL,
  rejection_reason TEXT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (student_id, term_id, session_id)
);

CREATE INDEX idx_compiled_results_class_id ON compiled_results(class_id);
CREATE INDEX idx_compiled_results_status ON compiled_results(status);

-- Affective Domain table
CREATE TABLE IF NOT EXISTS affective (
  id SERIAL PRIMARY KEY,
  compiled_id INTEGER NOT NULL,
  attribute VARCHAR(100) NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  remark VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (compiled_id) REFERENCES compiled_results(id) ON DELETE CASCADE
);

CREATE INDEX idx_affective_compiled_id ON affective(compiled_id);

-- Psychomotor Domain table
CREATE TABLE IF NOT EXISTS psychomotor (
  id SERIAL PRIMARY KEY,
  compiled_id INTEGER NOT NULL,
  attribute VARCHAR(100) NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  remark VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (compiled_id) REFERENCES compiled_results(id) ON DELETE CASCADE
);

CREATE INDEX idx_psychomotor_compiled_id ON psychomotor(compiled_id);

-- Fees table
CREATE TABLE IF NOT EXISTS fees (
  id SERIAL PRIMARY KEY,
  class_id INTEGER NOT NULL,
  session_id INTEGER NOT NULL,
  term_id INTEGER NOT NULL,
  breakdown_json JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE,
  UNIQUE (class_id, session_id, term_id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  class_id INTEGER NOT NULL,
  session_id INTEGER DEFAULT NULL,
  term_id INTEGER DEFAULT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(20) NOT NULL CHECK (method IN ('cash', 'bank_transfer', 'online', 'cheque')),
  reference VARCHAR(100) DEFAULT NULL,
  proof_path VARCHAR(255) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  processed_by INTEGER DEFAULT NULL,
  processed_at TIMESTAMP DEFAULT NULL,
  rejection_reason TEXT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL,
  FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE SET NULL,
  FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_reference ON payments(reference);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL,
  receiver_role VARCHAR(20) NOT NULL DEFAULT 'all' CHECK (receiver_role IN ('all', 'admin', 'teacher', 'class_teacher', 'accountant', 'parent')),
  receiver_id INTEGER DEFAULT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR(255) DEFAULT NULL,
  type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_receiver_id ON notifications(receiver_id);
CREATE INDEX idx_notifications_receiver_role ON notifications(receiver_role);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Activity Log table
CREATE TABLE IF NOT EXISTS activity_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  action VARCHAR(100) NOT NULL,
  target_table VARCHAR(50) DEFAULT NULL,
  target_id INTEGER DEFAULT NULL,
  details_json JSONB DEFAULT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_action ON activity_log(action);
CREATE INDEX idx_activity_log_target_table ON activity_log(target_table);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at);

-- Refresh Tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  is_revoked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- Insert default admin user (password: admin123)
-- You'll need to generate a proper bcrypt hash for the password
INSERT INTO users (role, name, email, phone, password_hash, status) VALUES
('admin', 'System Administrator', 'admin@gra.edu.ng', '+234', '$2a$10$YourHashedPasswordHere', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert default academic session
INSERT INTO sessions (name, is_active) VALUES
('2024/2025', TRUE)
ON CONFLICT (name) DO NOTHING;

-- Insert default terms
INSERT INTO terms (name, session_id, is_active) VALUES
('First Term', 1, TRUE),
('Second Term', 1, FALSE),
('Third Term', 1, FALSE)
ON CONFLICT DO NOTHING;
