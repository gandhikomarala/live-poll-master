-- Fix overly permissive vote_histories INSERT policy
DROP POLICY IF EXISTS "System can insert vote history" ON public.vote_histories;

-- Only allow inserting vote history for the current user's votes or by admins
CREATE POLICY "Users can record their vote history" ON public.vote_histories
  FOR INSERT TO authenticated 
  WITH CHECK (
    user_id = auth.uid() OR 
    public.has_role(auth.uid(), 'admin')
  );