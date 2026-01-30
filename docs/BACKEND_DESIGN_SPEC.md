# 🎓 Education-CRM: Production Backend Design Specification (Final)

This document is derived strictly from the existing frontend modules: **Admin, Staff, Teacher, Student, and Parent**.

---

## 🏗️ 1. Architecture & Standards
- **Source of Truth:** All cross-module data (Students, Teachers) MUST be created by Admin/Staff. Sub-modules (Teacher, Student) are consumer/contributors only.
- **Role Control:** Middleware-based permission mapping (e.g., `checkPermission('mark_attendance')`).
- **Data Integrity:** MongoDB Transactions for critical flows like Fee Payments.

---

## 📊 2. ER Diagram (Unified)

```mermaid
erDiagram
    %% Core Users
    USER ||--|| ROLE : has
    USER ||--o{ PERMISSION : assigned

    %% People Management
    USER ||--|| STUDENT : becomes
    USER ||--|| TEACHER : becomes
    USER ||--|| STAFF : becomes
    USER ||--|| PARENT : becomes

    STUDENT }|--|| PARENT : linked
    STUDENT }|--|| SECTION : belongs

    %% Academics
    CLASS ||--o{ SECTION : contains
    SECTION ||--o{ SUBJECT_TEACHER_MAP : maps
    SUBJECT ||--o{ SUBJECT_TEACHER_MAP : maps
    TEACHER ||--o{ SUBJECT_TEACHER_MAP : assigned

    %% Life Cycle
    STUDENT ||--o{ ATTENDANCE : marked
    TEACHER ||--o{ HOMEWORK : creates
    HOMEWORK ||--o{ SUBMISSION : receives
    STUDENT ||--|| SUBMISSION : uploads

    EXAM }|--|| CLASS : for
    EXAM ||--o{ MARKS : records
    STUDENT ||--o{ MARKS : achieves

    %% Finance & Ops
    FEE_STRUCTURE }|--|| CLASS : defined
    FEE_PAYMENT }|--|| STUDENT : paid_by
    FEE_PAYMENT }|--|| FEE_STRUCTURE : for_type

    ASSET }|--|| STAFF : managed_by
    STAFF ||--o{ PAYROLL : receives
```

---

## 💾 3. Database Schema Design (Mongoose)

### 3.1 Role & Permission (The Security Base)
| Page Consuming: | `Admin -> Role Management` |
|-----------------|---------------------------|
```javascript
const PermissionSchema = {
    name: String, // e.g., "EDIT_STUDENT", "VIEW_PAYROLL"
    module: String, // "ADMIN", "STAFF", etc.
    description: String
};

const RoleSchema = {
    name: String, // "ADMIN", "CLASS_TEACHER", "DATA_ENTRY"
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }]
};
```

### 3.2 Academic Year & System Config
| Page Consuming: | `Admin -> Settings`, `Global Header` |
|-----------------|--------------------------------------|
```javascript
const AcademicYearSchema = {
    label: { type: String, required: true }, // "2025-2026"
    startDate: Date,
    endDate: Date,
    isCurrent: { type: Boolean, default: false }
};
```

### 3.3 Core People Entities
| Page Consuming: | `Admin -> Student/Teacher Lists`, `Module -> Profiles` |
|-----------------|--------------------------------------------------------|
```javascript
// TEACHER
{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    employeeId: { type: String, unique: true },
    details: { fullName: String, dob: Date, gender: String, joinDate: Date },
    qualification: [String],
    designation: String
}

// PARENT
{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    children: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    contact: { fatherName: String, motherName: String, phone: String, email: String }
}
```

### 3.4 Academic Mapping
**Key Rule:** Connects Classes to Subjects to Teachers.
| Page Consuming: | `Teacher -> Dashboard`, `Admin -> Academics` |
```javascript
const TeacherSubjectMapSchema = {
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
    class: { type: Schema.Types.ObjectId, ref: 'Class' },
    section: { type: Schema.Types.ObjectId, ref: 'Section' }
};
```

### 3.5 Homework & Submissions
| Page Consuming: | `Teacher -> Homework`, `Student/Parent -> Homework` |
```javascript
const HomeworkSchema = {
    title: { type: String, required: true },
    mappedClass: { type: Schema.Types.ObjectId, ref: 'Section' },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    dueDate: Date,
    attachments: [{ fileName: String, url: String }],
    status: { type: String, enum: ['Active', 'Draft', 'Closed'], default: 'Active' }
};
```

### 3.6 Finance (Fees & Payroll)
| Page Consuming: | `Admin -> Finance`, `Staff -> Payroll`, `Parent -> Fees` |
```javascript
const FeeStructureSchema = {
    class: { type: Schema.Types.ObjectId, ref: 'Class' },
    heads: [{
        name: String, // Tuition, Transport, Lib
        amount: Number,
        frequency: { type: String, enum: ['ONE_TIME', 'MONTHLY', 'QUARTERLY'] }
    }]
};

const FeePaymentSchema = {
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    amounts: [{ head: String, paid: Number }],
    transactionId: String,
    mode: { type: String, enum: ['ONLINE', 'BANK', 'CHQ', 'CASH'] },
    status: { type: String, enum: ['SUCCESS', 'PENDING', 'FAILED'] }
};
```

### 3.7 Exams & Performance
| Page Consuming: | `Admin -> Exams`, `Teacher -> Marks`, `Student -> Results` |
```javascript
const ExamSchema = {
    title: { type: String, required: true }, // Mid-Term 2025
    class: { type: Schema.Types.ObjectId, ref: 'Class' },
    term: String,
    subjects: [{
        subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
        date: Date,
        maxMarks: Number,
        passingMarks: Number
    }]
};

const MarkSchema = {
    exam: { type: Schema.Types.ObjectId, ref: 'Exam' },
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
    marksObtained: Number,
    grade: String,
    remarks: String
};
```

### 3.8 Support & Operations
| Page Consuming: | `Parent/Student -> Support Desk`, `Staff -> Support` |
```javascript
const TicketSchema = {
    raisedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    category: { type: String, enum: ['FINANCE', 'ACADEMIC', 'IT', 'OTHER'] },
    title: String,
    description: String,
    status: { type: String, enum: ['OPEN', 'PENDING', 'RESOLVED', 'CLOSED'], default: 'OPEN' },
    messages: [{
        sender: { type: Schema.Types.ObjectId, ref: 'User' },
        text: String,
        timestamp: { type: Date, default: Date.now }
    }]
};
```

---

## 🔀 4. Critical Data Flow Scenarios

### A. Student Admission (Admin)
1. **Admin** hits `POST /api/admin/students`.
2. **Backend**:
   - Creates `User` (Role: STUDENT).
   - Creates `Student` profile.
   - Triggers `AuditLog` of admission.
3. **Visibility**: Visible to assigned Class Teacher in `Teacher -> Attendance`.

### B. Teacher marking Attendance
1. **Teacher** selects Class-Section from `GET /api/teacher/classes`.
2. Hits `POST /api/teacher/attendance`.
3. **Backend**:
   - Enforces Role: TEACHER.
   - Checks `TeacherSubjectMap` to verify this teacher is allowed to mark for this class.
   - Stores Attendance.
4. **Visibility**: Instantly visible in `Student -> Attendance` and `Parent -> Academic Snapshot`.

---

## 📂 5. Folder Structure (Clean Monolith)

```
/education-crm-backend
├── /src
│   ├── /api
│   │   ├── /auth           # Login, JWT logic
│   │   ├── /admin          # P0 Routes (People, Finance, Setup)
│   │   ├── /academics      # Shared mapping logic
│   │   ├── /ops            # Transport, Assets, Notice
│   ├── /models             # Mongoose Schemas (Truth layer)
│   ├── /services           # High-level business handlers
│   ├── /middlewares        # Role-based middleware, Pagination
│   ├── /utils              # Excel/PDF generators, Date helpers
│   └── app.js
├── /config                 # Env vars, DB connection
└── package.json
```

---

## 🔒 6. Security & Production Guardrails
1. **JWT Auth:** 1h Access Token, 7d Refresh Token stored in HTTP-only cookies.
2. **Permission Guard:** Every sensitive route protected by `requirePermission('p_name')`.
3. **Audit Log Schema:** `CollectionName`, `DocId`, `ChangedBy`, `OldValue`, `NewValue`, `Timestamp`.
4. **Pagination:** Global interceptor ensuring `limit=50` max per request.
5. **Rate Limiting:** `express-rate-limit` for all `/auth` and `/ops` endpoints.
