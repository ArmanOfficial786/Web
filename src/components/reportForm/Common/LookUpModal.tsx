"use client";

import { Close } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import type { FieldValues } from "react-hook-form";
// NOTE: TableWithFilter.tsx lives at components/form/TableWithFilter.tsx,
// while this file is at components/reportForm/Common/LookUpModal.tsx —
// they are NOT in the same folder, so "./TableWithFilter" doesn't resolve.
// Use the "@" alias (already used for TextInput/types imports elsewhere)
// instead of a relative path.
import TableWithFilter from "@/components/form/TableWithFilter";
import type { LookupColumn } from "types/lookup";

export interface LookUpModalProps<
  T extends Record<string, any>,
  TFilter extends FieldValues,
> {
  open: boolean;
  onClose: () => void;
  onSelect: (row: T) => void;
  data: T[];
  columns: LookupColumn<T>[];
  filterDefaults: TFilter;
  rowKey: keyof T;
  pageSize?: number;
  title?: string;
  isLoading?: boolean;
  /** Optional content rendered below the table (e.g. "loading more" status). */
  footer?: React.ReactNode;
}

export default function LookUpModal<
  T extends Record<string, any>,
  TFilter extends FieldValues,
>({
  open,
  onClose,
  onSelect,
  data,
  columns,
  filterDefaults,
  rowKey,
  pageSize = 10,
  title = "Directory",
  isLoading = false,
  footer,
}: LookUpModalProps<T, TFilter>) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const surfaceBg = isDark ? "#1e293b" : "#ffffff";
  const surfaceSunken = isDark ? "#0f172a" : "#f1f5f9";
  const textPrimary = isDark ? "#f1f5f9" : "#111827";
  const textSecondary = isDark ? "#94a3b8" : "#6b7280";
  const divider = isDark ? "#334155" : "#e2e8f0";

  const handleSelect = (row: T) => {
    onSelect(row);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: `${surfaceBg} !important`,
          backgroundImage: "none !important",
          color: textPrimary,
          border: isDark ? `1px solid ${divider}` : "none",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: surfaceBg,
          borderBottom: `1px solid ${divider}`,
          py: 1.5,
          px: 2,
        }}
      >
        <Typography
          variant="h6"
          component="span"
          sx={{ color: textPrimary, fontWeight: 600 }}
        >
          {title}
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: textPrimary }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, backgroundColor: surfaceBg }}>
        <TableWithFilter
          data={data}
          columns={columns}
          filterDefaults={filterDefaults}
          rowKey={rowKey}
          onSelect={handleSelect}
          pageSize={pageSize}
          isLoading={isLoading}
          resetKey={open} // ← resets filters/page every time the modal reopens
        />

        {footer && (
          <Box
            sx={{
              px: 2,
              py: 1,
              backgroundColor: surfaceSunken,
              borderTop: `1px solid ${divider}`,
            }}
          >
            {footer}
          </Box>
        )}

        <Box
          sx={{
            px: 2,
            py: 1.5,
            backgroundColor: surfaceSunken,
            borderTop: `1px solid ${divider}`,
          }}
        >
          <Typography variant="caption" sx={{ color: textSecondary }}>
            © Copyright 2013-2026 Pioneer Associate Pvt.Ltd. All Rights
            Reserved.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
