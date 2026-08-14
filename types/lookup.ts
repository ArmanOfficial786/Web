// types/lookup.ts
import type { Path, FieldValues } from "react-hook-form";
import type { ReactNode } from "react";

export interface LookupColumn<T> {
  key: keyof T | "#";
  label: string;
  filterKey?: string;
  width: number | string;
  render?: (row: T) => ReactNode;
}

export interface AutofillFieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
}

export interface LookupPage<TRecord> {
  items: TRecord[];
  totalPages: number;
  currentPage: number;
}

export interface EntityLookupConfig<
  TRecord extends Record<string, any>,
  TFilter extends FieldValues,
  TForm extends FieldValues,
> {
  title: string;
  columns: LookupColumn<TRecord>[];
  filterDefaults: TFilter;
  rowKey: keyof TRecord;
  searchField: AutofillFieldConfig<TForm>;
  autofillFields: AutofillFieldConfig<TForm>[];
  fetchPage: (page: number) => Promise<LookupPage<TRecord>>;
  mapToFormValues: (row: TRecord) => Partial<TForm>;
}
