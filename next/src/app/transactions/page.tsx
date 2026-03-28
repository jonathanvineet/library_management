"use client";

import React, { useEffect, useState } from "react";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { Search, Check, X, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";

export default function Transactions() {
  const { userRole, userId } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [userRole]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const endpoint = "/transactions"; 
      const res = await api.get(endpoint);
      if (res.ok) {
        let data = await res.json();
        
        // Filter locally if backend returns all transactions to a member
        if (userRole === "MEMBER" && userId) {
          data = data.filter((t: any) => t.member?.id?.toString() === userId.toString());
        }
        
        setTransactions(data);
      }
    } catch (err) {
      console.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (txId: number, action: "approve" | "reject") => {
    try {
      const res = await api.post(`/book-requests/${txId}/${action}`, {});
      if (res.ok) {
        fetchTransactions(); // Refresh list to reflect state changes
      }
    } catch (err) {
      console.error(`Failed to ${action} transaction`);
    }
  };

  const filteredTxs = transactions.filter((t: any) => 
    t.book?.title?.toLowerCase().includes(search.toLowerCase()) || 
    t.member?.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
    t.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-bold text-white mb-2">Transactions</h1>
            <p className="text-gray-400">View and manage library loans and requests.</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by book, member, or status..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
              />
            </div>
          </motion.div>
        </header>

        <div className="glass-morphism rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Book Name</th>
                  {userRole === "LIBRARIAN" && <th className="px-6 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Member</th>}
                  <th className="px-6 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  {userRole === "LIBRARIAN" && <th className="px-6 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={userRole === "LIBRARIAN" ? 5 : 4} className="px-6 py-12 text-center text-gray-500 relative">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
                        <p>Loading transactions...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredTxs.length === 0 ? (
                  <tr>
                    <td colSpan={userRole === "LIBRARIAN" ? 5 : 4} className="px-6 py-12 text-center text-gray-500">
                      <Clock className="w-12 h-12 text-gray-600 mb-4 mx-auto" />
                      <p className="text-lg text-white font-bold mb-1">No transactions found</p>
                      <p className="text-sm">There are no records matching your criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredTxs.map((tx: any, idx) => {
                    const statusColor = 
                      tx.status === "BORROWED" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                      tx.status === "RETURNED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      tx.status === "OVERDUE" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                      tx.status === "PENDING" ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
                      "bg-gray-500/10 text-gray-400 border border-gray-500/20";

                    return (
                      <motion.tr 
                        key={tx.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <div className="font-bold text-white text-base">{tx.book?.title || "Unknown Book"}</div>
                          <div className="text-xs text-gray-500 tracking-wider">ISBN: {tx.book?.isbn || "N/A"}</div>
                        </td>
                        
                        {userRole === "LIBRARIAN" && (
                          <td className="px-6 py-5">
                            <div className="font-medium text-gray-200">{tx.member?.user?.fullName || tx.member?.user?.username}</div>
                            <div className="text-xs text-gray-500">{tx.member?.user?.email}</div>
                          </td>
                        )}

                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1 text-sm">
                            <span className="text-gray-300"><span className="text-gray-500 w-12 inline-block">Out:</span> {tx.issueDate ? new Date(tx.issueDate).toLocaleDateString() : "-"}</span>
                            <span className="text-gray-300"><span className="text-gray-500 w-12 inline-block">Due:</span> {tx.dueDate ? new Date(tx.dueDate).toLocaleDateString() : "-"}</span>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${statusColor} shadow-sm`}>
                            {tx.status}
                          </span>
                        </td>

                        {userRole === "LIBRARIAN" && (
                          <td className="px-6 py-5">
                            {tx.status === "PENDING" ? (
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleAction(tx.id, "approve")}
                                  className="w-8 h-8 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white flex items-center justify-center transition-all border border-emerald-500/30 font-bold shadow-md hover:shadow-emerald-500/40"
                                  title="Approve Request"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleAction(tx.id, "reject")}
                                  className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white flex items-center justify-center transition-all border border-red-500/30 font-bold shadow-md hover:shadow-red-500/40"
                                  title="Reject Request"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-600 font-medium ml-2">—</span>
                            )}
                          </td>
                        )}
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
