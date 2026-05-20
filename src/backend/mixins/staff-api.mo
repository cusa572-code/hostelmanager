import StaffLib "../lib/staff";
import StaffTypes "../types/staff";

mixin (
  staffStore : StaffLib.StaffStore,
  attendanceStore : StaffLib.AttendanceStore,
  nextStaffId : StaffLib.IdCounter,
  roomStore : StaffLib.RoomStore,
  studentStore : StaffLib.StudentStore,
) {
  // Staff management
  public shared ({ caller = _ }) func addStaff(input : StaffTypes.StaffInput) : async { #ok : StaffTypes.StaffId; #err : Text } {
    #ok(StaffLib.addStaff(staffStore, nextStaffId, input));
  };

  public shared ({ caller = _ }) func updateStaff(id : StaffTypes.StaffId, input : StaffTypes.StaffInput) : async { #ok : (); #err : Text } {
    if (StaffLib.updateStaff(staffStore, id, input)) #ok(())
    else #err("Staff not found");
  };

  public shared ({ caller = _ }) func removeStaff(id : StaffTypes.StaffId) : async { #ok : (); #err : Text } {
    if (StaffLib.removeStaff(staffStore, id)) #ok(())
    else #err("Staff not found");
  };

  public query func getStaff() : async [StaffTypes.Staff] {
    StaffLib.getStaff(staffStore);
  };

  // Attendance
  public shared ({ caller = _ }) func markAttendance(staffId : StaffTypes.StaffId, date : Text, status : StaffTypes.AttendanceStatus) : async { #ok : (); #err : Text } {
    StaffLib.markAttendance(attendanceStore, staffId, date, status);
    #ok(());
  };

  public query func getAttendanceByMonth(year : Nat, month : Nat) : async [StaffTypes.StaffAttendance] {
    StaffLib.getAttendance(attendanceStore, year, month);
  };

  public query func getStaffAttendance(staffId : StaffTypes.StaffId, year : Nat, month : Nat) : async [StaffTypes.StaffAttendance] {
    StaffLib.getAttendanceByStaff(attendanceStore, staffId, year, month);
  };

  // Monthly salary expense summary
  public query func getMonthlyStaffExpense(year : Nat, month : Nat) : async StaffTypes.MonthlyStaffExpense {
    StaffLib.getMonthlyStaffExpense(staffStore, attendanceStore, year, month);
  };

  // Per-staff salary breakdown
  public query func getStaffSalaryReport(year : Nat, month : Nat) : async StaffTypes.StaffSalaryReport {
    StaffLib.getStaffSalaryReport(staffStore, attendanceStore, year, month);
  };

  // Building occupancy stats
  public query func getBuildingStats() : async StaffTypes.BuildingStats {
    StaffLib.getBuildingStats(roomStore, studentStore);
  };
};
