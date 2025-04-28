import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ChevronRight } from 'lucide-react';
import { createBitPayInvoice, simulateSuccessfulPayment } from '../lib/bitpay';
import { useAuth } from '@/hooks/use-auth';

interface BitPayPurchaseButtonProps {
  planId: string;
  planName: string;
  planPrice: string;
  onSuccess?: () => void;
}

const BitPayPurchaseButton: React.FC<BitPayPurchaseButtonProps> = ({
  planId,
  planName,
  planPrice,
  onSuccess
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Extract the numeric part of the price
  const priceValue = parseFloat(planPrice.split(' ')[0]);
  
  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to purchase mining power",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert STARZ to USD for BitPay
      const amountUSD = priceValue * 1; // 1 STARZ = $30 USD
      
      const invoiceUrl = await createBitPayInvoice({
        price: amountUSD,
        currency: 'USD',
        orderId: `plan-${planId}-${Date.now()}`,
        userId: user.userId,
        redirectURL: window.location.href,
        posData: JSON.stringify({
          planId,
          planName,
          userId: user.userId
        })
      });
      
      // In a real implementation, this would redirect to BitPay
      // For demo purposes, we'll show a success message
      toast({
        title: "BitPay Checkout",
        description: "In a real implementation, you would be redirected to BitPay. Simulating successful payment...",
      });
      
      // Simulate successful payment for demo purposes
      setTimeout(async () => {
        await simulateSuccessfulPayment(user.userId, amountUSD);
        setIsSubmitting(false);
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Error",
        description: "An error occurred while processing your purchase",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };
  
  return (
    <Button 
      onClick={handlePurchase}
      className="mining-gradient hover:opacity-90 min-w-[200px]"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </div>
      ) : (
        <div className="flex items-center">
          Purchase with BitPay <ChevronRight size={16} className="ml-2" />
        </div>
      )}
    </Button>
  );
};

export default BitPayPurchaseButton;