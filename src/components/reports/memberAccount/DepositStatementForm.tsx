// "use client";

// import React, { useMemo } from "react";
// import type {
//   Control,
//   SubmitHandler,
//   UseFormHandleSubmit,
//   UseFormSetValue,
//   Path,
// } from "react-hook-form";
// import { Grid, Box, Paper, Typography, Divider } from "@mui/material";
// import FieldRow from "@/utilis/FieldRow";
// import DateInput from "@/components/form/DateInput";
// import CheckboxInput from "@/components/form/CheckboxInput";
// import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
// import { createAccountLookupConfig } from "@/config/AccountLookupConfig";
// import { VisualReportSwitch } from "@/components/reportForm/Common/VisualReportSwitch";
// import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
// import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
// import { LanguageSwitch } from "./LanguageSwitch";

// export interface DepositStatementFormValues {
//   accountNo?: string;
//   memberId?: string;
//   memberName?: string;
//   fromDate?: string;
//   toDate?: string;
//   fromDateAd?: string;
//   toDateAd?: string;
//   sameCompanyName?: boolean;
//   valueDate?: boolean;
//   nepaliDate?: boolean;
//   generateInterest?: boolean;
//   billNumber?: boolean;
//   language?: "English" | "Nepali";
//   statementVerifiedTill?: string;
//   passbookVerifiedTill?: string;
// }

// interface DepositStatementFormProps {
//   control: Control<DepositStatementFormValues>;
//   handleSubmit: UseFormHandleSubmit<DepositStatementFormValues>;
//   onSubmit: SubmitHandler<DepositStatementFormValues>;
//   setValue: UseFormSetValue<DepositStatementFormValues>;
// }

// export default function DepositStatementForm({
//   control,
//   handleSubmit,
//   onSubmit,
//   setValue,
// }: DepositStatementFormProps) {
//   const accountConfig = useMemo(
//     () => createAccountLookupConfig<DepositStatementFormValues>(),
//     [],
//   );

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//       <Paper variant="outlined" sx={{ px: 2, py: 1 }}>
//         <Typography
//           variant="h6"
//           sx={{ color: "primary.main", fontWeight: 600, fontSize: 16 }}
//         >
//           Deposit Statement Report
//         </Typography>
//         <Divider sx={{ mb: 1 }} />

//         <Box sx={{ mb: 1 }}>
//           <EntityLookupField
//             control={control}
//             setValue={setValue}
//             config={accountConfig}
//           />
//         </Box>

//         <Divider sx={{ mb: 1 }} />

//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//             gap: 2,
//             mb: 1,
//           }}
//         >
//           <Box>
//             <DateInput name="fromDate" control={control} dateType="BS" />
//           </Box>
//           <Box>
//             <DateInput name="fromDateAd" control={control} dateType="AD" />
//           </Box>
//         </Box>
//         <Divider sx={{ mb: 1 }} />

//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
//             gap: 2,
//             mb: 1,
//           }}
//         >
//           <Box>
//             <FieldRow label="From Date (AD)">
//               <DateInput
//                 name={"fromDateAd" as Path<DepositStatementFormValues>}
//                 control={control}
//                 dateType="AD"
//               />
//             </FieldRow>
//           </Box>
//           <Box>
//             <FieldRow label="To Date (AD)">
//               <DateInput
//                 name={"toDateAd" as Path<DepositStatementFormValues>}
//                 control={control}
//                 dateType="AD"
//               />
//             </FieldRow>
//           </Box>
//         </Box>
//         <Divider sx={{ mb: 1 }} />
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-around",
//             gap: 1,
//           }}
//         >
//           <Box>
//             <CheckboxInput
//               name="viewInterest"
//               control={control}
//               label="View Interest"
//               size="small"
//             />
//           </Box>
//           <Box>
//             <CheckboxInput
//               name="entryBy"
//               control={control}
//               label="Entry By"
//               size="small"
//             />
//           </Box>
//           <Box>
//             <CheckboxInput
//               name="generateInterest"
//               control={control}
//               label="Generate Interest"
//               size="small"
//             />
//           </Box>
//           <Box>
//             <CheckboxInput
//               name="billNumber"
//               control={control}
//               label="Bill Number"
//               size="small"
//             />
//           </Box>
//         </Box>
//         <Divider sx={{ mb: 1 }} />

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-around",
//             gap: 1,
//           }}
//         >
//           <Box>
//             <CheckboxInput
//               name="sameCompanyName"
//               control={control}
//               label="Same Company Name"
//               size="small"
//             />
//           </Box>
//           <Box>
//             <CheckboxInput
//               name="valueDate"
//               control={control}
//               label="Value Date"
//               size="small"
//             />
//           </Box>
//           <Box>
//             <CheckboxInput
//               name="nepaliDate"
//               control={control}
//               label="Nepali Date"
//               size="small"
//             />
//           </Box>
//           <Box>
//             <CheckboxInput
//               name="englishDate"
//               control={control}
//               label="English Date"
//               size="small"
//             />
//           </Box>
//         </Box>
//         <Divider sx={{ mb: 1 }} />

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-around",
//             alignItems: "center",
//             gap: 2,
//           }}
//         >
//           <LanguageSwitch
//             control={control}
//             name={"language" as Path<DepositStatementFormValues>}
//           />

//           <VisualReportSwitch
//             control={control}
//             name={"visualReport" as Path<DepositStatementFormValues>}
//           />
//         </Box>

//         <Divider sx={{ mb: 1 }} />

//         <Grid container spacing={1} alignItems="center">
//           <Grid size={{ xs: 12, md: 6 }}>
//             <Box
//               display="flex"
//               justifyContent="center"
//               alignItems="center"
//               gap={5}
//               width="100%"
//             >
//               <ViewReportButton<DepositStatementFormValues>
//                 control={control}
//                 handleSubmit={handleSubmit}
//                 onSubmit={onSubmit}
//                 setValue={setValue}
//                 loading={false}
//               />
//               <ClearFormButton
//                 setValue={setValue}
//                 clearFields={["memberId", "memberName"]}
//               />
//             </Box>
//           </Grid>
//         </Grid>
//       </Paper>
//     </Box>
//   );
// }

"use client";

import React, { useMemo } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
  Path,
} from "react-hook-form";
import { Grid, Box, Paper, Typography, Divider } from "@mui/material";
import CheckboxInput from "@/components/form/CheckboxInput";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import DateFieldsTwoWay from "@/components/reportForm/Common/DateFieldsTwoWay";
import { createAccountLookupConfig } from "@/config/AccountLookupConfig";
import { VisualReportSwitch } from "@/components/reportForm/Common/VisualReportSwitch";
import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
import { LanguageSwitch } from "./LanguageSwitch";

export interface DepositStatementFormValues {
  accountNo?: string;
  memberId?: string;
  memberName?: string;
  fromDate?: string;
  toDate?: string;
  fromDateAd?: string;
  toDateAd?: string;
  sameCompanyName?: boolean;
  valueDate?: boolean;
  nepaliDate?: boolean;
  generateInterest?: boolean;
  billNumber?: boolean;
  language?: "English" | "Nepali";
  statementVerifiedTill?: string;
  passbookVerifiedTill?: string;
}

interface DepositStatementFormProps {
  control: Control<DepositStatementFormValues>;
  handleSubmit: UseFormHandleSubmit<DepositStatementFormValues>;
  onSubmit: SubmitHandler<DepositStatementFormValues>;
  setValue: UseFormSetValue<DepositStatementFormValues>;
}

export default function DepositStatementForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
}: DepositStatementFormProps) {
  const accountConfig = useMemo(
    () => createAccountLookupConfig<DepositStatementFormValues>(),
    [],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Paper variant="outlined" sx={{ px: 2, py: 1 }}>
        <Typography
          variant="h6"
          sx={{ color: "primary.main", fontWeight: 600, fontSize: 16 }}
        >
          Deposit Statement Report
        </Typography>
        <Divider sx={{ mb: 1 }} />

        <Box sx={{ mb: 1 }}>
          <EntityLookupField
            control={control}
            setValue={setValue}
            config={accountConfig}
          />
        </Box>

        <Divider sx={{ mb: 1 }} />

        {/* ── BS/AD two-way synced date fields (From + To) ──────────────────
            fromDate/toDate hold the BS value, fromDateAd/toDateAd hold the
            AD value. DateFieldsTwoWay keeps whichever side changes pushed
            into the other, for both From and To independently. ─────────── */}
        <Box sx={{ mb: 1 }}>
          <DateFieldsTwoWay<DepositStatementFormValues>
            control={control}
            setValue={setValue}
            fromDateName={"fromDate" as Path<DepositStatementFormValues>}
            toDateName={"toDate" as Path<DepositStatementFormValues>}
            fromDateADName={"fromDateAd" as Path<DepositStatementFormValues>}
            toDateADName={"toDateAd" as Path<DepositStatementFormValues>}
            fromDateLabel="From Date"
            toDateLabel="To Date"
            fromDateADLabel="From Date (AD)"
            toDateADLabel="To Date (AD)"
          />
        </Box>

        <Divider sx={{ mb: 1 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            gap: 1,
          }}
        >
          <Box>
            <CheckboxInput
              name="viewInterest"
              control={control}
              label="View Interest"
              size="small"
            />
          </Box>
          <Box>
            <CheckboxInput
              name="entryBy"
              control={control}
              label="Entry By"
              size="small"
            />
          </Box>
          <Box>
            <CheckboxInput
              name="generateInterest"
              control={control}
              label="Generate Interest"
              size="small"
            />
          </Box>
          <Box>
            <CheckboxInput
              name="billNumber"
              control={control}
              label="Bill Number"
              size="small"
            />
          </Box>
        </Box>
        <Divider sx={{ mb: 1 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            gap: 1,
          }}
        >
          <Box>
            <CheckboxInput
              name="sameCompanyName"
              control={control}
              label="Same Company Name"
              size="small"
            />
          </Box>
          <Box>
            <CheckboxInput
              name="valueDate"
              control={control}
              label="Value Date"
              size="small"
            />
          </Box>
          <Box>
            <CheckboxInput
              name="nepaliDate"
              control={control}
              label="Nepali Date"
              size="small"
            />
          </Box>
          <Box>
            <CheckboxInput
              name="englishDate"
              control={control}
              label="English Date"
              size="small"
            />
          </Box>
        </Box>
        <Divider sx={{ mb: 1 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            gap: 2,
          }}
        >
          <LanguageSwitch
            control={control}
            name={"language" as Path<DepositStatementFormValues>}
          />

          <VisualReportSwitch
            control={control}
            name={"visualReport" as Path<DepositStatementFormValues>}
          />
        </Box>

        <Divider sx={{ mb: 1 }} />

        <Grid container spacing={1} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={5}
              width="100%"
            >
              <ViewReportButton<DepositStatementFormValues>
                control={control}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                setValue={setValue}
                loading={false}
              />
              <ClearFormButton
                setValue={setValue}
                clearFields={["memberId", "memberName"]}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
