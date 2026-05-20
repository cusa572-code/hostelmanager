import Runtime "mo:core/Runtime";
import RoomLib "../lib/rooms";
import RoomTypes "../types/rooms";
import StudentLib "../lib/students";

mixin (
  rooms : RoomLib.RoomStore,
  nextRoomId : RoomLib.IdCounter,
  students : StudentLib.StudentStore,
) {
  public shared ({ caller }) func createRoom(input : RoomTypes.RoomInput) : async { #ok : RoomTypes.RoomId; #err : Text } {
    Runtime.trap("not implemented");
  };

  public shared ({ caller }) func updateRoom(id : RoomTypes.RoomId, input : RoomTypes.RoomInput) : async { #ok : (); #err : Text } {
    Runtime.trap("not implemented");
  };

  public shared ({ caller }) func deleteRoom(id : RoomTypes.RoomId) : async { #ok : (); #err : Text } {
    Runtime.trap("not implemented");
  };

  public query func getRooms() : async [RoomTypes.RoomSummary] {
    Runtime.trap("not implemented");
  };

  public query func getRoom(id : RoomTypes.RoomId) : async ?RoomTypes.Room {
    Runtime.trap("not implemented");
  };

};
