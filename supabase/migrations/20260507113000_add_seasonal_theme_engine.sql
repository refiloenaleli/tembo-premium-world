CREATE TABLE IF NOT EXISTS public.seasonal_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  manual_override BOOLEAN NOT NULL DEFAULT false,
  start_date DATE,
  end_date DATE,
  accent_color TEXT NOT NULL DEFAULT '#C9A45C',
  glow_color TEXT NOT NULL DEFAULT '#D4AF37',
  background_gradient TEXT NOT NULL DEFAULT 'linear-gradient(135deg, rgba(201,164,92,0.18), rgba(10,10,10,0))',
  promo_message TEXT,
  overlay_image_url TEXT,
  banner_image_url TEXT,
  ambient_audio_url TEXT,
  video_url TEXT,
  flag_overlay_url TEXT,
  country_code TEXT,
  particle_style TEXT NOT NULL DEFAULT 'glow',
  overlay_opacity NUMERIC(4,2) NOT NULL DEFAULT 0.22,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.seasonal_themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active seasonal themes" ON public.seasonal_themes
  FOR SELECT USING (active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert seasonal themes" ON public.seasonal_themes
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update seasonal themes" ON public.seasonal_themes
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete seasonal themes" ON public.seasonal_themes
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_seasonal_themes_updated_at
  BEFORE UPDATE ON public.seasonal_themes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO storage.buckets (id, name, public)
VALUES ('seasonal-theme-assets', 'seasonal-theme-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view seasonal theme assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'seasonal-theme-assets');

CREATE POLICY "Admins can upload seasonal theme assets" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'seasonal-theme-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update seasonal theme assets" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'seasonal-theme-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete seasonal theme assets" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'seasonal-theme-assets' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO public.seasonal_themes (
  slug,
  name,
  description,
  active,
  manual_override,
  start_date,
  end_date,
  accent_color,
  glow_color,
  background_gradient,
  promo_message,
  particle_style,
  overlay_opacity,
  sort_order
)
VALUES
  (
    'valentines-day',
    'Valentine''s Day',
    'Deep rose-gold luxury with candlelit ambience.',
    true,
    false,
    '2026-02-10',
    '2026-02-16',
    '#D89BAE',
    '#F5C7B8',
    'linear-gradient(135deg, rgba(216,155,174,0.18), rgba(245,199,184,0.08), rgba(10,10,10,0))',
    'A quiet rose-gold mood for intimate Tembo evenings.',
    'rose',
    0.22,
    10
  ),
  (
    'mothers-day',
    'Mother''s Day',
    'Warm rose-gold tones with elegant floral softness.',
    true,
    false,
    '2026-05-08',
    '2026-05-12',
    '#C99688',
    '#F0C5BC',
    'linear-gradient(135deg, rgba(201,150,136,0.18), rgba(240,197,188,0.10), rgba(10,10,10,0))',
    'To the women who shape generations.',
    'floral',
    0.20,
    20
  ),
  (
    'africa-day',
    'Africa Day',
    'Earth-tone cinematic textures with bronze and gold accents.',
    true,
    false,
    '2026-05-24',
    '2026-05-27',
    '#B98B4D',
    '#D6A55A',
    'linear-gradient(135deg, rgba(185,139,77,0.20), rgba(91,62,35,0.10), rgba(10,10,10,0))',
    'Rooted in African excellence.',
    'earth',
    0.24,
    30
  ),
  (
    'easter',
    'Easter',
    'Soft sunrise light with warm cream and gold overlays.',
    true,
    false,
    '2026-04-02',
    '2026-04-07',
    '#D8B980',
    '#F5E2B8',
    'linear-gradient(135deg, rgba(216,185,128,0.18), rgba(255,242,215,0.12), rgba(10,10,10,0))',
    'A softer spring glow, still unmistakably Tembo.',
    'dawn',
    0.18,
    40
  ),
  (
    'christmas',
    'Christmas',
    'Luxury festive gold with elegant snowfall haze.',
    true,
    false,
    '2026-12-20',
    '2026-12-27',
    '#C9A45C',
    '#F1D899',
    'linear-gradient(135deg, rgba(201,164,92,0.20), rgba(241,216,153,0.10), rgba(10,10,10,0))',
    'A festive season in warm gold light.',
    'snow',
    0.25,
    50
  ),
  (
    'new-year',
    'New Year',
    'Black and gold cinematic celebration with refined spark effects.',
    true,
    false,
    '2026-12-30',
    '2027-01-03',
    '#D4AF37',
    '#FFE08A',
    'linear-gradient(135deg, rgba(212,175,55,0.22), rgba(255,224,138,0.10), rgba(10,10,10,0))',
    'Enter the year with a sharper glow.',
    'spark',
    0.26,
    60
  ),
  (
    'winter-season',
    'Winter Season',
    'Frosted glass and cool luxury fog.',
    true,
    false,
    '2026-06-01',
    '2026-08-31',
    '#A7B8C9',
    '#DCE8F5',
    'linear-gradient(135deg, rgba(167,184,201,0.16), rgba(220,232,245,0.08), rgba(10,10,10,0))',
    'A cool, frosted layer over the Tembo experience.',
    'mist',
    0.18,
    70
  ),
  (
    'summer-season',
    'Summer Season',
    'Warm sunset gradients with tropical luxury ambience.',
    true,
    false,
    '2026-11-15',
    '2027-02-15',
    '#D89B52',
    '#FFD08A',
    'linear-gradient(135deg, rgba(216,155,82,0.18), rgba(255,208,138,0.10), rgba(10,10,10,0))',
    'Golden-hour warmth for long Tembo evenings.',
    'sunray',
    0.20,
    80
  ),
  (
    'independence-mode',
    'Independence / National Celebration',
    'Elegant national celebration mode with country-specific accents.',
    true,
    false,
    NULL,
    NULL,
    '#C9A45C',
    '#D4AF37',
    'linear-gradient(135deg, rgba(201,164,92,0.18), rgba(10,10,10,0))',
    'A refined celebration mode for national moments.',
    'flag',
    0.22,
    90
  )
ON CONFLICT (slug) DO NOTHING;
