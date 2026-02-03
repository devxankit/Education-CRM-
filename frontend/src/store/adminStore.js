import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { API_URL } from '../app/api';
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
            departments: ['Office', 'Finance', 'Transport', 'Maintenance', 'Security', 'Academic'],
            roles: [
                { id: 1, name: 'Super Admin', code: 'ROLE_SUPER_ADMIN', type: 'system', description: 'Full access to all modules.', defaultDashboard: '/admin/dashboard', status: 'active', userCount: 2 },
                { id: 2, name: 'Teacher', code: 'ROLE_TEACHER', type: 'system', description: 'Can manage classes, attendance, and marks.', defaultDashboard: '/staff/dashboard', status: 'active', userCount: 45 },
                { id: 3, name: 'Accountant', code: 'ROLE_ACCOUNTANT', type: 'system', description: 'Manage fees and payroll.', defaultDashboard: '/finance/dashboard', status: 'active', userCount: 3 },
            ],

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
            addStudent: (student) => set((state) => ({
                students: [...state.students, { ...student, id: `ADM-${Date.now()}` }]
            })),
            updateStudent: (id, data) => set((state) => ({
                students: state.students.map(s => s.id === id ? { ...s, ...data } : s)
            })),

            // Actions: Parents
            setParents: (parents) => set({ parents }),
            fetchParents: async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/parent`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ parents: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching parents:', error);
                }
            },
            addParent: (parent) => set((state) => ({
                parents: [...state.parents, parent]
            })),
            updateParent: (id, data) => set((state) => ({
                parents: state.parents.map(p => p._id === id ? { ...p, ...data } : p)
            })),

            // Actions: Teachers
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
            addFeeStructure: (fs) => set((state) => ({
                feeStructures: [...state.feeStructures, { ...fs, id: `FS-${Date.now()}` }]
            })),
            updateFeeStructure: (id, data) => set((state) => ({
                feeStructures: state.feeStructures.map(fs => fs.id === id ? { ...fs, ...data } : fs)
            })),

            // Actions: Roles
            addRole: (role) => set((state) => ({
                roles: [...state.roles, { ...role, id: Date.now(), type: 'custom', status: 'active', userCount: 0 }]
            })),
            updateRole: (id, data) => set((state) => ({
                roles: state.roles.map(r => r.id === id ? { ...r, ...data } : r)
            })),

            // Actions: Classes
            setClasses: (classes) => set({ classes }),
            addClass: (newClass) => set((state) => ({
                classes: [...state.classes, { ...newClass, id: Date.now().toString() }]
            })),
            updateClass: (id, data) => set((state) => ({
                classes: state.classes.map(c => c.id === id ? { ...c, ...data } : c)
            })),
            deleteClass: (id) => set((state) => ({
                classes: state.classes.filter(c => c.id !== id)
            })),

            // Actions: Taxes
            setTaxes: (taxes) => set({ taxes }),
            addTax: (tax) => set((state) => ({
                taxes: [...state.taxes, { ...tax, id: Date.now() }]
            })),
            updateTax: (id, data) => set((state) => ({
                taxes: state.taxes.map(t => t.id === id ? { ...t, ...data } : t)
            })),
            deleteTax: (id) => set((state) => ({
                taxes: state.taxes.filter(t => t.id !== id)
            })),

            // Actions: Sections
            setSections: (classId, sections) => set((state) => ({
                sections: { ...state.sections, [classId]: sections }
            })),
            addSection: (classId, section) => set((state) => {
                const classSections = state.sections[classId] || [];
                return {
                    sections: {
                        ...state.sections,
                        [classId]: [...classSections, { ...section, id: Date.now().toString() }]
                    }
                };
            }),
        }),
        {
            name: 'admin-storage',
        }
    )
);
