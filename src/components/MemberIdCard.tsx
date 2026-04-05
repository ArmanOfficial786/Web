// "use client";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { toast } from "react-toastify";
// import * as yup from "yup";
// import { RefreshCw } from "lucide-react";
// import Box from "@mui/material/Box";
// import Grid from "@mui/material/Grid";
// import Paper from "@mui/material/Paper";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import Divider from "@mui/material/Divider";

// import TextInput from "@/components/form/TextInput";
// import DateInput from "@/components/form/DateInput";
// import DropDown from "@/components/form/DropDown";
// import ReportNavigation from "@/components/ReportNavigation";
// import PdfSlideViewer from "./PdfSlideViewer";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { Api, type MemberIdCardRequest } from "../../types/api/api";

// // ── API client ────────────────────────────────────────────────────────────────
// const apiClient = new Api({
//   baseURL: process.env.NEXT_PUBLIC_API_URL ?? "",
// });

// // ── Types ─────────────────────────────────────────────────────────────────────
// export type ReportFormat = "PDF" | "Word" | "Excel" | "Image";

// interface FormInputs {
//   memberId: string;
//   memberName: string;
//   fromDate: string; // BS "YYYY-MM-DD"
//   tillDate: string; // BS "YYYY-MM-DD"
//   branchId: number | string;
//   groupId: number | string;
//   orderBy: number | string;
// }

// // ── Validation ────────────────────────────────────────────────────────────────
// const schema = yup.object({
//   memberId: yup.string().optional(),
//   memberName: yup.string().optional(),
//   fromDate: yup.string().required("From Date is required"),
//   tillDate: yup
//     .string()
//     .required("Till Date is required")
//     .test("bs-min", "Till Date cannot be before From Date", function (val) {
//       const { fromDate } = this.parent;
//       if (!fromDate || !val) return true;
//       return val >= fromDate; // YYYY-MM-DD string comparison works for BS too
//     }),
//   branchId: yup.mixed().optional(),
//   groupId: yup.mixed().optional(),
//   orderBy: yup.mixed().optional(),
// });

// // ── Pagination shape ──────────────────────────────────────────────────────────
// interface Pagination {
//   currentPage: number;
//   totalPages: number;
//   totalRecord: number;
//   pageSize: number;
//   hasNextPage: boolean;
//   hasPreviousPage: boolean;
// }

// interface ViewResponse {
//   success: boolean;
//   pdfData: string;
//   pagination: Pagination;
// }

// // ── Static dropdown options (replace with API calls as needed) ────────────────
// const BRANCH_OPTIONS = [{ id: 0, name: "-- Select --" }];
// const GROUP_OPTIONS = [{ id: 0, name: "-- Select --" }];
// const ORDER_OPTIONS = [{ id: 0, name: "--Select--" }];

// // ── FieldRow helper ───────────────────────────────────────────────────────────
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

// // ── Main component ────────────────────────────────────────────────────────────
// const MemberIdCard = () => {
//   const { t } = useLanguage();

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecord, setTotalRecord] = useState(0);
//   const [pageSize, setPageSize] = useState(15);
//   const [loading, setLoading] = useState(false);
//   const [reportLoaded, setReportLoaded] = useState(false);
//   const [error, setError] = useState("");
//   const [searchText, setSearchText] = useState("");
//   const [showDownloadMenu, setShowDownloadMenu] = useState(false);
//   const [pdfData, setPdfData] = useState("");
//   const [hasNextPage, setHasNextPage] = useState(false);
//   const [hasPreviousPage, setHasPreviousPage] = useState(false);

//   const { control, handleSubmit, getValues } = useForm<FormInputs>({
//     resolver: yupResolver(schema) as any,
//     defaultValues: {
//       memberId: "",
//       memberName: "",
//       fromDate: "2082-12-19",
//       tillDate: "2082-12-22",
//       branchId: 0,
//       groupId: 0,
//       orderBy: 0,
//     },
//   });

//   // ── Generate / download ───────────────────────────────────────────────────
//   const generateReport = async (
//     format?: string,
//     page: number = 1,
//     size: number = pageSize,
//   ) => {
//     setLoading(true);
//     setError("");

//     try {
//       const values = getValues();

//       const requestBody: MemberIdCardRequest = {
//         memberId: values.memberId || null,
//         fromDate: values.fromDate || null,
//         toDate: values.tillDate || null,
//         branchId: Number(values.branchId) || 0,
//         memberGroupId: Number(values.groupId) || 0,
//         currentPage: page,
//         pageSize: size,
//       };

//       const isView = !format || format.toUpperCase() === "VIEW";
//       const apiFormat = isView ? "VIEW" : format!.toUpperCase();

//       const response = await apiClient.api.memberIdCardMemberIdCardCreate(
//         requestBody,
//         { format: apiFormat },
//       );

//       // ── VIEW ──────────────────────────────────────────────────────────────
//       if (isView) {
//         const data = response.data as unknown as ViewResponse;

//         if (!data?.success) {
//           setError("Report generation failed on server");
//           return;
//         }
//         if (!data?.pdfData) {
//           setError("No content in response");
//           return;
//         }

//         setPdfData(data.pdfData);
//         setReportLoaded(true);

//         const p = data.pagination;
//         setCurrentPage(p?.currentPage || page);
//         setTotalPages(p?.totalPages || 1);
//         setTotalRecord(p?.totalRecord ?? 0);
//         setPageSize(p?.pageSize || size);
//         setHasNextPage(p?.hasNextPage ?? false);
//         setHasPreviousPage(p?.hasPreviousPage ?? false);

//         toast.success(`Page ${page} loaded successfully`);
//         return;
//       }

//       // ── DOWNLOAD ──────────────────────────────────────────────────────────
//       const raw = response.data as unknown;
//       const blob =
//         raw instanceof Blob
//           ? raw
//           : new Blob([raw as any], { type: "application/octet-stream" });

//       const extMap: Record<string, string> = {
//         PDF: "pdf",
//         WORD: "docx",
//         DOCX: "docx",
//         XLSX: "xlsx",
//         EXCEL: "xlsx",
//         PNG: "png",
//         IMAGE: "png",
//       };

//       const ext = extMap[apiFormat] ?? apiFormat.toLowerCase();
//       const filename = `MemberIdCard_${values.fromDate}_to_${values.tillDate}.${ext}`;
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", filename);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);

//       toast.success(`${apiFormat} downloaded successfully`);
//     } catch (err: any) {
//       console.error("Generate report error:", err);
//       setError(err.message || "Failed to generate report");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onSubmit = () => {
//     setCurrentPage(1);
//     generateReport(undefined, 1, pageSize);
//   };

//   const handleDownload = async (format: ReportFormat) => {
//     setShowDownloadMenu(false);
//     const formatMap: Record<ReportFormat, string> = {
//       PDF: "PDF",
//       Word: "WORD",
//       Excel: "XLSX",
//       Image: "PNG",
//     };
//     await generateReport(formatMap[format]);
//   };

//   const handlePageChange = (newPage: number) => {
//     if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage)
//       generateReport(undefined, newPage, pageSize);
//   };

//   const handlePageSizeChange = (newSize: number) => {
//     setPageSize(newSize);
//     setCurrentPage(1);
//     generateReport(undefined, 1, newSize);
//   };

//   // ── Render ────────────────────────────────────────────────────────────────
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         borderRadius: 2,
//         boxShadow: 2,
//         overflow: "visible",
//       }}
//     >
//       {/* ── FILTER PANEL ────────────────────────────────────────────────── */}
//       <Paper variant="outlined" sx={{ p: 2, mb: 1 }}>
//         <Typography
//           variant="h6"
//           sx={{ color: "primary.main", fontWeight: 600, mb: 1, fontSize: 16 }}
//         >
//           Create Member ID Card
//         </Typography>
//         <Divider sx={{ mb: 2 }} />

//         {/* Row 1 — Member Id | Member Name */}
//         <Grid container spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
//           <Grid size={{ xs: 12, md: 6 }}>
//             <FieldRow label="Member Id">
//               <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//                 <TextInput
//                   name="memberId"
//                   control={control}
//                   size="small"
//                   placeholder="Member Id"
//                   sx={{ flex: 1 }}
//                 />
//                 <Button
//                   variant="outlined"
//                   size="small"
//                   sx={{ minWidth: 36, fontWeight: 700, px: 1 }}
//                 >
//                   MD
//                 </Button>
//               </Box>
//             </FieldRow>
//           </Grid>

//           <Grid size={{ xs: 12, md: 6 }}>
//             <FieldRow label="Member Name">
//               <TextInput
//                 name="memberName"
//                 control={control}
//                 size="small"
//                 placeholder="Member Name"
//                 fullWidth
//               />
//             </FieldRow>
//           </Grid>
//         </Grid>
//         <Divider sx={{ mb: 2 }} />

//         {/* Row 2 — From Date | Till Date | View Report */}
//         <Grid container spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
//           <Grid size={{ xs: 12, md: 5 }}>
//             <FieldRow label="From Date">
//               <DateInput name="fromDate" control={control} dateType="BS" />
//             </FieldRow>
//           </Grid>

//           <Grid size={{ xs: 12, md: 5 }}>
//             <FieldRow label="Till Date">
//               <DateInput name="tillDate" control={control} dateType="BS" />
//             </FieldRow>
//           </Grid>
//         </Grid>
//         <Divider sx={{ mb: 2 }} />

//         {/* Row 3 — Branch Name | Select Group */}
//         <Grid container spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
//           <Grid size={{ xs: 12, md: 6 }}>
//             <FieldRow label="Branch Name">
//               <DropDown
//                 name="branchId"
//                 control={control}
//                 label="Branch Name"
//                 options={BRANCH_OPTIONS}
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
//                 options={GROUP_OPTIONS}
//                 fullWidth
//               />
//             </FieldRow>
//           </Grid>
//         </Grid>
//         <Divider sx={{ mb: 2 }} />

//         {/* Row 4 — Order By */}
//         <Grid container spacing={2} alignItems="center">
//           <Grid size={{ xs: 12, md: 6 }}>
//             <FieldRow label="Order by">
//               <DropDown
//                 name="orderBy"
//                 control={control}
//                 label="Order by"
//                 options={ORDER_OPTIONS}
//                 fullWidth
//               />
//             </FieldRow>
//           </Grid>
//           <Grid
//             size={{ xs: 12, md: 2 }}
//             sx={{ display: "flex", justifyContent: "flex-end" }}
//           >
//             <Button
//               variant="outlined"
//               size="small"
//               disabled={loading}
//               onClick={handleSubmit(onSubmit)}
//               sx={{ whiteSpace: "nowrap", height: 36 }}
//             >
//               {loading ? "Loading..." : "View Report"}
//             </Button>
//           </Grid>
//         </Grid>
//         <Divider sx={{ mb: 2 }} />
//       </Paper>

//       {/* ── NAVIGATION ──────────────────────────────────────────────────── */}
//       {reportLoaded && (
//         <ReportNavigation
//           currentPage={currentPage}
//           totalPages={totalPages}
//           totalRecord={totalRecord}
//           pageSize={pageSize}
//           hasNextPage={hasNextPage}
//           hasPreviousPage={hasPreviousPage}
//           onPageChange={handlePageChange}
//           onPageSizeChange={handlePageSizeChange}
//           searchText={searchText}
//           onSearchTextChange={setSearchText}
//           onPrint={() => window.print()}
//           showDownloadMenu={showDownloadMenu}
//           onToggleDownloadMenu={() => setShowDownloadMenu((p) => !p)}
//           onDownload={handleDownload}
//         />
//       )}

//       {/* ── REPORT VIEW ─────────────────────────────────────────────────── */}
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
//         ) : reportLoaded ? (
//           <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
//             {pdfData && (
//               <PdfSlideViewer
//                 base64Pdf={pdfData}
//                 pageNumber={currentPage}
//                 onTotalPagesChange={(pages: number) => setTotalPages(pages)}
//                 onLoadError={(err: string) => setError(err)}
//               />
//             )}
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
//               {t("clickGenerateReport")}
//             </Typography>
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default MemberIdCard;

"use client";
import React from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
} from "react-hook-form";
import { RefreshCw } from "lucide-react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import TextInput from "@/components/form/TextInput";
import DateInput from "@/components/form/DateInput";
import DropDown from "@/components/form/DropDown";
import ReportNavigation from "@/components/ReportNavigation";
import PdfSlideViewer from "./PdfSlideViewer";

// ── Shared types (exported so page.tsx can import them) ───────────────────────
export type ReportFormat = "PDF" | "Word" | "Excel" | "Image";

export interface FormInputs {
  memberId: string;
  memberName: string;
  fromDate: string;
  tillDate: string;
  branchId: number | string;
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
  searchText: string;
  showDownloadMenu: boolean;
  pdfData: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ── Static dropdown options (swap with API fetches as needed) ─────────────────
const BRANCH_OPTIONS = [{ id: 0, name: "-- Select --" }];
const GROUP_OPTIONS = [{ id: 0, name: "-- Select --" }];
const ORDER_OPTIONS = [{ id: 0, name: "--Select--" }];

// ── Props ─────────────────────────────────────────────────────────────────────
interface MemberIdCardProps {
  control: Control<FormInputs>;
  handleSubmit: UseFormHandleSubmit<FormInputs>;
  onSubmit: SubmitHandler<FormInputs>;
  reportState: ReportState;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearchTextChange: (text: string) => void;
  onToggleDownloadMenu: () => void;
  onDownload: (format: ReportFormat) => void;
  onPrint: () => void;
  emptyText: string;
}

// ── FieldRow helper ───────────────────────────────────────────────────────────
function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minHeight: 40 }}>
      <Typography
        sx={{
          width: 110,
          flexShrink: 0,
          fontSize: 13,
          fontWeight: 500,
          color: "text.secondary",
        }}
      >
        {label}
      </Typography>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
function MemberIdCard({
  control,
  handleSubmit,
  onSubmit,
  reportState,
  onPageChange,
  onPageSizeChange,
  onSearchTextChange,
  onToggleDownloadMenu,
  onDownload,
  onPrint,
  emptyText,
}: MemberIdCardProps) {
  const {
    loading,
    reportLoaded,
    error,
    pdfData,
    currentPage,
    totalPages,
    totalRecord,
    pageSize,
    hasNextPage,
    hasPreviousPage,
    searchText,
    showDownloadMenu,
  } = reportState;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* ── FILTER FORM ───────────────────────────────────────────────── */}
      <Paper variant="outlined" sx={{ p: 1 }}>
        <Typography
          variant="h6"
          sx={{ color: "primary.main", fontWeight: 600, fontSize: 16 }}
        >
          Create Member ID Card
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Row 1 — Member Id | Member Name */}
        <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldRow label="Member Id">
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <TextInput
                  name="memberId"
                  control={control}
                  size="small"
                  placeholder="Member Id"
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 36, fontWeight: 700, px: 1 }}
                >
                  MD
                </Button>
              </Box>
            </FieldRow>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldRow label="Member Name">
              <TextInput
                name="memberName"
                control={control}
                size="small"
                placeholder="Member Name"
                fullWidth
              />
            </FieldRow>
          </Grid>
        </Grid>
        <Divider sx={{ mb: 2 }} />

        {/* Row 2 — From Date | Till Date */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldRow label="From Date">
              <DateInput name="fromDate" control={control} dateType="BS" />
            </FieldRow>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldRow label="Till Date">
              <DateInput name="tillDate" control={control} dateType="BS" />
            </FieldRow>
          </Grid>
        </Grid>
        <Divider sx={{ mb: 2 }} />

        {/* Row 3 — Branch Name | Select Group */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldRow label="Branch Name">
              <DropDown
                name="branchId"
                control={control}
                label="Branch Name"
                options={BRANCH_OPTIONS}
                fullWidth
              />
            </FieldRow>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldRow label="Select Group">
              <DropDown
                name="groupId"
                control={control}
                label="Select Group"
                options={GROUP_OPTIONS}
                fullWidth
              />
            </FieldRow>
          </Grid>
        </Grid>
        <Divider sx={{ mb: 2 }} />

        {/* Row 4 — Order By | View Report */}
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldRow label="Order by">
              <DropDown
                name="orderBy"
                control={control}
                label="Order by"
                options={ORDER_OPTIONS}
                fullWidth
              />
            </FieldRow>
          </Grid>

          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{ display: "flex", justifyContent: "justify-content" }}
          >
            <Button
              variant="outlined"
              size="small"
              disabled={loading}
              onClick={handleSubmit(onSubmit)}
              sx={{ whiteSpace: "nowrap", height: 36 }}
            >
              {loading ? "Loading..." : "View Report"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* ── NAVIGATION ────────────────────────────────────────────────── */}
      {reportLoaded && (
        <ReportNavigation
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecord={totalRecord}
          pageSize={pageSize}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          searchText={searchText}
          onSearchTextChange={onSearchTextChange}
          onPrint={onPrint}
          showDownloadMenu={showDownloadMenu}
          onToggleDownloadMenu={onToggleDownloadMenu}
          onDownload={onDownload}
        />
      )}

      {/* ── REPORT VIEW ───────────────────────────────────────────────── */}
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
        ) : reportLoaded ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            {pdfData && (
              <PdfSlideViewer
                base64Pdf={pdfData}
                pageNumber={currentPage}
                onTotalPagesChange={(pages: number) => {}}
                onLoadError={(err: string) => {}}
              />
            )}
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
            <Typography color="text.secondary">{emptyText}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default MemberIdCard;
