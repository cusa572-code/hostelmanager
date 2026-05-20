import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/complaints";

module {
  public type ComplaintStore = List.List<Types.Complaint>;
  public type IdCounter = { var value : Nat };

  public func create(store : ComplaintStore, idCounter : IdCounter, input : Types.ComplaintInput) : Types.ComplaintId {
    let id = idCounter.value;
    idCounter.value += 1;
    let now = Time.now();
    store.add({
      id;
      studentId = input.studentId;
      roomNumber = input.roomNumber;
      description = input.description;
      status = #pending;
      createdAt = now;
      updatedAt = now;
    });
    id;
  };

  public func updateStatus(store : ComplaintStore, id : Types.ComplaintId, status : Types.ComplaintStatus) : Bool {
    var found = false;
    store.mapInPlace(func(complaint) {
      if (complaint.id == id) {
        found := true;
        { complaint with status; updatedAt = Time.now() };
      } else {
        complaint;
      };
    });
    found;
  };

  public func delete(store : ComplaintStore, id : Types.ComplaintId) : Bool {
    let sizeBefore = store.size();
    let filtered = store.filter(func(c) { c.id != id });
    store.clear();
    store.append(filtered);
    store.size() < sizeBefore;
  };

  public func list(store : ComplaintStore) : [Types.Complaint] {
    let arr = store.toArray();
    arr.sort<Types.Complaint>(func(a, b) {
      if (a.createdAt > b.createdAt) { #less }
      else if (a.createdAt < b.createdAt) { #greater }
      else { #equal };
    });
  };
};
