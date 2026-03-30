"use client";

import React, { useEffect, useState } from "react";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { Book, Users, Activity, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { userRole, fullName, userId } = useAuth();
  const [stats, setStats] = useState({ books: 0, members: 0, transactions: 0, overdue: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Note: The backend uses /api/transactions for librarians (all) and likely /api/transactions for members filtered by backend.
        // Actually, if a member calls /api/transactions, they might get 403 or only their own depending on Spring Boot config.
        // Let's call /api/transactions.
        const [booksRes, txsRes] = await Promise.all([
          api.get("/books"),
          api.get("/transactions") 
        ]);
        
        let booksCount = 0;
        let txsCount = 0;
        let overdueCount = 0;
        let membersCount = 0;

        if (booksRes.ok) {
          const books = await booksRes.json();
          booksCount = books.length;
        }

        if (txsRes.ok) {
          const txs = await txsRes.json();
          // If user is MEMBER, they should only see their own transactions
          // We will filter on frontend just in case API returns all, but usually API should limit it
          let userTxs = txs;
          if (userRole === "MEMBER" && userId) {
            userTxs = txs.filter((t: any) => t.member?.id?.toString() === userId.toString());
          }
          
          const loanTxs = userTxs.filter((t: any) => ["BORROWED", "RETURNED", "OVERDUE", "LOST"].includes(t.status));
          txsCount = loanTxs.length;
          overdueCount = userTxs.filter((t: any) => t.status === "OVERDUE").length;
          setRecentTransactions(userTxs.slice(0, 5));
        }

        if (userRole === "LIBRARIAN") {
          const membersRes = await api.get("/members");
          if (membersRes.ok) {
            const members = await membersRes.json();
            membersCount = members.length;
          }
        }

        setStats({ books: booksCount, members: membersCount, transactions: txsCount, overdue: overdueCount });
      } catch (err: any) {
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    if (userRole) {
      fetchDashboardData();
    }
  }, [userRole, userId]);

  return (
    <ProtectedLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome, {fullName}</h1>
            <p className="text-gray-400">Here's your {userRole?.toLowerCase()} overview for today.</p>
          </motion.div>
        </header>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="glass-morphism rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <Book className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-xs font-bold text-indigo-400 uppercase">Library</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stats.books}</h3>
              <p className="text-sm font-medium text-gray-500">Total Books</p>
            </div>

            {userRole === "LIBRARIAN" && (
              <div className="glass-morphism rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-xs font-bold text-blue-400 uppercase">Network</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{stats.members}</h3>
                <p className="text-sm font-medium text-gray-500">Active Members</p>
              </div>
            )}

            <div className="glass-morphism rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-xs font-bold text-emerald-400 uppercase">Activity</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stats.transactions}</h3>
              <p className="text-sm font-medium text-gray-500">Total Transactions</p>
            </div>

            <div className="glass-morphism rounded-2xl p-6 border-red-500/20 bg-red-500/5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-red-400" />
                </div>
                <span className="text-xs font-bold text-red-400 uppercase">Alert</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stats.overdue}</h3>
              <p className="text-sm font-medium text-gray-500">Overdue Items</p>
            </div>
          </motion.div>
        )}

        {/* Recent Activity Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-bold text-white mb-6 mt-12">Recent Activity</h2>
          <div className="glass-morphism rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Book</th>
                    {userRole === "LIBRARIAN" && <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Member</th>}
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentTransactions.map((tx: any) => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-white">{tx.book?.title || "Unknown Book"}</div>
                        <div className="text-xs text-gray-500">{tx.book?.isbn || "-"}</div>
                      </td>
                      {userRole === "LIBRARIAN" && (
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-300">{tx.member?.user?.username || "Unknown"}</div>
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          tx.status === "BORROWED" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                          tx.status === "RETURNED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          tx.status === "OVERDUE" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                          "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {tx.dueDate ? new Date(tx.dueDate).toLocaleDateString() : "-"}
                      </td>
                    </tr>
                  ))}
                  {recentTransactions.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={userRole === "LIBRARIAN" ? 4 : 3} className="px-6 py-8 text-center text-gray-500 text-sm">
                        No recent activity found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </ProtectedLayout>
  );
}
