import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, L as Link, B as Button, S as Skeleton, m as motion } from "./index-BHGx-AOT.js";
import { Y as useStudents, N as useLanguage, Z as StudentStatus, L as Layout, U as Users, l as Badge } from "./Layout-eWnk62al.js";
import { I as Input } from "./input-BlYRW_mJ.js";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-tGAYEJgV.js";
import { P as Plus } from "./plus-BxCkF6bU.js";
import { S as Search } from "./search-DtqW_Oyj.js";
import "./index-DgyCW3I_.js";
import "./index-CndKChVc.js";
import "./index-zxbJdcQE.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",
      key: "j76jl0"
    }
  ],
  ["path", { d: "M22 10v6", key: "1lu8f3" }],
  ["path", { d: "M6 12.5V16a6 3 0 0 0 12 0v-3.5", key: "1r8lef" }]
];
const GraduationCap = createLucideIcon("graduation-cap", __iconNode);
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function getInitials(name) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}
function StudentCard({
  student,
  index
}) {
  const isActive = student.status === StudentStatus.active;
  const { t } = useLanguage();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.2, delay: index * 0.04 },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/students/$studentId",
          params: { studentId: student.id.toString() },
          "data-ocid": `students.item.${index + 1}`,
          className: "group flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-4 transition-smooth hover:border-primary/40 hover:bg-card/80 hover:shadow-md",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-semibold text-sm transition-smooth group-hover:scale-105 ${isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`,
                children: getInitials(student.name)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-semibold text-foreground", children: student.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: student.phone })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden min-w-0 sm:block", children: student.roomNumber ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              t("room"),
              " ",
              student.roomNumber
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 italic", children: "Not assigned" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden text-right md:block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Joined" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: formatDate(student.joinDate) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                className: isActive ? "shrink-0 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs" : "shrink-0 border-muted-foreground/30 bg-muted text-muted-foreground text-xs",
                children: isActive ? t("active") : t("vacated")
              }
            )
          ]
        }
      )
    }
  );
}
function StatsRow({ students }) {
  const active = students.filter(
    (s) => s.status === StudentStatus.active
  ).length;
  const vacated = students.filter(
    (s) => s.status === StudentStatus.vacated
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: [
    {
      label: "Total Students",
      value: students.length,
      color: "text-foreground",
      bg: "bg-muted/30"
    },
    {
      label: "Active",
      value: active,
      color: "text-emerald-400",
      bg: "bg-emerald-500/5 border-emerald-500/20"
    },
    {
      label: "Vacated",
      value: vacated,
      color: "text-muted-foreground",
      bg: "bg-muted/30"
    }
  ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `rounded-xl border border-border p-3 text-center ${stat.bg}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-bold font-display ${stat.color}`, children: stat.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: stat.label })
      ]
    },
    stat.label
  )) });
}
function StudentListPage() {
  const { data: students = [], isLoading } = useStudents();
  const [search, setSearch] = reactExports.useState("");
  const [tab, setTab] = reactExports.useState("all");
  const { t } = useLanguage();
  const filtered = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.phone.includes(search);
    const matchesTab = tab === "all" || tab === "active" && s.status === StudentStatus.active || tab === "vacated" && s.status === StudentStatus.vacated;
    return matchesSearch && matchesTab;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { title: t("students"), subtitle: "Manage student records", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground font-display", children: t("students") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isLoading ? t("loading") : `${students.length} student${students.length !== 1 ? "s" : ""} registered` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/students/new", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "w-full gap-2 sm:w-auto",
          "data-ocid": "students.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " ",
            t("addStudent")
          ]
        }
      ) })
    ] }),
    !isLoading && students.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(StatsRow, { students }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: `${t("search")} by name or phone…`,
            className: "pl-9",
            "data-ocid": "students.search_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { value: tab, onValueChange: (v) => setTab(v), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "h-9", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsTrigger,
          {
            value: "all",
            className: "text-xs",
            "data-ocid": "students.tab.all",
            children: "All"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsTrigger,
          {
            value: "active",
            className: "text-xs",
            "data-ocid": "students.tab.active",
            children: t("active")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsTrigger,
          {
            value: "vacated",
            className: "text-xs",
            "data-ocid": "students.tab.vacated",
            children: t("vacated")
          }
        )
      ] }) })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[68px] rounded-xl" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center",
        "data-ocid": "students.empty_state",
        children: students.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-7 w-7 text-primary/60" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No students yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Add your first student to get started" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/students/new", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "mt-1 gap-2",
              "data-ocid": "students.empty_add_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                " ",
                t("addStudent")
              ]
            }
          ) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10 text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No students match your search" })
        ] })
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: filtered.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(StudentCard, { student: s, index: i }, s.id.toString())) })
  ] }) });
}
export {
  StudentListPage as default
};
