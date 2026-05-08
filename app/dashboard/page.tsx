import { DashboardPage } from "@/components/entrelinhas/DashboardPage";
import { ProtectedPage } from "@/components/entrelinhas/ProtectedPage";

export default function DashboardRoute() {
  return (
    <ProtectedPage>
      <DashboardPage />
    </ProtectedPage>
  );
}
