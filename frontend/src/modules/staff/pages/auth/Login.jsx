
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Briefcase, Eye, EyeOff, Shield } from 'lucide-react';
import { STAFF_ROLES } from '../../config/roles';
import { useStaffAuth } from '../../context/StaffAuthContext';
import { loginStaff, getPublicRoles } from '../../services/auth.api';

const StaffLogin = () => {
    const navigate = useNavigate();
    const { login, user } = useStaffAuth(); // Use the strict auth context
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [availableRoles, setAvailableRoles] = useState([]);

    // Redirect if already logged in
    React.useEffect(() => {
        if (user && user.role) {
            navigate('/staff/dashboard', { replace: true });
        }
    }, [user, navigate]);

    // Fetch Roles
    React.useEffect(() => {
        const fetchRoles = async () => {
            const roles = await getPublicRoles();
            setAvailableRoles(roles);
        };
        fetchRoles();
    }, []);

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: '' // Added role back to state
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error on edit
    };

    const mapBackendRoleToFrontend = (backendCode) => {
        if (!backendCode) return null;
        const code = backendCode.toUpperCase();

        // Exact match check
        if (Object.values(STAFF_ROLES).includes(code)) return code;

        // Pattern matching
        if (code.includes('ACCOUNTS')) return STAFF_ROLES.ACCOUNTS;
        if (code.includes('FRONT') || code.includes('RECEPTION')) return STAFF_ROLES.FRONT_DESK;
        if (code.includes('TRANSPORT')) return STAFF_ROLES.TRANSPORT;
        if (code.includes('DATA')) return STAFF_ROLES.DATA_ENTRY;
        if (code.includes('SUPPORT')) return STAFF_ROLES.SUPPORT;
        if (code.includes('PRINCIPAL') || code.includes('HEAD')) return STAFF_ROLES.PRINCIPAL;
        if (code.includes('TEACHER')) return STAFF_ROLES.TEACHER;
        if (code.includes('ADMIN')) return STAFF_ROLES.ADMIN;

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Front-end validation for role selection
        if (!formData.role) {
            setError('Please select your access role.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // 1. Authenticate with Backend (Passing Role for server-side validation)
            const { user: backendUser, token } = await loginStaff(formData.email, formData.password, formData.role);

            // 2. Map Backend Role to Frontend Role for Context/UI
            // Even though backend validated it, we still need to map the complex backend code to a simple frontend constant
            const mappedBackendRole = mapBackendRoleToFrontend(backendUser.roleId?.code);

            // Fallback: If map returns null, use the role user selected (since backend said it was OK)
            // or default to generic STAFF role
            const finalRole = mappedBackendRole || formData.role;

            const userForContext = {
                ...backendUser,
                id: backendUser._id,
                role: finalRole,
                token
            };

            localStorage.setItem('token', token);
            // 3. Lock the Role in Global State (Immutable Session)
            login(userForContext);

            // 4. Redirect to Dashboard
            console.log('Login Success & Role Locked:', finalRole);
            navigate('/staff/dashboard', { replace: true });

        } catch (err) {
            console.error("Login Error:", err);
            // Show backend error message directly if available, otherwise generic
            setError(typeof err === 'string' ? err : 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg mb-4">
                    <Lock size={24} />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Staff Portal</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Secure access for authorized personnel only
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
                <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                <Briefcase size={12} /> Access Role
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-gray-50"
                            >
                                <option value="">Select your role</option>
                                {availableRoles.length > 0 ? (
                                    availableRoles.map((role) => (
                                        <option key={role._id || role.code} value={role.code}>
                                            {role.name}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>Loading roles...</option>
                                )}
                            </select>
                        </div>

                        {/* Staff ID / Email */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                <User size={12} /> Staff Email
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                                    placeholder="Enter your registered email"
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
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-4 border border-red-100">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
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
                                    'Secure Login'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Authorized Access Only</span>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-400">
                                Protected by Enterprise Security.
                                <br />All login attempts are logged.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffLogin;
