import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { HiLockClosed, HiArrowLeft } from "react-icons/hi";
import toast from "react-hot-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { login, isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      const from = location.state?.from?.pathname || "/admin";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all credentials fields.");
      return;
    }

    setIsSubmitting(true);
    const loadId = toast.loading("Authenticating admin session...");

    try {
      const userInfo = await login(username, password);

      const allowedRoles = [5150, 1984];

      const hasAccess = userInfo?.roles?.some((role) =>
        allowedRoles.includes(role),
      );

      if (!hasAccess) {
        toast.error("You are not authorized to access the admin portal.", {
          id: loadId,
        });

        return;
      }

      toast.success("Access granted. Welcome back!", {
        id: loadId,
      });

      // Redirect happens in useEffect
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Login failed. Please verify credentials.";
      setError(msg);
      toast.error(msg, { id: loadId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-cream flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-soft-sage border-t-walnut-brown rounded-full animate-spin"></div>
        <p className="mt-3 text-sm font-semibold text-walnut-brown uppercase tracking-wider">
          Verifying session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream flex flex-col items-center justify-center p-4">
      {/* Return to website */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-walnut-brown/70 uppercase tracking-wider hover:text-walnut-brown transition-all"
        >
          <HiArrowLeft /> Back to Shop
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl border border-walnut-brown/12 p-8 sm:p-10 shadow-2xl relative">
        <div className="absolute inset-x-0 top-0 h-2 bg-walnut-brown rounded-t-3xl" />

        {/* Title */}
        <div className="text-center space-y-3 mb-8">
          <img
            src="/gleamy-icon-primary.png"
            alt="Gleamy Baby Cots & Furniture"
            className="h-16 sm:h-20 w-auto mx-auto"
          />
          <div className="mx-auto w-10 h-10 bg-walnut-brown/5 text-walnut-brown rounded-xl flex items-center justify-center">
            <HiLockClosed size={20} />
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-walnut-brown">
            Admin Portal Access
          </h1>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200/50 rounded-xl text-red-700 text-xs font-semibold leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Admin Username"
            name="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <Input
            type="password"
            label="Password"
            name="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
              className="py-3"
            >
              Authenticate & Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
