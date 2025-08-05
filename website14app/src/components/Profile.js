import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Profile({ user, userData }) {
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        secondaryEmail: '',
        businessName: '',
        phoneNo: '',
        whatsapp: '',
        telegram: '',
        discord: '',
        billingAddress: ''
    });
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (userData) {
            // Preload form with existing data
            setProfileData({
                firstName: userData.firstName || user?.displayName?.split(' ')[0] || '',
                lastName: userData.lastName || user?.displayName?.split(' ').slice(1).join(' ') || '',
                email: userData.email || user?.email || '',
                secondaryEmail: userData.secondaryEmail || '',
                businessName: userData.businessName || '',
                phoneNo: userData.phoneNo || '',
                whatsapp: userData.whatsapp || '',
                telegram: userData.telegram || '',
                discord: userData.discord || '',
                billingAddress: userData.billingAddress || ''
            });
        }
    }, [userData, user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
        setSaved(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSaved(false);

        try {
            await updateDoc(doc(db, 'users', user.uid), {
                ...profileData,
                updatedAt: new Date().toISOString()
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-jetbrains text-4xl font-bold text-black mb-2">
                    Profile Settings
                </h1>
                <p className="text-gray-600">
                    Manage your account information and contact details
                </p>
            </div>

            {/* Profile Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {saved && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                            Profile saved successfully!
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name - Uneditable */}
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                First Name *
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={profileData.firstName}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">This field cannot be edited</p>
                        </div>

                        {/* Last Name - Uneditable */}
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={profileData.lastName}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">This field cannot be edited</p>
                        </div>

                        {/* Email Address - Uneditable */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={profileData.email}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">This field cannot be edited</p>
                        </div>

                        {/* Secondary Email */}
                        <div>
                            <label htmlFor="secondaryEmail" className="block text-sm font-medium text-gray-700 mb-2">
                                Secondary Email
                            </label>
                            <input
                                type="email"
                                id="secondaryEmail"
                                name="secondaryEmail"
                                value={profileData.secondaryEmail}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                                placeholder="Enter secondary email"
                            />
                        </div>

                        {/* Business Name */}
                        <div>
                            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                                Business Name
                            </label>
                            <input
                                type="text"
                                id="businessName"
                                name="businessName"
                                value={profileData.businessName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                                placeholder="Enter business name"
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phoneNo"
                                name="phoneNo"
                                value={profileData.phoneNo}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                                placeholder="Enter phone number"
                            />
                        </div>

                        {/* WhatsApp */}
                        <div>
                            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                                WhatsApp
                            </label>
                            <input
                                type="tel"
                                id="whatsapp"
                                name="whatsapp"
                                value={profileData.whatsapp}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                                placeholder="Enter WhatsApp number"
                            />
                        </div>

                        {/* Telegram */}
                        <div>
                            <label htmlFor="telegram" className="block text-sm font-medium text-gray-700 mb-2">
                                Telegram
                            </label>
                            <input
                                type="text"
                                id="telegram"
                                name="telegram"
                                value={profileData.telegram}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                                placeholder="Enter Telegram username"
                            />
                        </div>

                        {/* Discord */}
                        <div>
                            <label htmlFor="discord" className="block text-sm font-medium text-gray-700 mb-2">
                                Discord
                            </label>
                            <input
                                type="text"
                                id="discord"
                                name="discord"
                                value={profileData.discord}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                                placeholder="Enter Discord username"
                            />
                        </div>
                    </div>

                    {/* Billing Address - Full Width */}
                    <div>
                        <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 mb-2">
                            Billing Address
                        </label>
                        <textarea
                            id="billingAddress"
                            name="billingAddress"
                            value={profileData.billingAddress}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                            placeholder="Enter your billing address"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {loading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 