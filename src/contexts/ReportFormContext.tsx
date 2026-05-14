"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import branchService from "@/services/Common/BranchService";
import orderByService from "@/services/Common/OrderByService";
import { memberLookUpService } from "@/services/Common/MemberLookUpService";
import { collectionCenterService } from "@/services/Common/CollectionCenterService";
import { BranchResponse, OrderByResponse } from "types/api/api";
import { memberGroupService } from "@/services/Common/MemberGroupService";

export type SelectOption = { id: number | string; name: string };
export type OrderByReportKey = "memberIdCard" | "savingTypeWiseBalance";

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

  // Dropdown options – each separate
  branchOptions: SelectOption[];
  collectionCenterOptions: SelectOption[];
  memberGroupOptions: SelectOption[];
  orderByMap: Record<OrderByReportKey, SelectOption[]>;

  // Fetch functions
  fetchBranches: () => Promise<void>;
  fetchCollectionCenters: (branchId: number) => Promise<void>;
  fetchMemberGroups: (
    branchId: number,
    collectionCenterId: number,
  ) => Promise<void>;
  fetchOrderBy: () => Promise<void>;
}

const DEFAULT_SELECT: SelectOption[] = [{ id: 0, name: "-- Select --" }];
const DEFAULT_ORDER_BY_MAP: Record<OrderByReportKey, SelectOption[]> = {
  memberIdCard: DEFAULT_SELECT,
  savingTypeWiseBalance: DEFAULT_SELECT,
};

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

function mapOptions(list: OrderByResponse[]): SelectOption[] {
  return [
    { id: "0", name: "-- Select --" },
    ...list.map(
      (o): SelectOption => ({ id: o.value ?? "0", name: o.displayName ?? "" }),
    ),
  ];
}

export const ReportFormProvider = ({ children }: { children: ReactNode }) => {
  // Member lookup state
  const [memberLookUp, setMemberLookUp] = useState<MemberRecord[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMember, setSelectedMember] = useState<MemberRecord | null>(
    null,
  );

  // Dropdown options (each with its own default)
  const [branchOptions, setBranchOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);
  const [collectionCenterOptions, setCollectionCenterOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);
  const [memberGroupOptions, setMemberGroupOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);
  const [orderByMap, setOrderByMap] =
    useState<Record<OrderByReportKey, SelectOption[]>>(DEFAULT_ORDER_BY_MAP);

  // Fetch guards
  const branchFetchedRef = useRef(false);
  const orderByFetchedRef = useRef(false);
  const searchGenerationRef = useRef(0);

  // ── Member lookup ─────────────────────────────────────────────
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

  // ── Branches (lazy, once) ────────────────────────────────────
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
      branchFetchedRef.current = false; // allow retry
    }
  }, []);

  // ── Collection Centers (no global cache – refetches when branch changes) ──
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

  // ── Member Groups (no global cache – refetches when branch+center change) ─
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

  // ── OrderBy (lazy, once) ────────────────────────────────────
  const fetchOrderBy = useCallback(async () => {
    if (orderByFetchedRef.current) return;
    orderByFetchedRef.current = true;
    try {
      const res = await orderByService.getAll();
      setOrderByMap({
        memberIdCard: mapOptions(res.memberIdCard ?? []),
        savingTypeWiseBalance: mapOptions(res.savingTypeWiseBalance ?? []),
      });
    } catch {
      orderByFetchedRef.current = false;
    }
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
        collectionCenterOptions,
        memberGroupOptions,
        orderByMap,
        fetchBranches,
        fetchCollectionCenters,
        fetchMemberGroups,
        fetchOrderBy,
        //resetFormFields,
      }}
    >
      {children}
    </ReportFormContext.Provider>
  );
};
