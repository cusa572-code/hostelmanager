import StudentTypes "students";

module {
  public type StudentId = StudentTypes.StudentId;

  public type ComplaintId = Nat;

  public type ComplaintStatus = { #pending; #inProgress; #resolved };

  public type Complaint = {
    id : ComplaintId;
    studentId : ?StudentId;
    roomNumber : Text;
    description : Text;
    status : ComplaintStatus;
    createdAt : Int;
    updatedAt : Int;
  };

  public type ComplaintInput = {
    studentId : ?StudentId;
    roomNumber : Text;
    description : Text;
  };
};
