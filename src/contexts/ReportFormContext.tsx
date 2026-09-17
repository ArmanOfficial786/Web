"use client";

import branchService from "@/services/Common/BranchService";
import { collectionCenterService } from "@/services/Common/CollectionCenterService";
import collectorService from "@/services/Common/CollectorService";
import depositeTypeService from "@/services/Common/DepositeType";
import lmtLoanMasterlistService from "@/services/Common/LmtLoanMasterService";
import { memberGroupService } from "@/services/Common/MemberGroupService";
import { memberLookUpService } from "@/services/Common/MemberLookUpService";
import paymentDurationTypeService from "@/services/Common/PaymentDurationType";
import shareTypeService from "@/services/Common/ShareTypeService";
import { soleMemberGroupService } from "@/services/Common/SoleMemberGroupService";
import tellerExpenseService from "@/services/Common/TellerExpenseService";
import tellerService from "@/services/Common/TellerService";
import voucherService, {
  VoucherLookupResponse,
} from "@/services/Common/VoucherService";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BranchResponse,
  CollectorResponse,
  DepositTypeResponse,
  MemberLookUpDtos,
  TellerLookupResponse,
} from "types/api/api";

export type SelectOption = { id: number | string; name: string };
export type MemberRecord = MemberLookUpDtos;

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
  memberLookUp: MemberRecord[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string;
  selectedMember: MemberRecord | null;
  searchmemberLookUp: (params: MemberLookUpSearchParams) => Promise<void>;
  clearResults: () => void;
  setSelectedMember: (member: MemberRecord | null) => void;

  loanMasterListOptions: SelectOption[];
  fetchLoanMasterList: () => Promise<void>;

  shareTypeOptions: SelectOption[];
  fetchShareType: () => Promise<void>;

  branchOptions: SelectOption[];
  collectionCenterOptions: SelectOption[];
  memberGroupOptions: SelectOption[];
  soleMemberGroupOptions: SelectOption[];

  fetchBranches: () => Promise<void>;
  fetchCollectionCenters: (branchId: number) => Promise<void>;
  fetchMemberGroups: (
    branchId: number,
    collectionCenterId: number,
  ) => Promise<void>;
  fetchSoleMemberGroups: (branchId: number) => Promise<void>;
  depositTypeOptions: SelectOption[];
  fetchDepositTypes: () => Promise<void>;
  collectorOptions: SelectOption[];
  fetchCollectors: (userId: number) => Promise<void>;

  tellerOptions: SelectOption[];
  fetchTellers: (fromDateBs?: string, toDateBs?: string) => Promise<void>;

  // ✅ NEW — loading flag so TellerExpenseField can show a spinner
  tellerExpenseOptions: SelectOption[];
  tellerExpenseLoading: boolean;
  fetchTellerExpenses: (
    fromDateBs?: string,
    toDateBs?: string,
  ) => Promise<void>;

  userLookupOptionsMap: Record<string, SelectOption[]>;
  userLookupLoading: Record<string, boolean>;
  fetchUserLookupOnce: (
    key: string,
    fetcher: () => Promise<SelectOption[]>,
  ) => Promise<void>;

  collectionBranchOptions: SelectOption[];
  collectionBranchLoading: boolean;
  fetchCollectionBranches: () => Promise<void>;

  voucherOptions: SelectOption[];
  voucherLoading: boolean;
  fetchVouchers: (
    fromDate: string,
    toDate: string,
    branchIds?: number[],
  ) => Promise<void>;

  paymentDurationTypeOptions: SelectOption[];
  fetchPaymentDurationTypes: () => Promise<void>;
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
  const [soleMemberGroupOptions, setSoleMemberGroupOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);
  const [depositTypeOptions, setDepositTypeOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);
  const [collectorOptions, setCollectorOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);
  const [loanMasterListOptions, setLoanMasterListOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);

  const [shareTypeOptions, setShareTypeOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);
  const shareTypeFetchedRef = useRef(false);

  const [tellerOptions, setTellerOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);

  const [tellerExpenseOptions, setTellerExpenseOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);

  const [tellerExpenseLoading, setTellerExpenseLoading] = useState(false);
  const [userLookupOptionsMap, setUserLookupOptionsMap] = useState<
    Record<string, SelectOption[]>
  >({});
  const [userLookupLoading, setUserLookupLoading] = useState<
    Record<string, boolean>
  >({});
  const [collectionBranchOptions, setCollectionBranchOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);
  const [collectionBranchLoading, setCollectionBranchLoading] = useState(false);

  const [voucherOptions, setVoucherOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);
  const [voucherLoading, setVoucherLoading] = useState(false);

  const [paymentDurationTypeOptions, setPaymentDurationTypeOptions] =
    useState<SelectOption[]>(DEFAULT_SELECT);

  //=====ref gurar================
  const branchFetchedRef = useRef(false);
  const depositeTypeRef = useRef(false);
  const searchGenerationRef = useRef(0);
  const loanMasterListFetchedRef = useRef(false);
  const userLookupFetchedRef = useRef<Record<string, boolean>>({});
  const collectionBranchFetchedRef = useRef(false);
  const paymentDurationTypeFetchedRef = useRef(false);

  const searchmemberLookUp = useCallback(
    async (params: MemberLookUpSearchParams) => {
      const generation = ++searchGenerationRef.current;
      setIsLoading(true);
      setError("");
      try {
        const data = await memberLookUpService.getAllWithFilters(params);
        if (generation !== searchGenerationRef.current) return;
        const mappedItems = (data?.items ?? []).map(
          (item: MemberLookUpDtos): MemberRecord => ({
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

  const fetchLoanMasterList = useCallback(async () => {
    if (loanMasterListFetchedRef.current) return;
    loanMasterListFetchedRef.current = true;
    try {
      const res = await lmtLoanMasterlistService.getAll();
      const mapped = res.map((l) => ({
        id: l.lmtLoanTypeMasterId ?? 0,
        name: l.loanTypeName ?? "",
      }));
      setLoanMasterListOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
    } catch {
      loanMasterListFetchedRef.current = false;
    }
  }, []);

  const fetchShareType = useCallback(async () => {
    if (shareTypeFetchedRef.current) return;
    try {
      const res = await shareTypeService.getAll();
      const mapped = res.map((s: any) => ({
        id: s.shareTypeId ?? 0,
        name: s.shareTypeName ?? "",
      }));
      setShareTypeOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
      if (mapped.length > 0) shareTypeFetchedRef.current = true;
    } catch {
      shareTypeFetchedRef.current = false;
    }
  }, []);

  const fetchTellers = useCallback(
    async (fromDateBs?: string, toDateBs?: string) => {
      try {
        const res: TellerLookupResponse[] = await tellerService.getAll({
          fromDateBs,
          toDateBs,
        });
        const mapped = res
          .filter(
            (t): t is TellerLookupResponse & { id: number } => t.id != null,
          )
          .map((t) => ({
            id: t.id,
            name: t.name ?? "",
          }));
        setTellerOptions([{ id: -1, name: "-- Select --" }, ...mapped]);
      } catch {
        setTellerOptions(DEFAULT_SELECT);
      }
    },
    [],
  );

  // ── Teller (expense) — now tracks a loading flag ──────────────────────────
  const fetchTellerExpenses = useCallback(
    async (fromDateBs?: string, toDateBs?: string) => {
      setTellerExpenseLoading(true);
      try {
        const res: TellerLookupResponse[] = await tellerExpenseService.getAll({
          fromDateBs,
          toDateBs,
        });
        const mapped = res
          .filter(
            (t): t is TellerLookupResponse & { id: number } => t.id != null,
          )
          .map((t) => ({
            id: t.id,
            name: t.name ?? "",
          }));
        setTellerExpenseOptions([{ id: -1, name: "-- Select --" }, ...mapped]);
      } catch {
        setTellerExpenseOptions(DEFAULT_SELECT);
      } finally {
        setTellerExpenseLoading(false);
      }
    },
    [],
  );

  const fetchUserLookupOnce = useCallback(
    async (key: string, fetcher: () => Promise<SelectOption[]>) => {
      if (userLookupFetchedRef.current[key]) return; // already fetched or in flight
      userLookupFetchedRef.current[key] = true;

      setUserLookupLoading((prev) => ({ ...prev, [key]: true }));
      try {
        const res = await fetcher();
        setUserLookupOptionsMap((prev) => ({
          ...prev,
          [key]: [{ id: -1, name: "-- Select --" }, ...res],
        }));
      } catch {
        // allow a future retry on failure instead of caching a permanent miss
        userLookupFetchedRef.current[key] = false;
        setUserLookupOptionsMap((prev) => ({ ...prev, [key]: DEFAULT_SELECT }));
      } finally {
        setUserLookupLoading((prev) => ({ ...prev, [key]: false }));
      }
    },
    [],
  );

  // fetchBranches — add loading toggling (only change: setBranchLoading calls)
  // ✅ NEW — Collection Branches (lazy, once)
  const fetchCollectionBranches = useCallback(async () => {
    if (collectionBranchFetchedRef.current) return;
    collectionBranchFetchedRef.current = true;
    setCollectionBranchLoading(true);
    try {
      const res: BranchResponse[] = await branchService.getCollectionBranches();
      const mapped = res.map((b) => ({
        id: b.branchId ?? 0,
        name: b.branchName ?? "",
      }));
      setCollectionBranchOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
    } catch {
      collectionBranchFetchedRef.current = false;
    } finally {
      setCollectionBranchLoading(false);
    }
  }, []);
  // voucher no
  const fetchVouchers = useCallback(
    async (fromDate: string, toDate: string, branchIds?: number[]) => {
      if (!fromDate || !toDate) {
        setVoucherOptions(DEFAULT_SELECT);
        return;
      }

      setVoucherLoading(true);
      try {
        const res: VoucherLookupResponse[] = await voucherService.getAll({
          fromDate,
          toDate,
          branchIds,
        });

        const mapped = res
          .filter((v) => v && (v.voucherNo || v.acoVoucherId != null))
          .map((v) => ({
            id: v.acoVoucherId ?? 0,
            name: v.voucherNo ?? "",
          }))
          .filter((v) => v.name && v.id !== 0);

        setVoucherOptions([{ id: 0, name: "-- Select --" }, ...mapped]);
      } catch {
        setVoucherOptions(DEFAULT_SELECT);
      } finally {
        setVoucherLoading(false);
      }
    },
    [],
  );

  // ── Payment Duration Type — lazy, fetched once per app session, then
  const fetchPaymentDurationTypes = useCallback(async () => {
    if (paymentDurationTypeFetchedRef.current) return;
    paymentDurationTypeFetchedRef.current = true;
    try {
      const res = await paymentDurationTypeService.getAll();
      const mapped = res.map((p) => ({
        id: p.lmtPaymentDurationTypeId ?? 0,
        name: p.paymentDurationType ?? "",
      }));
      setPaymentDurationTypeOptions([{ id: 0, name: "-- All --" }, ...mapped]);
    } catch {
      paymentDurationTypeFetchedRef.current = false; // allow retry on failure
    }
  }, []);

  //======end call api logic========================
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
      loanMasterListOptions,
      fetchLoanMasterList,
      shareTypeOptions,
      fetchShareType,
      tellerOptions,
      fetchTellers,
      tellerExpenseOptions,
      tellerExpenseLoading,
      fetchTellerExpenses,
      userLookupOptionsMap,
      userLookupLoading,
      fetchUserLookupOnce,
      collectionBranchOptions,
      collectionBranchLoading,
      fetchCollectionBranches,
      voucherOptions,
      voucherLoading,
      fetchVouchers,
      paymentDurationTypeOptions,
      fetchPaymentDurationTypes,
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
      loanMasterListOptions,
      fetchLoanMasterList,
      shareTypeOptions,
      fetchShareType,
      tellerOptions,
      fetchTellers,
      tellerExpenseOptions,
      tellerExpenseLoading,
      fetchTellerExpenses,
      userLookupOptionsMap,
      userLookupLoading,
      fetchUserLookupOnce,
      collectionBranchOptions,
      collectionBranchLoading,
      fetchCollectionBranches,
      voucherOptions,
      voucherLoading,
      fetchVouchers,
      paymentDurationTypeOptions,
      fetchPaymentDurationTypes,
    ],
  );

  return (
    <ReportFormContext.Provider value={contextValue}>
      {children}
    </ReportFormContext.Provider>
  );
};
