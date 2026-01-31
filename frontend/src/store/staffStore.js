import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialStudents } from '../modules/staff/data/studentData';
import { initialTeachers } from '../modules/staff/data/teacherData';
import { initialTickets, initialNotices } from '../modules/staff/data/supportData';
import { initialPayroll, initialExpenses } from '../modules/staff/data/financeData';
import { initialAssets, initialInventory } from '../modules/staff/data/inventoryData';

export const useStaffStore = create(
    persist(
        (set, get) => ({
            // State
            students: initialStudents,
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
            addStudent: (student) => set((state) => ({
                students: [...state.students, { ...student, id: `STU-${Date.now()}` }]
            })),
            updateStudent: (id, data) => set((state) => ({
                students: state.students.map(s => s.id === id ? { ...s, ...data } : s)
            })),
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
