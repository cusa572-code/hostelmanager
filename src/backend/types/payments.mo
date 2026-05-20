import StudentTypes "students";

module {
  public type StudentId = StudentTypes.StudentId;

  public type PaymentId = Nat;

  public type PaymentStatus = { #paid; #pending; #partial };

  public type Payment = {
    id : PaymentId;
    studentId : StudentId;
    year : Nat;
    month : Nat;
    rentDue : Nat;
    paidAmount : Nat;
    status : PaymentStatus;
    dueDate : Int;
    paidDate : ?Int;
    note : ?Text;
    lateFee : Nat;
    createdAt : Int;
  };

  public type PaymentInput = {
    studentId : StudentId;
    year : Nat;
    month : Nat;
    rentDue : Nat;
    paidAmount : Nat;
    status : PaymentStatus;
    note : ?Text;
  };

  public type HostelSettings = {
    lateFeePerMonth : Nat;
  };
};
