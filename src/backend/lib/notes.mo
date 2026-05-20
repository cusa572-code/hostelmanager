import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/notes";

module {
  public type NoteStore = List.List<Types.Note>;

  public func create(
    _store : NoteStore,
    nextId : Nat,
    title : Text,
    content : Text,
  ) : Types.Note {
    let now = Time.now();
    {
      id = nextId;
      title;
      content;
      createdAt = now;
      updatedAt = now;
    };
  };

  public func add(store : NoteStore, note : Types.Note) {
    store.add(note);
  };

  public func update(
    store : NoteStore,
    id : Types.NoteId,
    title : Text,
    content : Text,
  ) : Bool {
    var found = false;
    store.mapInPlace(func(note) {
      if (note.id == id) {
        found := true;
        { note with title; content; updatedAt = Time.now() };
      } else {
        note;
      };
    });
    found;
  };

  public func delete(store : NoteStore, id : Types.NoteId) : Bool {
    let sizeBefore = store.size();
    let filtered = store.filter(func(note) { note.id != id });
    store.clear();
    store.append(filtered);
    store.size() < sizeBefore;
  };

  public func list(store : NoteStore) : [Types.Note] {
    store.toArray();
  };
};
