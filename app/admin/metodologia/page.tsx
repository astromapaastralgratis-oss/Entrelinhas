import { AdminMethodologyPage } from "@/components/entrelinhas/AdminMethodologyPage";
import { AdminProtectedPage } from "@/components/entrelinhas/AdminProtectedPage";

export default function AdminMethodologyRoute() {
  return (
    <AdminProtectedPage>
      <AdminMethodologyPage />
    </AdminProtectedPage>
  );
}
