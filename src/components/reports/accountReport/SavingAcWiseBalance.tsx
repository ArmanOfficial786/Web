// "use client";
// import React from "react";
// import { Box, Paper, Typography, Divider, Grid } from "@mui/material";
// import DateFields from "@/components/reportForm/Common/DateFiels";
// import BranchNameField from "@/components/reportForm/Common/BranchNameField";
// import ReportTypeField from "@/components/reportForm/Account/ReportType";
// import TransactionTypeField from "@/components/reportForm/Account/TransactionType";
// import OrderByField from "@/components/reportForm/Common/OrderByFields";
// import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
// import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";

// export default function SavingAcWiseBalance() {
//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//       {/* ── FORM ─────────────────────────────────────────────────────────── */}
//       <Paper variant="outlined" sx={{ p: 1.5 }}>
//         <Typography
//           variant="h6"
//           sx={{ color: "primary.main", fontWeight: 600, fontSize: 16, mb: 1 }}
//         >
//           Saving Account Wise Balance Report
//         </Typography>
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
//           <BranchNameField<AccountStatementRequest>
//             control={control}
//             branchFieldName="branchId"
//           />
//           <ReportTypeField<AccountStatementRequest>
//             control={control}
//             name="reportType"
//           />
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
//           <TransactionTypeField<AccountStatementRequest>
//             control={control}
//             name="transactionType"
//           />
//           <OrderByField<AccountStatementRequest>
//             control={control}
//             name="orderBy"
//             reportKey="savingTypeWiseBalance"
//           />
//         </Box>
//         <Divider sx={{ mb: 1.5 }} />

//         <Grid container spacing={1} alignItems="center">
//           <Grid size={{ xs: 12, md: 6 }}>
//             <Box
//               display="flex"
//               justifyContent="center"
//               alignItems="center"
//               gap={5}
//               width="100%"
//             >
//               <ViewReportButton<AccountStatementRequest>
//                 control={control}
//                 handleSubmit={handleSubmit}
//                 onSubmit={onSubmit}
//                 setValue={setValue}
//                 loading={loading}
//                 onBeforeSubmit={scrollToReport}
//                 clearFields={[
//                   "fromDate",
//                   "toDate",
//                   "branchId",
//                   "reportType",
//                   "transactionType",
//                   "orderBy",
//                 ]}
//               />

//               <ClearFormButton
//                 reset={reset}
//                 setValue={setValue}
//                 clearFields={[
//                   "fromDate",
//                   "toDate",
//                   "branchId",
//                   "reportType",
//                   "transactionType",
//                   "orderBy",
//                 ]}
//               />
//             </Box>
//           </Grid>
//         </Grid>
//       </Paper>
//     </Box>
//   );
// }
