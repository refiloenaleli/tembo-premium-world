UPDATE auth.users
SET
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"full_name":"Tembo Admin"}'::jsonb
WHERE email = 'ntsholisenate@gmail.com';

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'ntsholisenate@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.site_settings (key, value)
VALUES
  ('contact_email', 'nqobin31@gmail.com'),
  ('whatsapp_number', '+27 73 315 9993'),
  ('club_house_address', '94a Sandton Drive, Parkmore, Sandton, Johannesburg')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();

INSERT INTO public.products (
  slug,
  name,
  subtitle,
  category,
  description,
  image_url,
  price_full,
  price_mini,
  abv,
  volume,
  rating,
  featured,
  active,
  sort_order
)
VALUES
  (
    'watermelon-gin',
    'Watermelon Gin',
    'Refreshing, vibrant, and full of summer energy',
    'gin',
    'Refreshing, vibrant, and full of summer energy.',
    NULL,
    349.99,
    44.99,
    '40%',
    '750ml',
    4.8,
    true,
    true,
    1
  ),
  (
    'tropical-gin',
    'Tropical Gin',
    'Exotic botanicals bringing paradise flavours',
    'gin',
    'Exotic botanicals bringing paradise flavours.',
    NULL,
    349.99,
    44.99,
    '40%',
    '750ml',
    4.8,
    true,
    true,
    2
  ),
  (
    'soulicto-gin',
    'Soulicto Gin',
    'Smooth, soulful, and elegantly refined',
    'gin',
    'Smooth, soulful, and elegantly refined.',
    NULL,
    399.99,
    44.99,
    '40%',
    '750ml',
    4.9,
    true,
    true,
    3
  ),
  (
    'ginsky',
    'Ginsky',
    'A bold and unique gin-whisky fusion',
    'fusion',
    'A bold and unique gin-whisky fusion.',
    NULL,
    399.99,
    44.99,
    '40%',
    '750ml',
    4.9,
    true,
    true,
    4
  ),
  (
    'funga-caramel-brandy',
    'Funga Caramel Brandy',
    'Rich, warm, and luxurious',
    'brandy',
    'Rich, warm, and luxurious.',
    NULL,
    399.99,
    44.99,
    '40%',
    '750ml',
    4.8,
    true,
    true,
    5
  ),
  (
    'mshale-caramel-vodka',
    'Mshale Caramel Vodka',
    'Deep, toasted, and exquisite',
    'vodka',
    'Deep, toasted, and exquisite.',
    NULL,
    399.99,
    44.99,
    '40%',
    '750ml',
    4.8,
    true,
    true,
    6
  ),
  (
    'risasi-vanilla-whisky',
    'Risasi Vanilla Whisky',
    'Smooth, aromatic, and unforgettable',
    'whisky',
    'Smooth, aromatic, and unforgettable.',
    NULL,
    399.99,
    44.99,
    '40%',
    '750ml',
    4.9,
    true,
    true,
    7
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  price_full = EXCLUDED.price_full,
  price_mini = EXCLUDED.price_mini,
  abv = EXCLUDED.abv,
  volume = EXCLUDED.volume,
  rating = EXCLUDED.rating,
  featured = EXCLUDED.featured,
  active = EXCLUDED.active,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();
