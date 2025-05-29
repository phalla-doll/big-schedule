import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Adjust the import path as needed
import { Agenda } from '@/lib/global-interface'; // Adjust the import path as needed
import { User } from '@supabase/supabase-js';

export function useIsAgendaOwner(agenda: Agenda | null | undefined): boolean {
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        setCurrentUser(null);
        return;
      }
      setCurrentUser(session?.user ?? null);
    };

    fetchSession().then();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log('currentUser', currentUser);
    console.log('agenda', agenda);
    if (currentUser && agenda && agenda.ownerId) {
      setIsOwner(currentUser.id === agenda.ownerId);
    } else {
      setIsOwner(false);
    }
  }, [currentUser, agenda]);

  return isOwner;
}