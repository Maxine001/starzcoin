
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { account,getCurrentUser, getCurrentSession,getTodayEarnings } from '../lib/appwrite';
import { ID, Models } from 'appwrite';
import { toast } from './use-toast';

interface User {
  $id: string;
  email: string;
  name: string;
}

interface User extends Models.User<Models.Preferences> {
  name: string;
  userId: string; // Add userId property for compatibility
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
    setLoading(true);
    const session = await getCurrentSession();
    
    if (session) {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        // Add userId as $id when setting user
        setUser({
          ...currentUser as User,
          userId: currentUser.$id
        });

        // Also fetch and initialize daily earnings
        try {
          const todayEarnings = await getTodayEarnings(currentUser.$id);
          // Dispatch a custom event to initialize the Dashboard's daily earnings
          window.dispatchEvent(new CustomEvent('init-daily-earnings', { 
            detail: { earnings: todayEarnings } 
          }));
        } catch (error) {
          console.error('Error fetching today earnings:', error);
        }
    }
    }

    } catch (error) {
      console.error('No active session found');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const currentSession = await getCurrentSession();
      
      // If there's an active session, use the existing session instead of creating a new one
      if (!currentSession) {
        await account.createEmailPasswordSession(email, password);
      }

      try {
        await account.deleteSession('current');
      } catch (error) {
        // Ignore errors here - this just means no active session existed
        console.log('No existing session to delete');
      }
      
      // Now create a new session
      await account.createEmailPasswordSession(email, password);
      //const accountDetails = await account.get();
      //setUser(accountDetails);
      const currentUser = await getCurrentUser();
      if (currentUser) {
         // Add userId as $id when setting user
         setUser({
          ...currentUser as User,
          userId: currentUser.$id
        });
        
        toast({
          title: "Login Successful",
          description: "Welcome back to Starz Mining!",
        });
        
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      try{
        await account.deleteSession('current');
      }catch(error){
        console.error('Error deleting session:', error);
      }
      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      const currentUser = await getCurrentUser();

      //setUser(accountDetails);
      if (currentUser) {
         // Add userId as $id when setting user
         setUser({
          ...currentUser as User,
          userId: currentUser.$id
        });
        
        toast({
          title: "Account Created",
          description: "Welcome to Starz Mining!",
        })
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await account.deleteSession('current');
      setUser(null);
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
