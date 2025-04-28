// BitPay integration utilities
import { toast } from "@/hooks/use-toast";
import { createTransaction, updateUserBalance, getUserBalance } from "@/lib/appwrite";

// BitPay checkout redirect URL - in production this would point to the BitPay API
const BITPAY_CHECKOUT_URL = "https://test.bitpay.com/checkout";

// Mock exchange rate for demo purposes
const STARZ_TO_USD_RATE = 2; // 1 STARZ = $30 USD

interface BitPayInvoiceParams {
  price: number;
  currency: string;
  orderId: string;
  userId: string;
  redirectURL: string;
  posData?: string;
}

/**
 * Create a BitPay invoice and redirect to the payment page
 */
export const createBitPayInvoice = async (params: BitPayInvoiceParams) => {
  try {
    // In a real implementation, this would make an API call to BitPay
    // For demo purposes, we'll create a mock invoice URL
    
    // Create a pending transaction in our database
    await createTransaction(
      params.userId,
      params.price / STARZ_TO_USD_RATE, // Convert USD to STARZ
      'STARZ',
      'pending',
      'deposit',
      `bp-${Date.now()}`
    );
    
    // Construct the URL with query parameters
    const queryParams = new URLSearchParams({
      price: params.price.toString(),
      currency: params.currency,
      orderId: params.orderId,
      redirectURL: params.redirectURL,
      posData: params.posData || JSON.stringify({ userId: params.userId }),
    });
    
    // This would redirect to BitPay in a real implementation
    const invoiceUrl = `${BITPAY_CHECKOUT_URL}?${queryParams.toString()}`;
    
    return invoiceUrl;
  } catch (error) {
    console.error('Error creating BitPay invoice:', error);
    toast({
      title: "Payment Error",
      description: "There was an error creating your payment invoice.",
      variant: "destructive"
    });
    throw error;
  }
};

/**
 * Process a BitPay webhook or payment confirmation
 * In a real implementation, this would verify the payment with BitPay's API
 */
export const processBitPayPayment = async (
  userId: string, 
  amountUSD: number, 
  txId: string
) => {
  try {
    // Convert USD amount to STARZ
    const amountSTARZ = amountUSD / STARZ_TO_USD_RATE;
    
    // Update the transaction status
    await createTransaction(
      userId,
      amountSTARZ,
      'STARZ',
      'completed',
      'deposit',
      txId
    );
    
    // Get current balance
    const userBalance = await getUserBalance(userId);
    
    // Update with new deposit
    const updatedBalance = await updateUserBalance(userId, userBalance.balance + amountSTARZ);
    
    return {
      success: true,
      amount: amountSTARZ,
      balance: updatedBalance.balance
    };
  } catch (error) {
    console.error('Error processing BitPay payment:', error);
    throw error;
  }
};

// For demonstration purposes only - this simulates a successful BitPay payment
export const simulateSuccessfulPayment = async (userId: string, amountUSD: number) => {
  try {
    const txId = `bp-${Date.now()}`;
    const result = await processBitPayPayment(userId, amountUSD, txId);
    
    toast({
      title: "Deposit Successful",
      description: `${result.amount.toFixed(2)} STARZ have been added to your account.`
    });
    
    return result;
  } catch (error) {
    console.error('Error simulating payment:', error);
    toast({
      title: "Payment Error",
      description: "There was an error processing your payment.",
      variant: "destructive"
    });
    throw error;
  }
};
