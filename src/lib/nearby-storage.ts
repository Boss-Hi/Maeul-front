export type SavedRegion = {
  regionCode: string;
  cityCode: string;
  label: string;
  checkedAt: number;
};

const regionKey = "maeul-nearby-region";
const legacyKey = "maeul-nearby-session";
const dismissedKey = "maeul-nearby-dismissed";

function parseRegion(value: unknown): SavedRegion | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<SavedRegion>;
  if (
    typeof item.regionCode !== "string" ||
    !/^\d+$/.test(item.regionCode) ||
    typeof item.cityCode !== "string" ||
    !/^\d*$/.test(item.cityCode) ||
    typeof item.label !== "string" ||
    !item.label.trim()
  )
    return null;
  return {
    regionCode: item.regionCode,
    cityCode: item.cityCode,
    label: item.label,
    checkedAt:
      typeof item.checkedAt === "number" && Number.isFinite(item.checkedAt)
        ? item.checkedAt
        : 0
  };
}

export function readNearbyRegion(
  local: Storage,
  session: Storage
): SavedRegion | null {
  for (const storage of [local, session]) {
    try {
      const saved = parseRegion(
        JSON.parse(storage.getItem(regionKey) || "null")
      );
      if (saved) return saved;
    } catch {
      /* Try session storage when local storage is unavailable. */
    }
  }
  try {
    const legacy = JSON.parse(session.getItem(legacyKey) || "null");
    const region =
      legacy?.choice === "allowed" ? parseRegion(legacy.region) : null;
    if (region) {
      writeNearbyRegion(local, session, region, region.checkedAt);
      return region;
    }
  } catch {
    /* Ignore unavailable or malformed legacy storage. */
  }
  return null;
}

export function writeNearbyRegion(
  local: Storage,
  session: Storage,
  region: Omit<SavedRegion, "checkedAt">,
  checkedAt = Date.now()
) {
  const saved = parseRegion({ ...region, checkedAt });
  if (!saved) return;
  // Store only the administrative region, never raw coordinates.
  for (const storage of [local, session]) {
    try {
      storage.setItem(regionKey, JSON.stringify(saved));
    } catch {
      /* Storage is optional. */
    }
  }
}

export function dismissNearbyPrompt(session: Storage) {
  try {
    session.setItem(dismissedKey, "true");
  } catch {
    /* Storage is optional. */
  }
}

export function isNearbyPromptDismissed(session: Storage) {
  try {
    return (
      session.getItem(dismissedKey) === "true" ||
      JSON.parse(session.getItem(legacyKey) || "null")?.choice === "later"
    );
  } catch {
    return false;
  }
}
