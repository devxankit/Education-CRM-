
import React from 'react';
import { MapPin, Mail, Phone, Globe } from 'lucide-react';

const ContactSection = ({ data, onChange, isLocked }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <MapPin size={18} className="text-indigo-600" />
                <h2 className="font-semibold text-gray-800">Contact & Address</h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Registered Address</label>
                    <textarea
                        name="address"
                        value={data.address}
                        onChange={onChange}
                        disabled={isLocked}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                    ></textarea>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">City</label>
                    <input
                        type="text"
                        name="city"
                        value={data.city}
                        onChange={onChange}
                        disabled={isLocked}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">State</label>
                    <input
                        type="text"
                        name="state"
                        value={data.state}
                        onChange={onChange}
                        disabled={isLocked}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Pincode</label>
                    <input
                        type="text"
                        name="pincode"
                        value={data.pincode}
                        onChange={onChange}
                        disabled={isLocked}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Official Phone</label>
                    <div className="relative">
                        <Phone size={16} className="absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            name="phone"
                            value={data.phone}
                            onChange={onChange}
                            disabled={isLocked}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Official Email</label>
                    <div className="relative">
                        <Mail size={16} className="absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={onChange}
                            disabled={isLocked}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="alerts will be sent here"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Website URL</label>
                    <div className="relative">
                        <Globe size={16} className="absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="url"
                            name="website"
                            value={data.website}
                            onChange={onChange}
                            disabled={isLocked}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactSection;
