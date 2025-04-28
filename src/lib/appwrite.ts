
import { Client, Account, Databases, Storage, Query, ID } from 'appwrite';

// Initialize the Appwrite client
export const client = new Client();

// Update with your Appwrite endpoint and project ID
client
  .setEndpoint('https://cloud.appwrite.io/v1') 
  .setProject('67e7c965000ec66d13db'); // Using a working project ID

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Appwrite Configuration
export const APPWRITE_CONFIG = {
  databaseId: '67e7ce38001ddcb637d2',
  collectionsIds: {
    dailyEarnings: '67f997da00198e54b487',
    referrals: '67f99926000958109c8e',
    transactions: '67e7cecf0014a6d4bed4',
    userBalances: '67f4f67e000cc45b2c67',
  },
  // Add balance constraints
  balanceConstraints: {
    min: 0.00001,
    max: 5000
},
  // Add referral bonus amount
  referralBonus: 50 // STARZ amount given for each referral
};



// Helper function to get the current session
export const getCurrentSession = async () => {
  try {
    const session = await account.getSession('current');
    return session;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
};

// Helper function to get the current user
export const getCurrentUser = async () => {
  try {
    const currentUser = await account.get();
    return currentUser;
  } catch (error) {
    console.error('User error:', error);
    return null;
  }
};


//This function now handles authentication errors more gracefully
const checkAuthentication = async () => {
  try {
    const session = await getCurrentSession();
    if (!session) {
      console.error('No active session for database operation');
      throw new Error('User not authenticated');
    }
    
    const user = await getCurrentUser();
    if (!user) {
      console.error('No user found for database operation');
      throw new Error('User not authenticated');
    }
    
    return user;
  } catch (error) {
    console.error('Authentication check failed:', error);
    // This error will be caught by the global error handler in PrivateRoute
    throw new Error('User not authorized to perform this action');
  }
};


// Transaction Functions
export const createTransaction = async (userId: string, amount: number, currency: string, status: string, type: string, txId: string = '') => {
  try {
    // Verify authentication first
    await checkAuthentication();
    
    const transaction = await databases.createDocument(
    APPWRITE_CONFIG.databaseId,
    APPWRITE_CONFIG.collectionsIds.transactions,
     ID.unique(),
      {
        userId,
        amount,
        currency,
        status,
        type,
        txId,
        timestamp: new Date().toISOString()
      }
    );
    return transaction;
  } catch (error) {
    console.error('Transaction creation error:', error);
    throw error;
  }
};

export const getUserBalance = async (userId: string) => {
  try {
    // Check if userId is valid before making the request
    if (!userId) {
      console.error('Invalid userId provided to getUserBalance');
      return { balance: APPWRITE_CONFIG.balanceConstraints.min, lastUpdated: new Date().toISOString() };
    }

    // Verify authentication first
    await checkAuthentication();

    const balances = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collectionsIds.userBalances,
      [
        Query.equal('userId', userId)
      ]
    );
    
    if (balances.documents.length === 0) {
      // Create initial balance for new user (with minimum valid balance)
      try {
        const newBalance = await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collectionsIds.userBalances,
          ID.unique(),
          {
            userId,
            balance: APPWRITE_CONFIG.balanceConstraints.min, // Start with minimum valid balance
            miningBalance: 0, // Total mined STARZ
            referralBalance: 0, // Total from referrals
            lastUpdated: new Date().toISOString()
          }
        );
        return newBalance;
      } catch (createError) {
        console.error('Error creating new balance document:', createError);
        // Return a fallback object to prevent UI errors
        return { 
          balance: APPWRITE_CONFIG.balanceConstraints.min, 
          miningBalance: 0,
          referralBalance: 0,
          lastUpdated: new Date().toISOString() 
        };
      }
    }
    
    return balances.documents[0];
  } catch (error) {
    console.error('Get balance error:', error);
    // Return a fallback object to prevent UI errors
    
  }
};

export const updateUserBalance = async (userId: string, newBalance: number, miningIncrease: number = 0, referralIncrease: number = 0) => {
  try {
    // Verify authentication first
    await checkAuthentication();
    // Validate balance before sending to server
    const validatedBalance = Math.max(
      APPWRITE_CONFIG.balanceConstraints.min,
      Math.min(newBalance, APPWRITE_CONFIG.balanceConstraints.max)
    );
    
    const userBalance = await getUserBalance(userId);
    
    // Check if the userBalance is a fallback object (no $id property)
    if (!('$id' in userBalance)) {
      // If it's a fallback object, try to create a new balance document
      try {
        const newBalanceDoc = await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collectionsIds.userBalances,
          ID.unique(),
          {
            userId,
            balance: validatedBalance,
            miningBalance: miningIncrease,
            referralBalance: referralIncrease,
            lastUpdated: new Date().toISOString()
          }
        );
        return newBalanceDoc;
      } catch (createError) {
        console.error('Error creating new balance document during update:', createError);
        throw new Error('Unable to create or update user balance');
      }
    }

    // If it has an $id, it's a proper Appwrite document, so update it
    const currentMiningBalance = userBalance.miningBalance || 0;
    const currentReferralBalance = userBalance.referralBalance || 0;
    
    // If it has an $id, it's a proper Appwrite document, so update it
    const updated = await databases.updateDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collectionsIds.userBalances,
      userBalance.$id,
      {
        balance: validatedBalance,
        miningBalance: currentMiningBalance + miningIncrease,
        referralBalance: currentReferralBalance + referralIncrease,
        lastUpdated: new Date().toISOString()
      }
    );
    
    return updated;
  } catch (error) {
    console.error('Update balance error:', error);
    throw error;
  }
};

export const getUserTransactions = async (userId: string) => {
  try {

    // Verify authentication first
    await checkAuthentication();

    const transactions = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collectionsIds.transactions,
      [
        Query.equal('userId', userId),
        Query.orderDesc('timestamp')
      ]
    );
    
    return transactions.documents;
  } catch (error) {
    console.error('Get transactions error:', error);
    return [];
  }
};


// Daily Earnings Functions
export const recordDailyEarning = async (userId: string, amount: number) => {
  try {
    // Verify authentication first
    const user = await checkAuthentication();
    if (!user) {
      console.error('Authentication check failed in recordDailyEarning');
      return null;  
    }
    // Check if we have a valid amount and userId
    if (!userId || amount <= 0.00001) {
      console.error('Invalid userId or amount in recordDailyEarning', { userId, amount });
      return null;
    }

    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // Check if an entry for today already exists
    const existingEntries = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collectionsIds.dailyEarnings,
      [
        Query.equal('userId', userId),
        Query.equal('date', today)
      ]
    );
    
    if (existingEntries.documents.length > 0) {
      // Update existing entry
      const existingEntry = existingEntries.documents[0];
      const updatedEarning = await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collectionsIds.dailyEarnings,
        existingEntry.$id,
        {
          amount: existingEntry.amount + amount,
          lastUpdated: new Date().toISOString()
        }
      );
      return updatedEarning;
    } else {
      // Create new entry for today
      const newEarning = await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collectionsIds.dailyEarnings,
        ID.unique(),
        {
          userId,
          date: today,
          amount,
          lastUpdated: new Date().toISOString()
        }
      );
      return newEarning;
    }
  } catch (error) {
    console.error('Record daily earning error:', error);
    throw error;
  }
};

export const getTodayEarnings = async (userId: string,) => {
  try {
    // Verify authentication first
    await checkAuthentication();
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    const earnings = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collectionsIds.dailyEarnings,
      [
        Query.equal('userId', userId),
        Query.equal('date', today)
      ]
    );
    
    if (earnings.documents.length > 0) {
      return earnings.documents[0].amount;
    }
    
    return 0;
  } catch (error) {
    console.error('Get today earnings error:', error);
    return 0;
  }
};

// Referral Functions
export const addReferral = async (referrerId: string, referredUserId: string) => {
  try {
    // Verify authentication first
    await checkAuthentication();
    // Create a new referral record
    const referral = await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collectionsIds.referrals,
      ID.unique(),
      {
        referrerId,
        referredUserId,
        status: 'active',
        bonusAmount: APPWRITE_CONFIG.referralBonus,
        date: new Date().toISOString()
      }
    );
    
    // Add the referral bonus to the referrer's balance
    await updateUserBalance(
      referrerId, 
      (await getUserBalance(referrerId)).balance + APPWRITE_CONFIG.referralBonus,
      0,
      APPWRITE_CONFIG.referralBonus
    );
    
    // Create a transaction record for the referral bonus
    await createTransaction(
      referrerId,
      APPWRITE_CONFIG.referralBonus,
      'STARZ',
      'completed',
      'referral',
      ''
    );
    
    return referral;
  } catch (error) {
    console.error('Add referral error:', error);
    throw error;
  }
};

export const getUserReferrals = async (userId: string) => {
  try {
    // Verify authentication first
    await checkAuthentication();
    const referrals = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collectionsIds.referrals,
      [
        Query.equal('referrerId', userId)
      ]
    );
    
    return referrals.documents;
  } catch (error) {
    console.error('Get referrals error:', error);
    return [];
  }
};
