
import { Wallet as WalletIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WalletDisplayProps {
  coinType: string;
  walletAddress: string;
}

const WalletDisplay = ({ coinType, walletAddress }: WalletDisplayProps) => {
  return (
    <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center space-x-2">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          "bg-starz-100 text-starz-600 dark:bg-starz-900/30 dark:text-starz-400"
        )}>
          <WalletIcon size={20} />
        </div>
        <div>
          <h4 className="font-medium">Wallet Connected</h4>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {coinType} • {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletDisplay;
