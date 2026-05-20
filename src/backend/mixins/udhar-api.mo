import UdharLib "../lib/udhar";
import UdharTypes "../types/udhar";

mixin (
  udhar : UdharLib.UdharStore,
  nextUdharId : UdharLib.IdCounter,
) {
  public shared ({ caller }) func createUdharEntry(input : UdharTypes.UdharInput) : async { #ok : UdharTypes.UdharId; #err : Text } {
    assert not caller.isAnonymous();
    let id = UdharLib.create(udhar, nextUdharId, input);
    #ok(id);
  };

  public shared ({ caller }) func updateUdharEntry(id : UdharTypes.UdharId, input : UdharTypes.UdharInput) : async { #ok : (); #err : Text } {
    assert not caller.isAnonymous();
    if (UdharLib.update(udhar, id, input)) { #ok(()) } else { #err("Entry not found") };
  };

  public shared ({ caller }) func markUdharPaid(id : UdharTypes.UdharId) : async { #ok : (); #err : Text } {
    assert not caller.isAnonymous();
    if (UdharLib.markPaid(udhar, id)) { #ok(()) } else { #err("Entry not found") };
  };

  public shared ({ caller }) func deleteUdharEntry(id : UdharTypes.UdharId) : async { #ok : (); #err : Text } {
    assert not caller.isAnonymous();
    if (UdharLib.delete(udhar, id)) { #ok(()) } else { #err("Entry not found") };
  };

  public query func getUdharEntries() : async [UdharTypes.UdharEntry] {
    UdharLib.list(udhar);
  };

  public query func getStudentUdhar(studentId : UdharTypes.StudentId) : async UdharTypes.UdharSummary {
    UdharLib.summaryByStudent(udhar, studentId);
  };
};
