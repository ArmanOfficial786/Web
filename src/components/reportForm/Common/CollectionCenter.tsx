// "use client";

// import DropDown from "@/components/form/DropDown";
// import { useReportFormContext } from "@/contexts/ReportFormContext";
// import FieldRow from "@/utilis/FieldRow";
// import { Box } from "@mui/system";
// import { useEffect } from "react";
// import {
//   useWatch,
//   type Control,
//   type FieldValues,
//   type Path,
//   type UseFormSetValue,
// } from "react-hook-form";

// // ── Props ─────────────────────────────────────────────────────────────────────
// interface CollectionCenterFieldProps<T extends FieldValues> {
//   control: Control<T>;
//   setValue: UseFormSetValue<T>;
//   branchFieldName: Path<T>;
//   collectionCenterFieldName: Path<T>;
// }

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function CollectionCenterField<T extends FieldValues>({
//   control,
//   setValue,
//   branchFieldName,
//   collectionCenterFieldName,
// }: CollectionCenterFieldProps<T>) {
//   const { fetchCollectionCenters, collectionCenterOptions } =
//     useReportFormContext();

//   // ✅ cast to unknown first, then to a safe primitive type
//   const rawBranchId = useWatch({ control, name: branchFieldName });
//   const selectedBranchId = rawBranchId as number | string | undefined;

//   useEffect(() => {
//     const id = Number(selectedBranchId ?? -1); // ← guaranteed number, never NaN
//     setValue(collectionCenterFieldName, -1 as any); // reset collection center when branch changes
//     if (!id || id === -1) {
//       // don't bother fetching — reset is enough
//       return;
//     }

//     fetchCollectionCenters(id);
//   }, [
//     selectedBranchId,
//     fetchCollectionCenters,
//     setValue,
//     collectionCenterFieldName,
//   ]);

//   return (
//     <FieldRow label="Collection Center">
//       <Box>
//         <DropDown
//           name={collectionCenterFieldName}
//           control={control}
//           label="Collection Center"
//           options={collectionCenterOptions}
//           fullWidth
//         />
//       </Box>
//     </FieldRow>
//   );
// }

"use client";

import DropDown from "@/components/form/DropDown";
import TextInput from "@/components/form/TextInput";
import {
  CollectionCenterOption,
  useReportFormContext,
} from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
import { Box } from "@mui/material";
import { useEffect } from "react";
import {
  useWatch,
  type Control,
  type FieldValues,
  type Path,
  type UseFormSetValue,
} from "react-hook-form";

// ── Mode controls which readonly field(s) render ────────────────────────────
// undefined / "none" -> no extra fields
// "both"             -> Address + MeetingDateTimeBs
// "address"          -> Address only
// "meetingDateTime"  -> MeetingDateTimeBs only
export type CollectionCenterBindMode =
  | "none"
  | "both"
  | "address"
  | "meetingDateTime";

interface CollectionCenterFieldProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  branchFieldName: Path<T>;
  collectionCenterFieldName: Path<T>;

  // NEW — optional/nullable: omit or pass "none" to disable entirely
  mode?: CollectionCenterBindMode;
  // required only when mode is "both" | "address"
  addressFieldName?: Path<T>;
  // required only when mode is "both" | "meetingDateTime"
  meetingDateTimeFieldName?: Path<T>;
}

export default function CollectionCenterField<T extends FieldValues>({
  control,
  setValue,
  branchFieldName,
  collectionCenterFieldName,
  mode = "none",
  addressFieldName,
  meetingDateTimeFieldName,
}: CollectionCenterFieldProps<T>) {
  const { fetchCollectionCenters, collectionCenterOptions } =
    useReportFormContext();

  const rawBranchId = useWatch({ control, name: branchFieldName });
  const selectedBranchId = rawBranchId as number | string | undefined;

  const rawCollectionCenterId = useWatch({
    control,
    name: collectionCenterFieldName,
  });
  const selectedCollectionCenterId = rawCollectionCenterId as
    | number
    | string
    | undefined;

  const showAddress = mode === "both" || mode === "address";
  const showMeetingDateTime = mode === "both" || mode === "meetingDateTime";

  // Reset collection center (and dependent fields) whenever branch changes
  useEffect(() => {
    const id = Number(selectedBranchId ?? -1);
    setValue(collectionCenterFieldName, -1 as any);

    if (showAddress && addressFieldName) {
      setValue(addressFieldName, "" as any);
    }
    if (showMeetingDateTime && meetingDateTimeFieldName) {
      setValue(meetingDateTimeFieldName, "" as any);
    }

    if (!id || id === -1) return;
    fetchCollectionCenters(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranchId]);

  // Bind address / meetingDateTimeBs whenever the selected center changes
  useEffect(() => {
    if (mode === "none") return;

    const id = Number(selectedCollectionCenterId ?? -1);

    if (!id || id === -1) {
      if (showAddress && addressFieldName)
        setValue(addressFieldName, "" as any);
      if (showMeetingDateTime && meetingDateTimeFieldName)
        setValue(meetingDateTimeFieldName, "" as any);
      return;
    }

    const selected = (collectionCenterOptions as CollectionCenterOption[]).find(
      (c) => Number(c.id) === id,
    );

    if (showAddress && addressFieldName) {
      setValue(addressFieldName, (selected?.address ?? "") as any);
    }
    if (showMeetingDateTime && meetingDateTimeFieldName) {
      setValue(
        meetingDateTimeFieldName,
        (selected?.meetingDateTimeBs ?? "") as any,
      );
    }
  }, [
    selectedCollectionCenterId,
    collectionCenterOptions,
    mode,
    showAddress,
    showMeetingDateTime,
    addressFieldName,
    meetingDateTimeFieldName,
    setValue,
  ]);

  return (
    <>
      <FieldRow label="Collection Center">
        <Box>
          <DropDown
            name={collectionCenterFieldName}
            control={control}
            label="Collection Center"
            options={collectionCenterOptions}
            fullWidth
          />
        </Box>
      </FieldRow>

      {showAddress && addressFieldName && (
        <FieldRow label="Address">
          <Box>
            <TextInput
              name={addressFieldName}
              control={control}
              fullWidth
              disabled
            />
          </Box>
        </FieldRow>
      )}

      {showMeetingDateTime && meetingDateTimeFieldName && (
        <FieldRow label="MeetingDateTime">
          <Box>
            <TextInput
              name={meetingDateTimeFieldName}
              control={control}
              fullWidth
              disabled
            />
          </Box>
        </FieldRow>
      )}
    </>
  );
}
