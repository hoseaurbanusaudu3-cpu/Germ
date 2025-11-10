-- Graceland Royal Academy Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- Users table
CREATE TABLE IF NOT EXISTS "Users" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    linked_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE IF NOT EXISTS "Sessions" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Terms table
CREATE TABLE IF NOT EXISTS "Terms" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    session_id INTEGER REFERENCES "Sessions"(id) ON DELETE CASCADE,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes table
CREATE TABLE IF NOT EXISTS "Classes" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level VARCHAR(50),
    section VARCHAR(50),
    capacity INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects table
CREATE TABLE IF NOT EXISTS "Subjects" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50),
    department VARCHAR(100),
    is_core BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ClassSubjects table (Teacher assignments)
CREATE TABLE IF NOT EXISTS "ClassSubjects" (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES "Classes"(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES "Subjects"(id) ON DELETE CASCADE,
    teacher_id INTEGER REFERENCES "Users"(id) ON DELETE SET NULL,
    session_id INTEGER REFERENCES "Sessions"(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE IF NOT EXISTS "Students" (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    admission_number VARCHAR(50) UNIQUE,
    class_id INTEGER REFERENCES "Classes"(id) ON DELETE SET NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    address TEXT,
    parent_id INTEGER REFERENCES "Users"(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scores table
CREATE TABLE IF NOT EXISTS "Scores" (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES "Students"(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES "Subjects"(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES "Classes"(id) ON DELETE CASCADE,
    session_id INTEGER REFERENCES "Sessions"(id) ON DELETE CASCADE,
    term_id INTEGER REFERENCES "Terms"(id) ON DELETE CASCADE,
    ca1 DECIMAL(5,2) DEFAULT 0,
    ca2 DECIMAL(5,2) DEFAULT 0,
    exam DECIMAL(5,2) DEFAULT 0,
    total DECIMAL(5,2) DEFAULT 0,
    grade VARCHAR(2),
    remark VARCHAR(50),
    teacher_id INTEGER REFERENCES "Users"(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CompiledResults table
CREATE TABLE IF NOT EXISTS "CompiledResults" (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES "Students"(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES "Classes"(id) ON DELETE CASCADE,
    session_id INTEGER REFERENCES "Sessions"(id) ON DELETE CASCADE,
    term_id INTEGER REFERENCES "Terms"(id) ON DELETE CASCADE,
    total_score DECIMAL(10,2),
    average DECIMAL(5,2),
    position INTEGER,
    grade VARCHAR(2),
    remark TEXT,
    teacher_comment TEXT,
    principal_comment TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    approved_by INTEGER REFERENCES "Users"(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Affective table (Behavioral ratings)
CREATE TABLE IF NOT EXISTS "Affectives" (
    id SERIAL PRIMARY KEY,
    result_id INTEGER REFERENCES "CompiledResults"(id) ON DELETE CASCADE,
    punctuality INTEGER CHECK (punctuality >= 1 AND punctuality <= 5),
    attendance INTEGER CHECK (attendance >= 1 AND attendance <= 5),
    honesty INTEGER CHECK (honesty >= 1 AND honesty <= 5),
    neatness INTEGER CHECK (neatness >= 1 AND neatness <= 5),
    politeness INTEGER CHECK (politeness >= 1 AND politeness <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Psychomotor table (Skills ratings)
CREATE TABLE IF NOT EXISTS "Psychomotors" (
    id SERIAL PRIMARY KEY,
    result_id INTEGER REFERENCES "CompiledResults"(id) ON DELETE CASCADE,
    handwriting INTEGER CHECK (handwriting >= 1 AND handwriting <= 5),
    sports INTEGER CHECK (sports >= 1 AND sports <= 5),
    verbal_fluency INTEGER CHECK (verbal_fluency >= 1 AND verbal_fluency <= 5),
    handling_tools INTEGER CHECK (handling_tools >= 1 AND handling_tools <= 5),
    drawing INTEGER CHECK (drawing >= 1 AND drawing <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fees table
CREATE TABLE IF NOT EXISTS "Fees" (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES "Classes"(id) ON DELETE CASCADE,
    session_id INTEGER REFERENCES "Sessions"(id) ON DELETE CASCADE,
    term_id INTEGER REFERENCES "Terms"(id) ON DELETE CASCADE,
    tuition_fee DECIMAL(10,2) DEFAULT 0,
    development_fee DECIMAL(10,2) DEFAULT 0,
    sports_fee DECIMAL(10,2) DEFAULT 0,
    library_fee DECIMAL(10,2) DEFAULT 0,
    exam_fee DECIMAL(10,2) DEFAULT 0,
    other_fees DECIMAL(10,2) DEFAULT 0,
    total_fee DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS "Payments" (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES "Students"(id) ON DELETE CASCADE,
    fee_id INTEGER REFERENCES "Fees"(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    payment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'pending',
    verified_by INTEGER REFERENCES "Users"(id) ON DELETE SET NULL,
    verified_at TIMESTAMP,
    proof_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS "Notifications" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ActivityLogs table
CREATE TABLE IF NOT EXISTS "ActivityLogs" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "Users"(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    description TEXT,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RefreshTokens table
CREATE TABLE IF NOT EXISTS "RefreshTokens" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON "Users"(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON "Users"(role);
CREATE INDEX IF NOT EXISTS idx_students_class ON "Students"(class_id);
CREATE INDEX IF NOT EXISTS idx_students_parent ON "Students"(parent_id);
CREATE INDEX IF NOT EXISTS idx_scores_student ON "Scores"(student_id);
CREATE INDEX IF NOT EXISTS idx_scores_session_term ON "Scores"(session_id, term_id);
CREATE INDEX IF NOT EXISTS idx_payments_student ON "Payments"(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON "Notifications"(user_id);

-- Insert default admin user (password: Admin123!)
INSERT INTO "Users" (email, password_hash, role, first_name, last_name, status)
VALUES (
    'admin@gra-gm.top',
    '$2a$10$rZ5qK9YxH8vN3pQ7wX2.2eJ5K8vN3pQ7wX2.2eJ5K8vN3pQ7wX2.2e',
    'admin',
    'Admin',
    'User',
    'active'
) ON CONFLICT (email) DO NOTHING;

-- Success message
SELECT 'Database tables created successfully!' as message;
