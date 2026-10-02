
export interface OrderByOption<TKey extends string = string> {
  key: TKey;
  label: string;
}

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
