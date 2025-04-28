
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, ChevronLeft, LogOut, Wallet, Plus, Zap, Copy, Users, ArrowDownToLine, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import MiningAnimation from '@/components/MiningAnimation';
import BalanceCard from '@/components/BalanceCard';
import PowerCard from '@/components/PowerCard';
import ProfileSettings from '@/components/ProfileSettings';
import MobileDashboardMenu from '@/components/MobileDashboardMenu';
import { useAuth} from '@/hooks/use-auth';
import RecentActivities from '@/components/RecentActivities';
import { 
  getUserTransactions, 
  getUserBalance, 
  updateUserBalance, 
  recordDailyEarning,
  createTransaction,
  getTodayEarnings,
  getUserReferrals
} from '@/lib/appwrite';
// Add these imports at the top
import { initOfflineMining, syncOfflineEarnings, isOfflineMiningEnabled, toggleOfflineMining } from '@/lib/offlineMining';
import OfflineMiningNotification from '@/components/OfflineMiningNotification';

// Inside the Dashboard component, add this state







const generateMiningData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(now.getHours() - i);
    
    const baseRate = Math.random() * 400 + 100;
    
    data.push({
      time: time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      hashRate: Math.round(baseRate + (Math.random() * 50 - 25)),
      earnings: Number((Math.random() * 0.025 + 0.005).toFixed(4)),
      temperature: Math.round(Math.random() * 20 + 60)
    });
  }
  
  return data;
};

const Dashboard = () => {
  const { user, loading} = useAuth();
  const [miningData, setMiningData] = useState(generateMiningData());
  const [activeMinutes, setActiveMinutes] = useState(782);
  const [dailyEarned, setDailyEarned] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [miningBalance, setMiningBalance] = useState(0);
  const [referralBalance, setReferralBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [referrals, setReferrals] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  const [depositedBalance, setDepositedBalance] = useState<number>(0);
  const [offlineMiningEnabled, setOfflineMiningEnabled] = useState(isOfflineMiningEnabled());
  
  // Get user balance

  
  // Add this useEffect to initialize offline mining
  useEffect(() => {
    // Initialize offline mining when component mounts
    initOfflineMining();
    
    // Sync any pending offline earnings
    if (user && navigator.onLine) {
      syncOfflineEarnings();
    }
  }, [user]);


  // Add a function to toggle offline mining
  const handleToggleOfflineMining = () => {
    const newState = !offlineMiningEnabled;
    setOfflineMiningEnabled(newState);
    toggleOfflineMining(newState);
    
    toast({
      title: newState ? "Offline Mining Enabled" : "Offline Mining Disabled",
      description: newState 
        ? "You'll continue earning STARZ even when you're away." 
        : "You'll only earn STARZ while actively using the app.",
      variant: "default",
    });
  };
  
  useEffect(() => {
      setMounted(true);
      
      // Scroll to top on mount
      window.scrollTo(0, 0);
      
      // Generate a random referral code
      const userId = "user" + Math.floor(Math.random() * 10000);
      const baseUrl = window.location.origin;
      setReferralLink(`${baseUrl}/signup?ref=${userId}`);
    }, []);

    const copyReferralLink = () => {
        navigator.clipboard.writeText(referralLink)
          .then(() => {
            toast({
              title: "Link copied!",
              description: "Referral link copied to clipboard",
            });
          })
          .catch(err => {
            console.error('Failed to copy: ', err);
          });
      };

  
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setTransactionsLoading(true);
        try {
          const userTransactions = await getUserTransactions(user.$id);
          setTransactions(userTransactions);
          
          const userBalance = await getUserBalance(user.$id);
          setTotalBalance(userBalance.miningBalance + referralBalance || 0);
          setMiningBalance(userBalance.miningBalance || 0);
          setReferralBalance(userBalance.referralBalance || 0);
          
          
          const todayEarnings = await getTodayEarnings(user.$id);
          setDailyEarned(todayEarnings);
          
          const userReferrals = await getUserReferrals(user.$id);
          setReferrals(userReferrals);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setTransactionsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);


  useEffect(() => {
    const handleInitialEarnings = (event: CustomEvent<{ earnings: number }>) => {
      setDailyEarned(event.detail.earnings);
    };

    window.addEventListener('init-daily-earnings', handleInitialEarnings as EventListener);

    return () => {
      window.removeEventListener('init-daily-earnings', handleInitialEarnings as EventListener);
    };
  }, []);

  
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (user) {
        setMiningData(prevData => {
          const newData = [...prevData.slice(1)];
          
          const lastEntry = prevData[prevData.length - 1];
          const now = new Date();
          
          const newHashRate = Math.max(50, Math.round(lastEntry.hashRate + (Math.random() * 40 - 20)));
          
          // Calculate new earning but ensure it's reasonable
          const newEarning = Number((lastEntry.earnings * (newHashRate / lastEntry.hashRate) * (1 + Math.random() * 0.1 - 0.05)).toFixed(4));
  
          newData.push({
            time: now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            hashRate: newHashRate,
            earnings: newEarning,
            temperature: Math.round(lastEntry.temperature + (Math.random() * 4 - 2))
          });
          
          // Ensure the earning increase is within a reasonable range (prevent extreme values)
          const earnedIncrease = Math.min(Number((newEarning / 60).toFixed(4)), 5); // Cap at 5 STARZ per update
          setDailyEarned(prev => Number((prev + earnedIncrease).toFixed(4)));
          
          try {
            if (user) {
              (async () => {
                // Record daily earning with validated amount
                await recordDailyEarning(user.$id, earnedIncrease);
                
                const currentBalance = await getUserBalance(user.$id);
                
                // Ensure the balance update is within limits
                const newBalance = Math.min(
                  Number((currentBalance.balance + earnedIncrease).toFixed(4)),
                  6000 // Maximum allowed value
                );
                
                await updateUserBalance(
                  user.$id, 
                  newBalance,
                  earnedIncrease,
                  0
                );
                
                // Ensure transaction amount is within limits
                /*
                await createTransaction(
                  
                  earnedIncrease,
                  'STARZ',
                  'completed',
                  'mining'
                );*/
                
                setTotalBalance(prev => Number((Math.min(prev + earnedIncrease, 6000)).toFixed(4))); //check code for total balnace
                setMiningBalance(prev => Number((Math.min(prev + earnedIncrease, 6000)).toFixed(4))); // check code for set miningbalance
              })();
            }
          } catch (error) {
            console.error("Error updating mining earnings:", error);
          }
          
          setActiveMinutes(prev => prev + 1);
          
          return newData;
        });
      }
    }, 1000);
  
    return () => clearInterval(intervalId);
  }, [user]);
  
  
  
  

const miningPower = 625;

const currentHashRate = miningData[miningData.length - 1]?.hashRate || 0;

const currentEarningsPerHour = miningData.slice(-4).reduce(
  (sum, entry) => sum + entry.earnings, 0
);

const efficiency = ((currentHashRate / miningPower) * 100).toFixed(2) + '%';


  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-starz-300 border-t-transparent"></div>
      </div>
    );
  }

  

  return (
    
    <div className={`min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <OfflineMiningNotification />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center">
            
            <h1 className="text-2xl font-medium tracking-tight">Welcome {user.name}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/buy-power">
                <Button variant="outline" className="flex items-center gap-2 border-starz-600/20 text-starz-600 dark:border-starz-500/20 dark:text-starz-400 hover:bg-starz-50 dark:hover:bg-starz-950/20">
                  <Zap size={16} />
                  <span>Buy Mining Power</span>
                </Button>
              </Link>
              <Link to="/deposit">
                <Button variant="outline" className="flex items-center gap-2 border-starz-600/20 text-starz-600 dark:border-starz-500/20 dark:text-starz-400 hover:bg-starz-50 dark:hover:bg-starz-950/20">
                  <Wallet size={16} />
                  <span>Deposit</span>
                  <Plus size={14} />
                </Button>
              </Link>
              <Link to="/withdrawal">
                <Button variant="outline" className="flex items-center gap-2 border-starz-600/20 text-starz-600 dark:border-starz-500/20 dark:text-starz-400 hover:bg-starz-50 dark:hover:bg-starz-950/20">
                  <ArrowDownToLine size={16} />
                  <span>Withdrawal</span>
                </Button>
              </Link>
              <ProfileSettings />
              <button className="p-2 rounded-full text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/70 transition-colors">
                <Settings size={20} />
              </button>
              <Link to="/login" className="p-2 rounded-full text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/70 transition-colors">
                <LogOut size={20} />
              </Link>
            </div>
            <MobileDashboardMenu />
          </div>
        </header>
        
        {/* Stats overview */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-gradient-to-br from-starz-500 to-starz-700 rounded-2xl p-6 shadow-lg text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-20 -translate-y-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full transform -translate-x-20 translate-y-20 blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-sm font-medium text-white/70 mb-1">Welcome </h2>
              <h3 className="text-2xl font-medium mb-4">Your STARZ Mining Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
                  <div className="text-white/70 text-sm mb-1">Daily Earnings</div>
                  <div className="text-2xl font-medium">{dailyEarned} STARZ</div>
                  <div className="text-white/70 text-xs mt-1">≈ $7.61 USD</div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
                  <div className="text-white/70 text-sm mb-1">Efficiency</div>
                  <div className="text-2xl font-medium">{efficiency}</div>
                  <div className="text-white/70 text-xs mt-1">+2.3% from yesterday</div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
                  <div className="text-white/70 text-sm mb-1">Uptime</div>
                  <div className="text-2xl font-medium">23.8 hrs</div>
                  <div className="text-white/70 text-xs mt-1">99.2% reliability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mining stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <MiningAnimation />
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <BalanceCard  balance={totalBalance}
                          miningBalance={miningBalance}
                          referralBalance={referralBalance} 
                        />
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <PowerCard />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
  <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Zap className="text-starz-600 dark:text-starz-400 mr-2" size={20} />
        <h2 className="text-lg font-medium">Offline Mining</h2>
      </div>
      <div className="flex items-center">
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={offlineMiningEnabled}
            onChange={handleToggleOfflineMining}
          />
          <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-starz-300 dark:peer-focus:ring-starz-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-starz-600"></div>
          <span className="ml-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {offlineMiningEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>
    </div>
    
    <p className="text-zinc-600 dark:text-zinc-400 mb-4">
      Continue earning STARZ even when you're not actively using the app. Your earnings will be synchronized when you return.
    </p>
    
    <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
      <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Offline Mining Rate</div>
      <div className="text-xl font-medium text-starz-600 dark:text-starz-400">2.4 STARZ / hour</div>
      <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Maximum 8 hours of offline mining per session</div>
    </div>
  </div>
</div>
        </div>
        
        {/* Referral section */}
        <div className="mt-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Users className="text-starz-600 dark:text-starz-400 mr-2" size={20} />
              <h2 className="text-lg font-medium">Referral Program</h2>
            </div>
            
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Share your referral link and earn 10% of the mining power purchased by users you invite.
            </p>
            
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex-1 bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg text-sm truncate">
                {referralLink}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2" 
                onClick={copyReferralLink}
              >
                <Copy size={16} />
                <span>Copy</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Total Referrals</div>
                <div className="text-2xl font-medium">{referrals}</div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Total Earned</div>
                <div className="text-2xl font-medium text-starz-600 dark:text-starz-400">{referralBalance} STARZ</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent activity */}
        <div>
          <RecentActivities
            transactions={transactions}
            isLoading={transactionsLoading}
          />
        </div>
        
        {/* Footer */}
        <footer className="mt-12 pb-8 text-center text-sm text-zinc-500 dark:text-zinc-400 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p>© 2023 STARZ Mining. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
};


export default Dashboard;
