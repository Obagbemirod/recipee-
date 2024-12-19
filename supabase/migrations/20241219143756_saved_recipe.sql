CREATE TABLE public.saved_recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  image_url TEXT,
  ingredients JSONB NOT NULL,
  instructions JSONB NOT NULL,
  equipment TEXT[] NOT NULL,
  total_time TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  servings INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  CONSTRAINT saved_recipes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Add RLS policies
ALTER TABLE public.saved_recipes ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own recipes
CREATE POLICY "Users can insert their own recipes"
ON public.saved_recipes FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own recipes
CREATE POLICY "Users can view their own recipes"
ON public.saved_recipes FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);
