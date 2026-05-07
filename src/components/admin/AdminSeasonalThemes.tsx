import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarRange, Eye, EyeOff, Power, RefreshCcw, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSeasonalThemes, type SeasonalTheme } from "@/hooks/useSeasonalThemes";
import { useSeasonalTheme } from "@/context/SeasonalThemeContext";

type ThemeForm = {
  active: boolean;
  manual_override: boolean;
  start_date: string;
  end_date: string;
  accent_color: string;
  glow_color: string;
  background_gradient: string;
  promo_message: string;
  overlay_image_url: string;
  banner_image_url: string;
  ambient_audio_url: string;
  video_url: string;
  flag_overlay_url: string;
  country_code: string;
  particle_style: string;
  overlay_opacity: string;
};

const themeToForm = (theme: SeasonalTheme): ThemeForm => ({
  active: theme.active,
  manual_override: theme.manual_override,
  start_date: theme.start_date || "",
  end_date: theme.end_date || "",
  accent_color: theme.accent_color,
  glow_color: theme.glow_color,
  background_gradient: theme.background_gradient,
  promo_message: theme.promo_message || "",
  overlay_image_url: theme.overlay_image_url || "",
  banner_image_url: theme.banner_image_url || "",
  ambient_audio_url: theme.ambient_audio_url || "",
  video_url: theme.video_url || "",
  flag_overlay_url: theme.flag_overlay_url || "",
  country_code: theme.country_code || "",
  particle_style: theme.particle_style,
  overlay_opacity: String(theme.overlay_opacity ?? 0.22),
});

const themeAssetFields: Array<{
  key: keyof ThemeForm;
  label: string;
  accept: string;
  type: "overlay" | "banner" | "audio" | "video" | "flag";
}> = [
  { key: "overlay_image_url", label: "Overlay Graphic", accept: "image/*", type: "overlay" },
  { key: "banner_image_url", label: "Promotional Banner", accept: "image/*", type: "banner" },
  { key: "ambient_audio_url", label: "Ambient Audio", accept: "audio/*", type: "audio" },
  { key: "video_url", label: "Looping Video", accept: "video/*", type: "video" },
  { key: "flag_overlay_url", label: "Flag / Celebration Overlay", accept: "image/*", type: "flag" },
];

const prepareThemeAssetFile = async (file: File) => {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  const imageUrl = URL.createObjectURL(file);
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const nextImage = new Image();
    nextImage.onload = () => resolve(nextImage);
    nextImage.onerror = () => reject(new Error("Unable to read the selected image."));
    nextImage.src = imageUrl;
  });

  const maxDimension = 2200;
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);

  const context = canvas.getContext("2d");
  if (!context) {
    URL.revokeObjectURL(imageUrl);
    return file;
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const compressedBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", 0.82);
  });

  URL.revokeObjectURL(imageUrl);

  if (!compressedBlob) {
    return file;
  }

  const nextName = file.name.replace(/\.[^.]+$/, "") || "theme-image";
  return new File([compressedBlob], `${nextName}.webp`, { type: "image/webp" });
};

const AdminSeasonalThemes = () => {
  const { data: themes, isLoading } = useSeasonalThemes();
  const { previewThemeId, setPreviewThemeId } = useSeasonalTheme();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ThemeForm | null>(null);

  const sortedThemes = useMemo(() => themes ?? [], [themes]);

  const startEdit = (theme: SeasonalTheme) => {
    setEditingId(theme.id);
    setForm(themeToForm(theme));
  };

  const resetEditor = () => {
    setEditingId(null);
    setForm(null);
  };

  const refreshThemes = () => {
    queryClient.invalidateQueries({ queryKey: ["seasonal-themes"] });
  };

  const uploadAsset = async (
    themeSlug: string,
    assetType: "overlay" | "banner" | "audio" | "video" | "flag",
    file: File,
    field: keyof ThemeForm,
  ) => {
    const preparedFile = await prepareThemeAssetFile(file);
    const path = `${themeSlug}/${assetType}-${Date.now()}-${preparedFile.name}`;
    const { error } = await supabase.storage.from("seasonal-theme-assets").upload(path, preparedFile, { upsert: true });

    if (error) {
      toast.error(error.message);
      return;
    }

    const { data } = supabase.storage.from("seasonal-theme-assets").getPublicUrl(path);
    setForm((current) => (current ? { ...current, [field]: data.publicUrl } : current));
    toast.success("Theme asset uploaded");
  };

  const saveTheme = async () => {
    if (!editingId || !form) return;

    if (form.manual_override) {
      await supabase.from("seasonal_themes").update({ manual_override: false }).neq("id", editingId);
    }

    const { error } = await supabase
      .from("seasonal_themes")
      .update({
        active: form.active,
        manual_override: form.manual_override,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        accent_color: form.accent_color,
        glow_color: form.glow_color,
        background_gradient: form.background_gradient,
        promo_message: form.promo_message || null,
        overlay_image_url: form.overlay_image_url || null,
        banner_image_url: form.banner_image_url || null,
        ambient_audio_url: form.ambient_audio_url || null,
        video_url: form.video_url || null,
        flag_overlay_url: form.flag_overlay_url || null,
        country_code: form.country_code || null,
        particle_style: form.particle_style,
        overlay_opacity: Number.parseFloat(form.overlay_opacity) || 0.22,
      })
      .eq("id", editingId);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Seasonal theme updated");
    refreshThemes();
    resetEditor();
  };

  const forceActivateTheme = async (themeId: string) => {
    await supabase.from("seasonal_themes").update({ manual_override: false }).neq("id", themeId);
    const { error } = await supabase.from("seasonal_themes").update({ manual_override: true, active: true }).eq("id", themeId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Theme force activated");
    refreshThemes();
  };

  const revertToDefault = async () => {
    const { error } = await supabase.from("seasonal_themes").update({ manual_override: false });
    if (error) {
      toast.error(error.message);
      return;
    }
    setPreviewThemeId(null);
    toast.success("Reverted to the default Tembo theme");
    refreshThemes();
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading seasonal themes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-xl text-foreground">Seasonal Themes</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
              Manage holiday and seasonal visuals without changing the base Tembo identity. Assets are only loaded when a theme is active or previewed.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setPreviewThemeId(previewThemeId ? null : sortedThemes[0]?.id || null)}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary"
            >
              {previewThemeId ? "Clear Preview" : "Start Preview"}
            </button>
            <button
              onClick={revertToDefault}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <RefreshCcw size={15} /> Revert To Default
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {sortedThemes.map((theme) => {
          const isEditing = editingId === theme.id && form !== null;
          const isPreviewing = previewThemeId === theme.id;

          return (
            <div key={theme.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div
                className="border-b border-border p-5"
                style={{ background: theme.background_gradient }}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-2xl text-foreground">{theme.name}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${theme.active ? "bg-primary/20 text-primary" : "bg-destructive/15 text-destructive"}`}>
                        {theme.active ? "Enabled" : "Disabled"}
                      </span>
                      {theme.manual_override && (
                        <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-500">
                          Forced Active
                        </span>
                      )}
                      {isPreviewing && (
                        <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-500">
                          Previewing
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-foreground/80">{theme.description}</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-foreground/70">
                      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                        {theme.start_date || "No start"} to {theme.end_date || "No end"}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                        {theme.particle_style}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setPreviewThemeId(isPreviewing ? null : theme.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-sm font-semibold text-foreground"
                    >
                      {isPreviewing ? <EyeOff size={15} /> : <Eye size={15} />}
                      {isPreviewing ? "Stop Preview" : "Preview"}
                    </button>
                    <button
                      onClick={() => forceActivateTheme(theme.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
                    >
                      <Power size={15} /> Force Activate
                    </button>
                    <button
                      onClick={() => startEdit(theme)}
                      className="rounded-full bg-background/80 px-4 py-2 text-sm font-semibold text-foreground"
                    >
                      Edit Theme
                    </button>
                  </div>
                </div>
              </div>

              {isEditing && form ? (
                <div className="space-y-5 p-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="rounded-xl border border-border bg-secondary/25 p-4 text-sm text-foreground">
                      <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Enable Theme</span>
                      <input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} />
                    </label>
                    <label className="rounded-xl border border-border bg-secondary/25 p-4 text-sm text-foreground">
                      <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Manual Override</span>
                      <input type="checkbox" checked={form.manual_override} onChange={(event) => setForm({ ...form, manual_override: event.target.checked })} />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Start Date</label>
                      <input type="date" className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.start_date} onChange={(event) => setForm({ ...form, start_date: event.target.value })} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">End Date</label>
                      <input type="date" className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.end_date} onChange={(event) => setForm({ ...form, end_date: event.target.value })} />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Accent Color</label>
                      <input type="color" className="h-11 w-full rounded-md border border-border bg-secondary px-2 py-2" value={form.accent_color} onChange={(event) => setForm({ ...form, accent_color: event.target.value })} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Glow Color</label>
                      <input type="color" className="h-11 w-full rounded-md border border-border bg-secondary px-2 py-2" value={form.glow_color} onChange={(event) => setForm({ ...form, glow_color: event.target.value })} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Overlay Opacity</label>
                      <input type="number" min="0" max="1" step="0.01" className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.overlay_opacity} onChange={(event) => setForm({ ...form, overlay_opacity: event.target.value })} />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Background Gradient</label>
                    <textarea className="min-h-24 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.background_gradient} onChange={(event) => setForm({ ...form, background_gradient: event.target.value })} />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Promotional Message</label>
                    <input className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.promo_message} onChange={(event) => setForm({ ...form, promo_message: event.target.value })} />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Country Code / Label</label>
                      <input className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.country_code} onChange={(event) => setForm({ ...form, country_code: event.target.value })} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Particle Style</label>
                      <select className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground" value={form.particle_style} onChange={(event) => setForm({ ...form, particle_style: event.target.value })}>
                        <option value="glow">Glow</option>
                        <option value="rose">Rose Glow</option>
                        <option value="floral">Floral</option>
                        <option value="earth">Earth</option>
                        <option value="dawn">Dawn</option>
                        <option value="snow">Snow</option>
                        <option value="spark">Spark</option>
                        <option value="mist">Mist</option>
                        <option value="sunray">Sunray</option>
                        <option value="flag">Flag</option>
                      </select>
                    </div>
                  </div>

                  {themeAssetFields.map((asset) => (
                    <div key={asset.key} className="grid gap-3 md:grid-cols-[1fr_auto]">
                      <div>
                        <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">{asset.label} URL</label>
                        <input
                          className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                          value={form[asset.key]}
                          onChange={(event) => setForm({ ...form, [asset.key]: event.target.value })}
                        />
                      </div>
                      <div className="flex items-end">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
                          <Upload size={15} />
                          Upload
                          <input
                            type="file"
                            accept={asset.accept}
                            className="hidden"
                            onChange={(event) => {
                              if (event.target.files?.[0]) {
                                uploadAsset(theme.slug, asset.type, event.target.files[0], asset.key);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}

                  <div className="rounded-2xl border border-border bg-secondary/20 p-4">
                    <div className="mb-3 flex items-center gap-2 text-foreground">
                      <CalendarRange size={16} />
                      <span className="text-sm font-semibold">Preview Card</span>
                    </div>
                    <div className="rounded-2xl border border-white/10 p-5" style={{ background: form.background_gradient }}>
                      <p className="text-xs uppercase tracking-[0.3em]" style={{ color: form.accent_color }}>Tembo Seasonal Theme</p>
                      <h4 className="mt-3 font-display text-3xl text-foreground">{theme.name}</h4>
                      <p className="mt-3 text-sm text-foreground/80">{form.promo_message || theme.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button onClick={saveTheme} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                      Save Theme
                    </button>
                    <button onClick={resetEditor} className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 p-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-border bg-secondary/20 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Accent</p>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="h-8 w-8 rounded-full border border-border" style={{ backgroundColor: theme.accent_color }} />
                        <span className="text-sm text-foreground">{theme.accent_color}</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/20 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Glow</p>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="h-8 w-8 rounded-full border border-border" style={{ backgroundColor: theme.glow_color }} />
                        <span className="text-sm text-foreground">{theme.glow_color}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-secondary/20 p-4 text-sm text-muted-foreground">
                    {theme.promo_message || "No promotional message set yet."}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSeasonalThemes;
