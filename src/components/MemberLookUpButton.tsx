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
// import MemberLookUpModal from "@/components/MemberLookUpModal";
// import { useReportForm } from "@/contexts/ReportFormContext";
// import type { MemberRecord } from "@/contexts/ReportFormContext";
// import type { FormInputs } from "@/components/MemberIdCard";

// interface MemberLookupButtonProps {
//   control: Control<FormInputs>;
// }

// export default function MemberLookupButton({
//   control,
// }: MemberLookupButtonProps) {
//   const [modalOpen, setModalOpen] = React.useState(false);

//   const {
//     memberLookUp,
//     totalPages,
//     currentPage,
//     isLoading,
//     error,
//     setSelectedMember,
//     searchmemberLookUp,
//     clearResults,
//   } = useReportForm();

//   // react-hook-form field controllers to set values on member select
//   const { field: memberIdField } = useController({
//     control,
//     name: "memberId",
//   });
//   const { field: memberNameField } = useController({
//     control,
//     name: "memberName",
//   });

//   const handleOpen = () => {
//     searchmemberLookUp({ Page: 1 });
//     setModalOpen(true);
//   };

//   const handleClose = () => {
//     clearResults();
//     setModalOpen(false);
//   };

//   const handleMemberSelect = (member: MemberRecord) => {
//     // Populate form fields
//     memberIdField.onChange(member.memberId);
//     memberNameField.onChange(member.memberName);
//     // Store in context for other consumers
//     setSelectedMember(member);
//     handleClose();
//   };

//   return (
//     <>
//       <Grid container spacing={2} sx={{ mb: 2 }}>
//         {/* Member ID */}
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Box>
//             <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
//               Member ID
//             </Typography>
//             <Box sx={{ display: "flex", gap: 1 }}>
//               <TextInput
//                 control={control}
//                 name="memberId"
//                 placeholder="Enter Member ID"
//                 fullWidth
//               />
//               <IconButton
//                 size="small"
//                 onClick={handleOpen}
//                 sx={{
//                   bgcolor: "#2c6fad",
//                   color: "#fff",
//                   px: 2,
//                   borderRadius: 1,
//                   "&:hover": { bgcolor: "#1a5a96" },
//                 }}
//                 title="Search for member"
//               >
//                 <SearchIcon fontSize="small" />
//               </IconButton>
//             </Box>
//           </Box>
//         </Grid>

//         {/* Member Name */}
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Box>
//             <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
//               Member Name
//             </Typography>
//             <TextInput
//               control={control}
//               name="memberName"
//               placeholder="Enter Member Name"
//               fullWidth
//             />
//           </Box>
//         </Grid>
//       </Grid>

//       <MemberLookUpModal
//         open={modalOpen}
//         onClose={handleClose}
//         onSelect={handleMemberSelect}
//         title="Member Directory"
//         data={memberLookUp} // ✅ data is now provided
//         // pageSize={10}         // optional, default is 10
//       />
//     </>
//   );
// }

"use client";

import React from "react";
import type { Control } from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import { useController } from "react-hook-form";

import TextInput from "@/components/form/TextInput";
import MemberLookUpModal from "@/components/MemberLookUpModal";
import { useReportForm } from "@/contexts/ReportFormContext";
import type { MemberRecord } from "@/contexts/ReportFormContext";
import type { FormInputs } from "@/components/MemberIdCard";

interface MemberLookupButtonProps {
  control: Control<FormInputs>;
}

export default function MemberLookupButton({
  control,
}: MemberLookupButtonProps) {
  const [modalOpen, setModalOpen] = React.useState(false);

  const {
    memberLookUp,
    totalPages,
    currentPage,
    isLoading,
    error,
    setSelectedMember,
    searchmemberLookUp,
    clearResults,
  } = useReportForm();

  const { field: memberIdField } = useController({ control, name: "memberId" });
  const { field: memberNameField } = useController({
    control,
    name: "memberName",
  });

  const handleOpen = () => {
    // ✅ Open modal FIRST so the user sees it immediately,
    //    then trigger the fetch — isLoading will show a spinner inside.
    setModalOpen(true);
    searchmemberLookUp({ Page: 1 });
  };

  const handleClose = () => {
    setModalOpen(false);
    clearResults();
  };

  const handleMemberSelect = (member: MemberRecord) => {
    memberIdField.onChange(member.memberId);
    memberNameField.onChange(member.memberName);
    setSelectedMember(member);
    handleClose();
  };

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Member ID */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Label above — matches label style in the rest of the form */}
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
              control={control}
              name="memberId"
              placeholder="Enter Member ID"
              fullWidth
            />
            <IconButton
              size="small"
              onClick={handleOpen}
              sx={{
                bgcolor: "#2c6fad",
                color: "#fff",
                px: 2,
                borderRadius: 1,
                "&:hover": { bgcolor: "#1a5a96" },
              }}
              title="Search for member"
            >
              <SearchIcon fontSize="small" />
            </IconButton>
          </Box>
        </Grid>

        {/* Member Name */}
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
          <TextInput
            control={control}
            name="memberName"
            placeholder="Enter Member Name"
            fullWidth
          />
        </Grid>
      </Grid>

      <MemberLookUpModal
        open={modalOpen}
        onClose={handleClose}
        onSelect={handleMemberSelect}
        title="Member Directory"
        data={memberLookUp}
      />
    </>
  );
}
