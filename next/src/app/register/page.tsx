"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Book, Mail, Lock, User, AlertCircle, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Register() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.fullName) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post("/users/register", formData);
      
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload?.error || "Registration failed. Username or email may already exist.");
      }
      
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen">
      {/* Left side / Visuals */}
      <div className="hidden lg:flex w-1/2 relative bg-gray-900 border-r border-white/10 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 to-purple-900/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2000&auto=format&fit=crop" 
          alt="Library Books" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-20 max-w-lg text-center px-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="p-8 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Join the Network</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Become a member today to access thousands of premium titles and manage your loans digitally.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side / Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 bg-deep relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="flex items-center justify-end gap-3 mb-10 w-full">
            <span className="text-2xl font-bold tracking-tight text-white">LibraryHub</span>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Book className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="glass-morphism rounded-3xl p-10">
            <h1 className="text-3xl font-bold text-white mb-2">Create an account</h1>
            <p className="text-gray-400 mb-8">Fill in your details to get started</p>

            {error && (
              <div className="flex items-center gap-2 p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl mb-6">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    placeholder="Jonathan Vineet"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    placeholder="jvineet"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    placeholder="jonathan@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    placeholder="Create a strong password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? "Creating account..." : "Sign Up"}
                {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-8">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
