




import type { FieldValues, Path } from "react-hook-form";
import type { ReactNode } from "react";

export interface LookupColumn<T> {
  key: keyof T | "#";
  label: string;
  filterKey?: keyof T;
  width?: number | string;
  render?: (row: T) => ReactNode;
}

export interface LookupPage<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
  totalRecord?: number;
}

export interface AutofillField<TForm extends FieldValues> {
  name: Path<TForm>;
  label: string;
  placeholder?: string;
}

export interface EntityLookupConfig<
  TRecord extends Record<string, any>,
  TFilter extends FieldValues,
  TForm extends FieldValues,
> {
  cacheKey: string;
  title: string;
  rowKey: keyof TRecord;
  columns: LookupColumn<TRecord>[];
  filterDefaults: TFilter;
  searchField: {
    name: Path<TForm>;
    label: string;
    placeholder?: string;
  };
  autofillFields: AutofillField<TForm>[];
  fetchPage: (page: number) => Promise<LookupPage<TRecord>>;
  mapToFormValues: (row: TRecord) => Partial<Record<Path<TForm>, unknown>>;
}
