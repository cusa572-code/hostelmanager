import { f as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Link, m as motion, S as Skeleton, b as BedDouble, B as Button } from "./index-BHGx-AOT.js";
import { K as useRooms, ab as useCreateStudent, a3 as SeatType, L as Layout, a2 as User, a4 as Separator, B as Building2, a6 as CreditCard } from "./Layout-eWnk62al.js";
import { I as Input } from "./input-BlYRW_mJ.js";
import { L as Label } from "./label-CG4MNOlI.js";
import { A as ArrowLeft } from "./arrow-left-CbCNO325.js";
import { C as Calendar } from "./calendar-DKQPtQ2q.js";
function SectionHeader({
  icon,
  title
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-md bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: icon }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: title })
  ] });
}
function StudentFormPage() {
  const navigate = useNavigate();
  const { data: rooms = [], isLoading: roomsLoading } = useRooms();
  const createStudent = useCreateStudent();
  const [name, setName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [address, setAddress] = reactExports.useState("");
  const [idProofText, setIdProofText] = reactExports.useState("");
  const [roomId, setRoomId] = reactExports.useState("");
  const [seatType, setSeatType] = reactExports.useState(SeatType.typeA);
  const [joinDate, setJoinDate] = reactExports.useState(
    (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  );
  const handleRoomChange = (newRoomId) => {
    setRoomId(newRoomId);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    const input = {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      idProofText: idProofText.trim(),
      joinDate: BigInt(new Date(joinDate).getTime()) * 1000000n,
      roomId: roomId ? BigInt(roomId) : void 0,
      seatType
    };
    createStudent.mutate(input, {
      onSuccess: () => navigate({ to: "/students" })
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { title: "Add Student", subtitle: "Register a new student", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/students",
        className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth mb-6",
        "data-ocid": "student_form.back_link",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
          " Back to Students"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.form,
      {
        onSubmit: handleSubmit,
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.25 },
        className: "rounded-xl border border-border bg-card overflow-hidden",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 border-b border-border px-6 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-lg text-foreground font-display", children: "Add New Student" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Fill in the details to register a student" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-7", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SectionHeader,
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" }),
                  title: "Personal Information"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "sf-name", children: [
                      "Full Name ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "sf-name",
                        value: name,
                        onChange: (e) => setName(e.target.value),
                        placeholder: "e.g. Rahul Kumar",
                        required: true,
                        "data-ocid": "student_form.name_input"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "sf-phone", children: [
                      "Phone Number ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "sf-phone",
                        type: "tel",
                        value: phone,
                        onChange: (e) => setPhone(e.target.value),
                        placeholder: "e.g. 9876543210",
                        required: true,
                        "data-ocid": "student_form.phone_input"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sf-address", children: "Home Address" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "sf-address",
                      value: address,
                      onChange: (e) => setAddress(e.target.value),
                      placeholder: "e.g. 12 MG Road, Pune, Maharashtra",
                      "data-ocid": "student_form.address_input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sf-idproof", children: "ID Proof Details" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "sf-idproof",
                      value: idProofText,
                      onChange: (e) => setIdProofText(e.target.value),
                      placeholder: "e.g. Aadhar: 1234-5678-9012",
                      "data-ocid": "student_form.id_proof_input"
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "opacity-50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SectionHeader,
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4 w-4" }),
                  title: "Room Assignment"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sf-room", children: "Assign Room" }),
                  roomsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 rounded-md" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      id: "sf-room",
                      value: roomId,
                      onChange: (e) => handleRoomChange(e.target.value),
                      className: "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                      "data-ocid": "student_form.room_select",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "No room assigned" }),
                        rooms.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: r.id.toString(), children: [
                          "Room #",
                          r.roomNumber
                        ] }, r.id.toString()))
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Seat Type" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [
                    {
                      value: SeatType.typeA,
                      label: "Type A",
                      price: "₹8,500 / month"
                    },
                    {
                      value: SeatType.typeB,
                      label: "Type B",
                      price: "₹8,900 / month"
                    }
                  ].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setSeatType(opt.value),
                      "data-ocid": `student_form.seat_type.${opt.value}`,
                      className: `rounded-lg border-2 px-4 py-3 text-left transition-smooth ${seatType === opt.value ? "border-primary bg-primary/10" : "border-border hover:border-border/80"}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(BedDouble, { className: "h-3.5 w-3.5 text-primary" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground", children: opt.label })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: opt.price })
                      ]
                    },
                    opt.value
                  )) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "opacity-50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SectionHeader,
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
                  title: "Joining Details"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 max-w-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "sf-joindate", children: [
                  "Join Date ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "sf-joindate",
                    type: "date",
                    value: joinDate,
                    onChange: (e) => setJoinDate(e.target.value),
                    required: true,
                    "data-ocid": "student_form.join_date_input"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t border-border bg-muted/20 px-6 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                onClick: () => navigate({ to: "/students" }),
                "data-ocid": "student_form.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                disabled: createStudent.isPending || !name.trim() || !phone.trim(),
                className: "gap-2 min-w-32",
                "data-ocid": "student_form.submit_button",
                children: createStudent.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Saving…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4" }),
                  " Add Student"
                ] })
              }
            )
          ] })
        ]
      }
    )
  ] }) });
}
export {
  StudentFormPage as default
};
