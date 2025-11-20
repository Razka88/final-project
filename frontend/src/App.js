import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CardsGallery from './pages/CardsGallery';
import CardDetails from './pages/CardDetails';
import MyCards from './pages/MyCards';
import CreateCard from './pages/CreateCard';
import EditCard from './pages/EditCard';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cards" element={<CardsGallery />} />
                <Route path="/cards/:id" element={<CardDetails />} />
                <Route
                  path="/my-cards"
                  element={
                    <ProtectedRoute requiredRole="business">
                      <MyCards />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-card"
                  element={
                    <ProtectedRoute requiredRole="business">
                      <CreateCard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-card/:id"
                  element={
                    <ProtectedRoute requiredRole="business">
                      <EditCard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
