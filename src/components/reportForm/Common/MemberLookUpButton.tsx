"use client";
import React, { useState } from "react";
import type { Control, FieldValues } from "react-hook-form";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { useController } from "react-hook-form";
import MemberLookUpModal from "@/components/reportForm/Common/MemberLookUpModal";
import { useReportFormContext } from "@/contexts/ReportFormContext";
import type { MemberRecord } from "@/contexts/ReportFormContext";
import FieldRow from "@/utilis/FieldRow";
import IconTextInput from "@/components/form/IconTextInput";

// ── Props ─────────────────────────────────────────────────────────────────────
interface MemberLookupButtonProps<T extends FieldValues> {
  control: Control<T>;
  onMemberSelect?: (member: MemberRecord) => void;
  title?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MemberLookupButton<T extends FieldValues>({
  // ✅ <T> added here
  control,
  onMemberSelect,
  title = "Member Directory",
}: MemberLookupButtonProps<T>) {
  const [modalOpen, setModalOpen] = useState(false);
  const { memberLookUp, setSelectedMember, searchmemberLookUp, clearResults } =
    useReportFormContext();

  const cast = control as unknown as Control<FieldValues>;
  // ✅ both fields cast the same way — memberId goes to API, memberName is UI only
  const { field: memberIdField } = useController({
    control: cast,
    name: "memberId",
  });
  const { field: memberNameField } = useController({
    control: cast,
    name: "memberName",
  });

  const handleOpen = () => {
    setModalOpen(true);
    searchmemberLookUp({ Page: 1 });
  };

  const handleClose = () => {
    setModalOpen(false);
    clearResults();
  };

  const handleMemberSelect = (member: MemberRecord) => {
    memberIdField.onChange(member.memberId); // ✅ goes into payload
    memberNameField.onChange(member.memberName); // ✅ form field — reset() clears it
    setSelectedMember(member);
    onMemberSelect?.(member);
    handleClose();
  };
  return (
    <>
      <Grid container spacing={2} sx={{ mb: 0.5, alignItems: "center" }}>
        {/* Member ID — part of request payload */}
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldRow label="Member ID">
            <IconTextInput
              control={control as unknown as Control<FieldValues>}
              size="small"
              name="memberId"
              placeholder="Enter Member ID"
              fullWidth
              icon={<SearchIcon />}
              onIconClick={handleOpen}
              sx={{
                "& .MuiInputBase-root": {
                  paddingRight: "4px",
                },
              }}
            />
          </FieldRow>
        </Grid>

        {/* Member Name — display only, never sent to API */}
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldRow label="Member Name">
            <TextField
              size="small"
              sx={{ flex: 1, minWidth: "200px" }}
              fullWidth
              placeholder="Member name"
              value={memberNameField.value ?? ""}
              slotProps={{ input: { readOnly: true } }} // ✅ only set via modal
            />
          </FieldRow>
        </Grid>
      </Grid>

      <MemberLookUpModal
        open={modalOpen}
        onClose={handleClose}
        onSelect={handleMemberSelect}
        title={title}
        data={memberLookUp}
      />
    </>
  );
}
