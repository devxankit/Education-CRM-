import React, { useState, useEffect, useCallback } from 'react';
import { Save, Plus, Trash2, Clock, MapPin, Video, Filter, AlertCircle } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';

const WeeklyTimetable = () => {
    const {
        branches, fetchBranches,
        classes, fetchClasses,
        sections, fetchSections,
        academicYears, fetchAcademicYears,
        teachers, fetchTeachers,
        fetchTimetable, saveTimetable,
        timetable,
        fetchSubjects, subjects,
        fetchTeacherMappings, teacherMappings,
        fetchTimetableRules, timetableRules
    } = useAdminStore();

    const user = useAppStore(state => state.user);

    // Selections
    const [selectedBranchId, setSelectedBranchId] = useState('');
    const [selectedYearId, setSelectedYearId] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [activeDay, setActiveDay] = useState('Mon');

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Form State for current day's schedule
    const [localSchedule, setLocalSchedule] = useState({
        Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: []
    });

    // Validation state
    const [validationErrors, setValidationErrors] = useState({});

    // Initial Fetch
    useEffect(() => {
        fetchBranches();
        fetchAcademicYears();
        fetchTeachers();
        fetchTeacherMappings(); // Fetch all mappings initially or we can fetch by branch
    }, []);

    // Branch selection
    useEffect(() => {
        if (!selectedBranchId) {
            if (user?.branchId) setSelectedBranchId(user.branchId);
            else if (branches.length > 0) setSelectedBranchId(branches[0]._id);
        }
    }, [user, branches]);

    // Fetch classes and mappings when branch changes
    useEffect(() => {
        if (selectedBranchId) {
            fetchClasses(selectedBranchId);
            fetchSubjects(selectedBranchId);
            fetchTeacherMappings({ branchId: selectedBranchId });
            fetchTimetableRules(selectedBranchId);
        }
    }, [selectedBranchId]);

    // Set Active Year
    useEffect(() => {
        if (academicYears.length > 0 && !selectedYearId) {
            const active = academicYears.find(y => y.status === 'active');
            setSelectedYearId(active?._id || academicYears[0]._id);
        }
    }, [academicYears]);

    // Fetch sections when class changes
    useEffect(() => {
        if (selectedClassId) {
            fetchSections(selectedClassId);
            setSelectedSectionId('');
        }
    }, [selectedClassId]);

    // Fetch Timetable when context changes
    useEffect(() => {
        if (selectedYearId && selectedSectionId) {
            fetchTimetable({ academicYearId: selectedYearId, sectionId: selectedSectionId })
                .then(data => {
                    if (data && data.schedule) {
                        // Ensure all days exist
                        const fullSchedule = { ...data.schedule };
                        days.forEach(day => {
                            if (!fullSchedule[day]) fullSchedule[day] = [];
                        });
                        setLocalSchedule(fullSchedule);
                    } else {
                        setLocalSchedule({ Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] });
                    }
                    
                    // Auto-select first working day if current activeDay is not working
                    if (timetableRules?.workingDays?.length > 0) {
                        const currentDayFullName = activeDay === 'Mon' ? 'Monday' : activeDay === 'Tue' ? 'Tuesday' : activeDay === 'Wed' ? 'Wednesday' : activeDay === 'Thu' ? 'Thursday' : activeDay === 'Fri' ? 'Friday' : activeDay === 'Sat' ? 'Saturday' : 'Sunday';
                        
                        if (!timetableRules.workingDays.includes(currentDayFullName)) {
                            const firstWorkingDay = days.find(d => {
                                const fullName = d === 'Mon' ? 'Monday' : d === 'Tue' ? 'Tuesday' : d === 'Wed' ? 'Wednesday' : d === 'Thu' ? 'Thursday' : d === 'Fri' ? 'Friday' : d === 'Sat' ? 'Saturday' : 'Sunday';
                                return timetableRules.workingDays.includes(fullName);
                            });
                            if (firstWorkingDay) setActiveDay(firstWorkingDay);
                        }
                    }
                });
        }
    }, [selectedYearId, selectedSectionId, timetableRules]);

    // Time Helper Functions
    const timeToMinutes = (timeStr) => {
        if (!timeStr) return 0;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const minutesToTime = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const handleAddPeriod = () => {
        let startTime = '09:00';
        let duration = timetableRules?.periodDuration || 45;

        const currentPeriods = localSchedule[activeDay] || [];
        
        if (currentPeriods.length > 0) {
            // Start after the last period
            startTime = currentPeriods[currentPeriods.length - 1].endTime;
        } else if (timetableRules?.startTime) {
            // First period of the day
            startTime = timetableRules.startTime;
        }

        const startMinutes = timeToMinutes(startTime);
        const endMinutes = startMinutes + duration;
        const endTime = minutesToTime(endMinutes);

        const newPeriod = {
            subjectId: '',
            teacherId: '',
            startTime: startTime,
            endTime: endTime,
            room: '',
            type: 'offline'
        };
        setLocalSchedule(prev => ({
            ...prev,
            [activeDay]: [...prev[activeDay], newPeriod]
        }));
    };

    const handleRemovePeriod = (index) => {
        setLocalSchedule(prev => ({
            ...prev,
            [activeDay]: prev[activeDay].filter((_, i) => i !== index)
        }));
    };

    const handleUpdatePeriod = (index, field, value) => {
        setLocalSchedule(prev => {
            const updatedDay = [...prev[activeDay]];
            updatedDay[index] = { ...updatedDay[index], [field]: value };
            
            // If subject changes, we might want to check if the current teacher is still valid
            // But for now, we'll just clear the error for this row when anything changes
            const errorKey = `${activeDay}-${index}`;
            if (validationErrors[errorKey]) {
                const newErrors = { ...validationErrors };
                delete newErrors[errorKey];
                setValidationErrors(newErrors);
            }
            
            return { ...prev, [activeDay]: updatedDay };
        });
    };

    // Helper to get filtered teachers for a subject
    const getFilteredTeachers = (subjectId) => {
        if (!subjectId) return teachers;
        
        // Find teachers mapped to this subject
        const mappedTeacherIds = teacherMappings
            .filter(m => (m.subjectId?._id || m.subjectId) === subjectId)
            .map(m => m.teacherId?._id || m.teacherId);
            
        if (mappedTeacherIds.length === 0) return teachers; // If no mapping, show all (or could show none)
        
        return teachers.filter(t => mappedTeacherIds.includes(t._id || t.id));
    };

    // Check if teacher is assigned to subject
    const isTeacherAssignedToSubject = (teacherId, subjectId) => {
        if (!teacherId || !subjectId) return true;
        
        const isMapped = teacherMappings.some(m => 
            (m.teacherId?._id || m.teacherId) === teacherId && 
            (m.subjectId?._id || m.subjectId) === subjectId
        );
        
        return isMapped;
    };

    // Time Validation Helpers
    const isTimeWithinRules = (startTime, endTime) => {
        if (!timetableRules || !startTime || !endTime) return { valid: true };

        const ruleStartMins = timeToMinutes(timetableRules.startTime || '08:00');
        const ruleEndMins = timeToMinutes(timetableRules.endTime || '15:30');
        const startMins = timeToMinutes(startTime);
        const endMins = timeToMinutes(endTime);

        if (startMins < ruleStartMins) return { valid: false, message: `Start time cannot be before ${timetableRules.startTime}` };
        if (endMins > ruleEndMins) return { valid: false, message: `End time cannot be after ${timetableRules.endTime}` };
        if (startMins >= endMins) return { valid: false, message: `Start time must be before end time` };

        return { valid: true };
    };

    const handleSave = async () => {
        if (!selectedYearId || !selectedSectionId || !selectedClassId || !selectedBranchId) {
            alert('Please select all required fields');
            return;
        }

        // Validate all periods
        const newErrors = {};
        let hasError = false;

        Object.keys(localSchedule).forEach(day => {
            // Check if day is a working day
            if (timetableRules?.workingDays && !timetableRules.workingDays.includes(day === 'Mon' ? 'Monday' : day === 'Tue' ? 'Tuesday' : day === 'Wed' ? 'Wednesday' : day === 'Thu' ? 'Thursday' : day === 'Fri' ? 'Friday' : day === 'Sat' ? 'Saturday' : 'Sunday')) {
                if (localSchedule[day].length > 0) {
                    newErrors[`${day}-day`] = `${day} is marked as a non-working day in Timetable Rules.`;
                    hasError = true;
                }
            }

            localSchedule[day].forEach((period, index) => {
                // 1. Teacher Assignment Validation
                if (period.subjectId && period.teacherId) {
                    const isValid = isTeacherAssignedToSubject(
                        period.teacherId?._id || period.teacherId, 
                        period.subjectId?._id || period.subjectId
                    );
                    if (!isValid) {
                        newErrors[`${day}-${index}`] = "Teacher is not assigned to this subject in Teacher-Subject Mapping";
                        hasError = true;
                    }
                }

                // 2. Time Range Validation (Rules)
                const timeValidation = isTimeWithinRules(period.startTime, period.endTime);
                if (!timeValidation.valid) {
                    newErrors[`${day}-${index}-time`] = timeValidation.message;
                    hasError = true;
                }
            });
        });

        if (hasError) {
            setValidationErrors(newErrors);
            alert('Some assignments are invalid. Please check the highlighted periods.');
            return;
        }

        try {
            // Clean up localSchedule to only include essential IDs for saving
            const cleanedSchedule = {};
            Object.keys(localSchedule).forEach(day => {
                cleanedSchedule[day] = localSchedule[day].map(period => ({
                    ...period,
                    subjectId: period.subjectId?._id || period.subjectId,
                    teacherId: period.teacherId?._id || period.teacherId
                }));
            });

            await saveTimetable({
                academicYearId: selectedYearId,
                branchId: selectedBranchId,
                classId: selectedClassId,
                sectionId: selectedSectionId,
                schedule: cleanedSchedule
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Weekly Timetable</h1>
                    <p className="text-gray-500 text-sm">Manage class schedules and teacher assignments</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                    <Save size={18} />
                    Save Timetable
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Branch</label>
                        <select
                            value={selectedBranchId}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                        >
                            {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Academic Year</label>
                        <select
                            value={selectedYearId}
                            onChange={(e) => setSelectedYearId(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                        >
                            {academicYears.map(y => <option key={y._id} value={y._id}>{y.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Class</label>
                        <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                        >
                            <option value="">Select Class</option>
                            {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Section</label>
                        <select
                            value={selectedSectionId}
                            onChange={(e) => setSelectedSectionId(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                            disabled={!selectedClassId}
                        >
                            <option value="">Select Section</option>
                            {(sections[selectedClassId] || []).map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {selectedSectionId ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Day Tabs */}
                    <div className="flex border-b border-gray-100 overflow-x-auto hide-scrollbar">
                        {days.map(day => {
                            const dayFullName = day === 'Mon' ? 'Monday' : day === 'Tue' ? 'Tuesday' : day === 'Wed' ? 'Wednesday' : day === 'Thu' ? 'Thursday' : day === 'Fri' ? 'Friday' : day === 'Sat' ? 'Saturday' : 'Sunday';
                            const isWorkingDay = timetableRules?.workingDays?.includes(dayFullName);
                            
                            return (
                                <button
                                    key={day}
                                    onClick={() => setActiveDay(day)}
                                    className={`px-8 py-4 text-sm font-semibold transition-all border-b-2 shrink-0 relative ${activeDay === day
                                        ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        } ${!isWorkingDay ? 'opacity-60' : ''}`}
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        <span>{dayFullName}</span>
                                        {!isWorkingDay && (
                                            <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded uppercase tracking-wider">Off</span>
                                        )}
                                        {isWorkingDay && (
                                            <div className={`w-1 h-1 rounded-full ${activeDay === day ? 'bg-indigo-600' : 'bg-green-400'}`}></div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="p-6">
                        {validationErrors[`${activeDay}-day`] && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm font-medium">
                                <AlertCircle size={18} />
                                {validationErrors[`${activeDay}-day`]}
                            </div>
                        )}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <h2 className="text-lg font-bold text-gray-800">
                                    {activeDay} Schedule
                                </h2>
                                {localSchedule[activeDay]?.length > (timetableRules?.maxPeriodsStudent || 8) && (
                                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full border border-amber-100 flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        Exceeds Daily Limit ({timetableRules?.maxPeriodsStudent || 8})
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleAddPeriod}
                                className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all"
                            >
                                <Plus size={16} />
                                Add Period
                            </button>
                        </div>

                        <div className="space-y-4">
                            {localSchedule[activeDay]?.length > 0 ? (
                                localSchedule[activeDay].map((period, index) => (
                                    <div key={index} className={`flex flex-wrap items-end gap-4 p-4 rounded-xl border relative group transition-all ${validationErrors[`${activeDay}-${index}`] ? 'border-red-200 bg-red-50/30' : 'border-gray-100 bg-gray-50/30'}`}>
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Subject</label>
                                            <select
                                                value={period.subjectId?._id || period.subjectId || ''}
                                                onChange={(e) => handleUpdatePeriod(index, 'subjectId', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                                            >
                                                <option value="">Select Subject</option>
                                                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                            </select>
                                        </div>

                                        <div className="flex-1 min-w-[200px]">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Teacher</label>
                                            <select
                                                value={period.teacherId?._id || period.teacherId || ''}
                                                onChange={(e) => handleUpdatePeriod(index, 'teacherId', e.target.value)}
                                                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all ${!isTeacherAssignedToSubject(period.teacherId?._id || period.teacherId, period.subjectId?._id || period.subjectId) ? 'border-red-500 text-red-600' : 'border-gray-200'}`}
                                            >
                                                <option value="">Select Teacher</option>
                                                {/* Highlight assigned teachers or show only them */}
                                                <optgroup label="Assigned Teachers">
                                                    {getFilteredTeachers(period.subjectId?._id || period.subjectId).map(t => (
                                                        <option key={t._id || t.id} value={t._id || t.id}>{t.firstName} {t.lastName}</option>
                                                    ))}
                                                </optgroup>
                                                <optgroup label="All Teachers">
                                                    {teachers.map(t => (
                                                        <option key={t._id || t.id} value={t._id || t.id}>{t.firstName} {t.lastName}</option>
                                                    ))}
                                                </optgroup>
                                            </select>
                                        </div>

                                        {validationErrors[`${activeDay}-${index}`] && (
                                            <div className="absolute -bottom-5 left-4 text-[10px] font-bold text-red-500">
                                                {validationErrors[`${activeDay}-${index}`]}
                                            </div>
                                        )}

                                        {validationErrors[`${activeDay}-${index}-time`] && (
                                            <div className="absolute -bottom-5 right-4 text-[10px] font-bold text-red-500">
                                                {validationErrors[`${activeDay}-${index}-time`]}
                                            </div>
                                        )}

                                        <div className="w-32">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Start Time</label>
                                            <input
                                                type="time"
                                                value={period.startTime}
                                                onChange={(e) => handleUpdatePeriod(index, 'startTime', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                                            />
                                        </div>

                                        <div className="w-32">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">End Time</label>
                                            <input
                                                type="time"
                                                value={period.endTime}
                                                onChange={(e) => handleUpdatePeriod(index, 'endTime', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                                            />
                                        </div>

                                        <div className="w-32">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Room/Link</label>
                                            <input
                                                type="text"
                                                placeholder={period.type === 'online' ? 'Meet Link' : 'Room No'}
                                                value={period.room || period.link || ''}
                                                onChange={(e) => handleUpdatePeriod(index, period.type === 'online' ? 'link' : 'room', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                                            />
                                        </div>

                                        <div className="w-32">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Type</label>
                                            <select
                                                value={period.type}
                                                onChange={(e) => handleUpdatePeriod(index, 'type', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                                            >
                                                <option value="offline">Offline</option>
                                                <option value="online">Online</option>
                                            </select>
                                        </div>

                                        <button
                                            onClick={() => handleRemovePeriod(index)}
                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <Clock className="mx-auto text-gray-300 mb-3" size={40} />
                                    <p className="text-gray-500 font-medium">No periods added for this day</p>
                                    <button
                                        onClick={handleAddPeriod}
                                        className="text-indigo-600 text-sm font-bold mt-2 hover:underline"
                                    >
                                        Add your first period
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                    <Filter className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Select Context</h3>
                    <p className="text-gray-500">Please select a class and section to manage the timetable</p>
                </div>
            )}
        </div>
    );
};

export default WeeklyTimetable;
