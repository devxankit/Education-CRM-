
import React, { useMemo, useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Save } from 'lucide-react';

// Steps
import Step1_Personal from './Step1_Personal';
import Step3_Academic from './Step3_Academic';
import Step4_Rules from './Step4_Rules';
import Step5_Documents from './Step5_Documents';
import Step5_AdmissionFee from './Step5_AdmissionFee';
import Step6_Review from './Step6_Review';

const AdmissionWizard = ({ onComplete, onCancel, branchId, academicYearId, onBranchChange, onAcademicYearChange, workflow = {} }) => {
    const requireFee = workflow.requireFee === true;
    const requireDocs = workflow.requireDocs === true;

    const steps = useMemo(() => {
        const list = [
            { key: 'personal', label: 'Personal' },
            { key: 'academic', label: 'Academic' },
            { key: 'logistics', label: 'Logistics' },
            ...(requireDocs ? [{ key: 'docs', label: 'Docs' }] : []),
            ...(requireFee ? [{ key: 'fee', label: 'Fee' }] : []),
            { key: 'review', label: 'Review' }
        ];
        return list;
    }, [requireFee, requireDocs]);

    const totalSteps = steps.length;

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // 1
        firstName: '', middleName: '', lastName: '',
        dob: '', gender: '', bloodGroup: '', nationality: 'Indian',
        parentEmail: '',
        address: '', city: '', pincode: '',

        // 3 (Now 2)
        branchId: '',
        admissionDate: new Date().toISOString().split('T')[0],
        classId: '', sectionId: '', rollNo: '',
        prevSchool: '',
        lastClass: '',

        // 4 (Now 3)
        transportRequired: false, routeId: '', stopId: '',
        hostelRequired: false, bedType: '', roomType: '',

        // 5 (Now 4)
        documents: {},
        admissionFee: { collectNow: false, feeStructureId: '', amount: '', paymentMethod: 'Cash', transactionId: '', remarks: '' }
    });

    const currentStepKey = steps[currentStep - 1]?.key;

    const handleNext = () => {
        if (currentStepKey === 'academic') {
            const hasBranch = branchId || formData.branchId;
            if (!hasBranch || !academicYearId || !formData.classId) {
                alert("Please select Branch, Academic Year, and Class before proceeding.");
                return;
            }
        }
        if (currentStepKey === 'personal') {
            if (!formData.firstName || !formData.lastName || !formData.dob || !formData.gender || !formData.parentEmail) {
                alert("Please fill all required fields (First Name, Last Name, DOB, Gender, and Parent Email)");
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.parentEmail)) {
                alert("Please enter a valid Parent Email address");
                return;
            }
        }
        if (currentStepKey === 'fee' && formData.admissionFee?.collectNow) {
            const fee = formData.admissionFee;
            if (!fee.feeStructureId || !fee.amount || Number(fee.amount) <= 0) {
                alert("Please select a fee structure and enter a valid amount.");
                return;
            }
        }
        if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = () => {
        onComplete({ ...formData, branchId: branchId || formData.branchId, academicYearId });
    };

    const isLastStep = currentStep === totalSteps;

    const renderStep = () => {
        const step = steps[currentStep - 1];
        if (!step) return null;
        switch (step.key) {
            case 'personal': return <Step1_Personal data={formData} onChange={setFormData} />;
            case 'academic': return <Step3_Academic data={formData} onChange={setFormData} branchId={branchId} academicYearId={academicYearId} onBranchChange={onBranchChange} onAcademicYearChange={onAcademicYearChange} />;
            case 'logistics': return <Step4_Rules data={formData} onChange={setFormData} />;
            case 'docs': return <Step5_Documents data={formData} onChange={setFormData} />;
            case 'fee': return <Step5_AdmissionFee data={formData} onChange={setFormData} academicYearId={academicYearId} />;
            case 'review': return (
                <Step6_Review
                    data={{ ...formData, branchId: branchId || formData.branchId, academicYearId }}
                    onEditStep={setCurrentStep}
                    stepNumbers={{ personal: 1, academic: 2, logistics: 3, docs: requireDocs ? (steps.findIndex(s => s.key === 'docs') + 1) : 0, fee: requireFee ? (steps.findIndex(s => s.key === 'fee') + 1) : 0 }}
                    showDocs={requireDocs}
                    showFee={requireFee}
                />
            );
            default: return null;
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50/50">

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

                {/* Horizontal Step Labels (Hidden on mobile) */}
                <div className="hidden md:flex justify-between mt-3 text-[10px] uppercase font-bold text-gray-400">
                    {steps.map((s, i) => (
                        <span key={s.key} className={currentStep >= i + 1 ? 'text-indigo-600' : ''}>{i + 1}. {s.label}</span>
                    ))}
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
