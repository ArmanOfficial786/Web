// "use client";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import * as yup from "yup";
// import { RefreshCw } from "lucide-react";
// import { useLanguage } from "@/contexts/LanguageContext";
// import PdfSlideViewer from "@/components/reportForm/Common/PdfSlideViewer";
// import ReportNavigation from "@/components/reportForm/Common/ReportNavigation";
// import { Box } from "@mui/material";

// interface FormInputs {
//   startDate: string;
//   endDate: string;
// }

// const schema = yup.object({
//   startDate: yup.string().required("Start Date is required"),
//   endDate: yup
//     .string()
//     .required("End Date is required")
//     .test("date-min", "End Date cannot be before Start Date", function (value) {
//       const { startDate } = this.parent;
//       if (!startDate || !value) return true;
//       return new Date(value) >= new Date(startDate);
//     }),
// });

// const MemberDetailReport = () => {
//   const { t } = useLanguage();

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [reportLoaded, setReportLoaded] = useState(false);
//   const [error, setError] = useState("");
//   const [pdfData, setPdfData] = useState("");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     getValues,
//   } = useForm<FormInputs>({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       startDate: "2024-12-01",
//       endDate: "2025-12-19",
//     },
//   });
//   //call api to generate report by default in VIEW format
//   const baseurl = "http://localhost:5106/api/MemberReport/MemberDetail";
//   //const baseurl = "http://localhost:5106/api/MemberDetail/MemberDetailReport";
//   const generateReport = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const values = getValues();
//       const requestBody = {
//         fromDate: values.startDate,
//         toDate: values.endDate,
//         branchId: 0,
//         memberGroupId: 0,
//       };
//       const url = `${baseurl}?format=VIEW`;
//       const response = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", accept: "*/*" },
//         body: JSON.stringify(requestBody),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to generate report: ${response.status}`);
//       }

//       const data = await response.json();

//       if (!data.success || !data.pdfData) {
//         toast.error("Report generation failed");
//         setError("No PDF data in response");
//         return;
//       }

//       setPdfData(data.pdfData);
//       setReportLoaded(true);
//       setCurrentPage(1);
//       toast.success("Report loaded successfully");
//     } catch (err: any) {
//       console.error("Generate report error:", err);
//       toast.error(err.message || "Failed to generate report");
//       setError(err.message || "Failed to generate report");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update total pages when PDF is loaded

//   const handleTotalPagesChange = (pages: number) => {
//     setTotalPages(pages);
//   };

//   // Handle PDF load errors

//   const handlePdfError = (errorMsg: string) => {
//     setError(errorMsg);
//     toast.error(errorMsg);
//   };

//   // Dismiss error message

//   const dismissError = () => {
//     setError("");
//     setReportLoaded(false);
//   };

//   // Report configuration for downloads
//   const reportConfig = {
//     apiEndpoint: baseurl,
//     requestBody: {
//       fromDate: getValues().startDate,
//       toDate: getValues().endDate,
//       branchId: 0,
//       memberGroupId: 0,
//     },
//     fileNamePrefix: `StudentReport_${getValues().startDate}_${getValues().endDate}`,
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-50">
//       {/* Header Section */}
//       <div className="bg-white border-b shadow-sm">
//         {/* Filter Section */}
//         <div className="p-4">
//           <div className="flex justify-center items-center gap-6">
//             {/* Start Date */}
//             <div className="flex flex-col">
//               <label className="font-semibold text-sm mb-1 text-gray-700">
//                 {t("startDate")}
//               </label>
//               <input
//                 type="date"
//                 {...register("startDate")}
//                 className={`w-[200px] border rounded h-[32px] text-sm px-3 focus:outline-none focus:ring-2 ${
//                   errors.startDate
//                     ? "border-red-500 focus:ring-red-200"
//                     : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
//                 }`}
//               />
//               {errors.startDate && (
//                 <span className="text-red-500 text-xs mt-1">
//                   {errors.startDate.message}
//                 </span>
//               )}
//             </div>

//             {/* End Date */}
//             <div className="flex flex-col">
//               <label className="font-semibold text-sm mb-1 text-gray-700">
//                 {t("toDate")}
//               </label>
//               <input
//                 type="date"
//                 {...register("endDate")}
//                 className={`w-[200px] border rounded h-[32px] text-sm px-3 focus:outline-none focus:ring-2 ${
//                   errors.endDate
//                     ? "border-red-500 focus:ring-red-200"
//                     : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
//                 }`}
//               />
//               {errors.endDate && (
//                 <span className="text-red-500 text-xs mt-1">
//                   {errors.endDate.message}
//                 </span>
//               )}
//             </div>

//             {/* Generate Button */}
//             <div className="flex flex-col justify-end h-[57px]">
//               <button
//                 onClick={handleSubmit(generateReport)}
//                 disabled={loading}
//                 className="px-6 h-[32px] bg-green-600 text-white font-semibold rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
//               >
//                 {loading ? (
//                   <span className="flex items-center gap-2">
//                     <RefreshCw size={16} className="animate-spin" />
//                     {t("generating")}
//                   </span>
//                 ) : (
//                   t("generateReport")
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Bar - Handles all its own logic */}
//         {reportLoaded && (
//           <div className="px-4 pb-3">
//             <ReportNavigation
//               pdfData={pdfData}
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={setCurrentPage}
//               reportConfig={reportConfig}
//             />
//           </div>
//         )}
//       </div>

//       {/* Report Content */}
//       <div className="flex-1 overflow-auto">
//         {loading ? (
//           <div className="h-full flex items-center justify-center">
//             <div className="text-center">
//               <RefreshCw
//                 size={48}
//                 className="animate-spin text-blue-500 mx-auto mb-4"
//               />
//               <p className="text-gray-700 font-medium">
//                 {t("generatingReport")}
//               </p>
//               <p className="text-gray-500 text-sm mt-2">Please wait...</p>
//             </div>
//           </div>
//         ) : reportLoaded && pdfData ? (
//           <Box>
//             <PdfSlideViewer
//               base64Pdf={pdfData}
//               pageNumber={currentPage}
//               onTotalPagesChange={handleTotalPagesChange}
//               onLoadError={handlePdfError}
//             />
//           </Box>
//         ) : (
//           <div className="h-full flex items-center justify-center bg-white">
//             <div className="text-center text-gray-500">
//               <svg
//                 className="mx-auto h-24 w-24 text-gray-400 mb-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.5}
//                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                 />
//               </svg>
//               <p className="text-lg font-medium mb-2">
//                 {t("clickGenerateReport")}
//               </p>
//               <p className="text-sm">
//                 Select date range and click "Generate Report"
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MemberRegistration;

"use client";

import React, { useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import MemberLookupButton from "../../reportForm/Common/MemberLookUpButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import SelectGroupField from "../../reportForm/Common/SelectGroupField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import { MemberDetailRequest } from "types/api/api";
import {
  type MemberRegistrationFormValues,
  type MemberRegistrationResponseExtended,
} from "@/app/(home)/(sidebar)/reports/(Member)/MemberRegistrationReport/page";
import Preloader from "@/components/PreLoader/preloader";
import { AccountStatementRequestExtended } from "@/app/(home)/(sidebar)/reports/(Account)/AccountStatementReport/page";
import { VisualReportSwitch } from "@/components/reportForm/Common/VisualReportSwitch";

export type { ReportFormat };

// ── Props ─────────────────────────────────────────────────────────────────────
interface MemberRegistrationReportProps {
  control: Control<MemberRegistrationFormValues>;
  handleSubmit: UseFormHandleSubmit<MemberRegistrationFormValues>;
  onSubmit: SubmitHandler<MemberRegistrationFormValues>;
  setValue: UseFormSetValue<MemberRegistrationFormValues>;
  reportState: MemberRegistrationResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
/**
 * Convert a base64 PDF string into a data-URI that an <iframe> can display.
 * The MemberRegistration endpoint returns a raw base64 string (not a blob URL),
 * so we construct the data URI here rather than using URL.createObjectURL.
 */
function toDataUri(base64: string): string {
  // Guard: if the consumer ever passes a blob:// URL instead, return as-is
  if (base64.startsWith("blob:") || base64.startsWith("data:")) return base64;
  return `data:application/pdf;base64,${base64}`;
}

// ── Component ─────────────────────────────────────────────────────────────────
function MemberRegistrationReport({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: MemberRegistrationReportProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);

  const reportRef = useRef<HTMLDivElement>(null);

  const scrollToReport = () => {
    reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Build the iframe src from the base64 payload
  const iframeSrc = pdfData
    ? `${toDataUri(pdfData)}#page=${pagination?.currentPage ?? 1}&toolbar=0&zoom=100`
    : undefined;

  return (
    <>
      {/* ── GLOBAL PRELOADER — fixed viewport center ─────────────────────── */}
      {isLoading && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(2px)",
          }}
        >
          <Preloader />
        </Box>
      )}

      {/* ── PAGE CONTENT ─────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {/* ── FORM ───────────────────────────────────────────────────────── */}
        <Paper variant="outlined" sx={{ px: 2, py: 1 }}>
          <Typography
            variant="h6"
            sx={{ color: "primary.main", fontWeight: 600, fontSize: 16 }}
          >
            Member Registration Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* Row 1 — Member Lookup */}
          <MemberLookupButton<MemberRegistrationFormValues> control={control} />
          <Divider sx={{ mb: 0.5 }} />

          {/* Row 2 — From Date | Till Date */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields control={control} />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* Row 3 — Branch (no Collection Center — MemberDetailRequest has none) */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 0.5,
            }}
          >
            <BranchNameField<MemberRegistrationFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchId"
            />
            <SelectGroupField<MemberRegistrationFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchId"
              // MemberDetailRequest has no collectionCenterId;
              // pass a dummy field name — SelectGroupField should handle undefined gracefully
              collectionCenterFieldName={"collectionCenterId" as any}
              groupFieldName="memberGroupId"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* Row 4 — Select Group | Order By */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
              gap: 8,
            }}
          >
            <OrderByField<MemberRegistrationFormValues>
              control={control}
              name="orderBy"
              reportKey="savingTypeWiseBalance"
            />

            <VisualReportSwitch<MemberRegistrationFormValues>
              control={control}
              name="visualReport"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* Row 5 — View Report | Clear */}
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
                  loading={isLoading}
                  onBeforeSubmit={scrollToReport}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={["memberId", "memberName"]}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* ── NAVIGATION ─────────────────────────────────────────────────── */}
        {showReport && (
          <ReportNavigation
            pdfData={pdfData!}
            currentPage={pagination?.currentPage ?? 1}
            totalPages={pagination?.totalPages ?? 1}
            onPageChange={onPageChange}
            onDownload={onDownload}
          />
        )}

        {/* ── REPORT AREA ──────────────────────────────────────────────────── */}
        {showReport && (
          <Box ref={reportRef} sx={{ width: "100%", overflow: "auto" }}>
            <Box
              sx={{
                position: "relative",
                height: "1000px",
                overflow: "hidden",
              }}
            >
              <iframe
                key={pagination?.currentPage ?? 1}
                src={iframeSrc}
                style={{
                  position: "absolute",
                  top: "-40px",
                  left: 0,
                  width: "100%",
                  height: "calc(100% + 40px)",
                  border: "none",
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}

export default React.memo(MemberRegistrationReport);
