
CREATE TABLE public.quick_buy_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skin_name TEXT NOT NULL,
  weapon TEXT NOT NULL,
  wear TEXT NOT NULL,
  min_float NUMERIC(6,4) NOT NULL DEFAULT 0,
  max_float NUMERIC(6,4) NOT NULL DEFAULT 1,
  stattrak_accepted BOOLEAN NOT NULL DEFAULT false,
  buy_price_thb INTEGER NOT NULL,
  market_percentage INTEGER NOT NULL DEFAULT 82,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.quick_buy_listings TO anon, authenticated;
GRANT ALL ON public.quick_buy_listings TO service_role;

ALTER TABLE public.quick_buy_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active quick buy listings are publicly readable"
ON public.quick_buy_listings FOR SELECT
USING (status = 'active');

CREATE TRIGGER quick_buy_listings_updated_at
BEFORE UPDATE ON public.quick_buy_listings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


CREATE TABLE public.quick_buy_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  listing_id UUID REFERENCES public.quick_buy_listings(id) ON DELETE SET NULL,
  skin_name TEXT NOT NULL,
  wear TEXT NOT NULL,
  float_value NUMERIC(6,4),
  stattrak BOOLEAN NOT NULL DEFAULT false,
  inspect_link TEXT,
  contact_method TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','reviewed','accepted','rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.quick_buy_submissions TO anon, authenticated;
GRANT SELECT ON public.quick_buy_submissions TO authenticated;
GRANT ALL ON public.quick_buy_submissions TO service_role;

ALTER TABLE public.quick_buy_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a quick buy offer"
ON public.quick_buy_submissions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view their own submissions"
ON public.quick_buy_submissions FOR SELECT
TO authenticated
USING (user_id IS NOT NULL AND auth.uid() = user_id);

CREATE TRIGGER quick_buy_submissions_updated_at
BEFORE UPDATE ON public.quick_buy_submissions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
