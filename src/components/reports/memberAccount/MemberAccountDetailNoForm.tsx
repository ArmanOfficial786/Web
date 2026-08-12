// // components/reports/memberAccount/MemberAccountDetailNoForm.tsx
// "use client";

// import React, { useEffect, useRef } from "react";
// import type {
//   Control,
//   SubmitHandler,
//   UseFormHandleSubmit,
//   UseFormSetValue,
//   UseFormReset,
// } from "react-hook-form";
// import { useWatch } from "react-hook-form";
// import Box from "@mui/material/Box";
// import Divider from "@mui/material/Divider";
// import Grid from "@mui/material/Grid";
// import Paper from "@mui/material/Paper";
// import Typography from "@mui/material/Typography";
// import TextField from "@mui/material/TextField";
// import { Controller } from "react-hook-form";

// import ReportNavigation, {
//   type ReportFormat,
// } from "@/components/reportForm/Common/ReportNavigation";
// import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
// import OrderByField from "@/components/reportForm/Common/OrderByFields";
// import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
// import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
// import Preloader from "@/components/PreLoader/preloader";
// import FieldRow from "@/utilis/FieldRow";
// import DateInput from "@/components/form/DateInput";
// import DropDown from "@/components/form/DropDown";
// import CheckboxInput from "@/components/form/CheckboxInput";
// import { useReportFormContext } from "@/contexts/ReportFormContext";
// import type {
//   MemberAccountDetailNoFormValues,
//   MemberAccountDetailNoResponseExtended,
// } from "@/app/(home)/(sidebar)/MemberAc/reports/MemberAccountDetailNoReport/page";

// export type { ReportFormat };

// interface MemberAccountDetailNoFormProps {
//   control: Control<MemberAccountDetailNoFormValues>;
//   handleSubmit: UseFormHandleSubmit<MemberAccountDetailNoFormValues>;
//   onSubmit: SubmitHandler<MemberAccountDetailNoFormValues>;
//   setValue: UseFormSetValue<MemberAccountDetailNoFormValues>;
//   reset: UseFormReset<MemberAccountDetailNoFormValues>;
//   reportState: MemberAccountDetailNoResponseExtended;
//   onPageChange: (page: number) => void;
//   onDownload: (format: ReportFormat) => void | Promise<void>;
// }

// function MemberAccountDetailNoForm({
//   control,
//   handleSubmit,
//   onSubmit,
//   setValue,
//   reportState,
//   onPageChange,
//   onDownload,
// }: MemberAccountDetailNoFormProps) {
//   const { pdfData, isLoading, pagination } = reportState;
//   const showReport = Boolean(pdfData);
//   const reportRef = useRef<HTMLDivElement>(null);

//   const {
//     depositTypeOptions,
//     fetchDepositTypes,
//     loanMasterListOptions,
//     fetchLoanMasterList,
//     shareTypeOptions,
//     fetchShareType,
//   } = useReportFormContext();

//   const includeSaving = useWatch({ control, name: "includeSaving" });
//   const includeShare = useWatch({ control, name: "includeShare" });
//   const includeLoan = useWatch({ control, name: "includeLoan" });

//   // ── Fetch each type list lazily, only once its checkbox is first checked ──
//   useEffect(() => {
//     if (includeSaving) fetchDepositTypes();
//   }, [includeSaving, fetchDepositTypes]);

//   useEffect(() => {
//     if (includeShare) fetchShareType();
//   }, [includeShare, fetchShareType]);

//   useEffect(() => {
//     if (includeLoan) fetchLoanMasterList();
//   }, [includeLoan, fetchLoanMasterList]);

//   // ── Scroll only after the report has actually loaded, not before submit ────
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
//             Member Account Detail No. Report
//           </Typography>
//           <Divider sx={{ mb: 0.5 }} />

//           {/* ── Till Date + Member Type ───────────────────────────────────── */}
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

//             {/* ⚠️ Placeholder — memberType's real meaning/options unknown */}
//             <FieldRow label="Member Type">
//               <Controller
//                 name="memberType"
//                 control={control}
//                 render={({ field, fieldState }) => (
//                   <TextField
//                     {...field}
//                     type="number"
//                     size="small"
//                     fullWidth
//                     value={field.value ?? 0}
//                     onChange={(e) => field.onChange(Number(e.target.value))}
//                     error={!!fieldState.error}
//                     helperText={fieldState.error?.message}
//                   />
//                 )}
//               />
//             </FieldRow>
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           {/* ── Branch Name (multi-select checkboxes) ────────────────────── */}
//           <Box sx={{ mb: 0.5 }}>
//             <OfficeNameField<MemberAccountDetailNoFormValues>
//               control={control}
//               branchFieldName="branchId"
//             />
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           {/* ── Include Saving + Saving Type (shown only when checked) ───── */}
//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//               gap: 2,
//               alignItems: "center",
//             }}
//           >
//             <FieldRow label="">
//               <CheckboxInput
//                 name="includeSaving"
//                 control={control}
//                 label="Include Saving"
//                 size="small"
//                 color="primary"
//                 labelPlacement="end"
//                 sx={{ ml: -3 }}
//               />
//             </FieldRow>
//             {includeSaving && (
//               <FieldRow label="Saving Type">
//                 <Box sx={{ width: "100%" }}>
//                   <DropDown
//                     name="savingTypeId"
//                     control={control}
//                     label="Saving Type"
//                     options={depositTypeOptions}
//                     fullWidth
//                   />
//                 </Box>
//               </FieldRow>
//             )}
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           {/* ── Include Share + Share Type (shown only when checked) ─────── */}
//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//               gap: 2,
//               alignItems: "center",
//             }}
//           >
//             <FieldRow label="">
//               <CheckboxInput
//                 name="includeShare"
//                 control={control}
//                 label="Include Share"
//                 size="small"
//                 color="primary"
//                 labelPlacement="end"
//                 sx={{ ml: -3 }}
//               />
//             </FieldRow>
//             {includeShare && (
//               <FieldRow label="Share Type">
//                 <Box sx={{ width: "100%" }}>
//                   <DropDown
//                     name="shareTypeId"
//                     control={control}
//                     label="Share Type"
//                     options={shareTypeOptions}
//                     fullWidth
//                   />
//                 </Box>
//               </FieldRow>
//             )}
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           {/* ── Include Loan + Loan Type (shown only when checked) ───────── */}
//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//               gap: 2,
//               alignItems: "center",
//             }}
//           >
//             <FieldRow label="">
//               <CheckboxInput
//                 name="includeLoan"
//                 control={control}
//                 label="Include Loan"
//                 size="small"
//                 color="primary"
//                 labelPlacement="end"
//                 sx={{ ml: -3 }}
//               />
//             </FieldRow>
//             {includeLoan && (
//               <FieldRow label="Loan Type">
//                 <Box sx={{ width: "100%" }}>
//                   <DropDown
//                     name="loanTypeId"
//                     control={control}
//                     label="Loan Type"
//                     options={loanMasterListOptions}
//                     fullWidth
//                   />
//                 </Box>
//               </FieldRow>
//             )}
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
//             <OrderByField<MemberAccountDetailNoFormValues>
//               control={control}
//               name="orderBy"
//               reportKey="member-account-detail-no-report" // ⚠️ add this key to accountOrderByOptions.ts
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
//                 <ViewReportButton<MemberAccountDetailNoFormValues>
//                   control={control}
//                   handleSubmit={handleSubmit}
//                   onSubmit={onSubmit}
//                   setValue={setValue}
//                   loading={isLoading}
//                 />
//                 <ClearFormButton setValue={setValue} clearFields={[]} />
//               </Box>
//             </Grid>
//           </Grid>
//         </Paper>

//         {showReport && (
//           <ReportNavigation
//             pdfData={pdfData ?? ""}
//             currentPage={pagination?.currentPage ?? 1}
//             totalPages={pagination?.totalPages ?? 1}
//             onPageChange={onPageChange}
//             onDownload={onDownload}
//           />
//         )}

//         {showReport && (
//           <Box
//             ref={reportRef}
//             sx={{ position: "relative", height: "1000px", overflow: "hidden" }}
//           >
//             <embed
//               key={pdfData}
//               src={`${pdfData}#page=${pagination?.currentPage ?? 1}&toolbar=0&zoom=100`}
//               style={{
//                 position: "absolute",
//                 top: "-40px",
//                 left: 0,
//                 width: "100%",
//                 height: "calc(100% + 40px)",
//                 border: "none",
//               }}
//             />
//           </Box>
//         )}
//       </Box>
//     </>
//   );
// }

// export default React.memo(MemberAccountDetailNoForm);

// components/reports/memberAccount/MemberAccountDetailNoForm.tsx
"use client";

import React, { useEffect, useRef } from "react";
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

import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import OfficeNameField from "@/components/reportForm/Common/OfficeNameField";
import OrderByField from "@/components/reportForm/Common/OrderByFields";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import Preloader from "@/components/PreLoader/preloader";
import FieldRow from "@/utilis/FieldRow";
import RadioInput from "@/components/form/RadioInput";
import DateInput from "@/components/form/DateInput";
import DropDown from "@/components/form/DropDown";
import CheckboxInput from "@/components/form/CheckboxInput";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import type {
  MemberAccountDetailNoFormValues,
  MemberAccountDetailNoResponseExtended,
} from "@/app/(home)/(sidebar)/MemberAc/reports/MemberAccountDetailNoReport/page";

export type { ReportFormat };

// ── Member Type: Active / Inactive ───────────────────────────────────────────
const memberTypeOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

interface MemberAccountDetailNoFormProps {
  control: Control<MemberAccountDetailNoFormValues>;
  handleSubmit: UseFormHandleSubmit<MemberAccountDetailNoFormValues>;
  onSubmit: SubmitHandler<MemberAccountDetailNoFormValues>;
  setValue: UseFormSetValue<MemberAccountDetailNoFormValues>;
  reset: UseFormReset<MemberAccountDetailNoFormValues>;
  reportState: MemberAccountDetailNoResponseExtended;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

function MemberAccountDetailNoForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  reportState,
  onPageChange,
  onDownload,
}: MemberAccountDetailNoFormProps) {
  const { pdfData, isLoading, pagination } = reportState;
  const showReport = Boolean(pdfData);
  const reportRef = useRef<HTMLDivElement>(null);

  const {
    depositTypeOptions,
    fetchDepositTypes,
    loanMasterListOptions,
    fetchLoanMasterList,
    shareTypeOptions,
    fetchShareType,
  } = useReportFormContext();

  // ── All three type lists load on mount — dropdowns are always visible,
  // not conditional on their checkbox (matches the screenshot layout) ───────
  useEffect(() => {
    fetchDepositTypes();
    fetchShareType();
    fetchLoanMasterList();
  }, [fetchDepositTypes, fetchShareType, fetchLoanMasterList]);

  // ── Scroll only after the report has actually loaded, not before submit ────
  useEffect(() => {
    if (showReport && !isLoading) {
      reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pdfData, showReport, isLoading]);

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
            Active/Inactive Member List Report
          </Typography>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Till Date + Member Type (Active/Inactive radio) ──────────── */}
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

            <FieldRow label="Member Type">
              <RadioInput
                name="memberType"
                control={control}
                radioOptions={memberTypeOptions}
                row
              />
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Office Name (multi-select checkboxes) ────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <OfficeNameField<MemberAccountDetailNoFormValues>
              control={control}
              branchFieldName="branchId"
            />

            <FieldRow label="Transaction Type">
              <Box sx={{ display: "flex", gap: 3 }}>
                <CheckboxInput
                  name="includeShare"
                  control={control}
                  label="Share"
                  size="small"
                  color="primary"
                  labelPlacement="end"
                />
                <CheckboxInput
                  name="includeSaving"
                  control={control}
                  label="Saving"
                  size="small"
                  color="primary"
                  labelPlacement="end"
                />
                <CheckboxInput
                  name="includeLoan"
                  control={control}
                  label="Loan"
                  size="small"
                  color="primary"
                  labelPlacement="end"
                />
              </Box>
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Saving Type + Transaction Type checkboxes ────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "center",
            }}
          >
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
            <FieldRow label="Saving Type">
              <Box sx={{ width: "100%" }}>
                <DropDown
                  name="savingTypeId"
                  control={control}
                  label="Saving Type"
                  options={depositTypeOptions}
                  fullWidth
                />
              </Box>
            </FieldRow>
          </Box>
          <Divider sx={{ mb: 0.5 }} />

          {/* ── Share Type + Loan Type ────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <FieldRow label="Loan Type">
              <Box sx={{ width: "100%" }}>
                <DropDown
                  name="loanTypeId"
                  control={control}
                  label="Loan Type"
                  options={loanMasterListOptions}
                  fullWidth
                />
              </Box>
            </FieldRow>
            <OrderByField<MemberAccountDetailNoFormValues>
              control={control}
              name="orderBy"
              reportKey="member-account-detail-no-report" // ⚠️ add this key to accountOrderByOptions.ts
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
                <ViewReportButton<MemberAccountDetailNoFormValues>
                  control={control}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  setValue={setValue}
                  loading={isLoading}
                />
                <ClearFormButton setValue={setValue} clearFields={[]} />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {showReport && (
          <ReportNavigation
            pdfData={pdfData ?? ""}
            currentPage={pagination?.currentPage ?? 1}
            totalPages={pagination?.totalPages ?? 1}
            onPageChange={onPageChange}
            onDownload={onDownload}
          />
        )}

        {showReport && (
          <Box
            ref={reportRef}
            sx={{ position: "relative", height: "1000px", overflow: "hidden" }}
          >
            <embed
              key={pdfData}
              src={`${pdfData}#page=${pagination?.currentPage ?? 1}&toolbar=0&zoom=100`}
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
        )}
      </Box>
    </>
  );
}

export default React.memo(MemberAccountDetailNoForm);
