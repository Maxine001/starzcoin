
import { databases, appwriteConfig } from '../lib/appwrite';
import { ID, Query } from 'node-appwrite';

const USER_COLLECTION_ID = 'YOUR_USER_COLLECTION_ID'; // Replace with your collection ID

export interface UserData {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  coinType: string;
  balance: number;
  referralBalance: number;
  miningPower: number;
}

export const userService = {
  // Get user by ID
  getUserById: async (userId: string): Promise<UserData> => {
    try {
      const response = await databases.getDocument(
        appwriteConfig.databaseId,
        USER_COLLECTION_ID,
        userId
      );
      return response as unknown as UserData;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userId: string, data: Partial<UserData>): Promise<UserData> => {
    try {
      const response = await databases.updateDocument(
        appwriteConfig.databaseId,
        USER_COLLECTION_ID,
        userId,
        data
      );
      return response as unknown as UserData;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Get user balance
  getUserBalance: async (userId: string): Promise<{ balance: number, referralBalance: number }> => {
    try {
      const user = await databases.getDocument(
        appwriteConfig.databaseId,
        USER_COLLECTION_ID,
        userId
      );
      return {
        balance: user.balance || 0,
        referralBalance: user.referralBalance || 0
      };
    } catch (error) {
      console.error('Error fetching user balance:', error);
      throw error;
    }
  },

  // Get user mining power
  getUserMiningPower: async (userId: string): Promise<number> => {
    try {
      const user = await databases.getDocument(
        appwriteConfig.databaseId,
        USER_COLLECTION_ID,
        userId
      );
      return user.miningPower || 0;
    } catch (error) {
      console.error('Error fetching mining power:', error);
      throw error;
    }
  }
};
