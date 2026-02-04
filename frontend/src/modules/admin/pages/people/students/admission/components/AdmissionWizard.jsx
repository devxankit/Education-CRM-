
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Save } from 'lucide-react';

// Steps
import Step1_Personal from './Step1_Personal';
import Step2_ParentGuardian from './Step2_ParentGuardian';
import Step3_Academic from './Step3_Academic';
import Step4_Rules from './Step4_Rules';
import Step5_Documents from './Step5_Documents';
import Step6_Review from './Step6_Review';

const AdmissionWizard = ({ onComplete, onCancel }) => {

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // 1
        firstName: '', middleName: '', lastName: '',
        dob: '', gender: '', bloodGroup: '', nationality: 'Indian',
        address: '', city: '', pincode: '',

        // 2
        parentMode: 'link', parentId: '', parentName: '', parentMobile: '', relation: 'Father',

        // 3
        branchId: '',
        admissionDate: new Date().toISOString().split('T')[0],
        classId: '', sectionId: '', rollNo: '',
        prevSchool: '',

        // 4
        transportRequired: false, routeId: '', stopId: '',
        hostelRequired: false, bedType: '', roomType: '',

        // 5
        documents: {}
    });

    const totalSteps = 6;

    const handleNext = () => {
        if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = () => {
        // Final submit logic
        onComplete(formData);
    };

    const isLastStep = currentStep === totalSteps;

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <Step1_Personal data={formData} onChange={setFormData} />;
            case 2: return <Step2_ParentGuardian data={formData} onChange={setFormData} />;
            case 3: return <Step3_Academic data={formData} onChange={setFormData} />;
            case 4: return <Step4_Rules data={formData} onChange={setFormData} />;
            case 5: return <Step5_Documents data={formData} onChange={setFormData} />;
            case 6: return <Step6_Review data={formData} onEditStep={setCurrentStep} />;
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
                    <span className={currentStep >= 1 ? 'text-indigo-600' : ''}>1. Personal</span>
                    <span className={currentStep >= 2 ? 'text-indigo-600' : ''}>2. Guardian</span>
                    <span className={currentStep >= 3 ? 'text-indigo-600' : ''}>3. Academic</span>
                    <span className={currentStep >= 4 ? 'text-indigo-600' : ''}>4. Logistics</span>
                    <span className={currentStep >= 5 ? 'text-indigo-600' : ''}>5. Docs</span>
                    <span className={currentStep >= 6 ? 'text-indigo-600' : ''}>6. Review</span>
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
