import { LoginPage } from "@/components/LoginPage";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy-loaded pages — existing
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const ExpensesPage = lazy(() => import("@/pages/ExpensesPage"));
const ChartPage = lazy(() => import("@/pages/ChartPage"));
const SubscriptionPage = lazy(() => import("@/pages/SubscriptionPage"));
const RemindersPage = lazy(() => import("@/pages/RemindersPage"));
const NotesPage = lazy(() => import("@/pages/NotesPage"));

// Lazy-loaded pages — new
const RoomsPage = lazy(() => import("@/pages/RoomsPage"));
const StudentListPage = lazy(() => import("@/pages/StudentListPage"));
const StudentProfilePage = lazy(() => import("@/pages/StudentProfilePage"));
const StudentFormPage = lazy(() => import("@/pages/StudentFormPage"));
const PaymentsPage = lazy(() => import("@/pages/PaymentsPage"));
const UdharPage = lazy(() => import("@/pages/UdharPage"));
const ComplaintsPage = lazy(() => import("@/pages/ComplaintsPage"));
const StaffPage = lazy(() => import("@/pages/StaffPage"));

function PageLoader() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-4 gap-4">
        {["kpi-1", "kpi-2", "kpi-3", "kpi-4"].map((id) => (
          <Skeleton key={id} className="h-28 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );
}

function AuthGuard() {
  const { isAuthenticated, isInitializing, login, isLoggingIn } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="space-y-3 text-center">
          <Skeleton className="mx-auto h-14 w-14 rounded-2xl" />
          <Skeleton className="mx-auto h-4 w-32" />
          <Skeleton className="mx-auto h-3 w-24" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} isLoggingIn={isLoggingIn} />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
}

// Route tree
const rootRoute = createRootRoute({ component: AuthGuard });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Navigate to="/dashboard" />,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const expensesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/expenses",
  component: ExpensesPage,
});

const chartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chart",
  component: ChartPage,
});

const subscriptionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/subscription",
  component: SubscriptionPage,
});

const remindersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reminders",
  component: RemindersPage,
});

const notesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notes",
  component: NotesPage,
});

// New routes
const roomsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rooms",
  component: RoomsPage,
});

const studentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/students",
  component: StudentListPage,
});

const studentNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/students/new",
  component: StudentFormPage,
});

const studentProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/students/$studentId",
  component: StudentProfilePage,
});

const paymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payments",
  component: PaymentsPage,
});

const udharRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/udhar",
  component: UdharPage,
});

const complaintsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/complaints",
  component: ComplaintsPage,
});

const staffRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/staff",
  component: StaffPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  expensesRoute,
  chartRoute,
  subscriptionRoute,
  remindersRoute,
  notesRoute,
  roomsRoute,
  studentsRoute,
  studentNewRoute,
  studentProfileRoute,
  paymentsRoute,
  udharRoute,
  complaintsRoute,
  staffRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
