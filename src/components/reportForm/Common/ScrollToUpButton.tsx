// components/reportForm/Common/ScrollToFirstPageButton.tsx
"use client";

import React from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { alpha } from "@mui/material/styles";
import ArrowUpwardSharpIcon from "@mui/icons-material/ArrowUpwardSharp";
import ArrowDownwardSharpIcon from "@mui/icons-material/ArrowDownwardSharp";

interface ScrollToFirstPageButtonProps {
  /** Called when the button is clicked */
  onClick: () => void;
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total pages */
  totalPages: number;
  /** Hide the button when there's only 1 page */
  hideWhenSinglePage?: boolean;
  tooltipUp?: string;
  tooltipDown?: string;
}

function ScrollToFirstPageButton({
  onClick,
  currentPage,
  totalPages,
  hideWhenSinglePage = true,
  tooltipUp = "Go to first page",
  tooltipDown = "Go to last page",
}: ScrollToFirstPageButtonProps) {
  // Hide button if only 1 page exists
  if (hideWhenSinglePage && totalPages <= 1) return null;

  const isFirstPage = currentPage <= 1;

  // If on first page and there's only one page, don't show
  if (isFirstPage && totalPages <= 1) return null;

  // Determine which icon and tooltip to show
  const icon = isFirstPage ? (
    <ArrowDownwardSharpIcon />
  ) : (
    <ArrowUpwardSharpIcon />
  );
  const tooltip = isFirstPage ? tooltipDown : tooltipUp;
  const ariaLabel = isFirstPage ? "Go to last page" : "Go to first page";

  // The action: if on first page, go to last; otherwise go to first
  const handleClick = () => {
    if (isFirstPage) {
      // Go to last page
      onClick(); // This should trigger onPageChange(totalPages)
    } else {
      // Go to first page
      onClick(); // This should trigger onPageChange(1)
    }
  };

  return (
    <Tooltip title={tooltip}>
      <IconButton
        onClick={handleClick}
        aria-label={ariaLabel}
        size="medium"
        sx={(t) => {
          // t.vars is typed optional on Theme, but this app's
          // ThemeProvider always uses cssVariables, so it's populated
          // at runtime. `t.vars ?? t` satisfies TS without changing
          // behavior.
          const vars = t.vars ?? t;

          // primary.main is identical across both color schemes in
          // this theme file, so reading it off t.palette (not t.vars)
          // for alpha() math is safe here — same reasoning as
          // t.palette.mode being a plain, non-frozen value.
          const hoverAlpha = t.palette.mode === "dark" ? 0.28 : 0.14;

          return {
            position: "absolute",
            bottom: 16,
            right: 16,
            zIndex: 20,
            // Matches the sidebar's selected-item tint (action.selected)
            // instead of a solid fill — updates live with .light/.dark.
            bgcolor: vars.palette.action.selected,
            color: vars.palette.primary.light,
            borderRadius: "50%",
            width: 40,
            height: 40,
            boxShadow:
              t.palette.mode === "dark"
                ? "0 2px 8px rgba(0,0,0,0.8)"
                : "0 2px 8px rgba(0,0,0,0.25)",
            transition: "background-color 0.15s ease, transform 0.15s ease",
            "&:hover": {
              bgcolor: alpha(t.palette.primary.main, hoverAlpha),
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          };
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
}

export default React.memo(ScrollToFirstPageButton);
