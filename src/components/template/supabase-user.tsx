"use client";

import { User } from "@/lib/global-interface";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useState } from "react";


export function useSupabaseUser() {
    const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setUser({
            id: user.id,
            name: user.user_metadata?.name || "",
            email: user.email || "",
            role: "user",
          });
        } else {
          setUser(null);
        }
      });
  
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.name || "",
            email: session.user.email || "",
            role: "user",
          });
        } else {
          setUser(null);
        }
      });
  
      return () => {
        listener?.subscription.unsubscribe();
      };
    }, []);
  
    return user;
  }