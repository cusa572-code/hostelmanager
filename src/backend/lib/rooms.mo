import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Types "../types/rooms";

module {
  public type RoomStore = List.List<Types.Room>;
  public type IdCounter = { var value : Nat };

  public func create(store : RoomStore, idCounter : IdCounter, input : Types.RoomInput) : Types.RoomId {
    Runtime.trap("not implemented");
  };

  public func update(store : RoomStore, id : Types.RoomId, input : Types.RoomInput) : Bool {
    Runtime.trap("not implemented");
  };

  public func delete(store : RoomStore, id : Types.RoomId) : Bool {
    Runtime.trap("not implemented");
  };

  public func list(store : RoomStore) : [Types.RoomSummary] {
    Runtime.trap("not implemented");
  };

  public func get(store : RoomStore, id : Types.RoomId) : ?Types.Room {
    Runtime.trap("not implemented");
  };

  public func incrementOccupied(store : RoomStore, roomId : Types.RoomId) : Bool {
    Runtime.trap("not implemented");
  };

  public func decrementOccupied(store : RoomStore, roomId : Types.RoomId) : Bool {
    Runtime.trap("not implemented");
  };
};
