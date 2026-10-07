// "use client";

// import { Box } from "@mui/material";
// import { useEffect, useRef } from "react";

// const VIEWER_BG = "#e1e1e5";
// const PDF_TOOLBAR = 40; // hides the browser's PDF toolbar; HTML needs no shift

// interface Props {
//   src: string;
//   page: number;
//   isHtml?: boolean;
// }

// export default function ReportIframe({ src, page, isHtml }: Props) {
//   const ref = useRef<HTMLIFrameElement>(null);

//   // HTML report: page navigation = window.scrollToPage() inside the report
//   useEffect(() => {
//     if (!isHtml) return;
//     (
//       ref.current?.contentWindow as
//         | (Window & { scrollToPage?: (n: number) => void })
//         | null
//     )?.scrollToPage?.(page);
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
//         src={isHtml ? src : `${src}#page=${page}&toolbar=0&zoom=100`}
//         style={{
//           position: "absolute",
//           top: -shift,
//           left: 0,
//           width: "100%",
//           height: `calc(100% + ${shift}px)`,
//           border: "none",
//         }}
//       />
//     </Box>
//   );
// }

"use client";

import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

import ScrollToFirstPageButton from "@/components/reportForm/Common/ScrollToFirstPageButton";

const VIEWER_BG = "#e1e1e5";
const PDF_TOOLBAR = 40; // hides the browser's PDF toolbar; HTML needs no shift

interface Props {
  src: string;
  page: number;
  isHtml?: boolean;
  /** pass both to show the scroll-to-top / last-page button */
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function ReportIframe({
  src,
  page,
  isHtml,
  totalPages = 1,
  onPageChange,
}: Props) {
  const ref = useRef<HTMLIFrameElement>(null);

  // HTML report: page navigation = window.scrollToPage() inside the report
  useEffect(() => {
    if (!isHtml) return;
    try {
      (
        ref.current?.contentWindow as
          | (Window & { scrollToPage?: (n: number) => void })
          | null
      )?.scrollToPage?.(page);
    } catch {
      /* iframe not ready */
    }
  }, [page, isHtml]);

  const shift = isHtml ? 0 : PDF_TOOLBAR;

  return (
    <Box
      sx={{
        position: "relative",
        height: 1000,
        overflow: "hidden",
        bgcolor: VIEWER_BG,
      }}
    >
      <iframe
        ref={ref}
        key={src}
        src={isHtml ? src : `${src}#page=${page}&toolbar=0&zoom=100`}
        title="Report"
        style={{
          position: "absolute",
          top: -shift,
          left: 0,
          width: "100%",
          height: `calc(100% + ${shift}px)`,
          border: "none",
          zIndex: 0,
        }}
      />

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
