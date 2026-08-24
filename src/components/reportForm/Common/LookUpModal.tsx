// "use client";

// import React, { useEffect } from "react";
// import { useForm, useWatch } from "react-hook-form";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
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
//   Pagination,
//   Chip,
//   Tooltip,
//   useTheme,
// } from "@mui/material";
// import { Close, FirstPage, LastPage } from "@mui/icons-material";
// import TextInput from "@/components/form/TextInput";
// import type { MemberRecord } from "@/contexts/ReportFormContext";

// // ── Types ─────────────────────────────────────────────────────────────────────

// export interface MemberFilterFields {
//   centerName: string;
//   centerCode: string;
//   groupName: string;
//   groupCode: string;
//   officeName: string;
//   memberId: string;
//   memberName: string;
//   gender: string;
//   temporaryAddress: string;
//   mobileNo: string;
// }

// export interface MemberLookupModalProps {
//   open: boolean;
//   onClose: () => void;
//   onSelect: (member: MemberRecord) => void;
//   data: MemberRecord[];
//   pageSize?: number;
//   title?: string;
// }

// // ── Columns ───────────────────────────────────────────────────────────────────

// const COLUMNS: {
//   key: keyof MemberRecord | "#";
//   label: string;
//   filterKey?: keyof MemberFilterFields;
//   width: number | string;
// }[] = [
//   { key: "#", label: "#", width: 50 },
//   {
//     key: "centerName",
//     label: "Center Name",
//     filterKey: "centerName",
//     width: 160,
//   },
//   {
//     key: "centerCode",
//     label: "CenterCode",
//     filterKey: "centerCode",
//     width: 100,
//   },
//   { key: "groupName", label: "Group Name", filterKey: "groupName", width: 160 },
//   { key: "groupCode", label: "GroupCode", filterKey: "groupCode", width: 100 },
//   {
//     key: "officeName",
//     label: "Office Name",
//     filterKey: "officeName",
//     width: 140,
//   },
//   { key: "memberId", label: "Member Id", filterKey: "memberId", width: 110 },
//   {
//     key: "memberName",
//     label: "Member Name",
//     filterKey: "memberName",
//     width: 150,
//   },
//   { key: "gender", label: "Gender", filterKey: "gender", width: 90 },
//   {
//     key: "temporaryAddress",
//     label: "Temporary Address",
//     filterKey: "temporaryAddress",
//     width: 150,
//   },
//   { key: "mobileNo", label: "Mobile No", filterKey: "mobileNo", width: 120 },
// ];

// const FILTER_DEFAULTS: MemberFilterFields = {
//   centerName: "",
//   centerCode: "",
//   groupName: "",
//   groupCode: "",
//   officeName: "",
//   memberId: "",
//   memberName: "",
//   gender: "",
//   temporaryAddress: "",
//   mobileNo: "",
// };

// // ── Component ─────────────────────────────────────────────────────────────────

// export default function MemberLookUpModal({
//   open,
//   onClose,
//   onSelect,
//   data,
//   pageSize = 10,
//   title = "Member Directory",
// }: MemberLookupModalProps) {
//   const theme = useTheme();
//   const isDark = theme.palette.mode === "dark";

//   // ── Color tokens — all from theme.palette, no theme.vars ─────────────────

//   const surfaceBg = isDark ? "#1e293b" : "#ffffff";
//   const surfaceSunken = isDark ? "#0f172a" : "#f1f5f9";
//   const surfaceRaised = isDark ? "#243347" : "#f8fafc";
//   const headerBg = isDark ? "#1e3a5f" : "#2c4a7a";
//   const headerText = "#ffffff";
//   const oddRowBg = isDark ? "#1e293b" : "#ffffff";
//   const evenRowBg = isDark ? "#243347" : "#f8fafc";
//   const hoverRowBg = isDark ? "#2d4a6a" : "#e8f0fe";
//   const filterRowBg = isDark ? "#162032" : "#f0f4f8";
//   const inputBg = isDark ? "#0f172a" : "#ffffff";
//   const inputBorder = isDark ? "#334155" : "#cbd5e1";
//   const inputText = isDark ? "#e2e8f0" : "#111827";
//   const inputHolder = isDark ? "#64748b" : "#9ca3af";
//   const textPrimary = isDark ? "#f1f5f9" : "#111827";
//   const textSecondary = isDark ? "#94a3b8" : "#6b7280";
//   const divider = isDark ? "#334155" : "#e2e8f0";
//   const selectBtnBg = "#2c6fad";
//   const selectBtnHover = "#1a5a96";

//   // ── Shared styles ─────────────────────────────────────────────────────────

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
//       borderColor: isDark ? "#64748b" : "#94a3b8",
//     },
//     "& .MuiFormHelperText-root": { display: "none" },
//   };

//   // ── Form ──────────────────────────────────────────────────────────────────

//   const { control, reset } = useForm<MemberFilterFields>({
//     defaultValues: FILTER_DEFAULTS,
//   });
//   const filters = useWatch({ control });
//   const [page, setPage] = React.useState(1);

//   useEffect(() => {
//     if (open) {
//       reset(FILTER_DEFAULTS);
//       setPage(1);
//     }
//   }, [open, reset]);

//   useEffect(() => {
//     setPage(1);
//   }, [JSON.stringify(filters)]);

//   const filtered = data.filter((row) =>
//     (Object.keys(FILTER_DEFAULTS) as (keyof MemberFilterFields)[]).every(
//       (key) => {
//         const val = (filters[key] as string) ?? "";
//         return val
//           ? String(row[key]).toLowerCase().includes(val.toLowerCase())
//           : true;
//       },
//     ),
//   );

//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
//   const handleSelect = (member: MemberRecord) => {
//     onSelect(member);
//     onClose();
//   };

//   // ── Render ────────────────────────────────────────────────────────────────

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="lg"
//       fullWidth
//       sx={{
//         // Target the Paper directly — this wins over everything including
//         // MuiPaper theme overrides and MUI's internal Dialog Paper styles
//         "& .MuiDialog-paper": {
//           backgroundColor: `${surfaceBg} !important`,
//           backgroundImage: "none !important",
//           color: textPrimary,
//           border: isDark ? `1px solid ${divider}` : "none",
//         },
//       }}
//     >
//       {/* ── Title ── */}
//       <DialogTitle
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           backgroundColor: surfaceBg,
//           borderBottom: `1px solid ${divider}`,
//           py: 1.5,
//           px: 2,
//         }}
//       >
//         <Typography
//           variant="h6"
//           component="span"
//           sx={{ color: textPrimary, fontWeight: 600 }}
//         >
//           {title}
//         </Typography>
//         <IconButton size="small" onClick={onClose} sx={{ color: textPrimary }}>
//           <Close />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent sx={{ p: 0, backgroundColor: surfaceBg }}>
//         {/* ── Pagination bar ── */}
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             px: 2,
//             py: 1,
//             backgroundColor: surfaceSunken,
//             borderBottom: `1px solid ${divider}`,
//           }}
//         >
//           <Typography variant="body2" sx={{ color: textSecondary }}>
//             Page {page} / {totalPages} ({filtered.length} items)
//           </Typography>
//           <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//             <Tooltip title="First page">
//               <IconButton
//                 size="small"
//                 onClick={() => setPage(1)}
//                 sx={{ color: textPrimary }}
//               >
//                 <FirstPage />
//               </IconButton>
//             </Tooltip>
//             <Pagination
//               page={page}
//               count={totalPages}
//               onChange={(_, v) => setPage(v)}
//               size="small"
//               siblingCount={2}
//               boundaryCount={1}
//               sx={{
//                 "& .MuiPaginationItem-root": {
//                   minWidth: 28,
//                   height: 28,
//                   fontSize: 12,
//                   color: textPrimary,
//                 },
//                 "& .MuiPaginationItem-root.Mui-selected": {
//                   backgroundColor: isDark ? "#1e3a5f" : "#2c4a7a",
//                   color: "#ffffff",
//                 },
//               }}
//             />
//             <Tooltip title="Last page">
//               <IconButton
//                 size="small"
//                 onClick={() => setPage(totalPages)}
//                 sx={{ color: textPrimary }}
//               >
//                 <LastPage />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         </Box>

//         {/* ── Group-by hint ── */}
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

//         {/* ── Table ── */}
//         <TableContainer
//           component={Paper}
//           sx={{
//             maxHeight: 500,
//             overflowX: "auto",
//             // Override the Paper AND TableContainer backgrounds
//             backgroundColor: `${surfaceBg} !important`,
//             backgroundImage: "none !important",
//             border: `1px solid ${divider}`,
//           }}
//         >
//           <Table stickyHeader size="small">
//             <TableHead>
//               {/* Header row */}
//               <TableRow>
//                 {COLUMNS.map((col) => (
//                   <TableCell
//                     key={col.key}
//                     sx={{
//                       ...cellSx,
//                       width: col.width,
//                       backgroundColor: `${headerBg} !important`,
//                       color: `${headerText} !important`,
//                       fontWeight: 700,
//                     }}
//                   >
//                     {col.label}
//                   </TableCell>
//                 ))}
//                 <TableCell
//                   sx={{
//                     ...cellSx,
//                     width: 80,
//                     backgroundColor: `${headerBg} !important`,
//                     color: `${headerText} !important`,
//                     fontWeight: 700,
//                     position: "sticky",
//                     right: 0,
//                     zIndex: 4,
//                   }}
//                 >
//                   Action
//                 </TableCell>
//               </TableRow>

//               {/* Filter row */}
//               <TableRow>
//                 <TableCell
//                   sx={{
//                     ...cellSx,
//                     width: 50,
//                     backgroundColor: `${filterRowBg} !important`,
//                   }}
//                 />
//                 {COLUMNS.slice(1).map((col) => (
//                   <TableCell
//                     key={col.key}
//                     sx={{
//                       ...cellSx,
//                       width: col.width,
//                       p: 0.5,
//                       backgroundColor: `${filterRowBg} !important`,
//                       borderBottom: `2px solid ${divider} !important`,
//                     }}
//                   >
//                     {col.filterKey ? (
//                       <TextInput
//                         control={control}
//                         name={col.filterKey}
//                         placeholder={col.label}
//                         sx={filterInputSx}
//                       />
//                     ) : null}
//                   </TableCell>
//                 ))}
//                 <TableCell
//                   sx={{
//                     ...cellSx,
//                     width: 80,
//                     backgroundColor: `${filterRowBg} !important`,
//                     borderBottom: `2px solid ${divider} !important`,
//                   }}
//                 />
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {paged.length === 0 ? (
//                 <TableRow>
//                   <TableCell
//                     colSpan={COLUMNS.length + 1}
//                     sx={{
//                       textAlign: "center",
//                       py: 4,
//                       color: textPrimary,
//                       backgroundColor: `${surfaceBg} !important`,
//                     }}
//                   >
//                     No records found.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 paged.map((row, idx) => {
//                   const rowNumber = (page - 1) * pageSize + idx + 1;
//                   const rowBg = idx % 2 === 1 ? evenRowBg : oddRowBg;

//                   return (
//                     <TableRow
//                       key={row.memMemberRegistrationId}
//                       sx={{
//                         "& .MuiTableCell-root": {
//                           backgroundColor: `${rowBg} !important`,
//                           color: textPrimary,
//                         },
//                         "&:hover .MuiTableCell-root": {
//                           backgroundColor: `${hoverRowBg} !important`,
//                         },
//                       }}
//                     >
//                       <TableCell sx={cellSx}>{rowNumber}</TableCell>
//                       <TableCell sx={cellSx}>{row.centerName}</TableCell>
//                       <TableCell sx={cellSx}>{row.centerCode}</TableCell>
//                       <TableCell sx={cellSx}>{row.groupName}</TableCell>
//                       <TableCell sx={cellSx}>{row.groupCode}</TableCell>
//                       <TableCell sx={cellSx}>{row.officeName}</TableCell>
//                       <TableCell sx={cellSx}>{row.memberId}</TableCell>
//                       <TableCell sx={cellSx}>{row.memberName}</TableCell>
//                       <TableCell sx={cellSx}>
//                         <Chip
//                           label={row.gender}
//                           size="small"
//                           sx={
//                             isDark
//                               ? { backgroundColor: "#1e3a5f", color: "#e2e8f0" }
//                               : {}
//                           }
//                         />
//                       </TableCell>
//                       <TableCell sx={cellSx}>{row.temporaryAddress}</TableCell>
//                       <TableCell sx={cellSx}>{row.mobileNo}</TableCell>

//                       <TableCell
//                         sx={{
//                           ...cellSx,
//                           width: 80,
//                           position: "sticky",
//                           right: 0,
//                           zIndex: 1,
//                         }}
//                       >
//                         <Box
//                           onClick={() => handleSelect(row)}
//                           sx={{
//                             display: "inline-block",
//                             px: 1.25,
//                             py: 0.25,
//                             backgroundColor: selectBtnBg,
//                             color: "#fff",
//                             borderRadius: 0.75,
//                             fontSize: 11,
//                             fontWeight: 600,
//                             cursor: "pointer",
//                             userSelect: "none",
//                             transition: "background 0.15s",
//                             textAlign: "center",
//                             "&:hover": { backgroundColor: selectBtnHover },
//                           }}
//                         >
//                           Select
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* ── Footer ── */}
//         <Box
//           sx={{
//             px: 2,
//             py: 1.5,
//             backgroundColor: surfaceSunken,
//             borderTop: `1px solid ${divider}`,
//           }}
//         >
//           <Typography variant="caption" sx={{ color: textSecondary }}>
//             © Copyright 2013-2026 Pioneer Associate Pvt.Ltd. All Rights
//             Reserved.
//           </Typography>
//         </Box>
//       </DialogContent>
//     </Dialog>
//   );
// }

// components/reportForm/Common/LookUpModal.tsx

// components/reportForm/Common/LookUpModal.tsx
"use client";

import React from "react";
import type { FieldValues } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import { Close } from "@mui/icons-material";
// NOTE: TableWithFilter.tsx lives at components/form/TableWithFilter.tsx,
// while this file is at components/reportForm/Common/LookUpModal.tsx —
// they are NOT in the same folder, so "./TableWithFilter" doesn't resolve.
// Use the "@" alias (already used for TextInput/types imports elsewhere)
// instead of a relative path.
import TableWithFilter from "@/components/form/TableWithFilter";
import type { LookupColumn } from "types/lookup";

export interface LookUpModalProps<
  T extends Record<string, any>,
  TFilter extends FieldValues,
> {
  open: boolean;
  onClose: () => void;
  onSelect: (row: T) => void;
  data: T[];
  columns: LookupColumn<T>[];
  filterDefaults: TFilter;
  rowKey: keyof T;
  pageSize?: number;
  title?: string;
  isLoading?: boolean;
  /** Optional content rendered below the table (e.g. "loading more" status). */
  footer?: React.ReactNode;
}

export default function LookUpModal<
  T extends Record<string, any>,
  TFilter extends FieldValues,
>({
  open,
  onClose,
  onSelect,
  data,
  columns,
  filterDefaults,
  rowKey,
  pageSize = 10,
  title = "Directory",
  isLoading = false,
  footer,
}: LookUpModalProps<T, TFilter>) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const surfaceBg = isDark ? "#1e293b" : "#ffffff";
  const surfaceSunken = isDark ? "#0f172a" : "#f1f5f9";
  const textPrimary = isDark ? "#f1f5f9" : "#111827";
  const textSecondary = isDark ? "#94a3b8" : "#6b7280";
  const divider = isDark ? "#334155" : "#e2e8f0";

  const handleSelect = (row: T) => {
    onSelect(row);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: `${surfaceBg} !important`,
          backgroundImage: "none !important",
          color: textPrimary,
          border: isDark ? `1px solid ${divider}` : "none",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: surfaceBg,
          borderBottom: `1px solid ${divider}`,
          py: 1.5,
          px: 2,
        }}
      >
        <Typography
          variant="h6"
          component="span"
          sx={{ color: textPrimary, fontWeight: 600 }}
        >
          {title}
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: textPrimary }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, backgroundColor: surfaceBg }}>
        <TableWithFilter
          data={data}
          columns={columns}
          filterDefaults={filterDefaults}
          rowKey={rowKey}
          onSelect={handleSelect}
          pageSize={pageSize}
          isLoading={isLoading}
          resetKey={open} // ← resets filters/page every time the modal reopens
        />

        {footer && (
          <Box
            sx={{
              px: 2,
              py: 1,
              backgroundColor: surfaceSunken,
              borderTop: `1px solid ${divider}`,
            }}
          >
            {footer}
          </Box>
        )}

        <Box
          sx={{
            px: 2,
            py: 1.5,
            backgroundColor: surfaceSunken,
            borderTop: `1px solid ${divider}`,
          }}
        >
          <Typography variant="caption" sx={{ color: textSecondary }}>
            © Copyright 2013-2026 Pioneer Associate Pvt.Ltd. All Rights
            Reserved.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
