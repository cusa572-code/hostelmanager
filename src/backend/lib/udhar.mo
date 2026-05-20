import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/udhar";

module {
  public type UdharStore = List.List<Types.UdharEntry>;
  public type IdCounter = { var value : Nat };

  public func create(store : UdharStore, idCounter : IdCounter, input : Types.UdharInput) : Types.UdharId {
    let id = idCounter.value;
    idCounter.value += 1;
    store.add({
      id;
      studentId = input.studentId;
      date = input.date;
      category = input.category;
      amount = input.amount;
      description = input.description;
      isPaid = false;
      createdAt = Time.now();
    });
    id;
  };

  public func update(store : UdharStore, id : Types.UdharId, input : Types.UdharInput) : Bool {
    var found = false;
    store.mapInPlace(func(entry) {
      if (entry.id == id) {
        found := true;
        {
          entry with
          date = input.date;
          category = input.category;
          amount = input.amount;
          description = input.description;
        };
      } else {
        entry;
      };
    });
    found;
  };

  public func markPaid(store : UdharStore, id : Types.UdharId) : Bool {
    var found = false;
    store.mapInPlace(func(entry) {
      if (entry.id == id) {
        found := true;
        { entry with isPaid = true };
      } else {
        entry;
      };
    });
    found;
  };

  public func delete(store : UdharStore, id : Types.UdharId) : Bool {
    let sizeBefore = store.size();
    let filtered = store.filter(func(e) { e.id != id });
    store.clear();
    store.append(filtered);
    store.size() < sizeBefore;
  };

  public func list(store : UdharStore) : [Types.UdharEntry] {
    let arr = store.toArray();
    arr.sort<Types.UdharEntry>(func(a, b) {
      if (a.date > b.date) { #less }
      else if (a.date < b.date) { #greater }
      else { #equal };
    });
  };

  public func summaryByStudent(store : UdharStore, studentId : Types.StudentId) : Types.UdharSummary {
    let entries = store.toArray().filter(func(e) { e.studentId == studentId });
    var total : Nat = 0;
    for (e in entries.values()) {
      if (not e.isPaid) { total += e.amount };
    };
    { studentId; totalOutstanding = total; entries };
  };
};
