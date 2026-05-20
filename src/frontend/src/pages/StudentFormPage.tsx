import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateStudent, useRooms } from "@/hooks/useQueries";
import { SeatType } from "@/types";
import type { StudentInput } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BedDouble,
  Building2,
  Calendar,
  CreditCard,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

function SectionHeader({
  icon,
  title,
}: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
        <span className="text-primary">{icon}</span>
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
    </div>
  );
}

export default function StudentFormPage() {
  const navigate = useNavigate();
  const { data: rooms = [], isLoading: roomsLoading } = useRooms();
  const createStudent = useCreateStudent();

  // Personal info
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [idProofText, setIdProofText] = useState("");

  // Room assignment
  const [roomId, setRoomId] = useState<string>("");
  const [seatType, setSeatType] = useState<SeatType>(SeatType.typeA);

  // Dates
  const [joinDate, setJoinDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const handleRoomChange = (newRoomId: string) => {
    setRoomId(newRoomId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const input: StudentInput = {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      idProofText: idProofText.trim(),
      joinDate: BigInt(new Date(joinDate).getTime()) * 1_000_000n,
      roomId: roomId ? BigInt(roomId) : undefined,
      seatType,
    };

    createStudent.mutate(input, {
      onSuccess: () => navigate({ to: "/students" }),
    });
  };

  return (
    <Layout title="Add Student" subtitle="Register a new student">
      <div className="max-w-2xl">
        {/* Back link */}
        <Link
          to="/students"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth mb-6"
          data-ocid="student_form.back_link"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Students
        </Link>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-xl border border-border bg-card overflow-hidden"
        >
          {/* Form header */}
          <div className="bg-primary/5 border-b border-border px-6 py-4">
            <h2 className="font-bold text-lg text-foreground font-display">
              Add New Student
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Fill in the details to register a student
            </p>
          </div>

          <div className="p-6 space-y-7">
            {/* Section 1: Personal Info */}
            <div>
              <SectionHeader
                icon={<User className="h-4 w-4" />}
                title="Personal Information"
              />
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="sf-name">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="sf-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Kumar"
                      required
                      data-ocid="student_form.name_input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sf-phone">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="sf-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      required
                      data-ocid="student_form.phone_input"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sf-address">Home Address</Label>
                  <Input
                    id="sf-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 12 MG Road, Pune, Maharashtra"
                    data-ocid="student_form.address_input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sf-idproof">ID Proof Details</Label>
                  <Input
                    id="sf-idproof"
                    value={idProofText}
                    onChange={(e) => setIdProofText(e.target.value)}
                    placeholder="e.g. Aadhar: 1234-5678-9012"
                    data-ocid="student_form.id_proof_input"
                  />
                </div>
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Section 2: Room Assignment */}
            <div>
              <SectionHeader
                icon={<Building2 className="h-4 w-4" />}
                title="Room Assignment"
              />
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="sf-room">Assign Room</Label>
                  {roomsLoading ? (
                    <Skeleton className="h-9 rounded-md" />
                  ) : (
                    <select
                      id="sf-room"
                      value={roomId}
                      onChange={(e) => handleRoomChange(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      data-ocid="student_form.room_select"
                    >
                      <option value="">No room assigned</option>
                      {rooms.map((r) => (
                        <option key={r.id.toString()} value={r.id.toString()}>
                          Room #{r.roomNumber}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Seat Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        value: SeatType.typeA,
                        label: "Type A",
                        price: "₹8,500 / month",
                      },
                      {
                        value: SeatType.typeB,
                        label: "Type B",
                        price: "₹8,900 / month",
                      },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSeatType(opt.value)}
                        data-ocid={`student_form.seat_type.${opt.value}`}
                        className={`rounded-lg border-2 px-4 py-3 text-left transition-smooth ${
                          seatType === opt.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-border/80"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <BedDouble className="h-3.5 w-3.5 text-primary" />
                          <span className="font-semibold text-sm text-foreground">
                            {opt.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {opt.price}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Section 3: Dates */}
            <div>
              <SectionHeader
                icon={<Calendar className="h-4 w-4" />}
                title="Joining Details"
              />
              <div className="space-y-1.5 max-w-xs">
                <Label htmlFor="sf-joindate">
                  Join Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="sf-joindate"
                  type="date"
                  value={joinDate}
                  onChange={(e) => setJoinDate(e.target.value)}
                  required
                  data-ocid="student_form.join_date_input"
                />
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between border-t border-border bg-muted/20 px-6 py-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate({ to: "/students" })}
              data-ocid="student_form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createStudent.isPending || !name.trim() || !phone.trim()
              }
              className="gap-2 min-w-32"
              data-ocid="student_form.submit_button"
            >
              {createStudent.isPending ? (
                <>Saving…</>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" /> Add Student
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </Layout>
  );
}
