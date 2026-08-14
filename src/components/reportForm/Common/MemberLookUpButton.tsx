"use client";
import React from "react";
import type { Control, FieldValues } from "react-hook-form";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import { createMemberLookupConfig } from "@/config/MemberLookupConfig";
import type { MemberLookUpDtos } from "types/api/api";

type MemberRecord = MemberLookUpDtos;

// ── Props ─────────────────────────────────────────────────────────────────────
interface MemberLookupButtonProps<T extends FieldValues> {
  control: Control<T>;
  setValue: any; // UseFormSetValue<T>
  onMemberSelect?: (member: MemberRecord) => void;
  title?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MemberLookupButton<T extends FieldValues>({
  control,
  setValue,
  onMemberSelect,
  title = "Member Directory",
}: MemberLookupButtonProps<T>) {
  const config = React.useMemo(() => {
    const cfg = createMemberLookupConfig<T>();
    return {
      ...cfg,
      title,
    };
  }, [title]);

  return (
    <EntityLookupField
      control={control}
      setValue={setValue}
      config={config}
      onSelect={(member: MemberRecord) => {
        onMemberSelect?.(member);
      }}
    />
  );
}
