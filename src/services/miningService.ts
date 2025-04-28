
import { databases, APPWRITE_CONFIG} from '../lib/appwrite';
import { ID, Query } from 'appwrite';

const MINING_HISTORY_COLLECTION_ID = 'YOUR_MINING_HISTORY_COLLECTION_ID'; // Replace with your collection ID

export interface MiningActivity {
  id: string;
  userId: string;
  event: string;
  amount: number;
  status: string;
  timestamp: Date;
}

export const miningService = {
  // Get recent mining activities for a user
  getRecentActivities: async (userId: string, limit: number = 10): Promise<MiningActivity[]> => {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        MINING_HISTORY_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('timestamp'),
          Query.limit(limit)
        ]
      );
      return response.documents as unknown as MiningActivity[];
    } catch (error) {
      console.error('Error fetching mining activities:', error);
      throw error;
    }
  },

  // Get mining power chart data
  getPowerChartData: async (userId: string): Promise<{time: string, value: number}[]> => {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        'power_metrics', // Assuming a collection for power metrics
        [
          Query.equal('userId', userId),
          Query.orderAsc('timestamp'),
          Query.limit(24) // Last 24 hours of data
        ]
      );
      
      return response.documents.map(doc => ({
        time: new Date(doc.timestamp).getHours() + ':00',
        value: doc.powerValue
      }));
    } catch (error) {
      console.error('Error fetching power chart data:', error);
      // Return mock data as fallback
      return generateChartData();
    }
  }
};

// Generate sample data for the chart (fallback)
const generateChartData = () => {
  const data = [];
  let value = 100;
  
  for (let i = 0; i < 24; i++) {
    const change = Math.random() * 10 - 5;
    value = Math.max(80, Math.min(140, value + change));
    
    data.push({
      time: `${i}:00`,
      value: parseFloat(value.toFixed(1))
    });
  }
  
  return data;
};
