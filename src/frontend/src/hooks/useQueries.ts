import { createActor } from "@/backend";
import type {
  BuildingStats,
  Complaint,
  ComplaintId,
  ComplaintInput,
  ComplaintStatus,
  ExpenseInput,
  HostelSettings,
  MonthlyExpenses,
  MonthlyProfit,
  MonthlyStaffExpense,
  Note,
  NoteId,
  Notification,
  NotificationId,
  NotificationInput,
  Payment,
  PaymentId,
  PaymentInput,
  PlanId,
  Reminder,
  ReminderId,
  Room,
  RoomId,
  RoomInput,
  RoomSummary,
  SeatConfig,
  SeatSummary,
  Staff,
  StaffAttendance,
  StaffId,
  StaffInput,
  StaffSalaryReport,
  Student,
  StudentId,
  StudentInput,
  StudentSummary,
  SubscriptionRecord,
  UdharEntry,
  UdharId,
  UdharInput,
  UdharSummary,
  YearlyChartEntry,
} from "@/types";
import type { AttendanceStatus } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ─── Seat Config ──────────────────────────────────────────────────────────────

export function useSeatConfig() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<SeatConfig | null>({
    queryKey: ["seatConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSeatConfig();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetSeatConfig() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      totalCapacity,
      pricePerSeatA,
      pricePerSeatB,
    }: {
      totalCapacity: bigint;
      pricePerSeatA: bigint;
      pricePerSeatB: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      await actor.setSeatConfig(totalCapacity, pricePerSeatA, pricePerSeatB);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seatConfig"] });
      qc.invalidateQueries({ queryKey: ["seatSummary"] });
      toast.success("Seat configuration saved");
    },
    onError: () => toast.error("Failed to save seat config"),
  });
}

// ─── Seat Summary ─────────────────────────────────────────────────────────────

export function useSeatSummary(year: number, month: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<SeatSummary | null>({
    queryKey: ["seatSummary", year, month],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMonthSeatSummary(BigInt(year), BigInt(month));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetMonthlyBooking() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      year,
      month,
      bookedSeatsA,
      bookedSeatsB,
    }: {
      year: number;
      month: number;
      bookedSeatsA: bigint;
      bookedSeatsB: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      await actor.setMonthlyBooking(
        BigInt(year),
        BigInt(month),
        bookedSeatsA,
        bookedSeatsB,
      );
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ["seatSummary", vars.year, vars.month],
      });
      qc.invalidateQueries({
        queryKey: ["monthlyProfit", vars.year, vars.month],
      });
      toast.success("Booking updated");
    },
    onError: () => toast.error("Failed to update booking"),
  });
}

// ─── Monthly Expenses ─────────────────────────────────────────────────────────

export function useMonthlyExpenses(year: number, month: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<MonthlyExpenses | null>({
    queryKey: ["monthlyExpenses", year, month],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMonthlyExpenses(BigInt(year), BigInt(month));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetMonthlyExpenses() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      year,
      month,
      input,
    }: {
      year: number;
      month: number;
      input: ExpenseInput;
    }) => {
      if (!actor) throw new Error("No actor");
      await actor.setMonthlyExpenses(BigInt(year), BigInt(month), input);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ["monthlyExpenses", vars.year, vars.month],
      });
      qc.invalidateQueries({
        queryKey: ["monthlyProfit", vars.year, vars.month],
      });
      toast.success("Expenses saved");
    },
    onError: () => toast.error("Failed to save expenses"),
  });
}

// ─── Monthly Profit ───────────────────────────────────────────────────────────

export function useMonthlyProfit(year: number, month: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<MonthlyProfit>({
    queryKey: ["monthlyProfit", year, month],
    queryFn: async () => {
      if (!actor) {
        return {
          year: BigInt(year),
          month: BigInt(month),
          revenue: 0n,
          totalExpenses: 0n,
          profit: 0n,
        };
      }
      return actor.getMonthlyProfit(BigInt(year), BigInt(month));
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Yearly Chart ─────────────────────────────────────────────────────────────

export function useYearlyProfitChart(year: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<YearlyChartEntry[]>({
    queryKey: ["yearlyProfitChart", year],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getYearlyProfitChart(BigInt(year));
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Subscription ─────────────────────────────────────────────────────────────

export function useMySubscription() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<SubscriptionRecord | null>({
    queryKey: ["mySubscription"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMySubscription();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60_000,
  });
}

export function useStartTrial() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      await actor.startTrial();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mySubscription"] });
    },
  });
}

export function useActivateSubscription() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (planId: PlanId) => {
      if (!actor) throw new Error("No actor");
      await actor.activateSubscription(planId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mySubscription"] });
      toast.success("Subscription activated!");
    },
    onError: () => toast.error("Failed to activate subscription"),
  });
}

// ─── Reminders ────────────────────────────────────────────────────────────────

export function useReminders() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Reminder[]>({
    queryKey: ["reminders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReminders();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60_000,
  });
}

export function useAddReminder() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      message,
      remindAt,
    }: {
      title: string;
      message: string;
      remindAt: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createReminder(title, message, remindAt);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reminders"] });
      toast.success("Reminder added");
    },
    onError: () => toast.error("Failed to add reminder"),
  });
}

export function useUpdateReminder() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      message,
      remindAt,
    }: {
      id: ReminderId;
      title: string;
      message: string;
      remindAt: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateReminder(id, title, message, remindAt);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reminders"] });
      toast.success("Reminder updated");
    },
    onError: () => toast.error("Failed to update reminder"),
  });
}

export function useDeleteReminder() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: ReminderId) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteReminder(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reminders"] });
      toast.success("Reminder deleted");
    },
    onError: () => toast.error("Failed to delete reminder"),
  });
}

export function useMarkReminderDone() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: ReminderId) => {
      if (!actor) throw new Error("No actor");
      return actor.markReminderDone(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reminders"] });
      toast.success("Reminder marked as done");
    },
    onError: () => toast.error("Failed to update reminder"),
  });
}

// ─── Notes ────────────────────────────────────────────────────────────────────

export function useNotes() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddNote() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      content,
    }: { title: string; content: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.createNote(title, content);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note added");
    },
    onError: () => toast.error("Failed to add note"),
  });
}

export function useUpdateNote() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      content,
    }: { id: NoteId; title: string; content: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateNote(id, title, content);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note saved");
    },
    onError: () => toast.error("Failed to update note"),
  });
}

export function useDeleteNote() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: NoteId) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteNote(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted");
    },
    onError: () => toast.error("Failed to delete note"),
  });
}

// ─── Building Stats ───────────────────────────────────────────────────────────

export function useGetBuildingStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<BuildingStats | null>({
    queryKey: ["buildingStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBuildingStats();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Rooms ────────────────────────────────────────────────────────────────────

export function useRooms() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<RoomSummary[]>({
    queryKey: ["rooms"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRooms();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRoom(id: RoomId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Room | null>({
    queryKey: ["room", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getRoom(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateRoom() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: RoomInput) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.createRoom(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Room created");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to create room"),
  });
}

export function useUpdateRoom() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
      // occupiedSeats is accepted for UI consistency but backend derives it from student assignments
      occupiedSeats: _occupiedSeats,
    }: {
      id: RoomId;
      input: RoomInput;
      occupiedSeats?: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.updateRoom(id, input);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["rooms"] });
      qc.invalidateQueries({ queryKey: ["room", vars.id.toString()] });
      toast.success("Room updated");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update room"),
  });
}

export function useDeleteRoom() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: RoomId) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.deleteRoom(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Room deleted");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to delete room"),
  });
}

// ─── Students ─────────────────────────────────────────────────────────────────

export function useStudents() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<StudentSummary[]>({
    queryKey: ["students"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStudent(id: StudentId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Student | null>({
    queryKey: ["student", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStudent(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateStudent() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: StudentInput) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.createStudent(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Student added");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to add student"),
  });
}

export function useUpdateStudent() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: StudentId; input: StudentInput }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.updateStudent(id, input);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["student", vars.id.toString()] });
      toast.success("Student updated");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update student"),
  });
}

export function useVacateStudent() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      leaveDate,
    }: { id: StudentId; leaveDate: bigint }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.vacateStudent(id, leaveDate);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["student", vars.id.toString()] });
      qc.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Student vacated");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to vacate student"),
  });
}

export function useDeleteStudent() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: StudentId) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.deleteStudent(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Student deleted");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to delete student"),
  });
}

export function useUpdateStudentPhoto() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      photoKey,
    }: { id: StudentId; photoKey: string }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.updateStudentPhoto(id, photoKey);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["student", vars.id.toString()] });
      toast.success("Photo updated");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update photo"),
  });
}

export function useUpdateStudentDocument() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      documentKey,
    }: { id: StudentId; documentKey: string }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.updateStudentDocument(id, documentKey);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["student", vars.id.toString()] });
      toast.success("Document updated");
    },
    onError: (e: Error) =>
      toast.error(e.message || "Failed to update document"),
  });
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export function usePayments() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPayments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStudentPayments(studentId: StudentId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Payment[]>({
    queryKey: ["studentPayments", studentId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudentPayments(studentId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePayment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: PaymentInput) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.createPayment(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["studentPayments"] });
      toast.success("Payment recorded");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to record payment"),
  });
}

export function useUpdatePayment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: PaymentId; input: PaymentInput }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.updatePayment(id, input);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["studentPayments"] });
      toast.success("Payment updated");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update payment"),
  });
}

export function useDeletePayment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: PaymentId) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.deletePayment(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["studentPayments"] });
      toast.success("Payment deleted");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to delete payment"),
  });
}

export function useHostelSettings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<HostelSettings | null>({
    queryKey: ["hostelSettings"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getHostelSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateHostelSettings() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (settings: HostelSettings) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.updateHostelSettings(settings);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hostelSettings"] });
      toast.success("Settings updated");
    },
    onError: (e: Error) =>
      toast.error(e.message || "Failed to update settings"),
  });
}

// ─── Udhar ────────────────────────────────────────────────────────────────────

export function useUdharEntries() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UdharEntry[]>({
    queryKey: ["udharEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUdharEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStudentUdhar(studentId: StudentId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UdharSummary | null>({
    queryKey: ["studentUdhar", studentId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStudentUdhar(studentId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateUdharEntry() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UdharInput) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.createUdharEntry(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["udharEntries"] });
      qc.invalidateQueries({ queryKey: ["studentUdhar"] });
      toast.success("Udhar entry added");
    },
    onError: (e: Error) =>
      toast.error(e.message || "Failed to add udhar entry"),
  });
}

export function useUpdateUdharEntry() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: UdharId; input: UdharInput }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.updateUdharEntry(id, input);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["udharEntries"] });
      qc.invalidateQueries({ queryKey: ["studentUdhar"] });
      toast.success("Udhar entry updated");
    },
    onError: (e: Error) =>
      toast.error(e.message || "Failed to update udhar entry"),
  });
}

export function useMarkUdharPaid() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: UdharId) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.markUdharPaid(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["udharEntries"] });
      qc.invalidateQueries({ queryKey: ["studentUdhar"] });
      toast.success("Marked as paid");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to mark paid"),
  });
}

export function useDeleteUdharEntry() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: UdharId) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.deleteUdharEntry(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["udharEntries"] });
      qc.invalidateQueries({ queryKey: ["studentUdhar"] });
      toast.success("Udhar entry deleted");
    },
    onError: (e: Error) =>
      toast.error(e.message || "Failed to delete udhar entry"),
  });
}

// ─── Complaints ───────────────────────────────────────────────────────────────

export function useComplaints() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Complaint[]>({
    queryKey: ["complaints"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getComplaints();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateComplaint() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ComplaintInput) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.createComplaint(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["complaints"] });
      toast.success("Complaint filed");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to file complaint"),
  });
}

export function useUpdateComplaintStatus() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: ComplaintId; status: ComplaintStatus }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.updateComplaintStatus(id, status);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["complaints"] });
      toast.success("Complaint status updated");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update status"),
  });
}

export function useDeleteComplaint() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: ComplaintId) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.deleteComplaint(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["complaints"] });
      toast.success("Complaint deleted");
    },
    onError: (e: Error) =>
      toast.error(e.message || "Failed to delete complaint"),
  });
}

// ─── Notifications ────────────────────────────────────────────────────────────

export function useNotifications() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useUnreadCount() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<bigint>({
    queryKey: ["unreadCount"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getUnreadCount();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationRead() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: NotificationId) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.markNotificationRead(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unreadCount"] });
    },
    onError: () => toast.error("Failed to mark notification read"),
  });
}

export function useMarkAllNotificationsRead() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const result = await actor.markAllNotificationsRead();
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unreadCount"] });
    },
    onError: () => toast.error("Failed to mark all read"),
  });
}

export function useClearAllNotifications() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const result = await actor.clearAllNotifications();
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unreadCount"] });
      toast.success("All notifications cleared");
    },
    onError: () => toast.error("Failed to clear notifications"),
  });
}

export function useCreateNotification() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: NotificationInput) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.createNotification(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unreadCount"] });
    },
    onError: () => toast.error("Failed to create notification"),
  });
}

// ─── Staff ────────────────────────────────────────────────────────────────────

export function useStaff() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Staff[]>({
    queryKey: ["staff"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStaff();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddStaff() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: StaffInput) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.addStaff(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff"] });
      qc.invalidateQueries({ queryKey: ["monthlyStaffExpense"] });
      toast.success("Staff member added");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to add staff"),
  });
}

export function useUpdateStaff() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: StaffId; input: StaffInput }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.updateStaff(id, input);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff"] });
      qc.invalidateQueries({ queryKey: ["staffSalaryReport"] });
      toast.success("Staff member updated");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update staff"),
  });
}

export function useRemoveStaff() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: StaffId) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.removeStaff(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff"] });
      qc.invalidateQueries({ queryKey: ["monthlyStaffExpense"] });
      toast.success("Staff member removed");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to remove staff"),
  });
}

export function useMarkAttendance() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      staffId,
      date,
      status,
    }: { staffId: StaffId; date: string; status: AttendanceStatus }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.markAttendance(staffId, date, status);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_data, vars) => {
      const [year, month] = vars.date.split("-").map(Number);
      qc.invalidateQueries({
        queryKey: ["staffAttendance", vars.staffId.toString()],
      });
      qc.invalidateQueries({ queryKey: ["attendanceByMonth", year, month] });
      qc.invalidateQueries({ queryKey: ["monthlyStaffExpense", year, month] });
      qc.invalidateQueries({ queryKey: ["staffSalaryReport", year, month] });
    },
    onError: (e: Error) =>
      toast.error(e.message || "Failed to mark attendance"),
  });
}

export function useAttendanceByMonth(year: number, month: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<StaffAttendance[]>({
    queryKey: ["attendanceByMonth", year, month],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAttendanceByMonth(BigInt(year), BigInt(month));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStaffAttendance(
  staffId: StaffId,
  year: number,
  month: number,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<StaffAttendance[]>({
    queryKey: ["staffAttendance", staffId.toString(), year, month],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStaffAttendance(staffId, BigInt(year), BigInt(month));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMonthlyStaffExpense(year: number, month: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<MonthlyStaffExpense | null>({
    queryKey: ["monthlyStaffExpense", year, month],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMonthlyStaffExpense(BigInt(year), BigInt(month));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStaffSalaryReport(year: number, month: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<StaffSalaryReport | null>({
    queryKey: ["staffSalaryReport", year, month],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStaffSalaryReport(BigInt(year), BigInt(month));
    },
    enabled: !!actor && !isFetching,
  });
}
