
import React, { useState, useEffect } from 'react';
import { Plus, Settings, Search, Filter, Building } from 'lucide-react';
import { useAdminStore } from '../../../../../store/adminStore';

// Components
import DepartmentList from './components/DepartmentList';
import DepartmentForm from './components/DepartmentForm';

const Departments = () => {
    const {
        departments,
        fetchDepartments,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        branches,
        fetchBranches,
        addToast
    } = useAdminStore();

    const [selectedBranchId, setSelectedBranchId] = useState('');
    const [fetchingBranches, setFetchingBranches] = useState(true);
    const [fetchingDepts, setFetchingDepts] = useState(false);
    const [selectedDept, setSelectedDept] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch Branches on Mount
    useEffect(() => {
        const loadBranches = async () => {
            try {
                const data = await fetchBranches();
                if (data && data.length > 0) {
                    setSelectedBranchId(data[0]._id);
                }
            } catch (error) {
                console.error('Error fetching branches:', error);
            } finally {
                setFetchingBranches(false);
            }
        };
        loadBranches();
    }, [fetchBranches]);

    // Fetch Departments when branch changes
    useEffect(() => {
        if (selectedBranchId) {
            setFetchingDepts(true);
            fetchDepartments(selectedBranchId).finally(() => setFetchingDepts(false));
            setSelectedDept(null);
            setIsCreating(false);
        }
    }, [selectedBranchId, fetchDepartments]);

    // Handlers
    const handleSelect = (dept) => {
        setSelectedDept(dept);
        setIsCreating(false);
    };

    const handleCreateNew = () => {
        if (!selectedBranchId) {
            addToast('Please select a branch first', 'error');
            return;
        }
        setIsCreating(true);
        setSelectedDept(null);
    };

    const handleSave = async (formData) => {
        try {
            if (selectedDept) {
                const saved = await updateDepartment(selectedDept._id, formData);
                addToast('Department updated successfully');
                if (saved) setSelectedDept(saved);
            } else {
                const saved = await addDepartment({ ...formData, branchId: selectedBranchId });
                addToast('Department created successfully');
                setIsCreating(false);
                if (saved) setSelectedDept(saved);
            }
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to save department', 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDepartment(id);
            addToast('Department deleted successfully');
            setSelectedDept(null);
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to delete department', 'error');
        }
    };

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col pb-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Organization Structure</h1>
                    <p className="text-gray-500 text-sm">Define departments, reporting hierarchy, and job designations.</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search Bar */}
                    <div className="relative hidden lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search departments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 shadow-sm"
                        />
                    </div>

                    {/* Branch Selector */}
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
                        <Filter size={14} className="text-gray-400" />
                        <select
                            value={selectedBranchId}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            className="text-sm font-medium text-gray-700 outline-none bg-transparent"
                            disabled={fetchingBranches}
                        >
                            <option value="">Select Branch</option>
                            {branches.map(branch => (
                                <option key={branch._id} value={branch._id}>{branch.name}</option>
                            ))}
                        </select>
                    </div>

                    <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:text-indigo-600 shadow-sm">
                        <Settings size={18} />
                    </button>
                    <button
                        onClick={handleCreateNew}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg font-medium transition-all"
                    >
                        <Plus size={18} /> Add Department
                    </button>
                </div>
            </div>

            {/* Split View */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-hidden">

                {/* Left Listing */}
                <div className="col-span-12 md:col-span-4 lg:col-span-3 h-full overflow-hidden flex flex-col">
                    {fetchingDepts ? (
                        <div className="flex-1 flex items-center justify-center bg-white rounded-xl border border-gray-200">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <DepartmentList
                            departments={filteredDepartments}
                            selectedId={isCreating ? null : selectedDept?._id}
                            onSelect={handleSelect}
                            onAdd={handleCreateNew}
                        />
                    )}
                </div>

                {/* Right Details/Form */}
                <div className="col-span-12 md:col-span-8 lg:col-span-9 h-full">
                    {/* If Creating or Selected, show Form */}
                    {(selectedDept || isCreating) ? (
                        <DepartmentForm
                            department={selectedDept}
                            onSave={handleSave}
                            onDelete={handleDelete}
                        />
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center h-full min-h-[320px] text-center p-8">
                            <div className="p-5 rounded-2xl bg-indigo-50 mb-5">
                                <Building size={48} className="text-indigo-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-700 mb-2">Departments & Designations</h3>
                            <p className="text-gray-500 text-sm max-w-sm">
                                Select a department from the left to edit, or add a new one using the button above. Designations (roles) are added inside each department.
                            </p>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
};

export default Departments;
