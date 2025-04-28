import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Zap, AlertCircle } from 'lucide-react';
//import { convertStarzToMiningPower, getUserBalance } from '@/lib/appwrite';
import {getUserBalance } from '@/lib/appwrite';

interface ConvertToMiningPowerProps {
  userId: string;
  currentBalance: number;
  onSuccess: () => void;
}

/*
const ConvertToMiningPower: React.FC<ConvertToMiningPowerProps> = ({ 
  userId, 
  currentBalance,
  onSuccess 
}) => {
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [depositedBalance, setDepositedBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the deposited balance when component mounts
  React.useEffect(() => {
    const fetchDepositedBalance = async () => {
      try {
        const balanceData = await getUserBalance(userId);
        //setDepositedBalance(balanceData.depositedBalance || 0);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching deposited balance:", error);
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchDepositedBalance();
    }
  }, [userId]);

  const handleConvertToMiningPower = async () => {
    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to convert STARZ to mining power.",
        variant: "destructive"
      });
      return;
    }
    
    const amountValue = parseFloat(amount);
    
    if (!amount || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to convert.",
        variant: "destructive"
      });
      return;
    }
    
    if (amountValue > currentBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough STARZ to convert this amount.",
        variant: "destructive"
      });
      return;
    }

    if (amountValue > depositedBalance) {
      toast({
        title: "Insufficient Deposited STARZ",
        description: "Only deposited STARZ can be used to purchase mining power. You need to deposit more STARZ.",
        variant: "destructive"
      });
      return;
    }
    
    setIsConverting(true);
    
    try {
      //const result = await convertStarzToMiningPower(userId, amountValue);
      
      toast({
        title: "Conversion Successful",
        description: `Converted ${amountValue} STARZ to ${result.miningPowerGained} mining power.`,
      });
      
      setAmount('');
      onSuccess();
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Conversion Error",
        description: "An error occurred while converting to mining power.",
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleMax = () => {
    // Set to the lower of total balance or deposited balance
    setAmount(Math.min(currentBalance, depositedBalance).toString());
  };

  return (
    <div className="p-4 rounded-md bg-starz-700/30 space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Zap className="text-mining-yellow" size={24} />
        <h3 className="text-lg font-medium">Convert to Mining Power</h3>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="h-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-mining-yellow"></div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="convert-amount">Amount (STARZ)</Label>
              <div className="flex space-x-2">
                <Input 
                  id="convert-amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-starz-700 border-starz-600 text-white"
                />
                <Button
                  variant="outline"
                  className="bg-starz-700 border-starz-600"
                  onClick={handleMax}
                >
                  Max
                </Button>
              </div>
              {amount && (
                <div className="text-sm text-gray-400">
                  Will convert to {parseFloat(amount) * 10} mining power
                </div>
              )}
            </div>
            
            <div className="p-3 border border-starz-600 rounded-md bg-starz-800/50">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Total Balance:</span>
                <span>{currentBalance.toFixed(2)} STARZ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Available for Mining Power:</span>
                <span className="text-mining-yellow">{depositedBalance.toFixed(2)} STARZ</span>
              </div>
            </div>
            
            {depositedBalance < currentBalance && (
              <div className="flex items-start space-x-2 p-3 border border-amber-500/30 rounded-md bg-amber-500/10">
                <AlertCircle className="text-amber-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-200">
                  <p className="font-medium">Restriction Notice</p>
                  <p>Only deposited STARZ can be used to purchase mining power. Mined STARZ cannot be converted.</p>
                </div>
              </div>
            )}
            
            <Button
              onClick={handleConvertToMiningPower}
              className="w-full mining-gradient"
              disabled={isConverting || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > currentBalance || parseFloat(amount) > depositedBalance}
            >
              {isConverting ? 'Converting...' : 'Convert to Mining Power'}
            </Button>
            
            <div className="p-3 border border-mining-yellow/30 rounded-md bg-mining-yellow/10 text-sm">
              <p className="font-medium mb-1">Mining Power Benefits:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>Faster STARZ mining rate</li>
                <li>1 STARZ = 10 Mining Power</li>
                <li>Mining speed increases proportionally with mining power</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConvertToMiningPower;
*/