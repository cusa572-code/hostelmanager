import ComplaintLib "../lib/complaints";
import ComplaintTypes "../types/complaints";

mixin (
  complaints : ComplaintLib.ComplaintStore,
  nextComplaintId : ComplaintLib.IdCounter,
) {
  public shared ({ caller }) func createComplaint(input : ComplaintTypes.ComplaintInput) : async { #ok : ComplaintTypes.ComplaintId; #err : Text } {
    assert not caller.isAnonymous();
    let id = ComplaintLib.create(complaints, nextComplaintId, input);
    #ok(id);
  };

  public shared ({ caller }) func updateComplaintStatus(id : ComplaintTypes.ComplaintId, status : ComplaintTypes.ComplaintStatus) : async { #ok : (); #err : Text } {
    assert not caller.isAnonymous();
    if (ComplaintLib.updateStatus(complaints, id, status)) { #ok(()) } else { #err("Complaint not found") };
  };

  public shared ({ caller }) func deleteComplaint(id : ComplaintTypes.ComplaintId) : async { #ok : (); #err : Text } {
    assert not caller.isAnonymous();
    if (ComplaintLib.delete(complaints, id)) { #ok(()) } else { #err("Complaint not found") };
  };

  public query func getComplaints() : async [ComplaintTypes.Complaint] {
    ComplaintLib.list(complaints);
  };
};
