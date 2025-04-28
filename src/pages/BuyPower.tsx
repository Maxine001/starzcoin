
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, Zap, InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '../hooks/use-auth';
import { getUserTransactions, getUserBalance } from '@/lib/appwrite';





const BuyPower = () => {
  const [amount, setAmount] = useState<number>(100);
  const [processing, setProcessing] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [miningBalance, setMiningBalance] = useState<number>(0);
  const [referralBalance, setReferralBalance] = useState<number>(0);
  const [depositedBalance, setDepositedBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [user]);
  
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      if (!user || !user.userId) {
        console.error('User or userId is undefined');
        setIsLoading(false);
        return;
      }
      
      // Get user balance
      const userBalance = await getUserBalance(user.userId);
      setBalance(userBalance.balance || 0);
      setMiningBalance(userBalance.miningBalance || 0);
      setReferralBalance(userBalance.referralBalance || 0);
      //setDepositedBalance(userBalance.depositedBalance || 0);
      
      // Get user transactions
      const userTransactions = await getUserTransactions(user.userId);
      setTransactions(userTransactions);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      toast({
        title: "Error loading data",
        description: "Could not load your balance and transactions. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  // Check if user came from a referral link
  const [hasReferrer, setHasReferrer] = useState(false);
  const [referrerId, setReferrerId] = useState('');
  
  useEffect(() => {
    // In a real app, this would check localStorage or a cookie for referral data
    // For this demo, we'll randomly determine if the user has a referrer 50% of the time
    const wasReferred = Math.random() > 0.5;
    setHasReferrer(wasReferred);
    
    if (wasReferred) {
      // Simulate a referrer ID
      setReferrerId("user" + Math.floor(Math.random() * 10000));
    }
  }, []);

  const handleAmountChange = (value: number[]) => {
    setAmount(value[0]);
  };

  const handlePurchase = () => {
    setProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setProcessing(false);
      
      // If the user was referred, show a message about the referral bonus
      if (hasReferrer) {
        toast({
          title: "Purchase Successful",
          description: `You have purchased $${amount} worth of mining power. ${referrerId} received ${(amount * 0.1).toFixed(2)} STARZ as a referral bonus.`,
        });
      } else {
        toast({
          title: "Purchase Successful",
          description: `You have purchased $${amount} worth of mining power.`,
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <header className="flex items-center mb-8 animate-fade-in">
          <Link to="/dashboard" className="flex items-center text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors mr-4">
            <ChevronLeft size={18} />
            <span className="ml-1 text-sm">Dashboard</span>
          </Link>
          <h1 className="text-2xl font-medium tracking-tight">Buy Mining Power</h1>
        </header>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm p-6 mb-8 animate-scale-up">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="text-starz-600 dark:text-starz-400" size={24} />
            <h2 className="text-xl font-medium">Increase Your Mining Capacity</h2>
          </div>
          
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            Boost your mining rewards by increasing your mining power. The more mining power you have, the more STARZ you can earn daily.
          </p>

        

          

          <div className="space-y-8">
            <div className="space-y-4">
              <label className="block text-sm font-medium">
                Select amount (USD)
              </label>
              
              <div className="pt-6">
                <Slider 
                  defaultValue={[100]} 
                  max={1000} 
                  min={10} 
                  step={10} 
                  value={[amount]}
                  onValueChange={handleAmountChange}
                  className="mb-6"
                />
                
                <div className="flex items-start mt-4 text-xs text-gray-400 space-x-2">
                  <InfoIcon size={14} className="flex-shrink-0 mt-0.5" />
                  <span>Deposit limits: $10 - $3,000 USD per transaction</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
                  <span>$10</span>
                  <span>$1000</span>
                </div>
              </div>
              
              <div className="mt-6 bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-zinc-600 dark:text-zinc-400">Selected amount:</span>
                  <span className="font-medium">${amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Estimated daily earnings:</span>
                  <span className="font-medium text-starz-600 dark:text-starz-400">+{(amount * 0.005).toFixed(3)} STARZ</span>
                </div>
                
                {hasReferrer && (
                  <div className="flex justify-between mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                    <span className="text-zinc-600 dark:text-zinc-400">Referral bonus to referrer:</span>
                    <span className="font-medium text-starz-600 dark:text-starz-400">+{(amount * 0.1).toFixed(2)} STARZ</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <Button 
                onClick={handlePurchase}
                disabled={processing}
                className="w-full bg-starz-600 hover:bg-starz-700 text-white"
              >
                {processing ? "Processing..." : `Purchase $${amount} Mining Power`}
              </Button>
              
              <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400 text-center">
                Mining power increases are applied immediately after purchase.
                {hasReferrer ? " 10% of your purchase will be awarded to your referrer as bonus STARZ." : " Invite friends using your referral link to earn 10% of their purchases as bonus STARZ."}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm p-6 animate-scale-up">
          <h3 className="text-lg font-medium mb-4">What You Get</h3>
          
          <ul className="space-y-4">
            <li className="flex gap-3">
              <div className="flex-shrink-0 text-starz-600 dark:text-starz-400">✓</div>
              <div>
                <strong>Increased Mining Rate</strong>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">The more mining power you have, the faster you'll earn STARZ tokens.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex-shrink-0 text-starz-600 dark:text-starz-400">✓</div>
              <div>
                <strong>Higher Daily Rewards</strong>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Increase your daily mining rewards proportionally to your mining power.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex-shrink-0 text-starz-600 dark:text-starz-400">✓</div>
              <div>
                <strong>Priority Processing</strong>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Higher mining power gives you priority in the mining queue.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BuyPower;
