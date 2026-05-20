module {
  public type ReminderId = Nat;

  public type Reminder = {
    id : ReminderId;
    title : Text;
    message : Text;
    remindAt : Int;
    isDone : Bool;
    createdAt : Int;
  };
};
