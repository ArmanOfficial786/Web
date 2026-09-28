// "use client";

// import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
// import { useEffect, useRef } from "react";
// import type {
//   Control,
//   SubmitHandler,
//   UseFormHandleSubmit,
//   UseFormReset,
//   UseFormSetValue,
// } from "react-hook-form";

// import Preloader from "@/components/PreLoader/preloader";
// import BranchNameField from "@/components/reportForm/Common/BranchNameField";
// import ClearFormButton from "@/components/reportForm/Common/ClearFormButton";
// import DateFields from "@/components/reportForm/Common/DateFiels";
// import ReportNavigation, {
//   type ReportFormat,
// } from "@/components/reportForm/Common/ReportNavigation";
// import ViewReportButton from "@/components/reportForm/Common/ViewReportButton";
// import { CollectorWiseProjectionFormValues, CollectorWiseProjectionResponseExtended } from "@/app/(home)/(sidebar)/MicroFinance/OtherReports/CollectorWiseProjectionReport/page";

// export type { ReportFormat };

// interface CollectorWiseProjectionFormProps {
//   control: Control<CollectorWiseProjectionFormValues>;
//   handleSubmit: UseFormHandleSubmit<CollectorWiseProjectionFormValues>;
//   onSubmit: SubmitHandler<CollectorWiseProjectionFormValues>;
//   setValue: UseFormSetValue<CollectorWiseProjectionFormValues>;
//   reset: UseFormReset<CollectorWiseProjectionFormValues>;
//   reportState: CollectorWiseProjectionResponseExtended;
//   onPageChange: (page: number) => void;
//   onDownload: (format: ReportFormat) => void | Promise<void>;
// }

// export default function CollectorWiseProjectionForm({
//   control,
//   handleSubmit,
//   onSubmit,
//   setValue,
//   reportState,
//   onPageChange,
//   onDownload,
// }: CollectorWiseProjectionFormProps) {
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
//             backdropFilter: "blur(2px)",
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
//             Collector Wise Projection Report
//           </Typography>
//           <Divider sx={{ mb: 0.5 }} />

//           {/* ── Till Date (BS) ───────────────────────────────────────────── */}
//           <Box sx={{ mb: 0.5 }}>
//             <DateFields<CollectorWiseProjectionFormValues>
//               control={control}
//               showFromDate={false}
//               toDateName="tillDateBs"
//               toDateLabel="Till Date"
//               mode="BS"
//             />
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           {/* ── Branch Name ──────────────────────────────────────────────── */}
//           <Box sx={{ mb: 0.5 }}>
//             <BranchNameField<CollectorWiseProjectionFormValues>
//               control={control}
//               setValue={setValue}
//               branchFieldName="branchId"
//             />
//           </Box>
//           <Divider sx={{ mb: 0.5 }} />

//           {/* ── View Report | Clear ─────────────────────────────────────── */}
//           <Grid container spacing={1} alignItems="center">
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   gap: 5,
//                   width: "100%",
//                 }}
//               >
//                 <ViewReportButton<CollectorWiseProjectionFormValues>
//                   control={control}
//                   handleSubmit={handleSubmit}
//                   onSubmit={onSubmit}
//                   setValue={setValue}
//                   loading={isLoading}
//                 />
//                 <ClearFormButton
//                   setValue={setValue}
//                   clearFields={["tillDateBs", "branchId"]}
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
//             <embed
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
//           </Box>
//         )}
//       </Box>
//     </>
//   );
// }
