// // "use client";

// // import { Box } from "@mui/material";
// // import { useEffect, useRef } from "react";

// // const VIEWER_BG = "#e1e1e5";
// // const PDF_TOOLBAR = 40; // hides the browser's PDF toolbar; HTML needs no shift

// // interface Props {
// //   src: string;
// //   page: number;
// //   isHtml?: boolean;
// // }

// // export default function ReportIframe({ src, page, isHtml }: Props) {
// //   const ref = useRef<HTMLIFrameElement>(null);

// //   // HTML report: page navigation = window.scrollToPage() inside the report
// //   useEffect(() => {
// //     if (!isHtml) return;
// //     (
// //       ref.current?.contentWindow as
// //         | (Window & { scrollToPage?: (n: number) => void })
// //         | null
// //     )?.scrollToPage?.(page);
// //   }, [page, isHtml]);

// //   const shift = isHtml ? 0 : PDF_TOOLBAR;

// //   return (
// //     <Box
// //       sx={{
// //         position: "relative",
// //         height: 1000,
// //         overflow: "hidden",
// //         bgcolor: VIEWER_BG,
// //       }}
// //     >
// //       <iframe
// //         ref={ref}
// //         key={src}
// //         src={isHtml ? src : `${src}#page=${page}&toolbar=0&zoom=100`}
// //         style={{
// //           position: "absolute",
// //           top: -shift,
// //           left: 0,
// //           width: "100%",
// //           height: `calc(100% + ${shift}px)`,
// //           border: "none",
// //         }}
// //       />
// //     </Box>
// //   );
// // }

// "use client";

// import { Box } from "@mui/material";
// import { useEffect, useRef } from "react";

// import ScrollToFirstPageButton from "@/components/reportForm/Common/ScrollToFirstPageButton";

// const VIEWER_BG = "#e1e1e5";
// const PDF_TOOLBAR = 40; // hides the browser's PDF toolbar; HTML needs no shift

// interface Props {
//   src: string;
//   page: number;
//   isHtml?: boolean;
//   /** pass both to show the scroll-to-top / last-page button */
//   totalPages?: number;
//   onPageChange?: (page: number) => void;
// }

// export default function ReportIframe({
//   src,
//   page,
//   isHtml,
//   totalPages = 1,
//   onPageChange,
// }: Props) {
//   const ref = useRef<HTMLIFrameElement>(null);

//   // HTML report: page navigation = window.scrollToPage() inside the report
//   useEffect(() => {
//     if (!isHtml) return;
//     try {
//       (
//         ref.current?.contentWindow as
//           | (Window & { scrollToPage?: (n: number) => void })
//           | null
//       )?.scrollToPage?.(page);
//     } catch {
//       /* iframe not ready */
//     }
//   }, [page, isHtml]);

//   const shift = isHtml ? 0 : PDF_TOOLBAR;

//   return (
//     <Box
//       sx={{
//         position: "relative",
//         height: 1000,
//         overflow: "hidden",
//         bgcolor: VIEWER_BG,
//       }}
//     >
//       <iframe
//         ref={ref}
//         key={src}
//         // src={isHtml ? src : `${src}#page=${page}&toolbar=0&zoom=100`}
//         src={`${src}#page=${page}&toolbar=0&zoom=100`}
//         title="Report"
//         style={{
//           position: "absolute",
//           top: -shift,
//           left: 0,
//           width: "100%",
//           height: `calc(100% + ${shift}px)`,
//           border: "none",
//           zIndex: 0,
//         }}
//       />

//       {onPageChange && (
//         <ScrollToFirstPageButton
//           onClick={() => onPageChange(page <= 1 ? totalPages : 1)}
//           currentPage={page}
//           totalPages={totalPages}
//           hideWhenSinglePage
//         />
//       )}
//     </Box>
//   );
// }

// src/components/reportForm/Common/ReportIframe.tsx
"use client";

import ScrollToFirstPageButton from "@/components/reportForm/Common/ScrollToFirstPageButton";
import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

const VIEWER_BG = "#e1e1e5";
const VIEWER_HEIGHT = 1000;
const VIEWER_MARGIN_TOP = 10; // gap above the whole viewer
const VIEWER_GAP = 16; // gray gap between the viewer edge and the report
const PDF_SHIFT = 40; // hides the browser PDF toolbar

interface Props {
  src: string;
  page: number;
  isHtml?: boolean;
  /** upward shift in px; defaults to 40 for PDF, 0 for HTML */
  shift?: number;
  /** gray gap in px around the report; defaults to 16 */
  gap?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function ReportIframe({
  src,
  page,
  isHtml,
  shift,
  gap = VIEWER_GAP,
  totalPages = 1,
  onPageChange,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const resolvedShift = shift ?? (isHtml ? 0 : PDF_SHIFT);

  useEffect(() => {
    wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [src]);

  useEffect(() => {
    if (!isHtml) return;
    try {
      (
        iframeRef.current?.contentWindow as
          | (Window & { scrollToPage?: (n: number) => void })
          | null
      )?.scrollToPage?.(page);
    } catch {
      /* iframe not ready */
    }
  }, [page, isHtml]);

  return (
    <Box
      ref={wrapperRef}
      sx={{
        position: "relative",
        height: VIEWER_HEIGHT,
        mt: `${VIEWER_MARGIN_TOP}px`,
        scrollMarginTop: `${VIEWER_MARGIN_TOP}px`,
        bgcolor: VIEWER_BG,
        overflow: "hidden",
      }}
    >
      {/* Inset clip box: the gray wrapper shows through as the gap */}
      <Box
        sx={{
          position: "absolute",
          inset: `${gap}px`,
          overflow: "hidden",
        }}
      >
        <iframe
          ref={iframeRef}
          key={src}
          src={isHtml ? src : `${src}#page=${page}&toolbar=0&zoom=100`}
          title="Report"
          style={{
            position: "absolute",
            top: -resolvedShift,
            left: 0,
            width: "100%",
            height: `calc(100% + ${resolvedShift}px)`,
            border: "none",
          }}
        />
      </Box>

      {onPageChange && (
        <ScrollToFirstPageButton
          onClick={() => onPageChange(page <= 1 ? totalPages : 1)}
          currentPage={page}
          totalPages={totalPages}
          hideWhenSinglePage
        />
      )}
    </Box>
  );
}
