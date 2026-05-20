import PaymentLib "../lib/payments";
import PaymentTypes "../types/payments";

mixin (
  payments : PaymentLib.PaymentStore,
  paymentSettings : PaymentLib.SettingsStore,
  nextPaymentId : PaymentLib.IdCounter,
) {
  public shared ({ caller }) func createPayment(input : PaymentTypes.PaymentInput) : async { #ok : PaymentTypes.PaymentId; #err : Text } {
    assert not caller.isAnonymous();
    let id = PaymentLib.createWithSettings(payments, nextPaymentId, paymentSettings, input);
    #ok(id);
  };

  public shared ({ caller }) func updatePayment(id : PaymentTypes.PaymentId, input : PaymentTypes.PaymentInput) : async { #ok : (); #err : Text } {
    assert not caller.isAnonymous();
    if (PaymentLib.update(payments, id, input)) { #ok(()) } else { #err("Payment not found") };
  };

  public shared ({ caller }) func deletePayment(id : PaymentTypes.PaymentId) : async { #ok : (); #err : Text } {
    assert not caller.isAnonymous();
    if (PaymentLib.delete(payments, id)) { #ok(()) } else { #err("Payment not found") };
  };

  public query func getPayments() : async [PaymentTypes.Payment] {
    PaymentLib.list(payments);
  };

  public query func getStudentPayments(studentId : PaymentTypes.StudentId) : async [PaymentTypes.Payment] {
    PaymentLib.listByStudent(payments, studentId);
  };

  public query func getHostelSettings() : async PaymentTypes.HostelSettings {
    PaymentLib.getSettings(paymentSettings);
  };

  public shared ({ caller }) func updateHostelSettings(settings : PaymentTypes.HostelSettings) : async { #ok : (); #err : Text } {
    assert not caller.isAnonymous();
    PaymentLib.updateSettings(paymentSettings, settings);
    #ok(());
  };
};
