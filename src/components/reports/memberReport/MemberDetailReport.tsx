// "use client";

// import React, { useRef } from "react";
// import type {
//   Control,
//   SubmitHandler,
//   UseFormHandleSubmit,
//   UseFormSetValue,
// } from "react-hook-form";
// import Box from "@mui/material/Box";
// import Grid from "@mui/material/Grid";
// import Paper from "@mui/material/Paper";
// import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";

// import ReportNavigation, {
//   type ReportFormat,
// } from "@/components/reportForm/Common/ReportNavigation";
// import MemberLookupButton from "../../reportForm/Common/MemberLookUpButton";
// import DateFields from "@/components/reportForm/Common/DateFiels";
// import BranchNameField from "@/components/reportForm/Common/BranchNameField";
// import SelectGroupField from "../../reportForm/Common/SelectGroupField";
// import OrderByField from "@/components/reportForm/Common/OrderByFields";
// import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
// import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
// import { MemberDetailRequest } from "types/api/api";
// import {
//   type MemberRegistrationFormValues,
//   type MemberRegistrationResponseExtended,
// } from "@/app/(home)/(sidebar)/reports/(Member)/MemberRegistrationReport/page";
// import Preloader from "@/components/PreLoader/preloader";
// import { VisualReportSwitch } from "@/components/reportForm/Common/VisualReportSwitch";

// export type { ReportFormat };

// // ── Props ─────────────────────────────────────────────────────────────────
// interface MemberRegistrationReportProps {
//   control: Control<MemberRegistrationFormValues>;
//   handleSubmit: UseFormHandleSubmit<MemberRegistrationFormValues>;
//   onSubmit: SubmitHandler<MemberRegistrationFormValues>;
//   setValue: UseFormSetValue<MemberRegistrationFormValues>;
//   reportState: MemberRegistrationResponseExtended;
//   onPageChange: (page: number) => void;
//   onDownload: (format: ReportFormat) => void | Promise<void>;
// }

// // ── Component ────────────────────────────────────────────────────────────
// function MemberRegistrationReport({
//   control,
//   handleSubmit,
//   onSubmit,
//   setValue,
//   reportState,
//   onPageChange,
//   onDownload,
// }: MemberRegistrationReportProps) {
//   const { isLoading, htmlContent } = reportState;
//   const showHtmlReport = Boolean(htmlContent);

//   const reportRef = useRef<HTMLDivElement>(null);

//   const scrollToReport = () => {
//     reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//   };

//   return (
//     <>
//       {/* ── GLOBAL PRELOADER ─────────────────────────────────────────────── */}
//       {isLoading && (
//         <Box
//           sx={{
//             position: "fixed",
//             inset: 0,
//             zIndex: 9999,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             backgroundColor: "rgba(255,255,255,0.7)",
//             backdropFilter: "blur(2px)",
//           }}
//         >
//           <Preloader />
//         </Box>
//       )}

//       {/* ── PAGE CONTENT ───────────────────────────────────────────────── */}
//       <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//         {/* ── FORM ─────────────────────────────────────────────────────────── */}
//         <Paper variant="outlined" sx={{ px: 2, py: 1 }}>
//           <Typography
//             variant="h6"
//             sx={{ color: "primary.main", fontWeight: 600, fontSize: 16 }}
//           >
//             Member Registration Report
//           </Typography>
//           <Divider sx={{ mb: 0.5 }} />

//           <MemberLookupButton<MemberRegistrationFormValues> control={control} />
//           <Divider sx={{ mb: 0.5 }} />

//           <Box sx={{ mb: 0.5 }}>
//             <DateFields control={control} />
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//               gap: 2,
//               mb: 0.5,
//             }}
//           >
//             <BranchNameField<MemberRegistrationFormValues>
//               control={control}
//               setValue={setValue}
//               branchFieldName="branchId"
//             />
//             <SelectGroupField<MemberRegistrationFormValues>
//               control={control}
//               setValue={setValue}
//               branchFieldName="branchId"
//               collectionCenterFieldName={"collectionCenterId" as any}
//               groupFieldName="memberGroupId"
//             />
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
//               gap: 8,
//             }}
//           >
//             <OrderByField<MemberRegistrationFormValues>
//               control={control}
//               name="orderBy"
//               reportKey="savingTypeWiseBalance"
//             />
//             <VisualReportSwitch<MemberRegistrationFormValues>
//               control={control}
//               name="visualReport"
//             />
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           <Grid container spacing={1} alignItems="center">
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Box
//                 display="flex"
//                 justifyContent="center"
//                 alignItems="center"
//                 gap={5}
//                 width="100%"
//               >
//                 <ViewReportButton
//                   control={control}
//                   handleSubmit={handleSubmit}
//                   onSubmit={onSubmit}
//                   setValue={setValue}
//                   loading={isLoading}
//                   onBeforeSubmit={scrollToReport}
//                 />
//                 <ClearFormButton
//                   setValue={setValue}
//                   clearFields={["memberId", "memberName"]}
//                 />
//               </Box>
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* ── REPORT AREA (HTML view) ──────────────────────────────────── */}
//         {showHtmlReport && (
//           <>
//             {/* Navigation bar with export buttons */}
//             <ReportNavigation
//               pdfData={undefined} // Disable PDF download for HTML report
//               currentPage={1}
//               totalPages={1}
//               onPageChange={onPageChange}
//               onDownload={onDownload}
//             />

//             <Box ref={reportRef} sx={{ width: "100%", overflow: "auto" }}>
//               <Box
//                 sx={{
//                   position: "relative",
//                   height: "1000px",
//                   overflow: "hidden",
//                 }}
//               >
//                 <iframe
//                   key="html-view"
//                   srcDoc={htmlContent!}
//                   style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     height: "100%",
//                     border: "none",
//                   }}
//                   // IMPORTANT: allow-same-origin is required so that the script
//                   // can access the DOM and execute properly.
//                   sandbox="allow-scripts allow-modals allow-same-origin"
//                   title="HTML Report"
//                 />
//               </Box>
//             </Box>
//           </>
//         )}
//       </Box>
//     </>
//   );
// }

// export default React.memo(MemberRegistrationReport);

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
import Preloader from "@/components/PreLoader/preloader";
import { VisualReportSwitch } from "@/components/reportForm/Common/VisualReportSwitch";
import type {
  MemberRegistrationFormValues,
  MemberRegistrationResponseExtended,
} from "@/app/(home)/(sidebar)/Member/reports/MemberRegistrationReport/page";

export type { ReportFormat };

// ── Props ─────────────────────────────────────────────────────────────────
interface MemberRegistrationReportProps {
  control: Control<MemberRegistrationFormValues>;
  handleSubmit: UseFormHandleSubmit<MemberRegistrationFormValues>;
  onSubmit: SubmitHandler<MemberRegistrationFormValues>;
  setValue: UseFormSetValue<MemberRegistrationFormValues>;
  reportState: MemberRegistrationResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  renderKey: number;
}

// ── Component ─────────────────────────────────────────────────────────────
function MemberRegistrationReport({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
  iframeRef,
  renderKey,
}: MemberRegistrationReportProps) {
  const { isLoading, htmlContent, totalPages, currentPage } = reportState;
  const showReport = Boolean(htmlContent);
  const reportRef = useRef<HTMLDivElement>(null);

  const scrollToReport = () =>
    reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      {/* ── Global loading overlay ────────────────────────────────────── */}
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

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {/* ── Filter form ───────────────────────────────────────────────── */}
        <Paper variant="outlined" sx={{ px: 2, py: 1 }}>
          <Typography
            variant="h6"
            sx={{ color: "primary.main", fontWeight: 600, fontSize: 16 }}
          >
            Member Registration Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          <MemberLookupButton<MemberRegistrationFormValues> control={control} />
          <Divider sx={{ mb: 0.5 }} />

          <Box sx={{ mb: 0.5 }}>
            <DateFields control={control} />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

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
              collectionCenterFieldName={"collectionCenterId" as any}
              groupFieldName="memberGroupId"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

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

        {/* ── Report area ────────────────────────────────────────────────── */}
        {showReport && (
          <Box
            ref={reportRef}
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <ReportNavigation
              pdfData={undefined}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              onDownload={onDownload}
            />

            <Box
              sx={{
                width: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                // overflow:hidden clips the iframe — use overflow:auto so the
                // user can also scroll the outer container if needed
                overflow: "auto",
                height: "100vh",
                backgroundColor: "#d0d0d0",
              }}
            >
              <iframe
                ref={iframeRef}
                key={renderKey}
                srcDoc={htmlContent}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  display: "block",
                }}
                sandbox="allow-scripts allow-modals allow-same-origin"
                title="Member Registration Report"
              />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}

// memo is fine here — all props are stable references or primitives
export default React.memo(MemberRegistrationReport);
