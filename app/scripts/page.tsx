import { ProtectedPage } from "@/components/entrelinhas/ProtectedPage";
import { ScriptsPage } from "@/components/entrelinhas/ScriptsPage";

export default function ScriptsRoute() {
  return (
    <ProtectedPage>
      <ScriptsPage />
    </ProtectedPage>
  );
}
