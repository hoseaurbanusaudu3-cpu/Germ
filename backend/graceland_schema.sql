-- Graceland Royal Academy Database Schema
-- MySQL 8.0+

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Create database
CREATE DATABASE IF NOT EXISTS graceland_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE graceland_db;

-- Users table
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `role` ENUM('admin', 'teacher', 'class_teacher', 'accountant', 'parent') NOT NULL DEFAULT 'teacher',
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20) DEFAULT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `last_login` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sessions table
CREATE TABLE `sessions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE COMMENT 'e.g., 2024/2025',
  `is_active` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Terms table
CREATE TABLE `terms` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL COMMENT 'e.g., First Term, Second Term',
  `session_id` INT NOT NULL,
  `is_active` BOOLEAN DEFAULT FALSE,
  `start_date` DATE DEFAULT NULL,
  `end_date` DATE DEFAULT NULL,
  `next_term_begins` DATE DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_is_active` (`is_active`),
  FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Classes table
CREATE TABLE `classes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT 'e.g., JSS 1A, SSS 2B',
  `level` VARCHAR(50) NOT NULL COMMENT 'e.g., JSS 1, SSS 2',
  `class_teacher_id` INT DEFAULT NULL,
  `capacity` INT DEFAULT 40,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_level` (`level`),
  KEY `idx_class_teacher_id` (`class_teacher_id`),
  FOREIGN KEY (`class_teacher_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subjects table
CREATE TABLE `subjects` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `code` VARCHAR(20) DEFAULT NULL UNIQUE,
  `is_core` BOOLEAN DEFAULT TRUE COMMENT 'Core subjects are mandatory',
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Class Subjects (Teacher Assignments)
CREATE TABLE `class_subjects` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `class_id` INT NOT NULL,
  `subject_id` INT NOT NULL,
  `teacher_id` INT NOT NULL,
  `session_id` INT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_class_subject_session` (`class_id`, `subject_id`, `session_id`),
  KEY `idx_teacher_id` (`teacher_id`),
  FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Students table
CREATE TABLE `students` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `reg_no` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Registration/Admission Number',
  `full_name` VARCHAR(150) NOT NULL,
  `dob` DATE NOT NULL COMMENT 'Date of Birth',
  `gender` ENUM('Male', 'Female') NOT NULL,
  `class_id` INT NOT NULL,
  `parent_id` INT DEFAULT NULL,
  `photo_path` VARCHAR(255) DEFAULT NULL,
  `genotype` VARCHAR(10) DEFAULT NULL,
  `blood_group` VARCHAR(10) DEFAULT NULL,
  `health_note` TEXT DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `parent_phone` VARCHAR(20) DEFAULT NULL,
  `parent_email` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('active', 'inactive', 'graduated', 'withdrawn') DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reg_no` (`reg_no`),
  KEY `idx_class_id` (`class_id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_status` (`status`),
  FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`parent_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Scores table
CREATE TABLE `scores` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `student_id` INT NOT NULL,
  `class_id` INT NOT NULL,
  `subject_id` INT NOT NULL,
  `term_id` INT NOT NULL,
  `session_id` INT NOT NULL,
  `ca1` DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (`ca1` >= 0 AND `ca1` <= 20),
  `ca2` DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (`ca2` >= 0 AND `ca2` <= 20),
  `exam` DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (`exam` >= 0 AND `exam` <= 60),
  `total` DECIMAL(5,2) NOT NULL DEFAULT 0,
  `grade` VARCHAR(2) DEFAULT NULL,
  `remark` VARCHAR(50) DEFAULT NULL,
  `class_average` DECIMAL(5,2) DEFAULT NULL,
  `class_min` DECIMAL(5,2) DEFAULT NULL,
  `class_max` DECIMAL(5,2) DEFAULT NULL,
  `status` ENUM('draft', 'submitted', 'locked') DEFAULT 'draft',
  `submitted_by` INT DEFAULT NULL,
  `submitted_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_subject_term_session` (`student_id`, `subject_id`, `term_id`, `session_id`),
  KEY `idx_class_id` (`class_id`),
  KEY `idx_status` (`status`),
  FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`term_id`) REFERENCES `terms` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`submitted_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Compiled Results table
CREATE TABLE `compiled_results` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `student_id` INT NOT NULL,
  `class_id` INT NOT NULL,
  `term_id` INT NOT NULL,
  `session_id` INT NOT NULL,
  `total_score` DECIMAL(8,2) NOT NULL DEFAULT 0,
  `average` DECIMAL(5,2) NOT NULL DEFAULT 0,
  `position` INT DEFAULT NULL,
  `total_students` INT DEFAULT NULL,
  `times_present` INT DEFAULT 0,
  `times_absent` INT DEFAULT 0,
  `class_teacher_comment` TEXT DEFAULT NULL,
  `principal_comment` TEXT DEFAULT NULL,
  `remarks` TEXT DEFAULT NULL,
  `status` ENUM('draft', 'submitted', 'approved', 'rejected') DEFAULT 'draft',
  `submitted_by` INT DEFAULT NULL,
  `submitted_at` DATETIME DEFAULT NULL,
  `approved_by` INT DEFAULT NULL,
  `approved_at` DATETIME DEFAULT NULL,
  `rejection_reason` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_term_session` (`student_id`, `term_id`, `session_id`),
  KEY `idx_class_id` (`class_id`),
  KEY `idx_status` (`status`),
  FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`term_id`) REFERENCES `terms` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`submitted_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Affective Domain table
CREATE TABLE `affective` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `compiled_id` INT NOT NULL,
  `attribute` VARCHAR(100) NOT NULL COMMENT 'e.g., Attentiveness, Honesty',
  `score` INT NOT NULL CHECK (`score` >= 1 AND `score` <= 5),
  `remark` VARCHAR(100) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_compiled_id` (`compiled_id`),
  FOREIGN KEY (`compiled_id`) REFERENCES `compiled_results` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Psychomotor Domain table
CREATE TABLE `psychomotor` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `compiled_id` INT NOT NULL,
  `attribute` VARCHAR(100) NOT NULL COMMENT 'e.g., Handwriting, Sports',
  `score` INT NOT NULL CHECK (`score` >= 1 AND `score` <= 5),
  `remark` VARCHAR(100) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_compiled_id` (`compiled_id`),
  FOREIGN KEY (`compiled_id`) REFERENCES `compiled_results` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Fees table
CREATE TABLE `fees` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `class_id` INT NOT NULL,
  `session_id` INT NOT NULL,
  `term_id` INT NOT NULL,
  `breakdown_json` JSON NOT NULL COMMENT 'Fee breakdown object',
  `total_amount` DECIMAL(10,2) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_class_session_term` (`class_id`, `session_id`, `term_id`),
  FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`term_id`) REFERENCES `terms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payments table
CREATE TABLE `payments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `student_id` INT NOT NULL,
  `class_id` INT NOT NULL,
  `session_id` INT DEFAULT NULL,
  `term_id` INT DEFAULT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `method` ENUM('cash', 'bank_transfer', 'online', 'cheque') NOT NULL,
  `reference` VARCHAR(100) DEFAULT NULL COMMENT 'Transaction reference',
  `proof_path` VARCHAR(255) DEFAULT NULL COMMENT 'Payment proof document',
  `description` TEXT DEFAULT NULL,
  `status` ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  `processed_by` INT DEFAULT NULL,
  `processed_at` DATETIME DEFAULT NULL,
  `rejection_reason` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_status` (`status`),
  KEY `idx_reference` (`reference`),
  FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`term_id`) REFERENCES `terms` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`processed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications table
CREATE TABLE `notifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sender_id` INT NOT NULL,
  `receiver_role` ENUM('all', 'admin', 'teacher', 'class_teacher', 'accountant', 'parent') NOT NULL DEFAULT 'all',
  `receiver_id` INT DEFAULT NULL COMMENT 'Specific user or NULL for role-based',
  `title` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `link` VARCHAR(255) DEFAULT NULL,
  `type` ENUM('info', 'warning', 'success', 'error') DEFAULT 'info',
  `is_read` BOOLEAN DEFAULT FALSE,
  `read_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_receiver_id` (`receiver_id`),
  KEY `idx_receiver_role` (`receiver_role`),
  KEY `idx_is_read` (`is_read`),
  FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity Log table
CREATE TABLE `activity_log` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `action` VARCHAR(100) NOT NULL COMMENT 'e.g., CREATE, UPDATE, DELETE',
  `target_table` VARCHAR(50) DEFAULT NULL,
  `target_id` INT DEFAULT NULL,
  `details_json` JSON DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_target_table` (`target_table`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Refresh Tokens table
CREATE TABLE `refresh_tokens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `token` VARCHAR(500) NOT NULL UNIQUE,
  `expires_at` DATETIME NOT NULL,
  `is_revoked` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_token` (`token`),
  KEY `idx_expires_at` (`expires_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: admin123)
INSERT INTO `users` (`role`, `name`, `email`, `phone`, `password_hash`, `status`) VALUES
('admin', 'System Administrator', 'admin@gra.edu.ng', '+234', '$2a$10$YourHashedPasswordHere', 'active');

-- Insert default academic session
INSERT INTO `sessions` (`name`, `is_active`) VALUES
('2024/2025', TRUE);

-- Insert default terms
INSERT INTO `terms` (`name`, `session_id`, `is_active`) VALUES
('First Term', 1, TRUE),
('Second Term', 1, FALSE),
('Third Term', 1, FALSE);

SET FOREIGN_KEY_CHECKS = 1;
