
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Check, Save } from 'lucide-react';

// Steps
import Step1_Personal from './Step1_Personal';
import Step2_ParentGuardian from './Step2_ParentGuardian';
import Step3_Academic from './Step3_Academic';
import Step4_Rules from './Step4_Rules';
import Step5_Documents from './Step5_Documents';
import Step5_AdmissionFee from './Step5_AdmissionFee';
import Step6_Review from './Step6_Review';

const AdmissionWizard = ({ onComplete, onCancel, branchId, academicYearId, onBranchChange, onAcademicYearChange, workflow = {} }) => {
    // Use Boolean() to handle truthy values (true, "true", 1, etc.)
    const requireFee = Boolean(workflow.requireFee);
    const requireDocs = Boolean(workflow.requireDocs);

    const steps = useMemo(() => [
        { key: 'personal', label: 'Personal' },
        { key: 'parent', label: 'Parent' },
        { key: 'academic', label: 'Academic' },
        { key: 'logistics', label: 'Logistics' },
        ...(requireDocs && requireFee ? [{ key: 'docs', label: 'Docs' }] : []),
        ...(requireDocs && requireFee ? [{ key: 'fee', label: 'Fee' }] : []),
        { key: 'review', label: 'Review' }
    ], [requireDocs, requireFee]);

    const totalSteps = steps.length;

    const [currentStep, setCurrentStep] = useState(1);
    const [error, setError] = useState('');
    const topRef = useRef(null);

    const showError = (message) => {
        setError(message);
        if (topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Reset step if it goes out of bounds when steps change
    useEffect(() => {
        if (currentStep > totalSteps) {
            setCurrentStep(totalSteps);
        }
    }, [totalSteps, currentStep]);
    const [formData, setFormData] = useState({
        // 1
        firstName: '', middleName: '', lastName: '',
        dob: '', gender: '', bloodGroup: '', nationality: 'Indian',
        category: 'General',
        studentEmail: '',
        parentName: '', parentMobile: '', parentEmail: '',
        address: '', city: '', pincode: '',

        // 3 (Now 2)
        branchId: '',
        admissionDate: new Date().toISOString().split('T')[0],
        classId: '', sectionId: '', courseId: '',
        prevSchool: '',
        lastClass: '',

        // 4 (Now 3)
        transportRequired: false, routeId: '', stopId: '',
        hostelRequired: false, hostelId: '', bedType: '', roomType: '',

        // 5 (Now 4)
        documents: {},
        admissionFee: { collectNow: false, feeStructureId: '', amount: '', paymentMethod: 'Cash', transactionId: '', remarks: '' }
    });

    const currentStepKey = steps[currentStep - 1]?.key;

    const handleNext = () => {
        if (currentStepKey === 'academic') {
            const hasBranch = branchId || formData.branchId;
            // Either Class OR Course must be selected (mutual exclusion)
            if (!hasBranch || !academicYearId || (!formData.classId && !formData.courseId)) {
                showError("Please select Branch, Academic Year, and either Class or Course/Program before proceeding.");
                return;
            }
            // Ensure both are not selected (should not happen due to UI, but double-check)
            if (formData.classId && formData.courseId) {
                showError("Cannot select both Class and Course/Program. Please select only one.");
                return;
            }
        }
        if (currentStepKey === 'personal') {
            // Only validate student core fields on Step 1
            if (!formData.firstName || !formData.lastName || !formData.dob || !formData.gender || !formData.studentEmail) {
                showError("Please fill all required fields (First Name, Last Name, DOB, Gender, and Student Email).");
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.studentEmail)) {
                showError("Please enter a valid Student Email address.");
                return;
            }
        }
        if (currentStepKey === 'parent') {
            const linkMode = (formData.parentMode || 'link') === 'link';
            const hasParentId = !!formData.parentId;
            if (linkMode && !hasParentId) {
                showError("Please search and select an existing parent/guardian before proceeding.");
                return;
            }
        }
        if (currentStepKey === 'fee' && formData.admissionFee?.collectNow) {
            const fee = formData.admissionFee;
            if (!fee.feeStructureId || !fee.amount || Number(fee.amount) <= 0) {
                showError("Please select a fee structure and enter a valid fee amount greater than zero.");
                return;
            }
        }
        setError('');
        if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setError('');
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        setError('');
        onComplete({ ...formData, branchId: branchId || formData.branchId, academicYearId });
    };

    const isLastStep = currentStep === totalSteps;

    const renderStep = () => {
        const step = steps[currentStep - 1];
        if (!step) return null;
        switch (step.key) {
            case 'personal': return <Step1_Personal data={formData} onChange={setFormData} />;
            case 'parent': return <Step2_ParentGuardian data={formData} onChange={setFormData} />;
            case 'academic': return <Step3_Academic data={formData} onChange={setFormData} branchId={branchId} academicYearId={academicYearId} onBranchChange={onBranchChange} onAcademicYearChange={onAcademicYearChange} />;
            case 'logistics': return <Step4_Rules data={formData} onChange={setFormData} branchId={branchId} academicYearId={academicYearId} />;
            case 'docs': return <Step5_Documents data={formData} onChange={setFormData} />;
            case 'fee': return <Step5_AdmissionFee data={formData} onChange={setFormData} academicYearId={academicYearId} branchId={branchId} />;
            case 'review': return (
                <Step6_Review
                    data={{ ...formData, branchId: branchId || formData.branchId, academicYearId }}
                    onEditStep={setCurrentStep}
                    stepNumbers={{ 
                        personal: 1, 
                        parent: 2, 
                        academic: 3, 
                        logistics: 4, 
                        docs: requireDocs && requireFee ? 5 : 0, 
                        fee: requireDocs && requireFee ? 6 : 0, 
                        review: requireDocs && requireFee ? 7 : 5 
                    }}
                    showDocs={requireDocs && requireFee}
                    showFee={requireDocs && requireFee}
                />
            );
            default: return null;
        }
    };

    return (
        <div ref={topRef} className="flex flex-col h-full bg-gray-50/50">

            {/* Progress Bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">Step {currentStep} of {totalSteps}</span>
                    <span className="text-xs font-bold text-indigo-600">{Math.round((currentStep / totalSteps) * 100)}% Completed</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    ></div>
                </div>

                {error && (
                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700">
                        {error}
                    </div>
                )}

                {/* Horizontal Step Labels - clickable (Hidden on mobile) */}
                <div className="hidden md:flex justify-between mt-3 text-[10px] uppercase font-bold gap-2">
                    {steps.map((s, i) => {
                        const stepNum = i + 1;
                        const isActive = currentStep === stepNum;
                        const isCompleted = currentStep > stepNum;
                        // Allow clicking only on current or previous steps so
                        // users can review, but cannot jump ahead and skip validation.
                        const isClickable = stepNum < currentStep;
                        return (
                            <button
                                key={s.key}
                                type="button"
                                onClick={() => isClickable && setCurrentStep(stepNum)}
                                className={`min-w-0 flex-1 truncate px-1 py-1 rounded transition-colors ${
                                    isActive
                                        ? 'text-indigo-600 bg-indigo-50'
                                        : isCompleted
                                            ? 'text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50'
                                            : 'text-gray-400 cursor-not-allowed'
                                } ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                                title={`Step ${stepNum}: ${s.label}`}
                                disabled={!isClickable && !isActive}
                            >
                                {stepNum}. {s.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
                    {renderStep()}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-white border-t border-gray-200 p-4 flex items-center justify-between">
                <button
                    onClick={currentStep === 1 ? onCancel : handleBack}
                    className="px-6 py-2.5 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    {currentStep === 1 ? 'Cancel Admission' : 'Back'}
                </button>

                <div className="flex items-center gap-4">
                    {!isLastStep ? (
                        <button
                            onClick={handleNext}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-indigo-200 flex items-center gap-2 transition-transform active:scale-95"
                        >
                            Next Step <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-green-200 flex items-center gap-2 transition-transform active:scale-95"
                        >
                            <Save size={18} /> Submit Application
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
};

export default AdmissionWizard;
