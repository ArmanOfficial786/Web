// // components/form/TableWithFilter.tsx
// "use client";

// import React, { useEffect } from "react";
// import {
//   useForm,
//   useWatch,
//   type FieldValues,
//   type Path,
// } from "react-hook-form";
// import {
//   Box,
//   Typography,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Tooltip,
//   Pagination as MuiPagination,
//   useTheme,
// } from "@mui/material";
// import { FirstPage, LastPage } from "@mui/icons-material";
// import TextInput from "@/components/form/TextInput";
// import type { LookupColumn } from "types/lookup";

// export interface TableWithFilterProps<
//   T extends Record<string, any>,
//   TFilter extends FieldValues,
// > {
//   data: T[];
//   columns: LookupColumn<T>[];
//   filterDefaults: TFilter;
//   rowKey: keyof T;
//   onSelect: (row: T) => void;
//   pageSize?: number;
//   isLoading?: boolean;
//   resetKey?: unknown;
//   showGroupByHint?: boolean;
//   maxHeight?: number | string;
// }

// export default function TableWithFilter<
//   T extends Record<string, any>,
//   TFilter extends FieldValues,
// >(props: TableWithFilterProps<T, TFilter>) {
//   const {
//     data,
//     columns,
//     filterDefaults,
//     rowKey,
//     onSelect,
//     pageSize = 10,
//     isLoading = false,
//     resetKey,
//     showGroupByHint = true,
//     maxHeight = 500,
//   } = props;

//   const theme = useTheme();
//   // `theme.vars` is typed as possibly undefined on the base MUI `Theme`
//   // interface (for back-compat with themes not using CSS variables).
//   // This app always creates its theme with `cssVariables: true`, so it's
//   // safe to assert non-null once here and reuse `vars` everywhere below,
//   // instead of scattering `theme.vars!` (or optional chaining) across
//   // every line.
//   const vars = theme.vars!;

//   const surfaceBg = vars.palette.background.paper;
//   const surfaceSunken = vars.palette.background.default;
//   const surfaceRaised = vars.palette.grey[100];
//   const headerBg =
//     theme.palette.mode === "dark" ? "#1e3a5f" : vars.palette.grey[100];
//   const headerText =
//     theme.palette.mode === "dark" ? "#ffffff" : vars.palette.text.primary;
//   const oddRowBg = theme.palette.mode === "dark" ? "#1e293b" : "transparent";
//   const evenRowBg =
//     theme.palette.mode === "dark" ? "#243347" : vars.palette.grey[50];
//   const hoverRowBg =
//     theme.palette.mode === "dark" ? "#2d3f55" : vars.palette.action.hover;
//   const filterRowBg =
//     theme.palette.mode === "dark" ? "#162032" : vars.palette.grey[100];
//   const inputBg = vars.palette.background.paper;
//   const inputBorder = vars.palette.divider;
//   const inputText = vars.palette.text.primary;
//   const inputHolder = vars.palette.text.disabled;
//   const textPrimary = vars.palette.text.primary;
//   const textSecondary = vars.palette.text.secondary;
//   const divider = vars.palette.divider;
//   const selectBtnBg = vars.palette.primary.main;
//   const selectBtnHover = vars.palette.primary.light;

//   const cellSx = {
//     fontSize: 12,
//     py: 0.6,
//     px: 1,
//     whiteSpace: "nowrap" as const,
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     borderRight: `1px solid ${divider}`,
//     borderBottom: `1px solid ${divider}`,
//     color: textPrimary,
//   };

//   const filterInputSx = {
//     width: "100%",
//     "& .MuiInputBase-root": {
//       fontSize: 11,
//       height: 24,
//       backgroundColor: inputBg,
//       color: inputText,
//     },
//     "& .MuiOutlinedInput-input": {
//       py: 0,
//       px: 0.75,
//       color: inputText,
//       "&::placeholder": { color: inputHolder, opacity: 1 },
//     },
//     "& .MuiOutlinedInput-notchedOutline": { borderColor: inputBorder },
//     "&:hover .MuiOutlinedInput-notchedOutline": {
//       borderColor: vars.palette.text.secondary,
//     },
//     "& .MuiFormHelperText-root": { display: "none" },
//   };

//   const { control, reset } = useForm<TFilter>({
//     defaultValues: filterDefaults as any,
//   });
//   const filters = useWatch({ control });
//   const [page, setPage] = React.useState(1);

//   useEffect(() => {
//     reset(filterDefaults as any);
//     setPage(1);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [resetKey]);

//   useEffect(() => {
//     setPage(1);
//   }, [JSON.stringify(filters)]);

//   const filterKeys = Object.keys(filterDefaults as object);

//   const filtered = data.filter((row) =>
//     filterKeys.every((key) => {
//       const val = ((filters as any)[key] as string) ?? "";
//       return val
//         ? String(row[key]).toLowerCase().includes(val.toLowerCase())
//         : true;
//     }),
//   );

//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

//   return (
//     <>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           px: 2,
//           py: 1,
//           backgroundColor: surfaceSunken,
//           borderBottom: `1px solid ${divider}`,
//         }}
//       >
//         <Typography variant="body2" sx={{ color: textSecondary }}>
//           {isLoading
//             ? "Loading…"
//             : `Page ${page} / ${totalPages} (${filtered.length} items)`}
//         </Typography>
//         <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//           <Tooltip title="First page">
//             <IconButton
//               size="small"
//               onClick={() => setPage(1)}
//               sx={{ color: textPrimary }}
//             >
//               <FirstPage />
//             </IconButton>
//           </Tooltip>
//           <MuiPagination
//             page={page}
//             count={totalPages}
//             onChange={(_, v) => setPage(v)}
//             size="small"
//             siblingCount={2}
//             boundaryCount={1}
//             sx={{
//               "& .MuiPaginationItem-root": {
//                 minWidth: 28,
//                 height: 28,
//                 fontSize: 12,
//                 color: textPrimary,
//               },
//               "& .MuiPaginationItem-root.Mui-selected": {
//                 backgroundColor: vars.palette.action.selected,
//                 color: vars.palette.primary.main,
//               },
//             }}
//           />
//           <Tooltip title="Last page">
//             <IconButton
//               size="small"
//               onClick={() => setPage(totalPages)}
//               sx={{ color: textPrimary }}
//             >
//               <LastPage />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       </Box>

//       {showGroupByHint && (
//         <Box
//           sx={{
//             px: 2,
//             py: 0.75,
//             backgroundColor: surfaceRaised,
//             borderBottom: `1px solid ${divider}`,
//           }}
//         >
//           <Typography variant="caption" sx={{ color: textSecondary }}>
//             Drag a column header here to group by that column
//           </Typography>
//         </Box>
//       )}

//       <TableContainer
//         component={Paper}
//         sx={{
//           maxHeight,
//           overflowX: "auto",
//           backgroundColor: surfaceBg,
//           backgroundImage: "none",
//           border: `1px solid ${divider}`,
//         }}
//       >
//         <Table stickyHeader size="small">
//           <TableHead>
//             <TableRow>
//               {columns.map((col) => (
//                 <TableCell
//                   key={String(col.key)}
//                   sx={{
//                     ...cellSx,
//                     width: col.width,
//                     backgroundColor: `${headerBg} !important`,
//                     color: `${headerText} !important`,
//                     fontWeight: 700,
//                   }}
//                 >
//                   {col.label}
//                 </TableCell>
//               ))}
//               <TableCell
//                 sx={{
//                   ...cellSx,
//                   width: 80,
//                   backgroundColor: `${headerBg} !important`,
//                   color: `${headerText} !important`,
//                   fontWeight: 700,
//                   position: "sticky",
//                   right: 0,
//                   zIndex: 4,
//                 }}
//               >
//                 Action
//               </TableCell>
//             </TableRow>

//             <TableRow>
//               {columns.map((col) => (
//                 <TableCell
//                   key={String(col.key)}
//                   sx={{
//                     ...cellSx,
//                     width: col.width,
//                     p: 0.5,
//                     backgroundColor: `${filterRowBg} !important`,
//                     borderBottom: `2px solid ${divider} !important`,
//                   }}
//                 >
//                   {col.filterKey ? (
//                     <TextInput
//                       control={control as any}
//                       name={col.filterKey as Path<TFilter>}
//                       placeholder={col.label}
//                       sx={filterInputSx}
//                     />
//                   ) : null}
//                 </TableCell>
//               ))}
//               <TableCell
//                 sx={{
//                   ...cellSx,
//                   width: 80,
//                   backgroundColor: `${filterRowBg} !important`,
//                   borderBottom: `2px solid ${divider} !important`,
//                 }}
//               />
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {isLoading ? (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length + 1}
//                   sx={{
//                     textAlign: "center",
//                     py: 4,
//                     color: textPrimary,
//                     backgroundColor: `${surfaceBg} !important`,
//                   }}
//                 >
//                   Loading…
//                 </TableCell>
//               </TableRow>
//             ) : paged.length === 0 ? (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length + 1}
//                   sx={{
//                     textAlign: "center",
//                     py: 4,
//                     color: textPrimary,
//                     backgroundColor: `${surfaceBg} !important`,
//                   }}
//                 >
//                   No records found.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               paged.map((row, idx) => {
//                 const rowBg = idx % 2 === 1 ? evenRowBg : oddRowBg;
//                 return (
//                   <TableRow
//                     key={String(row[rowKey])}
//                     sx={{
//                       "& .MuiTableCell-root": {
//                         backgroundColor: `${rowBg} !important`,
//                         color: textPrimary,
//                       },
//                       "&:hover .MuiTableCell-root": {
//                         backgroundColor: `${hoverRowBg} !important`,
//                       },
//                     }}
//                   >
//                     {columns.map((col) => (
//                       <TableCell key={String(col.key)} sx={cellSx}>
//                         {col.render
//                           ? col.render(row)
//                           : String(row[col.key as keyof T] ?? "")}
//                       </TableCell>
//                     ))}
//                     <TableCell
//                       sx={{
//                         ...cellSx,
//                         width: 80,
//                         position: "sticky",
//                         right: 0,
//                         zIndex: 1,
//                       }}
//                     >
//                       <Box
//                         onClick={() => onSelect(row)}
//                         sx={{
//                           display: "inline-block",
//                           px: 1.25,
//                           py: 0.25,
//                           backgroundColor: selectBtnBg,
//                           color: "#fff",
//                           borderRadius: 0.75,
//                           fontSize: 11,
//                           fontWeight: 600,
//                           cursor: "pointer",
//                           userSelect: "none",
//                           transition: "background 0.15s",
//                           textAlign: "center",
//                           "&:hover": { backgroundColor: selectBtnHover },
//                         }}
//                       >
//                         Select
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </>
//   );
// }

// components/form/TableWithFilter.tsx
"use client";

import React, { useEffect } from "react";
import {
  useForm,
  useWatch,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Pagination as MuiPagination,
  useTheme,
} from "@mui/material";
import { FirstPage, LastPage } from "@mui/icons-material";
import TextInput from "@/components/form/TextInput";
import type { LookupColumn } from "types/lookup";

export interface TableWithFilterProps<
  T extends Record<string, any>,
  TFilter extends FieldValues,
> {
  data: T[];
  columns: LookupColumn<T>[];
  filterDefaults: TFilter;
  rowKey: keyof T;
  onSelect: (row: T) => void;
  pageSize?: number;
  isLoading?: boolean;
  resetKey?: unknown;
  showGroupByHint?: boolean;
  maxHeight?: number | string;
}

export default function TableWithFilter<
  T extends Record<string, any>,
  TFilter extends FieldValues,
>(props: TableWithFilterProps<T, TFilter>) {
  const {
    data,
    columns,
    filterDefaults,
    rowKey,
    onSelect,
    pageSize = 10,
    isLoading = false,
    resetKey,
    showGroupByHint = true,
    maxHeight = 500,
  } = props;

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const surfaceBg = isDark ? "#1e293b" : "#ffffff";
  const surfaceSunken = isDark ? "#0f172a" : "#f1f5f9";
  const surfaceRaised = isDark ? "#243347" : "#f8fafc";
  const headerBg = isDark ? "#1e3a5f" : "#2c4a7a";
  const headerText = "#ffffff";
  const oddRowBg = isDark ? "#1e293b" : "#ffffff";
  const evenRowBg = isDark ? "#243347" : "#f8fafc";
  const hoverRowBg = isDark ? "#2d4a6a" : "#e8f0fe";
  const filterRowBg = isDark ? "#162032" : "#f0f4f8";
  const inputBg = isDark ? "#0f172a" : "#ffffff";
  const inputBorder = isDark ? "#334155" : "#cbd5e1";
  const inputText = isDark ? "#e2e8f0" : "#111827";
  const inputHolder = isDark ? "#64748b" : "#9ca3af";
  const textPrimary = isDark ? "#f1f5f9" : "#111827";
  const textSecondary = isDark ? "#94a3b8" : "#6b7280";
  const divider = isDark ? "#334155" : "#e2e8f0";
  const selectBtnBg = "#2c6fad";
  const selectBtnHover = "#1a5a96";
  const paginationSelectedBg = isDark ? "#2c4a7a" : "#e3edfa";

  const cellSx = {
    fontSize: 12,
    py: 0.6,
    px: 1,
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    borderRight: `1px solid ${divider}`,
    borderBottom: `1px solid ${divider}`,
    color: textPrimary,
  };

  const filterInputSx = {
    width: "100%",
    "& .MuiInputBase-root": {
      fontSize: 11,
      height: 24,
      backgroundColor: inputBg,
      color: inputText,
    },
    "& .MuiOutlinedInput-input": {
      py: 0,
      px: 0.75,
      color: inputText,
      "&::placeholder": { color: inputHolder, opacity: 1 },
    },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: inputBorder },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: textSecondary,
    },
    "& .MuiFormHelperText-root": { display: "none" },
  };

  const { control, reset } = useForm<TFilter>({
    defaultValues: filterDefaults as any,
  });
  const filters = useWatch({ control });
  const [page, setPage] = React.useState(1);
  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    reset(filterDefaults as any);
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    setPage(1);
  }, [filterKey]);

  const filterKeys = Object.keys(filterDefaults as object);

  const filtered = data.filter((row) =>
    filterKeys.every((key) => {
      const val = ((filters as any)[key] as string) ?? "";
      return val
        ? String(row[key]).toLowerCase().includes(val.toLowerCase())
        : true;
    }),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1,
          backgroundColor: surfaceSunken,
          borderBottom: `1px solid ${divider}`,
        }}
      >
        <Typography variant="body2" sx={{ color: textSecondary }}>
          {isLoading
            ? "Loading…"
            : `Page ${page} / ${totalPages} (${filtered.length} items)`}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Tooltip title="First page">
            <IconButton
              size="small"
              onClick={() => setPage(1)}
              sx={{ color: textPrimary }}
            >
              <FirstPage />
            </IconButton>
          </Tooltip>
          <MuiPagination
            page={page}
            count={totalPages}
            onChange={(_, v) => setPage(v)}
            size="small"
            siblingCount={2}
            boundaryCount={1}
            sx={{
              "& .MuiPaginationItem-root": {
                minWidth: 28,
                height: 28,
                fontSize: 12,
                color: textPrimary,
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: paginationSelectedBg,
                color: selectBtnBg,
              },
            }}
          />
          <Tooltip title="Last page">
            <IconButton
              size="small"
              onClick={() => setPage(totalPages)}
              sx={{ color: textPrimary }}
            >
              <LastPage />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {showGroupByHint && (
        <Box
          sx={{
            px: 2,
            py: 0.75,
            backgroundColor: surfaceRaised,
            borderBottom: `1px solid ${divider}`,
          }}
        >
          <Typography variant="caption" sx={{ color: textSecondary }}>
            Drag a column header here to group by that column
          </Typography>
        </Box>
      )}

      <TableContainer
        component={Paper}
        sx={{
          maxHeight,
          overflowX: "auto",
          backgroundColor: surfaceBg,
          backgroundImage: "none",
          border: `1px solid ${divider}`,
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={String(col.key)}
                  sx={{
                    ...cellSx,
                    width: col.width,
                    backgroundColor: `${headerBg} !important`,
                    color: `${headerText} !important`,
                    fontWeight: 700,
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
              <TableCell
                sx={{
                  ...cellSx,
                  width: 80,
                  backgroundColor: `${headerBg} !important`,
                  color: `${headerText} !important`,
                  fontWeight: 700,
                  position: "sticky",
                  right: 0,
                  zIndex: 4,
                }}
              >
                Action
              </TableCell>
            </TableRow>

            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={String(col.key)}
                  sx={{
                    ...cellSx,
                    width: col.width,
                    p: 0.5,
                    backgroundColor: `${filterRowBg} !important`,
                    borderBottom: `2px solid ${divider} !important`,
                  }}
                >
                  {col.filterKey ? (
                    <TextInput
                      control={control as any}
                      name={col.filterKey as Path<TFilter>}
                      placeholder={col.label}
                      sx={filterInputSx}
                    />
                  ) : null}
                </TableCell>
              ))}
              <TableCell
                sx={{
                  ...cellSx,
                  width: 80,
                  backgroundColor: `${filterRowBg} !important`,
                  borderBottom: `2px solid ${divider} !important`,
                }}
              />
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  sx={{
                    textAlign: "center",
                    py: 4,
                    color: textPrimary,
                    backgroundColor: `${surfaceBg} !important`,
                  }}
                >
                  Loading…
                </TableCell>
              </TableRow>
            ) : paged.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  sx={{
                    textAlign: "center",
                    py: 4,
                    color: textPrimary,
                    backgroundColor: `${surfaceBg} !important`,
                  }}
                >
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              paged.map((row, idx) => {
                const rowBg = idx % 2 === 1 ? evenRowBg : oddRowBg;
                return (
                  <TableRow
                    key={String(row[rowKey])}
                    sx={{
                      "& .MuiTableCell-root": {
                        backgroundColor: `${rowBg} !important`,
                        color: textPrimary,
                      },
                      "&:hover .MuiTableCell-root": {
                        backgroundColor: `${hoverRowBg} !important`,
                      },
                    }}
                  >
                    {columns.map((col) => (
                      <TableCell key={String(col.key)} sx={cellSx}>
                        {col.render
                          ? col.render(row)
                          : String(row[col.key as keyof T] ?? "")}
                      </TableCell>
                    ))}
                    <TableCell
                      sx={{
                        ...cellSx,
                        width: 80,
                        position: "sticky",
                        right: 0,
                        zIndex: 1,
                      }}
                    >
                      <Box
                        onClick={() => onSelect(row)}
                        sx={{
                          display: "inline-block",
                          px: 1.25,
                          py: 0.25,
                          backgroundColor: selectBtnBg,
                          color: "#fff",
                          borderRadius: 0.75,
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                          userSelect: "none",
                          transition: "background 0.15s",
                          textAlign: "center",
                          "&:hover": { backgroundColor: selectBtnHover },
                        }}
                      >
                        Select
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
