import NotificationLib "../lib/notifications";
import NotificationTypes "../types/notifications";

mixin (
  notifications : NotificationLib.NotificationStore,
  nextNotificationId : NotificationLib.IdCounter,
) {
  public shared ({ caller }) func createNotification(input : NotificationTypes.NotificationInput) : async { #ok : NotificationTypes.NotificationId; #err : Text } {
    assert not caller.isAnonymous();
    let id = NotificationLib.create(notifications, nextNotificationId, input);
    #ok(id);
  };

  public shared ({ caller }) func markNotificationRead(id : NotificationTypes.NotificationId) : async { #ok : (); #err : Text } {
    assert not caller.isAnonymous();
    if (NotificationLib.markRead(notifications, id)) { #ok(()) } else { #err("Notification not found") };
  };

  public shared ({ caller }) func markAllNotificationsRead() : async { #ok : (); #err : Text } {
    assert not caller.isAnonymous();
    NotificationLib.markAllRead(notifications);
    #ok(());
  };

  public shared ({ caller }) func clearAllNotifications() : async { #ok : (); #err : Text } {
    assert not caller.isAnonymous();
    NotificationLib.clearAll(notifications);
    #ok(());
  };

  public query func getNotifications() : async [NotificationTypes.Notification] {
    NotificationLib.list(notifications);
  };

  public query func getUnreadCount() : async Nat {
    NotificationLib.unreadCount(notifications);
  };
};
