import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const CreateCard = () => {
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        phone: '',
        image: {
            url: '',
            alt: ''
        },
        address: {
            state: '',
            country: '',
            city: '',
            street: '',
            houseNumber: '',
            zip: ''
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        if (name.startsWith('image.')) {
            const imageField = name.split('.')[1];
            setFormData({
                ...formData,
                image: {
                    ...formData.image,
                    [imageField]: value
                }
            });
        } else if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [addressField]: type === 'number' ? parseInt(value) || '' : value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }

        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_BASE_URL}/cards`, formData);
            navigate(`/cards/${response.data.card._id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create card');
            console.error('Error creating card:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 lg:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6 sm:mb-8">
                    Create New Business Listing
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Business Name *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            maxLength="100"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g. Olive & Sage Café"
                        />
                    </div>

                    <div>
                        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
                            Business Type or Slogan
                        </label>
                        <input
                            type="text"
                            id="subtitle"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            maxLength="200"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g. Vegan Bistro, Professional Home Cleaning"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Business Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            minLength="10"
                            maxLength="1000"
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe what your business offers, your specialties, and what makes you unique..."
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            maxLength="15"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="052-xxx-xxxx"
                        />
                    </div>

                    {/* Image Information */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="image.url" className="block text-sm font-medium text-gray-700 mb-2">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    id="image.url"
                                    name="image.url"
                                    value={formData.image.url}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://images.unsplash.com/photo-..."
                                />
                            </div>

                            <div>
                                <label htmlFor="image.alt" className="block text-sm font-medium text-gray-700 mb-2">
                                    Image Alt Text
                                </label>
                                <input
                                    type="text"
                                    id="image.alt"
                                    name="image.alt"
                                    value={formData.image.alt}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Business image description"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                                    Country *
                                </label>
                                <input
                                    type="text"
                                    id="country"
                                    name="address.country"
                                    value={formData.address.country}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Israel"
                                />
                            </div>

                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g. Tel Aviv, Ramat Gan, Jerusalem"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                                    Street *
                                </label>
                                <input
                                    type="text"
                                    id="street"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g. Dizengoff Street, Rothschild Boulevard"
                                />
                            </div>

                            <div>
                                <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                    House Number *
                                </label>
                                <input
                                    type="number"
                                    id="houseNumber"
                                    name="address.houseNumber"
                                    value={formData.address.houseNumber}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter house number"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                                    State
                                </label>
                                <input
                                    type="text"
                                    id="state"
                                    name="address.state"
                                    value={formData.address.state}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter state (optional)"
                                />
                            </div>

                            <div>
                                <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-2">
                                    ZIP Code
                                </label>
                                <input
                                    type="number"
                                    id="zip"
                                    name="address.zip"
                                    value={formData.address.zip}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter ZIP code (optional)"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 text-sm sm:text-base"
                        >
                            {loading ? 'Creating...' : 'Create Business Listing'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/my-cards')}
                            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm sm:text-base"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCard;

