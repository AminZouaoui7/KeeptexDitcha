# KeepTex Project

A full-stack web application for a textile company, featuring product management, services, and order processing.

## Project Structure

This project consists of two main parts:

- **Frontend**: React application built with Create React App
- **Backend**: Node.js/Express API with PostgreSQL database

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL (v12 or higher)

## Installation

### 1. Clone the Repository

The repository has already been cloned to your local machine.

### 2. Set Up the Backend

```bash
# Navigate to the backend directory
cd keep-tex-backend

# Install dependencies
npm install

# Create a PostgreSQL database named 'keeptex'
# Make sure PostgreSQL is running on port 5433 with username 'postgres' and password '1234'
# Or update the .env file with your database credentials

# Initialize the database with sample data
node init-database.js

# Start the backend server
npm run dev
```

**Note:** The database initialization script will create a test admin user with the following credentials:
- Email: admin@keeptex.com
- Password: admin123

### 3. Set Up the Frontend

```bash
# Navigate to the frontend directory
cd keep-tex-frontend

# Install dependencies
npm install

# Start the frontend development server
npm start
```

## Environment Configuration

### Backend (.env)

The backend uses the following environment variables:

```
PORT=5000
POSTGRES_URI=postgres://postgres:1234@localhost:5433/keeptex
JWT_SECRET=keep_tex_secret_key_2023
NODE_ENV=development
```

### Frontend

The frontend is configured to connect to the backend API at `http://localhost:5000/api`.

## Features

- User authentication (register, login)
- Product browsing and details
- Services information
- Order processing (A to Z and Pieces Coupees)
- Contact form
- User order management

## Technologies Used

### Frontend
- React
- React Router
- Axios
- Framer Motion (animations)
- FontAwesome (icons)

### Backend
- Node.js
- Express
- Sequelize (PostgreSQL ORM)
- JWT Authentication
- Bcrypt (password hashing)
- Nodemailer (email sending)

## Running the Application

1. Start the backend server: `cd keep-tex-backend && npm run dev`
2. Start the frontend development server: `cd keep-tex-frontend && npm start`
3. Access the application at `http://localhost:3000`

## API Endpoints

- `/api/auth` - Authentication routes
- `/api/products` - Product management
- `/api/services` - Services information
- `/api/contact` - Contact form submission
- `/api/orders` - Order management