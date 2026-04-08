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
//   Divider,
//   alpha,
//   useTheme,
// } from "@mui/material";
// import { Close, Search, FirstPage, LastPage } from "@mui/icons-material";

// // ── Import your custom form components ───────────────────────────────────────
// import TextInput from "@/components/form/TextInput";

// // ── Types ─────────────────────────────────────────────────────────────────────
// export interface MemberRecord {
//   id: number;
//   centerName: string;
//   centerCode: string;
//   groupName: string;
//   groupCode: string;
//   officeName: string;
//   memberId: string;
//   memberName: string;
//   gender: "Male" | "Female" | "Other";
//   temporaryAddress: string;
//   mobileNo: string;
// }

// /**
//  * Filter form shape — one field per filterable column.
//  * Managed entirely by react-hook-form so every TextInput is a controlled field.
//  */
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

// // ── Column definitions ────────────────────────────────────────────────────────
// const COLUMNS: {
//   key: keyof MemberRecord | "#";
//   label: string;
//   filterKey?: keyof MemberFilterFields;
//   width?: number | string;
// }[] = [
//   { key: "#", label: "#", width: 48 },
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

// // ── Compact sx override passed to every filter TextInput ─────────────────────
// // Strips the floating label, shrinks height to fit inside the filter row.
// const filterInputSx = {
//   width: "100%",
//   "& .MuiInputBase-root": {
//     fontSize: 11,
//     height: 24,
//     bgcolor: "#fff",
//   },
//   "& .MuiOutlinedInput-input": { py: 0, px: 0.75 },
//   // Hide helper text so validation messages don't expand the row
//   "& .MuiFormHelperText-root": { display: "none" },
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

//   // ── Filter form ────────────────────────────────────────────────────────
//   const { control, reset } = useForm<MemberFilterFields>({
//     defaultValues: FILTER_DEFAULTS,
//   });

//   // Reactively watch every filter field — triggers re-filter on each keystroke
//   const filters = useWatch({ control });

//   // Local pagination state
//   const [page, setPage] = React.useState(1);

//   // Reset filters + page every time the modal opens
//   useEffect(() => {
//     if (open) {
//       reset(FILTER_DEFAULTS);
//       setPage(1);
//     }
//   }, [open, reset]);

//   // Jump back to page 1 whenever any filter value changes
//   const filtersKey = JSON.stringify(filters);
//   useEffect(() => {
//     setPage(1);
//   }, [filtersKey]);

//   // ── Filtering ──────────────────────────────────────────────────────────────
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

//   // ── Visual tokens ──────────────────────────────────────────────────────────
//   const headerBg = "#2c4a7a";
//   const headerText = "#fff";
//   const altRowBg = alpha(theme.palette.primary.main, 0.06);
//   const hoverRowBg = alpha(theme.palette.primary.main, 0.14);

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
//       {/* ── Title bar ───────────────────────────────────────────────────────── */}
//       <DialogTitle
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <Typography variant="h6">{title}</Typography>
//         <IconButton size="small" onClick={onClose}>
//           <Close />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent sx={{ p: 0 }}>
//         {/* ── Pagination info bar ─────────────────────────────────────────── */}
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             p: 2,
//             bgcolor: "#f5f5f5",
//           }}
//         >
//           <Typography variant="body2">
//             Page {page} / {totalPages} ({filtered.length} items)
//           </Typography>
//           <Box sx={{ display: "flex", gap: 1 }}>
//             <Tooltip title="First page">
//               <IconButton size="small" onClick={() => setPage(1)}>
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
//                 },
//               }}
//             />
//             <Tooltip title="Last page">
//               <IconButton size="small" onClick={() => setPage(totalPages)}>
//                 <LastPage />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         </Box>

//         {/* ── Group-by hint ──────────────────────────────────────────────── */}
//         <Box
//           sx={{ p: 1, bgcolor: "#f9f9f9", borderBottom: "1px solid #e0e0e0" }}
//         >
//           <Typography variant="caption" sx={{ color: "#666" }}>
//             Drag a column header here to group by that column
//           </Typography>
//         </Box>

//         {/* ── Table ──────────────────────────────────────────────────────── */}
//         <TableContainer
//           component={Paper}
//           sx={{ maxHeight: "500px", overflow: "auto" }}
//         >
//           <Table stickyHeader>
//             {/* ── Column header row + Filter row (both sticky) ─────────── */}
//             <TableHead>
//               {/* Column labels */}
//               <TableRow sx={{ bgcolor: headerBg }}>
//                 {COLUMNS.map((col) => (
//                   <TableCell
//                     key={col.key}
//                     sx={{
//                       ...cellSx,
//                       width: col.width,
//                       bgcolor: headerBg,
//                       color: headerText,
//                       fontWeight: 600,
//                     }}
//                   >
//                     {col.label}
//                   </TableCell>
//                 ))}
//                 {/* Action column */}
//                 <TableCell
//                   sx={{
//                     ...cellSx,
//                     bgcolor: headerBg,
//                     color: headerText,
//                     fontWeight: 600,
//                   }}
//                 >
//                   Action
//                 </TableCell>
//               </TableRow>

//               {/* Filter row — TextInput per column, wired to react-hook-form */}
//               <TableRow
//                 sx={{ bgcolor: "#fafafa", borderBottom: "2px solid #e0e0e0" }}
//               >
//                 {/* # column — no filter input */}
//                 <TableCell sx={{ ...cellSx, width: 48 }} />
//                 {COLUMNS.slice(1).map((col) => (
//                   <TableCell
//                     key={col.key}
//                     sx={{ ...cellSx, width: col.width, p: 0.5 }}
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
//                 {/* Action column — no filter */}
//                 <TableCell sx={{ ...cellSx }} />
//               </TableRow>
//             </TableHead>

//             {/* ── Body ───────────────────────────────────────────────────── */}
//             <TableBody>
//               {paged.length === 0 ? (
//                 <TableRow>
//                   <TableCell
//                     colSpan={COLUMNS.length + 1}
//                     sx={{ textAlign: "center", py: 4 }}
//                   >
//                     No records found.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 paged.map((row, idx) => {
//                   const rowNumber = (page - 1) * pageSize + idx + 1;
//                   const isAlt = idx % 2 === 1;

//                   return (
//                     <TableRow
//                       key={row.id}
//                       sx={{
//                         bgcolor: isAlt ? altRowBg : "#fff",
//                         "&:hover": { bgcolor: hoverRowBg },
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
//                         <Chip label={row.gender} size="small" />
//                       </TableCell>
//                       <TableCell sx={cellSx}>{row.temporaryAddress}</TableCell>
//                       <TableCell sx={cellSx}>{row.mobileNo}</TableCell>

//                       {/* Select action */}
//                       <TableCell sx={cellSx}>
//                         <Box
//                           onClick={() => handleSelect(row)}
//                           sx={{
//                             display: "inline-block",
//                             px: 1.25,
//                             py: 0.25,
//                             bgcolor: "#2c6fad",
//                             color: "#fff",
//                             borderRadius: 0.75,
//                             fontSize: 11,
//                             fontWeight: 600,
//                             cursor: "pointer",
//                             userSelect: "none",
//                             transition: "background 0.15s",
//                             "&:hover": { bgcolor: "#1a5a96" },
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

//         {/* ── Footer ─────────────────────────────────────────────────────── */}
//         <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderTop: "1px solid #e0e0e0" }}>
//           <Typography variant="caption">
//             © Copyright 2013-2026 Pioneer Associate Pvt.Ltd. All Rights
//             Reserved.
//           </Typography>
//         </Box>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // ── Shared cell styles ────────────────────────────────────────────────────────
// const cellSx = {
//   fontSize: 12,
//   py: 0.6,
//   px: 1,
//   whiteSpace: "nowrap",
//   overflow: "hidden",
//   textOverflow: "ellipsis",
//   borderRight: "1px solid #f0f0f0",
// };

// "use client";

// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
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
//   CircularProgress,
//   TextField,
//   InputAdornment,
//   alpha,
//   useTheme,
// } from "@mui/material";
// import {
//   Close,
//   FirstPage,
//   LastPage,
//   Search as SearchIcon,
// } from "@mui/icons-material";
// import { useReportForm } from "@/contexts/ReportFormContext";
// import type { MemberRecord } from "@/contexts/ReportFormContext";

// interface MemberLookUpModalProps {
//   open: boolean;
//   onClose: () => void;
//   onSelect: (member: MemberRecord) => void;
//   title?: string;
// }

// interface FilterForm {
//   memberId: string;
//   memberName: string;
//   groupName: string;
//   centerName: string;
//   gender: string;
//   mobileNo: string;
//   officeName: string;
// }

// const defaultFilters: FilterForm = {
//   memberId: "",
//   memberName: "",
//   groupName: "",
//   centerName: "",
//   gender: "",
//   mobileNo: "",
//   officeName: "",
// };

// export default function MemberLookUpModal({
//   open,
//   onClose,
//   onSelect,
//   title = "Member Directory",
// }: MemberLookUpModalProps) {
//   const theme = useTheme();
//   const {
//     members,
//     totalPages,
//     currentPage,
//     isLoading,
//     error,
//     searchMembers,
//     clearResults,
//   } = useReportForm();
//   const [filters, setFilters] = useState<FilterForm>(defaultFilters);
//   const [debouncedFilters, setDebouncedFilters] =
//     useState<FilterForm>(defaultFilters);

//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedFilters(filters), 500);
//     return () => clearTimeout(timer);
//   }, [filters]);

//   useEffect(() => {
//     if (open) {
//       searchMembers({
//         Page: 1,
//         MemberId: debouncedFilters.memberId || undefined,
//         MemberName: debouncedFilters.memberName || undefined,
//         GroupName: debouncedFilters.groupName || undefined,
//         CenterName: debouncedFilters.centerName || undefined,
//         Gender: debouncedFilters.gender || undefined,
//         MobileNo: debouncedFilters.mobileNo || undefined,
//         OfficeName: debouncedFilters.officeName || undefined,
//       });
//     } else {
//       clearResults();
//       setFilters(defaultFilters);
//       setDebouncedFilters(defaultFilters);
//     }
//   }, [open, debouncedFilters, searchMembers, clearResults]);

//   const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
//     searchMembers({
//       Page: page,
//       MemberId: debouncedFilters.memberId || undefined,
//       MemberName: debouncedFilters.memberName || undefined,
//       GroupName: debouncedFilters.groupName || undefined,
//       CenterName: debouncedFilters.centerName || undefined,
//       Gender: debouncedFilters.gender || undefined,
//       MobileNo: debouncedFilters.mobileNo || undefined,
//       OfficeName: debouncedFilters.officeName || undefined,
//     });
//   };

//   const handleFilterChange = (field: keyof FilterForm, value: string) => {
//     setFilters((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSelect = (member: MemberRecord) => {
//     onSelect(member);
//     onClose();
//   };

//   const headerBg = "#2c4a7a";
//   const headerText = "#fff";
//   const altRowBg = alpha(theme.palette.primary.main, 0.06);
//   const hoverRowBg = alpha(theme.palette.primary.main, 0.14);

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
//       <DialogTitle
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <Typography variant="h6">{title}</Typography>
//         <IconButton size="small" onClick={onClose}>
//           <Close />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent sx={{ p: 0 }}>
//         <Box
//           sx={{ p: 2, bgcolor: "#f5f5f5", borderBottom: "1px solid #e0e0e0" }}
//         >
//           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
//             {[
//               { label: "Member ID", field: "memberId" },
//               { label: "Member Name", field: "memberName" },
//               { label: "Group Name", field: "groupName" },
//               { label: "Center Name", field: "centerName" },
//               { label: "Gender", field: "gender" },
//               { label: "Mobile No", field: "mobileNo" },
//               { label: "Office Name", field: "officeName" },
//             ].map(({ label, field }) => (
//               <TextField
//                 key={field}
//                 size="small"
//                 label={label}
//                 value={filters[field as keyof FilterForm]}
//                 onChange={(e) =>
//                   handleFilterChange(field as keyof FilterForm, e.target.value)
//                 }
//                 sx={{ minWidth: 150 }}
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <SearchIcon fontSize="small" />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             ))}
//           </Box>
//         </Box>

//         {isLoading ? (
//           <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
//             <CircularProgress />
//           </Box>
//         ) : error ? (
//           <Box sx={{ textAlign: "center", py: 8 }}>
//             <Typography color="error">{error}</Typography>
//           </Box>
//         ) : (
//           <>
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 p: 2,
//                 bgcolor: "#fafafa",
//               }}
//             >
//               <Typography variant="body2">
//                 Page {currentPage} / {totalPages} ({members.length} items)
//               </Typography>
//               <Box sx={{ display: "flex", gap: 1 }}>
//                 <Tooltip title="First page">
//                   <IconButton
//                     size="small"
//                     onClick={() => handlePageChange(null as any, 1)}
//                     disabled={currentPage === 1}
//                   >
//                     <FirstPage />
//                   </IconButton>
//                 </Tooltip>
//                 <Pagination
//                   page={currentPage}
//                   count={totalPages}
//                   onChange={handlePageChange}
//                   size="small"
//                   siblingCount={2}
//                   boundaryCount={1}
//                 />
//                 <Tooltip title="Last page">
//                   <IconButton
//                     size="small"
//                     onClick={() => handlePageChange(null as any, totalPages)}
//                     disabled={currentPage === totalPages}
//                   >
//                     <LastPage />
//                   </IconButton>
//                 </Tooltip>
//               </Box>
//             </Box>
//             <TableContainer
//               component={Paper}
//               sx={{ maxHeight: "500px", overflow: "auto" }}
//             >
//               <Table stickyHeader>
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: headerBg }}>
//                     <TableCell
//                       sx={{
//                         bgcolor: headerBg,
//                         color: headerText,
//                         fontWeight: 600,
//                         width: 48,
//                       }}
//                     >
//                       #
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         bgcolor: headerBg,
//                         color: headerText,
//                         fontWeight: 600,
//                       }}
//                     >
//                       Center Name
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         bgcolor: headerBg,
//                         color: headerText,
//                         fontWeight: 600,
//                       }}
//                     >
//                       Center Code
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         bgcolor: headerBg,
//                         color: headerText,
//                         fontWeight: 600,
//                       }}
//                     >
//                       Group Name
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         bgcolor: headerBg,
//                         color: headerText,
//                         fontWeight: 600,
//                       }}
//                     >
//                       Group Code
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         bgcolor: headerBg,
//                         color: headerText,
//                         fontWeight: 600,
//                       }}
//                     >
//                       Office Name
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         bgcolor: headerBg,
//                         color: headerText,
//                         fontWeight: 600,
//                       }}
//                     >
//                       Member ID
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         bgcolor: headerBg,
//                         color: headerText,
//                         fontWeight: 600,
//                       }}
//                     >
//                       Member Name
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         bgcolor: headerBg,
//                         color: headerText,
//                         fontWeight: 600,
//                       }}
//                     >
//                       Gender
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         bgcolor: headerBg,
//                         color: headerText,
//                         fontWeight: 600,
//                       }}
//                     >
//                       Temporary Address
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         bgcolor: headerBg,
//                         color: headerText,
//                         fontWeight: 600,
//                       }}
//                     >
//                       Mobile No
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         bgcolor: headerBg,
//                         color: headerText,
//                         fontWeight: 600,
//                       }}
//                     >
//                       Action
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {members.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={12}
//                         sx={{ textAlign: "center", py: 4 }}
//                       >
//                         No members found.
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     members.map((row, idx) => {
//                       const rowNumber = (currentPage - 1) * 10 + idx + 1;
//                       const isAlt = idx % 2 === 1;
//                       return (
//                         <TableRow
//                           key={row.memMemberRegistrationId}
//                           sx={{
//                             bgcolor: isAlt ? altRowBg : "#fff",
//                             "&:hover": { bgcolor: hoverRowBg },
//                           }}
//                         >
//                           <TableCell>{rowNumber}</TableCell>
//                           <TableCell>{row.centerName}</TableCell>
//                           <TableCell>{row.centerCode}</TableCell>
//                           <TableCell>{row.groupName}</TableCell>
//                           <TableCell>{row.groupCode}</TableCell>
//                           <TableCell>{row.officeName}</TableCell>
//                           <TableCell>{row.memberId}</TableCell>
//                           <TableCell>{row.memberName}</TableCell>
//                           <TableCell>
//                             <Chip label={row.gender} size="small" />
//                           </TableCell>
//                           <TableCell>{row.temporaryAddress}</TableCell>
//                           <TableCell>{row.mobileNo}</TableCell>
//                           <TableCell>
//                             <Box
//                               onClick={() => handleSelect(row)}
//                               sx={{
//                                 display: "inline-block",
//                                 px: 1.25,
//                                 py: 0.25,
//                                 bgcolor: "#2c6fad",
//                                 color: "#fff",
//                                 borderRadius: 0.75,
//                                 fontSize: 11,
//                                 fontWeight: 600,
//                                 cursor: "pointer",
//                                 "&:hover": { bgcolor: "#1a5a96" },
//                               }}
//                             >
//                               Select
//                             </Box>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//             <Box
//               sx={{ p: 2, bgcolor: "#f5f5f5", borderTop: "1px solid #e0e0e0" }}
//             >
//               <Typography variant="caption">
//                 © Copyright 2013-2026 Pioneer Associate Pvt.Ltd. All Rights
//                 Reserved.
//               </Typography>
//             </Box>
//           </>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
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
  Pagination,
  Chip,
  Tooltip,
  Divider,
  alpha,
  useTheme,
} from "@mui/material";
import { Close, Search, FirstPage, LastPage } from "@mui/icons-material";

// ── Import your custom form components ───────────────────────────────────────
import TextInput from "@/components/form/TextInput";
// ✅ Import the shared MemberRecord type from your context
import type { MemberRecord } from "@/contexts/ReportFormContext";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MemberFilterFields {
  centerName: string;
  centerCode: string;
  groupName: string;
  groupCode: string;
  officeName: string;
  memberId: string;
  memberName: string;
  gender: string;
  temporaryAddress: string;
  mobileNo: string;
}

export interface MemberLookupModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (member: MemberRecord) => void;
  data: MemberRecord[]; // ← now required (passed from context)
  pageSize?: number;
  title?: string;
}

// ── Column definitions ────────────────────────────────────────────────────────
const COLUMNS: {
  key: keyof MemberRecord | "#";
  label: string;
  filterKey?: keyof MemberFilterFields;
  width?: number | string;
}[] = [
  { key: "#", label: "#", width: 48 },
  {
    key: "centerName",
    label: "Center Name",
    filterKey: "centerName",
    width: 160,
  },
  {
    key: "centerCode",
    label: "CenterCode",
    filterKey: "centerCode",
    width: 100,
  },
  { key: "groupName", label: "Group Name", filterKey: "groupName", width: 160 },
  { key: "groupCode", label: "GroupCode", filterKey: "groupCode", width: 100 },
  {
    key: "officeName",
    label: "Office Name",
    filterKey: "officeName",
    width: 140,
  },
  { key: "memberId", label: "Member Id", filterKey: "memberId", width: 110 },
  {
    key: "memberName",
    label: "Member Name",
    filterKey: "memberName",
    width: 150,
  },
  { key: "gender", label: "Gender", filterKey: "gender", width: 90 },
  {
    key: "temporaryAddress",
    label: "Temporary Address",
    filterKey: "temporaryAddress",
    width: 150,
  },
  { key: "mobileNo", label: "Mobile No", filterKey: "mobileNo", width: 120 },
];

const FILTER_DEFAULTS: MemberFilterFields = {
  centerName: "",
  centerCode: "",
  groupName: "",
  groupCode: "",
  officeName: "",
  memberId: "",
  memberName: "",
  gender: "",
  temporaryAddress: "",
  mobileNo: "",
};

const filterInputSx = {
  width: "100%",
  "& .MuiInputBase-root": { fontSize: 11, height: 24, bgcolor: "#fff" },
  "& .MuiOutlinedInput-input": { py: 0, px: 0.75 },
  "& .MuiFormHelperText-root": { display: "none" },
};

const cellSx = {
  fontSize: 12,
  py: 0.6,
  px: 1,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  borderRight: "1px solid #f0f0f0",
};

export default function MemberLookUpModal({
  open,
  onClose,
  onSelect,
  data,
  pageSize = 10,
  title = "Member Directory",
}: MemberLookupModalProps) {
  const theme = useTheme();

  // ── Log the received data for debugging ─────────────────────────────────────
  useEffect(() => {
    if (open) {
      console.log("MemberLookUpModal received data:", data);
    }
  }, [open, data]);

  const { control, reset } = useForm<MemberFilterFields>({
    defaultValues: FILTER_DEFAULTS,
  });

  const filters = useWatch({ control });
  const [page, setPage] = React.useState(1);

  // Reset filters + page when modal opens
  useEffect(() => {
    if (open) {
      reset(FILTER_DEFAULTS);
      setPage(1);
    }
  }, [open, reset]);

  const filtersKey = JSON.stringify(filters);
  useEffect(() => {
    setPage(1);
  }, [filtersKey]);

  // ── Filtering (client-side) ────────────────────────────────────────────────
  const filtered = data.filter((row) =>
    (Object.keys(FILTER_DEFAULTS) as (keyof MemberFilterFields)[]).every(
      (key) => {
        const val = (filters[key] as string) ?? "";
        return val
          ? String(row[key]).toLowerCase().includes(val.toLowerCase())
          : true;
      },
    ),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSelect = (member: MemberRecord) => {
    onSelect(member);
    onClose();
  };

  const headerBg = "#2c4a7a";
  const headerText = "#fff";
  const altRowBg = alpha(theme.palette.primary.main, 0.06);
  const hoverRowBg = alpha(theme.palette.primary.main, 0.14);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Pagination info bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            bgcolor: "#f5f5f5",
          }}
        >
          <Typography variant="body2">
            Page {page} / {totalPages} ({filtered.length} items)
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="First page">
              <IconButton size="small" onClick={() => setPage(1)}>
                <FirstPage />
              </IconButton>
            </Tooltip>
            <Pagination
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
                },
              }}
            />
            <Tooltip title="Last page">
              <IconButton size="small" onClick={() => setPage(totalPages)}>
                <LastPage />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Group-by hint */}
        <Box
          sx={{ p: 1, bgcolor: "#f9f9f9", borderBottom: "1px solid #e0e0e0" }}
        >
          <Typography variant="caption" sx={{ color: "#666" }}>
            Drag a column header here to group by that column
          </Typography>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ maxHeight: "500px", overflow: "auto" }}
        >
          <Table stickyHeader>
            <TableHead>
              {/* Column headers */}
              <TableRow sx={{ bgcolor: headerBg }}>
                {COLUMNS.map((col) => (
                  <TableCell
                    key={col.key}
                    sx={{
                      ...cellSx,
                      width: col.width,
                      bgcolor: headerBg,
                      color: headerText,
                      fontWeight: 600,
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
                <TableCell
                  sx={{
                    ...cellSx,
                    bgcolor: headerBg,
                    color: headerText,
                    fontWeight: 600,
                  }}
                >
                  Action
                </TableCell>
              </TableRow>

              {/* Filter row */}
              <TableRow
                sx={{ bgcolor: "#fafafa", borderBottom: "2px solid #e0e0e0" }}
              >
                <TableCell sx={{ ...cellSx, width: 48 }} />
                {COLUMNS.slice(1).map((col) => (
                  <TableCell
                    key={col.key}
                    sx={{ ...cellSx, width: col.width, p: 0.5 }}
                  >
                    {col.filterKey ? (
                      <TextInput
                        control={control}
                        name={col.filterKey}
                        placeholder={col.label}
                        sx={filterInputSx}
                      />
                    ) : null}
                  </TableCell>
                ))}
                <TableCell sx={cellSx} />
              </TableRow>
            </TableHead>

            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={COLUMNS.length + 1}
                    sx={{ textAlign: "center", py: 4 }}
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((row, idx) => {
                  const rowNumber = (page - 1) * pageSize + idx + 1;
                  const isAlt = idx % 2 === 1;
                  return (
                    <TableRow
                      key={row.id}
                      sx={{
                        bgcolor: isAlt ? altRowBg : "#fff",
                        "&:hover": { bgcolor: hoverRowBg },
                      }}
                    >
                      <TableCell sx={cellSx}>{rowNumber}</TableCell>
                      <TableCell sx={cellSx}>{row.centerName}</TableCell>
                      <TableCell sx={cellSx}>{row.centerCode}</TableCell>
                      <TableCell sx={cellSx}>{row.groupName}</TableCell>
                      <TableCell sx={cellSx}>{row.groupCode}</TableCell>
                      <TableCell sx={cellSx}>{row.officeName}</TableCell>
                      <TableCell sx={cellSx}>{row.memberId}</TableCell>
                      <TableCell sx={cellSx}>{row.memberName}</TableCell>
                      <TableCell sx={cellSx}>
                        <Chip label={row.gender} size="small" />
                      </TableCell>
                      <TableCell sx={cellSx}>{row.temporaryAddress}</TableCell>
                      <TableCell sx={cellSx}>{row.mobileNo}</TableCell>
                      <TableCell sx={cellSx}>
                        <Box
                          onClick={() => handleSelect(row)}
                          sx={{
                            display: "inline-block",
                            px: 1.25,
                            py: 0.25,
                            bgcolor: "#2c6fad",
                            color: "#fff",
                            borderRadius: 0.75,
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                            userSelect: "none",
                            transition: "background 0.15s",
                            "&:hover": { bgcolor: "#1a5a96" },
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

        <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderTop: "1px solid #e0e0e0" }}>
          <Typography variant="caption">
            © Copyright 2013-2026 Pioneer Associate Pvt.Ltd. All Rights
            Reserved.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
