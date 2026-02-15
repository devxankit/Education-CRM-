import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { API_URL } from '@/app/api';
import { initialTaxes, feeStructures as initialFeeStructures } from '../modules/admin/data/financeData';
import { initialClasses, initialSections } from '../modules/admin/data/academicData';
import { initialEmployees, initialTeachers } from '../modules/admin/data/peopleData';

export const useAdminStore = create(
    persist(
        (set, get) => ({
            // State
            classes: initialClasses,
            sections: initialSections,
            taxes: initialTaxes,
            students: [],
            parents: [],
            teachers: initialTeachers,
            employees: initialEmployees,
            feeStructures: initialFeeStructures,
            subjects: [],
            courses: [],
            feePolicies: [],
            payrollRules: [],
            expenseCategories: [],
            departments: [],
            branches: [],
            academicYears: [],
            dashboardStats: null,
            dashboardLoading: false,
            teacherMappings: [],
            timetable: null,
            timetableRules: null,
            toasts: [],
            roles: [
                { id: 1, name: 'Super Admin', code: 'ROLE_SUPER_ADMIN', type: 'system', description: 'Full access to all modules.', defaultDashboard: '/admin/dashboard', status: 'active', userCount: 2 },
                { id: 2, name: 'Teacher', code: 'ROLE_TEACHER', type: 'system', description: 'Can manage classes, attendance, and marks.', defaultDashboard: '/staff/dashboard', status: 'active', userCount: 45 },
                { id: 3, name: 'Accountant', code: 'ROLE_ACCOUNTANT', type: 'system', description: 'Manage fees and payroll.', defaultDashboard: '/finance/dashboard', status: 'active', userCount: 3 },
            ],

            // Actions: Departments
            fetchDepartments: async (branchId) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/department?branchId=${branchId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ departments: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching departments:', error);
                }
            },
            addDepartment: async (deptData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/department`, deptData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            departments: [...state.departments, response.data.data]
                        }));
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error adding department:', error);
                    throw error;
                }
            },
            updateDepartment: async (id, deptData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/department/${id}`, deptData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            departments: state.departments.map(d => d._id === id ? response.data.data : d)
                        }));
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error updating department:', error);
                    throw error;
                }
            },
            deleteDepartment: async (id) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.delete(`${API_URL}/department/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            departments: state.departments.filter(d => d._id !== id)
                        }));
                    }
                } catch (error) {
                    console.error('Error deleting department:', error);
                    throw error;
                }
            },

            // Actions: Dashboard
            fetchDashboardStats: async (branchId) => {
                set({ dashboardLoading: true });
                try {
                    const token = localStorage.getItem('token');
                    const url = branchId && branchId !== 'all'
                        ? `${API_URL}/dashboard?branchId=${branchId}`
                        : `${API_URL}/dashboard`;
                    const response = await axios.get(url, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ dashboardStats: response.data.data, dashboardLoading: false });
                        return response.data.data;
                    }
                    set({ dashboardLoading: false });
                } catch (error) {
                    console.error('Error fetching dashboard stats:', error);
                    set({ dashboardLoading: false });
                    throw error;
                }
            },

            // Actions: Branches
            fetchBranches: async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/branch`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ branches: response.data.data });
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error fetching branches:', error);
                    throw error;
                }
            },

            // Actions: Toasts
            addToast: (message, type = 'success') => {
                const id = Date.now();
                set((state) => ({
                    toasts: [...state.toasts, { id, message, type }]
                }));
                setTimeout(() => {
                    get().removeToast(id);
                }, 3000);
            },
            removeToast: (id) => {
                set((state) => ({
                    toasts: state.toasts.filter((t) => t.id !== id)
                }));
            },

            // Actions: Students
            setStudents: (students) => set({ students }),
            fetchStudents: async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/student`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ students: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching students:', error);
                }
            },
            fetchStudentById: async (id) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/student/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error fetching student by ID:', error);
                    throw error;
                }
            },
            admitStudent: async (studentData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/student/admit`, studentData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            students: [response.data.data, ...state.students]
                        }));
                        const msg = response.data.waitlisted ? 'Student added to waitlist' : 'Student admitted successfully';
                        get().addToast(msg, 'success');
                        return { ...response.data.data, waitlisted: response.data.waitlisted, isLateApplication: response.data.isLateApplication };
                    }
                } catch (error) {
                    console.error('Error admitting student:', error);
                    get().addToast(error.response?.data?.message || 'Error admitting student', 'error');
                    throw error;
                }
            },
            updateStudent: async (id, studentData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/student/${id}`, studentData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (response.data.success) {
                        set((state) => ({
                            students: state.students.map(s => (s._id === id || s.id === id) ? response.data.data : s)
                        }));
                        get().addToast('Student profile updated successfully', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error updating student:', error);
                    get().addToast(error.response?.data?.message || 'Error updating student', 'error');
                    throw error;
                }
            },
            recordFeePayment: async (studentId, payload) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/student/${studentId}/record-fee`, payload, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        get().addToast('Fee recorded successfully', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error recording fee:', error);
                    get().addToast(error.response?.data?.message || 'Failed to record fee', 'error');
                    throw error;
                }
            },
            confirmAdmission: async (id) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/student/${id}/confirm`, {}, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            students: state.students.map(s => (s._id === id || s.id === id) ? response.data.data : s)
                        }));
                        get().addToast('Admission confirmed successfully', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error confirming admission:', error);
                    get().addToast(error.response?.data?.message || 'Failed to confirm admission', 'error');
                    throw error;
                }
            },

            // Actions: Parents
            setParents: (parents) => set({ parents }),
            fetchParents: async (searchQuery = '') => {
                try {
                    const token = localStorage.getItem('token');
                    const url = searchQuery
                        ? `${API_URL}/parent?searchQuery=${searchQuery}`
                        : `${API_URL}/parent`;
                    const response = await axios.get(url, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ parents: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching parents:', error);
                }
            },
            addParent: async (parentData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/parent`, parentData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            parents: [response.data.data, ...state.parents]
                        }));
                        get().addToast('Parent created successfully', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error adding parent:', error);
                    get().addToast(error.response?.data?.message || 'Error adding parent', 'error');
                }
            },
            updateParent: async (id, data) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/parent/${id}`, data, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            parents: state.parents.map(p => p._id === id ? response.data.data : p)
                        }));
                        get().addToast('Parent updated successfully', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error updating parent:', error);
                    get().addToast(error.response?.data?.message || 'Error updating parent', 'error');
                }
            },

            // Actions: Teachers
            fetchTeachers: async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/teacher`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        const transformed = response.data.data.map(t => ({
                            ...t,
                            id: t._id,
                            name: `${t.firstName || ''} ${t.lastName || ''}`.trim() || 'No Name',
                        }));
                        set({ teachers: transformed });
                    }
                } catch (error) {
                    console.error('Error fetching teachers:', error);
                }
            },
            addTeacher: (teacher) => set((state) => ({
                teachers: [...state.teachers, { ...teacher, id: `TCH-${Date.now()}` }]
            })),
            updateTeacher: (id, data) => set((state) => ({
                teachers: state.teachers.map(t => t.id === id ? { ...t, ...data } : t)
            })),

            // Actions: Employees
            addEmployee: (employee) => set((state) => ({
                employees: [...state.employees, { ...employee, id: `EMP-${Date.now()}` }]
            })),
            updateEmployee: (id, data) => set((state) => ({
                employees: state.employees.map(e => e.id === id ? { ...e, ...data } : e)
            })),

            // Actions: Fee Structures
            fetchFeeStructures: async (branchId, academicYearId) => {
                try {
                    const token = localStorage.getItem('token');
                    let url = `${API_URL}/fee-structure?branchId=${branchId}`;
                    if (academicYearId) url += `&academicYearId=${academicYearId}`;
                    const response = await axios.get(url, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ feeStructures: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching fee structures:', error);
                }
            },
            addFeeStructure: async (fsData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/fee-structure`, fsData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            feeStructures: [response.data.data, ...state.feeStructures]
                        }));
                        get().addToast('Fee structure created', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error adding fee structure:', error);
                    get().addToast(error.response?.data?.message || 'Error creating fee structure', 'error');
                }
            },
            updateFeeStructure: async (id, data) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/fee-structure/${id}`, data, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            feeStructures: state.feeStructures.map(fs => fs._id === id ? response.data.data : fs)
                        }));
                        get().addToast('Fee structure updated', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error updating fee structure:', error);
                    get().addToast(error.response?.data?.message || 'Error updating fee structure', 'error');
                }
            },
            deleteFeeStructure: async (id) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.delete(`${API_URL}/fee-structure/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            feeStructures: state.feeStructures.filter(fs => (fs._id || fs.id) !== id)
                        }));
                        get().addToast('Fee structure deleted', 'success');
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Error deleting fee structure:', error);
                    get().addToast(error.response?.data?.message || 'Error deleting fee structure', 'error');
                    return false;
                }
            },

            // Actions: Roles
            addRole: (role) => set((state) => ({
                roles: [...state.roles, { ...role, id: Date.now(), type: 'custom', status: 'active', userCount: 0 }]
            })),
            updateRole: (id, data) => set((state) => ({
                roles: state.roles.map(r => r.id === id ? { ...r, ...data } : r)
            })),

            // Actions: Classes
            setClasses: (classes) => set({ classes }),
            fetchClasses: async (branchId) => {
                try {
                    const token = localStorage.getItem('token');
                    const url = branchId ? `${API_URL}/class?branchId=${branchId}` : `${API_URL}/class`;
                    const response = await axios.get(url, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ classes: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching classes:', error);
                }
            },
            addClass: async (newClass) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/class`, newClass, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            classes: [...state.classes, response.data.data]
                        }));
                        get().addToast('Class created successfully', 'success');
                    }
                } catch (error) {
                    console.error('Error adding class:', error);
                    get().addToast(error.response?.data?.message || 'Error creating class', 'error');
                }
            },
            updateClass: async (id, data) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/class/${id}`, data, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            classes: state.classes.map(c => c._id === id ? response.data.data : c)
                        }));
                        get().addToast('Class updated successfully', 'success');
                    }
                } catch (error) {
                    console.error('Error updating class:', error);
                    get().addToast(error.response?.data?.message || 'Error updating class', 'error');
                }
            },
            deleteClass: (id) => set((state) => ({
                classes: state.classes.filter(c => c._id !== id)
            })),

            // Actions: Taxes
            setTaxes: (taxes) => set({ taxes }),
            fetchTaxes: async (branchId) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/tax?branchId=${branchId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ taxes: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching taxes:', error);
                }
            },
            addTax: async (taxData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/tax`, taxData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            taxes: [response.data.data, ...state.taxes]
                        }));
                        get().addToast('Tax rule added', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error adding tax:', error);
                    get().addToast(error.response?.data?.message || 'Error adding tax', 'error');
                }
            },
            updateTax: async (id, data) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/tax/${id}`, data, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            taxes: state.taxes.map(t => (t._id === id || t.id === id) ? response.data.data : t)
                        }));
                        get().addToast('Tax rule updated', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error updating tax:', error);
                    get().addToast(error.response?.data?.message || 'Error updating tax', 'error');
                    throw error;
                }
            },
            deleteTax: async (id) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.delete(`${API_URL}/tax/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            taxes: state.taxes.filter(t => t._id !== id && t.id !== id)
                        }));
                        get().addToast('Tax rule deleted', 'success');
                        return true;
                    }
                } catch (error) {
                    console.error('Error deleting tax:', error);
                    get().addToast(error.response?.data?.message || 'Error deleting tax', 'error');
                    throw error;
                }
            },

            // Actions: Sections
            setSections: (classId, sections) => set((state) => ({
                sections: { ...state.sections, [classId]: sections }
            })),
            fetchSections: async (classId) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/class/section/${classId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            sections: { ...state.sections, [classId]: response.data.data }
                        }));
                    }
                } catch (error) {
                    console.error('Error fetching sections:', error);
                }
            },
            addSection: async (classId, section) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/class/section`, { ...section, classId }, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => {
                            const classSections = state.sections[classId] || [];
                            return {
                                sections: {
                                    ...state.sections,
                                    [classId]: [...classSections, response.data.data]
                                }
                            };
                        });
                        get().addToast('Section added successfully', 'success');
                    }
                } catch (error) {
                    console.error('Error adding section:', error);
                    get().addToast(error.response?.data?.message || 'Error adding section', 'error');
                }
            },
            updateSection: async (sectionId, classId, data) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/class/section/${sectionId}`, data, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => {
                            const classSections = state.sections[classId] || [];
                            return {
                                sections: {
                                    ...state.sections,
                                    [classId]: classSections.map(s => s._id === sectionId ? response.data.data : s)
                                }
                            };
                        });
                        get().addToast('Section updated successfully', 'success');
                    }
                } catch (error) {
                    console.error('Error updating section:', error);
                    get().addToast(error.response?.data?.message || 'Error updating section', 'error');
                }
            },

            // Actions: Subjects
            fetchSubjects: async (branchId) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/subject?branchId=${branchId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ subjects: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching subjects:', error);
                }
            },
            addSubject: async (subject) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/subject`, subject, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            subjects: [...state.subjects, response.data.data]
                        }));
                        get().addToast('Subject created successfully', 'success');
                    }
                } catch (error) {
                    console.error('Error adding subject:', error);
                    get().addToast(error.response?.data?.message || 'Error creating subject', 'error');
                }
            },
            updateSubject: async (id, data) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/subject/${id}`, data, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            subjects: state.subjects.map(s => s._id === id ? response.data.data : s)
                        }));
                        get().addToast('Subject updated successfully', 'success');
                    }
                } catch (error) {
                    console.error('Error updating subject:', error);
                    get().addToast(error.response?.data?.message || 'Error updating subject', 'error');
                }
            },
            deleteSubject: async (id) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.delete(`${API_URL}/subject/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            subjects: state.subjects.filter(s => s._id !== id)
                        }));
                        get().addToast('Subject deleted successfully', 'success');
                    }
                } catch (error) {
                    console.error('Error deleting subject:', error);
                    get().addToast(error.response?.data?.message || 'Error deleting subject', 'error');
                }
            },

            // Actions: Academic Years
            fetchAcademicYears: async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/academic-year`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ academicYears: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching academic years:', error);
                }
            },

            // Actions: Teacher Mapping
            fetchTeacherMappings: async (params) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/teacher-mapping`, {
                        params,
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ teacherMappings: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching teacher mappings:', error);
                }
            },
            assignTeacherMapping: async (mappingData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/teacher-mapping/assign`, mappingData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        get().addToast('Teacher assigned successfully', 'success');
                        // Refresh mappings for current view
                        return true;
                    }
                } catch (error) {
                    console.error('Error assigning teacher:', error);
                    get().addToast(error.response?.data?.message || 'Error assigning teacher', 'error');
                    return false;
                }
            },
            removeTeacherMapping: async (mappingData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/teacher-mapping/remove`, mappingData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        get().addToast('Assignment removed successfully', 'success');
                        return true;
                    }
                } catch (error) {
                    console.error('Error removing assignment:', error);
                    get().addToast(error.response?.data?.message || 'Error removing assignment', 'error');
                    return false;
                }
            },

            // Actions: Timetable
            fetchTimetable: async (params) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/timetable`, {
                        params,
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ timetable: response.data.data });
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error fetching timetable:', error);
                    get().addToast('Error fetching timetable', 'error');
                }
            },
            saveTimetable: async (timetableData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/timetable`, timetableData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ timetable: response.data.data });
                        get().addToast('Timetable saved successfully', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error saving timetable:', error);
                    get().addToast('Error saving timetable', 'error');
                    throw error;
                }
            },

            fetchTimetableRules: async (branchId) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/timetable-rule?branchId=${branchId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ timetableRules: response.data.data });
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error fetching timetable rules:', error);
                }
            },

            // Actions: Courses
            fetchCourses: async (branchId) => {
                try {
                    const token = localStorage.getItem('token');
                    const url = branchId ? `${API_URL}/course?branchId=${branchId}` : `${API_URL}/course`;
                    const response = await axios.get(url, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ courses: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching courses:', error);
                }
            },
            addCourse: async (courseData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/course`, courseData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            courses: [...state.courses, response.data.data]
                        }));
                        get().addToast('Course created successfully', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error adding course:', error);
                    get().addToast(error.response?.data?.message || 'Error creating course', 'error');
                    throw error;
                }
            },
            updateCourse: async (id, courseData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/course/${id}`, courseData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            courses: state.courses.map(c => c._id === id ? response.data.data : c)
                        }));
                        get().addToast('Course updated successfully', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error updating course:', error);
                    get().addToast(error.response?.data?.message || 'Error updating course', 'error');
                    throw error;
                }
            },
            deleteCourse: async (id) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.delete(`${API_URL}/course/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            courses: state.courses.filter(c => c._id !== id)
                        }));
                        get().addToast('Course deleted successfully', 'success');
                    }
                } catch (error) {
                    console.error('Error deleting course:', error);
                    get().addToast(error.response?.data?.message || 'Error deleting course', 'error');
                    throw error;
                }
            },

            // Actions: Fee Policies
            fetchFeePolicy: async (academicYearId) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/fee-policy?academicYearId=${academicYearId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error fetching fee policy:', error);
                }
            },
            saveFeePolicy: async (policyData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/fee-policy`, policyData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        get().addToast('Fee policy saved', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error saving fee policy:', error);
                    get().addToast(error.response?.data?.message || 'Error saving fee policy', 'error');
                }
            },

            // Actions: Payroll Rules
            fetchPayrollRule: async (financialYear) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/payroll-rule?financialYear=${financialYear}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error fetching payroll rule:', error);
                }
            },
            savePayrollRule: async (ruleData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/payroll-rule`, ruleData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        get().addToast('Payroll configuration saved', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error saving payroll rule:', error);
                    get().addToast(error.response?.data?.message || 'Error saving payroll rule', 'error');
                }
            },

            // Actions: Payroll
            payrolls: [],
            fetchPayrolls: async (filters = {}) => {
                try {
                    const token = localStorage.getItem('token');
                    const params = new URLSearchParams();
                    Object.keys(filters).forEach(key => {
                        if (filters[key]) params.append(key, filters[key]);
                    });
                    const response = await axios.get(`${API_URL}/payroll?${params.toString()}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ payrolls: response.data.data });
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error fetching payrolls:', error);
                    get().addToast(error.response?.data?.message || 'Error fetching payrolls', 'error');
                }
            },
            createPayroll: async (payrollData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/payroll`, payrollData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            payrolls: [response.data.data, ...state.payrolls]
                        }));
                        get().addToast('Payroll created successfully', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error creating payroll:', error);
                    get().addToast(error.response?.data?.message || 'Error creating payroll', 'error');
                    return null;
                }
            },
            updatePayroll: async (id, payrollData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/payroll/${id}`, payrollData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            payrolls: state.payrolls.map(p => (p._id || p.id) === id ? response.data.data : p)
                        }));
                        get().addToast('Payroll updated successfully', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error updating payroll:', error);
                    get().addToast(error.response?.data?.message || 'Error updating payroll', 'error');
                    return null;
                }
            },
            deletePayroll: async (id) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.delete(`${API_URL}/payroll/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            payrolls: state.payrolls.filter(p => (p._id || p.id) !== id)
                        }));
                        get().addToast('Payroll deleted successfully', 'success');
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Error deleting payroll:', error);
                    get().addToast(error.response?.data?.message || 'Error deleting payroll', 'error');
                    return false;
                }
            },
            fetchStaff: async (branchId) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/staff?branchId=${branchId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error fetching staff:', error);
                }
                return [];
            },

            // Actions: Expense Categories
            fetchExpenseCategories: async (branchId) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/expense-category?branchId=${branchId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ expenseCategories: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching expense categories:', error);
                }
            },
            addExpenseCategory: async (categoryData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/expense-category`, categoryData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            expenseCategories: [response.data.data, ...state.expenseCategories]
                        }));
                        get().addToast('Expense category created', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error adding expense category:', error);
                    get().addToast(error.response?.data?.message || 'Error creating expense category', 'error');
                }
            },
            updateExpenseCategory: async (id, data) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/expense-category/${id}`, data, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            expenseCategories: state.expenseCategories.map(ec => ec._id === id ? response.data.data : ec)
                        }));
                        get().addToast('Expense category updated', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error updating expense category:', error);
                    get().addToast(error.response?.data?.message || 'Error updating expense category', 'error');
                }
            },
            deleteExpenseCategory: async (id) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.delete(`${API_URL}/expense-category/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            expenseCategories: state.expenseCategories.filter(ec => ec._id !== id)
                        }));
                        get().addToast('Expense category deleted', 'success');
                    }
                } catch (error) {
                    console.error('Error deleting expense category:', error);
                    get().addToast(error.response?.data?.message || 'Error deleting expense category', 'error');
                }
            },

            // Actions: Admission Rules
            fetchAdmissionRule: async (academicYearId) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/admission-rule?academicYearId=${academicYearId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error fetching admission rule:', error);
                }
            },
            saveAdmissionRule: async (ruleData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/admission-rule/save`, ruleData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        get().addToast('Admission policy saved', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error saving admission rule:', error);
                    get().addToast(error.response?.data?.message || 'Error saving admission rule', 'error');
                }
            },

            // Actions: Transport Configuration
            fetchTransportConfig: async (branchId) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/transport-config?branchId=${branchId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error fetching transport config:', error);
                }
            },
            saveTransportConfig: async (configData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/transport-config/save`, configData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        get().addToast('Transport configuration saved', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error saving transport config:', error);
                    get().addToast(error.response?.data?.message || 'Error saving transport config', 'error');
                }
            },
            toggleTransportLock: async (id, lockData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/transport-config/${id}/lock`, lockData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        get().addToast(`Transport policy ${lockData.isLocked ? 'locked' : 'unlocked'}`, 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error toggling transport lock:', error);
                    get().addToast(error.response?.data?.message || 'Error toggling transport lock', 'error');
                }
            },

            // Actions: Transport Routes
            transportRoutes: [],
            fetchTransportRoutes: async (branchId) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/transport-route?branchId=${branchId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ transportRoutes: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching transport routes:', error);
                }
            },
            addTransportRoute: async (routeData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/transport-route`, routeData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            transportRoutes: [response.data.data, ...state.transportRoutes]
                        }));
                        get().addToast('Transport route created', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error adding transport route:', error);
                    get().addToast(error.response?.data?.message || 'Error creating transport route', 'error');
                }
            },
            updateTransportRoute: async (id, data) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/transport-route/${id}`, data, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            transportRoutes: state.transportRoutes.map(r => r._id === id ? response.data.data : r)
                        }));
                        get().addToast('Transport route updated', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error updating transport route:', error);
                    get().addToast(error.response?.data?.message || 'Error updating transport route', 'error');
                }
            },
            deleteTransportRoute: async (id) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.delete(`${API_URL}/transport-route/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            transportRoutes: state.transportRoutes.filter(r => r._id !== id)
                        }));
                        get().addToast('Transport route deleted', 'success');
                    }
                } catch (error) {
                    console.error('Error deleting transport route:', error);
                    get().addToast(error.response?.data?.message || 'Error deleting transport route', 'error');
                }
            },

            // Actions: Asset Governance
            assetCategories: [],
            fetchAssetCategories: async (branchId) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/asset-category?branchId=${branchId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ assetCategories: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching asset categories:', error);
                }
            },
            addAssetCategory: async (categoryData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/asset-category`, categoryData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            assetCategories: [...state.assetCategories, response.data.data]
                        }));
                        get().addToast('Asset category created', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error adding asset category:', error);
                    get().addToast(error.response?.data?.message || 'Error creating asset category', 'error');
                }
            },
            updateAssetCategory: async (id, data) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/asset-category/${id}`, data, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            assetCategories: state.assetCategories.map(c => c._id === id ? response.data.data : c)
                        }));
                        get().addToast('Asset category updated', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error updating asset category:', error);
                    get().addToast(error.response?.data?.message || 'Error updating asset category', 'error');
                }
            },
            deleteAssetCategory: async (id) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.delete(`${API_URL}/asset-category/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            assetCategories: state.assetCategories.filter(c => c._id !== id)
                        }));
                        get().addToast('Asset category deleted', 'success');
                    }
                } catch (error) {
                    console.error('Error deleting asset category:', error);
                    get().addToast(error.response?.data?.message || 'Error deleting asset category', 'error');
                }
            },
            fetchAssetRule: async (branchId) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/asset-rule?branchId=${branchId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error fetching asset rule:', error);
                }
            },
            saveAssetRule: async (ruleData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/asset-rule/save`, ruleData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        get().addToast('Asset governance policy saved', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error saving asset rule:', error);
                    get().addToast(error.response?.data?.message || 'Error saving asset policy', 'error');
                }
            },
            toggleAssetLock: async (id, lockData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/asset-rule/${id}/lock`, lockData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        get().addToast(`Asset policy ${lockData.isLocked ? 'locked' : 'unlocked'}`, 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error toggling asset lock:', error);
                    get().addToast(error.response?.data?.message || 'Error toggling asset lock', 'error');
                }
            },

            // Actions: Document Compliance Rules
            fetchDocumentRule: async (branchId) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/document-rule?branchId=${branchId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error fetching document rule:', error);
                }
            },
            saveDocumentRule: async (ruleData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/document-rule/save`, ruleData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        get().addToast('Document policy saved', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error saving document rule:', error);
                    get().addToast(error.response?.data?.message || 'Error saving document policy', 'error');
                }
            },
            toggleDocumentLock: async (id, lockData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/document-rule/${id}/lock`, lockData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        get().addToast(`Document policy ${lockData.isLocked ? 'locked' : 'unlocked'}`, 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error toggling document lock:', error);
                    get().addToast(error.response?.data?.message || 'Error toggling document lock', 'error');
                }
            },

            // Actions: Compliance Rules (Document Rules Compliance page)
            fetchComplianceRules: async (branchId) => {
                try {
                    const token = localStorage.getItem('token');
                    const url = branchId ? `${API_URL}/compliance-rule?branchId=${branchId}` : `${API_URL}/compliance-rule`;
                    const response = await axios.get(url, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.data.success) return response.data.data;
                } catch (error) {
                    console.error('Error fetching compliance rules:', error);
                }
                return [];
            },
            createComplianceRule: async (payload) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/compliance-rule`, payload, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.data.success) {
                        get().addToast('Compliance rule created', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    get().addToast(error.response?.data?.message || 'Error creating rule', 'error');
                    throw error;
                }
            },
            updateComplianceRule: async (id, payload) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/compliance-rule/${id}`, payload, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.data.success) {
                        get().addToast('Compliance rule updated', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    get().addToast(error.response?.data?.message || 'Error updating rule', 'error');
                    throw error;
                }
            },
            deleteComplianceRule: async (id) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.delete(`${API_URL}/compliance-rule/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.data.success) {
                        get().addToast('Compliance rule deleted', 'success');
                        return true;
                    }
                } catch (error) {
                    get().addToast(error.response?.data?.message || 'Error deleting rule', 'error');
                    throw error;
                }
            },
            toggleComplianceRuleStatus: async (id) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/compliance-rule/${id}/toggle`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.data.success) return response.data.data;
                } catch (error) {
                    get().addToast(error.response?.data?.message || 'Error toggling rule', 'error');
                    throw error;
                }
            },

            // Actions: Verification Policies
            fetchVerificationPolicies: async (branchId, entity) => {
                try {
                    const token = localStorage.getItem('token');
                    let url = `${API_URL}/verification-policy?branchId=${branchId}`;
                    if (entity) url += `&entity=${entity}`;
                    const response = await axios.get(url, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.data.success) return response.data.data;
                } catch (error) {
                    console.error('Error fetching verification policies:', error);
                }
                return [];
            },
            saveVerificationPolicies: async (branchId, entity, policies) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/verification-policy/save`, { branchId, entity, policies }, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.data.success) {
                        get().addToast('Verification policies saved', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    get().addToast(error.response?.data?.message || 'Error saving policies', 'error');
                    throw error;
                }
            },

            // Actions: Certificate Templates
            fetchCertificateTemplates: async (branchId) => {
                try {
                    const token = localStorage.getItem('token');
                    const url = branchId ? `${API_URL}/certificate-template?branchId=${branchId}` : `${API_URL}/certificate-template`;
                    const response = await axios.get(url, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.data.success) return response.data.data;
                } catch (error) {
                    console.error('Error fetching certificate templates:', error);
                }
                return [];
            },
            createCertificateTemplate: async (payload) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/certificate-template`, payload, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.data.success) {
                        get().addToast('Template created', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    get().addToast(error.response?.data?.message || 'Error creating template', 'error');
                    throw error;
                }
            },
            updateCertificateTemplate: async (id, payload) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/certificate-template/${id}`, payload, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.data.success) {
                        get().addToast('Template updated', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    get().addToast(error.response?.data?.message || 'Error updating template', 'error');
                    throw error;
                }
            },
            deleteCertificateTemplate: async (id) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.delete(`${API_URL}/certificate-template/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.data.success) {
                        get().addToast('Template deleted', 'success');
                        return true;
                    }
                } catch (error) {
                    get().addToast(error.response?.data?.message || 'Error deleting template', 'error');
                    throw error;
                }
            },
            updateCertificateTemplateStatus: async (id, status) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/certificate-template/${id}/status`, { status }, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.data.success) return response.data.data;
                } catch (error) {
                    get().addToast(error.response?.data?.message || 'Error updating status', 'error');
                    throw error;
                }
            },

            // Actions: Checklists
            fetchChecklists: async (branchId) => {
                try {
                    const token = localStorage.getItem('token');
                    const url = branchId ? `${API_URL}/checklist?branchId=${branchId}` : `${API_URL}/checklist`;
                    const response = await axios.get(url, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.data.success) return response.data.data;
                } catch (error) {
                    console.error('Error fetching checklists:', error);
                }
                return [];
            },
            saveChecklist: async (payload) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/checklist/save`, payload, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.data.success) {
                        get().addToast('Checklist saved', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    get().addToast(error.response?.data?.message || 'Error saving checklist', 'error');
                    throw error;
                }
            },
            deleteChecklist: async (id) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.delete(`${API_URL}/checklist/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.data.success) {
                        get().addToast('Checklist deleted', 'success');
                        return true;
                    }
                } catch (error) {
                    get().addToast(error.response?.data?.message || 'Error deleting checklist', 'error');
                    throw error;
                }
            },
            toggleChecklistStatus: async (id) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/checklist/${id}/toggle`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.data.success) return response.data.data;
                } catch (error) {
                    get().addToast(error.response?.data?.message || 'Error toggling checklist', 'error');
                    throw error;
                }
            },

            // Actions: Reports & Analytics
            fetchAcademicReport: async (params) => {
                try {
                    const token = localStorage.getItem('token');
                    const qs = new URLSearchParams(params || {}).toString();
                    const response = await axios.get(`${API_URL}/reports/academic?${qs}`, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.data.success) return response.data.data;
                } catch (error) {
                    console.error('Error fetching academic report:', error);
                }
                return { reportData: [], chartData: [], pieData: [] };
            },
            fetchFinanceReport: async (params) => {
                try {
                    const token = localStorage.getItem('token');
                    const qs = new URLSearchParams(params || {}).toString();
                    const response = await axios.get(`${API_URL}/reports/finance?${qs}`, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.data.success) return response.data.data;
                } catch (error) {
                    console.error('Error fetching finance report:', error);
                }
                return {};
            },
            fetchHRReport: async (params) => {
                try {
                    const token = localStorage.getItem('token');
                    const qs = new URLSearchParams(params || {}).toString();
                    const response = await axios.get(`${API_URL}/reports/hr?${qs}`, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.data.success) return response.data.data;
                } catch (error) {
                    console.error('Error fetching HR report:', error);
                }
                return {};
            },
            fetchOperationsReport: async (params) => {
                try {
                    const token = localStorage.getItem('token');
                    const qs = new URLSearchParams(params || {}).toString();
                    const response = await axios.get(`${API_URL}/reports/operations?${qs}`, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.data.success) return response.data.data;
                } catch (error) {
                    console.error('Error fetching operations report:', error);
                }
                return {};
            },

            // Actions: Support Rules
            fetchSupportRule: async (branchId) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/support-rule?branchId=${branchId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error fetching support rule:', error);
                }
            },
            saveSupportRule: async (ruleData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/support-rule/save`, ruleData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        get().addToast('Support policy saved', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error saving support rule:', error);
                    get().addToast(error.response?.data?.message || 'Error saving support policy', 'error');
                }
            },
            toggleSupportLock: async (id, lockData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/support-rule/${id}/lock`, lockData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        get().addToast(`Support policy ${lockData.isLocked ? 'locked' : 'unlocked'}`, 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error toggling support lock:', error);
                    get().addToast(error.response?.data?.message || 'Error toggling support lock', 'error');
                }
            },

            // Actions: Hostel Configuration
            fetchHostelConfig: async (branchId) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/hostel-config?branchId=${branchId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error fetching hostel config:', error);
                }
            },
            saveHostelConfig: async (configData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/hostel-config/save`, configData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        get().addToast('Hostel configuration saved', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error saving hostel config:', error);
                    get().addToast(error.response?.data?.message || 'Error saving hostel config', 'error');
                }
            },
            toggleHostelLock: async (id, lockData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/hostel-config/${id}/lock`, lockData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        get().addToast(`Hostel config ${lockData.isLocked ? 'locked' : 'unlocked'}`, 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error toggling hostel lock:', error);
                    get().addToast(error.response?.data?.message || 'Error toggling hostel lock', 'error');
                }
            },

            // Actions: Hostels
            hostels: [],
            fetchHostels: async (branchId) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/hostel?branchId=${branchId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ hostels: response.data.data });
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error fetching hostels:', error);
                }
            },
            createHostel: async (hostelData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/hostel`, hostelData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            hostels: [response.data.data, ...state.hostels]
                        }));
                        get().addToast('Hostel created successfully', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error creating hostel:', error);
                    get().addToast(error.response?.data?.message || 'Error creating hostel', 'error');
                    throw error;
                }
            },
            updateHostel: async (id, hostelData) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.put(`${API_URL}/hostel/${id}`, hostelData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            hostels: state.hostels.map(h => h._id === id ? response.data.data : h)
                        }));
                        get().addToast('Hostel updated successfully', 'success');
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error updating hostel:', error);
                    get().addToast(error.response?.data?.message || 'Error updating hostel', 'error');
                    throw error;
                }
            },
            fetchHostelById: async (id) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/hostel/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error fetching hostel by ID:', error);
                    // get().addToast(error.response?.data?.message || 'Error fetching hostel', 'error');
                }
            },
            deleteHostel: async (id) => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.delete(`${API_URL}/hostel/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            hostels: state.hostels.filter(h => h._id !== id)
                        }));
                        get().addToast('Hostel deleted successfully', 'success');
                    }
                } catch (error) {
                    console.error('Error deleting hostel:', error);
                    get().addToast(error.response?.data?.message || 'Error deleting hostel', 'error');
                    throw error;
                }
            },

            // Actions: Upload
            uploadFile: async (file, folder = 'general') => {
                try {
                    const token = localStorage.getItem('token');
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('folder', folder);

                    const response = await axios.post(`${API_URL}/upload/single`, formData, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    if (response.data.success) {
                        return response.data.url;
                    }
                } catch (error) {
                    console.error('Error uploading file:', error);
                    get().addToast('Error uploading file', 'error');
                    throw error;
                }
            },
        }),
        {
            name: 'admin-storage',
        }
    )
);

export default useAdminStore;
