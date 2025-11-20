import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const MyCards = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyCards();
    }, []);

    const fetchMyCards = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/cards/my/cards`);
            setCards(response.data.cards);
            setError(null);
        } catch (err) {
            setError('Failed to fetch your business listings');
            console.error('Error fetching cards:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (cardId) => {
        if (!window.confirm('Are you sure you want to delete this business listing?')) {
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/cards/${cardId}`);
            setCards(cards.filter(card => card._id !== cardId));
        } catch (err) {
            console.error('Error deleting business listing:', err);
            alert('Failed to delete business listing');
        }
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
                    onClick={fetchMyCards}
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Business Listings</h1>
                <Link
                    to="/create-card"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto text-center"
                >
                    List New Business
                </Link>
            </div>

            {cards.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-600 text-lg mb-4">You haven't listed any businesses yet.</div>
                    <Link
                        to="/create-card"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        List Your First Business
                    </Link>
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
                                        <p>❤️ {card.likes?.length || 0} likes</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    <Link
                                        to={`/cards/${card._id}`}
                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
                                    >
                                        View
                                    </Link>
                                    <Link
                                        to={`/edit-card/${card._id}`}
                                        className="text-green-600 hover:text-green-800 font-medium text-sm sm:text-base"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(card._id)}
                                        className="text-red-600 hover:text-red-800 font-medium text-sm sm:text-base"
                                    >
                                        Delete
                                    </button>
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-xs sm:text-sm text-gray-500">
                                        Created {new Date(card.createdAt).toLocaleDateString()}
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

export default MyCards;

