import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const Home = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/cards`);
                setCards(response.data.cards.slice(0, 6)); // Show only first 6 cards
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cards:', error);
                setLoading(false);
            }
        };

        fetchCards();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="text-center py-8 sm:py-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Welcome to BusinessHub
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
                    Discover local businesses and services in your area
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <Link
                        to="/cards"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block text-sm sm:text-base"
                    >
                        Browse All Businesses
                    </Link>
                    <Link
                        to="/register"
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-block text-sm sm:text-base"
                    >
                        List Your Business
                    </Link>
                </div>
            </div>

            {/* Featured Cards */}
            <div className="py-6 sm:py-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">
                    Featured Businesses
                </h2>

                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {cards.map((card) => (
                            <div key={card._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                {card.image?.url && (
                                    <img
                                        src={card.image.url}
                                        alt={card.image.alt || card.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-4 sm:p-6">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        {card.title}
                                    </h3>
                                    {card.subtitle && (
                                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3">{card.subtitle}</p>
                                    )}
                                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                                        {card.description}
                                    </p>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                        <span className="text-xs sm:text-sm text-gray-500">
                                            {card.likes?.length || 0} likes
                                        </span>
                                        <Link
                                            to={`/cards/${card._id}`}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
                                        >
                                            View Details →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && cards.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No businesses listed yet.</p>
                        <Link
                            to="/register"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Be the first to list your business!
                        </Link>
                    </div>
                )}
            </div>

            {/* Features Section */}
            <div className="py-8 sm:py-12 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Why Choose BusinessHub?
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl">📱</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Easy to Use
                        </h3>
                        <p className="text-gray-600">
                            Create and manage your business listing with our intuitive interface
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl">🔒</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Secure
                        </h3>
                        <p className="text-gray-600">
                            Your business data is protected with industry-standard security
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl">👥</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Local Focus
                        </h3>
                        <p className="text-gray-600">
                            Connect with local customers and grow your business
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
