module {
  public type RoomId = Nat;

  public type Room = {
    id : RoomId;
    roomNumber : Text;
    seatCount : Nat;
    occupiedSeats : Nat;
    createdAt : Int;
  };

  public type RoomInput = {
    roomNumber : Text;
    seatCount : Nat;
  };

  public type RoomSummary = {
    id : RoomId;
    roomNumber : Text;
    seatCount : Nat;
    occupiedSeats : Nat;
    status : { #empty; #partial; #full };
  };
};
