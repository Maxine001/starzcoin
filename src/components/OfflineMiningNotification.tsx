import React, { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { checkOfflineEarnings, syncOfflineEarnings } from '@/lib/offlineMining';

const OfflineMiningNotification: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleOfflineEarnings = async () => {
      if (isProcessing) return;
      
      setIsProcessing(true);
      
      try {
        // Check for offline earnings
        const earnings = checkOfflineEarnings();
        
        if (earnings > 0) {
          // Show notification to user
          toast({
            title: "Offline Mining Rewards",
            description: `You earned ${earnings.toFixed(4)} STARZ while you were away!`,
            variant: "default",
            duration: 5000,
          });
          
          // Sync with server if online
          if (navigator.onLine) {
            await syncOfflineEarnings();
          }
        }
      } catch (error) {
        console.error('Error processing offline earnings:', error);
      } finally {
        setIsProcessing(false);
      }
    };
    
    // Process offline earnings when component mounts
    handleOfflineEarnings();
    
    // Also process when coming back online
    const handleOnline = () => {
      handleOfflineEarnings();
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default OfflineMiningNotification;
