
import { useEffect, useState } from 'react';
import { Database, ServerCrash, Server } from 'lucide-react';
import StatCard from './StatCard';

const MiningAnimation = () => {
  const [miningActive, setMiningActive] = useState(true);
  const [miningRate, setMiningRate] = useState(0.00042);
  const [miningTime, setMiningTime] = useState('');
  
  // Update mining time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      const secs = now.getSeconds().toString().padStart(2, '0');
      setMiningTime(`${hours}:${mins}:${secs}`);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <StatCard 
      title="Mining Status" 
      icon={<Server size={18} />}
      className="h-full"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Mining Rate:</span>
          <span className="text-sm font-medium">{miningRate.toFixed(5)} STARZ/s</span>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center mb-4">
          <div className="relative w-24 h-24 flex items-center justify-center mb-2">
            {/* Pulse ring */}
            <div className={`absolute w-full h-full rounded-full ${miningActive ? 'bg-starz-100 dark:bg-starz-950/30 animate-pulse-ring' : 'bg-zinc-100 dark:bg-zinc-800'}`}></div>
            
            {/* Mining icon */}
            <div className={`relative z-10 p-4 rounded-full ${miningActive ? 'bg-starz-500 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'}`}>
              {miningActive ? (
                <Database size={32} className="animate-floating" />
              ) : (
                <ServerCrash size={32} />
              )}
            </div>
          </div>
          
          {/* Status text */}
          <div className={`font-medium text-sm ${miningActive ? 'text-starz-600 dark:text-starz-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
            {miningActive ? 'Mining Active' : 'Mining Inactive'}
          </div>
          
          {/* Mining dots */}
          {miningActive && (
            <div className="flex space-x-1 mt-1">
              <div className="mining-dot w-1.5 h-1.5 rounded-full bg-starz-500 dark:bg-starz-400 animate-mining-dots"></div>
              <div className="mining-dot w-1.5 h-1.5 rounded-full bg-starz-500 dark:bg-starz-400 animate-mining-dots"></div>
              <div className="mining-dot w-1.5 h-1.5 rounded-full bg-starz-500 dark:bg-starz-400 animate-mining-dots"></div>
            </div>
          )}
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Active since</span>
            <span>{miningTime}</span>
          </div>
        </div>
      </div>
    </StatCard>
  );
};

export default MiningAnimation;
