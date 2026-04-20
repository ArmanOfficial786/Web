// "use client";

// import React from "react";
// import type { Control } from "react-hook-form";
// import Box from "@mui/material/Box";
// import Grid from "@mui/material/Grid";
// import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
// import SearchIcon from "@mui/icons-material/Search";
// import { useController } from "react-hook-form";

// import TextInput from "@/components/form/TextInput";
// import MemberLookUpModal from "@/components/reportForm/MemberLookUpModal";
// import { useReportForm } from "@/contexts/ReportFormContext";
// import type { MemberRecord } from "@/contexts/ReportFormContext";
// import type { FormInputs } from "@/components/reports/memberReport/MemberIdCard";

// interface MemberLookupButtonProps {
//   control: Control<FormInputs>;
//   title?: string;
// }

// export default function MemberLookupButton({
//   control,
//   title = "Member Dictory",
// }: MemberLookupButtonProps) {
//   const [modalOpen, setModalOpen] = React.useState(false);

//   const { memberLookUp, setSelectedMember, searchmemberLookUp, clearResults } =
//     useReportForm();

//   const { field: memberIdField } = useController({ control, name: "memberId" });
//   const { field: memberNameField } = useController({
//     control,
//     name: "memberName",
//   });

//   const handleOpen = () => {
//     // ✅ Open modal FIRST so the user sees it immediately,
//     //    then trigger the fetch — isLoading will show a spinner inside.
//     setModalOpen(true);
//     searchmemberLookUp({ Page: 1 });
//   };

//   const handleClose = () => {
//     setModalOpen(false);
//     clearResults();
//   };

//   const handleMemberSelect = (member: MemberRecord) => {
//     memberIdField.onChange(member.memberId);
//     memberNameField.onChange(member.memberName);
//     setSelectedMember(member);
//     handleClose();
//   };

//   return (
//     <>
//       <Grid container spacing={2} sx={{ mb: 2 }}>
//         {/* Member ID */}
//         <Grid size={{ xs: 12, md: 6 }}>
//           {/* Label above — matches label style in the rest of the form */}
//           <Typography
//             sx={{
//               fontSize: 13,
//               fontWeight: 500,
//               color: "text.secondary",
//               mb: 0.5,
//             }}
//           >
//             Member ID
//           </Typography>
//           <Box sx={{ display: "flex", gap: 1 }}>
//             <TextInput
//               control={control}
//               name="memberId"
//               placeholder="Enter Member ID"
//               fullWidth
//             />
//             <IconButton
//               size="small"
//               onClick={handleOpen}
//               sx={{
//                 bgcolor: "#2c6fad",
//                 color: "#fff",
//                 px: 2,
//                 borderRadius: 1,
//                 "&:hover": { bgcolor: "#1a5a96" },
//               }}
//               title="Search for member"
//             >
//               <SearchIcon fontSize="small" />
//             </IconButton>
//           </Box>
//         </Grid>

//         {/* Member Name */}
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Typography
//             sx={{
//               fontSize: 13,
//               fontWeight: 500,
//               color: "text.secondary",
//               mb: 0.5,
//             }}
//           >
//             Member Name
//           </Typography>
//           <TextInput
//             control={control}
//             name="memberName"
//             placeholder="Enter Member Name"
//             fullWidth
//           />
//         </Grid>
//       </Grid>

//       <MemberLookUpModal
//         open={modalOpen}
//         onClose={handleClose}
//         onSelect={handleMemberSelect}
//         title={title}
//         data={memberLookUp}
//       />
//     </>
//   );
// }

"use client";

import React, { useState } from "react";
import type { Control, FieldValues } from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { useController } from "react-hook-form";

import TextInput from "@/components/form/TextInput";
import MemberLookUpModal from "@/components/reportForm/Common/MemberLookUpModal";
import { useReportForm } from "@/contexts/ReportFormContext";
import type { MemberRecord } from "@/contexts/ReportFormContext";

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
    useReportForm();

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
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Member ID — part of request payload */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 500,
              color: "text.secondary",
              mb: 0.5,
            }}
          >
            Member ID
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextInput
              control={control as unknown as Control<FieldValues>}
              name="memberId"
              placeholder="Enter Member ID"
              fullWidth
            />
            <IconButton
              size="small"
              onClick={handleOpen}
              sx={{
                px: 2,
                borderRadius: 1,
              }}
              title="Search for member"
            >
              <SearchIcon fontSize="small" />
            </IconButton>
          </Box>
        </Grid>

        {/* Member Name — display only, never sent to API */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 500,
              color: "text.secondary",
              mb: 0.5,
            }}
          >
            Member Name
          </Typography>
          <TextField
            size="small"
            fullWidth
            placeholder="Member name will appear here"
            value={memberNameField.value ?? ""}
            slotProps={{ input: { readOnly: true } }} // ✅ only set via modal
          />
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
