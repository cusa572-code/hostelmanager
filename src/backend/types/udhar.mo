import StudentTypes "students";

module {
  public type StudentId = StudentTypes.StudentId;

  public type UdharId = Nat;

  public type UdharCategory = { #milk; #grocery; #other };

  public type UdharEntry = {
    id : UdharId;
    studentId : StudentId;
    date : Int;
    category : UdharCategory;
    amount : Nat;
    description : Text;
    isPaid : Bool;
    createdAt : Int;
  };

  public type UdharInput = {
    studentId : StudentId;
    date : Int;
    category : UdharCategory;
    amount : Nat;
    description : Text;
  };

  public type UdharSummary = {
    studentId : StudentId;
    totalOutstanding : Nat;
    entries : [UdharEntry];
  };
};
