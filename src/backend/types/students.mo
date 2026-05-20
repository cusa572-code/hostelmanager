import RoomTypes "rooms";

module {
  public type StudentId = Nat;

  public type RoomId = RoomTypes.RoomId;

  public type SeatType = { #typeA; #typeB };

  public type StudentStatus = { #active; #vacated };

  public type Student = {
    id : StudentId;
    name : Text;
    phone : Text;
    address : Text;
    idProofText : Text;
    roomId : ?RoomId;
    seatType : ?SeatType;
    joinDate : Int;
    leaveDate : ?Int;
    status : StudentStatus;
    photoKey : ?Text;
    documentKey : ?Text;
    createdAt : Int;
  };

  public type StudentInput = {
    name : Text;
    phone : Text;
    address : Text;
    idProofText : Text;
    roomId : ?RoomId;
    seatType : ?SeatType;
    joinDate : Int;
  };

  public type StudentSummary = {
    id : StudentId;
    name : Text;
    phone : Text;
    roomId : ?RoomId;
    roomNumber : ?Text;
    status : StudentStatus;
    joinDate : Int;
    leaveDate : ?Int;
  };
};
