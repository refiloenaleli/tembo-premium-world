CREATE OR REPLACE FUNCTION public.validate_club_house_rating_target()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.item_type = 'cocktail' THEN
    IF NOT EXISTS (
      SELECT 1
      FROM public.club_house_cocktails
      WHERE id = NEW.item_id
    ) THEN
      RAISE EXCEPTION 'Club House cocktail % does not exist', NEW.item_id;
    END IF;
  ELSIF NEW.item_type = 'menu' THEN
    IF NOT EXISTS (
      SELECT 1
      FROM public.club_house_menus
      WHERE id = NEW.item_id
    ) THEN
      RAISE EXCEPTION 'Club House menu % does not exist', NEW.item_id;
    END IF;
  ELSE
    RAISE EXCEPTION 'Unsupported Club House rating type %', NEW.item_type;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_club_house_rating_target ON public.club_house_ratings;

CREATE TRIGGER validate_club_house_rating_target
  BEFORE INSERT OR UPDATE ON public.club_house_ratings
  FOR EACH ROW EXECUTE FUNCTION public.validate_club_house_rating_target();

CREATE OR REPLACE FUNCTION public.cleanup_club_house_ratings_for_cocktail()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.club_house_ratings
  WHERE item_type = 'cocktail'
    AND item_id = OLD.id;

  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS cleanup_club_house_ratings_for_cocktail ON public.club_house_cocktails;

CREATE TRIGGER cleanup_club_house_ratings_for_cocktail
  BEFORE DELETE ON public.club_house_cocktails
  FOR EACH ROW EXECUTE FUNCTION public.cleanup_club_house_ratings_for_cocktail();

CREATE OR REPLACE FUNCTION public.cleanup_club_house_ratings_for_menu()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.club_house_ratings
  WHERE item_type = 'menu'
    AND item_id = OLD.id;

  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS cleanup_club_house_ratings_for_menu ON public.club_house_menus;

CREATE TRIGGER cleanup_club_house_ratings_for_menu
  BEFORE DELETE ON public.club_house_menus
  FOR EACH ROW EXECUTE FUNCTION public.cleanup_club_house_ratings_for_menu();
