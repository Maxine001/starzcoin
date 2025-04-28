
import { useState } from 'react';
import { User } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';
import ProfileForm, { ProfileFormValues } from './profile/ProfileForm';
import WalletDisplay from './profile/WalletDisplay';

interface ProfileSettingsProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ProfileSettings = ({ open: externalOpen, onOpenChange: externalOnOpenChange }: ProfileSettingsProps = {}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Use external state management if provided, otherwise use internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = externalOnOpenChange || setInternalOpen;
  
  // Mock user data - in a real app, this would come from your auth system
  const defaultValues: ProfileFormValues = {
    email: 'john.doe@example.com',
    walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    coinType: 'ETH'
  };
  
  const onSubmit = (data: ProfileFormValues) => {
    // Here you would typically send this data to your backend
    console.log('Form submitted:', data);
    
    toast({
      title: 'Profile updated',
      description: 'Your profile information has been saved.',
    });
    
    setIsOpen(false);
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* Only render trigger if onOpenChange wasn't provided externally */}
      {!externalOnOpenChange && (
        <SheetTrigger asChild>
          <button className="p-2 rounded-full text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/70 transition-colors">
            <User size={20} />
          </button>
        </SheetTrigger>
      )}
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Profile Settings</SheetTitle>
          <SheetDescription>
            Update your personal information and wallet details
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6">
          <ProfileForm 
            defaultValues={defaultValues} 
            onSubmit={onSubmit} 
            onClose={() => setIsOpen(false)} 
          />
        </div>
        
        <WalletDisplay 
          coinType={defaultValues.coinType}
          walletAddress={defaultValues.walletAddress}
        />
      </SheetContent>
    </Sheet>
  );
};

export default ProfileSettings;
