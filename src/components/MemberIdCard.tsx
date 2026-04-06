

"use client";

import React from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
} from "react-hook-form";
import { RefreshCw } from "lucide-react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import TextInput from "@/components/form/TextInput";
import DateInput from "@/components/form/DateInput";
import DropDown from "@/components/form/DropDown";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/ReportNavigation";
import PdfSlideViewer from "./PdfSlideViewer";

// ── Shared types ──────────────────────────────────────────────────────────────
export type { ReportFormat };

export interface FormInputs {
  memberId: string;
  memberName: string;
  fromDate: string;
  tillDate: string;
  branchId: number | string;
  groupId: number | string;
  orderBy: number | string;
}

export interface ReportState {
  currentPage: number;
  totalPages: number;
  totalRecord: number;
  pageSize: number;
  loading: boolean;
  reportLoaded: boolean;
  error: string;
  pdfData: string;
}

export type SelectOption = { id: number; name: string };

// ── Props ─────────────────────────────────────────────────────────────────────
interface MemberIdCardProps {
  control: Control<FormInputs>;
  handleSubmit: UseFormHandleSubmit<FormInputs>;
  onSubmit: SubmitHandler<FormInputs>;
  branchOptions?: SelectOption[];
  groupOptions?: SelectOption[];
  orderOptions?: SelectOption[];
  reportState: ReportState;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  isDownloading?: boolean;
  emptyText: string;
}

// ── FieldRow ──────────────────────────────────────────────────────────────────
function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minHeight: 40 }}>
      <Typography
        sx={{
          width: 110,
          flexShrink: 0,
          fontSize: 13,
          fontWeight: 500,
          color: "text.secondary",
        }}
      >
        {label}
      </Typography>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );
}

const DEFAULT_OPTIONS: SelectOption[] = [{ id: 0, name: "-- Select --" }];

// ── Component ─────────────────────────────────────────────────────────────────
function MemberIdCard({
  control,
  handleSubmit,
  onSubmit,
  branchOptions = DEFAULT_OPTIONS,
  groupOptions = DEFAULT_OPTIONS,
  orderOptions = DEFAULT_OPTIONS,
  reportState,
  onPageChange,
  onDownload,
  isDownloading = false,
  emptyText,
}: MemberIdCardProps) {
  const { loading, reportLoaded, error, pdfData, currentPage, totalPages } =
    reportState;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* ── FILTER FORM ──────────────────────────────────────────────── */}
      <Paper variant="outlined" sx={{ p: 1.5 }}>
        <Typography
          variant="h6"
          sx={{ color: "primary.main", fontWeight: 600, fontSize: 16, mb: 1 }}
        >
          Create Member ID Card
        </Typography>
        <Divider sx={{ mb: 1.5 }} />

        {/* Row 1 — Member Id | Member Name */}
        <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldRow label="Member Id">
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <TextInput
                  name="memberId"
                  control={control}
                  size="small"
                  placeholder="Member Id"
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 36, fontWeight: 700, px: 1 }}
                >
                  MD
                </Button>
              </Box>
            </FieldRow>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldRow label="Member Name">
              <TextInput
                name="memberName"
                control={control}
                size="small"
                placeholder="Member Name"
                fullWidth
              />
            </FieldRow>
          </Grid>
        </Grid>
        <Divider sx={{ mb: 1.5 }} />

        {/* Row 2 — From Date | Till Date */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldRow label="From Date">
              <DateInput name="fromDate" control={control} dateType="BS" />
            </FieldRow>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldRow label="Till Date">
              <DateInput name="tillDate" control={control} dateType="BS" />
            </FieldRow>
          </Grid>
        </Grid>
        <Divider sx={{ mb: 1.5 }} />

        {/* Row 3 — Branch | Group */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
          {[
            {
              label: "Branch Name",
              name: "branchId" as const,
              options: branchOptions,
            },
            {
              label: "Select Group",
              name: "groupId" as const,
              options: groupOptions,
            },
          ].map(({ label, name, options }) => (
            <Grid key={name} size={{ xs: 12, md: 6 }}>
              <FieldRow label={label}>
                <DropDown
                  name={name}
                  control={control}
                  label={label}
                  options={options}
                  fullWidth
                />
              </FieldRow>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ mb: 1.5 }} />

        {/* Row 4 — Order By | View Report */}
        <Grid container spacing={1} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldRow label="Order by">
              <DropDown
                name="orderBy"
                control={control}
                label="Order by"
                options={orderOptions}
                fullWidth
              />
            </FieldRow>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button
              variant="contained"
              size="small"
              disabled={loading}
              onClick={handleSubmit(onSubmit)}
              sx={{ whiteSpace: "nowrap", height: 36 }}
            >
              {loading ? "Loading..." : "View Report"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* ── NAVIGATION ───────────────────────────────────────────────── */}
      {reportLoaded && (
        <ReportNavigation
          pdfData={pdfData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onDownload={onDownload}
          isDownloading={isDownloading}
        />
      )}

      {/* ── REPORT AREA ──────────────────────────────────────────────── */}
      <Box sx={{ width: "100%", overflow: "auto", height: "100vh" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <RefreshCw className="animate-spin text-blue-500" size={48} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : reportLoaded && pdfData ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <PdfSlideViewer
              base64Pdf={pdfData}
              pageNumber={currentPage}
              onTotalPagesChange={(_pages: number) => {}}
              onLoadError={(_err: string) => {}}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography color="text.secondary">{emptyText}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default MemberIdCard;
