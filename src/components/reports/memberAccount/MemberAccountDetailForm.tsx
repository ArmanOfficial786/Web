// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import type {
//   Control,
//   SubmitHandler,
//   UseFormHandleSubmit,
//   UseFormSetValue,
//   UseFormReset,
// } from "react-hook-form";
// import Box from "@mui/material/Box";
// import Divider from "@mui/material/Divider";
// import Grid from "@mui/material/Grid";
// import Paper from "@mui/material/Paper";
// import Typography from "@mui/material/Typography";
// import Collapse from "@mui/material/Collapse";
// import IconButton from "@mui/material/IconButton";
// import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";

// import ReportNavigation, {
//   type ReportFormat,
// } from "@/components/reportForm/Common/ReportNavigation";
// import MemberLookupButton from "@/components/reportForm/Common/MemberLookUpButton";
// import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
// import CollectionCenterField from "@/components/reportForm/Common/CollectionCenter";
// import SelectGroupField from "@/components/reportForm/Common/SelectGroupField";
// import SameCompanyField from "@/components/reportForm/Common/SameCompanyField";
// import OrderByField from "@/components/reportForm/Common/OrderByFields";
// import DepositType from "@/components/reportForm/MemberAccount/DepositType";
// import Collector from "@/components/reportForm/MemberAccount/Collector";
// import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
// import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
// import Preloader from "@/components/PreLoader/preloader";
// import FieldRow from "@/utilis/FieldRow";
// import DateInput from "@/components/form/DateInput";
// import DropDown from "@/components/form/DropDown";
// import CheckboxInput from "@/components/form/CheckboxInput";
// import MultiCheckboxInput from "@/components/form/MultiCheckboxInput";
// import type {
//   MemberAccountDetailFormValues,
//   MemberAccountDetailResponseExtended,
// } from "@/app/(home)/(sidebar)/MemberAc/SavingAcWiseReport/MemberAccountDetailReport/page";
// import { MemberAccountColumnOptions } from "@/utilis/Constants/MemberAccountColumnOptions";

// export type { ReportFormat };

// // ⚠️ ASSUMPTION: -1=All confirmed against backend status switch; the rest map 1:1
// // to MemberAccountDetailController.GetStatusLabel (1..5).
// const statusOptions = [
//   { id: "-1", name: "-- All --" },
//   { id: "1", name: "Opened" },
//   { id: "2", name: "Closed" },
//   { id: "3", name: "With Balance" },
//   { id: "4", name: "Suspended" },
//   { id: "5", name: "Disable" },
// ];

// interface MemberAccountDetailFormProps {
//   control: Control<MemberAccountDetailFormValues>;
//   handleSubmit: UseFormHandleSubmit<MemberAccountDetailFormValues>;
//   onSubmit: SubmitHandler<MemberAccountDetailFormValues>;
//   setValue: UseFormSetValue<MemberAccountDetailFormValues>;
//   reset: UseFormReset<MemberAccountDetailFormValues>;
//   reportState: MemberAccountDetailResponseExtended;
//   onPageChange: (page: number) => void;
//   onDownload: (format: ReportFormat) => void | Promise<void>;
//   iframeRef: React.RefObject<HTMLIFrameElement | null>;
//   renderKey: number;
// }

// function MemberAccountDetailForm({
//   control,
//   handleSubmit,
//   onSubmit,
//   setValue,
//   reportState,
//   onPageChange,
//   onDownload,
//   iframeRef,
//   renderKey,
// }: MemberAccountDetailFormProps) {
//   const { isLoading, htmlContent, totalPages, currentPage } = reportState;
//   const showReport = Boolean(htmlContent);
//   const reportRef = useRef<HTMLDivElement>(null);
//   const [columnsExpanded, setColumnsExpanded] = useState(true);

//   // ⚠️ ASSUMPTION: swap for your real auth/user hook
//   const userId = 160;

//   // ── Scroll only after the report has actually loaded ───────────────────────
//   useEffect(() => {
//     if (htmlContent && reportRef.current) {
//       reportRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   }, [htmlContent]);

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
//             Member Account Detail Report
//           </Typography>
//           <Divider sx={{ mb: 0.5 }} />

//           {/* ── Member Lookup (Member Id + Member Name) ──────────────────── */}
//           <MemberLookupButton<MemberAccountDetailFormValues>
//             control={control}
//           />

//           {/* ── Till Date + Deposit Type ──────────────────────────────────── */}
//           <Box
//             sx={{
//               mb: 0.5,
//               display: "grid",
//               gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//               gap: 2,
//             }}
//           >
//             <FieldRow label="Till Date">
//               <Box sx={{ width: "100%" }}>
//                 <DateInput name="tillDate" control={control} dateType="BS" />
//               </Box>
//             </FieldRow>
//             <DepositType<MemberAccountDetailFormValues>
//               control={control}
//               depositTypeFieldName="depositTypeId"
//             />
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           {/* ── Status + Collector ────────────────────────────────────────── */}
//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//               gap: 2,
//             }}
//           >
//             <FieldRow label="Status">
//               <Box sx={{ width: "100%" }}>
//                 <DropDown
//                   name="status"
//                   control={control}
//                   label="Status"
//                   options={statusOptions}
//                   fullWidth
//                 />
//               </Box>
//             </FieldRow>
//             <Collector<MemberAccountDetailFormValues>
//               control={control}
//               collectorFieldName="collectorId"
//               userId={userId}
//             />
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           {/* ── Office Name (multi-select checkboxes) ────────────────────── */}
//           <Box sx={{ mb: 0.5 }}>
//             <OfficeNameField<MemberAccountDetailFormValues>
//               control={control}
//               branchFieldName="branchId"
//             />
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           {/* ── Collection Center + Enable Collection Center ─────────────── */}
//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//               gap: 2,
//               alignItems: "center",
//             }}
//           >
//             <CollectionCenterField<MemberAccountDetailFormValues>
//               control={control}
//               setValue={setValue}
//               branchFieldName="branchId"
//               collectionCenterFieldName="collectionCenterId"
//             />
//             <FieldRow label="">
//               <CheckboxInput
//                 name="enableCollectionCenterGroup"
//                 control={control}
//                 label="Enable Collection Center"
//                 size="small"
//                 color="primary"
//                 labelPlacement="end"
//                 sx={{ ml: -3 }}
//               />
//             </FieldRow>
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           {/* ── Select Group + Enable Group ───────────────────────────────── */}
//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//               gap: 2,
//               alignItems: "center",
//             }}
//           >
//             <SelectGroupField<MemberAccountDetailFormValues>
//               control={control}
//               setValue={setValue}
//               branchFieldName="branchId"
//               collectionCenterFieldName="collectionCenterId"
//               groupFieldName="memberGroupId"
//             />
//             <FieldRow label="">
//               <CheckboxInput
//                 name="enableMemberGroupGroup"
//                 control={control}
//                 label="Enable Group"
//                 size="small"
//                 color="primary"
//                 labelPlacement="end"
//                 sx={{ ml: -3 }}
//               />
//             </FieldRow>
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           {/* ── Column selector (collapsible) ────────────────────────────── */}
//           <Box sx={{ py: 0.5 }}>
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
//                 Select Columns to Display
//               </Typography>
//               <IconButton
//                 onClick={() => setColumnsExpanded(!columnsExpanded)}
//                 size="small"
//               >
//                 {columnsExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
//               </IconButton>
//             </Box>

//             <Collapse in={columnsExpanded}>
//               <MultiCheckboxInput
//                 name="selectedColumns"
//                 control={control}
//                 options={MemberAccountColumnOptions}
//                 groupLabel=""
//                 columns={{ xs: 2, sm: 3, md: 4, lg: 6 }}
//               />
//             </Collapse>
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           {/* ── Same Company Name + Order By ──────────────────────────────── */}
//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//               gap: 2,
//             }}
//           >
//             <SameCompanyField<MemberAccountDetailFormValues>
//               control={control}
//               labelPlacement="end"
//             />
//             <OrderByField<MemberAccountDetailFormValues>
//               control={control}
//               name="orderBy"
//               reportKey="member-account-detail-report" // ⚠️ add this key to memberOrderByOptions.ts
//             />
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           {/* ── View Report | Clear ───────────────────────────────────────── */}
//           <Grid container spacing={1} alignItems="center">
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Box
//                 display="flex"
//                 justifyContent="center"
//                 alignItems="center"
//                 gap={5}
//                 width="100%"
//               >
//                 <ViewReportButton<MemberAccountDetailFormValues>
//                   control={control}
//                   handleSubmit={handleSubmit}
//                   onSubmit={onSubmit}
//                   setValue={setValue}
//                   loading={isLoading}
//                 />
//                 <ClearFormButton
//                   setValue={setValue}
//                   clearFields={["memberId", "memberName"]}
//                 />
//               </Box>
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* ── Report iframe area (HTML srcDoc + client-side pagination) ───── */}
//         {showReport && (
//           <Box
//             ref={reportRef}
//             sx={{ display: "flex", flexDirection: "column", gap: 1 }}
//           >
//             <ReportNavigation
//               pdfData={undefined}
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={onPageChange}
//               onDownload={onDownload}
//             />

//             <Box
//               sx={{
//                 width: "100%",
//                 border: "1px solid",
//                 borderColor: "divider",
//                 borderRadius: 1,
//                 overflow: "auto",
//                 height: "100vh",
//                 backgroundColor: "#d0d0d0",
//               }}
//             >
//               <iframe
//                 ref={iframeRef}
//                 key={renderKey}
//                 srcDoc={htmlContent}
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   border: "none",
//                   display: "block",
//                 }}
//                 sandbox="allow-scripts allow-modals allow-same-origin"
//                 title="Member Account Detail Report"
//               />
//             </Box>
//           </Box>
//         )}
//       </Box>
//     </>
//   );
// }

// export default React.memo(MemberAccountDetailForm);

// components/reports/memberAccount/MemberAccountDetailForm.tsx

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormReset,
} from "react-hook-form";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";

import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import ScrollToFirstPageButton from "@/components/reportForm/Common/ScrollToUpButton";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import CollectionCenterField from "@/components/reportForm/Common/CollectionCenter";
import SelectGroupField from "@/components/reportForm/Common/SelectGroupField";
import SameCompanyField from "@/components/reportForm/Common/SameCompanyField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import DepositType from "@/components/reportForm/MemberAccount/DepositType";
import Collector from "@/components/reportForm/MemberAccount/Collector";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import Preloader from "@/components/PreLoader/preloader";
import FieldRow from "@/utilis/FieldRow";
import DateInput from "@/components/form/DateInput";
import DropDown from "@/components/form/DropDown";
import CheckboxInput from "@/components/form/CheckboxInput";
import MultiCheckboxInput from "@/components/form/MultiCheckboxInput";
import type {
  MemberAccountDetailFormValues,
  MemberAccountDetailResponseExtended,
} from "@/app/(home)/(sidebar)/MemberAc/SavingAcWiseReport/MemberAccountDetailReport/page";
import { MemberAccountColumnOptions } from "@/utilis/Constants/MemberAccountColumnOptions";
import { MemberLookupConfig } from "@/config/MemberLookupConfig";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";

export type { ReportFormat };

// ⚠️ ASSUMPTION: -1=All confirmed against backend status switch; the rest map 1:1
// to MemberAccountDetailController.GetStatusLabel (1..5).
const statusOptions = [
  { id: "-1", name: "-- All --" },
  { id: "1", name: "Opened" },
  { id: "2", name: "Closed" },
  { id: "3", name: "With Balance" },
  { id: "4", name: "Suspended" },
  { id: "5", name: "Disable" },
];

interface MemberAccountDetailFormProps {
  control: Control<MemberAccountDetailFormValues>;
  handleSubmit: UseFormHandleSubmit<MemberAccountDetailFormValues>;
  onSubmit: SubmitHandler<MemberAccountDetailFormValues>;
  setValue: UseFormSetValue<MemberAccountDetailFormValues>;
  reset: UseFormReset<MemberAccountDetailFormValues>;
  reportState: MemberAccountDetailResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  renderKey: number;
}

function MemberAccountDetailForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
  iframeRef,
  renderKey,
}: MemberAccountDetailFormProps) {
  const { isLoading, htmlContent, totalPages, currentPage } = reportState;
  const showReport = Boolean(htmlContent);
  const reportRef = useRef<HTMLDivElement>(null);
  const [columnsExpanded, setColumnsExpanded] = useState(true);

  // ⚠️ ASSUMPTION: swap for your real auth/user hook
  const userId = 160;

  // ── Scroll only after the report has actually loaded ───────────────────────
  useEffect(() => {
    if (htmlContent && reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [htmlContent]);

  const memberLookupConfig = useMemo(
    () => MemberLookupConfig<MemberAccountDetailFormValues>(),
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
            Member Account Detail Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Member Lookup (Member Id + Member Name) ──────────────────── */}
          <EntityLookupField
            control={control}
            setValue={setValue}
            config={memberLookupConfig}
          />

          {/* ── Till Date + Deposit Type ──────────────────────────────────── */}
          <Box
            sx={{
              mb: 0.5,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <FieldRow label="Till Date">
              <Box sx={{ width: "100%" }}>
                <DateInput name="tillDate" control={control} dateType="BS" />
              </Box>
            </FieldRow>
            <DepositType<MemberAccountDetailFormValues>
              control={control}
              depositTypeFieldName="depositTypeId"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Status + Collector ────────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <FieldRow label="Status">
              <Box sx={{ width: "100%" }}>
                <DropDown
                  name="status"
                  control={control}
                  label="Status"
                  options={statusOptions}
                  fullWidth
                />
              </Box>
            </FieldRow>
            <Collector<MemberAccountDetailFormValues>
              control={control}
              collectorFieldName="collectorId"
              userId={userId}
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name (multi-select checkboxes) ────────────────────── */}
          <Box sx={{ mb: 0.5 }}>
            <OfficeNameField<MemberAccountDetailFormValues>
              control={control}
              branchFieldName="branchId"
            />
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Collection Center + Enable Collection Center ─────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <CollectionCenterField<MemberAccountDetailFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchId"
              collectionCenterFieldName="collectionCenterId"
            />
            <FieldRow label="">
              <CheckboxInput
                name="enableCollectionCenterGroup"
                control={control}
                label="Enable Collection Center"
                size="small"
                color="primary"
                labelPlacement="end"
                sx={{ ml: -3 }}
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Select Group + Enable Group ───────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <SelectGroupField<MemberAccountDetailFormValues>
              control={control}
              setValue={setValue}
              branchFieldName="branchId"
              collectionCenterFieldName="collectionCenterId"
              groupFieldName="memberGroupId"
            />
            <FieldRow label="">
              <CheckboxInput
                name="enableMemberGroupGroup"
                control={control}
                label="Enable Group"
                size="small"
                color="primary"
                labelPlacement="end"
                sx={{ ml: -3 }}
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Column selector (collapsible) ────────────────────────────── */}
          <Box sx={{ py: 0.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                Select Columns to Display
              </Typography>
              <IconButton
                onClick={() => setColumnsExpanded(!columnsExpanded)}
                size="small"
              >
                {columnsExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
            </Box>

            <Collapse in={columnsExpanded}>
              <MultiCheckboxInput
                name="selectedColumns"
                control={control}
                options={MemberAccountColumnOptions}
                groupLabel=""
                columns={{ xs: 2, sm: 3, md: 4, lg: 6 }}
              />
            </Collapse>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Same Company Name + Order By ──────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <SameCompanyField<MemberAccountDetailFormValues>
              control={control}
              labelPlacement="end"
            />
            <OrderByField<MemberAccountDetailFormValues>
              control={control}
              name="orderBy"
              reportKey="member-account-detail-report" // ⚠️ add this key to memberOrderByOptions.ts
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
                <ViewReportButton<MemberAccountDetailFormValues>
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

        {/* ── Report iframe area (HTML srcDoc + client-side pagination) ───── */}
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

            {/* position: relative so the floating up-arrow button can anchor
                to this box's bottom-right corner */}
            <Box
              sx={{
                position: "relative",
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
                title="Member Account Detail Report"
              />

              {/* Jump to first page of the report */}
              <ScrollToFirstPageButton
                onClick={() => {
                  // If on first page, go to last; otherwise go to first
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
          </Box>
        )}
      </Box>
    </>
  );
}

export default React.memo(MemberAccountDetailForm);
