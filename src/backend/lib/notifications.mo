import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/notifications";

module {
  public type NotificationStore = List.List<Types.Notification>;
  public type IdCounter = { var value : Nat };

  public func create(store : NotificationStore, idCounter : IdCounter, input : Types.NotificationInput) : Types.NotificationId {
    let id = idCounter.value;
    idCounter.value += 1;
    store.add({
      id;
      notifType = input.notifType;
      title = input.title;
      message = input.message;
      isRead = false;
      createdAt = Time.now();
      relatedId = input.relatedId;
    });
    id;
  };

  public func markRead(store : NotificationStore, id : Types.NotificationId) : Bool {
    var found = false;
    store.mapInPlace(func(notif) {
      if (notif.id == id) {
        found := true;
        { notif with isRead = true };
      } else {
        notif;
      };
    });
    found;
  };

  public func markAllRead(store : NotificationStore) {
    store.mapInPlace(func(notif) {
      { notif with isRead = true };
    });
  };

  public func clearAll(store : NotificationStore) {
    store.clear();
  };

  public func list(store : NotificationStore) : [Types.Notification] {
    let arr = store.toArray();
    arr.sort<Types.Notification>(func(a, b) {
      if (a.createdAt > b.createdAt) { #less }
      else if (a.createdAt < b.createdAt) { #greater }
      else { #equal };
    });
  };

  public func unreadCount(store : NotificationStore) : Nat {
    var count = 0;
    store.forEach(func(notif) {
      if (not notif.isRead) { count += 1 };
    });
    count;
  };
};
