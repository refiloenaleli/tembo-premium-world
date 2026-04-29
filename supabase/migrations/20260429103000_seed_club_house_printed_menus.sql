INSERT INTO public.club_house_menus (title, description, image_url, active, sort_order)
SELECT
  'Tembo''s Refined Cocktail Selection',
  E'GIN SELECTION\n- Watermelon Gin Cocktail\n- Tropical Gin\n- Tropical Cocktail\n- Soulcito Gin\n\nWHISKEY & VODKA SELECTION\n- Risasi - Vanilla Whiskey\n- Ginsky\n- Mshale Caramel Vodka (straight or desert)\n- Whisky Granite\n\nFRUIT & FUSION SLASHES\n- Mshale Strawberry Slash\n- Mshale Apple Slash\n- Soulcito Fusion\n\nUNDERTAKER EXCLUSIVE\n- 1 tot of Ginsky / 2 tot of Ginsky\n- 1 tot of Soulcito / 2 tot of Soulcito\n- 1 tot of Funga / 3 tot of Funga\n- 4 tot of RISASI dashed with Ginger Ale',
  null,
  true,
  10
WHERE NOT EXISTS (
  SELECT 1 FROM public.club_house_menus WHERE title = 'Tembo''s Refined Cocktail Selection'
);

INSERT INTO public.club_house_menus (title, description, image_url, active, sort_order)
SELECT
  'Africa''s Favorite: The Tembo Collection',
  E'1. THE CARAMEL DOM PEDRO\nBlend 3 scoops Vanilla Ice Cream, 1 shot Heavy Cream, 1 shot Mshale Caramel Vodka, 1 shot Funga Caramel Brandy. Top with crumbled Cadbury Flake.\n\n2. THE HIGHVELD VANILLA SOUR\nShake 2 shots Risasi Vanilla Whiskey, 1 shot Fresh Lemon Juice, 1/2 shot Simple Syrup, 1 Egg White with ice. Strain. Garnish: Lemon wheel.\n\n3. THE SUNSET WATERMELON SPRITZ\n2 shots Watermelon Gin in ice-filled glass. Top with 1/2 Tonic Water, 1/2 Soda Water. Garnish: Watermelon slice, fresh Mint.\n\n4. THE CARAMEL ESPRESSO MARTINI\nShake 2 shots Mshale Caramel Vodka, 1 shot cold Espresso, 1/2 shot Sugar Syrup hard with ice. Strain. Garnish: 3 coffee beans.\n\n5. THE TROPICAL ''GIN-JITO''\nMuddle Lime wedges and Mint with Simple Syrup in glass. Add ice, 2 shots Tropical Gin. Top with Soda Water. Stir.\n\n6. THE SOULCITO PINEAPPLE-STAR MARTINI\nShake 1 shot Soulcito, 1 shot Ginsky, 1 shot Pineapple juice, 1 shot Passion Fruit Pulp with ice. Strain. Garnish: Pineapple wedge. Serve with a sidecar shot of MCC.',
  null,
  true,
  20
WHERE NOT EXISTS (
  SELECT 1 FROM public.club_house_menus WHERE title = 'Africa''s Favorite: The Tembo Collection'
);

INSERT INTO public.club_house_cocktails (title, description, image_url, active, sort_order)
SELECT entry.title, entry.description, null, true, entry.sort_order
FROM (
  VALUES
    ('Watermelon Gin Cocktail', 'Tembo printed menu favourite from the Gin Selection.', 10),
    ('Tropical Gin', 'Tembo printed menu favourite from the Gin Selection.', 20),
    ('Tropical Cocktail', 'Tembo printed menu favourite from the Gin Selection.', 30),
    ('Soulcito Gin', 'Tembo printed menu favourite from the Gin Selection.', 40),
    ('Risasi - Vanilla Whiskey', 'Tembo printed menu favourite from the Whiskey & Vodka Selection.', 50),
    ('Ginsky', 'Tembo printed menu favourite from the Whiskey & Vodka Selection.', 60),
    ('Mshale Caramel Vodka (straight or desert)', 'Tembo printed menu favourite from the Whiskey & Vodka Selection.', 70),
    ('Whisky Granite', 'Tembo printed menu favourite from the Whiskey & Vodka Selection.', 80),
    ('Mshale Strawberry Slash', 'Tembo printed menu favourite from the Fruit & Fusion Slashes list.', 90),
    ('Mshale Apple Slash', 'Tembo printed menu favourite from the Fruit & Fusion Slashes list.', 100),
    ('Soulcito Fusion', 'Tembo printed menu favourite from the Fruit & Fusion Slashes list.', 110),
    ('The Caramel Dom Pedro', 'Blend 3 scoops Vanilla Ice Cream, 1 shot Heavy Cream, 1 shot Mshale Caramel Vodka, 1 shot Funga Caramel Brandy. Top with crumbled Cadbury Flake.', 120),
    ('The Highveld Vanilla Sour', 'Shake 2 shots Risasi Vanilla Whiskey, 1 shot Fresh Lemon Juice, 1/2 shot Simple Syrup, 1 Egg White with ice. Strain. Garnish: Lemon wheel.', 130),
    ('The Sunset Watermelon Spritz', '2 shots Watermelon Gin in an ice-filled glass. Top with 1/2 Tonic Water and 1/2 Soda Water. Garnish: Watermelon slice and fresh mint.', 140),
    ('The Caramel Espresso Martini', 'Shake 2 shots Mshale Caramel Vodka, 1 shot cold Espresso, 1/2 shot Sugar Syrup hard with ice. Strain. Garnish: 3 coffee beans.', 150),
    ('The Tropical ''Gin-Jito''', 'Muddle lime wedges and mint with Simple Syrup in a glass. Add ice, 2 shots Tropical Gin, then top with Soda Water and stir.', 160),
    ('The Soulcito Pineapple-Star Martini', 'Shake 1 shot Soulcito, 1 shot Ginsky, 1 shot Pineapple juice, and 1 shot Passion Fruit Pulp with ice. Strain. Garnish: Pineapple wedge. Serve with a sidecar shot of MCC.', 170)
) AS entry(title, description, sort_order)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.club_house_cocktails existing
  WHERE existing.title = entry.title
);
