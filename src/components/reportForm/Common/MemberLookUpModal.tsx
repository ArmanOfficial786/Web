"use client";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Chip,
  Tooltip,
  alpha,
  useTheme,
} from "@mui/material";
import { Close, FirstPage, LastPage } from "@mui/icons-material";

import TextInput from "@/components/form/TextInput";
import type { MemberRecord } from "@/contexts/ReportFormContext";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface MemberFilterFields {
  centerName: string;
  centerCode: string;
  groupName: string;
  groupCode: string;
  officeName: string;
  memberId: string;
  memberName: string;
  gender: string;
  temporaryAddress: string;
  mobileNo: string;
}

export interface MemberLookupModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (member: MemberRecord) => void;
  data: MemberRecord[];
  pageSize?: number;
  title?: string;
}

// ── Column definitions ────────────────────────────────────────────────────────
const COLUMNS: {
  key: keyof MemberRecord | "#";
  label: string;
  filterKey?: keyof MemberFilterFields;
  width: number | string;
}[] = [
  { key: "#", label: "#", width: 50 },
  {
    key: "centerName",
    label: "Center Name",
    filterKey: "centerName",
    width: 160,
  },
  {
    key: "centerCode",
    label: "CenterCode",
    filterKey: "centerCode",
    width: 100,
  },
  { key: "groupName", label: "Group Name", filterKey: "groupName", width: 160 },
  { key: "groupCode", label: "GroupCode", filterKey: "groupCode", width: 100 },
  {
    key: "officeName",
    label: "Office Name",
    filterKey: "officeName",
    width: 140,
  },
  { key: "memberId", label: "Member Id", filterKey: "memberId", width: 110 },
  {
    key: "memberName",
    label: "Member Name",
    filterKey: "memberName",
    width: 150,
  },
  { key: "gender", label: "Gender", filterKey: "gender", width: 90 },
  {
    key: "temporaryAddress",
    label: "Temporary Address",
    filterKey: "temporaryAddress",
    width: 150,
  },
  { key: "mobileNo", label: "Mobile No", filterKey: "mobileNo", width: 120 },
];

const FILTER_DEFAULTS: MemberFilterFields = {
  centerName: "",
  centerCode: "",
  groupName: "",
  groupCode: "",
  officeName: "",
  memberId: "",
  memberName: "",
  gender: "",
  temporaryAddress: "",
  mobileNo: "",
};

const filterInputSx = {
  width: "100%",
  "& .MuiInputBase-root": { fontSize: 11, height: 24, bgcolor: "#fff" },
  "& .MuiOutlinedInput-input": { py: 0, px: 0.75 },
  "& .MuiFormHelperText-root": { display: "none" },
};

const cellSx = {
  fontSize: 12,
  py: 0.6,
  px: 1,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  borderRight: "1px solid #f0f0f0",
};

export default function MemberLookUpModal({
  open,
  onClose,
  onSelect,
  data,
  pageSize = 10,
  title = "Member Directory",
}: MemberLookupModalProps) {
  const theme = useTheme();

  useEffect(() => {
    if (open) {
      //console.log("MemberLookUpModal received data:", data);
    }
  }, [open, data]);

  const { control, reset } = useForm<MemberFilterFields>({
    defaultValues: FILTER_DEFAULTS,
  });

  const filters = useWatch({ control });
  const [page, setPage] = React.useState(1);

  // Reset filters + page when modal opens
  useEffect(() => {
    if (open) {
      reset(FILTER_DEFAULTS);
      setPage(1);
    }
  }, [open, reset]);

  const filtersKey = JSON.stringify(filters);
  useEffect(() => {
    setPage(1);
  }, [filtersKey]);

  // Client-side filtering
  const filtered = data.filter((row) =>
    (Object.keys(FILTER_DEFAULTS) as (keyof MemberFilterFields)[]).every(
      (key) => {
        const val = (filters[key] as string) ?? "";
        return val
          ? String(row[key]).toLowerCase().includes(val.toLowerCase())
          : true;
      },
    ),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSelect = (member: MemberRecord) => {
    onSelect(member);
    onClose();
  };

  const headerBg = "#2c4a7a";
  const headerText = "#fff";
  const altRowBg = alpha(theme.palette.primary.main, 0.06);
  const hoverRowBg = alpha(theme.palette.primary.main, 0.14);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* ✅ FIX: component="span" prevents the invalid <h2> > <h6> nesting */}
        <Typography variant="h6" component="span">
          {title}
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Pagination info bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            bgcolor: "#f5f5f5",
          }}
        >
          <Typography variant="body2">
            Page {page} / {totalPages} ({filtered.length} items)
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="First page">
              <IconButton size="small" onClick={() => setPage(1)}>
                <FirstPage />
              </IconButton>
            </Tooltip>
            <Pagination
              page={page}
              count={totalPages}
              onChange={(_, v) => setPage(v)}
              size="small"
              siblingCount={2}
              boundaryCount={1}
              sx={{
                "& .MuiPaginationItem-root": {
                  minWidth: 28,
                  height: 28,
                  fontSize: 12,
                },
              }}
            />
            <Tooltip title="Last page">
              <IconButton size="small" onClick={() => setPage(totalPages)}>
                <LastPage />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Group-by hint */}
        <Box
          sx={{ p: 1, bgcolor: "#f9f9f9", borderBottom: "1px solid #e0e0e0" }}
        >
          <Typography variant="caption" sx={{ color: "#666" }}>
            Drag a column header here to group by that column
          </Typography>
        </Box>

        {/* Table container with horizontal scrolling */}
        <TableContainer
          component={Paper}
          sx={{ maxHeight: 500, overflowX: "auto" }}
        >
          <Table stickyHeader>
            <TableHead>
              {/* Column headers row */}
              <TableRow sx={{ bgcolor: headerBg }}>
                {COLUMNS.map((col) => (
                  <TableCell
                    key={col.key}
                    sx={{
                      ...cellSx,
                      width: col.width,
                      bgcolor: headerBg,
                      color: headerText,
                      fontWeight: 600,
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
                <TableCell
                  sx={{
                    ...cellSx,
                    width: 80,
                    bgcolor: headerBg,
                    color: headerText,
                    fontWeight: 600,
                    position: "sticky",
                    right: 0,
                    zIndex: 2,
                  }}
                >
                  Action
                </TableCell>
              </TableRow>

              {/* Filter row */}
              <TableRow
                sx={{ bgcolor: "#fafafa", borderBottom: "2px solid #e0e0e0" }}
              >
                <TableCell sx={{ ...cellSx, width: 50 }} />
                {COLUMNS.slice(1).map((col) => (
                  <TableCell
                    key={col.key}
                    sx={{ ...cellSx, width: col.width, p: 0.5 }}
                  >
                    {col.filterKey ? (
                      <TextInput
                        control={control}
                        name={col.filterKey}
                        placeholder={col.label}
                        sx={filterInputSx}
                      />
                    ) : null}
                  </TableCell>
                ))}
                <TableCell sx={{ ...cellSx, width: 80 }} />
              </TableRow>
            </TableHead>

            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={COLUMNS.length + 1}
                    sx={{ textAlign: "center", py: 4 }}
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((row, idx) => {
                  const rowNumber = (page - 1) * pageSize + idx + 1;
                  const isAlt = idx % 2 === 1;
                  return (
                    <TableRow
                      key={row.memMemberRegistrationId}
                      sx={{
                        bgcolor: isAlt ? altRowBg : "#fff",
                        "&:hover": { bgcolor: hoverRowBg },
                      }}
                    >
                      <TableCell sx={cellSx}>{rowNumber}</TableCell>
                      <TableCell sx={cellSx}>{row.centerName}</TableCell>
                      <TableCell sx={cellSx}>{row.centerCode}</TableCell>
                      <TableCell sx={cellSx}>{row.groupName}</TableCell>
                      <TableCell sx={cellSx}>{row.groupCode}</TableCell>
                      <TableCell sx={cellSx}>{row.officeName}</TableCell>
                      <TableCell sx={cellSx}>{row.memberId}</TableCell>
                      <TableCell sx={cellSx}>{row.memberName}</TableCell>
                      <TableCell sx={cellSx}>
                        <Chip label={row.gender} size="small" />
                      </TableCell>
                      <TableCell sx={cellSx}>{row.temporaryAddress}</TableCell>
                      <TableCell sx={cellSx}>{row.mobileNo}</TableCell>
                      <TableCell
                        sx={{
                          ...cellSx,
                          width: 80,
                          position: "sticky",
                          right: 0,
                          bgcolor: isAlt ? altRowBg : "#fff",
                          zIndex: 1,
                        }}
                      >
                        <Box
                          onClick={() => handleSelect(row)}
                          sx={{
                            display: "inline-block",
                            px: 1.25,
                            py: 0.25,
                            bgcolor: "#2c6fad",
                            color: "#fff",
                            borderRadius: 0.75,
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                            userSelect: "none",
                            transition: "background 0.15s",
                            textAlign: "center",
                            "&:hover": { bgcolor: "#1a5a96" },
                          }}
                        >
                          Select
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
        <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderTop: "1px solid #e0e0e0" }}>
          <Typography variant="caption">
            © Copyright 2013-2026 Pioneer Associate Pvt.Ltd. All Rights
            Reserved.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
