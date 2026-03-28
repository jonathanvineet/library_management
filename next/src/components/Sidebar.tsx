"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, Users, Activity, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export const Sidebar = () => {
  const { userRole, fullName, logout } = useAuth();
  const pathname = usePathname();

  const initials = fullName
    ? fullName.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "U";

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", roles: ["LIBRARIAN", "MEMBER"] },
    { id: "books", icon: Book, label: "Books", href: "/books", roles: ["LIBRARIAN", "MEMBER"] },
    { id: "members", icon: Users, label: "Members", href: "/members", roles: ["LIBRARIAN"] },
    { id: "transactions", icon: Activity, label: "Transactions", href: "/transactions", roles: ["LIBRARIAN", "MEMBER"] },
  ];

  const filteredNav = navItems.filter((item) => userRole && item.roles.includes(userRole));

  return (
    <aside className="w-64 min-h-screen bg-card/80 backdrop-blur-3xl border-r border-white/10 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Book className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">LibraryHub</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNav.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-indigo-600 shadow-lg shadow-indigo-600/25 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
        <div className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl bg-white/5 border border-white/5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-indigo-600/20">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white leading-tight truncate overflow-hidden whitespace-nowrap">{fullName || "User"}</span>
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">{userRole}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
