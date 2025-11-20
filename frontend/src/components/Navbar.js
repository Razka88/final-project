import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-lg transition-colors duration-200">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">B</span>
                        </div>
                        <span className="text-xl font-bold text-gray-800 dark:text-white">BusinessHub</span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
                        <Link
                            to="/"
                            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/cards"
                            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            Businesses
                        </Link>

                        {isAuthenticated ? (
                            <>
                                {user?.isBusiness && (
                                    <>
                                        <Link
                                            to="/my-cards"
                                            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            My Listings
                                        </Link>
                                        <Link
                                            to="/create-card"
                                            className="bg-blue-600 dark:bg-blue-700 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm lg:text-base"
                                        >
                                            <span className="hidden sm:inline">List Business</span>
                                            <span className="sm:hidden">List</span>
                                        </Link>
                                    </>
                                )}

                                {user?.isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        Admin Panel
                                    </Link>
                                )}

                                {/* User Menu */}
                                <div className="flex items-center space-x-2 lg:space-x-4">
                                    <span className="hidden lg:inline text-gray-600 dark:text-gray-300">
                                        Welcome, {user?.firstName}!
                                    </span>
                                    <ThemeToggle />
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-600 dark:bg-red-700 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors text-sm lg:text-base"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2 lg:space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm lg:text-base"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 dark:bg-blue-700 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm lg:text-base"
                                >
                                    Register
                                </Link>
                                <ThemeToggle />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
