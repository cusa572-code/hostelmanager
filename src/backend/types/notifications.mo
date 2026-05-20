module {
  public type NotificationId = Nat;

  public type NotificationType = {
    #rentDue;
    #paymentOverdue;
    #emptyRoom;
    #complaintUpdate;
  };

  public type Notification = {
    id : NotificationId;
    notifType : NotificationType;
    title : Text;
    message : Text;
    isRead : Bool;
    createdAt : Int;
    relatedId : ?Nat;
  };

  public type NotificationInput = {
    notifType : NotificationType;
    title : Text;
    message : Text;
    relatedId : ?Nat;
  };
};
