import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/lib/supabase";
import "./App.css";
import { AppRoutes } from "./AppRoutes";

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <AppRoutes />
      </BrowserRouter>
    </SessionContextProvider>
  );
}

export default App;