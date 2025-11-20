import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [cards, setCards] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('stats');
    const { user } = useAuth();

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const [usersResponse, cardsResponse, statsResponse] = await Promise.all([
                axios.get(`${API_BASE_URL}/admin/users`),
                axios.get(`${API_BASE_URL}/cards`),
                axios.get(`${API_BASE_URL}/admin/stats`)
            ]);

            setUsers(usersResponse.data.users);
            setCards(cardsResponse.data.cards);
            setStats(statsResponse.data.stats);
            setError(null);
        } catch (err) {
            setError('Failed to fetch admin data');
            console.error('Error fetching admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This will also delete all their business listings.')) {
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/admin/users/${userId}`);
            setUsers(users.filter(u => u._id !== userId));
            // Refresh stats after deletion
            const statsResponse = await axios.get(`${API_BASE_URL}/admin/stats`);
            setStats(statsResponse.data.stats);
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Failed to delete user');
        }
    };

    const handleToggleAdmin = async (userId) => {
        try {
            const response = await axios.patch(`${API_BASE_URL}/admin/users/${userId}/toggle-admin`);
            setUsers(users.map(u =>
                u._id === userId
                    ? { ...u, isAdmin: response.data.user.isAdmin }
                    : u
            ));
        } catch (err) {
            console.error('Error toggling admin status:', err);
            alert('Failed to update admin status');
        }
    };

    const handleDeleteCard = async (cardId) => {
        if (!window.confirm('Are you sure you want to delete this business listing?')) {
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/cards/${cardId}`);
            setCards(cards.filter(c => c._id !== cardId));
            // Refresh stats after deletion
            const statsResponse = await axios.get(`${API_BASE_URL}/admin/stats`);
            setStats(statsResponse.data.stats);
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
                    onClick={fetchAdminData}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'stats'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Statistics
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'users'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Users ({users.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('cards')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'cards'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Businesses ({cards.length})
                    </button>
                </nav>
            </div>

            {/* Stats Tab */}
            {activeTab === 'stats' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <span className="text-2xl">👥</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Users</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <span className="text-2xl">📄</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Businesses</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.totalCards}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <span className="text-2xl">🏢</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Business Users</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.businessUsers}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <span className="text-2xl">👑</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Admin Users</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.adminUsers}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">All Users</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.firstName} {user.lastName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex space-x-2">
                                                {user.isAdmin && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        Admin
                                                    </span>
                                                )}
                                                {user.isBusiness && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        Business
                                                    </span>
                                                )}
                                                {!user.isAdmin && !user.isBusiness && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        Regular
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleToggleAdmin(user._id)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Businesses Tab */}
            {activeTab === 'cards' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <div key={card._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            {card.image?.url && (
                                <img
                                    src={card.image.url}
                                    alt={card.image.alt || card.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {card.title}
                                </h3>
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {card.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        <p>By {card.createdBy?.firstName} {card.createdBy?.lastName}</p>
                                        <p>❤️ {card.likes?.length || 0} likes</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteCard(card._id)}
                                        className="text-red-600 hover:text-red-800 font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;

