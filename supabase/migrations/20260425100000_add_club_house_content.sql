CREATE TABLE public.club_house_cocktails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.club_house_cocktails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published cocktails" ON public.club_house_cocktails
  FOR SELECT USING (active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert cocktails" ON public.club_house_cocktails
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update cocktails" ON public.club_house_cocktails
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete cocktails" ON public.club_house_cocktails
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_club_house_cocktails_updated_at
  BEFORE UPDATE ON public.club_house_cocktails
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.club_house_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.club_house_menus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published menus" ON public.club_house_menus
  FOR SELECT USING (active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert menus" ON public.club_house_menus
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update menus" ON public.club_house_menus
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete menus" ON public.club_house_menus
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_club_house_menus_updated_at
  BEFORE UPDATE ON public.club_house_menus
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.club_house_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  display_name TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('cocktail', 'menu')),
  item_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  review TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.club_house_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published club house ratings" ON public.club_house_ratings
  FOR SELECT USING (published = true OR public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can create ratings" ON public.club_house_ratings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update ratings" ON public.club_house_ratings
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete ratings" ON public.club_house_ratings
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_club_house_ratings_updated_at
  BEFORE UPDATE ON public.club_house_ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (key, value)
VALUES
  ('club_house_intro', 'Welcome to the Tembo Private Club House, where bold menus and signature cocktails come together for elevated private hosting.')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();
