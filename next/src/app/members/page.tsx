"use client";

import React, { useEffect, useState } from "react";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { Search, User, Mail, Shield, Check, X } from "lucide-react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/members");
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (err) {
      console.error("Failed to load members");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMembers = members.filter((m: any) => 
    m.user?.username?.toLowerCase().includes(search.toLowerCase()) || 
    m.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.user?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedLayout requireLibrarian={true}>
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-bold text-white mb-2">Member Directory</h1>
            <p className="text-gray-400">Manage library members and their access levels.</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, username, email..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
              />
            </div>
          </motion.div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member: any, index) => {
              const u = member.user || {};
              const initials = (u.fullName || u.username || "U").split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
              
              return (
                <motion.div 
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-morphism rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-indigo-600/30">
                      {initials}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-lg font-bold text-white leading-tight truncate">{u.fullName || u.username}</h4>
                      <p className="text-sm font-medium text-gray-400 truncate">@{u.username}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                      <span className="text-gray-300 truncate">{u.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Shield className="w-4 h-4 text-gray-500 shrink-0" />
                      <span className="text-gray-300 capitalize">{u.role?.toLowerCase() || "Member"}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex gap-2">
                    <button className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-colors">
                      View Profile
                    </button>
                    {/* Placeholder for future action, could be edit, suspend, etc. */}
                  </div>
                </motion.div>
              );
            })}
            
            {!isLoading && filteredMembers.length === 0 && (
              <div className="col-span-full py-20 text-center flex flex-col items-center">
                <User className="w-12 h-12 text-gray-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No members found</h3>
                <p className="text-gray-400">Try adjusting your search terms.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
