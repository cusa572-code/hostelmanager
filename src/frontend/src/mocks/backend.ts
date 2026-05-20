import type { backendInterface } from "../backend";
import {
  AttendanceStatus,
  ComplaintStatus,
  NotificationType,
  PaymentStatus,
  PlanId,
  SeatType,
  StudentStatus,
  SubscriptionStatus,
  UdharCategory,
  Variant_full_empty_partial,
} from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);
const oneDayMs = BigInt(24 * 60 * 60 * 1000 * 1_000_000);
const twoDaysAgo = now - BigInt(2) * oneDayMs;
const inThreeDays = now + BigInt(3) * oneDayMs;
const inOneHour = now + BigInt(60 * 60 * 1000 * 1_000_000);
const fiveDaysAgo = now - BigInt(5) * oneDayMs;

const ok = <T>(ok: T) => ({ __kind__: "ok" as const, ok });
const err = (err: string) => ({ __kind__: "err" as const, err });

export const mockBackend: backendInterface = {
  activateSubscription: async () => undefined,
  cancelSubscription: async () => undefined,

  // ─── Notes ─────────────────────────────────────────────────────────────────
  createNote: async () => BigInt(3),
  updateNote: async () => true,
  deleteNote: async () => true,
  getNotes: async () => [
    {
      id: BigInt(1),
      title: "Room 302 Maintenance",
      content: "Schedule plumber visit for Room 302 water leak. Check all bathroom fixtures and report back to owner before weekend.",
      createdAt: twoDaysAgo,
      updatedAt: twoDaysAgo,
    },
    {
      id: BigInt(2),
      title: "Rent Collection Reminder",
      content: "Collect rent from rooms 101, 105, 207. Follow up with students who haven't paid yet this month.",
      createdAt: fiveDaysAgo,
      updatedAt: fiveDaysAgo,
    },
    {
      id: BigInt(3),
      title: "New Bedsheets Order",
      content: "Order 20 sets of bedsheets from supplier. Preferred color: white or light blue. Budget: ₹8,000.",
      createdAt: now - BigInt(1) * oneDayMs,
      updatedAt: now - BigInt(1) * oneDayMs,
    },
    {
      id: BigInt(4),
      title: "Gas Cylinder Refill",
      content: "Kitchen gas cylinder almost empty. Contact supplier for refill by tomorrow morning.",
      createdAt: fiveDaysAgo,
      updatedAt: fiveDaysAgo,
    },
  ],

  // ─── Reminders ─────────────────────────────────────────────────────────────
  createReminder: async () => BigInt(5),
  updateReminder: async () => true,
  deleteReminder: async () => true,
  markReminderDone: async () => true,
  getReminders: async () => [
    {
      id: BigInt(1),
      title: "Check-in: Room 201 — 2:00 PM",
      message: "New student Rahul Kumar checking in today at 2 PM. Room 201 should be ready.",
      remindAt: inThreeDays,
      createdAt: twoDaysAgo,
      isDone: false,
    },
    {
      id: BigInt(2),
      title: "Payment Due: Room 105",
      message: "Priya Singh's rent payment due. Amount: ₹8,500. Follow up if not received.",
      remindAt: inOneHour,
      createdAt: fiveDaysAgo,
      isDone: false,
    },
    {
      id: BigInt(3),
      title: "Maintenance Check: Room 302 — 9:00 AM",
      message: "Plumber visit scheduled for Room 302. Ensure student is aware.",
      remindAt: twoDaysAgo,
      createdAt: fiveDaysAgo - oneDayMs,
      isDone: false,
    },
    {
      id: BigInt(4),
      title: "Monthly Expense Report",
      message: "Submit April expense report to owner. Include rent, electricity, staff salary, and misc.",
      remindAt: now - oneDayMs,
      createdAt: fiveDaysAgo,
      isDone: true,
    },
  ],

  // ─── Seat / Dashboard ──────────────────────────────────────────────────────
  getSeatConfig: async () => ({
    totalCapacity: BigInt(50),
    pricePerSeatA: BigInt(8500),
    pricePerSeatB: BigInt(8900),
  }),
  setSeatConfig: async () => undefined,
  getMonthSeatSummary: async () => ({
    month: BigInt(4),
    year: BigInt(2026),
    pricePerSeatA: BigInt(8500),
    pricePerSeatB: BigInt(8900),
    revenueA: BigInt(170000),
    revenueB: BigInt(89000),
    totalBookedSeats: BigInt(30),
    totalRevenue: BigInt(259000),
    totalCapacity: BigInt(50),
    emptySeats: BigInt(20),
    bookedSeatsA: BigInt(20),
    bookedSeatsB: BigInt(10),
  }),
  setMonthlyBooking: async () => undefined,
  getMonthlyExpenses: async () => ({
    key: { month: BigInt(4), year: BigInt(2026) },
    rent: BigInt(50000),
    electricity: BigInt(8000),
    staffSalary: BigInt(25000),
    other: BigInt(5000),
  }),
  setMonthlyExpenses: async () => undefined,
  getMonthlyProfit: async () => ({
    month: BigInt(4),
    year: BigInt(2026),
    revenue: BigInt(259000),
    totalExpenses: BigInt(88000),
    profit: BigInt(171000),
  }),
  getTotalExpenses: async () => BigInt(88000),
  getYearlyProfitChart: async () =>
    Array.from({ length: 12 }, (_, i) => ({
      month: BigInt(i + 1),
      profit: BigInt(Math.floor(100000 + Math.random() * 100000)),
    })),

  // ─── Subscription ──────────────────────────────────────────────────────────
  startTrial: async () => undefined,
  stripeWebhook: async () => undefined,
  getMySubscription: async () => ({
    status: SubscriptionStatus.trial,
    userId: { toText: () => "abc123", compareTo: () => 0, isAnonymous: () => false, toUint8Array: () => new Uint8Array(), toHex: () => "abc" } as never,
    trialStartDate: twoDaysAgo,
    planId: undefined,
    expiryDate: undefined,
  }),
  getMySubscriptionStatus: async () => ({
    status: SubscriptionStatus.trial,
    daysRemaining: BigInt(5),
  }),

  // ─── Rooms ─────────────────────────────────────────────────────────────────
  getBuildingStats: async () => ({
    totalSeats: 14n,
    totalActiveStudents: 9n,
    totalEmptyRooms: 1n,
  }),
  createRoom: async () => ok(BigInt(3)),
  updateRoom: async () => ok(null),
  deleteRoom: async () => ok(null),
  getRooms: async () => [
    { id: 1n, roomNumber: "101", seatCount: 4n, occupiedSeats: 3n, status: Variant_full_empty_partial.partial },
    { id: 2n, roomNumber: "102", seatCount: 4n, occupiedSeats: 4n, status: Variant_full_empty_partial.full },
    { id: 3n, roomNumber: "201", seatCount: 2n, occupiedSeats: 0n, status: Variant_full_empty_partial.empty },
    { id: 4n, roomNumber: "202", seatCount: 4n, occupiedSeats: 2n, status: Variant_full_empty_partial.partial },
  ],
  getRoom: async (id) => ({
    id,
    roomNumber: id.toString(),
    seatCount: 4n,
    occupiedSeats: 2n,
    createdAt: fiveDaysAgo,
  }),

  // ─── Students ──────────────────────────────────────────────────────────────
  createStudent: async () => ok(BigInt(4)),
  updateStudent: async () => ok(null),
  vacateStudent: async () => ok(null),
  deleteStudent: async () => ok(null),
  updateStudentPhoto: async () => ok(null),
  updateStudentDocument: async () => ok(null),
  getStudents: async () => [
    { id: 1n, name: "Rahul Kumar", phone: "9876543210", status: StudentStatus.active, joinDate: fiveDaysAgo, roomId: 1n, roomNumber: "101", leaveDate: undefined },
    { id: 2n, name: "Priya Singh", phone: "9123456789", status: StudentStatus.active, joinDate: twoDaysAgo, roomId: 1n, roomNumber: "101", leaveDate: undefined },
    { id: 3n, name: "Amit Sharma", phone: "9000112233", status: StudentStatus.vacated, joinDate: fiveDaysAgo - oneDayMs * 30n, roomId: undefined, roomNumber: undefined, leaveDate: twoDaysAgo },
  ],
  getStudent: async (id) => ({
    id,
    name: id === 1n ? "Rahul Kumar" : id === 2n ? "Priya Singh" : "Amit Sharma",
    phone: "9876543210",
    address: "123 MG Road, Pune, Maharashtra",
    idProofText: "Aadhar: 1234-5678-9012",
    status: id === 3n ? StudentStatus.vacated : StudentStatus.active,
    joinDate: fiveDaysAgo,
    leaveDate: id === 3n ? twoDaysAgo : undefined,
    roomId: id !== 3n ? 1n : undefined,
    seatType: SeatType.typeA,
    createdAt: fiveDaysAgo,
    photoKey: undefined,
    documentKey: undefined,
  }),
  getStudentPayments: async (studentId) => [
    { id: 1n, studentId, month: 4n, year: 2026n, rentDue: 8500n, paidAmount: 8500n, status: PaymentStatus.paid, createdAt: twoDaysAgo, dueDate: now, lateFee: 0n, paidDate: twoDaysAgo, note: undefined },
    { id: 2n, studentId, month: 3n, year: 2026n, rentDue: 8500n, paidAmount: 4000n, status: PaymentStatus.partial, createdAt: fiveDaysAgo, dueDate: fiveDaysAgo, lateFee: 0n, paidDate: undefined, note: "Partial payment" },
  ],

  // ─── Payments ──────────────────────────────────────────────────────────────
  createPayment: async () => ok(BigInt(5)),
  updatePayment: async () => ok(null),
  deletePayment: async () => ok(null),
  getPayments: async () => [
    { id: 1n, studentId: 1n, month: 4n, year: 2026n, rentDue: 8500n, paidAmount: 8500n, status: PaymentStatus.paid, createdAt: twoDaysAgo, dueDate: now, lateFee: 0n, paidDate: twoDaysAgo, note: undefined },
    { id: 2n, studentId: 2n, month: 4n, year: 2026n, rentDue: 8900n, paidAmount: 4000n, status: PaymentStatus.partial, createdAt: twoDaysAgo, dueDate: now, lateFee: 0n, paidDate: undefined, note: undefined },
    { id: 3n, studentId: 1n, month: 3n, year: 2026n, rentDue: 8500n, paidAmount: 0n, status: PaymentStatus.pending, createdAt: fiveDaysAgo, dueDate: fiveDaysAgo, lateFee: 500n, paidDate: undefined, note: undefined },
  ],
  getHostelSettings: async () => ({ lateFeePerMonth: 500n }),
  updateHostelSettings: async () => ok(null),

  // ─── Udhar ─────────────────────────────────────────────────────────────────
  createUdharEntry: async () => ok(BigInt(3)),
  updateUdharEntry: async () => ok(null),
  markUdharPaid: async () => ok(null),
  deleteUdharEntry: async () => ok(null),
  getUdharEntries: async () => [
    { id: 1n, studentId: 1n, description: "Daily milk supply", category: UdharCategory.milk, amount: 600n, date: twoDaysAgo, isPaid: false, createdAt: twoDaysAgo },
    { id: 2n, studentId: 2n, description: "Grocery items", category: UdharCategory.grocery, amount: 450n, date: fiveDaysAgo, isPaid: false, createdAt: fiveDaysAgo },
    { id: 3n, studentId: 1n, description: "Extra snacks", category: UdharCategory.other, amount: 200n, date: fiveDaysAgo, isPaid: true, createdAt: fiveDaysAgo },
  ],
  getStudentUdhar: async (studentId) => ({
    studentId,
    totalOutstanding: 600n,
    entries: [
      { id: 1n, studentId, description: "Daily milk supply", category: UdharCategory.milk, amount: 600n, date: twoDaysAgo, isPaid: false, createdAt: twoDaysAgo },
    ],
  }),

  // ─── Complaints ────────────────────────────────────────────────────────────
  createComplaint: async () => ok(BigInt(3)),
  updateComplaintStatus: async () => ok(null),
  deleteComplaint: async () => ok(null),
  getComplaints: async () => [
    { id: 1n, roomNumber: "302", description: "Water leakage from bathroom ceiling since 3 days", status: ComplaintStatus.inProgress, createdAt: twoDaysAgo, updatedAt: twoDaysAgo, studentId: 1n },
    { id: 2n, roomNumber: "101", description: "Ceiling fan making loud noise", status: ComplaintStatus.pending, createdAt: fiveDaysAgo, updatedAt: fiveDaysAgo, studentId: 2n },
    { id: 3n, roomNumber: "201", description: "Door lock broken", status: ComplaintStatus.resolved, createdAt: fiveDaysAgo - oneDayMs, updatedAt: twoDaysAgo, studentId: undefined },
  ],

  // ─── Staff ─────────────────────────────────────────────────────────────────
  addStaff: async () => ok(BigInt(5)),
  updateStaff: async () => ok(null),
  removeStaff: async () => ok(null),
  getStaff: async () => [
    { id: 1n, name: "Ramesh Kumar", role: "Warden", joinDate: fiveDaysAgo, isActive: true, monthlySalary: 12000n },
    { id: 2n, name: "Sunita Devi", role: "Cook", joinDate: fiveDaysAgo, isActive: true, monthlySalary: 8000n },
    { id: 3n, name: "Mohan Lal", role: "Guard", joinDate: fiveDaysAgo, isActive: true, monthlySalary: 9500n },
  ],
  getStaffAttendance: async () => [
    { staffId: 1n, date: "2026-04-20", status: AttendanceStatus.present },
  ],
  getAttendanceByMonth: async () => [
    { staffId: 1n, date: "2026-04-20", status: AttendanceStatus.present },
    { staffId: 2n, date: "2026-04-20", status: AttendanceStatus.absent },
  ],
  markAttendance: async () => ok(null),
  getStaffSalaryReport: async () => ({
    year: 2026n,
    month: 4n,
    workingDays: 26n,
    totalEarned: 36500n,
    entries: [
      { staffId: 1n, name: "Ramesh Kumar", monthlySalary: 12000n, presentDays: 22n, earnedSalary: 10154n, totalWorkingDays: 26n },
      { staffId: 2n, name: "Sunita Devi", monthlySalary: 8000n, presentDays: 18n, earnedSalary: 5538n, totalWorkingDays: 26n },
      { staffId: 3n, name: "Mohan Lal", monthlySalary: 9500n, presentDays: 25n, earnedSalary: 9135n, totalWorkingDays: 26n },
    ],
  }),
  getMonthlyStaffExpense: async () => ({
    year: 2026n,
    month: 4n,
    workingDays: 26n,
    presentDays: 65n,
    totalSalary: 29500n,
  }),

  // ─── Notifications ─────────────────────────────────────────────────────────
  createNotification: async () => ok(BigInt(4)),
  markNotificationRead: async () => ok(null),
  markAllNotificationsRead: async () => ok(null),
  clearAllNotifications: async () => ok(null),
  getNotifications: async () => [
    { id: 1n, title: "Rent Due Tomorrow", message: "Priya Singh's rent is due tomorrow. ₹8,900 pending.", notifType: NotificationType.rentDue, isRead: false, createdAt: now - BigInt(30 * 60 * 1000 * 1_000_000), relatedId: 2n },
    { id: 2n, title: "Overdue Payment", message: "Rahul Kumar's March rent is overdue by 5 days.", notifType: NotificationType.paymentOverdue, isRead: false, createdAt: twoDaysAgo, relatedId: 1n },
    { id: 3n, title: "Room 201 Now Empty", message: "Room 201 has been vacated. Ready for new allocation.", notifType: NotificationType.emptyRoom, isRead: true, createdAt: fiveDaysAgo, relatedId: 3n },
    { id: 4n, title: "Complaint Update", message: "Water leakage complaint in Room 302 is now In Progress.", notifType: NotificationType.complaintUpdate, isRead: true, createdAt: twoDaysAgo, relatedId: 1n },
  ],
  getUnreadCount: async () => 2n,
};
