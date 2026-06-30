// // "use client";

// // import React, {
// //   createContext,
// //   useContext,
// //   useState,
// //   useCallback,
// //   useRef,
// //   useMemo,
// //   ReactNode,
// // } from "react";
// // import branchService from "@/services/Common/BranchService";
// // import orderByService from "@/services/Common/OrderByService";
// // import { memberLookUpService } from "@/services/Common/MemberLookUpService";
// // import { collectionCenterService } from "@/services/Common/CollectionCenterService";
// // import {
// //   BranchResponse,
// //   CollectorResponse,
// //   DepositTypeResponse,
// //   OrderByResponse,
// // } from "types/api/api";
// // import { memberGroupService } from "@/services/Common/MemberGroupService";
// // import depositeTypeService from "@/services/Common/DepositeType";
// // import collectorService from "@/services/Common/CollectorService";

// // export type SelectOption = { id: number | string; name: string };
// // export type OrderByReportKey = "memberIdCard" | "savingTypeWiseBalance";

// // export interface MemberRecord {
// //   memMemberRegistrationId: number;
// //   memberId: string;
// //   memberName: string;
// //   centerName: string;
// //   centerCode: string;
// //   groupName: string;
// //   groupCode: string;
// //   officeName: string;
// //   gender: string;
// //   temporaryAddress: string;
// //   mobileNo: string;
// // }

// // export interface MemberLookUpSearchParams {
// //   Page?: number;
// //   MemberId?: string;
// //   MemberName?: string;
// //   GroupName?: string;
// //   CenterName?: string;
// //   Gender?: string;
// //   MobileNo?: string;
// //   OfficeName?: string;
// // }

// // interface ReportFormContextType {
// //   // Member lookup
// //   memberLookUp: MemberRecord[];
// //   totalPages: number;
// //   currentPage: number;
// //   isLoading: boolean;
// //   error: string;
// //   selectedMember: MemberRecord | null;
// //   searchmemberLookUp: (params: MemberLookUpSearchParams) => Promise<void>;
// //   clearResults: () => void;
// //   setSelectedMember: (member: MemberRecord | null) => void;

// //   // Dropdown options
// //   branchOptions: SelectOption[];
// //   collectionCenterOptions: SelectOption[];
// //   memberGroupOptions: SelectOption[];
// //   orderByMap: Record<OrderByReportKey, SelectOption[]>;

// //   // Fetch functions
// //   fetchBranches: () => Promise<void>;
// //   fetchCollectionCenters: (branchId: number) => Promise<void>;
// //   fetchMemberGroups: (
// //     branchId: number,
// //     collectionCenterId: number,
// //   ) => Promise<void>;
// //   fetchOrderBy: () => Promise<void>;
// //   depositTypeOptions: SelectOption[];
// //   fetchDepositTypes: () => Promise<void>;
// //   collectorOptions: SelectOption[];
// //   fetchCollectors: (userId: number) => Promise<void>;
// // }

// // const DEFAULT_SELECT: SelectOption[] = [{ id: 0, name: "-- Select --" }];

// // const DEFAULT_ORDER_BY_MAP: Record<OrderByReportKey, SelectOption[]> = {
// //   memberIdCard: DEFAULT_SELECT,
// //   savingTypeWiseBalance: DEFAULT_SELECT,
// // };

// // const ReportFormContext = createContext<ReportFormContextType | undefined>(
// //   undefined,
// // );

// // export const useReportFormContext = () => {
// //   const ctx = useContext(ReportFormContext);
// //   if (!ctx)
// //     throw new Error(
// //       "useReportFormContext must be used within ReportFormProvider",
// //     );
// //   return ctx;
// // };

// // function mapOptions(list: OrderByResponse[]): SelectOption[] {
// //   return [
// //     { id: "0", name: "-- Select --" },
// //     ...list.map(
// //       (o): SelectOption => ({ id: o.value ?? "0", name: o.displayName ?? "" }),
// //     ),
// //   ];
// // }

// // export const ReportFormProvider = ({ children }: { children: ReactNode }) => {
// //   // ── Member lookup state ───────────────────────────────────────────────────
// //   const [memberLookUp, setMemberLookUp] = useState<MemberRecord[]>([]);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [selectedMember, setSelectedMember] = useState<MemberRecord | null>(
// //     null,
// //   );

// //   // ── Dropdown options ──────────────────────────────────────────────────────
// //   const [branchOptions, setBranchOptions] =
// //     useState<SelectOption[]>(DEFAULT_SELECT);
// //   const [collectionCenterOptions, setCollectionCenterOptions] =
// //     useState<SelectOption[]>(DEFAULT_SELECT);
// //   const [memberGroupOptions, setMemberGroupOptions] =
// //     useState<SelectOption[]>(DEFAULT_SELECT);
// //   const [orderByMap, setOrderByMap] =
// //     useState<Record<OrderByReportKey, SelectOption[]>>(DEFAULT_ORDER_BY_MAP);
// //   const [depositTypeOptions, setDepositTypeOptions] =
// //     useState<SelectOption[]>(DEFAULT_SELECT);
// //   const [collectorOptions, setCollectorOptions] =
// //     useState<SelectOption[]>(DEFAULT_SELECT);

// //   // ── Fetch guards ──────────────────────────────────────────────────────────
// //   const branchFetchedRef = useRef(false);
// //   const orderByFetchedRef = useRef(false);
// //   const depositeTypeRef = useRef(false);
// //   const searchGenerationRef = useRef(0);

// //   // ── Member lookup ─────────────────────────────────────────────────────────
// //   const searchmemberLookUp = useCallback(
// //     async (params: MemberLookUpSearchParams) => {
// //       const generation = ++searchGenerationRef.current;
// //       setIsLoading(true);
// //       setError("");
// //       try {
// //         const data = await memberLookUpService.getAllWithFilters(params);
// //         if (generation !== searchGenerationRef.current) return;
// //         const mappedItems = (data?.items ?? []).map(
// //           (item): MemberRecord => ({
// //             memMemberRegistrationId: item.memMemberRegistrationId ?? 0,
// //             memberId: item.memberId ?? "",
// //             memberName: item.memberName ?? "",
// //             centerName: item.centerName ?? "",
// //             centerCode: item.centerCode ?? "",
// //             groupName: item.groupName ?? "",
// //             groupCode: item.groupCode ?? "",
// //             officeName: item.officeName ?? "",
// //             gender: item.gender ?? "",
// //             temporaryAddress: item.temporaryAddress ?? "",
// //             mobileNo: item.mobileNo ?? "",
// //           }),
// //         );
// //         setMemberLookUp(mappedItems);
// //         setTotalPages(data?.totalPages ?? 1);
// //         setCurrentPage(data?.currentPage ?? 1);
// //       } catch (err: any) {
// //         if (generation !== searchGenerationRef.current) return;
// //         setError(err?.message ?? "Failed to load members");
// //       } finally {
// //         if (generation === searchGenerationRef.current) setIsLoading(false);
// //       }
// //     },
// //     [],
// //   );

// //   const clearResults = useCallback(() => {
// //     searchGenerationRef.current += 1;
// //     setMemberLookUp([]);
// //     setTotalPages(1);
// //     setCurrentPage(1);
// //     setError("");
// //     setIsLoading(false);
// //   }, []);

// //   // ── Branches (lazy, once) ─────────────────────────────────────────────────
// //   const fetchBranches = useCallback(async () => {
// //     if (branchFetchedRef.current) return;
// //     branchFetchedRef.current = true;
// //     try {
// //       const res: BranchResponse[] = await branchService.getAll();
// //       const mapped = res.map((b) => ({
// //         id: b.branchId ?? 0,
// //         name: b.branchName ?? "",
// //       }));
// //       setBranchOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
// //     } catch {
// //       branchFetchedRef.current = false;
// //     }
// //   }, []);

// //   // ── Collection Centers (refetches when branch changes) ───────────────────
// //   const fetchCollectionCenters = useCallback(async (branchId: number) => {
// //     if (!branchId || branchId === 0) {
// //       setCollectionCenterOptions(DEFAULT_SELECT);
// //       return;
// //     }
// //     try {
// //       const res = await collectionCenterService.getAll({
// //         lstOfficeId: branchId,
// //       });
// //       const mapped = (res ?? []).map((c: any) => ({
// //         id: c.collectionCenterId ?? 0,
// //         name: c.collectionCenterName ?? "",
// //       }));
// //       setCollectionCenterOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
// //     } catch {
// //       setCollectionCenterOptions(DEFAULT_SELECT);
// //     }
// //   }, []);

// //   // ── Member Groups (refetches when branch + center change) ────────────────
// //   const fetchMemberGroups = useCallback(
// //     async (branchId: number, collectionCenterId: number) => {
// //       if (
// //         !branchId ||
// //         branchId === 0 ||
// //         !collectionCenterId ||
// //         collectionCenterId === 0
// //       ) {
// //         setMemberGroupOptions(DEFAULT_SELECT);
// //         return;
// //       }
// //       try {
// //         const res = await memberGroupService.getAll({
// //           lstOfficeId: branchId,
// //           collectionCenterId,
// //         });
// //         const mapped = (res ?? []).map((g: any) => ({
// //           id: g.memberGroupId ?? 0,
// //           name: g.name ?? "",
// //         }));
// //         setMemberGroupOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
// //       } catch {
// //         setMemberGroupOptions(DEFAULT_SELECT);
// //       }
// //     },
// //     [],
// //   );

// //   // ── OrderBy (lazy, once) ──────────────────────────────────────────────────
// //   const fetchOrderBy = useCallback(async () => {
// //     if (orderByFetchedRef.current) return;
// //     orderByFetchedRef.current = true;
// //     try {
// //       const res = await orderByService.getAll();
// //       setOrderByMap({
// //         memberIdCard: mapOptions(res.memberIdCard ?? []),
// //         savingTypeWiseBalance: mapOptions(res.savingTypeWiseBalance ?? []),
// //       });
// //     } catch {
// //       orderByFetchedRef.current = false;
// //     }
// //   }, []);

// //   // ── Deposit Types (lazy, once) ────────────────────────────────────────────
// //   const fetchDepositTypes = useCallback(async () => {
// //     if (depositeTypeRef.current) return;
// //     depositeTypeRef.current = true;
// //     try {
// //       const res: DepositTypeResponse[] = await depositeTypeService.getAll();
// //       const mapped = res.map((d) => ({
// //         id: d.depositeTypeId ?? 0,
// //         name: d.depositeTypeName ?? "",
// //       }));
// //       setDepositTypeOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
// //     } catch {
// //       depositeTypeRef.current = false;
// //     }
// //   }, []);

// //   // ── Collectors (refetches per userId) ────────────────────────────────────
// //   const fetchCollectors = useCallback(async (userId: number) => {
// //     if (!userId || userId === 0) {
// //       setCollectorOptions(DEFAULT_SELECT);
// //       return;
// //     }
// //     try {
// //       const res: CollectorResponse[] =
// //         await collectorService.getCollectors(userId);
// //       const mapped = res.map((c) => ({
// //         id: c.id ?? 0,
// //         name: c.collectorCode
// //           ? `${c.collectorCode} - ${c.collectorName?.trim() || ""}`
// //           : c.collectorName?.trim() || "",
// //       }));
// //       setCollectorOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
// //     } catch {
// //       setCollectorOptions(DEFAULT_SELECT);
// //     }
// //   }, []);

// //   // ── Memoized context value — only re-creates when actual deps change ──────
// //   const contextValue = useMemo<ReportFormContextType>(
// //     () => ({
// //       memberLookUp,
// //       totalPages,
// //       currentPage,
// //       isLoading,
// //       error,
// //       selectedMember,
// //       setSelectedMember,
// //       searchmemberLookUp,
// //       clearResults,
// //       branchOptions,
// //       collectionCenterOptions,
// //       memberGroupOptions,
// //       orderByMap,
// //       fetchBranches,
// //       fetchCollectionCenters,
// //       fetchMemberGroups,
// //       fetchOrderBy,
// //       depositTypeOptions,
// //       fetchDepositTypes,
// //       collectorOptions,
// //       fetchCollectors,
// //     }),
// //     [
// //       memberLookUp,
// //       totalPages,
// //       currentPage,
// //       isLoading,
// //       error,
// //       selectedMember,
// //       searchmemberLookUp,
// //       clearResults,
// //       branchOptions,
// //       collectionCenterOptions,
// //       memberGroupOptions,
// //       orderByMap,
// //       fetchBranches,
// //       fetchCollectionCenters,
// //       fetchMemberGroups,
// //       fetchOrderBy,
// //       depositTypeOptions,
// //       fetchDepositTypes,
// //       collectorOptions,
// //       fetchCollectors,
// //     ],
// //   );

// //   return (
// //     <ReportFormContext.Provider value={contextValue}>
// //       {children}
// //     </ReportFormContext.Provider>
// //   );
// // };

// "use client";

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useCallback,
//   useRef,
//   useMemo,
//   ReactNode,
// } from "react";
// import branchService from "@/services/Common/BranchService";
// import { memberLookUpService } from "@/services/Common/MemberLookUpService";
// import { collectionCenterService } from "@/services/Common/CollectionCenterService";
// import {
//   BranchResponse,
//   CollectorResponse,
//   DepositTypeResponse,
// } from "types/api/api";
// import { memberGroupService } from "@/services/Common/MemberGroupService";
// import depositeTypeService from "@/services/Common/DepositeType";
// import collectorService from "@/services/Common/CollectorService";

// export type SelectOption = { id: number | string; name: string };

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

// interface ReportFormContextType {
//   // Member lookup
//   memberLookUp: MemberRecord[];
//   totalPages: number;
//   currentPage: number;
//   isLoading: boolean;
//   error: string;
//   selectedMember: MemberRecord | null;
//   searchmemberLookUp: (params: MemberLookUpSearchParams) => Promise<void>;
//   clearResults: () => void;
//   setSelectedMember: (member: MemberRecord | null) => void;

//   // Dropdown options
//   branchOptions: SelectOption[];
//   collectionCenterOptions: SelectOption[];
//   memberGroupOptions: SelectOption[];

//   // Fetch functions
//   fetchBranches: () => Promise<void>;
//   fetchCollectionCenters: (branchId: number) => Promise<void>;
//   fetchMemberGroups: (
//     branchId: number,
//     collectionCenterId: number,
//   ) => Promise<void>;
//   depositTypeOptions: SelectOption[];
//   fetchDepositTypes: () => Promise<void>;
//   collectorOptions: SelectOption[];
//   fetchCollectors: (userId: number) => Promise<void>;
// }

// const DEFAULT_SELECT: SelectOption[] = [{ id: 0, name: "-- Select --" }];

// const ReportFormContext = createContext<ReportFormContextType | undefined>(
//   undefined,
// );

// export const useReportFormContext = () => {
//   const ctx = useContext(ReportFormContext);
//   if (!ctx)
//     throw new Error(
//       "useReportFormContext must be used within ReportFormProvider",
//     );
//   return ctx;
// };

// export const ReportFormProvider = ({ children }: { children: ReactNode }) => {
//   // ── Member lookup state ───────────────────────────────────────────────────
//   const [memberLookUp, setMemberLookUp] = useState<MemberRecord[]>([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [selectedMember, setSelectedMember] = useState<MemberRecord | null>(
//     null,
//   );

//   // ── Dropdown options ──────────────────────────────────────────────────────
//   const [branchOptions, setBranchOptions] =
//     useState<SelectOption[]>(DEFAULT_SELECT);
//   const [collectionCenterOptions, setCollectionCenterOptions] =
//     useState<SelectOption[]>(DEFAULT_SELECT);
//   const [memberGroupOptions, setMemberGroupOptions] =
//     useState<SelectOption[]>(DEFAULT_SELECT);
//   const [depositTypeOptions, setDepositTypeOptions] =
//     useState<SelectOption[]>(DEFAULT_SELECT);
//   const [collectorOptions, setCollectorOptions] =
//     useState<SelectOption[]>(DEFAULT_SELECT);

//   // ── Fetch guards ──────────────────────────────────────────────────────────
//   const branchFetchedRef = useRef(false);
//   const depositeTypeRef = useRef(false);
//   const searchGenerationRef = useRef(0);

//   // ── Member lookup ─────────────────────────────────────────────────────────
//   const searchmemberLookUp = useCallback(
//     async (params: MemberLookUpSearchParams) => {
//       const generation = ++searchGenerationRef.current;
//       setIsLoading(true);
//       setError("");
//       try {
//         const data = await memberLookUpService.getAllWithFilters(params);
//         if (generation !== searchGenerationRef.current) return;
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
//         if (generation !== searchGenerationRef.current) return;
//         setError(err?.message ?? "Failed to load members");
//       } finally {
//         if (generation === searchGenerationRef.current) setIsLoading(false);
//       }
//     },
//     [],
//   );

//   const clearResults = useCallback(() => {
//     searchGenerationRef.current += 1;
//     setMemberLookUp([]);
//     setTotalPages(1);
//     setCurrentPage(1);
//     setError("");
//     setIsLoading(false);
//   }, []);

//   // ── Branches (lazy, once) ─────────────────────────────────────────────────
//   const fetchBranches = useCallback(async () => {
//     if (branchFetchedRef.current) return;
//     branchFetchedRef.current = true;
//     try {
//       const res: BranchResponse[] = await branchService.getAll();
//       const mapped = res.map((b) => ({
//         id: b.branchId ?? 0,
//         name: b.branchName ?? "",
//       }));
//       setBranchOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
//     } catch {
//       branchFetchedRef.current = false;
//     }
//   }, []);

//   // ── Collection Centers (refetches when branch changes) ───────────────────
//   const fetchCollectionCenters = useCallback(async (branchId: number) => {
//     if (!branchId || branchId === 0) {
//       setCollectionCenterOptions(DEFAULT_SELECT);
//       return;
//     }
//     try {
//       const res = await collectionCenterService.getAll({
//         lstOfficeId: branchId,
//       });
//       const mapped = (res ?? []).map((c: any) => ({
//         id: c.collectionCenterId ?? 0,
//         name: c.collectionCenterName ?? "",
//       }));
//       setCollectionCenterOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
//     } catch {
//       setCollectionCenterOptions(DEFAULT_SELECT);
//     }
//   }, []);

//   // ── Member Groups (refetches when branch + center change) ────────────────
//   const fetchMemberGroups = useCallback(
//     async (branchId: number, collectionCenterId: number) => {
//       if (
//         !branchId ||
//         branchId === 0 ||
//         !collectionCenterId ||
//         collectionCenterId === 0
//       ) {
//         setMemberGroupOptions(DEFAULT_SELECT);
//         return;
//       }
//       try {
//         const res = await memberGroupService.getAll({
//           lstOfficeId: branchId,
//           collectionCenterId,
//         });
//         const mapped = (res ?? []).map((g: any) => ({
//           id: g.memberGroupId ?? 0,
//           name: g.name ?? "",
//         }));
//         setMemberGroupOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
//       } catch {
//         setMemberGroupOptions(DEFAULT_SELECT);
//       }
//     },
//     [],
//   );

//   // ── Deposit Types (lazy, once) ────────────────────────────────────────────
//   const fetchDepositTypes = useCallback(async () => {
//     if (depositeTypeRef.current) return;
//     depositeTypeRef.current = true;
//     try {
//       const res: DepositTypeResponse[] = await depositeTypeService.getAll();
//       const mapped = res.map((d) => ({
//         id: d.depositeTypeId ?? 0,
//         name: d.depositeTypeName ?? "",
//       }));
//       setDepositTypeOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
//     } catch {
//       depositeTypeRef.current = false;
//     }
//   }, []);

//   // ── Collectors (refetches per userId) ────────────────────────────────────
//   const fetchCollectors = useCallback(async (userId: number) => {
//     if (!userId || userId === 0) {
//       setCollectorOptions(DEFAULT_SELECT);
//       return;
//     }
//     try {
//       const res: CollectorResponse[] =
//         await collectorService.getCollectors(userId);
//       const mapped = res.map((c) => ({
//         id: c.id ?? 0,
//         name: c.collectorCode
//           ? `${c.collectorCode} - ${c.collectorName?.trim() || ""}`
//           : c.collectorName?.trim() || "",
//       }));
//       setCollectorOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
//     } catch {
//       setCollectorOptions(DEFAULT_SELECT);
//     }
//   }, []);

//   // ── Memoized context value ────────────────────────────────────────────────
//   const contextValue = useMemo<ReportFormContextType>(
//     () => ({
//       memberLookUp,
//       totalPages,
//       currentPage,
//       isLoading,
//       error,
//       selectedMember,
//       setSelectedMember,
//       searchmemberLookUp,
//       clearResults,
//       branchOptions,
//       collectionCenterOptions,
//       memberGroupOptions,
//       fetchBranches,
//       fetchCollectionCenters,
//       fetchMemberGroups,
//       depositTypeOptions,
//       fetchDepositTypes,
//       collectorOptions,
//       fetchCollectors,
//     }),
//     [
//       memberLookUp,
//       totalPages,
//       currentPage,
//       isLoading,
//       error,
//       selectedMember,
//       searchmemberLookUp,
//       clearResults,
//       branchOptions,
//       collectionCenterOptions,
//       memberGroupOptions,
//       fetchBranches,
//       fetchCollectionCenters,
//       fetchMemberGroups,
//       depositTypeOptions,
//       fetchDepositTypes,
//       collectorOptions,
//       fetchCollectors,
//     ],
//   );

//   return (
//     <ReportFormContext.Provider value={contextValue}>
//       {children}
//     </ReportFormContext.Provider>
//   );
// };

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useMemo,
  ReactNode,
} from "react";
import branchService from "@/services/Common/BranchService";
import { memberLookUpService } from "@/services/Common/MemberLookUpService";
import { collectionCenterService } from "@/services/Common/CollectionCenterService";
import { memberGroupService } from "@/services/Common/MemberGroupService";
import { soleMemberGroupService } from "@/services/Common/SoleMemberGroupService";
import {
  BranchResponse,
  CollectorResponse,
  DepositTypeResponse,
} from "types/api/api";
import depositeTypeService from "@/services/Common/DepositeType";
import collectorService from "@/services/Common/CollectorService";

export type SelectOption = { id: number | string; name: string };

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

interface ReportFormContextType {
  // Member lookup
  memberLookUp: MemberRecord[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string;
  selectedMember: MemberRecord | null;
  searchmemberLookUp: (params: MemberLookUpSearchParams) => Promise<void>;
  clearResults: () => void;
  setSelectedMember: (member: MemberRecord | null) => void;

  // Dropdown options
  branchOptions: SelectOption[];
  collectionCenterOptions: SelectOption[];
  memberGroupOptions: SelectOption[];
  // ✅ NEW — separate options state for the sole (branch-only) group dropdown
  soleMemberGroupOptions: SelectOption[];

  // Fetch functions
  fetchBranches: () => Promise<void>;
  fetchCollectionCenters: (branchId: number) => Promise<void>;
  fetchMemberGroups: (
    branchId: number,
    collectionCenterId: number,
  ) => Promise<void>;
  // ✅ NEW — calls the dedicated /api/SoleMemberGroup endpoint, branch only
  fetchSoleMemberGroups: (branchId: number) => Promise<void>;
  depositTypeOptions: SelectOption[];
  fetchDepositTypes: () => Promise<void>;
  collectorOptions: SelectOption[];
  fetchCollectors: (userId: number) => Promise<void>;
}

const DEFAULT_SELECT: SelectOption[] = [{ id: 0, name: "-- Select --" }];

const ReportFormContext = createContext<ReportFormContextType | undefined>(
  undefined,
);

export const useReportFormContext = () => {
  const ctx = useContext(ReportFormContext);
  if (!ctx)
    throw new Error(
      "useReportFormContext must be used within ReportFormProvider",
    );
  return ctx;
};

export const ReportFormProvider = ({ children }: { children: ReactNode }) => {
  // ── Member lookup state ───────────────────────────────────────────────────
  const [memberLookUp, setMemberLookUp] = useState<MemberRecord[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMember, setSelectedMember] = useState<MemberRecord | null>(
    null,
  );

  // ── Dropdown options ──────────────────────────────────────────────────────
  const [branchOptions, setBranchOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);
  const [collectionCenterOptions, setCollectionCenterOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);
  const [memberGroupOptions, setMemberGroupOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);
  // ✅ NEW — independent state so it never collides with the
  // Collection-Center-dependent memberGroupOptions used elsewhere
  const [soleMemberGroupOptions, setSoleMemberGroupOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);
  const [depositTypeOptions, setDepositTypeOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);
  const [collectorOptions, setCollectorOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);

  // ── Fetch guards ──────────────────────────────────────────────────────────
  const branchFetchedRef = useRef(false);
  const depositeTypeRef = useRef(false);
  const searchGenerationRef = useRef(0);

  // ── Member lookup ─────────────────────────────────────────────────────────
  const searchmemberLookUp = useCallback(
    async (params: MemberLookUpSearchParams) => {
      const generation = ++searchGenerationRef.current;
      setIsLoading(true);
      setError("");
      try {
        const data = await memberLookUpService.getAllWithFilters(params);
        if (generation !== searchGenerationRef.current) return;
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
        if (generation !== searchGenerationRef.current) return;
        setError(err?.message ?? "Failed to load members");
      } finally {
        if (generation === searchGenerationRef.current) setIsLoading(false);
      }
    },
    [],
  );

  const clearResults = useCallback(() => {
    searchGenerationRef.current += 1;
    setMemberLookUp([]);
    setTotalPages(1);
    setCurrentPage(1);
    setError("");
    setIsLoading(false);
  }, []);

  // ── Branches (lazy, once) ─────────────────────────────────────────────────
  const fetchBranches = useCallback(async () => {
    if (branchFetchedRef.current) return;
    branchFetchedRef.current = true;
    try {
      const res: BranchResponse[] = await branchService.getAll();
      const mapped = res.map((b) => ({
        id: b.branchId ?? 0,
        name: b.branchName ?? "",
      }));
      setBranchOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
    } catch {
      branchFetchedRef.current = false;
    }
  }, []);

  // ── Collection Centers (refetches when branch changes) ───────────────────
  const fetchCollectionCenters = useCallback(async (branchId: number) => {
    if (!branchId || branchId === 0) {
      setCollectionCenterOptions(DEFAULT_SELECT);
      return;
    }
    try {
      const res = await collectionCenterService.getAll({
        lstOfficeId: branchId,
      });
      const mapped = (res ?? []).map((c: any) => ({
        id: c.collectionCenterId ?? 0,
        name: c.collectionCenterName ?? "",
      }));
      setCollectionCenterOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
    } catch {
      setCollectionCenterOptions(DEFAULT_SELECT);
    }
  }, []);

  // ── Member Groups (refetches when branch + center change) ────────────────
  const fetchMemberGroups = useCallback(
    async (branchId: number, collectionCenterId: number) => {
      if (
        !branchId ||
        branchId === 0 ||
        !collectionCenterId ||
        collectionCenterId === 0
      ) {
        setMemberGroupOptions(DEFAULT_SELECT);
        return;
      }
      try {
        const res = await memberGroupService.getAll({
          lstOfficeId: branchId,
          collectionCenterId,
        });
        const mapped = (res ?? []).map((g: any) => ({
          id: g.memberGroupId ?? 0,
          name: g.name ?? "",
        }));
        setMemberGroupOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
      } catch {
        setMemberGroupOptions(DEFAULT_SELECT);
      }
    },
    [],
  );

  // ── Sole Member Groups — dedicated /api/SoleMemberGroup endpoint ─────────
  // ✅ NEW — branch-only, calls soleMemberGroupService (separate generated
  // client method: soleMemberGroupCreate). No Collection Center dependency.
  const fetchSoleMemberGroups = useCallback(async (branchId: number) => {
    if (!branchId || branchId === 0) {
      setSoleMemberGroupOptions(DEFAULT_SELECT);
      return;
    }
    try {
      const res = await soleMemberGroupService.getAll({
        lstOfficeId: branchId,
      });
      const mapped = (res ?? []).map((g: any) => ({
        id: g.memberGroupId ?? 0,
        name: g.name ?? g.memberGroupName ?? "",
      }));
      setSoleMemberGroupOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
    } catch {
      setSoleMemberGroupOptions(DEFAULT_SELECT);
    }
  }, []);

  // ── Deposit Types (lazy, once) ────────────────────────────────────────────
  const fetchDepositTypes = useCallback(async () => {
    if (depositeTypeRef.current) return;
    depositeTypeRef.current = true;
    try {
      const res: DepositTypeResponse[] = await depositeTypeService.getAll();
      const mapped = res.map((d) => ({
        id: d.depositeTypeId ?? 0,
        name: d.depositeTypeName ?? "",
      }));
      setDepositTypeOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
    } catch {
      depositeTypeRef.current = false;
    }
  }, []);

  // ── Collectors (refetches per userId) ────────────────────────────────────
  const fetchCollectors = useCallback(async (userId: number) => {
    if (!userId || userId === 0) {
      setCollectorOptions(DEFAULT_SELECT);
      return;
    }
    try {
      const res: CollectorResponse[] =
        await collectorService.getCollectors(userId);
      const mapped = res.map((c) => ({
        id: c.id ?? 0,
        name: c.collectorCode
          ? `${c.collectorCode} - ${c.collectorName?.trim() || ""}`
          : c.collectorName?.trim() || "",
      }));
      setCollectorOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
    } catch {
      setCollectorOptions(DEFAULT_SELECT);
    }
  }, []);

  // ── Memoized context value ────────────────────────────────────────────────
  const contextValue = useMemo<ReportFormContextType>(
    () => ({
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
      collectionCenterOptions,
      memberGroupOptions,
      soleMemberGroupOptions,
      fetchBranches,
      fetchCollectionCenters,
      fetchMemberGroups,
      fetchSoleMemberGroups,
      depositTypeOptions,
      fetchDepositTypes,
      collectorOptions,
      fetchCollectors,
    }),
    [
      memberLookUp,
      totalPages,
      currentPage,
      isLoading,
      error,
      selectedMember,
      searchmemberLookUp,
      clearResults,
      branchOptions,
      collectionCenterOptions,
      memberGroupOptions,
      soleMemberGroupOptions,
      fetchBranches,
      fetchCollectionCenters,
      fetchMemberGroups,
      fetchSoleMemberGroups,
      depositTypeOptions,
      fetchDepositTypes,
      collectorOptions,
      fetchCollectors,
    ],
  );

  return (
    <ReportFormContext.Provider value={contextValue}>
      {children}
    </ReportFormContext.Provider>
  );
};
