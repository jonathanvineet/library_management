"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    // Check local storage on mount
    const token = localStorage.getItem("auth_token");
    if (token) {
      setIsAuthenticated(true);
      setUserRole(localStorage.getItem("userRole"));
      setUsername(localStorage.getItem("username"));
      setFullName(localStorage.getItem("fullName"));
      setEmail(localStorage.getItem("email"));
      setUserId(localStorage.getItem("userId"));
    }
    setIsLoaded(true);
  }, []);

  const login = (userData: any) => {
    setIsAuthenticated(true);
    setUserRole(userData.role);
    setUsername(userData.username);
    setFullName(userData.fullName || userData.username);
    setEmail(userData.email);
    setUserId(userData.id?.toString());
    
    // Auth token is already saved by login page, just save user info
    if (userData.role) localStorage.setItem("userRole", userData.role);
    if (userData.username) localStorage.setItem("username", userData.username);
    if (userData.fullName) localStorage.setItem("fullName", userData.fullName);
    if (userData.email) localStorage.setItem("email", userData.email);
    if (userData.id) localStorage.setItem("userId", userData.id.toString());
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUsername(null);
    setFullName(null);
    setEmail(null);
    setUserId(null);
    
    localStorage.removeItem("auth_token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");

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
