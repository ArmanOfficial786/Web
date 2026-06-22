// @/config/orderBy/defineOrderByOptions.ts

export interface OrderByOption<TKey extends string = string> {
  key: TKey;
  label: string;
}

/**
 * Defines a report's sort options as a literal-typed, readonly array.
 * Throws in development (never in prod, so it can't crash a deployed build)
 * if two options in the same report share a key — that's always a typo.
 */
export function defineOrderByOptions<const T extends readonly OrderByOption[]>(
  options: T,
): T {
  if (process.env.NODE_ENV !== "production") {
    const seen = new Set<string>();
    for (const opt of options) {
      if (seen.has(opt.key)) {
        throw new Error(
          `Duplicate order-by key "${opt.key}" — keys must be unique within a report.`,
        );
      }
      seen.add(opt.key);
    }
  }
  return options;
}
