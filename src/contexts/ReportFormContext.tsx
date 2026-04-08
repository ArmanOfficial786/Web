// "use client";

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
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

// export interface MemberLookUpSearchParams {
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
//   memberLookUp: MemberRecord[];
//   totalPages: number;
//   currentPage: number;
//   isLoading: boolean;
//   error: string;
//   selectedMember: MemberRecord | null;
//   searchmemberLookUp: (params: MemberLookUpSearchParams) => Promise<void>;
//   clearResults: () => void;
//   setSelectedMember: (member: MemberRecord | null) => void;
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
//   const [memberLookUp, setMemberLookUp] = useState<MemberRecord[]>([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [selectedMember, setSelectedMember] = useState<MemberRecord | null>(
//     null,
//   );
//   const [branchOptions, setBranchOptions] =
//     useState<SelectOption[]>(DEFAULT_SELECT);
//   const [orderByOptions, setOrderByOptions] =
//     useState<SelectOption[]>(DEFAULT_SELECT);

//   // ── Branch options ────────────────────────────────────────────────────────
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

//   // ── OrderBy options ───────────────────────────────────────────────────────
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

//   // ── Member lookup search ──────────────────────────────────────────────────
//   const searchmemberLookUp = useCallback(
//     async (params: MemberLookUpSearchParams) => {
//       setIsLoading(true);
//       setError("");
//       try {
//         const data = await memberLookUpService.getAllWithFilters(params);
//         const mappedItems = (data?.items ?? []).map(
//           (item): MemberRecord => ({
//             memMemberRegistrationId: item.memMemberRegistrationId ?? 0,
//             memberId: item.memberId ?? "",
//             memberName: item.memberName ?? "",
//             centerName: item.centerName ?? "",
//             centerCode: item.centerCode ?? "",
//             groupName: item.groupName ?? "",
//             groupCode: item.groupCode ?? "",
//             officeName: item.officeName ?? "",
//             gender: item.gender ?? "",
//             temporaryAddress: item.temporaryAddress ?? "",
//             mobileNo: item.mobileNo ?? "",
//           }),
//         );
//         setMemberLookUp(mappedItems);
//         setTotalPages(data?.totalPages ?? 1);
//         setCurrentPage(data?.currentPage ?? 1);
//       } catch (err: any) {
//         setError(err?.message ?? "Failed to load members");
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [],
//   );

//   // ── Clear results ─────────────────────────────────────────────────────────
//   const clearResults = useCallback(() => {
//     setMemberLookUp([]);
//     setTotalPages(1);
//     setCurrentPage(1);
//     setError("");
//   }, []);

//   return (
//     <ReportFormContext.Provider
//       value={{
//         memberLookUp,
//         totalPages,
//         currentPage,
//         isLoading,
//         error,
//         selectedMember,
//         setSelectedMember,
//         searchmemberLookUp,
//         clearResults,
//         branchOptions,
//         orderByOptions,
//       }}
//     >
//       {children}
//     </ReportFormContext.Provider>
//   );
// };

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
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

  // ✅ Holds the AbortController for whatever fetch is currently in flight.
  //    A new ref (not state) so mutating it never triggers a re-render.
  const abortControllerRef = useRef<AbortController | null>(null);

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
      // ✅ Cancel any previous in-flight request before starting a new one.
      //    This prevents an old slow response from overwriting a newer one.
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setError("");

      try {
        const data = await memberLookUpService.getAllWithFilters(
          params,
          controller.signal, // ✅ pass signal to your service (see note below)
        );

        // ✅ Guard: if this request was aborted while awaiting, bail out silently.
        //    Without this check the aborted request's finally block would still
        //    flip isLoading to false and potentially corrupt state.
        if (controller.signal.aborted) return;

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
        // ✅ DOMException with name "AbortError" is expected when we cancel —
        //    swallow it silently; only surface real errors.
        if (err?.name === "AbortError") return;
        setError(err?.message ?? "Failed to load members");
      } finally {
        // ✅ Only clear loading flag for the request that is still "current".
        //    If the controller was already replaced by a newer call, leave
        //    isLoading alone — the newer call owns that flag now.
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  // ── Clear results ─────────────────────────────────────────────────────────
  const clearResults = useCallback(() => {
    // ✅ Abort any in-flight request immediately so its response can never
    //    land after we've cleared state (the original race condition).
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setMemberLookUp([]);
    setTotalPages(1);
    setCurrentPage(1);
    setError("");
    setIsLoading(false); // ✅ was missing — left isLoading=true after close
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
