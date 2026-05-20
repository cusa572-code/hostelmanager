// Re-export types from backend for convenience
export type {
  SeatConfig,
  MonthlyExpenses,
  SeatSummary,
  ExpenseInput,
  MonthlyProfit,
  YearlyChartEntry,
  MonthKey,
  Amount,
  SubscriptionRecord,
  PlanId,
  SubscriptionStatus,
  Note,
  NoteId,
  Reminder,
  ReminderId,
  // New domain types from backend
  RoomId,
  Room,
  RoomInput,
  RoomSummary,
  BuildingStats,
  StudentId,
  Student,
  StudentInput,
  StudentSummary,
  PaymentId,
  Payment,
  PaymentInput,
  HostelSettings,
  UdharId,
  UdharEntry,
  UdharInput,
  UdharSummary,
  ComplaintId,
  Complaint,
  ComplaintInput,
  NotificationId,
  Notification,
  NotificationInput,
  // Staff types
  StaffId,
  Staff,
  StaffInput,
  StaffAttendance,
  StaffSalaryEntry,
  StaffSalaryReport,
  MonthlyStaffExpense,
} from "./backend";

export {
  ComplaintStatus,
  NotificationType,
  PaymentStatus,
  SeatType,
  StudentStatus,
  UdharCategory,
  Variant_full_empty_partial as RoomOccupancyStatus,
  AttendanceStatus,
} from "./backend";

// UI-specific types
export interface MonthlyBooking {
  year: bigint;
  month: bigint;
  bookedSeatsA: bigint;
  bookedSeatsB: bigint;
}

export interface MonthSelectorState {
  year: number;
  month: number; // 1-12
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export interface SubscriptionStatusInfo {
  status: "trial" | "active" | "expired";
  daysRemaining: number;
}

export interface PlanOption {
  id: "monthly" | "quarterly" | "biannual" | "annual";
  label: string;
  duration: string;
  price: number;
  priceLabel: string;
  perMonth: string;
  highlight?: boolean;
}

export const PLAN_OPTIONS: PlanOption[] = [
  {
    id: "monthly",
    label: "1 Month",
    duration: "30 days access",
    price: 100,
    priceLabel: "₹100",
    perMonth: "₹100/mo",
  },
  {
    id: "quarterly",
    label: "3 Months",
    duration: "90 days access",
    price: 250,
    priceLabel: "₹250",
    perMonth: "₹83/mo",
    highlight: true,
  },
  {
    id: "biannual",
    label: "6 Months",
    duration: "180 days access",
    price: 450,
    priceLabel: "₹450",
    perMonth: "₹75/mo",
  },
  {
    id: "annual",
    label: "1 Year",
    duration: "365 days access",
    price: 800,
    priceLabel: "₹800",
    perMonth: "₹67/mo",
  },
];

// Language
export type Language = "en" | "hi";
