import StudentLib "../lib/students";
import StudentTypes "../types/students";
import RoomLib "../lib/rooms";

mixin (
  students : StudentLib.StudentStore,
  nextStudentId : StudentLib.IdCounter,
  rooms : RoomLib.RoomStore,
) {
  public shared ({ caller }) func createStudent(input : StudentTypes.StudentInput) : async { #ok : StudentTypes.StudentId; #err : Text } {
    assert not caller.isAnonymous();
    let id = StudentLib.create(students, nextStudentId, rooms, input);
    #ok(id);
  };

  public shared ({ caller }) func updateStudent(id : StudentTypes.StudentId, input : StudentTypes.StudentInput) : async { #ok : (); #err : Text } {
    assert not caller.isAnonymous();
    if (StudentLib.update(students, id, rooms, input)) { #ok(()) } else { #err("Student not found") };
  };

  public shared ({ caller }) func vacateStudent(id : StudentTypes.StudentId, leaveDate : Int) : async { #ok : (); #err : Text } {
    assert not caller.isAnonymous();
    if (StudentLib.vacate(students, id, rooms, leaveDate)) { #ok(()) } else { #err("Student not found or already vacated") };
  };

  public shared ({ caller }) func deleteStudent(id : StudentTypes.StudentId) : async { #ok : (); #err : Text } {
    assert not caller.isAnonymous();
    if (StudentLib.delete(students, id)) { #ok(()) } else { #err("Student not found") };
  };

  public query func getStudents() : async [StudentTypes.StudentSummary] {
    StudentLib.list(students, rooms);
  };

  public query func getStudent(id : StudentTypes.StudentId) : async ?StudentTypes.Student {
    StudentLib.get(students, id);
  };

  public shared ({ caller }) func updateStudentPhoto(id : StudentTypes.StudentId, photoKey : Text) : async { #ok : (); #err : Text } {
    assert not caller.isAnonymous();
    if (StudentLib.updatePhoto(students, id, photoKey)) { #ok(()) } else { #err("Student not found") };
  };

  public shared ({ caller }) func updateStudentDocument(id : StudentTypes.StudentId, documentKey : Text) : async { #ok : (); #err : Text } {
    assert not caller.isAnonymous();
    if (StudentLib.updateDocument(students, id, documentKey)) { #ok(()) } else { #err("Student not found") };
  };
};
