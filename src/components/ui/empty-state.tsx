import { ReactNode } from "react";
import { Button } from "./button";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card rounded-lg border border-dashed border-primary/20 h-full min-h-[300px] shadow-sm">
      {icon && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-primary mb-6 p-4 bg-primary/5 rounded-full"
        >
          {icon}
        </motion.div>
      )}
      <motion.h3
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-xl font-semibold mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-muted-foreground mb-8 max-w-sm"
      >
        {description}
      </motion.p>
      {actionLabel && onAction && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            onClick={onAction}
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-md"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
