import Map "mo:core/Map";
import List "mo:core/List";

import SeatLib "lib/seats";
import ExpenseLib "lib/expenses";
import SubLib "lib/subscriptions";
import NoteLib "lib/notes";
import ReminderLib "lib/reminders";
import RoomLib "lib/rooms";
import StudentLib "lib/students";
import StaffLib "lib/staff";
import PaymentLib "lib/payments";
import UdharLib "lib/udhar";
import ComplaintLib "lib/complaints";
import NotificationLib "lib/notifications";
import SeatsApi "mixins/seats-api";
import ExpensesApi "mixins/expenses-api";
import ProfitApi "mixins/profit-api";
import SubscriptionsApi "mixins/subscriptions-api";
import NotesApi "mixins/notes-api";
import RemindersApi "mixins/reminders-api";
import RoomsApi "mixins/rooms-api";
import StudentsApi "mixins/students-api";
import StaffApi "mixins/staff-api";
import PaymentsApi "mixins/payments-api";
import UdharApi "mixins/udhar-api";
import ComplaintsApi "mixins/complaints-api";
import NotificationsApi "mixins/notifications-api";




actor {
  // --- Existing domain state ---
  let seatConfig : SeatLib.SeatConfigStore = Map.empty();
  let seatBookings : SeatLib.BookingStore = Map.empty();
  let expenseStore : ExpenseLib.ExpenseStore = Map.empty();
  let subscriptions : SubLib.SubscriptionStore = Map.empty();
  let notes : NoteLib.NoteStore = List.empty();
  let reminders : ReminderLib.ReminderStore = List.empty();
  let nextNoteId : { var value : Nat } = { var value = 0 };
  let nextReminderId : { var value : Nat } = { var value = 0 };

  // --- Room domain state ---
  let rooms : RoomLib.RoomStore = List.empty();
  let nextRoomId : RoomLib.IdCounter = { var value = 0 };

  // --- Student domain state ---
  let students : StudentLib.StudentStore = List.empty();
  let nextStudentId : StudentLib.IdCounter = { var value = 0 };

  // --- Staff domain state ---
  let staffStore : StaffLib.StaffStore = List.empty();
  let attendanceStore : StaffLib.AttendanceStore = List.empty();
  let nextStaffId : StaffLib.IdCounter = { var value = 0 };

  // --- Other domain state ---
  let payments : PaymentLib.PaymentStore = List.empty();
  let paymentSettings : PaymentLib.SettingsStore = Map.empty();
  let nextPaymentId : PaymentLib.IdCounter = { var value = 0 };

  let udhar : UdharLib.UdharStore = List.empty();
  let nextUdharId : UdharLib.IdCounter = { var value = 0 };

  let complaints : ComplaintLib.ComplaintStore = List.empty();
  let nextComplaintId : ComplaintLib.IdCounter = { var value = 0 };

  let notifications : NotificationLib.NotificationStore = List.empty();
  let nextNotificationId : NotificationLib.IdCounter = { var value = 0 };

  // --- Existing mixins ---
  include SeatsApi(seatConfig, seatBookings);
  include ExpensesApi(expenseStore);
  include ProfitApi(seatConfig, seatBookings, expenseStore);
  include SubscriptionsApi(subscriptions);
  include NotesApi(notes, nextNoteId);
  include RemindersApi(reminders, nextReminderId);

  // --- New mixins ---
  include RoomsApi(rooms, nextRoomId, students);
  include StudentsApi(students, nextStudentId, rooms);
  include StaffApi(staffStore, attendanceStore, nextStaffId, rooms, students);
  include PaymentsApi(payments, paymentSettings, nextPaymentId);
  include UdharApi(udhar, nextUdharId);
  include ComplaintsApi(complaints, nextComplaintId);
  include NotificationsApi(notifications, nextNotificationId);
};
