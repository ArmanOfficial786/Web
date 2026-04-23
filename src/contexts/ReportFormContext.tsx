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
import branchService from "@/services/BranchService";
import orderByService from "@/services/OrderByService";
import { memberLookUpService } from "@/services/MemberLookUpService";
import { collectionCenterService } from "@/services/CollectionCenterService";
import {
  BranchResponse,
  CollectionCenterRequestDtos,
  MemberGroupRequestDtos,
  OrderByResponse, // ← import the actual type
} from "types/api/api";
import { memberGroupService } from "@/services/MemberGroupService";

// ── Types ─────────────────────────────────────────────────────────────────────
export type SelectOption = { id: number | string; name: string };

export type OrderByReportKey = "memberIdCard" | "savingTypeWiseBalance";
// ↑ extend this union when new reports are added

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
  fetchBranches: () => Promise<void>; // when click branch dropdwon then only call api and once call it is used in another by ref
  branchOptions: SelectOption[];
  fetchOrderBy: () => void;
  orderByMap: Record<OrderByReportKey, SelectOption[]>;
  collectionCenterOptions: SelectOption[];
  memberGroupOptions: SelectOption[];
  fetchCollectionCenters: (branchId: number) => Promise<void>;
  fetchMemberGroups: (
    branchId: number,
    collectionCenterId: number,
  ) => Promise<void>;
  resetFormFields: () => void;
}

const DEFAULT_SELECT: SelectOption[] = [{ id: 0, name: "-- Select --" }];

const DEFAULT_ORDER_BY_MAP: Record<OrderByReportKey, SelectOption[]> = {
  memberIdCard: DEFAULT_SELECT,
  savingTypeWiseBalance: DEFAULT_SELECT,
};

const ReportFormContext = createContext<ReportFormContextType | undefined>(
  undefined,
);

export const useReportForm = () => {
  const ctx = useContext(ReportFormContext);
  if (!ctx)
    throw new Error("useReportForm must be used within ReportFormProvider");
  return ctx;
};

// ── Helper or OrderBy — accepts the actual API type which has null ───────────────────────
// ✅ Fix: `null` is coerced to "" so it never reaches SelectOption as null
function mapOptions(list: OrderByResponse[]): SelectOption[] {
  return [
    { id: 0, name: "-- Select --" },
    ...list.map(
      (o): SelectOption => ({
        id: o.value ?? 0,
        name: o.displayName ?? "", // ✅ handles null | undefined | string
      }),
    ),
  ];
}

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
  const [collectionCenterOptions, setCollectionCenterOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);
  const [memberGroupOptions, setMemberGroupOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);
  const [orderByMap, setOrderByMap] =
    useState<Record<OrderByReportKey, SelectOption[]>>(DEFAULT_ORDER_BY_MAP);

  const searchGenerationRef = useRef(0);
  // ── Guard: fetch branches only once across all reports ────────────────────
  const branchFetchedRef = useRef(false);
  const orderbyFetchRef = useRef(false);
  //reset the form field
  const resetFormFields = useCallback(() => {
    setCollectionCenterOptions(DEFAULT_SELECT);
    setMemberGroupOptions(DEFAULT_SELECT);
  }, []);

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
        if (generation === searchGenerationRef.current) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  // ── Branch options (lazy — called only when dropdown is opened) ───────────
  const fetchBranches = useCallback(async () => {
    if (branchFetchedRef.current) return; // already fetched, skip API call
    branchFetchedRef.current = true;

    try {
      const res: BranchResponse[] = await branchService.getAll();
      const mapped = res.map((b: BranchResponse) => ({
        id: b.branchId ?? 0,
        name: b.branchName ?? "",
      }));
      setBranchOptions([
        // { id: 0, name: "-- Select --" },
        // { id: -1, name: "All" },
        ...mapped,
      ]);
    } catch {
      branchFetchedRef.current = false; // allow retry on next open if failed
    }
  }, []);

  // ── Collection Centers ────────────────────────────────────────────────────
  const fetchCollectionCenters = useCallback(async (branchId: number) => {
    if (!branchId || branchId === 0) {
      setCollectionCenterOptions(DEFAULT_SELECT);
      setMemberGroupOptions(DEFAULT_SELECT);
      return;
    }
    try {
      const request: CollectionCenterRequestDtos = { lstOfficeId: branchId };
      const res = await collectionCenterService.getAll(request);
      const mapped = (res ?? []).map(
        (c): SelectOption => ({
          id: c.collectionCenterId ?? 0,
          name: c.collectionCenterName ?? "",
        }),
      );
      setCollectionCenterOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
    } catch (err) {
      console.error("Error fetching collection centers:", err);
      setCollectionCenterOptions(DEFAULT_SELECT);
    }
  }, []);

  // ── Member Groups ─────────────────────────────────────────────────────────
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
        const request: MemberGroupRequestDtos = {
          lstOfficeId: branchId,
          collectionCenterId: collectionCenterId,
        };
        const res = await memberGroupService.getAll(request);
        const mapped = (res ?? []).map(
          (g): SelectOption => ({
            id: g.memberGroupId ?? 0,
            name: g.name ?? "",
          }),
        );
        setMemberGroupOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
      } catch (err) {
        console.error("Error fetching member groups:", err);
        setMemberGroupOptions(DEFAULT_SELECT);
      }
    },
    [],
  );

  // ── OrderBy map (lazy — called only when dropdown is opened) ──────────────
  const fetchOrderBy = useCallback(async () => {
    if (orderbyFetchRef.current) return; // already fetched, skip
    orderbyFetchRef.current = true;

    try {
      const res = await orderByService.getAll();
      setOrderByMap({
        memberIdCard: mapOptions(res.memberIdCard ?? []),
        savingTypeWiseBalance: mapOptions(res.savingTypeWiseBalance ?? []),
      });
    } catch {
      orderbyFetchRef.current = false; // allow retry on failure
    }
  }, []);

  // ── Clear results ─────────────────────────────────────────────────────────
  const clearResults = useCallback(() => {
    searchGenerationRef.current += 1;
    setMemberLookUp([]);
    setTotalPages(1);
    setCurrentPage(1);
    setError("");
    setIsLoading(false);
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
        fetchBranches,
        branchOptions,
        fetchOrderBy,
        orderByMap,
        collectionCenterOptions,
        memberGroupOptions,
        fetchCollectionCenters,
        fetchMemberGroups,
        resetFormFields,
      }}
    >
      {children}
    </ReportFormContext.Provider>
  );
};
