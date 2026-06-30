import { defineOrderByOptions } from "../DefineOrderByOptions";
import type { OrderByOption } from "../DefineOrderByOptions";

// ── Report: member-all-details ──────────────────────────────────────────
export const memberAllDetailOrderByOptions = defineOrderByOptions([
  { key: "MemberId", label: "Member ID" },
  { key: "MemberName", label: "Member Name" },
] as const);

// ── Report: member-registration ─────────────────────────────────────────
export const memberRegistrationOrderByOptions = defineOrderByOptions([
  { key: "MemberId", label: "Member ID" },
  { key: "MemberName", label: "Member Name" },
] as const);

// ── Report: member-id-card-detail ───────────────────────────────────────
export const memberIdCardDetailOrderByOptions = defineOrderByOptions([
  { key: "MemberId", label: "Member ID" },
  { key: "MemberName", label: "Member Name" },
  { key: "sex", label: "Gender" },
  { key: "birthonbs", label: "Date of Birth" },
  { key: "registrationon", label: "Registration Date" },
] as const);
//Report: member-basic-details
export const memberBasicDetailOrderByOptions = defineOrderByOptions([
  { key: "MemberId", label: "Member ID" },
  { key: "MemberName", label: "Member Name" },
  { key: "NoOfYear Asc", label: "Age Asc" },
  { key: "NoOfYear Desc", label: "Age Desc" },
] as const);

// ── Type for report keys and their options ──────────────────────────────
export type MemberOrderByReportKey =
  | "member-all-details"
  | "member-registration"
  | "member-id-card-detail"
  | "member-basic-details";

export const memberOrderByOptionsMap: Record<
  MemberOrderByReportKey,
  readonly OrderByOption[]
> = {
  "member-all-details": memberAllDetailOrderByOptions,
  "member-registration": memberRegistrationOrderByOptions,
  "member-id-card-detail": memberIdCardDetailOrderByOptions,
  "member-basic-details": memberBasicDetailOrderByOptions,
};
