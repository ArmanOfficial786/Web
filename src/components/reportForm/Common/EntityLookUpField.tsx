// // components/reportForm/Common/EntityLookupField.tsx
// "use client";
// import React, { useCallback, useState } from "react";
// import {
//   Controller,
//   type Control,
//   type FieldValues,
//   type UseFormSetValue,
//   type Path,
// } from "react-hook-form";
// import Grid from "@mui/material/Grid";
// import TextField from "@mui/material/TextField";
// import SearchIcon from "@mui/icons-material/Search";
// import FieldRow from "@/utilis/FieldRow";
// import IconTextInput from "@/components/form/IconTextInput";
// import LookUpModal from "./LookUpModal";
// import type { EntityLookupConfig } from "types/lookup";

// interface EntityLookupFieldProps<
//   TRecord extends Record<string, any>,
//   TFilter extends FieldValues,
//   TForm extends FieldValues,
// > {
//   control: Control<TForm>;
//   setValue: UseFormSetValue<TForm>;
//   config: EntityLookupConfig<TRecord, TFilter, TForm>;
//   onSelect?: (row: TRecord) => void;
// }

// export default function EntityLookupField<
//   TRecord extends Record<string, any>,
//   TFilter extends FieldValues,
//   TForm extends FieldValues,
// >({
//   control,
//   setValue,
//   config,
//   onSelect,
// }: EntityLookupFieldProps<TRecord, TFilter, TForm>) {
//   const [open, setOpen] = useState(false);
//   const [data, setData] = useState<TRecord[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleOpen = useCallback(async () => {
//     setOpen(true);
//     setIsLoading(true);
//     try {
//       const page = await config.fetchPage(1);
//       setData(page.items);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [config]);

//   const handleClose = useCallback(() => {
//     setOpen(false);
//     setData([]);
//   }, []);

//   const handleSelect = (row: TRecord) => {
//     const values = config.mapToFormValues(row);
//     (Object.keys(values) as Array<keyof TForm>).forEach((name) =>
//       setValue(name as Path<TForm>, values[name] as any, { shouldDirty: true }),
//     );
//     onSelect?.(row);
//     handleClose();
//   };

//   const totalFields = 1 + config.autofillFields.length;
//   const mdWidth = totalFields <= 2 ? 6 : totalFields === 3 ? 4 : 3;

//   return (
//     <>
//       <Grid container spacing={2} sx={{ mb: 0.5, alignItems: "center" }}>
//         <Grid size={{ xs: 12, md: mdWidth }}>
//           <FieldRow label={config.searchField.label}>
//             <IconTextInput
//               control={control as any}
//               size="small"
//               name={config.searchField.name as string}
//               placeholder={
//                 config.searchField.placeholder ?? config.searchField.label
//               }
//               fullWidth
//               icon={<SearchIcon />}
//               onIconClick={handleOpen}
//               sx={{ "& .MuiInputBase-root": { paddingRight: "4px" } }}
//             />
//           </FieldRow>
//         </Grid>

//         {config.autofillFields.map((af) => (
//           <Grid key={af.name as string} size={{ xs: 12, md: mdWidth }}>
//             <FieldRow label={af.label}>
//               <Controller
//                 control={control}
//                 name={af.name}
//                 render={({ field }) => (
//                   <TextField
//                     size="small"
//                     fullWidth
//                     placeholder={af.placeholder ?? af.label}
//                     value={field.value ?? ""}
//                     slotProps={{ input: { readOnly: true } }}
//                   />
//                 )}
//               />
//             </FieldRow>
//           </Grid>
//         ))}
//       </Grid>

//       <LookUpModal
//         open={open}
//         onClose={handleClose}
//         onSelect={handleSelect}
//         data={data}
//         columns={config.columns}
//         filterDefaults={config.filterDefaults}
//         rowKey={config.rowKey}
//         title={config.title}
//         isLoading={isLoading}
//       />
//     </>
//   );
// }

// components/reportForm/Common/EntityLookupField.tsx
"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type UseFormSetValue,
  type Path,
} from "react-hook-form";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import FieldRow from "@/utilis/FieldRow";
import IconTextInput from "@/components/form/IconTextInput";
import LookUpModal from "./LookUpModal";
import { useEntityLookupCache } from "@/components/hooks/useEntityLookupCache";
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
  allowRefresh?: boolean;
  ttlMs?: number;
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
  allowRefresh = false,
  ttlMs,
}: EntityLookupFieldProps<TRecord, TFilter, TForm>) {
  const [open, setOpen] = useState(false);

  const {
    data,
    isLoading,
    isStreaming,
    pagesLoaded,
    totalPages,
    ensure,
    refetch,
  } = useEntityLookupCache<TRecord>(config.cacheKey, ttlMs);

  const fetchPage = useCallback(
    (page: number) => config.fetchPage(page),
    [config],
  );

  useEffect(() => {
    void ensure(fetchPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.cacheKey]);

  const handleOpen = useCallback(() => {
    setOpen(true);
    void ensure(fetchPage);
  }, [ensure, fetchPage]);

  const handleRefresh = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      void refetch(fetchPage);
    },
    [refetch, fetchPage],
  );

  const handleClose = useCallback(() => setOpen(false), []);

  const handleSelect = (row: TRecord) => {
    const values = config.mapToFormValues(row);
    (Object.keys(values) as Array<Path<TForm>>).forEach((name) => {
      setValue(name, values[name] as any, { shouldDirty: true });
    });
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
            <Grid container spacing={0.5} alignItems="center" wrap="nowrap">
              <Grid size="grow">
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
              </Grid>
              {allowRefresh && (
                <Grid>
                  <Tooltip
                    title={isStreaming ? "Loading more…" : "Refresh list"}
                  >
                    <span>
                      <IconButton size="small" onClick={handleRefresh}>
                        {isStreaming ? (
                          <CircularProgress size={16} />
                        ) : (
                          <RefreshIcon fontSize="small" />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                </Grid>
              )}
            </Grid>
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
        footer={
          isStreaming ? (
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", px: 1 }}
            >
              Loading more records… ({pagesLoaded}/{totalPages} pages,{" "}
              {data.length} loaded)
            </Typography>
          ) : undefined
        }
      />
    </>
  );
}
