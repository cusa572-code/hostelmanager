import List "mo:core/List";
import NoteLib "../lib/notes";
import Types "../types/notes";

mixin (
  notes : NoteLib.NoteStore,
  nextNoteId : { var value : Nat },
) {
  public func createNote(title : Text, content : Text) : async Types.NoteId {
    let id = nextNoteId.value;
    nextNoteId.value += 1;
    let note = NoteLib.create(notes, id, title, content);
    NoteLib.add(notes, note);
    id;
  };

  public func updateNote(id : Types.NoteId, title : Text, content : Text) : async Bool {
    NoteLib.update(notes, id, title, content);
  };

  public func deleteNote(id : Types.NoteId) : async Bool {
    NoteLib.delete(notes, id);
  };

  public query func getNotes() : async [Types.Note] {
    NoteLib.list(notes);
  };
};
