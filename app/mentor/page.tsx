import { Suspense } from "react";
import { MentorPage } from "@/components/entrelinhas/MentorPage";
import { ProtectedPage } from "@/components/entrelinhas/ProtectedPage";

export default function MentorRoute() {
  return (
    <ProtectedPage>
      <Suspense fallback={<div className="text-entrelinhas-muted">Carregando mentora...</div>}>
        <MentorPage />
      </Suspense>
    </ProtectedPage>
  );
}
