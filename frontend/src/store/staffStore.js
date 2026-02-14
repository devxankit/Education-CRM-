import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// import { initialStudents } from '../modules/staff/data/studentData'; // Deprecated
import { initialTeachers } from '../modules/staff/data/teacherData';
import { initialNotices } from '../modules/staff/data/supportData';
import { initialPayroll, initialExpenses } from '../modules/staff/data/financeData';
import { initialAssets, initialInventory } from '../modules/staff/data/inventoryData';
import { getAllStudents, admitStudent, updateStudentInfo, confirmAdmission as confirmAdmissionApi } from '../modules/staff/services/student.api';
import * as supportApi from '../modules/staff/services/support.api';
import { getMyNotices } from '../modules/staff/services/notices.api';

export const useStaffStore = create(
    persist(
        (set, get) => ({
            // State
            students: [],
            teachers: initialTeachers,
            employees: [], // Add if needed
            tickets: [],
            notices: [], // Initial empty array
            payroll: initialPayroll,
            expenses: initialExpenses,
            assets: initialAssets,
            inventory: initialInventory,

            // Actions: Notices
            fetchNotices: async () => {
                try {
                    const data = await getMyNotices();
                    const mapped = data.map(n => ({ ...n, id: n._id || n.id }));
                    set({ notices: mapped });
                } catch (err) {
                    console.error("Failed to fetch notices", err);
                }
            },

            // Actions: Tickets
            fetchTickets: async () => {
                try {
                    const data = await supportApi.getAllTickets();
                    const mapped = data.map(t => ({ ...t, id: t._id || t.id }));
                    set({ tickets: mapped });
                } catch (err) {
                    console.error("Failed to fetch tickets", err);
                }
            },

            addTicketAction: async (ticketData) => {
                try {
                    const response = await supportApi.createTicket(ticketData);
                    if (response.success) {
                        const newTicket = { ...response.data, id: response.data._id };
                        set((state) => ({
                            tickets: [newTicket, ...state.tickets]
                        }));
                        return newTicket;
                    }
                } catch (err) {
                    console.error("Failed to add ticket", err);
                    throw err;
                }
            },

            updateTicketAction: async (id, status) => {
                try {
                    await supportApi.updateTicketStatus(id, status);
                    set((state) => ({
                        tickets: state.tickets.map(t => (t._id === id || t.id === id) ? { ...t, status } : t)
                    }));
                } catch (err) {
                    console.error("Failed to update ticket", err);
                }
            },

            respondToTicketAction: async (id, responseText, status) => {
                try {
                    await supportApi.respondToTicket(id, responseText, status);
                    set((state) => ({
                        tickets: state.tickets.map(t => (t._id === id || t.id === id) ? {
                            ...t,
                            response: responseText,
                            status: status || "Resolved"
                        } : t)
                    }));
                } catch (err) {
                    console.error("Failed to respond to ticket", err);
                }
            },

            deleteTicketAction: async (id) => {
                try {
                    await supportApi.deleteTicket(id);
                    set((state) => ({
                        tickets: state.tickets.filter(t => t.id !== id && t._id !== id)
                    }));
                } catch (err) {
                    console.error("Failed to delete ticket", err);
                }
            },

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
                        const updatedStudent = { ...response.data, id: response.data._id };
                        set((state) => ({
                            students: state.students.map(s => (s.id === id || s._id === id) ? updatedStudent : s)
                        }));
                        return Promise.resolve(updatedStudent);
                    }
                } catch (error) {
                    console.error("Update student failed", error);
                    throw error;
                }
            },

            confirmAdmission: async (id) => {
                try {
                    const response = await confirmAdmissionApi(id);
                    if (response.success) {
                        const updatedStudent = { ...response.data, id: response.data._id };
                        set((state) => ({
                            students: state.students.map(s => (s.id === id || s._id === id) ? updatedStudent : s)
                        }));
                        return Promise.resolve(updatedStudent);
                    }
                } catch (error) {
                    console.error("Confirm admission failed", error);
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
