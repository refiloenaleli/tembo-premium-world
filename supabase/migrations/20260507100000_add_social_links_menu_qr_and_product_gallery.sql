ALTER TABLE public.event_subscribers
ADD COLUMN IF NOT EXISTS phone TEXT;

CREATE TABLE IF NOT EXISTS public.product_gallery_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  cocktail_name TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.product_gallery_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product gallery assets" ON public.product_gallery_assets
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.products
      WHERE products.id = product_gallery_assets.product_id
        AND (products.active = true OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Admins can insert product gallery assets" ON public.product_gallery_assets
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product gallery assets" ON public.product_gallery_assets
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product gallery assets" ON public.product_gallery_assets
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_product_gallery_assets_updated_at
  BEFORE UPDATE ON public.product_gallery_assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-gallery', 'product-gallery', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view product gallery bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-gallery');

CREATE POLICY "Admins can upload product gallery images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-gallery' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product gallery bucket" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'product-gallery' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product gallery bucket" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'product-gallery' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_settings (key, value)
VALUES
  ('facebook_url', ''),
  ('x_url', ''),
  ('instagram_url', ''),
  ('tiktok_url', '')
ON CONFLICT (key) DO NOTHING;
