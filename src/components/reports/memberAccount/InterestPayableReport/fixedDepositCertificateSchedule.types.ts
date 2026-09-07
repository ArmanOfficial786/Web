import type { Pagination } from "types/api/api";

export const REPORT_TYPE_SCHEDULE = "Schedule";
export const REPORT_TYPE_CERTIFICATE = "Certificate";

export type ViewKind = "schedule" | "certificate";

export interface FixedDepositCertificateScheduleFormValues {
  accountNo?: string;
  memberId?: string;
  memberName?: string;
  accountId?: number;
  showHeader?: boolean;
}

export interface FixedDepositCertificateScheduleResponseExtended {
  blobUrl?: string;
  isLoading: boolean;
  loadingKind?: ViewKind;
  pagination?: Pagination;
}
