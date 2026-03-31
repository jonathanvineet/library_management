import { motion } from 'framer-motion';
import { AppSidebar } from './AppSidebar';
import { TopNav } from './TopNav';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};
