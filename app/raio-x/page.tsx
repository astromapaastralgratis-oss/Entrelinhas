import { ProtectedPage } from "@/components/entrelinhas/ProtectedPage";
import { RaioXFlow } from "@/src/components/raio-x/RaioXFlow";

export default function RaioXRoute() {
  return (
    <ProtectedPage>
      <RaioXFlow />
    </ProtectedPage>
  );
}
