import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Phone, Mail, MapPin, Calendar, BookOpen,
    ChevronRight, Award, Clock, FileText, ArrowLeft
} from 'lucide-react';
import { useParentStore } from '../../../store/parentStore';

const ChildrenPage = () => {
    const navigate = useNavigate();
    const children = useParentStore(state => state.children);
    const selectedChildId = useParentStore(state => state.selectedChildId);
    const setSelectedChild = useParentStore(state => state.setSelectedChild);
    const fetchDashboardData = useParentStore(state => state.fetchDashboardData);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'On Track': return 'bg-green-50 text-green-700 border-green-200';
            case 'Attention Needed': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Action Required': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const handleChildClick = (childId) => {
        setSelectedChild(childId);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/parent')}
                        className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">My Children</h1>
                        <p className="text-xs text-gray-500">{children.length} children enrolled</p>
                    </div>
                </div>
            </div>

            {/* Children List */}
            <div className="p-4 space-y-4">
                {children.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-sm font-medium">No children linked to your account.</p>
                        <p className="text-xs mt-1">Contact the school office to link your ward.</p>
                    </div>
                ) : children.map((child) => {
                    const cId = child._id || child.id;
                    return (
                    <div
                        key={cId}
                        onClick={() => handleChildClick(cId)}
                        className={`bg-white rounded-xl border p-4 shadow-sm cursor-pointer transition-all active:scale-[0.98] ${selectedChildId === cId
                            ? 'border-indigo-300 ring-2 ring-indigo-100'
                            : 'border-gray-200'
                            }`}
                    >
                        {/* Child Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                                    {child.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{child.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {child.class}{child.section ? ` - ${child.section}` : ''}
                                    </p>
                                    <p className="text-xs text-gray-400">Roll No: {child.rollNo}</p>
                                </div>
                            </div>
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getStatusColor(child.status)}`}>
                                {child.status}
                            </span>
                        </div>

                        {/* Quick Stats */}
                        {child.academics && (
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <Clock size={16} className="mx-auto text-emerald-600 mb-1" />
                                <p className="text-lg font-bold text-gray-900">{child.academics.attendance ?? '-'}%</p>
                                <p className="text-[10px] text-gray-500 uppercase">Attendance</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <BookOpen size={16} className="mx-auto text-blue-600 mb-1" />
                                <p className="text-lg font-bold text-gray-900">{child.academics.homeworkPending ?? '-'}</p>
                                <p className="text-[10px] text-gray-500 uppercase">Pending HW</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <Award size={16} className="mx-auto text-purple-600 mb-1" />
                                <p className="text-lg font-bold text-gray-900">{child.academics.lastResult?.grade || '-'}</p>
                                <p className="text-[10px] text-gray-500 uppercase">Last Grade</p>
                            </div>
                        </div>
                        )}

                        {/* Fee Status */}
                        {child.fees && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-xs text-gray-500">Fee Status</p>
                                <p className="text-sm font-bold text-gray-900">
                                    ₹{(child.fees.pending || 0).toLocaleString()} pending
                                </p>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </div>
                        )}
                    </div>
                );})}
            </div>
        </div>
    );
};

export default ChildrenPage;
