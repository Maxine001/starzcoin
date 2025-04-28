
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Settings, LogOut, Wallet, Zap, User, ArrowDownToLine } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfileSettings from './ProfileSettings';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const handleProfileClick = () => {
    setIsOpen(false);
    setShowProfile(true);
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <button className="p-2 rounded-full text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/70 transition-colors md:hidden">
            <Menu size={20} />
          </button>
        </DrawerTrigger>
        <DrawerContent className="p-4">
          <DrawerHeader className="p-0 mb-4">
            <DrawerTitle>Menu</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col space-y-2">
            <Link 
              to="/buy-power" 
              onClick={() => setIsOpen(false)} 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Zap size={20} className="text-starz-500" />
              <span>Buy Mining Power</span>
            </Link>
            <Link 
              to="/deposit" 
              onClick={() => setIsOpen(false)} 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Wallet size={20} className="text-starz-500" />
              <span>Deposit</span>
            </Link>
            <Link 
              to="/withdrawal" 
              onClick={() => setIsOpen(false)} 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowDownToLine size={20} className="text-starz-500" />
              <span>Withdrawal</span>
            </Link>
            <button 
              onClick={handleProfileClick} 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
            >
              <User size={20} className="text-starz-500" />
              <span>Profile</span>
            </button>
            <button 
              onClick={() => setIsOpen(false)} 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
            >
              <Settings size={20} className="text-starz-500" />
              <span>Settings</span>
            </button>
            <div className="pt-2 mt-2 border-t border-zinc-200 dark:border-zinc-700">
              <Link 
                to="/login"
                className="flex items-center gap-3 p-3 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      
      {/* This will be shown when the profile button is clicked */}
      {showProfile && (
        <ProfileSettings open={showProfile} onOpenChange={setShowProfile} />
      )}
    </>
  );
};

export default MobileMenu;
