import { HistoryPage } from "@/components/entrelinhas/HistoryPage";
import { ProtectedPage } from "@/components/entrelinhas/ProtectedPage";

export default function HistoryRoute() {
  return (
    <ProtectedPage>
      <HistoryPage />
    </ProtectedPage>
  );
}
