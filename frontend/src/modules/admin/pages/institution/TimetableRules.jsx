
import React, { useState, useEffect, useCallback } from 'react';
import { History, Loader2 } from 'lucide-react';

import RuleLockBanner from './components/timetable-rules/RuleLockBanner';
import GlobalTimeSettings from './components/timetable-rules/GlobalTimeSettings';
import PeriodRules from './components/timetable-rules/PeriodRules';
import WorkloadRules from './components/timetable-rules/WorkloadRules';
import { API_URL } from '@/app/api';

const TimetableRules = () => {
    // State simulating backend configuration
    const [isLocked, setIsLocked] = useState(true); // Default locked for safety
    const [hasActiveSession, setHasActiveSession] = useState(true); // Mock Active Session
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [branches, setBranches] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState('');
    const [selectedAcademicYearId, setSelectedAcademicYearId] = useState('all');

    const [rules, setRules] = useState({
        // Global
        startTime: '08:00',
        endTime: '15:30',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],

        // Period
        periodDuration: 45,
        shortBreakDuration: 15,
        lunchBreakDuration: 45,
        maxPeriodsStudent: 8,
        maxPeriodsTeacher: 6,

        // Workload
        maxConsecutive: 3,
        maxWeeklyHours: 24,
        minFreePeriods: 2,

        // Conflict
        preventTeacherOverlap: true,
        preventRoomOverlap: true,
        preventStudentOverlap: true,
        allowExamOverride: false
    });

    const fetchBranches = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/branch`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setBranches(data.data);
                if (data.data.length > 0) {
                    setSelectedBranchId(data.data[0]._id);
                } else {
                    setFetching(false);
                }
            }
        } catch (error) {
            console.error('Error fetching branches:', error);
            setFetching(false);
        }
    }, []);

    const fetchAcademicYears = useCallback(async (branchId) => {
        if (!branchId) return;
        try {
            const token = localStorage.getItem('token');
            const url = `${API_URL}/academic-year${branchId && branchId !== 'all' ? `?branchId=${branchId}` : ''}`;
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (data.success) setAcademicYears(data.data || []);
        } catch (error) {
            console.error('Error fetching academic years:', error);
        }
    }, []);

    const fetchRules = useCallback(async (branchId, academicYearId) => {
        if (!branchId) return;
        setFetching(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({ branchId });
            if (academicYearId && academicYearId !== 'all') params.set('academicYearId', academicYearId);
            const response = await fetch(`${API_URL}/timetable-rule?${params.toString()}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success && data.data) {
                setRules(prev => ({ ...prev, ...data.data }));
                setIsLocked(data.data.isLocked);
                setHasActiveSession(data.data.hasActiveSession !== false);
            }
        } catch (error) {
            console.error('Error fetching timetable rules:', error);
        } finally {
            setFetching(false);
        }
    }, []);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        if (selectedBranchId) fetchAcademicYears(selectedBranchId);
    }, [selectedBranchId, fetchAcademicYears]);

    useEffect(() => {
        setSelectedAcademicYearId('all');
    }, [selectedBranchId]);

    useEffect(() => {
        if (selectedBranchId) fetchRules(selectedBranchId, selectedAcademicYearId);
    }, [selectedBranchId, selectedAcademicYearId, fetchRules]);

    const handleChange = (key, value) => {
        setRules(prev => ({ ...prev, [key]: value }));
    };

    const handleToggleLock = async () => {
        if (!selectedBranchId) return;
        const ayId = selectedAcademicYearId && selectedAcademicYearId !== 'all' ? selectedAcademicYearId : 'all';
        let reason = '';
        if (isLocked) {
            reason = window.prompt("To UNLOCK rules, please provide an Admin Reason for the audit log:");
            if (!reason) return;
        } else {
            const confirm = window.confirm("Are you sure you want to LOCK the rules? This will finalize the timetable constraints.");
            if (!confirm) return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({ branchId: selectedBranchId });
            if (ayId !== 'all') params.set('academicYearId', ayId);
            const response = await fetch(`${API_URL}/timetable-rule/lock?${params.toString()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isLocked: !isLocked, reason })
            });

            const data = await response.json();
            if (data.success) {
                setIsLocked(!isLocked);
                alert(`Rules ${!isLocked ? 'Locked' : 'Unlocked'} Successfully`);
            } else {
                alert(data.message || 'Failed to toggle lock');
            }
        } catch (error) {
            console.error('Error toggling lock:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selectedBranchId) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { _id, instituteId, branchId, academicYearId, createdAt, updatedAt, __v, ...pureRules } = rules;
            const params = new URLSearchParams({ branchId: selectedBranchId });
            if (selectedAcademicYearId && selectedAcademicYearId !== 'all') params.set('academicYearId', selectedAcademicYearId);
            const response = await fetch(`${API_URL}/timetable-rule?${params.toString()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(pureRules)
            });

            const data = await response.json();
            if (data.success) {
                alert("Timetable Rules Saved Successfully.");
                setIsLocked(true); // Auto lock after save
            } else {
                alert(data.message || 'Failed to save rules');
            }
        } catch (error) {
            console.error('Error saving rules:', error);
            alert('An error occurred while saving');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                <p className="text-gray-500 font-medium italic">Loading timetable rules...</p>
            </div>
        );
    }

    return (
        <div className="h-full relative pb-10">
            {/* Sticky Header with Lock Logic */}
            <RuleLockBanner
                isLocked={isLocked}
                onToggleLock={handleToggleLock}
                onSave={handleSave}
                hasActiveSession={hasActiveSession}
                loading={loading}
            />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Branch & Academic Year Selector */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                            <History className="text-indigo-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-gray-900">Branch & Academic Year</h2>
                            <p className="text-xs text-gray-500">Rules are configured per branch and academic year</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={selectedBranchId}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none min-w-[180px]"
                        >
                            {branches.map(branch => (
                                <option key={branch._id} value={branch._id}>{branch.name}</option>
                            ))}
                        </select>
                        <select
                            value={selectedAcademicYearId}
                            onChange={(e) => setSelectedAcademicYearId(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none min-w-[180px]"
                        >
                            <option value="all">All Academic Years</option>
                            {academicYears.map(ay => (
                                <option key={ay._id} value={ay._id}>{ay.name} {ay.status === 'active' ? '(active)' : ''}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Intro Text */}
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex items-start gap-3">
                    <History className="text-indigo-600 mt-1 shrink-0" size={20} />
                    <div className="text-sm text-indigo-900">
                        <p className="font-semibold">Constraint Logic Active</p>
                        <p className="opacity-80 mt-1">
                            These rules control the <strong>Auto-Scheduler Engine</strong>.
                            Changes here will affect how the system validates manual timetable entries and generates automatic schedules.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GlobalTimeSettings
                        ruleData={rules}
                        onChange={handleChange}
                        isLocked={isLocked}
                    />
                    <PeriodRules
                        ruleData={rules}
                        onChange={handleChange}
                        isLocked={isLocked}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <WorkloadRules
                        ruleData={rules}
                        onChange={handleChange}
                        isLocked={isLocked}
                    />
                </div>
            </div>
        </div>
    );
};

export default TimetableRules;
