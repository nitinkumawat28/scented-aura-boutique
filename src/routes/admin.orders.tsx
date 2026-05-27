import { createFileRoute } from "@tanstack/react-router";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { AdminPage } from "./admin";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Admin Orders — The Scented Aura" }] }),
  component: () => (
    <ProtectedAdminRoute>
      <AdminPage defaultTab="orders" />
    </ProtectedAdminRoute>
  ),
});
