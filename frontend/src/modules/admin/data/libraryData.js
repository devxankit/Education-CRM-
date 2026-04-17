/**
 * Mock Data for Library Management Module
 */

export const libraryStats = {
    totalBooks: 4250,
    activeLoans: 128,
    overdueBooks: 15,
    newArrivals: 42,
    totalMembers: 850,
    reservations: 24
};

export const mockBooks = [
    { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', category: 'Fiction', total: 5, available: 3, rack: 'A-101', status: 'In Stock' },
    { id: '2', title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Technology', total: 8, available: 2, rack: 'T-202', status: 'Low Stock' },
    { id: '3', title: 'Deep Work', author: 'Cal Newport', isbn: '978-1455586691', category: 'Self-Help', total: 4, available: 0, rack: 'S-303', status: 'Out of Stock' },
    { id: '4', title: 'The Silent Patient', author: 'Alex Michaelides', isbn: '978-1250301697', category: 'Thriller', total: 6, available: 6, rack: 'T-404', status: 'In Stock' },
    { id: '5', title: 'Atomic Habits', author: 'James Clear', isbn: '978-0735211292', category: 'Self-Help', total: 10, available: 4, rack: 'S-304', status: 'In Stock' },
    { id: '6', title: 'The Alchemist', author: 'Paulo Coelho', isbn: '978-0062315007', category: 'Fiction', total: 12, available: 12, rack: 'A-102', status: 'In Stock' },
];

export const mockIssuance = [
    { id: '1', bookTitle: 'Clean Code', memberName: 'Ankit Sharma', memberId: 'ST-2024-001', issueDate: '2024-04-10', dueDate: '2024-04-24', status: 'Issued' },
    { id: '2', bookTitle: 'Deep Work', memberName: 'Priya Verma', memberId: 'ST-2024-045', issueDate: '2024-03-25', dueDate: '2024-04-08', status: 'Overdue' },
    { id: '3', bookTitle: 'Atomic Habits', memberName: 'Rajesh Kumar', memberId: 'ST-2024-012', issueDate: '2024-04-15', dueDate: '2024-04-29', status: 'Issued' },
    { id: '4', bookTitle: 'The Great Gatsby', memberName: 'Sunita Gill', memberId: 'TF-2024-005', issueDate: '2024-04-05', dueDate: '2024-04-19', status: 'Returned' },
    { id: '5', bookTitle: 'Clean Code', memberName: 'Amit Patel', memberId: 'ST-2024-089', issueDate: '2024-04-12', dueDate: '2024-04-26', status: 'Issued' },
];

export const mockMembers = [
    { id: '1', name: 'Ankit Sharma', memberId: 'ST-2024-001', role: 'Student', email: 'ankit@example.com', joined: '2024-01-15', activeLoans: 1 },
    { id: '2', name: 'Priya Verma', memberId: 'ST-2024-045', role: 'Student', email: 'priya@example.com', joined: '2024-01-20', activeLoans: 2 },
    { id: '3', name: 'Rajesh Kumar', memberId: 'ST-2024-012', role: 'Student', email: 'rajesh@example.com', joined: '2024-02-01', activeLoans: 1 },
    { id: '4', name: 'Sunita Gill', memberId: 'TF-2024-005', role: 'Teacher', email: 'sunita@example.com', joined: '2023-08-10', activeLoans: 0 },
    { id: '5', name: 'Amit Patel', memberId: 'ST-2024-089', role: 'Student', email: 'amit@example.com', joined: '2024-03-05', activeLoans: 1 },
];

export const mockReservations = [
    { id: '1', bookTitle: 'Deep Work', memberName: 'Vikram Singh', reservationDate: '2024-04-16', expiryDate: '2024-04-18', status: 'Available' },
    { id: '2', bookTitle: 'The Silent Patient', memberName: 'Neha Kapoor', reservationDate: '2024-04-17', expiryDate: '2024-04-19', status: 'Pending' },
    { id: '3', bookTitle: 'The Alchemist', memberName: 'Suresh Raina', reservationDate: '2024-04-15', expiryDate: '2024-04-17', status: 'Cancelled' },
];

export const mockFines = [
    { id: '1', memberName: 'Priya Verma', bookTitle: 'Deep Work', amount: 50.00, reason: 'Overdue (7 days)', date: '2024-04-15', status: 'Unpaid' },
    { id: '2', memberName: 'Rahul Dravid', bookTitle: 'Atomic Habits', amount: 20.00, reason: 'Late Return (2 days)', date: '2024-04-10', status: 'Paid' },
];
