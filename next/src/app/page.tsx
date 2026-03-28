"use client";

import React, { useEffect, useState } from "react";
import { Book, Users, Activity, LogIn, UserPlus, Search, Menu, X, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { label: "Total Books", value: "2,450", icon: <Book className="w-5 h-5 text-indigo-400" />, trend: "+12%" },
    { label: "Active Members", value: "842", icon: <Users className="w-5 h-5 text-blue-400" />, trend: "+5%" },
    { label: "Monthly Loans", value: "1,120", icon: <Activity className="w-5 h-5 text-emerald-400" />, trend: "+18%" },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-primary/80 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Book className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">LibraryHub</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              {["Catalog", "Members", "Transactions"].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">{item}</a>
              ))}
            </nav>
            <div className="flex items-center gap-4 border-l border-white/10 pl-8">
              <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Sign In</button>
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20">Get Started</button>
            </div>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-30">
          <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-indigo-600 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] right-[10%] w-96 h-96 bg-purple-600 rounded-full blur-[140px]" />
        </div>

        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-template-columns-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Rocket className="w-3 h-3" /> Built for Modern Libraries
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                Manage your Library <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                  in the Future.
                </span>
              </h1>
              <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
                Streamline your collection management, member engagement, and loan transactions with our premium, cloud-native Library Management System.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-indigo-600/25">
                  Launch Demo
                </button>
                <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-lg transition-all">
                  View Features
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative z-10 p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl">
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    {stats.map((stat, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          {stat.icon}
                          <span className="text-[10px] font-bold text-emerald-400">{stat.trend}</span>
                        </div>
                        <div className="text-xl font-bold text-white">{stat.value}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-indigo-600/10 rounded-2xl p-6 border border-indigo-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-white">Recent Activity</h3>
                      <Activity className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="space-y-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <div className="flex gap-3 items-center">
                            <div className="w-2 h-2 rounded-full bg-indigo-500" />
                            <span className="text-gray-300">Book borrowed: Atomic Habits</span>
                          </div>
                          <span className="text-gray-500">2m ago</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600 rounded-full blur-[80px] opacity-40" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600 rounded-full blur-[80px] opacity-30" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Catalog Preview */}
      <section className="py-20 bg-[#070b1e]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">Explore Catalog</h2>
              <p className="text-gray-400 max-w-xl">Search through our exhaustive collection of premium titles and educational resources.</p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search collection..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 transition-all hover:-translate-y-2">
                <div className="aspect-[4/5] bg-gray-900 overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=800&fit=crop`} 
                    alt="Book Cover" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <button className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-600/30">Request Borrow</button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Fiction</div>
                  <h4 className="text-lg font-bold text-white mb-1">Modern Architecture</h4>
                  <p className="text-sm text-gray-500">by Jonathan Vineet</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
