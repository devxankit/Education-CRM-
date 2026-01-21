
import React, { useState } from 'react';
import { Plus, Settings } from 'lucide-react';

// Components
import EmploymentTypeTable from './components/EmploymentTypeTable';
import EmploymentTypeForm from './components/EmploymentTypeForm';

const EmploymentTypes = () => {

    // Mock Data
    const [types, setTypes] = useState([
        {
            id: 1,
            name: 'Permanent Staff',
            description: 'Full-time employees with all benefits.',
            status: 'Active',
            contractBased: false,
            payrollEligible: true,
            benefitsEligible: true,
            pfEligible: true,
            esicEligible: true,
            contractRules: { durationType: 'Open Ended' },
            exitRules: { noticePeriod: 60, probationMonths: 6 }
        },
        {
            id: 2,
            name: 'Contractual',
            description: 'Fixed term engagement for specific projects.',
            status: 'Active',
            contractBased: true,
            payrollEligible: true,
            benefitsEligible: false,
            pfEligible: true,
            esicEligible: false,
            contractRules: { durationType: 'Fixed Term', durationMonths: 11, renewalAllowed: true, autoExpire: true },
            exitRules: { noticePeriod: 30, probationMonths: 1 }
        },
        {
            id: 3,
            name: 'Visiting Faculty',
            description: 'Paid per lecture or hour.',
            status: 'Active',
            contractBased: true,
            payrollEligible: true,
            benefitsEligible: false,
            pfEligible: false,
            esicEligible: false,
            contractRules: { durationType: 'Fixed Term', durationMonths: 6 },
            exitRules: { noticePeriod: 7, probationMonths: 0 }
        }
    ]);

    const [selectedType, setSelectedType] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    // Handlers
    const handleView = (type) => {
        setSelectedType(type);
        setIsCreating(false);
    };

    const handleCreateNew = () => {
        setIsCreating(true);
        setSelectedType(null);
    };

    const handleSave = (formData) => {
        if (selectedType) {
            // Update
            setTypes(prev => prev.map(t => t.id === selectedType.id ? { ...formData, id: t.id } : t));
            setSelectedType(null); // Return to list or stay? Let's return to list for simplicity or keep valid.
            // Actually, keep form open or close it. Let's close it to show "Saved" state implicitly or just update list.
            setSelectedType(null);
        } else {
            // Create
            const newId = Date.now();
            setTypes(prev => [...prev, { ...formData, id: newId }]);
            setIsCreating(false);
            setSelectedType(null);
        }
    };

    return (
        <div className="h-full flex flex-col pb-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Employment Rules</h1>
                    <p className="text-gray-500 text-sm">Manage contract terms, benefit eligibility, and exit policies.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:text-indigo-600 shadow-sm">
                        <Settings size={18} />
                    </button>
                    <button
                        onClick={handleCreateNew}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg font-medium transition-all"
                    >
                        <Plus size={18} /> Add Employment Type
                    </button>
                </div>
            </div>

            {/* Split View or List View */}
            {/* If creating or viewing, show Form. Else show Table. 
                Wait, user request layout: "Right-side rule detail drawer".
                So Table is always visible, drawer slides in.
            */}

            <div className="flex-1 overflow-hidden relative flex">

                {/* Main Content (Table) - shrink on drawer? or overlay?
                    Let's utilize the ERP split layout if drawer is open.
                */}
                <div className={`flex-1 transition-all duration-300 ${selectedType || isCreating ? 'w-1/2 pr-6 hidden md:block' : 'w-full'}`}>
                    <EmploymentTypeTable
                        types={types}
                        onView={handleView}
                    />
                </div>

                {/* Right Drawer / Panel */}
                {(selectedType || isCreating) && (
                    <div className="w-full md:w-1/2 lg:w-3/5 h-full absolute md:static inset-0 bg-white z-20 md:z-0 shadow-xl md:shadow-none animate-in slide-in-from-right-10 duration-300 flex flex-col">
                        <EmploymentTypeForm
                            type={selectedType}
                            onSave={handleSave}
                            onCancel={() => { setSelectedType(null); setIsCreating(false); }}
                        />
                        {/* Mobile Close Button overlay if needed, handled inside form mostly or add strict close */}
                        <button
                            onClick={() => { setSelectedType(null); setIsCreating(false); }}
                            className="absolute top-4 right-4 md:hidden p-2 bg-gray-100 rounded-full text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                )}

            </div>

        </div>
    );
};

export default EmploymentTypes;
