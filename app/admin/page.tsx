import { AdminPage } from "@/components/entrelinhas/AdminPage";
import { AdminProtectedPage } from "@/components/entrelinhas/AdminProtectedPage";

export default function AdminRoute() {
  return (
    <AdminProtectedPage>
      <AdminPage />
    </AdminProtectedPage>
  );
}
