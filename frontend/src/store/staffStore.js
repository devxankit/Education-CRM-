import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// import { initialStudents } from '../modules/staff/data/studentData'; // Deprecated
import { initialTeachers } from '../modules/staff/data/teacherData';
import { initialTickets, initialNotices } from '../modules/staff/data/supportData';
import { initialPayroll, initialExpenses } from '../modules/staff/data/financeData';
import { initialAssets, initialInventory } from '../modules/staff/data/inventoryData';
import { getAllStudents, admitStudent, updateStudentInfo } from '../modules/staff/services/student.api';

export const useStaffStore = create(
    persist(
        (set, get) => ({
            // State
            students: [],
            teachers: initialTeachers,
            employees: [], // Add if needed
            tickets: initialTickets,
            notices: initialNotices,
            payroll: initialPayroll,
            expenses: initialExpenses,
            assets: initialAssets,
            inventory: initialInventory,

            // Actions: Tickets
            addTicket: (ticket) => set((state) => ({
                tickets: [
                    {
                        ...ticket,
                        id: `TKT-${Date.now()}`,
                        status: 'Open',
                        date: new Date().toISOString().split('T')[0]
                    },
                    ...state.tickets
                ]
            })),
            updateTicket: (id, data) => set((state) => ({
                tickets: state.tickets.map(t => t.id === id ? { ...t, ...data } : t)
            })),
            deleteTicket: (id) => set((state) => ({
                tickets: state.tickets.filter(t => t.id !== id)
            })),

            // Actions: Students
            fetchStudents: async () => {
                try {
                    const data = await getAllStudents();
                    // Ensure compatibility by mapping _id to id if needed
                    const mapped = data.map(s => ({ ...s, id: s._id || s.id }));
                    set({ students: mapped });
                } catch (err) {
                    console.error("Failed to update store students", err);
                }
            },

            addStudent: async (studentData) => {
                try {
                    const response = await admitStudent(studentData);
                    if (response.success) {
                        const newStudent = { ...response.data, id: response.data._id };
                        set((state) => ({
                            students: [...state.students, newStudent]
                        }));
                        return Promise.resolve(newStudent);
                    }
                } catch (error) {
                    console.error("Add student failed", error);
                    throw error;
                }
            },

            updateStudent: async (id, data) => {
                try {
                    const response = await updateStudentInfo(id, data);
                    if (response.success) {
                        set((state) => ({
                            students: state.students.map(s => (s.id === id || s._id === id) ? { ...s, ...data } : s)
                        }));
                        return Promise.resolve(response.data);
                    }
                } catch (error) {
                    console.error("Update student failed", error);
                    throw error;
                }
            },

            deleteStudent: (id) => set((state) => ({
                students: state.students.filter(s => s.id !== id)
            })),

            // Actions: Teachers
            addTeacher: (teacher) => set((state) => ({
                teachers: [...state.teachers, { ...teacher, id: `TCH-${Date.now()}`, status: 'Active' }]
            })),
            updateTeacher: (id, data) => set((state) => ({
                teachers: state.teachers.map(t => t.id === id ? { ...t, ...data } : t)
            })),
            deleteTeacher: (id) => set((state) => ({
                teachers: state.teachers.filter(t => t.id !== id)
            })),

            // Actions: Finance
            addExpense: (expense) => set((state) => ({
                expenses: [{ ...expense, id: `EXP-${Date.now()}`, status: 'Pending' }, ...state.expenses]
            })),
            updatePayroll: (id, data) => set((state) => ({
                payroll: state.payroll.map(p => p.id === id ? { ...p, ...data } : p)
            })),

            // Actions: Inventory
            addAsset: (asset) => set((state) => ({
                assets: [{ ...asset, id: `AST-${Date.now()}`, status: 'Active' }, ...state.assets]
            })),
            updateAsset: (id, data) => set((state) => ({
                assets: state.assets.map(a => a.id === id ? { ...a, ...data } : a)
            })),
            addInventoryItem: (item) => set((state) => ({
                inventory: [{ ...item, id: `INV-${Date.now()}` }, ...state.inventory]
            })),
        }),
        {
            name: 'staff-storage',
        }
    )
);
