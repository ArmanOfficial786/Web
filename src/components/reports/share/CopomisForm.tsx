// "use client";

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

// import {
//   CopomisFormValues,
//   CopomisResponseExtended,
// } from "@/app/(home)/(sidebar)/Share/CopomisReport/page";
// import CheckboxInput from "@/components/form/CheckboxInput";
// import Preloader from "@/components/PreLoader/preloader";
// import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
// import CollectionCenterField from "@/components/reportForm/Common/CollectionCenter";
// import DateFields from "@/components/reportForm/Common/DateFiels";
// import MemberTypeField from "@/components/reportForm/Common/MemberTypeField";
// import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
// import OrderByField from "@/components/reportForm/Common/OrderByFields";
// import ReportNavigation, {
//   type ReportFormat,
// } from "@/components/reportForm/Common/ReportNavigation";
// import ScrollToFirstPageButton from "@/components/reportForm/Common/ScrollToFirstPageButton";
// import SoleSelectGroupField from "@/components/reportForm/Common/SoleSelectGroupField";
// import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
// import { VisualReportSwitch } from "@/components/reportForm/Common/VisualReportSwitch";

// export type { ReportFormat };

// interface CopomisFormProps {
//   control: Control<CopomisFormValues>;
//   handleSubmit: UseFormHandleSubmit<CopomisFormValues>;
//   onSubmit: SubmitHandler<CopomisFormValues>;
//   setValue: UseFormSetValue<CopomisFormValues>;
//   reset: UseFormReset<CopomisFormValues>;
//   reportState: CopomisResponseExtended;
//   onPageChange: (page: number) => void;
//   onDownload: (format: ReportFormat) => void | Promise<void>;
// }

// function CopomisForm({
//   control,
//   handleSubmit,
//   onSubmit,
//   setValue,
//   reportState,
//   onPageChange,
//   onDownload,
// }: CopomisFormProps) {
//   const { isLoading, pdfData, pagination } = reportState;
//   const showReport = Boolean(pdfData);
//   const reportRef = useRef<HTMLDivElement>(null);

//   const currentPage = pagination?.currentPage ?? 1;
//   const totalPages = pagination?.totalPages ?? 1;

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
//             Copomis Report
//           </Typography>
//           <Divider sx={{ mb: 0.5 }} />

//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//               gap: 2,
//             }}
//           >
//             <DateFields<CopomisFormValues>
//               control={control}
//               toDateName="tillDateBs"
//               toDateLabel="Till Date"
//               mode="BS"
//               showFromDate={false}
//               showToDate={true}
//             />
//             <CheckboxInput
//               name="showMemberPhoto"
//               control={control}
//               label="Show Member Photo"
//               size="small"
//             />
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//               gap: 2,
//             }}
//           >
//             <OfficeNameField<CopomisFormValues>
//               control={control}
//               branchFieldName="officeIds"
//             />
//             <CollectionCenterField<CopomisFormValues>
//               control={control}
//               setValue={setValue}
//               branchFieldName="officeIds"
//               collectionCenterFieldName="collectionCenterId"
//             />
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//               gap: 2,
//               alignItems: "center",
//             }}
//           >
//             <SoleSelectGroupField<CopomisFormValues>
//               control={control}
//               setValue={setValue}
//               branchFieldName="officeIds"
//               groupFieldName="memberGroupId"
//             />
//             <MemberTypeField<CopomisFormValues>
//               control={control}
//               memberTypeFieldName="memberTypeId"
//               label="Member Type"
//             />
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//               gap: 2,
//               alignItems: "center",
//             }}
//           >
//             <OrderByField<CopomisFormValues>
//               control={control}
//               name="orderBy"
//               reportKey="copomis-report"
//             />
//             <VisualReportSwitch<CopomisFormValues>
//               control={control}
//               name="visualReport"
//             />
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-around",
//               alignItems: "center",
//               gap: 1,
//             }}
//           >
//             <Box>
//               <CheckboxInput
//                 name="showMemberPhoto"
//                 control={control}
//                 label="Show Member Photo"
//                 size="small"
//               />
//             </Box>
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
//                 <ViewReportButton<CopomisFormValues>
//                   control={control}
//                   handleSubmit={handleSubmit}
//                   onSubmit={onSubmit}
//                   setValue={setValue}
//                   loading={isLoading}
//                 />
//                 <ClearFormButton
//                   setValue={setValue}
//                   clearFields={[
//                     "tillDateBs",
//                     "officeIds",
//                     "collectionCenterId",
//                     "memberGroupId",
//                     "memberTypeId",
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
//               }}
//             />

//             <ScrollToFirstPageButton
//               onClick={() => {
//                 if (currentPage <= 1) {
//                   onPageChange(totalPages);
//                 } else {
//                   onPageChange(1);
//                 }
//               }}
//               currentPage={currentPage}
//               totalPages={totalPages}
//               hideWhenSinglePage={true}
//             />
//           </Box>
//         )}
//       </Box>
//     </>
//   );
// }

// export default React.memo(CopomisForm);

"use client";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useEffect, useRef } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";

import {
  CopomisFormValues,
  CopomisResponseExtended,
} from "@/app/(home)/(sidebar)/Share/CopomisReport/page";
import CheckboxInput from "@/components/form/CheckboxInput";
import Preloader from "@/components/PreLoader/preloader";
import BranchNameField from "@/components/reportForm/Common/BranchNameField";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import CollectionCenterField from "@/components/reportForm/Common/CollectionCenter";
import DateFields from "@/components/reportForm/Common/DateFiels";
import MemberTypeField from "@/components/reportForm/Common/MemberTypeField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import SoleSelectGroupField from "@/components/reportForm/Common/SoleSelectGroupField";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import { VisualReportSwitch } from "@/components/reportForm/Common/VisualReportSwitch";

export type { ReportFormat };

interface CopomisFormProps {
  control: Control<CopomisFormValues>;
  handleSubmit: UseFormHandleSubmit<CopomisFormValues>;
  onSubmit: SubmitHandler<CopomisFormValues>;
  setValue: UseFormSetValue<CopomisFormValues>;
  reset: UseFormReset<CopomisFormValues>;
  reportState: CopomisResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  renderKey: number;
}

function CopomisForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
  iframeRef,
  renderKey,
}: CopomisFormProps) {
  const { isLoading, htmlContent, totalPages, currentPage } = reportState;
  const showReport = Boolean(htmlContent);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showReport && !isLoading) {
      reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [htmlContent, showReport, isLoading]);

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
            Copomis Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <DateFields<CopomisFormValues>
              control={control}
              toDateName="tillDateBs"
              toDateLabel="Till Date"
              mode="BS"
              showFromDate={false}
              showToDate={true}
            />
            <CheckboxInput
              name="showMemberPhoto"
              control={control}
              label="Show Member Photo"
              size="small"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <BranchNameField<CopomisFormValues>
              control={control}
              branchFieldName="officeIds"
              setValue={setValue}
            />
            <CollectionCenterField<CopomisFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="officeIds"
              collectionCenterFieldName="collectionCenterId"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <SoleSelectGroupField<CopomisFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="officeIds"
              groupFieldName="memberGroupId"
            />
            <MemberTypeField<CopomisFormValues>
              control={control}
              memberTypeFieldName="memberTypeId"
              label="Member Type"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <OrderByField<CopomisFormValues>
              control={control}
              name="orderBy"
              reportKey="copomis-report"
            />
            <VisualReportSwitch<CopomisFormValues>
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
                <ViewReportButton<CopomisFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton
                  setValue={setValue}
                  clearFields={[
                    "tillDateBs",
                    "officeIds",
                    "collectionCenterId",
                    "memberGroupId",
                    "memberTypeId",
                    "orderBy",
                  ]}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

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
                title="Copomis Report"
              />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}

export default React.memo(CopomisForm);
