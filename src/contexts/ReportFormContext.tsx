// // "use client";

// // import React, { createContext, useContext, useState, useCallback } from "react";
// // import type { MemberLookUpDtos } from "../../types/api/api";
// // import { apiClient } from "../services/apiClient";

// // export interface MemberRecord extends MemberLookUpDtos {}

// // interface MemberLookupContextType {
// //   memberLookUp: MemberRecord[];
// //   totalCount: number;
// //   currentPage: number;
// //   pageSize: number;
// //   totalPages: number;
// //   isLoading: boolean;
// //   error: string | null;
// //   selectedMember: MemberRecord | null;
// //   setSelectedMember: (member: MemberRecord | null) => void;
// //   searchmemberLookUp: (params: {
// //     Page?: number;
// //     MemberId?: string;
// //     MemberName?: string;
// //     GroupName?: string;
// //     CenterName?: string;
// //     Gender?: string;
// //     MobileNo?: string;
// //     OfficeName?: string;
// //     SortColumn?: string;
// //     SortDirection?: string;
// //   }) => Promise<void>;
// //   clearResults: () => void;
// // }

// // const MemberLookupContext = createContext<MemberLookupContextType | undefined>(
// //   undefined,
// // );

// // export function ReportFormProvider({
// //   children,
// // }: {
// //   children: React.ReactNode;
// // }) {
// //   const [memberLookUp, setmemberLookUp] = useState<MemberRecord[]>([]);
// //   const [totalCount, setTotalCount] = useState(0);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [pageSize, setPageSize] = useState(10);
// //   const [totalPages, setTotalPages] = useState(0);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [selectedMember, setSelectedMember] = useState<MemberRecord | null>(
// //     null,
// //   );

// //   const searchmemberLookUp = useCallback(async (params: any) => {
// //     setIsLoading(true);
// //     setError(null);
// //     try {
// //       const response = await apiClient.api.memberLookUpSearchList(params);
// //       const result = response.data;
// //       if (result?.items) {
// //         setmemberLookUp(result.items as MemberRecord[]);
// //         setTotalCount(result.totalCount || 0);
// //         setCurrentPage(result.currentPage || 1);
// //         setPageSize(result.pageSize || 10);
// //         setTotalPages(result.totalPages || 0);
// //       } else {
// //         setmemberLookUp([]);
// //         setTotalCount(0);
// //         setTotalPages(0);
// //       }
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : "Failed to search memberLookUp");
// //       console.error(err);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   }, []);

// //   const clearResults = useCallback(() => {
// //     setmemberLookUp([]);
// //     setTotalCount(0);
// //     setCurrentPage(1);
// //     setTotalPages(0);
// //     setError(null);
// //   }, []);

// //   const value = {
// //     memberLookUp,
// //     totalCount,
// //     currentPage,
// //     pageSize,
// //     totalPages,
// //     isLoading,
// //     error,
// //     selectedMember,
// //     setSelectedMember,
// //     searchmemberLookUp,
// //     clearResults,
// //   };

// //   return (
// //     <MemberLookupContext.Provider value={value}>
// //       {children}
// //     </MemberLookupContext.Provider>
// //   );
// // }

// // export function useReportForm() {
// //   const context = useContext(MemberLookupContext);
// //   if (!context)
// //     throw new Error("useReportForm must be used within a ReportFormProvider");
// //   return context;
// // }

// "use client";

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";
// import { branchService } from "@/services/BranchService";
// import { orderByService } from "@/services/OrderByService";
// import { memberLookUpService } from "@/services/MemberLookUpService";

// // ── Types ─────────────────────────────────────────────────────────────────────
// export type SelectOption = { id: number; name: string };

// export interface MemberRecord {
//   memMemberRegistrationId: number;
//   memberId: string;
//   memberName: string;
//   centerName: string;
//   centerCode: string;
//   groupName: string;
//   groupCode: string;
//   officeName: string;
//   gender: string;
//   temporaryAddress: string;
//   mobileNo: string;
// }

// export interface memberLookUpearchParams {
//   Page?: number;
//   MemberId?: string;
//   MemberName?: string;
//   GroupName?: string;
//   CenterName?: string;
//   Gender?: string;
//   MobileNo?: string;
//   OfficeName?: string;
// }

// // ── Context type ──────────────────────────────────────────────────────────────
// interface ReportFormContextType {
//   // Member lookup
//   memberLookUp: MemberRecord[];
//   totalPages: number;
//   currentPage: number;
//   isLoading: boolean;
//   error: string;
//   selectedMember: MemberRecord | null;
//   searchmemberLookUp: (params: memberLookUpearchParams) => void;
//   clearResults: () => void;
//   setSelectedMember: (member: MemberRecord | null) => void;

//   // Dropdown options (loaded once at mount)
//   branchOptions: SelectOption[];
//   orderByOptions: SelectOption[];
// }

// const DEFAULT_SELECT: SelectOption[] = [{ id: 0, name: "-- Select --" }];

// const ReportFormContext = createContext<ReportFormContextType | undefined>(
//   undefined,
// );

// export const useReportForm = () => {
//   const ctx = useContext(ReportFormContext);
//   if (!ctx)
//     throw new Error("useReportForm must be used within ReportFormProvider");
//   return ctx;
// };

// // ── Provider ──────────────────────────────────────────────────────────────────
// export const ReportFormProvider = ({ children }: { children: ReactNode }) => {
//   // Member lookup state
//   const [memberLookUp, setmemberLookUp] = useState<MemberRecord[]>([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [selectedMember, setSelectedMember] = useState<MemberRecord | null>(
//     null,
//   );

//   // Dropdown options state
//   const [branchOptions, setBranchOptions] =
//     useState<SelectOption[]>(DEFAULT_SELECT);
//   const [orderByOptions, setOrderByOptions] =
//     useState<SelectOption[]>(DEFAULT_SELECT);

//   // ── Load branch options once ────────────────────────────────────────────────
//   useEffect(() => {
//     branchService
//       .getAll()
//       .then((res) => {
//         const mapped = (res?.data ?? []).map(
//           (b): SelectOption => ({
//             id: b.branchId ?? 0,
//             name: b.branchName ?? "",
//           }),
//         );
//         setBranchOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
//       })
//       .catch(() => {});
//   }, []);

//   // ── Load orderBy options once ───────────────────────────────────────────────
//   useEffect(() => {
//     orderByService
//       .getAll()
//       .then((res) => {
//         const list = res?.data?.memberIdCard ?? [];
//         const mapped = list.map(
//           (o): SelectOption => ({
//             id: o.value ?? 0,
//             name: o.displayName ?? "",
//           }),
//         );
//         setOrderByOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
//       })
//       .catch(() => {});
//   }, []);

//   // ── MemberLookup search ───────────────────────────────────────────────────────────
//   const searchmemberLookUp = async (params: memberLookUpearchParams) => {
//     setIsLoading(true);
//     setError("");
//     try {
//       const data = await memberLookUpService.getAllWithFilters(params);
//       const mappedItems = (data?.items ?? []).map((item) => ({
//         memMemberRegistrationId: item.memMemberRegistrationId ?? 0,
//         memberId: item.memberId ?? "",
//         memberName: item.memberName ?? "",
//         centerName: item.centerName ?? "",
//         centerCode: item.centerCode ?? "",
//         groupName: item.groupName ?? "",
//         groupCode: item.groupCode ?? "",
//         officeName: item.officeName ?? "",
//         gender: item.gender ?? "",
//         temporaryAddress: item.temporaryAddress ?? "",
//         mobileNo: item.mobileNo ?? "",
//       }));
//       setmemberLookUp(mappedItems);
//       setTotalPages(data?.totalPages ?? 1);
//       setCurrentPage(data?.currentPage ?? 1);
//     } catch (err: any) {
//       // 👉 error comes from interceptor
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }

//     const clearResults = () => {
//       setmemberLookUp([]);
//       setTotalPages(1);
//       setCurrentPage(1);
//       setError("");
//     };

//     return (
//       <ReportFormContext.Provider
//         value={{
//           memberLookUp,
//           totalPages,
//           currentPage,
//           isLoading,
//           error,
//           selectedMember,
//           setSelectedMember,
//           searchmemberLookUp,
//           clearResults,
//           branchOptions,
//           orderByOptions,
//         }}
//       >
//         {children}
//       </ReportFormContext.Provider>
//     );
//   };
// };

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { branchService } from "@/services/BranchService";
import { orderByService } from "@/services/OrderByService";
import { memberLookUpService } from "@/services/MemberLookUpService";

// ── Types ─────────────────────────────────────────────────────────────────────
export type SelectOption = { id: number; name: string };

export interface MemberRecord {
  memMemberRegistrationId: number;
  memberId: string;
  memberName: string;
  centerName: string;
  centerCode: string;
  groupName: string;
  groupCode: string;
  officeName: string;
  gender: string;
  temporaryAddress: string;
  mobileNo: string;
}

export interface MemberLookUpSearchParams {
  Page?: number;
  MemberId?: string;
  MemberName?: string;
  GroupName?: string;
  CenterName?: string;
  Gender?: string;
  MobileNo?: string;
  OfficeName?: string;
}

// ── Context type ──────────────────────────────────────────────────────────────
interface ReportFormContextType {
  memberLookUp: MemberRecord[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string;
  selectedMember: MemberRecord | null;
  searchmemberLookUp: (params: MemberLookUpSearchParams) => Promise<void>;
  clearResults: () => void;
  setSelectedMember: (member: MemberRecord | null) => void;
  branchOptions: SelectOption[];
  orderByOptions: SelectOption[];
}

const DEFAULT_SELECT: SelectOption[] = [{ id: 0, name: "-- Select --" }];

const ReportFormContext = createContext<ReportFormContextType | undefined>(
  undefined,
);

export const useReportForm = () => {
  const ctx = useContext(ReportFormContext);
  if (!ctx)
    throw new Error("useReportForm must be used within ReportFormProvider");
  return ctx;
};

// ── Provider ──────────────────────────────────────────────────────────────────
export const ReportFormProvider = ({ children }: { children: ReactNode }) => {
  const [memberLookUp, setMemberLookUp] = useState<MemberRecord[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMember, setSelectedMember] = useState<MemberRecord | null>(
    null,
  );
  const [branchOptions, setBranchOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);
  const [orderByOptions, setOrderByOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);

  // ── Branch options ────────────────────────────────────────────────────────
  useEffect(() => {
    branchService
      .getAll()
      .then((res) => {
        const mapped = (res?.data ?? []).map(
          (b): SelectOption => ({
            id: b.branchId ?? 0,
            name: b.branchName ?? "",
          }),
        );
        setBranchOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
      })
      .catch(() => {});
  }, []);

  // ── OrderBy options ───────────────────────────────────────────────────────
  useEffect(() => {
    orderByService
      .getAll()
      .then((res) => {
        const list = res?.data?.memberIdCard ?? [];
        const mapped = list.map(
          (o): SelectOption => ({
            id: o.value ?? 0,
            name: o.displayName ?? "",
          }),
        );
        setOrderByOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
      })
      .catch(() => {});
  }, []);

  // ── Member lookup search ──────────────────────────────────────────────────
  const searchmemberLookUp = useCallback(
    async (params: MemberLookUpSearchParams) => {
      setIsLoading(true);
      setError("");
      try {
        const data = await memberLookUpService.getAllWithFilters(params);
        const mappedItems = (data?.items ?? []).map(
          (item): MemberRecord => ({
            memMemberRegistrationId: item.memMemberRegistrationId ?? 0,
            memberId: item.memberId ?? "",
            memberName: item.memberName ?? "",
            centerName: item.centerName ?? "",
            centerCode: item.centerCode ?? "",
            groupName: item.groupName ?? "",
            groupCode: item.groupCode ?? "",
            officeName: item.officeName ?? "",
            gender: item.gender ?? "",
            temporaryAddress: item.temporaryAddress ?? "",
            mobileNo: item.mobileNo ?? "",
          }),
        );
        setMemberLookUp(mappedItems);
        setTotalPages(data?.totalPages ?? 1);
        setCurrentPage(data?.currentPage ?? 1);
      } catch (err: any) {
        setError(err?.message ?? "Failed to load members");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // ── Clear results ─────────────────────────────────────────────────────────
  const clearResults = useCallback(() => {
    setMemberLookUp([]);
    setTotalPages(1);
    setCurrentPage(1);
    setError("");
  }, []);

  return (
    <ReportFormContext.Provider
      value={{
        memberLookUp,
        totalPages,
        currentPage,
        isLoading,
        error,
        selectedMember,
        setSelectedMember,
        searchmemberLookUp,
        clearResults,
        branchOptions,
        orderByOptions,
      }}
    >
      {children}
    </ReportFormContext.Provider>
  );
};
