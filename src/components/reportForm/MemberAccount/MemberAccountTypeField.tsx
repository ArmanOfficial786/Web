// components/reportForm/MemberAccount/MemberAccountTypeField.tsx
"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import Box from "@mui/material/Box";
import FieldRow from "@/utilis/FieldRow";
import DropDown from "@/components/form/DropDown";

// ⚠️ ASSUMPTION: no source table/list was given for these options — confirm
// the actual `typeId` codes/labels against the backend before using.
const memberAccountTypeOptions = [
  { id: "-1", name: "All" },
  { id: "1", name: "1 Year Normal Saving" },
  { id: "2", name: "2 Year Normal Saving" },
];

interface MemberAccountTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
}

export default function MemberAccountTypeField<T extends FieldValues>({
  control,
  name,
  label = "Type",
}: MemberAccountTypeFieldProps<T>) {
  return (
    <FieldRow label={label}>
      <Box sx={{ width: "100%" }}>
        <DropDown
          name={name}
          control={control}
          label={label}
          options={memberAccountTypeOptions}
          fullWidth
        />
      </Box>
    </FieldRow>
  );
}
