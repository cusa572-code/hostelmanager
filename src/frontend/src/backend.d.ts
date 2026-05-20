import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MonthlyExpenses {
    key: MonthKey;
    other: Amount;
    rent: Amount;
    electricity: Amount;
    staffSalary: Amount;
}
export interface ComplaintInput {
    studentId?: StudentId;
    description: string;
    roomNumber: string;
}
export type ComplaintId = bigint;
export interface Complaint {
    id: ComplaintId;
    status: ComplaintStatus;
    studentId?: StudentId;
    createdAt: bigint;
    description: string;
    roomNumber: string;
    updatedAt: bigint;
}
export type ReminderId = bigint;
export interface HostelSettings {
    lateFeePerMonth: bigint;
}
export interface SubscriptionRecord {
    status: SubscriptionStatus;
    planId?: PlanId;
    expiryDate?: bigint;
    userId: Principal;
    trialStartDate: bigint;
}
export interface StudentInput {
    joinDate: bigint;
    name: string;
    address: string;
    idProofText: string;
    phone: string;
    roomId?: RoomId;
    seatType?: SeatType;
}
export interface SubscriptionStatusResult {
    status: SubscriptionStatus;
    daysRemaining: bigint;
}
export type RoomId = bigint;
export interface Room {
    id: RoomId;
    createdAt: bigint;
    seatCount: bigint;
    roomNumber: string;
    occupiedSeats: bigint;
}
export interface MonthlyProfit {
    month: bigint;
    revenue: Amount;
    year: bigint;
    totalExpenses: Amount;
    profit: bigint;
}
export interface SeatConfig {
    pricePerSeatA: Amount;
    pricePerSeatB: Amount;
    totalCapacity: bigint;
}
export interface Reminder {
    id: ReminderId;
    title: string;
    remindAt: bigint;
    createdAt: bigint;
    isDone: boolean;
    message: string;
}
export interface Staff {
    id: StaffId;
    joinDate: bigint;
    name: string;
    role: string;
    isActive: boolean;
    monthlySalary: bigint;
}
export interface UdharEntry {
    id: UdharId;
    studentId: StudentId;
    date: bigint;
    createdAt: bigint;
    description: string;
    isPaid: boolean;
    category: UdharCategory;
    amount: bigint;
}
export interface PaymentInput {
    status: PaymentStatus;
    month: bigint;
    studentId: StudentId;
    note?: string;
    year: bigint;
    rentDue: bigint;
    paidAmount: bigint;
}
export interface ExpenseInput {
    other: Amount;
    rent: Amount;
    electricity: Amount;
    staffSalary: Amount;
}
export interface UdharInput {
    studentId: StudentId;
    date: bigint;
    description: string;
    category: UdharCategory;
    amount: bigint;
}
export interface StudentSummary {
    id: StudentId;
    status: StudentStatus;
    joinDate: bigint;
    name: string;
    roomNumber?: string;
    phone: string;
    roomId?: RoomId;
    leaveDate?: bigint;
}
export interface Student {
    id: StudentId;
    status: StudentStatus;
    documentKey?: string;
    joinDate: bigint;
    name: string;
    createdAt: bigint;
    photoKey?: string;
    address: string;
    idProofText: string;
    phone: string;
    roomId?: RoomId;
    leaveDate?: bigint;
    seatType?: SeatType;
}
export type UdharId = bigint;
export interface YearlyChartEntry {
    month: bigint;
    profit: bigint;
}
export type StaffId = bigint;
export interface StaffSalaryReport {
    month: bigint;
    totalEarned: bigint;
    year: bigint;
    entries: Array<StaffSalaryEntry>;
    workingDays: bigint;
}
export type NoteId = bigint;
export interface Note {
    id: NoteId;
    title: string;
    content: string;
    createdAt: bigint;
    updatedAt: bigint;
}
export interface MonthKey {
    month: bigint;
    year: bigint;
}
export interface BuildingStats {
    totalEmptyRooms: bigint;
    totalSeats: bigint;
    totalActiveStudents: bigint;
}
export interface SeatSummary {
    month: bigint;
    pricePerSeatA: Amount;
    pricePerSeatB: Amount;
    year: bigint;
    revenueA: Amount;
    revenueB: Amount;
    totalBookedSeats: bigint;
    totalRevenue: Amount;
    totalCapacity: bigint;
    emptySeats: bigint;
    bookedSeatsA: bigint;
    bookedSeatsB: bigint;
}
export interface Payment {
    id: PaymentId;
    status: PaymentStatus;
    month: bigint;
    studentId: StudentId;
    note?: string;
    createdAt: bigint;
    year: bigint;
    dueDate: bigint;
    lateFee: bigint;
    paidDate?: bigint;
    rentDue: bigint;
    paidAmount: bigint;
}
export type StudentId = bigint;
export type Amount = bigint;
export interface StaffAttendance {
    status: AttendanceStatus;
    staffId: StaffId;
    date: string;
}
export interface RoomInput {
    seatCount: bigint;
    roomNumber: string;
}
export type PaymentId = bigint;
export type NotificationId = bigint;
export interface UdharSummary {
    studentId: StudentId;
    totalOutstanding: bigint;
    entries: Array<UdharEntry>;
}
export interface StaffSalaryEntry {
    earnedSalary: bigint;
    staffId: StaffId;
    presentDays: bigint;
    name: string;
    monthlySalary: bigint;
    totalWorkingDays: bigint;
}
export interface RoomSummary {
    id: RoomId;
    status: Variant_full_empty_partial;
    seatCount: bigint;
    roomNumber: string;
    occupiedSeats: bigint;
}
export interface StaffInput {
    joinDate: bigint;
    name: string;
    role: string;
    monthlySalary: bigint;
}
export interface NotificationInput {
    title: string;
    notifType: NotificationType;
    message: string;
    relatedId?: bigint;
}
export interface Notification {
    id: NotificationId;
    title: string;
    notifType: NotificationType;
    createdAt: bigint;
    isRead: boolean;
    message: string;
    relatedId?: bigint;
}
export interface MonthlyStaffExpense {
    month: bigint;
    presentDays: bigint;
    year: bigint;
    workingDays: bigint;
    totalSalary: bigint;
}
export enum AttendanceStatus {
    present = "present",
    absent = "absent"
}
export enum ComplaintStatus {
    resolved = "resolved",
    pending = "pending",
    inProgress = "inProgress"
}
export enum NotificationType {
    emptyRoom = "emptyRoom",
    complaintUpdate = "complaintUpdate",
    paymentOverdue = "paymentOverdue",
    rentDue = "rentDue"
}
export enum PaymentStatus {
    pending = "pending",
    paid = "paid",
    partial = "partial"
}
export enum PlanId {
    biannual = "biannual",
    annual = "annual",
    quarterly = "quarterly",
    monthly = "monthly"
}
export enum SeatType {
    typeA = "typeA",
    typeB = "typeB"
}
export enum StudentStatus {
    active = "active",
    vacated = "vacated"
}
export enum SubscriptionStatus {
    trial = "trial",
    active = "active",
    expired = "expired"
}
export enum UdharCategory {
    other = "other",
    milk = "milk",
    grocery = "grocery"
}
export enum Variant_full_empty_partial {
    full = "full",
    empty = "empty",
    partial = "partial"
}
export interface backendInterface {
    activateSubscription(planId: PlanId): Promise<void>;
    addStaff(input: StaffInput): Promise<{
        __kind__: "ok";
        ok: StaffId;
    } | {
        __kind__: "err";
        err: string;
    }>;
    cancelSubscription(): Promise<void>;
    clearAllNotifications(): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createComplaint(input: ComplaintInput): Promise<{
        __kind__: "ok";
        ok: ComplaintId;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createNote(title: string, content: string): Promise<NoteId>;
    createNotification(input: NotificationInput): Promise<{
        __kind__: "ok";
        ok: NotificationId;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createPayment(input: PaymentInput): Promise<{
        __kind__: "ok";
        ok: PaymentId;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createReminder(title: string, message: string, remindAt: bigint): Promise<ReminderId>;
    createRoom(input: RoomInput): Promise<{
        __kind__: "ok";
        ok: RoomId;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createStudent(input: StudentInput): Promise<{
        __kind__: "ok";
        ok: StudentId;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createUdharEntry(input: UdharInput): Promise<{
        __kind__: "ok";
        ok: UdharId;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteComplaint(id: ComplaintId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteNote(id: NoteId): Promise<boolean>;
    deletePayment(id: PaymentId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteReminder(id: ReminderId): Promise<boolean>;
    deleteRoom(id: RoomId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteStudent(id: StudentId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteUdharEntry(id: UdharId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAttendanceByMonth(year: bigint, month: bigint): Promise<Array<StaffAttendance>>;
    getBuildingStats(): Promise<BuildingStats>;
    getComplaints(): Promise<Array<Complaint>>;
    getHostelSettings(): Promise<HostelSettings>;
    getMonthSeatSummary(year: bigint, month: bigint): Promise<SeatSummary | null>;
    getMonthlyExpenses(year: bigint, month: bigint): Promise<MonthlyExpenses | null>;
    getMonthlyProfit(year: bigint, month: bigint): Promise<MonthlyProfit>;
    getMonthlyStaffExpense(year: bigint, month: bigint): Promise<MonthlyStaffExpense>;
    getMySubscription(): Promise<SubscriptionRecord | null>;
    getMySubscriptionStatus(): Promise<SubscriptionStatusResult>;
    getNotes(): Promise<Array<Note>>;
    getNotifications(): Promise<Array<Notification>>;
    getPayments(): Promise<Array<Payment>>;
    getReminders(): Promise<Array<Reminder>>;
    getRoom(id: RoomId): Promise<Room | null>;
    getRooms(): Promise<Array<RoomSummary>>;
    getSeatConfig(): Promise<SeatConfig | null>;
    getStaff(): Promise<Array<Staff>>;
    getStaffAttendance(staffId: StaffId, year: bigint, month: bigint): Promise<Array<StaffAttendance>>;
    getStaffSalaryReport(year: bigint, month: bigint): Promise<StaffSalaryReport>;
    getStudent(id: StudentId): Promise<Student | null>;
    getStudentPayments(studentId: StudentId): Promise<Array<Payment>>;
    getStudentUdhar(studentId: StudentId): Promise<UdharSummary>;
    getStudents(): Promise<Array<StudentSummary>>;
    getTotalExpenses(year: bigint, month: bigint): Promise<bigint>;
    getUdharEntries(): Promise<Array<UdharEntry>>;
    getUnreadCount(): Promise<bigint>;
    getYearlyProfitChart(year: bigint): Promise<Array<YearlyChartEntry>>;
    markAllNotificationsRead(): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    markAttendance(staffId: StaffId, date: string, status: AttendanceStatus): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    markNotificationRead(id: NotificationId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    markReminderDone(id: ReminderId): Promise<boolean>;
    markUdharPaid(id: UdharId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeStaff(id: StaffId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setMonthlyBooking(year: bigint, month: bigint, bookedSeatsA: bigint, bookedSeatsB: bigint): Promise<void>;
    setMonthlyExpenses(year: bigint, month: bigint, input: ExpenseInput): Promise<void>;
    setSeatConfig(totalCapacity: bigint, pricePerSeatA: bigint, pricePerSeatB: bigint): Promise<void>;
    startTrial(): Promise<void>;
    stripeWebhook(userId: Principal, planId: PlanId): Promise<void>;
    updateComplaintStatus(id: ComplaintId, status: ComplaintStatus): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateHostelSettings(settings: HostelSettings): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateNote(id: NoteId, title: string, content: string): Promise<boolean>;
    updatePayment(id: PaymentId, input: PaymentInput): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateReminder(id: ReminderId, title: string, message: string, remindAt: bigint): Promise<boolean>;
    updateRoom(id: RoomId, input: RoomInput): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateStaff(id: StaffId, input: StaffInput): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateStudent(id: StudentId, input: StudentInput): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateStudentDocument(id: StudentId, documentKey: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateStudentPhoto(id: StudentId, photoKey: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateUdharEntry(id: UdharId, input: UdharInput): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    vacateStudent(id: StudentId, leaveDate: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
