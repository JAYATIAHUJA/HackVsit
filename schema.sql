-- Drop database if exists and create new one
DROP DATABASE IF EXISTS eswasthya_db;
CREATE DATABASE eswasthya_db;
USE eswasthya_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    blood_group VARCHAR(5),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(15),
    email VARCHAR(100),
    website VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hospital_id INT,
    full_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    qualification VARCHAR(100),
    experience_years INT,
    phone VARCHAR(15),
    email VARCHAR(100),
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    doctor_id INT,
    hospital_id INT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    reason TEXT,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

-- Medical Reports table
CREATE TABLE IF NOT EXISTS medical_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    report_type VARCHAR(50),
    report_date DATE,
    file_path VARCHAR(255),
    analysis_result TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Vital Signs table
CREATE TABLE IF NOT EXISTS vital_signs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    blood_pressure VARCHAR(20),
    heart_rate INT,
    temperature DECIMAL(4,2),
    blood_sugar DECIMAL(5,2),
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ABHA Integration table
CREATE TABLE IF NOT EXISTS abha_integration (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    abha_id VARCHAR(50) UNIQUE,
    is_connected BOOLEAN DEFAULT FALSE,
    connected_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Emergency Services table
CREATE TABLE IF NOT EXISTS emergency_services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    location VARCHAR(255),
    emergency_type VARCHAR(50),
    description TEXT,
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Medicine Reminders table
CREATE TABLE IF NOT EXISTS medicine_reminders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    medicine_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    start_date DATE,
    end_date DATE,
    time_slots JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Health Records table
CREATE TABLE IF NOT EXISTS health_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    record_type VARCHAR(50),
    record_date DATE,
    description TEXT,
    file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Doctor Ratings table
CREATE TABLE IF NOT EXISTS doctor_ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    doctor_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
); 