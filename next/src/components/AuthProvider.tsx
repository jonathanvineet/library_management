"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  username: string | null;
  fullName: string | null;
  email: string | null;
  userId: string | null;
  login: (data: any) => void;
  logout: () => void;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session?.user) {
        const user = session.user;
        const { data: profile } = await supabase
          .from("users")
          .select("id, username, full_name, email, role")
          .eq("id", user.id)
          .maybeSingle();

        setIsAuthenticated(true);
        setUserRole((profile?.role || (user.user_metadata?.role as string) || "member").toUpperCase());
        setUsername(profile?.username || user.email?.split("@")[0] || null);
        setFullName(profile?.full_name || (user.user_metadata?.fullName as string) || user.email || null);
        setEmail(profile?.email || user.email || null);
        setUserId(user.id);
      }

      setIsLoaded(true);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (!session?.user) {
        setIsAuthenticated(false);
        setUserRole(null);
        setUsername(null);
        setFullName(null);
        setEmail(null);
        setUserId(null);
        return;
      }

      const user = session.user;
      setIsAuthenticated(true);
      setUserRole(((user.user_metadata?.role as string) || "member").toUpperCase());
      setUsername((user.user_metadata?.username as string) || user.email?.split("@")[0] || null);
      setFullName((user.user_metadata?.fullName as string) || user.email || null);
      setEmail(user.email || null);
      setUserId(user.id);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = (userData: any) => {
    setIsAuthenticated(true);
    setUserRole(userData.role?.toUpperCase?.() || "MEMBER");
    setUsername(userData.username);
    setFullName(userData.fullName || userData.username);
    setEmail(userData.email);
    setUserId((userData.id || userData.userId)?.toString());
    
    if (userData.role) localStorage.setItem("userRole", userData.role.toUpperCase());
    if (userData.username) localStorage.setItem("username", userData.username);
    if (userData.fullName) localStorage.setItem("fullName", userData.fullName);
    if (userData.email) localStorage.setItem("email", userData.email);
    if (userData.id || userData.userId) localStorage.setItem("userId", (userData.id || userData.userId).toString());
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUsername(null);
    setFullName(null);
    setEmail(null);
    setUserId(null);
    
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");

    supabase.auth.signOut();

    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, username, fullName, email, userId, login, logout, isLoaded }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
