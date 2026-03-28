"use client";

import React, { useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export const ProtectedLayout = ({ 
  children, 
  requireLibrarian = false 
}: { 
  children: React.ReactNode; 
  requireLibrarian?: boolean 
}) => {
  const { isAuthenticated, isLoaded, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (requireLibrarian && userRole !== "LIBRARIAN") {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isLoaded, router, requireLibrarian, userRole]);

  if (!isLoaded || (!isAuthenticated && isLoaded)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (requireLibrarian && userRole !== "LIBRARIAN") {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex bg-deep min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 overflow-y-auto w-full min-h-screen">
        {children}
      </main>
    </div>
  );
};
