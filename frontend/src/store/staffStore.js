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
import { fetchTeachers as fetchTeachersApi, createTeacher as createTeacherApi, updateTeacher as updateTeacherApi, deleteTeacher as deleteTeacherApi } from '../modules/staff/services/staff.api';

export const useStaffStore = create(
    persist(
        (set, get) => ({
            // State
            students: [],
            teachers: [], // Change from initialTeachers to empty array
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

            // Actions: Tickets (student + teacher tickets, filtered by staff's branch & academic year on backend)
            fetchTickets: async () => {
                try {
                    const [studentTickets, teacherTickets] = await Promise.all([
                        supportApi.getAllTickets(),
                        supportApi.getTeacherTickets()
                    ]);
                    const studentMapped = (studentTickets || []).map(t => ({ ...t, id: t._id || t.id }));
                    const teacherMapped = (teacherTickets || []).map(t => ({ ...t, id: t._id || t.id, _ticketType: 'teacher' }));
                    const merged = [...teacherMapped, ...studentMapped].sort(
                        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                    );
                    set({ tickets: merged });
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

            respondToTicketAction: async (id, responseText, status, isTeacherTicket = false) => {
                try {
                    const api = isTeacherTicket ? supportApi.respondToTeacherTicket : supportApi.respondToTicket;
                    const response = await api(id, responseText, status);
                    if (response.success) {
                        const updatedTicket = { ...response.data, id: response.data._id || response.data.id };
                        set((state) => ({
                            tickets: state.tickets.map(t => (t._id === id || t.id === id) ? updatedTicket : t)
                        }));
                        return response.data;
                    }
                } catch (err) {
                    console.error("Failed to respond to ticket", err);
                    throw err;
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
            fetchTeachers: async () => {
                try {
                    const data = await fetchTeachersApi();
                    const mapped = data.map(t => ({
                        ...t,
                        id: t._id || t.id,
                        name: `${t.firstName} ${t.lastName}`,
                        employeeId: t.employeeId,
                        subjects: t.eligibleSubjects ? t.eligibleSubjects.map(s => s.name || s) : [],
                        type: t.designation || 'Permanent',
                        status: t.teachingStatus || 'Active',
                        doj: t.joiningDate ? new Date(t.joiningDate).toISOString().split('T')[0] : 'N/A',
                        contact: {
                            phone: t.phone || 'N/A',
                            email: t.email || 'N/A',
                            address: t.address || 'N/A'
                        },
                        academics: {
                            subjects: t.eligibleSubjects ? t.eligibleSubjects.map(s => s.name || s) : [],
                            classes: t.assignedClasses || [] // Assuming backend might provide this or keep empty
                        },
                        payroll: {
                            salary: t.salary || 0,
                            type: t.salaryType || 'Monthly',
                            deductions: t.deductions || 0,
                            status: t.lastPayrollStatus || 'N/A'
                        },
                        documents: t.documents || []
                    }));
                    set({ teachers: mapped });
                } catch (err) {
                    console.error("Failed to fetch teachers", err);
                }
            },

            addTeacher: async (teacherData) => {
                try {
                    const response = await createTeacherApi(teacherData);
                    if (response.success) {
                        const newTeacher = { ...response.data, id: response.data._id };
                        // Re-fetch or update local state
                        set((state) => ({
                            teachers: [...state.teachers, newTeacher]
                        }));
                        return response;
                    }
                    return response;
                } catch (err) {
                    console.error("Failed to add teacher", err);
                    throw err;
                }
            },

            updateTeacher: async (id, data) => {
                try {
                    const response = await updateTeacherApi(id, data);
                    if (response.success) {
                        set((state) => ({
                            teachers: state.teachers.map(t => (t.id === id || t._id === id) ? { ...t, ...response.data } : t)
                        }));
                    }
                    return response;
                } catch (err) {
                    console.error("Failed to update teacher", err);
                    throw err;
                }
            },
            deleteTeacher: async (id) => {
                try {
                    const response = await deleteTeacherApi(id);
                    if (response.success) {
                        set((state) => ({
                            teachers: state.teachers.filter(t => (t.id !== id && t._id !== id))
                        }));
                    }
                    return response;
                } catch (err) {
                    console.error("Failed to delete teacher", err);
                    throw err;
                }
            },

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
