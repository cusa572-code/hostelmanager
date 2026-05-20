module {
  public type NoteId = Nat;

  public type Note = {
    id : NoteId;
    title : Text;
    content : Text;
    createdAt : Int;
    updatedAt : Int;
  };
};
