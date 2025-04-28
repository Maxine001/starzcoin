
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Copy, QrCode, Bitcoin, CreditCard, Wallet } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/use-auth';
import { createBitPayInvoice, simulateSuccessfulPayment } from '@/lib/bitpay';
import { getUserTransactions, getUserBalance } from '@/lib/appwrite';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const Deposit = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [network, setNetwork] = useState('starz');
  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showSimulator, setShowSimulator] = useState(false);
  const [depositedBalance, setDepositedBalance] = useState<number>(0);
  
  // Fetch user balance and transactions on component mount
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);
  
  const fetchUserData = async () => {
    try {
      if (!user) return;
      
      // Get user balance
      const userBalance = await getUserBalance(user.userId);
      setBalance(userBalance.balance || 0);
      
      // Get user transactions
      const userTransactions = await getUserTransactions(user.userId);
      setTransactions(userTransactions);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };
  
  // Handle deposit with BitPay
  const handleBitPayDeposit = async () => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to make a deposit.",
        variant: "destructive"
      });
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const amountUSD = parseFloat(amount) * 30; // 1 STARZ = $30 USD
      
      const invoiceUrl = await createBitPayInvoice({
        price: amountUSD,
        currency: 'USD',
        orderId: `order-${Date.now()}`,
        userId: user.userId,
        redirectURL: window.location.href,
      });
      
      // In a real implementation, this would redirect to BitPay
      // For demo purposes, we'll show a success message and refresh data
      toast({
        title: "BitPay Checkout",
        description: "You would be redirected to BitPay to complete your deposit. For demo purposes, use the simulator below.",
      });
      
      setShowSimulator(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        title: "Deposit Error",
        description: "An error occurred while processing your deposit.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  // Simulate a successful BitPay payment (for demo purposes)
  const handleSimulatePayment = async () => {
    if (!user || !amount) return;
    
    setIsLoading(true);
    try {
      await simulateSuccessfulPayment(user.userId, parseFloat(amount) * 30);
      setAmount('');
      setShowSimulator(false);
      await fetchUserData();
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Mock deposit addresses for different networks (would be replaced by real addresses in production)
  const depositAddresses = {
    starz: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
    eth: '0x7ec8e91F32B41A9deCaB07B4ABF2E5594660D291',
    bsc: '0x9D81F1E6213aCa56C30933f221612C8a813FFc95',
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };
  
  const currentAddress = depositAddresses[network as keyof typeof depositAddresses];
  
  return (
      <div className="space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-starz-80 border-starz-100">
              <CardHeader>
                <CardTitle>Deposit Methods</CardTitle>
                <CardDescription>Choose how you want to deposit funds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Payment Method Selection */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <Button 
                      variant={paymentMethod === 'crypto' ? 'default' : 'outline'} 
                      className={`flex items-center space-x-2 flex-1 ${paymentMethod === 'crypto' ? 'mining-gradient' : 'bg-starz-100 border-starz-600'}`}
                      onClick={() => setPaymentMethod('crypto')}
                    >
                      <Bitcoin size={18} />
                      <span>Cryptocurrency</span>
                    </Button>
                    <Button 
                      variant={paymentMethod === 'bitpay' ? 'default' : 'outline'} 
                      className={`flex items-center space-x-2 flex-1 ${paymentMethod === 'bitpay' ? '' : 'bg-starz-700 border-starz-600'}`}
                      onClick={() => setPaymentMethod('bitpay')}
                    >
                      <CreditCard size={18} />
                      <span>BitPay</span>
                    </Button>
                  </div>
                  
                  {/* BitPay Checkout Form */}
                  {paymentMethod === 'bitpay' && (
                    <div className="space-y-4 p-4 rounded-md bg-starz-700/30">
                      <div className="flex items-center space-x-2 mb-4">
                        <CreditCard className="text-mining-blue" size={24} />
                        <h3 className="text-lg font-medium">BitPay Checkout</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (STARZ)</Label>
                          <div className="flex space-x-2">
                            <Input 
                              id="amount"
                              type="number"
                              placeholder="0.00"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="bg-starz-700 border-starz-600 text-white"
                            />
                            <Button
                              variant="outline"
                              className="bg-starz-700 border-starz-600"
                              onClick={() => setAmount('1.00')}
                            >
                              1.00
                            </Button>
                            <Button
                              variant="outline"
                              className="bg-starz-700 border-starz-600"
                              onClick={() => setAmount('5.00')}
                            >
                              5.00
                            </Button>
                          </div>
                          {amount && (
                            <div className="text-sm text-gray-400">
                              ≈ ${(parseFloat(amount) * 30).toFixed(2)} USD
                            </div>
                          )}
                        </div>
                        
                        <Button
                          onClick={handleBitPayDeposit}
                          className="w-full mining-gradient"
                          disabled={isLoading || !amount}
                        >
                          {isLoading ? 'Processing...' : 'Deposit with BitPay'}
                        </Button>
                        
                        {showSimulator && (
                          <div className="mt-4 p-3 border border-mining-blue/30 rounded-md bg-mining-blue/10">
                            <h4 className="font-medium mb-2">Demo Mode: Simulate Payment</h4>
                            <p className="text-sm text-gray-400 mb-2">In a real implementation, you would be redirected to BitPay. For demonstration purposes, click below to simulate a successful payment.</p>
                            <Button
                              onClick={handleSimulatePayment}
                              className="w-full bg-mining-green hover:bg-mining-green/80"
                              disabled={isLoading}
                            >
                              {isLoading ? 'Processing...' : 'Simulate Successful Payment'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Crypto Deposit */}
                  {paymentMethod === 'crypto' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Select Network</div>
                        <Select defaultValue={network} onValueChange={setNetwork}>
                          <SelectTrigger className="bg-2563eb border-starz-600 text-white">
                            <SelectValue placeholder="Select Network" />
                          </SelectTrigger>
                          <SelectContent className="bg-starz-500 border-starz-700 text-white">
                            <SelectItem value="starz">STARZ Network</SelectItem>
                            <SelectItem value="eth">Ethereum (ERC-20)</SelectItem>
                            <SelectItem value="bsc">BSC (BEP-20)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Your {network.toUpperCase()} Deposit Address</div>
                        <div className="bg-white border border-starz-600 rounded-md p-3 flex items-center justify-between">
                          <div className="text-sm font-mono break-all">
                            {currentAddress}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => copyToClipboard(currentAddress)}
                            className="hover:bg-starz-600/50"
                          >
                            <Copy size={16} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                        <div className="bg-white p-4 rounded-md">
                          <QrCode size={160} className="text-starz-900" />
                        </div>
                        
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Important Instructions</div>
                            <ul className="text-sm text-gray-400 space-y-2">
                              <li>• Send only STARZ to this address</li>
                              <li>• Make sure you're using the correct network</li>
                              <li>• Minimum deposit: 0.01 STARZ</li>
                              <li>• Deposits usually confirm within 10-30 minutes</li>
                            </ul>
                          </div>
                          
                          <Button 
                            onClick={() => copyToClipboard(currentAddress)} 
                            className="w-full mining-gradient hover:opacity-90"
                          >
                            Copy Address
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-amber-400/10 border border-amber-400/20 rounded-md p-3 text-sm text-amber-400">
                    <p className="font-medium mb-1">Warning:</p>
                    <p>Sending any other cryptocurrency to this address may result in permanent loss of funds.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-starz-30 ">
              <CardHeader>
                <CardTitle>Deposit History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-starz-700 ">
                      <TableHead className="text-gray-400">Amount</TableHead>
                      <TableHead className="text-gray-400">Transaction ID</TableHead>
                      <TableHead className="text-gray-400">Date</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length > 0 ? (
                      transactions.map((transaction) => (
                        <TableRow key={transaction.$id} className="border-starz-700/50 hover:bg-starz-700/20">
                          <TableCell>
                            {transaction.amount} STARZ
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {transaction.txId.substring(0, 6)}...{transaction.txId.substring(transaction.txId.length - 4)}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {formatDate(transaction.timestamp)}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              transaction.status === 'completed' 
                                ? 'bg-grey-900/30 text-green-400' 
                                : transaction.status === 'pending'
                                ? 'bg-amber-300/30 text-black-400'
                                : 'bg-amber-300/30 text-red-400'
                            }`}>
                              {transaction.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-gray-400">
                          No deposit history found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-starz-50 border-starz-400">
              <CardHeader>
                <CardTitle>Current Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{balance.toFixed(2)} STARZ</div>
                <div className="text-gray-400 text-sm mt-1">≈ ${(balance * 30).toFixed(2)} USD</div>
                
                <div className="mt-6 space-y-2">
                  <Button 
                    onClick={() => window.location.href = '/buy-power'}
                    className="w-full mining-gradient hover:opacity-90"
                  >
                    <Wallet size={16} className="mr-2" />
                    Purchase Mining Power
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-starz-50 border-starz-400">
              <CardHeader>
                <CardTitle>Deposit Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <div className="font-medium mb-1">Confirmation Time</div>
                  <div className="text-gray-400">Typically 10-30 minutes</div>
                </div>
                
                <div>
                  <div className="font-medium mb-1">Minimum Deposit</div>
                  <div className="text-gray-400">0.01 STARZ</div>
                </div>
                
                <div>
                  <div className="font-medium mb-1">Deposit Fee</div>
                  <div className="text-gray-400">No fee for deposits</div>
                </div>
                
                <div>
                  <div className="font-medium mb-1">Exchange Rates</div>
                  <div className="text-gray-400">1 STARZ ≈ $30.00 USD</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default Deposit;