import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "@heroui/react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import * as authService from "@/services/authService";

import { AuthContext } from "@/hooks/auth";

const AUTH_POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pollRef = useRef(null);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch {
      // 401 is handled by the axios response interceptor
    }
  }, []);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const userData = await authService.getMe();
        setUser(userData);
      } catch {
        // Not logged in
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Poll /auth/me periodically to keep user state fresh
  useEffect(() => {
    if (user) {
      pollRef.current = setInterval(refreshUser, AUTH_POLL_INTERVAL);
    } else {
      clearInterval(pollRef.current);
    }

    return () => clearInterval(pollRef.current);
  }, [user, refreshUser]);

  const login = async (username, password, rememberMe = false) => {
    try {
      const userData = await authService.login({
        username,
        password,
        rememberMe,
      });

      // Ensure we don't reuse cached data from a previous session/user.
      await queryClient.cancelQueries();
      queryClient.clear();

      setUser(userData);
      toast.success(`Welcome back, ${userData.username}!`);
      navigate("/", { replace: true });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Invalid username or password. Please try again.";
      toast.warning(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (username, password) => {
    try {
      const userData = await authService.register({ username, password });

      await queryClient.cancelQueries();
      queryClient.clear();

      setUser(userData);
      toast.success(`Welcome, ${userData.username}!`);
      navigate("/", { replace: true });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Registration failed. Please try again.";
      toast.warning(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();

      // Clear cached data so the next login doesn't see the previous user's data.
      await queryClient.cancelQueries();
      queryClient.clear();

      setUser(null);
      toast.success("You have been logged out successfully. See you soon!");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.warning("Failed to log out. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
