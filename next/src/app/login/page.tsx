"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Book, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post("/auth/login", { email, password });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Invalid email or password");
      }
      
      login(data);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen">
      {/* Left side / Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 bg-deep relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Book className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">LibraryHub</span>
          </div>

          <div className="glass-morphism rounded-3xl p-10">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-gray-400 mb-8">Sign in to your account to continue</p>

            {error && (
              <div className="flex items-center gap-2 p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl mb-6">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <a href="#" className="text-xs font-medium text-indigo-400 hover:text-indigo-300">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? "Signing in..." : "Sign In"}
                {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-8">
              Don't have an account?{" "}
              <Link href="/register" className="font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4">
                Create one now
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right side / Visuals */}
      <div className="hidden lg:flex w-1/2 relative bg-gray-900 border-l border-white/10 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop" 
          alt="Library" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-20 max-w-lg text-center px-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="p-8 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Master Your Collection</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Experience the next generation of library management. Unparalleled speed, gorgeous aesthetics, and powerful analytics.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
