import React, { createContext, useState, useEffect, useContext } from "react";
import { authApi } from "../api/authApi";
import { setAccessToken } from "../api/axiosInstance";
import { ROLES } from "../utils/constants";

const AuthContext = createContext(null);

function decodeToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.UserInfo; // Returns { username, roles }
  } catch (e) {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Listen for interceptor token expiration events
  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      setAccessToken(null);
    };

    window.addEventListener("auth-session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth-session-expired", handleSessionExpired);
    };
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await authApi.login(username, password);
      if (data.accessToken) {
        const userInfo = decodeToken(data.accessToken);
        setUser(userInfo);
        return userInfo;
      }
      throw new Error("No access token returned");
    } catch (err) {
      setUser(null);
      setAccessToken(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setAccessToken(null);
      setLoading(false);
    }
  };

  const isAdmin = user && user.roles && user.roles.includes(ROLES.Admin);

  const value = {
    user,
    setUser,
    loading,
    login,
    logout,
    isAdmin,
    isAuthenticated: !!user,
    decodeToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
