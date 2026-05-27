import { createFileRoute } from "@tanstack/react-router";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { AdminPage } from "./admin";

export const Route = createFileRoute("/admin/products")({
  head: () => ({ meta: [{ title: "Admin Products — The Scented Aura" }] }),
  component: () => (
    <ProtectedAdminRoute>
      <AdminPage defaultTab="products" />
    </ProtectedAdminRoute>
  ),
});
