import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const IntegrationConfigForm = ({ config, fields, onChange, isReadOnly }) => {

    const [showSecrets, setShowSecrets] = useState({});

    const toggleSecret = (fieldId) => {
        setShowSecrets(prev => ({ ...prev, [fieldId]: !prev[fieldId] }));
    };

    return (
        <div className="space-y-4 pt-4 border-t border-gray-100">
            {fields.map((field) => (
                <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                        {/* Icon handling if needed */}
                        {field.type === 'secret' ? (
                            <>
                                <input
                                    type={showSecrets[field.id] ? 'text' : 'password'}
                                    className={`w-full pl-3 pr-10 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500 ${isReadOnly ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'border-gray-300'}`}
                                    value={config[field.id] || ''}
                                    onChange={(e) => !isReadOnly && onChange(field.id, e.target.value)}
                                    placeholder={field.placeholder}
                                    disabled={isReadOnly}
                                    autoComplete="off"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleSecret(field.id)}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                >
                                    {showSecrets[field.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </>
                        ) : field.type === 'select' ? (
                            <select
                                className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500 ${isReadOnly ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'border-gray-300'}`}
                                value={config[field.id] || ''}
                                onChange={(e) => !isReadOnly && onChange(field.id, e.target.value)}
                                disabled={isReadOnly}
                            >
                                {field.options.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500 ${isReadOnly ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'border-gray-300'}`}
                                value={config[field.id] || ''}
                                onChange={(e) => !isReadOnly && onChange(field.id, e.target.value)}
                                placeholder={field.placeholder}
                                disabled={isReadOnly}
                            />
                        )}
                        {isReadOnly && field.type === 'secret' && (
                            <Lock size={12} className="absolute left-[-20px] top-3 text-gray-300" />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default IntegrationConfigForm;
