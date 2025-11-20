import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const CardsGallery = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/cards`);
            setCards(response.data.cards);
            setError(null);
        } catch (err) {
            setError('Failed to fetch business listings. Please make sure the backend server is running.');
            console.error('Error fetching business listings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (cardId) => {
        if (!isAuthenticated) {
            alert('Please login to like business listings');
            return;
        }

        try {
            const response = await axios.patch(`${API_BASE_URL}/cards/${cardId}/like`);
            setCards(cards.map(card =>
                card._id === cardId
                    ? { ...card, likes: response.data.card.likes }
                    : card
            ));
        } catch (err) {
            console.error('Error liking card:', err);
        }
    };

    const isLiked = (card) => {
        if (!isAuthenticated || !user) return false;
        return card.likes.some(like => like._id === user.id);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-600 text-lg mb-4">{error}</div>
                <button
                    onClick={fetchCards}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Businesses</h1>
                {isAuthenticated && user?.isBusiness && (
                    <Link
                        to="/create-card"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto text-center"
                    >
                        List Your Business
                    </Link>
                )}
            </div>

            {cards.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-600 text-lg mb-4">No businesses listed yet.</div>
                    {isAuthenticated && user?.isBusiness ? (
                        <Link
                            to="/create-card"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            List the first business!
                        </Link>
                    ) : (
                        <Link
                            to="/register"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Register to list your business!
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {cards.map((card) => (
                        <div key={card._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            {card.image?.url && (
                                <img
                                    src={card.image.url}
                                    alt={card.image.alt || card.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                    {card.title}
                                </h3>
                                {card.subtitle && (
                                    <p className="text-sm sm:text-base text-gray-600 mb-3">{card.subtitle}</p>
                                )}
                                <p className="text-sm sm:text-base text-gray-700 mb-4 line-clamp-3">
                                    {card.description}
                                </p>

                                <div className="mb-4">
                                    <div className="text-xs sm:text-sm text-gray-500 space-y-1">
                                        <p>📍 {card.address.city}, {card.address.country}</p>
                                        <p>📞 {card.phone}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <button
                                        onClick={() => handleLike(card._id)}
                                        className={`flex items-center space-x-1 px-3 py-1.5 rounded-full transition-colors text-sm ${isLiked(card)
                                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        <span>❤️</span>
                                        <span>{card.likes?.length || 0}</span>
                                    </button>

                                    <Link
                                        to={`/cards/${card._id}`}
                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
                                    >
                                        View Details →
                                    </Link>
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-xs sm:text-sm text-gray-500">
                                        Created by {card.createdBy?.firstName} {card.createdBy?.lastName}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CardsGallery;

