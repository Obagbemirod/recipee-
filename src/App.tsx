import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import "./App.css";
import { AppRoutes } from "./AppRoutes";

function App() {
  const [initialSession, setInitialSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setInitialSession(session);
      setIsLoading(false);
    });

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setInitialSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <SessionContextProvider 
      supabaseClient={supabase}
      initialSession={initialSession}
    >
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <AppRoutes />
      </BrowserRouter>
    </SessionContextProvider>
  );
}

export default App;