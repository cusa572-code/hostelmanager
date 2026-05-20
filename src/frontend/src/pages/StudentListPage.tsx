import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import { useStudents } from "@/hooks/useQueries";
import { StudentStatus } from "@/types";
import type { StudentSummary } from "@/types";
import { Link } from "@tanstack/react-router";
import { GraduationCap, Plus, Search, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type FilterTab = "all" | "active" | "vacated";

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function StudentCard({
  student,
  index,
}: { student: StudentSummary; index: number }) {
  const isActive = student.status === StudentStatus.active;
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
    >
      <Link
        to="/students/$studentId"
        params={{ studentId: student.id.toString() }}
        data-ocid={`students.item.${index + 1}`}
        className="group flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-4 transition-smooth hover:border-primary/40 hover:bg-card/80 hover:shadow-md"
      >
        {/* Avatar */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-semibold text-sm transition-smooth group-hover:scale-105 ${
            isActive
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {getInitials(student.name)}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-foreground">
            {student.name}
          </p>
          <p className="text-xs text-muted-foreground">{student.phone}</p>
        </div>

        {/* Room */}
        <div className="hidden min-w-0 sm:block">
          {student.roomNumber ? (
            <p className="text-sm text-muted-foreground">
              {t("room")} {student.roomNumber}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground/60 italic">
              Not assigned
            </p>
          )}
        </div>

        {/* Join date */}
        <div className="hidden text-right md:block">
          <p className="text-xs text-muted-foreground">Joined</p>
          <p className="text-sm text-foreground">
            {formatDate(student.joinDate)}
          </p>
        </div>

        {/* Status */}
        <Badge
          className={
            isActive
              ? "shrink-0 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs"
              : "shrink-0 border-muted-foreground/30 bg-muted text-muted-foreground text-xs"
          }
        >
          {isActive ? t("active") : t("vacated")}
        </Badge>
      </Link>
    </motion.div>
  );
}

function StatsRow({ students }: { students: StudentSummary[] }) {
  const active = students.filter(
    (s) => s.status === StudentStatus.active,
  ).length;
  const vacated = students.filter(
    (s) => s.status === StudentStatus.vacated,
  ).length;

  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        {
          label: "Total Students",
          value: students.length,
          color: "text-foreground",
          bg: "bg-muted/30",
        },
        {
          label: "Active",
          value: active,
          color: "text-emerald-400",
          bg: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          label: "Vacated",
          value: vacated,
          color: "text-muted-foreground",
          bg: "bg-muted/30",
        },
      ].map((stat) => (
        <div
          key={stat.label}
          className={`rounded-xl border border-border p-3 text-center ${stat.bg}`}
        >
          <p className={`text-2xl font-bold font-display ${stat.color}`}>
            {stat.value}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function StudentListPage() {
  const { data: students = [], isLoading } = useStudents();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<FilterTab>("all");
  const { t } = useLanguage();

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search);
    const matchesTab =
      tab === "all" ||
      (tab === "active" && s.status === StudentStatus.active) ||
      (tab === "vacated" && s.status === StudentStatus.vacated);
    return matchesSearch && matchesTab;
  });

  return (
    <Layout title={t("students")} subtitle="Manage student records">
      <div className="space-y-5">
        {/* Header row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground font-display">
              {t("students")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? t("loading")
                : `${students.length} student${students.length !== 1 ? "s" : ""} registered`}
            </p>
          </div>
          <Link to="/students/new">
            <Button
              className="w-full gap-2 sm:w-auto"
              data-ocid="students.add_button"
            >
              <Plus className="h-4 w-4" /> {t("addStudent")}
            </Button>
          </Link>
        </div>

        {/* Stats */}
        {!isLoading && students.length > 0 && <StatsRow students={students} />}

        {/* Search + Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`${t("search")} by name or phone…`}
              className="pl-9"
              data-ocid="students.search_input"
            />
          </div>
          <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
            <TabsList className="h-9">
              <TabsTrigger
                value="all"
                className="text-xs"
                data-ocid="students.tab.all"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="text-xs"
                data-ocid="students.tab.active"
              >
                {t("active")}
              </TabsTrigger>
              <TabsTrigger
                value="vacated"
                className="text-xs"
                data-ocid="students.tab.vacated"
              >
                {t("vacated")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-[68px] rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center"
            data-ocid="students.empty_state"
          >
            {students.length === 0 ? (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <GraduationCap className="h-7 w-7 text-primary/60" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    No students yet
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add your first student to get started
                  </p>
                </div>
                <Link to="/students/new">
                  <Button
                    className="mt-1 gap-2"
                    data-ocid="students.empty_add_button"
                  >
                    <Plus className="h-4 w-4" /> {t("addStudent")}
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Users className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-muted-foreground">
                  No students match your search
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((s, i) => (
              <StudentCard key={s.id.toString()} student={s} index={i} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
