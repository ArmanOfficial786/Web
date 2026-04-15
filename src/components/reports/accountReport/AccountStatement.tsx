// // "use client";

// // import React from "react";
// // import type {
// //   Control,
// //   SubmitHandler,
// //   UseFormHandleSubmit,
// //   UseFormSetValue,
// //   UseFormReset,
// // } from "react-hook-form";
// // import { RefreshCw } from "lucide-react";
// // import Box from "@mui/material/Box";
// // import Grid from "@mui/material/Grid";
// // import Paper from "@mui/material/Paper";
// // import Typography from "@mui/material/Typography";
// // import Divider from "@mui/material/Divider";

// // import ReportNavigation, {
// //   type ReportFormat,
// // } from "@/components/reportForm/ReportNavigation";
// // import PdfSlideViewer from "../../reportForm/PdfSlideViewer";
// // import MemberLookupButton from "../../reportForm/MemberLookUpButton";
// // import DateFields from "@/components/reportForm/DateFiels";
// // import BranchNameField from "@/components/reportForm/BranchNameField";
// // import CollectionCenterField from "@/components/reportForm/CollectionCenter";
// // import SelectGroupField from "../../reportForm/SelectGroupField";
// // import OrderByField from "@/components/reportForm/OrderByFields";
// // import ViewReportButton from "@/components/reportForm/ViewReportButton";
// // import ClearFormButton from "@/components/reportForm/ClearFormButton";

// // export type { ReportFormat };

// // export interface FormInputs {
// //   memberId: string;
// //   memberName: string;
// //   fromDate: string;
// //   tillDate: string;
// //   branchId: number | string;
// //   collectionCenterId: number | string;
// //   groupId: number | string;
// //   orderBy: number | string;
// // }

// // export interface ReportState {
// //   currentPage: number;
// //   totalPages: number;
// //   totalRecord: number;
// //   pageSize: number;
// //   loading: boolean;
// //   reportLoaded: boolean;
// //   error: string;
// //   pdfData: string;
// // }

// // export type SelectOption = { id: number; name: string };

// // // ── Props ─────────────────────────────────────────────────────────────────────
// // interface AccountStatementProps {
// //   control: Control<FormInputs>;
// //   handleSubmit: UseFormHandleSubmit<FormInputs>;
// //   onSubmit: SubmitHandler<FormInputs>;
// //   setValue: UseFormSetValue<FormInputs>;
// //   reset: UseFormReset<FormInputs>;
// //   reportState: ReportState;
// //   onPageChange: (page: number) => void;
// //   onDownload: (format: ReportFormat) => void | Promise<void>;
// //   isDownloading?: boolean;
// // }

// // // ── Component ─────────────────────────────────────────────────────────────────
// // function AccountStatement({
// //   control,
// //   handleSubmit,
// //   onSubmit,
// //   setValue,
// //   reset,
// //   reportState,
// //   onPageChange,
// //   onDownload,
// //   isDownloading = false,
// // }: AccountStatementProps) {
// //   const { loading, reportLoaded, error, pdfData, currentPage, totalPages } =
// //     reportState;

// //   return (
// //     <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
// //       <Paper variant="outlined" sx={{ p: 1.5 }}>
// //         <Typography
// //           variant="h6"
// //           sx={{ color: "primary.main", fontWeight: 600, fontSize: 16, mb: 1 }}
// //         >
// //           Account Statement Report
// //         </Typography>
// //         <Divider sx={{ mb: 1.5 }} />

// //         {/* Row 1 — Member ID + Name */}
// //         <MemberLookupButton control={control} />
// //         <Divider sx={{ mb: 1.5 }} />

// //         {/* Row 2 — From Date | Till Date */}
// //         <Box sx={{ mb: 1 }}>
// //           <DateFields control={control} />
// //         </Box>
// //         <Divider sx={{ mb: 1.5 }} />

// //         {/* Row 3 — Branch | Collection Center */}
// //         <Box
// //           sx={{
// //             display: "grid",
// //             gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
// //             gap: 2,
// //             mb: 1,
// //           }}
// //         >
// //           <BranchNameField control={control} />
// //           {/* ✅ setValue forwarded — no FormProvider required */}
// //           <CollectionCenterField control={control} setValue={setValue} />
// //         </Box>
// //         <Divider sx={{ mb: 1.5 }} />

// //         {/* Row 4 — Select Group | Order By */}
// //         <Box
// //           sx={{
// //             display: "grid",
// //             gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
// //             gap: 2,
// //             mb: 1,
// //           }}
// //         >
// //           <SelectGroupField control={control} setValue={setValue} />
// //           <OrderByField control={control} />
// //         </Box>
// //         <Divider sx={{ mb: 1.5 }} />

// //         {/* Row 5 — View Report */}
// //         <Grid container spacing={1} alignItems="center">
// //           <Grid size={{ xs: 12, md: 6 }}>
// //             <ViewReportButton
// //               control={control}
// //               handleSubmit={handleSubmit}
// //               onSubmit={onSubmit}
// //               setValue={setValue}
// //               loading={loading}
// //             />
// //             <ClearFormButton reset={reset} setValue={setValue} />
// //           </Grid>
// //         </Grid>
// //       </Paper>

// //       {/* ── NAVIGATION ───────────────────────────────────────────────── */}
// //       {reportLoaded && (
// //         <ReportNavigation
// //           pdfData={pdfData}
// //           currentPage={currentPage}
// //           totalPages={totalPages}
// //           onPageChange={onPageChange}
// //           onDownload={onDownload}
// //           isDownloading={isDownloading}
// //         />
// //       )}

// //       {/* ── REPORT AREA ──────────────────────────────────────────────── */}
// //       <Box sx={{ width: "100%", overflow: "auto", height: "100vh" }}>
// //         {loading ? (
// //           <Box
// //             sx={{
// //               display: "flex",
// //               justifyContent: "center",
// //               alignItems: "center",
// //               height: "100%",
// //             }}
// //           >
// //             <RefreshCw className="animate-spin text-blue-500" size={48} />
// //           </Box>
// //         ) : error ? (
// //           <Box sx={{ textAlign: "center", mt: 4 }}>
// //             <Typography color="error">{error}</Typography>
// //           </Box>
// //         ) : reportLoaded && pdfData ? (
// //           <Box sx={{ display: "flex", justifyContent: "center" }}>
// //             <PdfSlideViewer
// //               base64Pdf={pdfData}
// //               pageNumber={currentPage}
// //               onTotalPagesChange={(_pages: number) => {}}
// //               onLoadError={(_err: string) => {}}
// //             />
// //           </Box>
// //         ) : (
// //           <Box
// //             sx={{
// //               display: "flex",
// //               justifyContent: "center",
// //               alignItems: "center",
// //               height: "100%",
// //             }}
// //           ></Box>
// //         )}
// //       </Box>
// //     </Box>
// //   );
// // }

// // export default AccountStatement;

// "use client";

// import React from "react";
// import type {
//   Control,
//   SubmitHandler,
//   UseFormHandleSubmit,
//   UseFormSetValue,
//   UseFormReset,
// } from "react-hook-form";
// import { RefreshCw } from "lucide-react";
// import Box from "@mui/material/Box";
// import Divider from "@mui/material/Divider";
// import Grid from "@mui/material/Grid";
// import Paper from "@mui/material/Paper";
// import Typography from "@mui/material/Typography";

// import type { AccountStatementRequest } from "types/api/api";
// import ReportNavigation, {
//   type ReportFormat,
// } from "@/components/reportForm/ReportNavigation";
// import PdfSlideViewer from "@/components/reportForm/PdfSlideViewer";
// import MemberLookupButton from "@/components/reportForm/MemberLookUpButton";
// import DateFields from "@/components/reportForm/DateFiels";
// import BranchNameField from "@/components/reportForm/BranchNameField";
// import CollectionCenterField from "@/components/reportForm/CollectionCenter";
// import SelectGroupField from "@/components/reportForm/SelectGroupField";
// import OrderByField from "@/components/reportForm/OrderByFields";
// import ViewReportButton from "@/components/reportForm/ViewReportButton";
// import ClearFormButton from "@/components/reportForm/ClearFormButton";

// export type { ReportFormat };

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

// interface AccountStatementProps {
//   control: Control<AccountStatementRequest>;
//   handleSubmit: UseFormHandleSubmit<AccountStatementRequest>;
//   onSubmit: SubmitHandler<AccountStatementRequest>;
//   setValue: UseFormSetValue<AccountStatementRequest>;
//   reset: UseFormReset<AccountStatementRequest>;
//   reportState: ReportState;
//   onPageChange: (page: number) => void;
//   onDownload: (format: ReportFormat) => void | Promise<void>;
//   isDownloading?: boolean;
// }

// export default function AccountStatement({
//   control,
//   handleSubmit,
//   onSubmit,
//   setValue,
//   reset,
//   reportState,
//   onPageChange,
//   onDownload,
//   isDownloading = false,
// }: AccountStatementProps) {
//   const { loading, reportLoaded, error, pdfData, currentPage, totalPages } =
//     reportState;

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//       {/* ── FORM ─────────────────────────────────────────────────────────── */}
//       <Paper variant="outlined" sx={{ p: 1.5 }}>
//         <Typography
//           variant="h6"
//           sx={{ color: "primary.main", fontWeight: 600, fontSize: 16, mb: 1 }}
//         >
//           Account Statement Report
//         </Typography>
//         <Divider sx={{ mb: 1.5 }} />

//         <MemberLookupButton control={control} />
//         <Divider sx={{ mb: 1.5 }} />

//         <Box sx={{ mb: 1 }}>
//           <DateFields control={control} />
//         </Box>
//         <Divider sx={{ mb: 1.5 }} />

//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//             gap: 2,
//             mb: 1,
//           }}
//         >
//           <BranchNameField control={control} />
//           <CollectionCenterField control={control} setValue={setValue} />
//         </Box>
//         <Divider sx={{ mb: 1.5 }} />

//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//             gap: 2,
//             mb: 1,
//           }}
//         >
//           <SelectGroupField control={control} setValue={setValue} />
//           <OrderByField control={control} />
//         </Box>
//         <Divider sx={{ mb: 1.5 }} />

//         <Grid container spacing={1} alignItems="center">
//           <Grid size={{ xs: 12, md: 6 }}>
//             <ViewReportButton
//               control={control}
//               handleSubmit={handleSubmit}
//               onSubmit={onSubmit}
//               setValue={setValue}
//               loading={loading}
//             />
//             <ClearFormButton reset={reset} setValue={setValue} />
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* ── NAVIGATION ───────────────────────────────────────────────────── */}
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

//       {/* ── REPORT AREA ──────────────────────────────────────────────────── */}
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
//             <Typography color="text.secondary">
//               Select filters and click View Report to load the statement.
//             </Typography>
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// }

"use client";

import React from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormReset,
} from "react-hook-form";
import { RefreshCw } from "lucide-react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/ReportNavigation";
import PdfSlideViewer from "@/components/reportForm/PdfSlideViewer";
import MemberLookupButton from "@/components/reportForm/MemberLookUpButton";
import DateFields from "@/components/reportForm/DateFiels";
import BranchNameField from "@/components/reportForm/BranchNameField";
import CollectionCenterField from "@/components/reportForm/CollectionCenter";
import SelectGroupField from "@/components/reportForm/SelectGroupField";
import OrderByField from "@/components/reportForm/OrderByFields";
import ViewReportButton from "@/components/reportForm/ViewReportButton";
import ClearFormButton from "@/components/reportForm/ClearFormButton";

export type { ReportFormat };

// ── FormInputs matches exactly what child components expect ───────────────────
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

export interface ReportState {
  currentPage: number;
  totalPages: number;
  totalRecord: number;
  pageSize: number;
  loading: boolean;
  reportLoaded: boolean;
  error: string;
  pdfData: string;
}

interface AccountStatementProps {
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

export default function AccountStatement({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reset,
  reportState,
  onPageChange,
  onDownload,
  isDownloading = false,
}: AccountStatementProps) {
  const { loading, reportLoaded, error, pdfData, currentPage, totalPages } =
    reportState;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* ── FORM ─────────────────────────────────────────────────────────── */}
      <Paper variant="outlined" sx={{ p: 1.5 }}>
        <Typography
          variant="h6"
          sx={{ color: "primary.main", fontWeight: 600, fontSize: 16, mb: 1 }}
        >
          Account Statement Report
        </Typography>
        <Divider sx={{ mb: 1.5 }} />

        <MemberLookupButton control={control} />
        <Divider sx={{ mb: 1.5 }} />

        <Box sx={{ mb: 1 }}>
          <DateFields control={control} />
        </Box>
        <Divider sx={{ mb: 1.5 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            mb: 1,
          }}
        >
          <BranchNameField control={control} />
          <CollectionCenterField control={control} setValue={setValue} />
        </Box>
        <Divider sx={{ mb: 1.5 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            mb: 1,
          }}
        >
          <SelectGroupField control={control} setValue={setValue} />
          <OrderByField control={control} reportKey="savingTypeWiseBalance" />
        </Box>
        <Divider sx={{ mb: 1.5 }} />

        <Grid container spacing={1} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <ViewReportButton
              control={control}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              setValue={setValue}
              loading={loading}
            />
            <ClearFormButton reset={reset} setValue={setValue} />
          </Grid>
        </Grid>
      </Paper>

      {/* ── NAVIGATION ───────────────────────────────────────────────────── */}
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

      {/* ── REPORT AREA ──────────────────────────────────────────────────── */}
      <Box sx={{ width: "100%", overflow: "auto", height: "100vh" }}>
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
        ) : error ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : reportLoaded && pdfData ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <PdfSlideViewer
              base64Pdf={pdfData}
              pageNumber={currentPage}
              onTotalPagesChange={(_pages: number) => {}}
              onLoadError={(_err: string) => {}}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography color="text.secondary">
              Select filters and click View Report to load the statement.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
