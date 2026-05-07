"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import {
  FirstPage,
  LastPage,
  ChevronLeft,
  ChevronRight,
  Search,
  Print,
  Download,
  PictureAsPdf,
  Article,
  TableChart,
  Image,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useLanguage, type Translations } from "@/contexts/LanguageContext";
import { type ReportFormat } from "@/utilis/Constants/reportConstants";
// ── Types ─────────────────────────────────────────────────────────────────────
// Re-export so existing consumers of ReportNavigation don't break
export type { ReportFormat };

interface DownloadOption {
  format: ReportFormat;
  icon: React.ReactNode;
  color: string;
  labelKey: keyof Translations;
}

const DOWNLOAD_OPTIONS: DownloadOption[] = [
  {
    format: "PDF",
    icon: <PictureAsPdf fontSize="small" />,
    color: "error.main",
    labelKey: "pdf",
  },
  {
    format: "Word",
    icon: <Article fontSize="small" />,
    color: "primary.main",
    labelKey: "word",
  },
  {
    format: "Excel",
    icon: <TableChart fontSize="small" />,
    color: "success.main",
    labelKey: "excel",
  },
  {
    format: "Image",
    icon: <Image fontSize="small" />,
    color: "secondary.main",
    labelKey: "image",
  },
];

interface ReportNavigationProps {
  pdfData: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
  isDownloading?: boolean;
}

// ── NavButton helper ──────────────────────────────────────────────────────────
function NavButton({
  tooltip,
  icon,
  onClick,
  disabled,
}: {
  tooltip: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <Tooltip title={tooltip}>
      <span>
        <IconButton size="small" onClick={onClick} disabled={disabled}>
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
const ReportNavigation: React.FC<ReportNavigationProps> = ({
  pdfData,
  currentPage,
  totalPages,
  onPageChange,
  onDownload,
}) => {
  const { t, interpolate } = useLanguage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchText, setSearchText] = useState("");

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  const menuOpen = Boolean(anchorEl);

  // ── Print ──────────────────────────────────────────────────────────────────
  const handlePrint = () => {
    if (!pdfData) {
      toast.error("No report data available to print");
      return;
    }
    try {
      const win = window.open("", "_blank");
      if (!win) {
        toast.error(
          "Unable to open print window. Please check your popup blocker.",
        );
        return;
      }
      win.document.write(`
        <html>
          <head><title>Print Report</title></head>
          <body style="margin:0;">
            <embed width="100%" height="100%"
              src="data:application/pdf;base64,${pdfData}"
              type="application/pdf" />
          </body>
        </html>
      `);
      win.document.close();
      setTimeout(() => win.print(), 500);
    } catch {
      toast.error("Failed to print report");
    }
  };

  // ── Download ───────────────────────────────────────────────────────────────
  const handleDownload = async (format: ReportFormat) => {
    setAnchorEl(null);
    await onDownload(format);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 40,
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        flexWrap: "wrap",
        gap: 1,
        px: 1,
        displayPrint: "none",
      }}
    >
      {/* Page info */}
      <Typography variant="body2" fontWeight={600} sx={{ px: 1 }}>
        {interpolate(t("pageOf"), {
          currentPage: currentPage.toString(),
          totalPages: totalPages.toString(),
        })}
      </Typography>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          borderRight: 1,
          borderColor: "divider",
          pr: 1,
        }}
      >
        <NavButton
          tooltip="First Page"
          icon={<FirstPage fontSize="small" />}
          onClick={() => onPageChange(1)}
          disabled={!canGoPrev}
        />
        <NavButton
          tooltip="Previous Page"
          icon={<ChevronLeft fontSize="small" />}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrev}
        />
        <NavButton
          tooltip="Next Page"
          icon={<ChevronRight fontSize="small" />}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
        />
        <NavButton
          tooltip="Last Page"
          icon={<LastPage fontSize="small" />}
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext}
        />
      </Box>

      {/* Search */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderRight: 1,
          borderColor: "divider",
          pr: 1,
        }}
      >
        <OutlinedInput
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            searchText.trim() &&
            toast.info("Search functionality coming soon")
          }
          placeholder={t("search")}
          sx={{ height: 28, fontSize: 13, width: 180 }}
          endAdornment={
            <InputAdornment position="end">
              <Search sx={{ fontSize: 16, color: "text.disabled" }} />
            </InputAdornment>
          }
        />
        {(["find", "next"] as const).map((key) => (
          <Button
            key={key}
            size="small"
            variant="text"
            disabled={!searchText.trim()}
            onClick={() => toast.info("Search functionality coming soon")}
            sx={{ minWidth: "unset", fontWeight: 600, fontSize: 12 }}
          >
            {t(key)}
          </Button>
        ))}
      </Box>

      {/* Print + Download */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Tooltip title={t("print")}>
          <span>
            <Button
              size="small"
              variant="text"
              startIcon={<Print fontSize="small" />}
              disabled={!pdfData}
              onClick={handlePrint}
              sx={{ fontWeight: 600, fontSize: 12 }}
            >
              {t("print")}
            </Button>
          </span>
        </Tooltip>

        <Tooltip title="Download">
          <span>
            <IconButton
              size="small"
              disabled={!pdfData}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              aria-controls={menuOpen ? "download-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <Download fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Menu
          id="download-menu"
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: { elevation: 3, sx: { width: 160, borderRadius: 2 } },
          }}
        >
          {DOWNLOAD_OPTIONS.map(({ format, icon, color, labelKey }) => (
            <MenuItem key={format} onClick={() => handleDownload(format)}>
              <ListItemIcon sx={{ color }}>{icon}</ListItemIcon>
              <ListItemText primaryTypographyProps={{ fontSize: 13 }}>
                {t(labelKey)}
              </ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};

export default ReportNavigation;
