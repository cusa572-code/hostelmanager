import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/reminders";

module {
  public type ReminderStore = List.List<Types.Reminder>;

  public func create(
    nextId : Nat,
    title : Text,
    message : Text,
    remindAt : Int,
  ) : Types.Reminder {
    {
      id = nextId;
      title;
      message;
      remindAt;
      isDone = false;
      createdAt = Time.now();
    };
  };

  public func add(store : ReminderStore, reminder : Types.Reminder) {
    store.add(reminder);
  };

  public func update(
    store : ReminderStore,
    id : Types.ReminderId,
    title : Text,
    message : Text,
    remindAt : Int,
  ) : Bool {
    var found = false;
    store.mapInPlace(func(r) {
      if (r.id == id) {
        found := true;
        { r with title; message; remindAt };
      } else {
        r;
      };
    });
    found;
  };

  public func delete(store : ReminderStore, id : Types.ReminderId) : Bool {
    let sizeBefore = store.size();
    let filtered = store.filter(func(r) { r.id != id });
    store.clear();
    store.append(filtered);
    store.size() < sizeBefore;
  };

  public func list(store : ReminderStore) : [Types.Reminder] {
    store.toArray();
  };

  public func markDone(store : ReminderStore, id : Types.ReminderId) : Bool {
    var found = false;
    store.mapInPlace(func(r) {
      if (r.id == id) {
        found := true;
        { r with isDone = true };
      } else {
        r;
      };
    });
    found;
  };
};
