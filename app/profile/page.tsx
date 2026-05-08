import { ProfilePage } from "@/components/entrelinhas/ProfilePage";
import { ProtectedPage } from "@/components/entrelinhas/ProtectedPage";

export default function ProfileRoute() {
  return (
    <ProtectedPage>
      <ProfilePage />
    </ProtectedPage>
  );
}
