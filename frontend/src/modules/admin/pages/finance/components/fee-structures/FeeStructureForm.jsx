import React, { useState, useEffect } from 'react';
import { ChevronRight, Save, X, Layers, List, Calendar } from 'lucide-react';
import { useAdminStore } from '../../../../../../store/adminStore';
import { useAppStore } from '../../../../../../store/index';
import FeeComponentsEditor from './FeeComponentsEditor';
import InstallmentScheduler from './InstallmentScheduler';

const FeeStructureForm = ({ onSave, onCancel, initialData }) => {
    const {
        academicYears, fetchAcademicYears,
        branches, fetchBranches,
        classes, fetchClasses,
        courses, fetchCourses
    } = useAdminStore();
    const user = useAppStore(state => state.user);

    const [step, setStep] = useState(1);

    // Form State
    const [basicInfo, setBasicInfo] = useState({
        name: initialData?.name || '',
        academicYearId: initialData?.academicYearId?._id || initialData?.academicYearId || '',
        branchId: initialData?.branchId?._id || initialData?.branchId || user?.branchId || '',
        applicableClasses: initialData?.applicableClasses?.map(c => c._id || c) || [],
        applicableCourses: initialData?.applicableCourses?.map(c => c._id || c) || []
    });

    const [components, setComponents] = useState(initialData?.components || []);
    const [installments, setInstallments] = useState(initialData?.installments || [
        { id: 1, name: 'Full Payment', dueDate: '', amount: 0, percentage: 100 }
    ]);

    useEffect(() => {
        fetchAcademicYears();
        fetchBranches();
        if (basicInfo.branchId) {
            fetchClasses(basicInfo.branchId);
            fetchCourses(basicInfo.branchId);
        }
    }, [basicInfo.branchId]);

    // Computed
    const totalAmount = components.reduce((sum, c) => sum + Number(c.amount || 0), 0);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleFinalSave = () => {
        if (!basicInfo.name || !basicInfo.academicYearId || !basicInfo.branchId) {
            alert("Please fill all basic details");
            setStep(1);
            return;
        }
        onSave({
            ...basicInfo,
            components,
            installments,
            totalAmount
        });
    };

    const handleMultiSelect = (field, value) => {
        setBasicInfo(prev => {
            const current = prev[field];
            if (current.includes(value)) {
                return { ...prev, [field]: current.filter(v => v !== value) };
            } else {
                return { ...prev, [field]: [...current, value] };
            }
        });
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden font-['Inter']">

            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">
                        {initialData ? 'Edit Fee Structure' : 'Create Fee Structure'}
                    </h2>
                    <p className="text-xs text-gray-500">Step {step} of 3</p>
                </div>
                <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>
            </div>

            {/* Stepper */}
            <div className="flex border-b border-gray-200 bg-white">
                <div className={`flex-1 py-3 text-center text-sm font-medium border-b-2 ${step === 1 ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-400'}`}>
                    1. Basic Details
                </div>
                <div className={`flex-1 py-3 text-center text-sm font-medium border-b-2 ${step === 2 ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-400'}`}>
                    2. Fee Heads
                </div>
                <div className={`flex-1 py-3 text-center text-sm font-medium border-b-2 ${step === 3 ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-400'}`}>
                    3. Installments
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-8 overflow-y-auto">

                {step === 1 && (
                    <div className="max-w-md mx-auto space-y-5 animate-slide-in">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fee Structure Name</label>
                            <input
                                type="text"
                                value={basicInfo.name}
                                onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                                placeholder="e.g. Standard Annual Fee 2025"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                                <select
                                    value={basicInfo.academicYearId}
                                    onChange={(e) => setBasicInfo({ ...basicInfo, academicYearId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white outline-none cursor-pointer"
                                >
                                    <option value="">Select Year</option>
                                    {academicYears.map(year => (
                                        <option key={year._id} value={year._id}>{year.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                                <select
                                    value={basicInfo.branchId}
                                    onChange={(e) => setBasicInfo({ ...basicInfo, branchId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white outline-none cursor-pointer"
                                >
                                    <option value="">Select Branch</option>
                                    {branches.map(branch => (
                                        <option key={branch._id} value={branch._id}>{branch.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Classes</label>
                                <div className="border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto space-y-2">
                                    {classes.map(cls => (
                                        <label key={cls._id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={basicInfo.applicableClasses.includes(cls._id)}
                                                onChange={() => handleMultiSelect('applicableClasses', cls._id)}
                                                className="rounded text-indigo-600"
                                            />
                                            <span className="text-sm text-gray-600">{cls.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Programs</label>
                                <div className="border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto space-y-2">
                                    {courses.map(course => (
                                        <label key={course._id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={basicInfo.applicableCourses.includes(course._id)}
                                                onChange={() => handleMultiSelect('applicableCourses', course._id)}
                                                className="rounded text-indigo-600"
                                            />
                                            <span className="text-sm text-gray-600">{course.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="max-w-2xl mx-auto animate-slide-in">
                        <FeeComponentsEditor components={components} onChange={setComponents} readOnly={false} />
                    </div>
                )}

                {step === 3 && (
                    <div className="max-w-2xl mx-auto animate-slide-in">
                        <div className="mb-6 bg-indigo-50 p-4 rounded-lg flex justify-between items-center text-indigo-900 border border-indigo-100 shadow-inner">
                            <span className="font-medium text-sm lg:text-base">Total Fee to Split:</span>
                            <span className="font-bold text-xl lg:text-2xl">₹{totalAmount.toLocaleString()}</span>
                        </div>
                        <InstallmentScheduler
                            totalAmount={totalAmount}
                            installments={installments}
                            onChange={setInstallments}
                            readOnly={false}
                        />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                <div>
                    {step > 1 && (
                        <button onClick={handleBack} className="px-4 py-2 text-sm text-gray-600 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all font-medium">
                            Back
                        </button>
                    )}
                </div>

                <div>
                    {step < 3 ? (
                        <button onClick={handleNext} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-md transition-all active:scale-95">
                            Next Step <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button onClick={handleFinalSave} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium shadow-md transition-all active:scale-95">
                            <Save size={16} /> Save Structure
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
};

export default FeeStructureForm;
