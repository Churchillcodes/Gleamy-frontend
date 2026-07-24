import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

export default function PersistLogin() {
  const { user, setUser, decodeToken } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        if (!user) {
          const data = await authApi.refresh();

          if (data?.accessToken) {
            setUser(decodeToken(data.accessToken));
          }
        }
      } catch {
        // Visitor simply isn't logged in.
      } finally {
        setLoading(false);
      }
    };

    verifyRefreshToken();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-soft-sage border-t-walnut-brown rounded-full animate-spin"></div>
      </div>
    );
  }

  return <Outlet />;
}
