import { ID } from 'appwrite';
import { 
  getUserBalance, 
  updateUserBalance, 
  recordDailyEarning, 
  createTransaction,
  getCurrentUser
} from './appwrite';

// Constants for offline mining
const OFFLINE_MINING_CONFIG = {
  // Mining rate in STARZ per minute when offline
  miningRatePerMinute: 0.04,
  // Maximum time in milliseconds that can be counted for offline mining (8 hours)
  maxOfflineTime: 8 * 60 * 60 * 1000,
  // Storage keys
  storageKeys: {
    lastOnlineTimestamp: 'starz_last_online_timestamp',
    pendingOfflineEarnings: 'starz_pending_offline_earnings',
    offlineMiningEnabled: 'starz_offline_mining_enabled'
  }
};

/**
 * Initialize offline mining tracking
 */
export const initOfflineMining = () => {
  // Set current timestamp as last online time
  localStorage.setItem(
    OFFLINE_MINING_CONFIG.storageKeys.lastOnlineTimestamp, 
    Date.now().toString()
  );
  
  // Enable offline mining by default
  if (!localStorage.getItem(OFFLINE_MINING_CONFIG.storageKeys.offlineMiningEnabled)) {
    localStorage.setItem(
      OFFLINE_MINING_CONFIG.storageKeys.offlineMiningEnabled, 
      'true'
    );
  }
  
  // Update timestamp periodically while online
  const updateOnlineStatus = () => {
    if (navigator.onLine) {
      localStorage.setItem(
        OFFLINE_MINING_CONFIG.storageKeys.lastOnlineTimestamp, 
        Date.now().toString()
      );
    }
  };
  
  // Set up event listeners for online/offline status
  window.addEventListener('online', () => {
    console.log('Back online, syncing offline earnings...');
    syncOfflineEarnings();
  });
  
  // Update timestamp on various user interactions
  window.addEventListener('mousemove', updateOnlineStatus);
  window.addEventListener('keypress', updateOnlineStatus);
  window.addEventListener('click', updateOnlineStatus);
  window.addEventListener('touchstart', updateOnlineStatus);
  
  // Update timestamp periodically
  setInterval(updateOnlineStatus, 60000); // Every minute
};

/**
 * Calculate earnings for offline time
 */
export const calculateOfflineEarnings = (): number => {
  // Check if offline mining is enabled
  const offlineMiningEnabled = localStorage.getItem(
    OFFLINE_MINING_CONFIG.storageKeys.offlineMiningEnabled
  ) === 'true';
  
  if (!offlineMiningEnabled) {
    return 0;
  }
  
  // Get last online timestamp
  const lastOnlineStr = localStorage.getItem(
    OFFLINE_MINING_CONFIG.storageKeys.lastOnlineTimestamp
  );
  
  if (!lastOnlineStr) {
    return 0;
  }
  
  const lastOnlineTimestamp = parseInt(lastOnlineStr, 10);
  const currentTime = Date.now();
  const timeDiff = currentTime - lastOnlineTimestamp;
  
  // If less than a minute has passed, no earnings
  if (timeDiff < 60000) {
    return 0;
  }
  
  // Cap offline time to maximum allowed
  const cappedOfflineTime = Math.min(timeDiff, OFFLINE_MINING_CONFIG.maxOfflineTime);
  
  // Calculate earnings (time in minutes * rate per minute)
  const offlineMinutes = cappedOfflineTime / 60000;
  const earnings = offlineMinutes * OFFLINE_MINING_CONFIG.miningRatePerMinute;
  
  // Round to 4 decimal places to avoid floating point issues
  return Math.round(earnings * 10000) / 10000;
};

/**
 * Check for offline earnings when user returns
 */
export const checkOfflineEarnings = (): number => {
  const earnings = calculateOfflineEarnings();
  
  if (earnings > 0) {
    // Store pending earnings
    const existingPendingStr = localStorage.getItem(
      OFFLINE_MINING_CONFIG.storageKeys.pendingOfflineEarnings
    ) || '0';
    const existingPending = parseFloat(existingPendingStr);
    const totalPending = existingPending + earnings;
    
    localStorage.setItem(
      OFFLINE_MINING_CONFIG.storageKeys.pendingOfflineEarnings,
      totalPending.toString()
    );
    
    // Reset last online timestamp
    localStorage.setItem(
      OFFLINE_MINING_CONFIG.storageKeys.lastOnlineTimestamp,
      Date.now().toString()
    );
    
    return earnings;
  }
  
  return 0;
};

/**
 * Sync offline earnings with the server
 */
export const syncOfflineEarnings = async (): Promise<boolean> => {
  try {
    // Check if there are pending earnings
    const pendingEarningsStr = localStorage.getItem(
      OFFLINE_MINING_CONFIG.storageKeys.pendingOfflineEarnings
    );
    
    if (!pendingEarningsStr || parseFloat(pendingEarningsStr) <= 0) {
      return false;
    }
    
    const pendingEarnings = parseFloat(pendingEarningsStr);
    
    // Get current user
    const user = await getCurrentUser();
    if (!user || !user.$id) {
      console.error('No authenticated user found for syncing offline earnings');
      return false;
    }
    
    // Get current balance
    const userBalance = await getUserBalance(user.$id);
    
    // Update user balance with offline earnings
    await updateUserBalance(
      user.$id,
      userBalance.balance + pendingEarnings,
      pendingEarnings, // Add to mining balance
      0 // No change to referral balance
    );
    
    // Record daily earning
    await recordDailyEarning(user.$id, pendingEarnings);
    
    // Create transaction record
    await createTransaction(
      user.$id,
      pendingEarnings,
      'STARZ',
      'completed',
      'offline-mining'
    );
    
    // Clear pending earnings
    localStorage.setItem(
      OFFLINE_MINING_CONFIG.storageKeys.pendingOfflineEarnings,
      '0'
    );
    
    console.log(`Successfully synced ${pendingEarnings} STARZ from offline mining`);
    return true;
  } catch (error) {
    console.error('Error syncing offline earnings:', error);
    return false;
  }
};

/**
 * Toggle offline mining on/off
 */
export const toggleOfflineMining = (enabled: boolean): void => {
  localStorage.setItem(
    OFFLINE_MINING_CONFIG.storageKeys.offlineMiningEnabled,
    enabled.toString()
  );
};

/**
 * Check if offline mining is enabled
 */
export const isOfflineMiningEnabled = (): boolean => {
  return localStorage.getItem(
    OFFLINE_MINING_CONFIG.storageKeys.offlineMiningEnabled
  ) === 'true';
};

/**
 * Get pending offline earnings amount
 */
export const getPendingOfflineEarnings = (): number => {
  const pendingStr = localStorage.getItem(
    OFFLINE_MINING_CONFIG.storageKeys.pendingOfflineEarnings
  );
  return pendingStr ? parseFloat(pendingStr) : 0;
};
