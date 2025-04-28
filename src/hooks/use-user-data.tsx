
import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { userService, UserData } from '../services/userService';
import { toast } from './use-toast';

export const useUserData = () => {
  const { user, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserData();
    } else {
      setUserData(null);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      if (user) {
        const data = await userService.getUserById(user.$id);
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: 'Error loading profile',
        description: 'Unable to load your profile data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserData>) => {
    try {
      if (user && userData) {
        setLoading(true);
        const updated = await userService.updateUserProfile(user.$id, data);
        setUserData(updated);
        toast({
          title: 'Profile updated',
          description: 'Your profile has been updated successfully',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update failed',
        description: 'Unable to update your profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    userData,
    loading,
    refreshUserData: fetchUserData,
    updateProfile,
  };
};
