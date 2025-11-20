import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const CardDetails = () => {
    const { id } = useParams();
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCard();
    }, [id]);

    const fetchCard = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/cards/${id}`);
            setCard(response.data.card);
            setError(null);
        } catch (err) {
            setError('Business listing not found');
            console.error('Error fetching business listing:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!isAuthenticated) {
            alert('Please login to like business listings');
            return;
        }

        try {
            const response = await axios.patch(`${API_BASE_URL}/cards/${id}/like`);
            setCard({ ...card, likes: response.data.card.likes });
        } catch (err) {
            console.error('Error liking card:', err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this business listing?')) {
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/cards/${id}`);
            navigate('/cards');
        } catch (err) {
            console.error('Error deleting business listing:', err);
            alert('Failed to delete business listing');
        }
    };

    const isLiked = () => {
        if (!isAuthenticated || !user || !card) return false;
        return card.likes.some(like => like._id === user.id);
    };

    const canEdit = () => {
        if (!isAuthenticated || !user || !card) return false;
        return card.createdBy._id === user.id || user.isAdmin;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !card) {
        return (
            <div className="text-center py-12">
                <div className="text-red-600 text-lg mb-4">{error || 'Business listing not found'}</div>
                <Link
                    to="/cards"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Back to Businesses
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {card.image?.url && (
                    <img
                        src={card.image.url}
                        alt={card.image.alt || card.title}
                        className="w-full h-48 sm:h-64 md:h-96 object-cover"
                    />
                )}

                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                {card.title}
                            </h1>
                            {card.subtitle && (
                                <p className="text-lg sm:text-xl text-gray-600 mb-4">{card.subtitle}</p>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
                            <button
                                onClick={handleLike}
                                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${isLiked()
                                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <span>❤️</span>
                                <span>{card.likes?.length || 0} likes</span>
                            </button>

                            {canEdit() && (
                                <div className="flex flex-wrap gap-2">
                                    <Link
                                        to={`/edit-card/${card._id}`}
                                        className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="prose max-w-none mb-6 sm:mb-8">
                        <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                            {card.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                            <div className="space-y-2">
                                <p className="flex items-center text-gray-600">
                                    <span className="mr-2">📞</span>
                                    {card.phone}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                            <div className="text-gray-600">
                                <p>{card.address.street} {card.address.houseNumber}</p>
                                <p>{card.address.city}, {card.address.state} {card.address.zip}</p>
                                <p>{card.address.country}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4 sm:pt-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-xs sm:text-sm text-gray-500">
                                    Created by {card.createdBy?.firstName} {card.createdBy?.lastName}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                    {new Date(card.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <Link
                                to="/cards"
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base w-full sm:w-auto text-center"
                            >
                                Back to Businesses
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardDetails;

