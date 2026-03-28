"use client";

import React, { useEffect, useState } from "react";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { Search, Info, Check, X } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";

const BOOK_COVERS = [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&h=600&fit=crop',
];

export default function Books() {
  const { userRole, userId } = useAuth();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [requestState, setRequestState] = useState<{ [key: string]: 'idle' | 'loading' | 'success' | 'error' }>({});

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/books");
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (err) {
      console.error("Failed to load books");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestBorrow = async (bookId: number) => {
    if (!userId) return;
    
    try {
      setRequestState(prev => ({ ...prev, [bookId]: 'loading' }));
      const payload = { bookId, memberId: parseInt(userId, 10) };
      const res = await api.post("/book-requests/request", payload);
      
      if (!res.ok) throw new Error();
      
      setRequestState(prev => ({ ...prev, [bookId]: 'success' }));
      setTimeout(() => setRequestState(prev => ({ ...prev, [bookId]: 'idle' })), 3000);
    } catch (err) {
      setRequestState(prev => ({ ...prev, [bookId]: 'error' }));
      setTimeout(() => setRequestState(prev => ({ ...prev, [bookId]: 'idle' })), 3000);
    }
  };

  const getBookCover = (book: any) => {
    if (book.coverImageUrl) return book.coverImageUrl;
    let hash = 0;
    const s = book.title || '';
    for (let i = 0; i < s.length; i++) hash = ((hash << 5) - hash) + s.charCodeAt(i);
    return BOOK_COVERS[Math.abs(hash) % BOOK_COVERS.length];
  };

  const filteredBooks = books.filter((b: any) => 
    b.title?.toLowerCase().includes(search.toLowerCase()) || 
    b.author?.toLowerCase().includes(search.toLowerCase()) ||
    b.isbn?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-bold text-white mb-2">Book Catalog</h1>
            <p className="text-gray-400">Search and borrow from our premium collection.</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search titles, authors, ISBN..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
              />
            </div>
          </motion.div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks.map((book: any, index) => (
              <motion.div 
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative rounded-2xl overflow-hidden glass-morphism transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col"
              >
                <div className="aspect-[3/4] bg-gray-900 relative overflow-hidden shrink-0">
                  <img 
                    src={getBookCover(book)} 
                    alt={book.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                  />
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <span className={`px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider ${book.available ? "text-emerald-400" : "text-gray-400"}`}>
                      {book.available ? "Available" : "Checked Out"}
                    </span>
                  </div>

                  {userRole === "MEMBER" && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      {book.available ? (
                        <button 
                          onClick={() => handleRequestBorrow(book.id)}
                          disabled={requestState[book.id] && requestState[book.id] !== 'idle'}
                          className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2
                            ${requestState[book.id] === 'loading' ? "bg-gray-600 text-white" : 
                              requestState[book.id] === 'success' ? "bg-emerald-600 shadow-emerald-600/30 text-white" :
                              requestState[book.id] === 'error' ? "bg-red-600 text-white" :
                              "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
                            }
                          `}
                        >
                          {requestState[book.id] === 'loading' && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                          {requestState[book.id] === 'success' && <Check className="w-4 h-4" />}
                          {requestState[book.id] === 'error' && <X className="w-4 h-4" />}
                          {(!requestState[book.id] || requestState[book.id] === 'idle') && "Borrow Book"}
                          {requestState[book.id] === 'success' && "Requested"}
                          {requestState[book.id] === 'error' && "Failed"}
                        </button>
                      ) : (
                        <button disabled className="w-full py-3 bg-gray-800 text-gray-400 cursor-not-allowed rounded-xl font-bold text-sm border border-gray-700">
                          Unavailable
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">{book.isbn || "NO-ISBN"}</div>
                  <h4 className="text-base font-bold text-white mb-1 line-clamp-2 leading-tight">{book.title}</h4>
                  <p className="text-xs text-gray-400 mt-auto">{book.author}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredBooks.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center">
            <Info className="w-12 h-12 text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No books found</h3>
            <p className="text-gray-400">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
