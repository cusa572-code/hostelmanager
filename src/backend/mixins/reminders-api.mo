import ReminderLib "../lib/reminders";
import Types "../types/reminders";

mixin (
  reminders : ReminderLib.ReminderStore,
  nextReminderId : { var value : Nat },
) {
  public func createReminder(title : Text, message : Text, remindAt : Int) : async Types.ReminderId {
    let id = nextReminderId.value;
    nextReminderId.value += 1;
    let reminder = ReminderLib.create(id, title, message, remindAt);
    ReminderLib.add(reminders, reminder);
    id;
  };

  public func updateReminder(id : Types.ReminderId, title : Text, message : Text, remindAt : Int) : async Bool {
    ReminderLib.update(reminders, id, title, message, remindAt);
  };

  public func deleteReminder(id : Types.ReminderId) : async Bool {
    ReminderLib.delete(reminders, id);
  };

  public query func getReminders() : async [Types.Reminder] {
    ReminderLib.list(reminders);
  };

  public func markReminderDone(id : Types.ReminderId) : async Bool {
    ReminderLib.markDone(reminders, id);
  };
};
