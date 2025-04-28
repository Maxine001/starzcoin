
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { APPWRITE_CONFIG } from '@/lib/appwrite';
import { useEffect, useState } from 'react';
import StatCard from './StatCard';
import { Wallet, InfoIcon, Zap, Award, AlertCircle, CircleDollarSign } from 'lucide-react';


interface BalanceCardProps {
  balance?: number;
  miningBalance?: number;
  referralBalance?: number;
  depositedBalance?: number;
}


const BalanceCard: React.FC<BalanceCardProps> = ({ 
  balance = 0, 
  miningBalance = 0, 
  referralBalance = 0,
  depositedBalance = 0,
}) => {

  const [usdValue, setUsdValue] = useState(0);
  const [isIncreasing, setIsIncreasing] = useState(true);
  
// Calculate USD value when balance changes
useEffect(() => {
  // Example conversion rate - replace with actual rate if available
  const conversionRate = 1.25;
  setUsdValue(balance * conversionRate);
}, [balance]);
  
  return (
    <StatCard 
      title="Total Balance" 
      icon={<Wallet size={18} />}
      className=""
      height="500px"
    >
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="text-3xl font-medium tracking-tight">
            {(balance + referralBalance).toFixed(5)}
            <span className="text-sm ml-1 font-normal text-zinc-500 dark:text-zinc-400">STARZ</span>
          </div>
          
          <div className="text-zinc-500 dark:text-zinc-400 text-sm">
            ≈ ${usdValue.toFixed(2)} USD
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-zinc-600 dark:text-zinc-400 text-sm">Mining Balance:</div>
          <div className="font-medium">{miningBalance} STARZ</div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-zinc-600 dark:text-zinc-400 text-sm">Referral Bonus:</div>
          <div className="font-medium text-starz-600 dark:text-starz-400">{referralBalance.toFixed(5)} STARZ</div>
        </div>
        
        <div className="space-y-2">
          <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-starz-500 to-starz-400 rounded-full transition-all duration-500 animate-shimmer"
              style={{ 
                width: `${Math.min(100, ((balance + referralBalance) / 200) * 100)}%`,
                backgroundSize: '200% 100%',
                backgroundImage: 'linear-gradient(to right, #637eff, #4a5cf8, #637eff)'
              }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">Next Milestone: 150 STARZ</span>
            <span className="font-medium">{(((balance + referralBalance) / 150) * 100).toFixed(1)}%</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">24h Change</span>
            <span className={`font-medium ${isIncreasing ? 'text-emerald-500' : 'text-red-500'}`}>
              {isIncreasing ? '+' : '-'}0.42 STARZ
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-start mt-4 text-xs text-gray-400 space-x-2">
            <InfoIcon size={14} className="flex-shrink-0 mt-0.5" />
            <span>Deposit limits: ${APPWRITE_CONFIG.balanceConstraints.min} - ${APPWRITE_CONFIG.balanceConstraints.max} USD per transaction</span>
      </div>
    </StatCard>
  );
};

export default BalanceCard;