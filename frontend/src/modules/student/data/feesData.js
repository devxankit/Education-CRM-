
export const feesData = {
    summary: {
        totalAmount: 125000,
        paidAmount: 75000,
        pendingAmount: 50000,
        nextDueDate: "2026-02-15",
        status: "Partial", // Paid, Partial, Due, Overdue
        lastUpdated: "2026-01-16T10:00:00"
    },
    paymentAction: {
        canPayPartial: true,
        minPayableAmount: 5000,
        currencySymbol: "₹"
    },
    breakdown: [
        { id: 1, type: "Annual Tuition Fee", amount: 90000, paid: 60000, pending: 30000 },
        { id: 2, type: "Development Charges", amount: 15000, paid: 15000, pending: 0 },
        { id: 3, type: "Exam Fee", amount: 5000, paid: 0, pending: 5000 },
        { id: 4, type: "Transport Fee (Zone B)", amount: 12000, paid: 0, pending: 12000 },
        { id: 5, type: "Library & Lab Charges", amount: 3000, paid: 0, pending: 3000 }
    ],
    installments: [
        { id: 101, title: "1st Installment", amount: 45000, dueDate: "2025-06-15", status: "Paid" },
        { id: 102, title: "2nd Installment", amount: 30000, dueDate: "2025-09-15", status: "Paid" },
        { id: 103, title: "3rd Installment", amount: 25000, dueDate: "2026-02-15", status: "Due" }, // Current Due
        { id: 104, title: "4th Installment", amount: 25000, dueDate: "2026-05-15", status: "Upcoming" }
    ],
    history: [
        {
            id: "TXN_77889900",
            date: "2025-09-14",
            amount: 30000,
            mode: "UPI",
            transactionId: "UPI/321456/SBI",
            status: "Success",
            receiptUrl: "#"
        },
        {
            id: "TXN_11223344",
            date: "2025-06-10",
            amount: 45000,
            mode: "Net Banking",
            transactionId: "NB/HDFC/998877",
            status: "Success",
            receiptUrl: "#"
        }
    ]
};
