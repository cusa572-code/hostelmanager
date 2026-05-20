import List "mo:core/List";
import Nat "mo:core/Nat";
import Types "../types/staff";
import RoomTypes "../types/rooms";
import StudentTypes "../types/students";

module {
  public type StaffStore = List.List<Types.Staff>;
  public type AttendanceStore = List.List<Types.StaffAttendance>;
  public type IdCounter = { var value : Nat };
  public type RoomStore = List.List<RoomTypes.Room>;
  public type StudentStore = List.List<StudentTypes.Student>;

  // Parse "YYYY-MM-DD" into (year, month, day). Returns null on malformed input.
  func parseDate(date : Text) : ?(Nat, Nat, Nat) {
    let parts = date.split(#char '-');
    let arr = List.fromIter(parts);
    if (arr.size() != 3) return null;
    let y = arr.at(0);
    let m = arr.at(1);
    let d = arr.at(2);
    switch (Nat.fromText(y), Nat.fromText(m), Nat.fromText(d)) {
      case (?year, ?month, ?day) ?(year, month, day);
      case _ null;
    };
  };

  // Count Mon-Fri working days in a given (year, month).
  // Uses Sakamoto's algorithm to find day-of-week for the 1st of the month.
  func workingDaysInMonth(year : Nat, month : Nat) : Nat {
    let isLeap = (year % 4 == 0 and year % 100 != 0) or year % 400 == 0;
    let daysInMonth : [Nat] = [31, if (isLeap) 29 else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let totalDays = daysInMonth[month - 1];

    // t[] adjustments for Sakamoto's algorithm (month index 0-based)
    let t : [Nat] = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
    // For Jan/Feb, use previous year
    let y2 = if (month < 3) year - 1 else year;
    // dow: 0=Sun, 1=Mon, ..., 6=Sat
    let dow : Nat = (y2 + y2 / 4 - y2 / 100 + y2 / 400 + t[month - 1] + 1) % 7;

    var count = 0;
    var i = 0;
    while (i < totalDays) {
      let dayDow = (dow + i) % 7;
      // 0=Sun, 6=Sat are weekend; 1-5 are working days
      if (dayDow != 0 and dayDow != 6) {
        count += 1;
      };
      i += 1;
    };
    count;
  };

  // --- Staff CRUD ---

  public func addStaff(store : StaffStore, idCounter : IdCounter, input : Types.StaffInput) : Types.StaffId {
    let id = idCounter.value;
    idCounter.value += 1;
    store.add({
      id;
      name = input.name;
      role = input.role;
      monthlySalary = input.monthlySalary;
      joinDate = input.joinDate;
      isActive = true;
    });
    id;
  };

  public func updateStaff(store : StaffStore, id : Types.StaffId, input : Types.StaffInput) : Bool {
    var found = false;
    store.mapInPlace(func(s) {
      if (s.id == id and s.isActive) {
        found := true;
        { s with name = input.name; role = input.role; monthlySalary = input.monthlySalary; joinDate = input.joinDate };
      } else s;
    });
    found;
  };

  // Soft delete: set isActive = false
  public func removeStaff(store : StaffStore, id : Types.StaffId) : Bool {
    var found = false;
    store.mapInPlace(func(s) {
      if (s.id == id and s.isActive) {
        found := true;
        { s with isActive = false };
      } else s;
    });
    found;
  };

  public func getStaff(store : StaffStore) : [Types.Staff] {
    store.filter(func(s) { s.isActive }).toArray();
  };

  public func getStaffById(store : StaffStore, id : Types.StaffId) : ?Types.Staff {
    store.find(func(s) { s.id == id and s.isActive });
  };

  // --- Attendance (upsert by staffId + date) ---

  public func markAttendance(
    attendanceStore : AttendanceStore,
    staffId : Types.StaffId,
    date : Text,
    status : Types.AttendanceStatus,
  ) {
    var updated = false;
    attendanceStore.mapInPlace(func(a) {
      if (a.staffId == staffId and a.date == date) {
        updated := true;
        { a with status };
      } else a;
    });
    if (not updated) {
      attendanceStore.add({ staffId; date; status });
    };
  };

  public func getAttendance(
    attendanceStore : AttendanceStore,
    year : Nat,
    month : Nat,
  ) : [Types.StaffAttendance] {
    attendanceStore.filter(func(a) {
      switch (parseDate(a.date)) {
        case (?(y, m, _)) y == year and m == month;
        case null false;
      };
    }).toArray();
  };

  public func getAttendanceByStaff(
    attendanceStore : AttendanceStore,
    staffId : Types.StaffId,
    year : Nat,
    month : Nat,
  ) : [Types.StaffAttendance] {
    attendanceStore.filter(func(a) {
      a.staffId == staffId and
      (switch (parseDate(a.date)) {
        case (?(y, m, _)) y == year and m == month;
        case null false;
      });
    }).toArray();
  };

  // --- Monthly staff expense (aggregate across all active staff) ---
  public func getMonthlyStaffExpense(
    staffStore : StaffStore,
    attendanceStore : AttendanceStore,
    year : Nat,
    month : Nat,
  ) : Types.MonthlyStaffExpense {
    let wDays = workingDaysInMonth(year, month);
    var totalSalary = 0;
    var totalPresentDays = 0;

    staffStore.filter(func(s) { s.isActive }).forEach(func(s) {
      let presentDays = attendanceStore.filter(func(a) {
        a.staffId == s.id and a.status == #present and
        (switch (parseDate(a.date)) {
          case (?(y, m, _)) y == year and m == month;
          case null false;
        });
      }).size();
      totalPresentDays += presentDays;
      if (wDays > 0) {
        totalSalary += (presentDays * s.monthlySalary) / wDays;
      };
    });

    { year; month; totalSalary; presentDays = totalPresentDays; workingDays = wDays };
  };

  // --- Per-staff salary report ---
  public func getStaffSalaryReport(
    staffStore : StaffStore,
    attendanceStore : AttendanceStore,
    year : Nat,
    month : Nat,
  ) : Types.StaffSalaryReport {
    let wDays = workingDaysInMonth(year, month);
    var totalEarned = 0;

    let entries = staffStore.filter(func(s) { s.isActive }).map<Types.Staff, Types.StaffSalaryEntry>(func(s) {
      let presentDays = attendanceStore.filter(func(a) {
        a.staffId == s.id and a.status == #present and
        (switch (parseDate(a.date)) {
          case (?(y, m, _)) y == year and m == month;
          case null false;
        });
      }).size();
      let earned = if (wDays > 0) (presentDays * s.monthlySalary) / wDays else 0;
      totalEarned += earned;
      { staffId = s.id; name = s.name; monthlySalary = s.monthlySalary; presentDays; totalWorkingDays = wDays; earnedSalary = earned };
    }).toArray();

    { year; month; workingDays = wDays; entries; totalEarned };
  };

  // --- Building stats ---
  public func getBuildingStats(
    roomStore : RoomStore,
    studentStore : StudentStore,
  ) : Types.BuildingStats {
    var totalSeats = 0;
    var totalEmptyRooms = 0;

    roomStore.forEach(func(r) {
      totalSeats += r.seatCount;
      if (r.occupiedSeats == 0) {
        totalEmptyRooms += 1;
      };
    });

    let totalActiveStudents = studentStore.filter(func(s) {
      s.status == #active;
    }).size();

    { totalSeats; totalActiveStudents; totalEmptyRooms };
  };
};
