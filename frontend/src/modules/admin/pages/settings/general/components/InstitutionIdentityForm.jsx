import React, { useRef } from 'react';
import { Upload, X, Building, Mail, Phone, MapPin } from 'lucide-react';

const InstitutionIdentityForm = ({ values, onChange }) => {

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // In a real app, you would handle the upload here.
            // For now, we simulate a local preview.
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange('logoPreview', reader.result);
                onChange('logoFile', file);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Logo Section */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Institution Logo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group" onClick={() => fileInputRef.current.click()}>
                    {values.logoPreview ? (
                        <div className="relative">
                            <img src={values.logoPreview} alt="Logo" className="max-h-32 object-contain rounded" />
                            <button
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange('logoPreview', null);
                                }}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Upload size={20} />
                            </div>
                            <span className="text-sm text-gray-600 font-medium">Click to upload logo</span>
                            <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</span>
                        </>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
            </div>

            {/* Form Fields */}
            <div className="md:col-span-2 space-y-4">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Building size={18} className="absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            value={values.name}
                            onChange={(e) => onChange('name', e.target.value)}
                            placeholder="e.g. Springfield International School"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-2.5 text-gray-400" />
                            <input
                                type="email"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                value={values.email}
                                onChange={(e) => onChange('email', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                        <div className="relative">
                            <Phone size={18} className="absolute left-3 top-2.5 text-gray-400" />
                            <input
                                type="tel"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                value={values.phone}
                                onChange={(e) => onChange('phone', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
                    <div className="relative">
                        <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                        <textarea
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 min-h-[80px]"
                            value={values.address}
                            onChange={(e) => onChange('address', e.target.value)}
                            placeholder="Street, City, Postcode..."
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InstitutionIdentityForm;
