
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Phone, Eye, EyeOff, Shield, CheckCircle2 } from 'lucide-react';
import { useParentStore } from '../../../../store/parentStore';

const ParentLogin = () => {
    const navigate = useNavigate();
    const login = useParentStore(state => state.login);
    const isAuthenticated = useParentStore(state => state.isAuthenticated);

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        mobile: 'parent@gmail.com',
        password: '123456' // Set default as requested earlier
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/parent/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await login(formData.mobile, formData.password);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                navigate('/parent/dashboard', { replace: true });
            }, 1000);
        } else {
            setError(result.message || 'Login failed. Please check your credentials.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <Shield size={32} />
                </div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Parent Portal</h2>
                <p className="text-gray-500 font-medium">
                    Access your ward's academic records
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
                <div className="bg-white py-10 px-4 shadow-2xl shadow-gray-200/50 sm:rounded-3xl sm:px-12 border border-gray-100 relative overflow-hidden">

                    {/* Decorative Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50"></div>

                    <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                        {/* Mobile Number */}
                        <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                                Mobile or Email
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                    <Phone size={18} />
                                </div>
                                <input
                                    id="mobile"
                                    name="mobile"
                                    type="text"
                                    required
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                                    placeholder="Enter registered mobile or email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2 ml-1">
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                                    Password
                                </label>
                                <button type="button" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700">Forgot Password?</button>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-500 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="animate-in fade-in slide-in-from-top-1 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-xs font-bold leading-relaxed flex items-center gap-2">
                                <Shield size={16} className="shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || success}
                            className={`w-full relative flex items-center justify-center py-4 px-4 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-[0.98] transition-all disabled:opacity-100 disabled:bg-gray-400 ${success ? 'bg-green-500 hover:bg-green-500 shadow-green-100' : ''}`}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Authenticating Portal...</span>
                                </div>
                            ) : success ? (
                                <div className="flex items-center gap-2 animate-in zoom-in duration-300">
                                    <CheckCircle2 size={20} />
                                    <span>Welcome Back!</span>
                                </div>
                            ) : (
                                'Sign In to Portal'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-50 text-center">
                        <p className="text-[11px] text-gray-400 leading-relaxed max-w-[200px] mx-auto">
                            Default password is <span className="text-indigo-500 font-bold italic">123456</span> unless changed by user.
                        </p>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-gray-400">
                    &copy; 2024 Education CRM. All academic rights reserved.
                </p>
            </div>
        </div>
    );
};

export default ParentLogin;
