// One source of truth for Hearthlight's pixel typography.
// Pixelify Sans = warm, readable, true-pixel display/UI; Silkscreen = tiny all-caps accents.
export const FONTS = {
  display: 'Pixelify Sans',
  label: 'Silkscreen',
} as const;

// Load the pixel fonts via the FontFace API (base-path safe, unlike CSS url()) before the game
// boots, so Phaser text never renders a system-font frame. Falls back silently on error.
export async function loadFonts(): Promise<void> {
  if (typeof document === 'undefined' || !('fonts' in document)) return;
  const base = import.meta.env.BASE_URL;
  const faces = [
    new FontFace('Pixelify Sans', `url(${base}assets/fonts/PixelifySans.ttf)`, { weight: '400 700', display: 'swap' }),
    new FontFace('Silkscreen', `url(${base}assets/fonts/Silkscreen-Regular.ttf)`, { weight: '400', display: 'swap' }),
    new FontFace('Silkscreen', `url(${base}assets/fonts/Silkscreen-Bold.ttf)`, { weight: '700', display: 'swap' }),
  ];
  await Promise.all(
    faces.map(async (face) => {
      try {
        await face.load();
        document.fonts.add(face);
      } catch {
        /* fall back to system font */
      }
    }),
  );
}
