
import { ReactNode } from 'react';
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  rightElement?: ReactNode;
  height?: string;
}

const StatCard = ({ 
  title, 
  icon, 
  children, 
  className, 
  contentClassName,
  rightElement,
  height = '500px' 
}: StatCardProps) => {
  return (
    <div className={cn(
      "p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm transition-all duration-300",
      "border border-zinc-100 dark:border-zinc-800",
      "animate-scale-up",
      "hover:shadow-md",
      className
    )}
    style={{ height }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</h3>
        <div className="flex items-center space-x-2">
          {rightElement && <div>{rightElement}</div>}
          <div className="text-starz-600 dark:text-starz-400">
            {icon}
          </div>
        </div>
      </div>
      <div className={cn("transition-all duration-300", contentClassName)}>
        {children}
      </div>
    </div>
  );
};

export default StatCard;
