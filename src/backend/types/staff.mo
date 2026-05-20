module {
  public type StaffId = Nat;

  public type Staff = {
    id : StaffId;
    name : Text;
    role : Text;
    monthlySalary : Nat;
    joinDate : Int;
    isActive : Bool;
  };

  public type StaffInput = {
    name : Text;
    role : Text;
    monthlySalary : Nat;
    joinDate : Int;
  };

  public type AttendanceStatus = { #present; #absent };

  public type StaffAttendance = {
    staffId : StaffId;
    date : Text; // YYYY-MM-DD
    status : AttendanceStatus;
  };

  public type MonthlyStaffExpense = {
    year : Nat;
    month : Nat;
    totalSalary : Nat;
    presentDays : Nat;
    workingDays : Nat;
  };

  public type StaffSalaryEntry = {
    staffId : StaffId;
    name : Text;
    monthlySalary : Nat;
    presentDays : Nat;
    totalWorkingDays : Nat;
    earnedSalary : Nat;
  };

  public type StaffSalaryReport = {
    year : Nat;
    month : Nat;
    workingDays : Nat;
    entries : [StaffSalaryEntry];
    totalEarned : Nat;
  };

  public type BuildingStats = {
    totalSeats : Nat;
    totalActiveStudents : Nat;
    totalEmptyRooms : Nat;
  };
};
