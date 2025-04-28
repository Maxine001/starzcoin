
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Database, ChevronRight, Zap, Wallet, BarChart4, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileMenu from '@/components/MobileMenu';

const Index = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with navigation */}
        <header className="flex justify-between items-center mb-12 animate-fade-in">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-starz-400 to-starz-600 rounded-xl flex items-center justify-center shadow-md">
              <Database className="text-white" size={20} />
            </div>
            <div className="ml-3 text-2xl font-medium tracking-tight">
              STARZ
            </div>
          </div>
          
          <nav className="flex items-center gap-2 sm:gap-4">
            <div className="block sm:hidden">
              <MobileMenu />
            </div>
            <div className="hidden sm:flex items-center gap-2 sm:gap-4">
              <Link to="/login">
                <Button variant="ghost" className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300">
                  <LogIn size={18} />
                  <span className="hidden sm:inline">Log in</span>
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="flex items-center gap-1 bg-starz-600 hover:bg-starz-700 text-white">
                  <UserPlus size={18} />
                  <span className="hidden sm:inline">Sign up</span>
                </Button>
              </Link>
            </div>
          </nav>
        </header>
        
        <div className="flex flex-col items-center text-center">
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold max-w-3xl mb-6 animate-slide-up">
            Mine <span className="text-starz-600 dark:text-starz-400">STARZ</span> with unprecedented efficiency
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Experience next-generation cryptocurrency mining with our state-of-the-art platform. Monitor and manage your mining operations with elegance and precision.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link 
              to="/signup" 
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full bg-starz-600 text-white hover:bg-starz-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              Start Mining
              <ChevronRight className="ml-2" size={20} />
            </Link>
            <Link 
              to="/dashboard" 
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full bg-white dark:bg-zinc-800 text-starz-600 dark:text-starz-400 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 border border-zinc-200 dark:border-zinc-700"
            >
              View Demo
              <ChevronRight className="ml-2" size={20} />
            </Link>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 bg-starz-100 dark:bg-starz-900/30 rounded-full flex items-center justify-center mb-4 text-starz-600 dark:text-starz-400">
                <Database size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Continuous Mining</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Mine STARZ continuously with our highly optimized and energy-efficient algorithms.</p>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 bg-starz-100 dark:bg-starz-900/30 rounded-full flex items-center justify-center mb-4 text-starz-600 dark:text-starz-400">
                <Wallet size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Real-time Balance</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Track your STARZ balance in real-time and watch it grow as you mine.</p>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 bg-starz-100 dark:bg-starz-900/30 rounded-full flex items-center justify-center mb-4 text-starz-600 dark:text-starz-400">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Mining Power</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Monitor and adjust your mining power to maximize efficiency and returns.</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-16 w-full max-w-5xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="bg-gradient-to-br from-starz-500 to-starz-700 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-20 -translate-y-20 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full transform -translate-x-20 translate-y-20 blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <BarChart4 size={24} className="mr-2" />
                  <h3 className="text-xl font-medium">Platform Statistics</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                  <div>
                    <div className="text-white/70 text-sm mb-1">Total Miners</div>
                    <div className="text-3xl font-medium">14,523</div>
                  </div>
                  
                  <div>
                    <div className="text-white/70 text-sm mb-1">STARZ Mined</div>
                    <div className="text-3xl font-medium">512,384</div>
                  </div>
                  
                  <div>
                    <div className="text-white/70 text-sm mb-1">Network Hash Rate</div>
                    <div className="text-3xl font-medium">1.2 PH/s</div>
                  </div>
                  
                  <div>
                    <div className="text-white/70 text-sm mb-1">Avg. Reward</div>
                    <div className="text-3xl font-medium">3.8/day</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-24 text-center text-sm text-zinc-500 dark:text-zinc-400 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p>© 2023 STARZ Mining. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
