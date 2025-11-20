# BusinessHub - MERN Stack Business Listing Platform

A full-stack web application for listing and discovering local businesses, built with MongoDB, Express, React, and Node.js.

## 🎯 Project Overview

BusinessHub allows businesses to create listings with their information, and users to browse and discover local services. The platform includes user authentication, role-based access control, and a responsive design.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Git

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FinalProject
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URI=mongodb+srv://krispinraz_db_user:rTAnYGzi8LIjaVG2@cluster0.oq1jfkt.mongodb.net/final_project?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=supersecret123
   PORT=3000
   ```
   
   > **Note:** The demo database is pre-configured and already contains sample business listings. No MongoDB Atlas account needed!

4. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Create frontend environment file (optional)**
   
   Create a `.env` file in the `frontend` directory:
   ```env
   REACT_APP_API_URL=http://localhost:3000
   ```
   (This is the default, so you can skip this step)

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on http://localhost:3000

2. **Start the frontend (in a new terminal)**
   ```bash
   cd frontend
   npm start
   ```
   Frontend runs on http://localhost:3001

3. **Access the application**
   - Open http://localhost:3001 in your browser
   - The demo database already contains 8 sample business listings
   - Test account: `business@example.com` / `business123`


## 📋 Features

### User Roles
- **Regular Users**: Browse businesses, like listings
- **Business Users**: Create and manage their own business listings
- **Admin Users**: Full access to manage all users and listings

### Key Functionality
- User registration and authentication (JWT)
- Create, view, edit, and delete business listings
- Like/unlike businesses
- Responsive design (mobile, tablet, desktop)
- Role-based access control

## 🛠 Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt, Joi  
**Frontend:** React, React Router, Axios, Tailwind CSS

## 📝 Notes

- The demo database is pre-populated with 8 sample business listings
- Test business account: `business@example.com` / `business123`
- All API endpoints are documented in the backend routes
- The application uses JWT tokens for authentication (stored in localStorage)

