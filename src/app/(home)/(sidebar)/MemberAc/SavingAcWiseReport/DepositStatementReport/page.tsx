// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { toast } from "react-toastify";
// import * as yup from "yup";
// import type {
//   AccountLookUpDtos,
//   DepositStatementRequestDto,
//   Pagination,
// } from "types/api/api";
// import DepositStatementForm, {
//   type DepositStatementFormValues,
//   type ReportFormat,
// } from "@/components/reports/memberAccount/DepositStatementForm";
// import { responseToBlob } from "@/utilis/Constants/blobConverter";
// import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
// import { DefaultPagination } from "@/utilis/Constants/reportConstants";
// import memberAccountService from "@/services/memberAccount/memberAccountService";

// // ── Client-only response state (PDF blob + pagination) ──────────────────────
// export interface DepositStatementResponseExtended {
//   pdfData?: string;
//   isLoading: boolean;
//   pagination?: Pagination;
// }

// // ── Validation schema — matches DepositStatementFormValues field-for-field ──
// const schema: yup.ObjectSchema<DepositStatementFormValues> = yup
//   .object({
//     // UI-only fields (not in the DTO)
//     memberId: yup.string().optional().default(""),
//     memberName: yup.string().optional().default(""),
//     fromDateAd: yup.string().optional().default(""),
//     toDateAd: yup.string().optional().default(""),
//     statementVerifiedTill: yup.string().optional().default(""),
//     passbookVerifiedTill: yup.string().optional().default(""),

//     // Renamed/narrowed DTO fields
//     accountNo: yup.string().optional().default(""),
//     fromDate: yup.string().optional().default(""), // -> fromDateBs
//     toDate: yup.string().optional().default(""), // -> toDateBs
//     generateInterest: yup.boolean().optional().default(false), // -> enableInterest
//     billNumber: yup.boolean().optional().default(false), // -> enableBillNumber
//     language: yup.mixed<"English" | "Nepali">().optional().default("English"),

//     // Untouched DTO fields
//     entryBy: yup.boolean().optional().default(false),
//     valueDate: yup.boolean().optional().default(false),
//     sameCompanyName: yup.boolean().optional().default(false),
//     customNarration: yup.boolean().optional().default(false),
//     visualReport: yup.boolean().optional().default(false),
//     viewInterest: yup.boolean().optional().default(false),
//     nepaliDate: yup.boolean().optional().default(false),
//     englishDate: yup.boolean().optional().default(false),
//   })
//   .required();

// // ── Map UI form shape -> real DTO shape ─────────────────────────────────────
// const toRequest = (
//   v: DepositStatementFormValues,
// ): DepositStatementRequestDto => ({
//   accountNo: v.accountNo || "",
//   fromDateBs: v.fromDate || "",
//   toDateBs: v.toDate || "",
//   enableInterest: v.generateInterest ?? false,
//   enableBillNumber: v.billNumber ?? false,
//   entryBy: v.entryBy ?? false,
//   valueDate: v.valueDate ?? false,
//   sameCompanyName: v.sameCompanyName ?? false,
//   language: v.language || "English",
//   customNarration: v.customNarration ?? false,
//   visualReport: v.visualReport ?? false,
//   viewInterest: v.viewInterest ?? false,
//   nepaliDate: v.nepaliDate ?? false,
//   englishDate: v.englishDate ?? false,
// });

// function DepositStatementPage(): React.ReactElement {
//   const [reportState, setReportState] =
//     useState<DepositStatementResponseExtended>({ isLoading: false });
//   const [lastRequest, setLastRequest] =
//     useState<DepositStatementRequestDto | null>(null);

//   const { control, handleSubmit, setValue } =
//     useForm<DepositStatementFormValues>({
//       resolver: yupResolver(schema),
//       defaultValues: schema.getDefault(),
//     });

//   // ── Account selection from the lookup modal ──────────────────────────────
//   // AccountLookUpDtos carries memberId/memberName as plain string fields —
//   // no memMemberRegistrationId on this DTO (that only exists on
//   // MemberLookUpDtos, used by the member-lookup flow, not account-lookup).
//   const handleAccountSelect = useCallback(
//     (record: AccountLookUpDtos) => {
//       setValue("accountNo", record.accountNo ?? "", { shouldValidate: true });
//       setValue("memberId", record.memberId ?? "");
//       setValue("memberName", record.memberName ?? "");
//     },
//     [setValue],
//   );

//   const callApi = useCallback(
//     (request: DepositStatementRequestDto, format: string) =>
//       memberAccountService.api.depositStatementCreate(request, { format }),
//     [],
//   );

//   const fetchReport = useCallback(
//     async (request: DepositStatementRequestDto): Promise<void> => {
//       setReportState((prev) => {
//         if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
//         return { isLoading: true };
//       });
//       try {
//         const res = await callApi(request, "VIEW");

//         const raw =
//           (res.headers as Record<string, string>)["x-pagination"] ?? "";
//         const pagination: Pagination = (() => {
//           try {
//             return raw ? (JSON.parse(raw) as Pagination) : DefaultPagination;
//           } catch {
//             return DefaultPagination;
//           }
//         })();

//         const blob = responseToBlob(res.data, "PDF");
//         const pdfData = URL.createObjectURL(blob);

//         setLastRequest(request);
//         setReportState({ isLoading: false, pdfData, pagination });
//       } catch {
//         setReportState((prev) => ({ ...prev, isLoading: false }));
//         toast.error("Failed to generate report.");
//       }
//     },
//     [callApi],
//   );

//   const handleDownload = useCallback(
//     async (format: ReportFormat): Promise<void> => {
//       if (!lastRequest) {
//         toast.warning("Please view the report before exporting.");
//         return;
//       }
//       try {
//         const res = await callApi(lastRequest, format);
//         const blob = responseToBlob(res.data, format);
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = extractFilenameFromResponse(
//           res,
//           format,
//           "DepositStatement",
//         );
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//       } catch {
//         toast.error("Failed to download file.");
//       }
//     },
//     [callApi, lastRequest],
//   );

//   const handlePageChange = useCallback((newPage: number) => {
//     setReportState((prev) => {
//       const total = prev.pagination?.totalPages ?? 1;
//       const clamped = Math.max(1, Math.min(newPage, total));
//       return {
//         ...prev,
//         pagination: { ...prev.pagination, currentPage: clamped },
//       };
//     });
//   }, []);

//   const onSubmit: SubmitHandler<DepositStatementFormValues> = useCallback(
//     (formData) => fetchReport(toRequest(formData)),
//     [fetchReport],
//   );

//   useEffect(() => {
//     return () => {
//       setReportState((prev) => {
//         if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
//         return prev;
//       });
//     };
//   }, []);

//   return (
//     <DepositStatementForm
//       control={control}
//       handleSubmit={handleSubmit}
//       onSubmit={onSubmit}
//       setValue={setValue}
//       reportState={reportState}
//       onPageChange={handlePageChange}
//       onDownload={handleDownload}
//       onAccountSelect={handleAccountSelect}
//     />
//   );
// }

// export default DepositStatementPage;

// app/(home)/(sidebar)/MemberAc/SavingAcWiseReport/DepositStatementReport/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import type {
  AccountLookUpDtos,
  DepositStatementRequestDto,
  Pagination,
  VerificationStatusDto,
} from "types/api/api";
import DepositStatementForm, {
  type DepositStatementFormValues,
  type ReportFormat,
} from "@/components/reports/memberAccount/DepositStatementForm";
import { responseToBlob } from "@/utilis/Constants/blobConverter";
import { extractFilenameFromResponse } from "@/utilis/Constants/extractFilenameFromResponse";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import memberAccountService from "@/services/memberAccount/memberAccountService";
import depositStatementVerifyService from "@/services/Common/DepositStatementVerificationService";

// ── Client-only response state (PDF blob + pagination) ──────────────────────
export interface DepositStatementResponseExtended {
  pdfData?: string;
  isLoading: boolean;
  pagination?: Pagination;
}

// ── Validation schema — matches DepositStatementFormValues field-for-field ──
const schema: yup.ObjectSchema<DepositStatementFormValues> = yup
  .object({
    // UI-only fields (not in the DTO)
    memberId: yup.string().optional().default(""),
    memberName: yup.string().optional().default(""),
    fromDateAd: yup.string().optional().default(""),
    toDateAd: yup.string().optional().default(""),
    statementVerifiedTill: yup.string().optional().default(""),
    passbookVerifiedTill: yup.string().optional().default(""),

    // Renamed/narrowed DTO fields
    accountNo: yup.string().optional().default(""),
    fromDate: yup.string().optional().default(""), // -> fromDateBs
    toDate: yup.string().optional().default(""), // -> toDateBs
    generateInterest: yup.boolean().optional().default(false), // -> enableInterest
    billNumber: yup.boolean().optional().default(false), // -> enableBillNumber
    language: yup.mixed<"English" | "Nepali">().optional().default("English"),

    // Untouched DTO fields
    entryBy: yup.boolean().optional().default(false),
    valueDate: yup.boolean().optional().default(false),
    sameCompanyName: yup.boolean().optional().default(false),
    customNarration: yup.boolean().optional().default(false),
    visualReport: yup.boolean().optional().default(false),
    viewInterest: yup.boolean().optional().default(false),
    nepaliDate: yup.boolean().optional().default(false),
    englishDate: yup.boolean().optional().default(false),
  })
  .required();

// ── Map UI form shape -> real DTO shape ─────────────────────────────────────
const toRequest = (
  v: DepositStatementFormValues,
): DepositStatementRequestDto => ({
  accountNo: v.accountNo || "",
  fromDateBs: v.fromDate || "",
  toDateBs: v.toDate || "",
  enableInterest: v.generateInterest ?? false,
  enableBillNumber: v.billNumber ?? false,
  entryBy: v.entryBy ?? false,
  valueDate: v.valueDate ?? false,
  sameCompanyName: v.sameCompanyName ?? false,
  language: v.language || "English",
  customNarration: v.customNarration ?? false,
  visualReport: v.visualReport ?? false,
  viewInterest: v.viewInterest ?? false,
  nepaliDate: v.nepaliDate ?? false,
  englishDate: v.englishDate ?? false,
});

function DepositStatementPage(): React.ReactElement {
  const [reportState, setReportState] =
    useState<DepositStatementResponseExtended>({ isLoading: false });
  const [lastRequest, setLastRequest] =
    useState<DepositStatementRequestDto | null>(null);

  // ── Passbook verification state ──────────────────────────────────────────
  // mamAccountOpeningId comes from the account-lookup selection
  // (AccountLookUpDtos.mamAccountOpeningId) and is required by the Verify
  // endpoint's payload, even though it's not part of DepositStatementRequestDto.
  const [mamAccountOpeningId, setMamAccountOpeningId] = useState<number>(0);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatusDto | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyErrorMessage, setVerifyErrorMessage] = useState<
    string | undefined
  >();

  const { control, handleSubmit, setValue } =
    useForm<DepositStatementFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  // ── Account selection from the lookup modal ──────────────────────────────
  const handleAccountSelect = useCallback(
    (record: AccountLookUpDtos) => {
      setValue("accountNo", record.accountNo ?? "", { shouldValidate: true });
      setValue("memberId", record.memberId ?? "");
      setValue("memberName", record.memberName ?? "");

      // Reset verification state for the newly selected account — the
      // WebForm's txtAccountNo_TextChanged / AccountDirectoryAccountSearch
      // handlers also clear lblVerifiedDetails / ltrMessage on account change.
      setVerificationStatus(null);
      setVerifyErrorMessage(undefined);
      setMamAccountOpeningId(record.mamAccountOpeningId ?? 0);
    },
    [setValue],
  );

  const callApi = useCallback(
    (request: DepositStatementRequestDto, format: string) =>
      memberAccountService.api.depositStatementCreate(request, { format }),
    [],
  );

  const fetchReport = useCallback(
    async (request: DepositStatementRequestDto): Promise<void> => {
      setReportState((prev) => {
        if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
        return { isLoading: true };
      });
      try {
        const res = await callApi(request, "VIEW");

        const raw =
          (res.headers as Record<string, string>)["x-pagination"] ?? "";
        const pagination: Pagination = (() => {
          try {
            return raw ? (JSON.parse(raw) as Pagination) : DefaultPagination;
          } catch {
            return DefaultPagination;
          }
        })();

        const blob = responseToBlob(res.data, "PDF");
        const pdfData = URL.createObjectURL(blob);

        setLastRequest(request);
        setReportState({ isLoading: false, pdfData, pagination });

        // Intentionally NOT calling the verification Status API here.
        // Status/Verify calls only happen from the "Statement Verified
        // Update" button (handleVerifyStatement) — never automatically
        // on report generation.
        setVerifyErrorMessage(undefined);
        setVerificationStatus(null);
      } catch {
        setReportState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [callApi],
  );

  const handleDownload = useCallback(
    async (format: ReportFormat): Promise<void> => {
      if (!lastRequest) {
        toast.warning("Please view the report before exporting.");
        return;
      }
      try {
        const res = await callApi(lastRequest, format);
        const blob = responseToBlob(res.data, format);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = extractFilenameFromResponse(
          res,
          format,
          "DepositStatement",
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch {
        toast.error("Failed to download file.");
      }
    },
    [callApi, lastRequest],
  );

  const handlePageChange = useCallback((newPage: number) => {
    setReportState((prev) => {
      const total = prev.pagination?.totalPages ?? 1;
      const clamped = Math.max(1, Math.min(newPage, total));
      return {
        ...prev,
        pagination: { ...prev.pagination, currentPage: clamped },
      };
    });
  }, []);

  const onSubmit: SubmitHandler<DepositStatementFormValues> = useCallback(
    (formData) => fetchReport(toRequest(formData)),
    [fetchReport],
  );

  // ── Statement Verified Update — matches btnStatementVerify_Click ────────
  // This is the ONLY place the Verify API is called, triggered solely by the
  // "Statement Verified Update" button via StatementVerifyButton's own
  // handleSubmit() call.
  const handleVerifyStatement: SubmitHandler<DepositStatementFormValues> =
    useCallback(
      async (formData) => {
        // WebForm: mamAccountOpening == null || AccountNo != hfdAccountNo.Value
        if (!formData.accountNo || !mamAccountOpeningId) {
          setVerifyErrorMessage("Please Enter Correct Account No");
          return;
        }
        if (!formData.statementVerifiedTill) {
          toast.warning("Please select the Statement Verified Till date.");
          return;
        }

        setVerifying(true);
        setVerifyErrorMessage(undefined);
        try {
          // Interceptors already toast success/error from GeneralResponse.message.
          const status = await depositStatementVerifyService.verify({
            mamAccountOpeningId,
            accountNo: formData.accountNo,
            // WebForm: VerifiedFromDateOnBs = ncpFromDateOnBS.ShortNepaliDate,
            // read live at click time from the report's From Date field.
            verifiedFromDateOnBs: formData.fromDate || "",
            verifiedToDateOnBs: formData.statementVerifiedTill,
          });
          setVerificationStatus(status);
        } catch (err) {
          const message =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? "Failed to update statement verification.";
          setVerifyErrorMessage(message);
        } finally {
          setVerifying(false);
        }
      },
      [mamAccountOpeningId],
    );

  useEffect(() => {
    return () => {
      setReportState((prev) => {
        if (prev.pdfData) URL.revokeObjectURL(prev.pdfData);
        return prev;
      });
    };
  }, []);

  return (
    <DepositStatementForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      reportState={reportState}
      onPageChange={handlePageChange}
      onDownload={handleDownload}
      onAccountSelect={handleAccountSelect}
      verificationStatus={verificationStatus}
      verifying={verifying}
      verifyErrorMessage={verifyErrorMessage}
      onVerifyStatement={handleVerifyStatement}
    />
  );
}

export default DepositStatementPage;
