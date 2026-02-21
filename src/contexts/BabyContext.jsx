import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const BabyContext = createContext({});

export const useBaby = () => {
  const context = useContext(BabyContext);
  if (!context) {
    throw new Error('useBaby must be used within a BabyProvider');
  }
  return context;
};

export const BabyProvider = ({ children }) => {
  const { user } = useAuth();
  const [babies, setBabies] = useState([]);
  const [currentBaby, setCurrentBaby] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch babies for current user
  const fetchBabies = async () => {
    if (!user) {
      setBabies([]);
      setCurrentBaby(null);
      setLoading(false);
      return;
    }

    try {
      // Get all babies the user has access to
      const { data: babyUsers, error } = await supabase
        .from('baby_users')
        .select(`
          baby_id,
          role,
          babies (
            id,
            name,
            date_of_birth,
            photo_url,
            notes
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const babyList = babyUsers
        .filter(bu => bu.babies)
        .map(bu => ({
          ...bu.babies,
          role: bu.role,
        }));

      setBabies(babyList);

      // Auto-select first baby or from localStorage
      const savedBabyId = localStorage.getItem('currentBabyId');
      if (savedBabyId && babyList.find(b => b.id === savedBabyId)) {
        setCurrentBaby(babyList.find(b => b.id === savedBabyId));
      } else if (babyList.length > 0) {
        setCurrentBaby(babyList[0]);
      }
    } catch (error) {
      console.error('Error fetching babies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new baby
  const createBaby = async (babyData) => {
    try {
      const { data, error } = await supabase
        .from('babies')
        .insert([{
          ...babyData,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchBabies();
      return { data, error: null };
    } catch (error) {
      console.error('Error creating baby:', error);
      return { data: null, error };
    }
  };

  // Switch current baby
  const switchBaby = (baby) => {
    setCurrentBaby(baby);
    localStorage.setItem('currentBabyId', baby.id);
  };

  // Fetch babies when user changes
  useEffect(() => {
    fetchBabies();
  }, [user]);

  const value = {
    babies,
    currentBaby,
    loading,
    createBaby,
    switchBaby,
    fetchBabies,
  };

  return <BabyContext.Provider value={value}>{children}</BabyContext.Provider>;
};
