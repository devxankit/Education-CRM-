import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_PARENT_DATA, MOCK_FEES, MOCK_ATTENDANCE, MOCK_HOMEWORK, MOCK_TEACHERS, MOCK_DOCUMENTS, MOCK_EXAMS, MOCK_RESULT_DETAILS, MOCK_HOMEWORK_DETAILS } from '../modules/parent/data/mockData';

export const useParentStore = create(
    persist(
        (set, get) => ({
            // User & Children
            user: MOCK_PARENT_DATA.user,
            children: MOCK_PARENT_DATA.children,
            selectedChildId: MOCK_PARENT_DATA.children[0]?.id || null,

            // Data
            notices: MOCK_PARENT_DATA.notices,
            fees: MOCK_FEES,
            attendance: MOCK_ATTENDANCE,
            homework: MOCK_HOMEWORK,
            homeworkDetails: MOCK_HOMEWORK_DETAILS,
            teachers: MOCK_TEACHERS,
            documents: MOCK_DOCUMENTS,
            exams: MOCK_EXAMS,
            results: MOCK_RESULT_DETAILS,
            tickets: [],

            // Actions
            setSelectedChild: (id) => set({ selectedChildId: id }),

            updateChildData: (childId, data) => set((state) => ({
                children: state.children.map(c => c.id === childId ? { ...c, ...data } : c)
            })),

            addTicket: (ticket) => set((state) => ({
                tickets: [{ ...ticket, id: `TKT-${Date.now()}`, status: 'Open', date: new Date().toISOString() }, ...state.tickets]
            })),

            payFee: (amount, mode) => set((state) => {
                const newReceipt = { id: `REC-${Date.now()}`, date: new Date().toISOString().split('T')[0], amount, mode };
                return {
                    fees: {
                        ...state.fees,
                        summary: {
                            ...state.fees.summary,
                            paid: state.fees.summary.paid + amount,
                            pending: state.fees.summary.pending - amount
                        },
                        receipts: [newReceipt, ...state.fees.receipts]
                    }
                };
            }),

            acknowledgeNotice: (noticeId) => set((state) => ({
                notices: state.notices.map(n => n.id === noticeId ? { ...n, acknowledged: true } : n)
            }))
        }),
        {
            name: 'parent-storage',
        }
    )
);
