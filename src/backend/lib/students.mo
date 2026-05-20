import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Types "../types/students";
import RoomLib "rooms";

module {
  public type StudentStore = List.List<Types.Student>;
  public type IdCounter = { var value : Nat };

  public func create(
    store : StudentStore,
    idCounter : IdCounter,
    roomStore : RoomLib.RoomStore,
    input : Types.StudentInput,
  ) : Types.StudentId {
    Runtime.trap("not implemented");
  };

  public func update(
    store : StudentStore,
    id : Types.StudentId,
    roomStore : RoomLib.RoomStore,
    input : Types.StudentInput,
  ) : Bool {
    Runtime.trap("not implemented");
  };

  public func vacate(
    store : StudentStore,
    id : Types.StudentId,
    roomStore : RoomLib.RoomStore,
    leaveDate : Int,
  ) : Bool {
    Runtime.trap("not implemented");
  };

  public func delete(store : StudentStore, id : Types.StudentId) : Bool {
    Runtime.trap("not implemented");
  };

  public func list(store : StudentStore, roomStore : RoomLib.RoomStore) : [Types.StudentSummary] {
    Runtime.trap("not implemented");
  };

  public func get(store : StudentStore, id : Types.StudentId) : ?Types.Student {
    Runtime.trap("not implemented");
  };

  public func countActive(store : StudentStore) : Nat {
    Runtime.trap("not implemented");
  };

  public func updatePhoto(store : StudentStore, id : Types.StudentId, photoKey : Text) : Bool {
    Runtime.trap("not implemented");
  };

  public func updateDocument(store : StudentStore, id : Types.StudentId, documentKey : Text) : Bool {
    Runtime.trap("not implemented");
  };
};
