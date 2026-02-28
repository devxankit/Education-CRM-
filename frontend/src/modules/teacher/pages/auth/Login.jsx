
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Shield, Mail, KeyRound } from 'lucide-react';
import axios from 'axios';
import { useTeacherStore } from '../../../../store/teacherStore';

const TeacherLogin = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const login = useTeacherStore(state => state.login);
    const requestPasswordReset = useTeacherStore(state => state.requestPasswordReset);
    const resetPasswordWithOtp = useTeacherStore(state => state.resetPasswordWithOtp);

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState('');
    const [localSuccess, setLocalSuccess] = useState('');

    // Forgot password flow
    const [showForgot, setShowForgot] = useState(false);
    const [forgotStep, setForgotStep] = useState(1);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotOtp, setForgotOtp] = useState('');
    const [forgotPassword, setForgotPassword] = useState('');
    const [forgotPasswordConfirm, setForgotPasswordConfirm] = useState('');
    const [forgotEmailMask, setForgotEmailMask] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        teacherId: 'teacher@gmail.com', // This will be used as email for login
        password: '123456'
    });

    useEffect(() => {
        const forgot = searchParams.get('forgot');
        if (forgot === '1' || forgot === 'true') {
            setShowForgot(true);
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setLocalError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setLocalError('');

        try {
            const result = await login(formData.teacherId, formData.password);

            if (result?.success) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
                navigate('/teacher/dashboard', { replace: true });
            } else {
                setLocalError(result?.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setLocalError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLocalError('');
        setLocalSuccess('');
        if (!forgotEmail.trim()) {
            setLocalError('Enter your email');
            return;
        }
        setIsLoading(true);
        const result = await requestPasswordReset(forgotEmail);
        setIsLoading(false);
        if (result.success) {
            setForgotEmailMask(result.email || '');
            setLocalSuccess(result.message || 'OTP sent to your email.');
            setForgotStep(2);
        } else {
            setLocalError(result.message || 'Failed to send OTP');
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        setLocalError('');
        setLocalSuccess('');
        if (!forgotOtp.trim()) {
            setLocalError('Enter the OTP received on your email');
            return;
        }
        if (forgotOtp.trim().length < 4) {
            setLocalError('Enter a valid OTP');
            return;
        }
        setLocalSuccess('OTP verified. Please set your new password.');
        setForgotStep(3);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLocalError('');
        setLocalSuccess('');
        if (forgotPassword.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }
        if (forgotPassword !== forgotPasswordConfirm) {
            setLocalError('Passwords do not match');
            return;
        }
        setIsLoading(true);
        const result = await resetPasswordWithOtp(forgotEmail, forgotOtp, forgotPassword);
        setIsLoading(false);
        if (result.success) {
            setLocalSuccess(result.message || 'Password reset successfully. You can now login.');
            setForgotStep(4);
        } else {
            setLocalError(result.message || 'Failed to reset password');
        }
    };

    const backToLogin = () => {
        setShowForgot(false);
        setForgotStep(1);
        setForgotEmail('');
        setForgotOtp('');
        setForgotPassword('');
        setForgotPasswordConfirm('');
        setForgotEmailMask('');
        setLocalError('');
        setLocalSuccess('');
    };

    const displayError = localError;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg mb-4">
                    <Lock size={24} />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Teacher Portal</h2>
                <p className="mt-2 text-sm text-gray-600">
                    {showForgot ? 'Reset your password' : 'Log in to manage your classes and students'}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
                <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-gray-100">
                    {!showForgot ? (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Teacher ID */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                    <User size={12} /> Teacher Email
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input
                                        id="teacherId"
                                        name="teacherId"
                                        type="email"
                                        required
                                        value={formData.teacherId}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                                        placeholder="teacher@example.com"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                    <Shield size={12} /> Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all pr-10"
                                        placeholder="••••••••"
                                    />
                                    <div
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </div>
                                </div>
                                <div className="mt-1.5 text-right">
                                    <button
                                        type="button"
                                        onClick={() => { setShowForgot(true); setLocalError(''); setLocalSuccess(''); }}
                                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </div>

                            {displayError && (
                                <div className="rounded-md bg-red-50 p-4 border border-red-100">
                                    <h3 className="text-sm font-medium text-red-800">{displayError}</h3>
                                </div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Verifying...
                                        </span>
                                    ) : (
                                        'Teacher Login'
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            {forgotStep === 1 && (
                                <form className="space-y-6" onSubmit={handleSendOtp}>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                            <Mail size={12} /> Email
                                        </label>
                                        <input
                                            type="email"
                                            value={forgotEmail}
                                            onChange={(e) => { setForgotEmail(e.target.value); setLocalError(''); }}
                                            className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="teacher@example.com"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">We will send an OTP to your registered email.</p>
                                    </div>
                                    {displayError && (
                                        <div className="rounded-md bg-red-50 p-4 border border-red-100">
                                            <h3 className="text-sm font-medium text-red-800">{displayError}</h3>
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70"
                                    >
                                        {isLoading ? 'Sending...' : 'Send OTP'}
                                    </button>
                                </form>
                            )}

                            {forgotStep === 2 && (
                                <form className="space-y-6" onSubmit={handleVerifyOtp}>
                                    {localSuccess && (
                                        <div className="rounded-md bg-green-50 p-4 border border-green-100">
                                            <p className="text-sm font-medium text-green-800">
                                                OTP sent to your registered email
                                                {forgotEmailMask && <span className="block text-xs mt-1">Sent to {forgotEmailMask}</span>}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                            <KeyRound size={12} /> OTP
                                        </label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            value={forgotOtp}
                                            onChange={(e) => { setForgotOtp(e.target.value.replace(/\D/g, '')); setLocalError(''); }}
                                            className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono text-lg tracking-widest"
                                            placeholder="000000"
                                        />
                                    </div>
                                    {displayError && (
                                        <div className="rounded-md bg-red-50 p-4 border border-red-100">
                                            <h3 className="text-sm font-medium text-red-800">{displayError}</h3>
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        Verify OTP
                                    </button>
                                </form>
                            )}

                            {forgotStep === 3 && (
                                <form className="space-y-6" onSubmit={handleResetPassword}>
                                    {localSuccess && (
                                        <div className="rounded-md bg-blue-50 p-4 border border-blue-100">
                                            <p className="text-sm font-medium text-blue-800">{localSuccess}</p>
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">New Password</label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={forgotPassword}
                                            onChange={(e) => { setForgotPassword(e.target.value); setLocalError(''); }}
                                            className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Min 6 characters"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">Confirm Password</label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={forgotPasswordConfirm}
                                            onChange={(e) => { setForgotPasswordConfirm(e.target.value); setLocalError(''); }}
                                            className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Re-enter password"
                                        />
                                    </div>
                                    {displayError && (
                                        <div className="rounded-md bg-red-50 p-4 border border-red-100">
                                            <h3 className="text-sm font-medium text-red-800">{displayError}</h3>
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70"
                                    >
                                        {isLoading ? 'Resetting...' : 'Set New Password'}
                                    </button>
                                </form>
                            )}

                            {forgotStep === 4 && (
                                <div className="space-y-4">
                                    <div className="rounded-md bg-green-50 p-4 border border-green-100">
                                        <p className="text-sm font-medium text-green-800">{localSuccess}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={backToLogin}
                                        className="w-full flex justify-center py-2.5 px-4 border border-indigo-600 rounded-lg text-sm font-bold text-indigo-600 hover:bg-indigo-50"
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            )}

                            {(forgotStep === 1 || forgotStep === 2 || forgotStep === 3) && (
                                <div className="mt-4 text-center">
                                    <button
                                        type="button"
                                        onClick={backToLogin}
                                        className="text-xs text-gray-500 hover:text-gray-700"
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {!showForgot && (
                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-400">
                                Teacher credentials are provided by the school administration.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherLogin;
