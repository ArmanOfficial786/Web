// components/reportForm/Common/EntityLookupField.tsx
"use client";
import React, { useCallback, useState } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type UseFormSetValue,
  type Path,
} from "react-hook-form";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import FieldRow from "@/utilis/FieldRow";
import IconTextInput from "@/components/form/IconTextInput";
import LookUpModal from "./LookUpModal";
import type { EntityLookupConfig } from "types/lookup";

interface EntityLookupFieldProps<
  TRecord extends Record<string, any>,
  TFilter extends FieldValues,
  TForm extends FieldValues,
> {
  control: Control<TForm>;
  setValue: UseFormSetValue<TForm>;
  config: EntityLookupConfig<TRecord, TFilter, TForm>;
  onSelect?: (row: TRecord) => void;
}

export default function EntityLookupField<
  TRecord extends Record<string, any>,
  TFilter extends FieldValues,
  TForm extends FieldValues,
>({
  control,
  setValue,
  config,
  onSelect,
}: EntityLookupFieldProps<TRecord, TFilter, TForm>) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<TRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = useCallback(async () => {
    setOpen(true);
    setIsLoading(true);
    try {
      const page = await config.fetchPage(1);
      setData(page.items);
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setData([]);
  }, []);

  const handleSelect = (row: TRecord) => {
    const values = config.mapToFormValues(row);
    (Object.keys(values) as Array<keyof TForm>).forEach((name) =>
      setValue(name as Path<TForm>, values[name] as any, { shouldDirty: true }),
    );
    onSelect?.(row);
    handleClose();
  };

  const totalFields = 1 + config.autofillFields.length;
  const mdWidth = totalFields <= 2 ? 6 : totalFields === 3 ? 4 : 3;

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 0.5, alignItems: "center" }}>
        <Grid size={{ xs: 12, md: mdWidth }}>
          <FieldRow label={config.searchField.label}>
            <IconTextInput
              control={control as any}
              size="small"
              name={config.searchField.name as string}
              placeholder={
                config.searchField.placeholder ?? config.searchField.label
              }
              fullWidth
              icon={<SearchIcon />}
              onIconClick={handleOpen}
              sx={{ "& .MuiInputBase-root": { paddingRight: "4px" } }}
            />
          </FieldRow>
        </Grid>

        {config.autofillFields.map((af) => (
          <Grid key={af.name as string} size={{ xs: 12, md: mdWidth }}>
            <FieldRow label={af.label}>
              <Controller
                control={control}
                name={af.name}
                render={({ field }) => (
                  <TextField
                    size="small"
                    fullWidth
                    placeholder={af.placeholder ?? af.label}
                    value={field.value ?? ""}
                    slotProps={{ input: { readOnly: true } }}
                  />
                )}
              />
            </FieldRow>
          </Grid>
        ))}
      </Grid>

      <LookUpModal
        open={open}
        onClose={handleClose}
        onSelect={handleSelect}
        data={data}
        columns={config.columns}
        filterDefaults={config.filterDefaults}
        rowKey={config.rowKey}
        title={config.title}
        isLoading={isLoading}
      />
    </>
  );
}
