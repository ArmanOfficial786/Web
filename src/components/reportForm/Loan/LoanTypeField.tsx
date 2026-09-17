"use client";
import DropDown from "@/components/form/DropDown";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
import Box from "@mui/system/Box";
import { useEffect } from "react";
import type {
  Control,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";

// ── Props ─────────────────────────────────────────────────────────────────────
interface LoanTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  loanTypeFieldName: Path<T>; // ✅ configurable, no hardcoded field name
  label: string; // ✅ configurable, no hardcoded label — set by the consuming form
  setValue?: UseFormSetValue<T>; // optional — only needed if you want a default selection
  defaultLoanTypeId?: number; // optional, no default here (unlike BranchNameField)
}

// ── Component ─────────────────────────────────────────────────────────────────
// Reads loanMasterListOptions / fetchLoanMasterList straight from
// ReportFormContext. The actual GET /api/LmtLoanMaseterList call is guarded
// there by loanMasterListFetchedRef, so calling fetchLoanMasterList() here on
// every mount is safe — it's a no-op after the very first successful call,
// exactly like fetchCollectionBranches() is for BranchCollectionField.
export default function LoanTypeField<T extends FieldValues>({
  control,
  loanTypeFieldName,
  label,
  setValue,
  defaultLoanTypeId,
}: LoanTypeFieldProps<T>) {
  const { fetchLoanMasterList, loanMasterListOptions } = useReportFormContext();

  useEffect(() => {
    fetchLoanMasterList();
  }, [fetchLoanMasterList]);

  // ── Set default once options are available (only if requested) ────────────
  useEffect(() => {
    if (!setValue || defaultLoanTypeId === undefined) return;
    if (!loanMasterListOptions?.length) return;

    const match = loanMasterListOptions.find((l) => l.id === defaultLoanTypeId);
    if (match) {
      setValue(loanTypeFieldName, match.id as PathValue<T, Path<T>>, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [loanMasterListOptions, loanTypeFieldName, setValue, defaultLoanTypeId]);

  return (
    <FieldRow label={label}>
      <Box>
        <DropDown
          name={loanTypeFieldName}
          control={control}
          label={label}
          options={loanMasterListOptions}
          fullWidth
        />
      </Box>
    </FieldRow>
  );
}
