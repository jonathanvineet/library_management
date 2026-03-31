import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 px-4 text-center"
  >
    <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
      <AlertTriangle className="h-8 w-8 text-destructive" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
    {message && <p className="text-sm text-muted-foreground max-w-sm">{message}</p>}
    {onRetry && (
      <Button variant="outline" onClick={onRetry} className="mt-4">Try Again</Button>
    )}
  </motion.div>
);
