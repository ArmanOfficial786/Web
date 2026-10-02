







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

  mode?: CollectionCenterBindMode;
  addressFieldName?: Path<T>;
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
