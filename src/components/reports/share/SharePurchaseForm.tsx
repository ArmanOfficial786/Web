// "use client";

// import {
//   SharePurchaseFormValues,
//   SharePurchaseResponseExtended,
// } from "@/app/(home)/(sidebar)/Share/SharePurchaseReport/page";
// import Preloader from "@/components/PreLoader/preloader";
// import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
// import DateFields from "@/components/reportForm/Common/DateFiels";
// import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
// import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
// import OrderByField from "@/components/reportForm/Common/OrderByFields";
// import ReportNavigation, {
//   type ReportFormat,
// } from "@/components/reportForm/Common/ReportNavigation";
// import ScrollToFirstPageButton from "@/components/reportForm/Common/ScrollToFirstPageButton";
// import SoleSelectGroupField from "@/components/reportForm/Common/SoleSelectGroupField";
// import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
// import { MemberLookupConfig } from "@/config/MemberLookupConfig";
// import Box from "@mui/material/Box";
// import Divider from "@mui/material/Divider";
// import Grid from "@mui/material/Grid";
// import Paper from "@mui/material/Paper";
// import Typography from "@mui/material/Typography";
// import React, { useEffect, useRef } from "react";
// import type {
//   Control,
//   SubmitHandler,
//   UseFormHandleSubmit,
//   UseFormReset,
//   UseFormSetValue,
// } from "react-hook-form";

// export type { ReportFormat };

// interface SharePurchaseFormProps {
//   control: Control<SharePurchaseFormValues>;
//   handleSubmit: UseFormHandleSubmit<SharePurchaseFormValues>;
//   onSubmit: SubmitHandler<SharePurchaseFormValues>;
//   setValue: UseFormSetValue<SharePurchaseFormValues>;
//   reset: UseFormReset<SharePurchaseFormValues>;
//   reportState: SharePurchaseResponseExtended;
//   onPageChange: (page: number) => void;
//   onDownload: (format: ReportFormat) => void | Promise<void>;
// }

// function SharePurchaseForm({
//   control,
//   handleSubmit,
//   onSubmit,
//   setValue,
//   reportState,
//   onPageChange,
//   onDownload,
// }: SharePurchaseFormProps) {
//   const { isLoading, pdfData, pagination } = reportState;
//   const showReport = Boolean(pdfData);
//   const reportRef = useRef<HTMLDivElement>(null);

//   const currentPage = pagination?.currentPage ?? 1;
//   const totalPages = pagination?.totalPages ?? 1;
//   const memberLookupConfig = React.useMemo(
//     () => MemberLookupConfig<SharePurchaseFormValues>(),
//     [],
//   );

//   useEffect(() => {
//     if (showReport && !isLoading) {
//       reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   }, [pdfData, showReport, isLoading]);

//   return (
//     <>
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
//             backdropFilter: "blur(3px)",
//           }}
//         >
//           <Preloader />
//         </Box>
//       )}

//       <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//         <Paper variant="outlined" sx={{ px: 2, py: 1 }}>
//           <Typography
//             variant="h6"
//             sx={{ color: "primary.main", fontWeight: 600, fontSize: 16 }}
//           >
//             Share Purchase Report
//           </Typography>
//           <Divider sx={{ mb: 0.5 }} />

//           {/* ── Member Directory Lookup ──────────────────────────────────── */}
//           <Box sx={{ mb: 0.5 }}>
//             <EntityLookupField
//               control={control}
//               setValue={setValue}
//               config={memberLookupConfig}
//             />
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           {/* ── From/To Date ─────────────────────────────────────────────── */}
//           <Box sx={{ mb: 0.5 }}>
//             <DateFields<SharePurchaseFormValues>
//               control={control}
//               fromDateName="fromDateBs"
//               toDateName="toDateBs"
//               mode="BS"
//             />
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           {/* ── Office Name + Group (sole select) ────────────────────────── */}
//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//               gap: 2,
//             }}
//           >
//             <OfficeNameField<SharePurchaseFormValues>
//               control={control}
//               branchFieldName="officeId"
//               multiple={false}
//             />
//             <SoleSelectGroupField<SharePurchaseFormValues>
//               control={control}
//               setValue={setValue}
//               branchFieldName="officeId"
//               groupFieldName="memberGroupId"
//             />
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           {/* ── Order By ──────────────────────────────────────────────────── */}
//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//               gap: 2,
//             }}
//           >
//             <OrderByField<SharePurchaseFormValues>
//               control={control}
//               name="orderBy"
//               reportKey="share-purchase-report"
//             />
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           {/* ── View Report | Clear ──────────────────────────────────────── */}
//           <Grid container spacing={1} alignItems="center">
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Box
//                 display="flex"
//                 justifyContent="center"
//                 alignItems="center"
//                 gap={5}
//                 width="100%"
//               >
//                 <ViewReportButton<SharePurchaseFormValues>
//                   control={control}
//                   handleSubmit={handleSubmit}
//                   onSubmit={onSubmit}
//                   setValue={setValue}
//                   loading={isLoading}
//                 />
//                 <ClearFormButton
//                   setValue={setValue}
//                   clearFields={[
//                     "memberId",
//                     "memberName",
//                     "fromDateBs",
//                     "toDateBs",
//                     "officeId",
//                     "memberGroupId",
//                     "orderBy",
//                   ]}
//                 />
//               </Box>
//             </Grid>
//           </Grid>
//         </Paper>

//         {showReport && (
//           <ReportNavigation
//             pdfData={pdfData ?? ""}
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={onPageChange}
//             onDownload={onDownload}
//           />
//         )}

//         {showReport && (
//           <Box
//             ref={reportRef}
//             sx={{ position: "relative", height: "1000px", overflow: "hidden" }}
//           >
//             <iframe
//               key={pdfData}
//               src={`${pdfData}#page=${currentPage}&toolbar=0&zoom=100`}
//               style={{
//                 position: "absolute",
//                 top: "-40px",
//                 left: 0,
//                 width: "100%",
//                 height: "calc(100% + 40px)",
//                 border: "none",
//                 zIndex: 0,
//               }}
//             />
//             <ScrollToFirstPageButton
//               onClick={() =>
//                 currentPage <= 1 ? onPageChange(totalPages) : onPageChange(1)
//               }
//               currentPage={currentPage}
//               totalPages={totalPages}
//               hideWhenSinglePage
//             />
//           </Box>
//         )}
//       </Box>
//     </>
//   );
// }

// export default React.memo(SharePurchaseForm);

"use client";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useEffect, useMemo, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";

import {
  SharePurchaseFormValues,
  SharePurchaseResponseExtended,
} from "@/app/(home)/(sidebar)/Share/SharePurchaseReport/page";
import DropDown from "@/components/form/DropDown";
import Preloader from "@/components/PreLoader/preloader";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import DateFields from "@/components/reportForm/Common/DateFiels";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ScrollToFirstPageButton from "@/components/reportForm/Common/ScrollToFirstPageButton";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import { VisualReportSwitch } from "@/components/reportForm/Common/VisualReportSwitch";
import { MemberLookupConfig } from "@/config/MemberLookupConfig";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";

export type { ReportFormat };

interface SharePurchaseFormProps {
  control: Control<SharePurchaseFormValues>;
  handleSubmit: UseFormHandleSubmit<SharePurchaseFormValues>;
  onSubmit: SubmitHandler<SharePurchaseFormValues>;
  setValue: UseFormSetValue<SharePurchaseFormValues>;
  reset: UseFormReset<SharePurchaseFormValues>;
  reportState: SharePurchaseResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function SharePurchaseForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: SharePurchaseFormProps) {
  const { isLoading, pdfData, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const { shareTypeOptions, fetchShareType } = useReportFormContext();

  useEffect(() => {
    if (showReport && !isLoading) {
      reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pdfData, showReport, isLoading]);

  useEffect(() => {
    fetchShareType();
  }, [fetchShareType]);

  const memberLookupConfig = useMemo(
    () => MemberLookupConfig<SharePurchaseFormValues>(),
    [],
  );

  return (
    <>
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
            backdropFilter: "blur(3px)",
          }}
        >
          <Preloader />
        </Box>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Paper variant="outlined" sx={{ px: 2, py: 1 }}>
          <Typography
            variant="h6"
            sx={{ color: "primary.main", fontWeight: 600, fontSize: 16 }}
          >
            Share Purchase Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Member Lookup (Member ID + Member Name) ──────────────────── */}
          <EntityLookupField
            control={control}
            setValue={setValue}
            config={memberLookupConfig}
          />
          <Divider sx={{ mb: 0.5 }} />

          {/* ── From/To Date ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <DateFields<SharePurchaseFormValues>
              control={control}
              fromDateName="fromDateBs"
              toDateName="toDateBs"
              mode="BS"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name + Share Type ─────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <OfficeNameField<SharePurchaseFormValues>
              control={control}
              branchFieldName="officeId"
            />
            <FieldRow label="Share Type">
              <Box sx={{ width: "100%" }}>
                <DropDown
                  name="shareTypeId"
                  control={control}
                  label="Share Type"
                  options={shareTypeOptions}
                  fullWidth
                />
              </Box>
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Order By + Visual Report Switch ──────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <OrderByField<SharePurchaseFormValues>
              control={control}
              name="orderBy"
              reportKey="share-purchase-report"
            />
            <VisualReportSwitch<SharePurchaseFormValues>
              control={control}
              name="visualReport"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── View Report | Clear ───────────────────────────────────────── */}
          <Grid container spacing={1} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={5}
                width="100%"
              >
                <ViewReportButton<SharePurchaseFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={["memberId", "memberName"]}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {showReport && (
          <ReportNavigation
            pdfData={pdfData ?? ""}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            onDownload={onDownload}
          />
        )}

        {showReport && (
          <Box
            ref={reportRef}
            sx={{ position: "relative", height: "1000px", overflow: "hidden" }}
          >
            <iframe
              key={pdfData}
              src={`${pdfData}#page=${currentPage}&toolbar=0&zoom=100`}
              style={{
                position: "absolute",
                top: "-40px",
                left: 0,
                width: "100%",
                height: "calc(100% + 40px)",
                border: "none",
              }}
            />

            <ScrollToFirstPageButton
              onClick={() => {
                if (currentPage <= 1) {
                  onPageChange(totalPages);
                } else {
                  onPageChange(1);
                }
              }}
              currentPage={currentPage}
              totalPages={totalPages}
              hideWhenSinglePage={true}
            />
          </Box>
        )}
      </Box>
    </>
  );
}

export default React.memo(SharePurchaseForm);
