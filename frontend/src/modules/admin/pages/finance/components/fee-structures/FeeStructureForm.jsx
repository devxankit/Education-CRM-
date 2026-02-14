import React, { useState, useEffect } from 'react';
import { ChevronRight, Save, X, Layers, List, Calendar } from 'lucide-react';
import { useAdminStore } from '../../../../../../store/adminStore';
import { useAppStore } from '../../../../../../store/index';
import FeeComponentsEditor from './FeeComponentsEditor';
import InstallmentScheduler from './InstallmentScheduler';

const FeeStructureForm = ({ onSave, onCancel, initialData, existingStructures = [] }) => {
    const {
        academicYears, fetchAcademicYears,
        branches, fetchBranches,
        classes, fetchClasses,
        courses, fetchCourses
    } = useAdminStore();
    const user = useAppStore(state => state.user);

    const [step, setStep] = useState(1);

    // Form State - Initialize empty for create mode
    const [basicInfo, setBasicInfo] = useState({
        name: '',
        academicYearId: '',
        branchId: '',
        applicableClasses: [],
        applicableCourses: []
    });

    const [components, setComponents] = useState([]);
    const [installments, setInstallments] = useState([]);

    // Update form when initialData changes (for edit mode)
    useEffect(() => {
        if (initialData) {
            // Edit mode - populate all fields
            // Ensure mutual exclusivity: if both classes and courses exist, prioritize classes
            const classesData = initialData.applicableClasses?.map(c => c._id || c) || [];
            const coursesData = initialData.applicableCourses?.map(c => c._id || c) || [];
            
            // If both have data, prioritize classes and clear courses (mutual exclusivity)
            const finalClasses = classesData.length > 0 ? classesData : [];
            const finalCourses = classesData.length > 0 ? [] : coursesData;
            
            setBasicInfo({
                name: initialData.name || '',
                academicYearId: initialData.academicYearId?._id || initialData.academicYearId || '',
                branchId: initialData.branchId?._id || initialData.branchId || '',
                applicableClasses: finalClasses,
                applicableCourses: finalCourses
            });

            // Set components
            if (initialData.components && initialData.components.length > 0) {
                setComponents(initialData.components.map((c, idx) => ({
                    ...c,
                    id: c.id || c._id || Date.now() + idx
                })));
            } else {
                setComponents([]);
            }

            // Set installments (strip any leading MongoDB _id from name if corrupted)
            const cleanInstName = (n) => {
                if (!n || typeof n !== 'string') return n || '';
                const m = n.trim().match(/^[a-f0-9]{24}\s+/i);
                return m ? n.slice(m[0].length).trim() : n.trim();
            };
            if (initialData.installments && initialData.installments.length > 0) {
                setInstallments(initialData.installments.map((inst, idx) => ({
                    ...inst,
                    id: inst.id || inst._id || idx + 1,
                    name: cleanInstName(inst.name) || inst.name || `Installment ${idx + 1}`,
                    amount: inst.amount || 0,
                    dueDate: inst.dueDate ? (typeof inst.dueDate === 'string' ? inst.dueDate.split('T')[0] : new Date(inst.dueDate).toISOString().split('T')[0]) : ''
                })));
            } else {
                const initialTotal = initialData.totalAmount || 
                    (initialData.components?.reduce((sum, c) => sum + (Number(c.amount) || 0), 0) || 0);
                setInstallments([
                    { id: 1, name: 'Full Payment', dueDate: '', amount: initialTotal }
                ]);
            }
        } else {
            // Create mode - reset to empty
            setBasicInfo({
                name: '',
                academicYearId: '',
                branchId: user?.branchId || '',
                applicableClasses: [],
                applicableCourses: []
            });
            setComponents([]);
            setInstallments([]); // Empty installments for create mode
            setStep(1); // Reset to first step
        }
    }, [initialData, user?.branchId]);

    useEffect(() => {
        fetchAcademicYears();
        fetchBranches();
    }, [fetchAcademicYears, fetchBranches]);

    // Set default branchId when branches load and branchId is empty (only for create mode)
    useEffect(() => {
        if (!initialData && !basicInfo.branchId && branches.length > 0) {
            setBasicInfo(prev => ({ ...prev, branchId: branches[0]._id }));
        }
    }, [branches, initialData]);

    useEffect(() => {
        if (basicInfo.branchId) {
            fetchClasses(basicInfo.branchId);
            fetchCourses(basicInfo.branchId);
        }
    }, [basicInfo.branchId, fetchClasses, fetchCourses]);
    
    // Computed totalAmount - must be after components state
    const totalAmount = components.reduce((sum, c) => sum + Number(c.amount || 0), 0);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    // Check for duplicate fee structure
    const checkDuplicate = () => {
        if (!basicInfo.branchId || !basicInfo.academicYearId) {
            return null; // Can't check duplicate without required fields
        }

        // Must have either classes or courses selected
        if (basicInfo.applicableClasses.length === 0 && basicInfo.applicableCourses.length === 0) {
            return null;
        }

        const currentId = initialData?._id || initialData?.id;
        
        // Check if same branch + academic year + same classes/courses combination exists
        const duplicate = existingStructures.find(structure => {
            const structureId = structure._id || structure.id;
            if (currentId && structureId === currentId) return false; // Skip current structure in edit mode
            
            const sameBranch = (structure.branchId?._id || structure.branchId) === basicInfo.branchId;
            const sameYear = (structure.academicYearId?._id || structure.academicYearId) === basicInfo.academicYearId;
            
            if (!sameBranch || !sameYear) return false;
            
            // Check if classes overlap (if classes are selected)
            if (basicInfo.applicableClasses.length > 0) {
                const structureClasses = structure.applicableClasses?.map(c => c._id || c) || [];
                const currentClasses = basicInfo.applicableClasses || [];
                const hasOverlap = currentClasses.some(cls => structureClasses.includes(cls));
                return hasOverlap;
            }
            
            // Check if courses overlap (if courses are selected)
            if (basicInfo.applicableCourses.length > 0) {
                const structureCourses = structure.applicableCourses?.map(c => c._id || c) || [];
                const currentCourses = basicInfo.applicableCourses || [];
                const hasOverlap = currentCourses.some(course => structureCourses.includes(course));
                return hasOverlap;
            }
            
            return false;
        });

        return duplicate;
    };

    const handleFinalSave = () => {
        // Step 1: Basic validations
        if (!basicInfo.name || !basicInfo.academicYearId || !basicInfo.branchId) {
            alert("⚠️ Please fill all basic details including Branch and Academic Year");
            setStep(1);
            return;
        }
        
        // Validate branchId is a valid ObjectId format
        if (!/^[0-9a-fA-F]{24}$/.test(basicInfo.branchId)) {
            alert("⚠️ Please select a valid branch");
            setStep(1);
            return;
        }

        if (!/^[0-9a-fA-F]{24}$/.test(basicInfo.academicYearId)) {
            alert("⚠️ Please select a valid academic year");
            setStep(1);
            return;
        }

        // Check if at least one class is selected
        if (basicInfo.applicableClasses.length === 0 && basicInfo.applicableCourses.length === 0) {
            alert("⚠️ Please select at least one Class or Program");
            setStep(1);
            return;
        }

        // Step 2: Check for duplicate
        const duplicate = checkDuplicate();
        if (duplicate) {
            const duplicateName = duplicate.name || 'Unknown';
            const duplicateYear = duplicate.academicYearId?.name || 'N/A';
            if (!window.confirm(
                `⚠️ Duplicate Fee Structure Found!\n\n` +
                `A fee structure already exists for:\n` +
                `• Branch: ${branches.find(b => b._id === basicInfo.branchId)?.name || 'N/A'}\n` +
                `• Academic Year: ${academicYears.find(y => y._id === basicInfo.academicYearId)?.name || 'N/A'}\n` +
                `• Structure: "${duplicateName}"\n\n` +
                `Same branch, year, and class combination cannot have multiple fee structures.\n\n` +
                `Do you want to continue anyway?`
            )) {
                return;
            }
        }

        // Step 3: Component validation
        if (components.length === 0) {
            alert("⚠️ Please add at least one fee component");
            setStep(2);
            return;
        }

        // Step 4: Installment validation
        if (installments.length === 0) {
            alert("⚠️ Please configure at least one installment");
            setStep(3);
            return;
        }

        // Validate installment amounts sum equals total
        const installmentSum = installments.reduce((sum, inst) => sum + (Number(inst.amount) || 0), 0);
        if (Math.abs(installmentSum - totalAmount) > 1) { // Allow 1 rupee difference for rounding
            if (!window.confirm(
                `⚠️ Installment Amount Mismatch!\n\n` +
                `Total Fee: ₹${totalAmount.toLocaleString()}\n` +
                `Installments Sum: ₹${installmentSum.toLocaleString()}\n` +
                `Difference: ₹${Math.abs(installmentSum - totalAmount).toLocaleString()}\n\n` +
                `Do you want to continue anyway?`
            )) {
                setStep(3);
                return;
            }
        }
        
        // Format installments for backend (remove id if it's a temp id, keep _id if exists)
        const formattedInstallments = installments.map(inst => {
            const { id, ...rest } = inst;
            return {
                ...rest,
                amount: Number(rest.amount) || 0,
                dueDate: rest.dueDate || undefined
            };
        });

        // Format components for backend
        const formattedComponents = components.map(comp => {
            const { id, ...rest } = comp;
            return {
                ...rest,
                amount: Number(rest.amount) || 0
            };
        });

        onSave({
            ...basicInfo,
            components: formattedComponents,
            installments: formattedInstallments,
            totalAmount
        });
    };

    const handleMultiSelect = (field, value) => {
        setBasicInfo(prev => {
            const current = prev[field];
            const isChecked = current.includes(value);
            
            // If checking a value, clear the other field (mutually exclusive)
            if (!isChecked) {
                if (field === 'applicableClasses') {
                    // If selecting a class, clear courses
                    return { ...prev, [field]: [...current, value], applicableCourses: [] };
                } else {
                    // If selecting a course, clear classes
                    return { ...prev, [field]: [...current, value], applicableClasses: [] };
                }
            } else {
                // If unchecking, just remove from current field
                return { ...prev, [field]: current.filter(v => v !== value) };
            }
        });
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden font-['Inter'] animate-in fade-in slide-in-from-bottom-4 duration-300">

            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">
                        {initialData ? 'Edit Fee Structure' : 'Create Fee Structure'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">Step {step} of 3</p>
                </div>
                <button 
                    onClick={onCancel} 
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-all"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Stepper */}
            <div className="flex border-b border-gray-200 bg-white">
                <div className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-all duration-300 ${step === 1 ? 'border-indigo-600 text-indigo-700 bg-indigo-50/30' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                    <div className="flex items-center justify-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-indigo-600 text-white' : step > 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {step > 1 ? '✓' : '1'}
                        </span>
                        <span>Basic Details</span>
                    </div>
                </div>
                <div className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-all duration-300 ${step === 2 ? 'border-indigo-600 text-indigo-700 bg-indigo-50/30' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                    <div className="flex items-center justify-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-indigo-600 text-white' : step > 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {step > 2 ? '✓' : '2'}
                        </span>
                        <span>Fee Heads</span>
                    </div>
                </div>
                <div className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-all duration-300 ${step === 3 ? 'border-indigo-600 text-indigo-700 bg-indigo-50/30' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                    <div className="flex items-center justify-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            3
                        </span>
                        <span>Installments</span>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-8 overflow-y-auto">

                {step === 1 && (
                    <div className="max-w-md mx-auto space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Fee Structure Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={basicInfo.name}
                                onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                                placeholder="e.g. Standard Annual Fee 2025"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm hover:shadow-md"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Academic Year <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={basicInfo.academicYearId}
                                    onChange={(e) => setBasicInfo({ ...basicInfo, academicYearId: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:shadow-md"
                                >
                                    <option value="">Select Year</option>
                                    {academicYears.map(year => (
                                        <option key={year._id} value={year._id}>{year.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Branch <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={basicInfo.branchId}
                                    onChange={(e) => setBasicInfo({ ...basicInfo, branchId: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:shadow-md"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Applicable Classes <span className="text-red-500">*</span>
                                    <span className="text-xs text-gray-400 font-normal ml-2">(Select classes OR programs)</span>
                                </label>
                                <div className={`border rounded-lg p-3 max-h-40 overflow-y-auto space-y-2 transition-colors ${
                                    basicInfo.applicableCourses.length > 0 
                                        ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed' 
                                        : 'border-gray-300 bg-gray-50/50 hover:bg-gray-50'
                                }`}>
                                    {classes.length === 0 ? (
                                        <p className="text-xs text-gray-400 text-center py-2">No classes available. Select a branch first.</p>
                                    ) : (
                                        classes.map(cls => (
                                            <label 
                                                key={cls._id} 
                                                className={`flex items-center gap-2 p-1.5 rounded transition-colors group ${
                                                    basicInfo.applicableCourses.length > 0 
                                                        ? 'cursor-not-allowed opacity-60' 
                                                        : 'cursor-pointer hover:bg-white'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={basicInfo.applicableClasses.includes(cls._id)}
                                                    onChange={() => handleMultiSelect('applicableClasses', cls._id)}
                                                    disabled={basicInfo.applicableCourses.length > 0}
                                                    className="rounded text-indigo-600 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                />
                                                <span className={`text-sm group-hover:text-gray-900 ${
                                                    basicInfo.applicableCourses.length > 0 
                                                        ? 'text-gray-400' 
                                                        : 'text-gray-600'
                                                }`}>{cls.name}</span>
                                            </label>
                                        ))
                                    )}
                                </div>
                                {basicInfo.applicableClasses.length === 0 && basicInfo.applicableCourses.length === 0 && (
                                    <p className="text-xs text-red-500 mt-1">⚠️ Please select at least one class or program</p>
                                )}
                                {basicInfo.applicableCourses.length > 0 && (
                                    <p className="text-xs text-blue-500 mt-1">ℹ️ Programs selected. Classes disabled.</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Applicable Programs <span className="text-red-500">*</span>
                                    <span className="text-xs text-gray-400 font-normal ml-2">(Select classes OR programs)</span>
                                </label>
                                <div className={`border rounded-lg p-3 max-h-40 overflow-y-auto space-y-2 transition-colors ${
                                    basicInfo.applicableClasses.length > 0 
                                        ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed' 
                                        : 'border-gray-300 bg-gray-50/50 hover:bg-gray-50'
                                }`}>
                                    {courses.length === 0 ? (
                                        <p className="text-xs text-gray-400 text-center py-2">No programs available. Select a branch first.</p>
                                    ) : (
                                        courses.map(course => (
                                            <label 
                                                key={course._id} 
                                                className={`flex items-center gap-2 p-1.5 rounded transition-colors group ${
                                                    basicInfo.applicableClasses.length > 0 
                                                        ? 'cursor-not-allowed opacity-60' 
                                                        : 'cursor-pointer hover:bg-white'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={basicInfo.applicableCourses.includes(course._id)}
                                                    onChange={() => handleMultiSelect('applicableCourses', course._id)}
                                                    disabled={basicInfo.applicableClasses.length > 0}
                                                    className="rounded text-indigo-600 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                />
                                                <span className={`text-sm group-hover:text-gray-900 ${
                                                    basicInfo.applicableClasses.length > 0 
                                                        ? 'text-gray-400' 
                                                        : 'text-gray-600'
                                                }`}>{course.name}</span>
                                            </label>
                                        ))
                                    )}
                                </div>
                                {basicInfo.applicableClasses.length > 0 && (
                                    <p className="text-xs text-blue-500 mt-1">ℹ️ Classes selected. Programs disabled.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
                        <FeeComponentsEditor components={components} onChange={setComponents} readOnly={false} />
                    </div>
                )}

                {step === 3 && (
                    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="mb-6 bg-gradient-to-r from-indigo-50 to-indigo-100 p-5 rounded-xl flex justify-between items-center text-indigo-900 border border-indigo-200 shadow-md">
                            <span className="font-medium text-sm lg:text-base flex items-center gap-2">
                                <Layers size={18} /> Total Fee to Split:
                            </span>
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
            <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center shadow-sm">
                <div>
                    {step > 1 && (
                        <button 
                            onClick={handleBack} 
                            className="px-5 py-2.5 text-sm text-gray-700 hover:bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all font-medium shadow-sm hover:shadow-md active:scale-95"
                        >
                            ← Back
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {step < 3 ? (
                        <button 
                            onClick={handleNext} 
                            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-md hover:shadow-lg transition-all active:scale-95"
                        >
                            Next Step <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button 
                            onClick={handleFinalSave} 
                            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium shadow-md hover:shadow-lg transition-all active:scale-95"
                        >
                            <Save size={16} /> {initialData ? 'Update Structure' : 'Publish Structure'}
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
};

export default FeeStructureForm;
