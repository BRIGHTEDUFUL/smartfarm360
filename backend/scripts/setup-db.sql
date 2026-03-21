-- Database setup script for Smart Farming 360
-- Run this script to create the database and user

-- Create database (run as postgres superuser)
CREATE DATABASE smart_farming_db;

-- Connect to the database
\c smart_farming_db;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant privileges (adjust username as needed)
-- GRANT ALL PRIVILEGES ON DATABASE smart_farming_db TO your_user;
