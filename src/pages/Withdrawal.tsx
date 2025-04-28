
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Wallet, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfileSettings from '@/components/ProfileSettings';

const Withdrawal = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [miningAmount, setMiningAmount] = useState('');
  const [referralAmount, setReferralAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const isMobile = useIsMobile();

  // Mock balances - in a real app, these would come from your backend
  const miningBalance = 1.45;
  const referralBalance = 0.32;
  
  // Mock user withdrawal address - in a real app, this would come from your user profile
  const walletAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
  const coinType = 'ETH';

  const handleMiningWithdrawal = () => {
    if (!miningAmount || parseFloat(miningAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to withdraw",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(miningAmount) > miningBalance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough mining balance",
        variant: "destructive"
      });
      return;
    }

    if (!walletAddress) {
      toast({
        title: "Missing wallet address",
        description: "Please update your profile with a valid wallet address",
        variant: "destructive"
      });
      setIsSettingsOpen(true);
      return;
    }

    setProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setProcessing(false);
      toast({
        title: "Withdrawal requested",
        description: `${miningAmount} STARZ will be sent to your wallet`,
      });
      setMiningAmount('');
    }, 1500);
  };

  const handleReferralWithdrawal = () => {
    if (!referralAmount || parseFloat(referralAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to withdraw",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(referralAmount) > referralBalance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough referral balance",
        variant: "destructive"
      });
      return;
    }

    if (!walletAddress) {
      toast({
        title: "Missing wallet address",
        description: "Please update your profile with a valid wallet address",
        variant: "destructive"
      });
      setIsSettingsOpen(true);
      return;
    }

    setProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setProcessing(false);
      toast({
        title: "Withdrawal requested",
        description: `${referralAmount} STARZ from referrals will be sent to your wallet`,
      });
      setReferralAmount('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 pb-12">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="py-6 md:pt-12 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link 
              to="/dashboard" 
              className="mr-2 rounded-full p-2 text-zinc-500 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:bg-zinc-800/70"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">Withdraw Funds</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Withdrawal Address Section */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-700">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">Withdrawal Address</h2>
            
            {walletAddress ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Your {coinType} address</p>
                    <p className="font-mono text-sm break-all mt-1">
                      {walletAddress}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsSettingsOpen(true)}
                    className="shrink-0 ml-2"
                  >
                    Change
                  </Button>
                </div>
                <div className="flex items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 mr-2 shrink-0" />
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Make sure this is the correct address. Withdrawals to incorrect addresses cannot be recovered.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <Wallet size={40} className="text-zinc-400" />
                <div className="text-center">
                  <p className="text-zinc-600 dark:text-zinc-300">No wallet address configured</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Update your profile to add a withdrawal address
                  </p>
                </div>
                <Button onClick={() => setIsSettingsOpen(true)}>
                  Update Profile
                </Button>
              </div>
            )}
          </div>

          {/* Mining Balance Withdrawal */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-700">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">Mining Balance</h2>
            <div className="mb-6">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Available balance</p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white">{miningBalance.toFixed(2)} <span className="text-zinc-500 dark:text-zinc-400 text-xl">STARZ</span></p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="mining-amount" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Amount to withdraw
                </label>
                <div className="flex">
                  <Input
                    id="mining-amount"
                    type="number"
                    placeholder="0.00"
                    value={miningAmount}
                    onChange={(e) => setMiningAmount(e.target.value)}
                    className="rounded-r-none"
                  />
                  <div className="flex items-center justify-center px-4 bg-zinc-100 dark:bg-zinc-700 border border-l-0 border-input rounded-r-md">
                    <span className="text-sm font-medium">STARZ</span>
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Min: 0.1 STARZ</p>
                  <button
                    type="button"
                    className="text-xs text-starz-600 dark:text-starz-400"
                    onClick={() => setMiningAmount(miningBalance.toString())}
                  >
                    Max
                  </button>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleMiningWithdrawal}
                disabled={processing || !miningAmount || parseFloat(miningAmount) <= 0 || parseFloat(miningAmount) > miningBalance}
              >
                {processing ? 'Processing...' : 'Withdraw Mining Balance'}
              </Button>
            </div>
          </div>

          {/* Referral Balance Withdrawal */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-700 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">Referral Bonus Balance</h2>
            <div className="mb-6">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Available referral bonus</p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white">{referralBalance.toFixed(2)} <span className="text-zinc-500 dark:text-zinc-400 text-xl">STARZ</span></p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="referral-amount" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Amount to withdraw
                </label>
                <div className="flex">
                  <Input
                    id="referral-amount"
                    type="number"
                    placeholder="0.00"
                    value={referralAmount}
                    onChange={(e) => setReferralAmount(e.target.value)}
                    className="rounded-r-none"
                  />
                  <div className="flex items-center justify-center px-4 bg-zinc-100 dark:bg-zinc-700 border border-l-0 border-input rounded-r-md">
                    <span className="text-sm font-medium">STARZ</span>
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Min: 0.1 STARZ</p>
                  <button
                    type="button"
                    className="text-xs text-starz-600 dark:text-starz-400"
                    onClick={() => setReferralAmount(referralBalance.toString())}
                  >
                    Max
                  </button>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleReferralWithdrawal}
                disabled={processing || !referralAmount || parseFloat(referralAmount) <= 0 || parseFloat(referralAmount) > referralBalance}
              >
                {processing ? 'Processing...' : 'Withdraw Referral Bonus'}
              </Button>
            </div>
          </div>

          {/* Recent Withdrawals Section */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-700 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">Recent Withdrawals</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                    <th className={`text-left py-3 px-4 text-xs font-medium text-zinc-500 dark:text-zinc-400 ${isMobile ? 'hidden' : ''}`}>Date</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">Type</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className={`py-3 px-4 text-sm ${isMobile ? 'hidden' : ''}`}>2023-08-15</td>
                    <td className="py-3 px-4 text-sm">Mining</td>
                    <td className="py-3 px-4 text-sm">0.5 STARZ</td>
                    <td className="py-3 px-4"><span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Completed</span></td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className={`py-3 px-4 text-sm ${isMobile ? 'hidden' : ''}`}>2023-08-01</td>
                    <td className="py-3 px-4 text-sm">Referral</td>
                    <td className="py-3 px-4 text-sm">0.25 STARZ</td>
                    <td className="py-3 px-4"><span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Completed</span></td>
                  </tr>
                  <tr>
                    <td className={`py-3 px-4 text-sm ${isMobile ? 'hidden' : ''}`}>2023-07-20</td>
                    <td className="py-3 px-4 text-sm">Mining</td>
                    <td className="py-3 px-4 text-sm">1.0 STARZ</td>
                    <td className="py-3 px-4"><span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Processing</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Settings Sheet */}
      <ProfileSettings open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  );
};

export default Withdrawal;
