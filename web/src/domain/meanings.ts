export function splitMeaningText(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeMeaningItems(items: string[]): string[] {
  const seen = new Set<string>();

  return items
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLocaleLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
}

export function normalizePersistedMeaningItems(value: unknown): string[] {
  if (Array.isArray(value)) {
    return normalizeMeaningItems(
      value.filter((item): item is string => typeof item === "string"),
    );
  }

  if (typeof value === "string") {
    return splitMeaningText(value);
  }

  return [];
}
