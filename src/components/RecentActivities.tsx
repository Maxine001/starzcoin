
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, ArrowDownToLine, ArrowUpFromLine, Clock, Award, Zap } from 'lucide-react';

interface Transaction {
  $id: string;
  amount: number;
  timestamp: string;
  status: string;
  type: string;
}

interface RecentActivitiesProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ transactions, isLoading }) => {
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownToLine size={16} className="text-green-400" />;
      case 'withdraw':
        return <ArrowUpFromLine size={16} className="text-red-400" />;
      case 'mining':
        return <Zap size={16} className="text-mining-yellow" />;
      case 'referral':
        return <Award size={16} className="text-mining-blue" />;
      default:
        return <Activity size={16} className="text-mining-yellow" />;
    }
  };



  return (
    <Card className="bg-white border-starz-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5 text-mining-yellow" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-starz-300 border-t-transparent"></div>
          </div>
        ) : transactions.length > 0 ? (
          <div className="divide-y divide-starz-700">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.$id} className="flex items-center p-4 hover:bg-starz-700/20">
                <div className="h-8 w-8 rounded-full bg-starz-700 flex items-center justify-center mr-3">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="font-medium">
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </div>
                    <div className={transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'}>
                      {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount} STARZ
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-400">
                      {formatDate(transaction.timestamp)}
                    </div>
                    <div className={`text-xs px-2 py-0.5 rounded-full ${
                      transaction.status === 'completed' 
                        ? 'bg-grey-900/30 text-green-400' 
                        : transaction.status === 'pending'
                        ? 'bg-grey-900/30 text-red-400'
                        : 'bg-grey-900/30 text-red-400'
                    }`}>
                      {transaction.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No recent activities found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivities;