export function getIconPath(name: string, size: 16 | 48 = 16): string {
  return `/icons/${size}/${name}.webp`;
}

/** Map from window icon key (used in windowSlice) to XP icon slug.
 *  Only needed when the windowSlice key differs from the actual icon filename. */
export const WINDOW_ICON_MAP: Record<string, string> = {};
