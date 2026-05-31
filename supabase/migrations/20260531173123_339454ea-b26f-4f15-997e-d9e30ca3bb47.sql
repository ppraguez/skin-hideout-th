
DROP POLICY IF EXISTS "Anyone can submit a quick buy offer" ON public.quick_buy_submissions;
REVOKE INSERT ON public.quick_buy_submissions FROM anon, authenticated;
