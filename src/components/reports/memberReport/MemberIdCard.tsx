// "use client";

// import React from "react";
// import type {
//   Control,
//   SubmitHandler,
//   UseFormHandleSubmit,
// } from "react-hook-form";
// import { RefreshCw } from "lucide-react";
// import Box from "@mui/material/Box";
// import Grid from "@mui/material/Grid";
// import Paper from "@mui/material/Paper";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import Divider from "@mui/material/Divider";

// import DateInput from "@/components/form/DateInput";
// import DropDown from "@/components/form/DropDown";
// import ReportNavigation, {
//   type ReportFormat,
// } from "@/components/ReportNavigation";
// import PdfSlideViewer from "./PdfSlideViewer";
// import MemberLookupButton from "./MemberLookUpButton";
// import { useReportForm } from "@/contexts/ReportFormContext";
// import DateFields from "./DateFiels";

// // ── Shared types ──────────────────────────────────────────────────────────────
// export type { ReportFormat };

// export interface FormInputs {
//   memberId: string;
//   memberName: string;
//   fromDate: string;
//   tillDate: string;
//   branchId: number | string;
//   groupId: number | string;
//   orderBy: number | string;
// }

// export interface ReportState {
//   currentPage: number;
//   totalPages: number;
//   totalRecord: number;
//   pageSize: number;
//   loading: boolean;
//   reportLoaded: boolean;
//   error: string;
//   pdfData: string;
// }

// export type SelectOption = { id: number; name: string };

// // ── Props ─────────────────────────────────────────────────────────────────────
// interface MemberIdCardProps {
//   control: Control<FormInputs>;
//   handleSubmit: UseFormHandleSubmit<FormInputs>;
//   onSubmit: SubmitHandler<FormInputs>;
//   /** groupOptions still accepted as a prop since it's not in context */
//   groupOptions?: SelectOption[];
//   reportState: ReportState;
//   onPageChange: (page: number) => void;
//   onDownload: (format: ReportFormat) => void | Promise<void>;
//   isDownloading?: boolean;
//   emptyText: string;
// }

// // ── FieldRow ──────────────────────────────────────────────────────────────────
// function FieldRow({
//   label,
//   children,
// }: {
//   label: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <Box sx={{ display: "flex", alignItems: "center", gap: 1, minHeight: 40 }}>
//       <Typography
//         sx={{
//           width: 110,
//           flexShrink: 0,
//           fontSize: 13,
//           fontWeight: 500,
//           color: "text.secondary",
//         }}
//       >
//         {label}
//       </Typography>
//       <Box sx={{ flex: 1 }}>{children}</Box>
//     </Box>
//   );
// }

// const DEFAULT_OPTIONS: SelectOption[] = [{ id: 0, name: "-- Select --" }];

// // ── Component ─────────────────────────────────────────────────────────────────
// function MemberIdCard({
//   control,
//   handleSubmit,
//   onSubmit,
//   groupOptions = DEFAULT_OPTIONS,
//   reportState,
//   onPageChange,
//   onDownload,
//   isDownloading = false,
//   emptyText,
// }: MemberIdCardProps) {
//   // ← pull options from context instead of props
//   const { branchOptions, orderByOptions } = useReportForm();

//   const { loading, reportLoaded, error, pdfData, currentPage, totalPages } =
//     reportState;

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//       {/* ── FILTER FORM ──────────────────────────────────────────────── */}
//       <Paper variant="outlined" sx={{ p: 1.5 }}>
//         <Typography
//           variant="h6"
//           sx={{ color: "primary.main", fontWeight: 600, fontSize: 16, mb: 1 }}
//         >
//           Create Member ID Card
//         </Typography>
//         <Divider sx={{ mb: 1.5 }} />

//         {/* Row 1 — Member ID + Name (with lookup modal) */}
//         <MemberLookupButton control={control} />
//         <Divider sx={{ mb: 1.5 }} />

//         {/* Row 2 — From Date | Till Date */}
//         {/* <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
//           <Grid size={{ xs: 12, md: 6 }}>
//             <FieldRow label="From Date">
//               <DateInput name="fromDate" control={control} dateType="BS" />
//             </FieldRow>
//           </Grid>
//           <Grid size={{ xs: 12, md: 6 }}>
//             <FieldRow label="Till Date">
//               <DateInput name="tillDate" control={control} dateType="BS" />
//             </FieldRow>
//           </Grid>
//         </Grid>
//         <Divider sx={{ mb: 1.5 }} /> */}

//         <Box sx={{ mb: 1 }}>
//           <DateFields control={control} />
//         </Box>
//         <Divider sx={{ mb: 1.5 }} />

//         {/* Row 3 — Branch | Group */}
//         <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
//           <Grid size={{ xs: 12, md: 6 }}>
//             <FieldRow label="Branch Name">
//               <DropDown
//                 name="branchId"
//                 control={control}
//                 label="Branch Name"
//                 options={branchOptions} // ← from context
//                 fullWidth
//               />
//             </FieldRow>
//           </Grid>
//           <Grid size={{ xs: 12, md: 6 }}>
//             <FieldRow label="Select Group">
//               <DropDown
//                 name="groupId"
//                 control={control}
//                 label="Select Group"
//                 options={groupOptions} // ← still a prop (no context entry for group)
//                 fullWidth
//               />
//             </FieldRow>
//           </Grid>
//         </Grid>
//         <Divider sx={{ mb: 1.5 }} />

//         {/* Row 4 — Order By | View Report */}
//         <Grid container spacing={1} alignItems="center">
//           <Grid size={{ xs: 12, md: 6 }}>
//             <FieldRow label="Order by">
//               <DropDown
//                 name="orderBy"
//                 control={control}
//                 label="Order by"
//                 options={orderByOptions} // ← from context
//                 fullWidth
//               />
//             </FieldRow>
//           </Grid>
//           <Grid size={{ xs: 12, md: 6 }}>
//             <Button
//               variant="contained"
//               size="small"
//               disabled={loading}
//               onClick={handleSubmit(onSubmit)}
//               sx={{ whiteSpace: "nowrap", height: 36 }}
//             >
//               {loading ? "Loading..." : "View Report"}
//             </Button>
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* ── NAVIGATION ───────────────────────────────────────────────── */}
//       {reportLoaded && (
//         <ReportNavigation
//           pdfData={pdfData}
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={onPageChange}
//           onDownload={onDownload}
//           isDownloading={isDownloading}
//         />
//       )}

//       {/* ── REPORT AREA ──────────────────────────────────────────────── */}
//       <Box sx={{ width: "100%", overflow: "auto", height: "100vh" }}>
//         {loading ? (
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "100%",
//             }}
//           >
//             <RefreshCw className="animate-spin text-blue-500" size={48} />
//           </Box>
//         ) : error ? (
//           <Box sx={{ textAlign: "center", mt: 4 }}>
//             <Typography color="error">{error}</Typography>
//           </Box>
//         ) : reportLoaded && pdfData ? (
//           <Box sx={{ display: "flex", justifyContent: "center" }}>
//             <PdfSlideViewer
//               base64Pdf={pdfData}
//               pageNumber={currentPage}
//               onTotalPagesChange={(_pages: number) => {}}
//               onLoadError={(_err: string) => {}}
//             />
//           </Box>
//         ) : (
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "100%",
//             }}
//           >
//             <Typography color="text.secondary">{emptyText}</Typography>
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// }

// export default MemberIdCard;

// "use client";

// import React from "react";
// import type {
//   Control,
//   SubmitHandler,
//   UseFormHandleSubmit,
// } from "react-hook-form";
// import { RefreshCw } from "lucide-react";
// import Box from "@mui/material/Box";
// import Paper from "@mui/material/Paper";
// import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";

// import ReportNavigation, {
//   type ReportFormat,
// } from "@/components/ReportNavigation";
// import PdfSlideViewer from "./PdfSlideViewer";
// import MemberLookupButton from "@/components/MemberLookUpButton";
// import DateFields from "@/components/DateFiels";
// import BranchNameField from "@/components/BranchNameField";
// import SelectGroupField from "@/components/SelectGroupField";
// import OrderByField from "@/components/OrderByFields";

// // ── Shared types ──────────────────────────────────────────────────────────────
// export type { ReportFormat };

// export interface FormInputs {
//   memberId: string;
//   memberName: string;
//   fromDate: string;
//   tillDate: string;
//   branchId: number | string;
//   groupId: number | string;
//   orderBy: number | string;
// }

// export interface ReportState {
//   currentPage: number;
//   totalPages: number;
//   totalRecord: number;
//   pageSize: number;
//   loading: boolean;
//   reportLoaded: boolean;
//   error: string;
//   pdfData: string;
// }

// export type SelectOption = { id: number; name: string };

// // ── Props ─────────────────────────────────────────────────────────────────────
// interface MemberIdCardProps {
//   control: Control<FormInputs>;
//   handleSubmit: UseFormHandleSubmit<FormInputs>;
//   onSubmit: SubmitHandler<FormInputs>;
//   /** groupOptions still accepted as a prop since it's not in context */
//   groupOptions?: SelectOption[];
//   reportState: ReportState;
//   onPageChange: (page: number) => void;
//   onDownload: (format: ReportFormat) => void | Promise<void>;
//   isDownloading?: boolean;
//   emptyText: string;
// }

// // ── Component ─────────────────────────────────────────────────────────────────
// function MemberIdCard({
//   control,
//   handleSubmit,
//   onSubmit,
//   groupOptions,
//   reportState,
//   onPageChange,
//   onDownload,
//   isDownloading = false,
//   emptyText,
// }: MemberIdCardProps) {
//   const { loading, reportLoaded, error, pdfData, currentPage, totalPages } =
//     reportState;

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//       {/* ── FILTER FORM ──────────────────────────────────────────────── */}
//       <Paper variant="outlined" sx={{ p: 1.5 }}>
//         <Typography
//           variant="h6"
//           sx={{ color: "primary.main", fontWeight: 600, fontSize: 16, mb: 1 }}
//         >
//           Create Member ID Card
//         </Typography>
//         <Divider sx={{ mb: 1.5 }} />

//         {/* Row 1 — Member ID + Name */}
//         <MemberLookupButton control={control} />
//         <Divider sx={{ mb: 1.5 }} />

//         {/* Row 2 — From Date | Till Date */}
//         <Box sx={{ mb: 1 }}>
//           <DateFields control={control} />
//         </Box>
//         <Divider sx={{ mb: 1.5 }} />

//         {/* Row 3 — Branch | Group */}
//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//             gap: 2,
//             mb: 1,
//           }}
//         >
//           <BranchNameField control={control} />
//           <SelectGroupField control={control} groupOptions={groupOptions} />
//         </Box>
//         <Divider sx={{ mb: 1.5 }} />

//         {/* Row 4 — Order By | View Report */}
//         <OrderByField
//           control={control}
//           handleSubmit={handleSubmit}
//           onSubmit={onSubmit}
//           loading={loading}
//         />
//       </Paper>

//       {/* ── NAVIGATION ───────────────────────────────────────────────── */}
//       {reportLoaded && (
//         <ReportNavigation
//           pdfData={pdfData}
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={onPageChange}
//           onDownload={onDownload}
//           isDownloading={isDownloading}
//         />
//       )}

//       {/* ── REPORT AREA ──────────────────────────────────────────────── */}
//       <Box sx={{ width: "100%", overflow: "auto", height: "100vh" }}>
//         {loading ? (
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "100%",
//             }}
//           >
//             <RefreshCw className="animate-spin text-blue-500" size={48} />
//           </Box>
//         ) : error ? (
//           <Box sx={{ textAlign: "center", mt: 4 }}>
//             <Typography color="error">{error}</Typography>
//           </Box>
//         ) : reportLoaded && pdfData ? (
//           <Box sx={{ display: "flex", justifyContent: "center" }}>
//             <PdfSlideViewer
//               base64Pdf={pdfData}
//               pageNumber={currentPage}
//               onTotalPagesChange={(_pages: number) => {}}
//               onLoadError={(_err: string) => {}}
//             />
//           </Box>
//         ) : (
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "100%",
//             }}
//           >
//             <Typography color="text.secondary">{emptyText}</Typography>
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// }

// export default MemberIdCard;

// "use client";

// import React from "react";
// import type {
//   Control,
//   SubmitHandler,
//   UseFormHandleSubmit,
//   UseFormSetValue,
// } from "react-hook-form";
// import { RefreshCw } from "lucide-react";
// import Box from "@mui/material/Box";
// import Grid from "@mui/material/Grid";
// import Paper from "@mui/material/Paper";
// import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";

// import ReportNavigation, {
//   type ReportFormat,
// } from "@/components/reportForm/ReportNavigation";
// import PdfSlideViewer from "../../reportForm/PdfSlideViewer";
// import MemberLookupButton from "../../reportForm/MemberLookUpButton";
// import DateFields from "@/components/reportForm/DateFiels";
// import BranchNameField from "@/components/reportForm/BranchNameField";
// import SelectGroupField from "../../reportForm/SelectGroupField";
// import OrderByField from "@/components/reportForm/OrderByFields";
// import ViewReportButton from "@/components/reportForm/ViewReportButton";
// import CollectionCenterField from "@/components/reportForm/CollectionCenter";

// // ── Shared types ──────────────────────────────────────────────────────────────
// export type { ReportFormat };

// export interface FormInputs {
//   memberId: string;
//   memberName: string;
//   fromDate: string;
//   tillDate: string;
//   branchId: number | string;
//   collectionCenterId: number | string;
//   groupId: number | string;
//   orderBy: number | string;
// }

// export interface ReportState {
//   currentPage: number;
//   totalPages: number;
//   totalRecord: number;
//   pageSize: number;
//   loading: boolean;
//   reportLoaded: boolean;
//   error: string;
//   pdfData: string;
// }

// export type SelectOption = { id: number; name: string };

// // ── Props ─────────────────────────────────────────────────────────────────────
// interface MemberIdCardProps {
//   control: Control<FormInputs>;
//   handleSubmit: UseFormHandleSubmit<FormInputs>;
//   onSubmit: SubmitHandler<FormInputs>;
//   setValue: UseFormSetValue<FormInputs>;
//   /** groupOptions still accepted as a prop since it's not in context */
//   groupOptions?: SelectOption[];
//   reportState: ReportState;
//   onPageChange: (page: number) => void;
//   onDownload: (format: ReportFormat) => void | Promise<void>;
//   isDownloading?: boolean;
//   emptyText: string;
// }

// // ── Component ─────────────────────────────────────────────────────────────────
// function MemberIdCard({
//   control,
//   handleSubmit,
//   onSubmit,
//   setValue,
//   groupOptions,
//   reportState,
//   onPageChange,
//   onDownload,
//   isDownloading = false,
//   emptyText,
// }: MemberIdCardProps) {
//   const { loading, reportLoaded, error, pdfData, currentPage, totalPages } =
//     reportState;

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//       {/* ── FILTER FORM ──────────────────────────────────────────────── */}
//       <Paper variant="outlined" sx={{ p: 1.5 }}>
//         <Typography
//           variant="h6"
//           sx={{ color: "primary.main", fontWeight: 600, fontSize: 16, mb: 1 }}
//         >
//           Create Member ID Card
//         </Typography>
//         <Divider sx={{ mb: 1.5 }} />

//         {/* Row 1 — Member ID + Name */}
//         <MemberLookupButton control={control} />
//         <Divider sx={{ mb: 1.5 }} />

//         {/* Row 2 — From Date | Till Date */}
//         <Box sx={{ mb: 1 }}>
//           <DateFields control={control} />
//         </Box>
//         <Divider sx={{ mb: 1.5 }} />

//         {/* Row 3 — Branch | Group */}
//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//             gap: 2,
//             mb: 1,
//           }}
//         >
//           <BranchNameField control={control} />
//           <CollectionCenterField control={control} />
//           {/* //<SelectGroupField control={control} groupOptions={groupOptions} /> */}
//         </Box>
//         <Divider sx={{ mb: 1.5 }} />
//         {/* Row  — Branch | Group */}
//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//             gap: 2,
//             mb: 1,
//           }}
//         >
//           <SelectGroupField control={control} />
//           <OrderByField control={control} />
//         </Box>
//         <Divider sx={{ mb: 1.5 }} />

//         {/* Row 5 — Order By | View Report */}
//         <Grid container spacing={1} alignItems="center">
//           <Grid size={{ xs: 12, md: 6 }}>
//             <ViewReportButton
//               control={control}
//               handleSubmit={handleSubmit}
//               onSubmit={onSubmit}
//               setValue={setValue}
//               loading={loading}
//             />
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* ── NAVIGATION ───────────────────────────────────────────────── */}
//       {reportLoaded && (
//         <ReportNavigation
//           pdfData={pdfData}
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={onPageChange}
//           onDownload={onDownload}
//           isDownloading={isDownloading}
//         />
//       )}

//       {/* ── REPORT AREA ──────────────────────────────────────────────── */}
//       <Box sx={{ width: "100%", overflow: "auto", height: "100vh" }}>
//         {loading ? (
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "100%",
//             }}
//           >
//             <RefreshCw className="animate-spin text-blue-500" size={48} />
//           </Box>
//         ) : error ? (
//           <Box sx={{ textAlign: "center", mt: 4 }}>
//             <Typography color="error">{error}</Typography>
//           </Box>
//         ) : reportLoaded && pdfData ? (
//           <Box sx={{ display: "flex", justifyContent: "center" }}>
//             <PdfSlideViewer
//               base64Pdf={pdfData}
//               pageNumber={currentPage}
//               onTotalPagesChange={(_pages: number) => {}}
//               onLoadError={(_err: string) => {}}
//             />
//           </Box>
//         ) : (
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "100%",
//             }}
//           >
//             <Typography color="text.secondary">{emptyText}</Typography>
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// }

// export default MemberIdCard;

"use client";

import React, { useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormReset,
} from "react-hook-form";
import { RefreshCw } from "lucide-react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/ReportNavigation";
//import PdfSlideViewer from "../../reportForm/PdfSlideViewer";
import MemberLookupButton from "../../reportForm/MemberLookUpButton";
import DateFields from "@/components/reportForm/DateFiels";
import BranchNameField from "@/components/reportForm/BranchNameField";
import CollectionCenterField from "@/components/reportForm/CollectionCenter";
import SelectGroupField from "../../reportForm/SelectGroupField";
import OrderByField from "@/components/reportForm/OrderByFields";
import ViewReportButton from "@/components/reportForm/ViewReportButton";
import ClearFormButton from "@/components/reportForm/ClearFormButton";
import type { ReportState } from "@/utilis/Constants/reportConstants";

export type { ReportFormat };

export interface FormInputs {
  memberId: string;
  memberName: string;
  fromDate: string;
  tillDate: string;
  branchId: number | string;
  collectionCenterId: number | string;
  groupId: number | string;
  orderBy: number | string;
}

export type SelectOption = { id: number; name: string };

// ── Props ─────────────────────────────────────────────────────────────────────
interface MemberIdCardProps {
  control: Control<FormInputs>;
  handleSubmit: UseFormHandleSubmit<FormInputs>;
  onSubmit: SubmitHandler<FormInputs>;
  setValue: UseFormSetValue<FormInputs>;
  reset: UseFormReset<FormInputs>;
  reportState: ReportState;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  isDownloading?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
function MemberIdCard({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reset,
  reportState,
  onPageChange,
  onDownload,
  isDownloading = false,
}: MemberIdCardProps) {
  const { loading, reportLoaded, error, pdfData, currentPage, totalPages } =
    reportState;
  //Scroll up to report area when report is loaded
  const reportRef = useRef<HTMLDivElement>(null);
  const scrollToReport = () => {
    reportRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Paper variant="outlined" sx={{ p: 1.5 }}>
        <Typography
          variant="h6"
          sx={{ color: "primary.main", fontWeight: 600, fontSize: 16, mb: 1 }}
        >
          Create Member ID Card
        </Typography>
        <Divider sx={{ mb: 1.5 }} />

        {/* Row 1 — Member ID + Name */}
        <MemberLookupButton control={control} />
        <Divider sx={{ mb: 1.5 }} />

        {/* Row 2 — From Date | Till Date */}
        <Box sx={{ mb: 1 }}>
          <DateFields control={control} />
        </Box>
        <Divider sx={{ mb: 1.5 }} />

        {/* Row 3 — Branch | Collection Center */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            mb: 1,
          }}
        >
          <BranchNameField control={control} />
          {/* ✅ setValue forwarded — no FormProvider required */}
          <CollectionCenterField control={control} setValue={setValue} />
        </Box>
        <Divider sx={{ mb: 1.5 }} />

        {/* Row 4 — Select Group | Order By */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            mb: 1,
          }}
        >
          <SelectGroupField control={control} setValue={setValue} />
          <OrderByField control={control} reportKey="memberIdCard" />
        </Box>
        <Divider sx={{ mb: 1.5 }} />

        {/* Row 5 — View Report */}
        <Grid container spacing={1} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={5}
              width="100%"
            >
              <ViewReportButton
                control={control}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                setValue={setValue}
                loading={loading}
                onBeforeSubmit={scrollToReport}
              />
              <ClearFormButton reset={reset} setValue={setValue} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* ── NAVIGATION ───────────────────────────────────────────────── */}
      {reportLoaded && (
        <ReportNavigation
          pdfData={pdfData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onDownload={onDownload}
          isDownloading={isDownloading}
        />
      )}

      {/* ── REPORT AREA ──────────────────────────────────────────────── */}
      <Box
        ref={reportRef}
        sx={{ width: "100%", overflow: "auto", height: "100vh" }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <RefreshCw className="animate-spin text-blue-500" size={48} />
          </Box>
        ) : reportLoaded && pdfData ? (
          <iframe
            src={`${pdfData}#zoom=155`}
            style={{
              width: "100%",
              height: "1000px",
              border: "none",
              display: "block",
              margin: "0 auto",
            }}
          />
        ) : null}
      </Box>
    </Box>
  );
}

export default MemberIdCard;
