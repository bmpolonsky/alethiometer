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

export function sanitizeMeaningItems(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return normalizeMeaningItems(
    value.filter((item): item is string => typeof item === "string"),
  );
}
