import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Button variant="ghost" onClick={handleLogout}>
      Logout
    </Button>
  );
}
