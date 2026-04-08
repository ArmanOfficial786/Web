// "use client";

// import React from "react";
// import type { Control, FieldValues } from "react-hook-form";
// import Box from "@mui/material/Box";
// import Grid from "@mui/material/Grid";
// import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
// import SearchIcon from "@mui/icons-material/Search";
// import TextInput from "@/components/form/TextInput";
// import MemberLookUpModal from "@/components/MemberLookUpModal";
// import type { MemberRecord } from "@/components/MemberLookUpModal";

// interface MemberLookupButtonProps<T extends FieldValues> {
//   control: Control<T>;
//   onSelect: (member: MemberRecord) => void;
//   memberData?: MemberRecord[];
// }

// function MemberLookupButton<T extends FieldValues>({
//   control,
//   onSelect,
//   memberData = [],
// }: MemberLookupButtonProps<T>) {
//   const [modalOpen, setModalOpen] = React.useState(false);

//   const handleModalClose = () => {
//     setModalOpen(false);
//   };

//   const handleMemberSelect = (member: MemberRecord) => {
//     onSelect(member);
//     handleModalClose();
//   };

//   return (
//     <>
//       {/* Row 1 — Member Id | Member Name */}
//       <Grid container spacing={2} sx={{ mb: 2 }}>
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Box sx={{ mb: 2 }}>
//             <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
//               Member ID
//             </Typography>
//             <Box sx={{ display: "flex", gap: 1 }}>
//               <Box sx={{ flex: 1 }}>
//                 <TextInput
//                   control={control}
//                   name="memberId"
//                   placeholder="Enter Member ID"
//                   fullWidth
//                 />
//               </Box>
//               <IconButton
//                 size="small"
//                 onClick={() => setModalOpen(true)}
//                 sx={{
//                   bgcolor: "#2c6fad",
//                   color: "#fff",
//                   px: 2,
//                   "&:hover": {
//                     bgcolor: "#1a5a96",
//                   },
//                 }}
//                 title="Search for member"
//               >
//                 <SearchIcon fontSize="small" />
//               </IconButton>
//             </Box>
//           </Box>
//         </Grid>
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Box sx={{ mb: 2 }}>
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
//         onClose={handleModalClose}
//         onSelect={handleMemberSelect}
//         data={memberData}
//         title="Member Directory"
//       />
//     </>
//   );
// }

// export default MemberLookupButton;

// "use client";

// import React from "react";
// import type { Control } from "react-hook-form";
// import Box from "@mui/material/Box";
// import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
// import SearchIcon from "@mui/icons-material/Search";
// import TextInput from "@/components/form/TextInput";
// import MemberLookUpModal from "./MemberLookUpModal";
// import { useReportForm } from "@/contexts/ReportFormContext";
// import type { MemberRecord } from "@/contexts/ReportFormContext";
// import type { FormInputs } from "@/components/MemberIdCard";

// interface MemberLookupButtonProps {
//   control: Control<FormInputs>;
// }

// export default function MemberLookupButton({
//   control,
// }: MemberLookupButtonProps) {
//   const { setSelectedMember } = useReportForm();
//   const [modalOpen, setModalOpen] = React.useState(false);

//   const handleMemberSelect = (member: MemberRecord) => {
//     setSelectedMember(member);
//     setModalOpen(false);
//   };

//   return (
//     <>
//       <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
//         {/* Member ID Section */}
//         <Box sx={{ flex: 1 }}>
//           <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
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
//               onClick={() => setModalOpen(true)}
//               sx={{ bgcolor: "#2c6fad", color: "#fff" }}
//             >
//               <SearchIcon />
//             </IconButton>
//           </Box>
//         </Box>

//         {/* Member Name Section */}
//         <Box sx={{ flex: 1 }}>
//           <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
//             Member Name
//           </Typography>

//           <TextInput
//             control={control}
//             name="memberName"
//             placeholder="Enter Member Name"
//             fullWidth
//           />
//         </Box>
//       </Box>

//       {/* Modal */}
//       <MemberLookUpModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSelect={handleMemberSelect}
//       />
//     </>
//   );
// }

// "use client";

// import React from "react";
// import type { Control } from "react-hook-form";
// import Box from "@mui/material/Box";
// import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
// import SearchIcon from "@mui/icons-material/Search";

// import TextInput from "@/components/form/TextInput";
// import MemberLookUpModal from "./MemberLookUpModal";
// import { useReportForm } from "@/contexts/ReportFormContext";
// import type { MemberRecord } from "@/contexts/ReportFormContext";
// import type { FormInputs } from "@/components/MemberIdCard"; // ← import the exact type

// interface MemberLookupButtonProps {
//   control: Control<FormInputs>; // ← was Control<any> — that caused the TS error
// }

// export default function MemberLookupButton({
//   control,
// }: MemberLookupButtonProps) {
//   const { setSelectedMember } = useReportForm();
//   const [modalOpen, setModalOpen] = React.useState(false);

//   const handleMemberSelect = (member: MemberRecord) => {
//     setSelectedMember(member);
//     setModalOpen(false);
//   };

//   return (
//     <>
//       <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
//         {/* Member ID */}
//         <Box sx={{ flex: 1 }}>
//           <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
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
//               onClick={() => setModalOpen(true)}
//               sx={{ bgcolor: "#2c6fad", color: "#fff", borderRadius: 1 }}
//             >
//               <SearchIcon />
//             </IconButton>
//           </Box>
//         </Box>

//         {/* Member Name */}
//         <Box sx={{ flex: 1 }}>
//           <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
//             Member Name
//           </Typography>
//           <TextInput
//             control={control}
//             name="memberName"
//             placeholder="Enter Member Name"
//             fullWidth
//           />
//         </Box>
//       </Box>

//       <MemberLookUpModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSelect={handleMemberSelect}
//       />
//     </>
//   );
//}

// "use client";

// import React from "react";
// import type { Control, FieldValues } from "react-hook-form";
// import Box from "@mui/material/Box";
// import Grid from "@mui/material/Grid";
// import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
// import SearchIcon from "@mui/icons-material/Search";
// import TextInput from "@/components/form/TextInput";
// import MemberLookUpModal, {
//   type MemberRecord,
// } from "@/components/MemberLookUpModal";

// interface MemberLookupButtonProps<T extends FieldValues> {
//   control: Control<T>;
//   onSelect: (member: MemberRecord) => void;
//   memberData?: MemberRecord[];
// }

// function MemberLookupButton<T extends FieldValues>({
//   control,
//   onSelect,
//   memberData = [],
// }: MemberLookupButtonProps<T>) {
//   const [modalOpen, setModalOpen] = React.useState(false);

//   const handleModalClose = () => {
//     setModalOpen(false);
//   };

//   const handleMemberSelect = (member: MemberRecord) => {
//     onSelect(member);
//     handleModalClose();
//   };

//   return (
//     <>
//       {/* Row: Member ID & Member Name */}
//       <Grid container spacing={2} sx={{ mb: 2 }}>
//         {/* Member ID */}
//         <Grid item xs={12} md={6}>
//           <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
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
//               onClick={() => setModalOpen(true)}
//               sx={{
//                 bgcolor: "#2c6fad",
//                 color: "#fff",
//                 px: 1.5,
//                 borderRadius: 1,
//                 "&:hover": {
//                   bgcolor: "#1a5a96",
//                 },
//               }}
//               title="Search Member"
//             >
//               <SearchIcon />
//             </IconButton>
//           </Box>
//         </Grid>

//         {/* Member Name */}
//         <Grid item xs={12} md={6}>
//           <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
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

//       {/* Modal */}
//       <MemberLookUpModal
//         open={modalOpen}
//         onClose={handleModalClose}
//         onSelect={handleMemberSelect}
//         data={memberData}
//         title="Member Directory"
//       />
//     </>
//   );
// }

// export default MemberLookupButton;
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

  // react-hook-form field controllers to set values on member select
  const { field: memberIdField } = useController({
    control,
    name: "memberId",
  });
  const { field: memberNameField } = useController({
    control,
    name: "memberName",
  });

  const handleOpen = () => {
    searchmemberLookUp({ Page: 1 });
    setModalOpen(true);
  };

  const handleClose = () => {
    clearResults();
    setModalOpen(false);
  };

  const handleMemberSelect = (member: MemberRecord) => {
    // Populate form fields
    memberIdField.onChange(member.memberId);
    memberNameField.onChange(member.memberName);
    // Store in context for other consumers
    setSelectedMember(member);
    handleClose();
  };

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Member ID */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
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
          </Box>
        </Grid>

        {/* Member Name */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Member Name
            </Typography>
            <TextInput
              control={control}
              name="memberName"
              placeholder="Enter Member Name"
              fullWidth
            />
          </Box>
        </Grid>
      </Grid>

      <MemberLookUpModal
        open={modalOpen}
        onClose={handleClose}
        onSelect={handleMemberSelect}
        title="Member Directory"
        data={memberLookUp} // ✅ data is now provided
        // pageSize={10}         // optional, default is 10
      />
    </>
  );
}
