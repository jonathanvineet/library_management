import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Search, Users, ArrowRightLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import heroLibrary from '@/assets/hero-library.jpg';
import booksFlatlay from '@/assets/books-flatlay.jpg';
import libraryBrowse from '@/assets/library-browse.jpg';

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
});

const features = [
  { icon: Search, title: 'Smart Catalog', desc: 'Search & filter thousands of books instantly by title, author, or ISBN.' },
  { icon: Users, title: 'Member Management', desc: 'Track members, roles, and borrowing history in one place.' },
  { icon: ArrowRightLeft, title: 'Transaction Tracking', desc: 'Monitor checkouts, returns, and overdue books effortlessly.' },
  { icon: ShieldCheck, title: 'Role-Based Access', desc: 'Librarians and members see exactly what they need — nothing more.' },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-display">LMS</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Decorative gradient orbs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] rounded-full bg-info/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp(0)}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-6">
              <Sparkles className="h-3 w-3" />
              Modern Library Management
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-display leading-[1.1] mb-6"
          >
            Organize your library
            <br />
            <span className="text-primary">with elegance</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            LMS is a sleek, role-aware library system that makes managing
            books, members, and transactions a breeze — for librarians and readers alike.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link to="/register">
              <Button size="lg" className="gap-2 text-base px-8">
                <Sparkles className="h-4 w-4" />
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-base px-8">
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-border">
              <img
                src={heroLibrary}
                alt="Modern library interior with warm lighting and bookshelves"
                width={1280}
                height={720}
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating accent glow behind image */}
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/10 blur-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-display mb-3">Everything you need</h2>
            <p className="text-muted-foreground text-lg">Powerful features wrapped in a minimal interface.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease }}
                className="surface-card p-6 hover-lift group"
              >
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery / Showcase */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-display mb-3">A space for every reader</h2>
            <p className="text-muted-foreground text-lg">Beautiful spaces. Seamless experience. Endless stories.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease }}
              className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-border"
            >
              <img
                src={booksFlatlay}
                alt="Cozy reading setup with open books, glasses, and coffee"
                width={640}
                height={640}
                loading="lazy"
                className="w-full h-72 md:h-80 object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease }}
              className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-border"
            >
              <img
                src={libraryBrowse}
                alt="Person browsing books in a library aisle"
                width={640}
                height={800}
                loading="lazy"
                className="w-full h-72 md:h-80 object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-3xl mx-auto text-center surface-elevated p-12 lg:p-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-display mb-3">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8 text-lg">Create your account in seconds and start managing your library today.</p>
          <Link to="/register">
            <Button size="lg" className="gap-2 text-base px-10">
              <Sparkles className="h-4 w-4" />
              Create Free Account
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">LMS</span>
          </div>
          <p>&copy; {new Date().getFullYear()} LMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
