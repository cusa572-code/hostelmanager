import type { Language } from "@/types";
import { useCallback, useState } from "react";

type TranslationKey =
  | "dashboard"
  | "rooms"
  | "students"
  | "payments"
  | "expenses"
  | "notes"
  | "reminders"
  | "chart"
  | "subscription"
  | "settings"
  | "add"
  | "edit"
  | "delete"
  | "save"
  | "cancel"
  | "search"
  | "filter"
  | "name"
  | "phone"
  | "address"
  | "room"
  | "bed"
  | "status"
  | "date"
  | "amount"
  | "paid"
  | "pending"
  | "partial"
  | "overdue"
  | "empty"
  | "full"
  | "partialRoom"
  | "complaint"
  | "description"
  | "resolved"
  | "inProgress"
  | "category"
  | "total"
  | "outstanding"
  | "loading"
  | "noData"
  | "error"
  | "udhar"
  | "complaints"
  | "addRoom"
  | "addStudent"
  | "addPayment"
  | "addUdhar"
  | "addComplaint"
  | "roomNumber"
  | "bedId"
  | "joinDate"
  | "leaveDate"
  | "idProof"
  | "seatType"
  | "rentDue"
  | "paidAmount"
  | "lateFee"
  | "dueDate"
  | "student"
  | "month"
  | "year"
  | "note"
  | "markPaid"
  | "vacate"
  | "active"
  | "vacated"
  | "occupied"
  | "typeA"
  | "typeB"
  | "milk"
  | "grocery"
  | "other"
  | "pending_complaint"
  | "notifications"
  | "markAllRead"
  | "clearAll"
  | "noNotifications";

type Translations = Record<TranslationKey, string>;

const en: Translations = {
  dashboard: "Dashboard",
  rooms: "Rooms",
  students: "Students",
  payments: "Payments",
  expenses: "Expenses",
  notes: "Notes",
  reminders: "Reminders",
  chart: "Yearly Chart",
  subscription: "Subscription",
  settings: "Settings",
  add: "Add",
  edit: "Edit",
  delete: "Delete",
  save: "Save",
  cancel: "Cancel",
  search: "Search",
  filter: "Filter",
  name: "Name",
  phone: "Phone",
  address: "Address",
  room: "Room",
  bed: "Bed",
  status: "Status",
  date: "Date",
  amount: "Amount",
  paid: "Paid",
  pending: "Pending",
  partial: "Partial",
  overdue: "Overdue",
  empty: "Empty",
  full: "Full",
  partialRoom: "Partial",
  complaint: "Complaint",
  description: "Description",
  resolved: "Resolved",
  inProgress: "In Progress",
  category: "Category",
  total: "Total",
  outstanding: "Outstanding",
  loading: "Loading…",
  noData: "No data found",
  error: "Something went wrong",
  udhar: "Udhar",
  complaints: "Complaints",
  addRoom: "Add Room",
  addStudent: "Add Student",
  addPayment: "Add Payment",
  addUdhar: "Add Udhar",
  addComplaint: "Add Complaint",
  roomNumber: "Room Number",
  bedId: "Bed",
  joinDate: "Join Date",
  leaveDate: "Leave Date",
  idProof: "ID Proof",
  seatType: "Seat Type",
  rentDue: "Rent Due",
  paidAmount: "Paid Amount",
  lateFee: "Late Fee",
  dueDate: "Due Date",
  student: "Student",
  month: "Month",
  year: "Year",
  note: "Note",
  markPaid: "Mark Paid",
  vacate: "Vacate",
  active: "Active",
  vacated: "Vacated",
  occupied: "Occupied",
  typeA: "Type A (₹8,500)",
  typeB: "Type B (₹8,900)",
  milk: "Milk",
  grocery: "Grocery",
  other: "Other",
  pending_complaint: "Pending",
  notifications: "Notifications",
  markAllRead: "Mark all read",
  clearAll: "Clear all",
  noNotifications: "No notifications",
};

const hi: Translations = {
  dashboard: "डैशबोर्ड",
  rooms: "कमरे",
  students: "छात्र",
  payments: "भुगतान",
  expenses: "खर्च",
  notes: "नोट्स",
  reminders: "रिमाइंडर",
  chart: "वार्षिक चार्ट",
  subscription: "सब्सक्रिप्शन",
  settings: "सेटिंग्स",
  add: "जोड़ें",
  edit: "संपादित करें",
  delete: "हटाएं",
  save: "सहेजें",
  cancel: "रद्द करें",
  search: "खोजें",
  filter: "फ़िल्टर",
  name: "नाम",
  phone: "फोन",
  address: "पता",
  room: "कमरा",
  bed: "बिस्तर",
  status: "स्थिति",
  date: "तारीख",
  amount: "राशि",
  paid: "भुगतान हो गया",
  pending: "लंबित",
  partial: "आंशिक",
  overdue: "बकाया",
  empty: "खाली",
  full: "भरा हुआ",
  partialRoom: "आंशिक",
  complaint: "शिकायत",
  description: "विवरण",
  resolved: "हल हो गया",
  inProgress: "प्रगति में",
  category: "श्रेणी",
  total: "कुल",
  outstanding: "बकाया",
  loading: "लोड हो रहा है…",
  noData: "कोई डेटा नहीं मिला",
  error: "कुछ गलत हो गया",
  udhar: "उधार",
  complaints: "शिकायतें",
  addRoom: "कमरा जोड़ें",
  addStudent: "छात्र जोड़ें",
  addPayment: "भुगतान जोड़ें",
  addUdhar: "उधार जोड़ें",
  addComplaint: "शिकायत जोड़ें",
  roomNumber: "कमरा नंबर",
  bedId: "बिस्तर",
  joinDate: "शामिल होने की तारीख",
  leaveDate: "छोड़ने की तारीख",
  idProof: "पहचान प्रमाण",
  seatType: "सीट प्रकार",
  rentDue: "किराया बकाया",
  paidAmount: "भुगतान राशि",
  lateFee: "विलंब शुल्क",
  dueDate: "देय तारीख",
  student: "छात्र",
  month: "महीना",
  year: "वर्ष",
  note: "नोट",
  markPaid: "भुगतान चिह्नित करें",
  vacate: "खाली करें",
  active: "सक्रिय",
  vacated: "खाली",
  occupied: "अधिकृत",
  typeA: "टाइप A (₹8,500)",
  typeB: "टाइप B (₹8,900)",
  milk: "दूध",
  grocery: "किराना",
  other: "अन्य",
  pending_complaint: "लंबित",
  notifications: "सूचनाएं",
  markAllRead: "सभी पढ़ी हुई चिह्नित करें",
  clearAll: "सब साफ करें",
  noNotifications: "कोई सूचना नहीं",
};

const STORAGE_KEY = "hostel-lang";

function getInitialLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "hi") return stored;
  } catch {
    // ignore
  }
  return "en";
}

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      const map = language === "hi" ? hi : en;
      return map[key] ?? key;
    },
    [language],
  );

  return { language, setLanguage, t };
}
