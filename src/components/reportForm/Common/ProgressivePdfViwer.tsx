// "use client";

// import React, {
//   forwardRef,
//   useImperativeHandle,
//   useRef,
//   useState,
//   useEffect,
//   useCallback,
//   useLayoutEffect,
//   memo,
// } from "react";
// import * as pdfjsLib from "pdfjs-dist";
// import Box from "@mui/material/Box";
// import CircularProgress from "@mui/material/CircularProgress";

// const PDFJS_VERSION = pdfjsLib.version;
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

// const CMAP_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/cmaps/`;
// const STANDARD_FONT_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/standard_fonts/`;

// export interface ProgressivePdfViewerHandle {
//   appendPages: (blobUrl: string) => Promise<void>;
//   scrollToPage: (pageNum: number) => void;
// }

// interface ProgressivePdfViewerProps {
//   initialBlobUrl: string;
//   onPageChange?: (page: number) => void;
// }

// async function fetchBlobAsArrayBuffer(blobUrl: string): Promise<ArrayBuffer> {
//   const res = await fetch(blobUrl);
//   return res.arrayBuffer();
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // PageCanvas
// // ─────────────────────────────────────────────────────────────────────────────

// interface PageCanvasProps {
//   pageNum: number;
//   docVersion: number;
//   getLatestDocument: () => pdfjsLib.PDFDocumentProxy | null;
// }

// const PageCanvas = memo(
//   ({ pageNum, docVersion, getLatestDocument }: PageCanvasProps) => {
//     const visibleCanvasRef = useRef<HTMLCanvasElement>(null);
//     const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);
//     const isFirstPaint = useRef(true);
//     const [shown, setShown] = useState(false);

//     useEffect(() => {
//       const doc = getLatestDocument();
//       if (!doc || !visibleCanvasRef.current) return;

//       let cancelled = false;
//       renderTaskRef.current?.cancel();
//       renderTaskRef.current = null;

//       const run = async () => {
//         try {
//           const page = await doc.getPage(pageNum);
//           if (cancelled) return;

//           // ── Scale = 1.0 at 96 dpi matches the PDF's natural CSS-pixel size.
//           // Multiply by devicePixelRatio so the pixel buffer is sharp on HiDPI
//           // screens, then set CSS width/height = natural size in points so it
//           // displays at exactly the same physical size as opening the PDF in a
//           // viewer (no stretching).
//           const dpr = window.devicePixelRatio || 1;
//           const naturalViewport = page.getViewport({ scale: 1 }); // 1pt = 1px at 96dpi
//           const renderViewport = page.getViewport({ scale: dpr }); // retina buffer

//           // Offscreen canvas at full retina resolution
//           const offscreen = document.createElement("canvas");
//           offscreen.width = renderViewport.width;
//           offscreen.height = renderViewport.height;
//           const offCtx = offscreen.getContext("2d", { alpha: false });
//           if (!offCtx || cancelled) return;

//           const task = page.render({
//             canvasContext: offCtx,
//             viewport: renderViewport,
//           });
//           renderTaskRef.current = task;
//           await task.promise;
//           if (cancelled) return;

//           // Atomic blit to visible canvas
//           const vis = visibleCanvasRef.current;
//           if (!vis) return;

//           // Canvas pixel buffer = retina size
//           if (
//             vis.width !== renderViewport.width ||
//             vis.height !== renderViewport.height
//           ) {
//             vis.width = renderViewport.width;
//             vis.height = renderViewport.height;
//           }

//           // CSS display size = natural PDF size in CSS pixels (no stretch)
//           vis.style.width = `${naturalViewport.width}px`;
//           vis.style.height = `${naturalViewport.height}px`;

//           const visCtx = vis.getContext("2d", { alpha: false });
//           if (!visCtx) return;

//           visCtx.drawImage(offscreen, 0, 0); // instant blit — no blank frame

//           if (isFirstPaint.current) {
//             isFirstPaint.current = false;
//             setShown(true);
//           }
//         } catch (err: any) {
//           if (err?.name === "RenderingCancelledException") return;
//           console.error(`Page ${pageNum} render error:`, err);
//         } finally {
//           renderTaskRef.current = null;
//         }
//       };

//       run();

//       return () => {
//         cancelled = true;
//         renderTaskRef.current?.cancel();
//         renderTaskRef.current = null;
//       };
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [pageNum, docVersion]);

//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mb: "6px" }}>
//         <canvas
//           ref={visibleCanvasRef}
//           data-page={pageNum}
//           style={{
//             display: "block",
//             boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
//             backgroundColor: "#fff",
//             opacity: shown ? 1 : 0,
//             // fade-in only on the very first paint
//             transition: shown ? "none" : "opacity 0.12s ease-in",
//           }}
//         />
//       </Box>
//     );
//   },
// );

// PageCanvas.displayName = "PageCanvas";

// // ─────────────────────────────────────────────────────────────────────────────
// // ProgressivePdfViewer
// // ─────────────────────────────────────────────────────────────────────────────

// const ProgressivePdfViewer = forwardRef<
//   ProgressivePdfViewerHandle,
//   ProgressivePdfViewerProps
// >(({ initialBlobUrl, onPageChange }, ref) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const latestDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
//   const scrollTopRef = useRef<number>(0);
//   const totalPagesRef = useRef(0);

//   const [pageNumbers, setPageNumbers] = useState<number[]>([]);
//   const [docVersion, setDocVersion] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const getLatestDocument = useCallback(() => latestDocRef.current, []);

//   const loadPdf = useCallback(async (blobUrl: string, isAppend: boolean) => {
//     if (!isAppend) setLoading(true);
//     try {
//       const arrayBuffer = await fetchBlobAsArrayBuffer(blobUrl);
//       const doc = await pdfjsLib.getDocument({
//         data: arrayBuffer,
//         cMapUrl: CMAP_URL,
//         cMapPacked: true,
//         standardFontDataUrl: STANDARD_FONT_URL,
//         useSystemFonts: true,
//         disableAutoFetch: true,
//         disableStream: true,
//       }).promise;

//       const newTotal = doc.numPages;
//       const oldTotal = totalPagesRef.current;

//       latestDocRef.current?.destroy();
//       latestDocRef.current = doc;
//       totalPagesRef.current = newTotal;

//       scrollTopRef.current = containerRef.current?.scrollTop ?? 0;

//       if (!isAppend || newTotal <= oldTotal) {
//         setPageNumbers(Array.from({ length: newTotal }, (_, i) => i + 1));
//       } else {
//         const added = Array.from(
//           { length: newTotal - oldTotal },
//           (_, i) => oldTotal + i + 1,
//         );
//         setPageNumbers((prev) => [...prev, ...added]);
//       }

//       setDocVersion((v) => v + 1);
//     } catch (err) {
//       console.error("PDF load error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const appendPages = useCallback(
//     async (blobUrl: string) => loadPdf(blobUrl, true),
//     [loadPdf],
//   );
//   const scrollToPage = useCallback(
//     (pageNum: number) => {
//       const el = containerRef.current?.querySelector(
//         `[data-page="${pageNum}"]`,
//       );
//       if (el) {
//         el.scrollIntoView({ behavior: "instant", block: "start" });
//         onPageChange?.(pageNum);
//       }
//     },
//     [onPageChange],
//   );

//   useImperativeHandle(ref, () => ({ appendPages, scrollToPage }));

//   useEffect(() => {
//     if (initialBlobUrl) loadPdf(initialBlobUrl, false);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useLayoutEffect(() => {
//     if (containerRef.current && scrollTopRef.current > 0)
//       containerRef.current.scrollTop = scrollTopRef.current;
//   }, [pageNumbers]);

//   return (
//     <Box
//       ref={containerRef}
//       sx={{
//         height: "100%",
//         overflow: "auto",
//         bgcolor: "#e8e8e8",
//         p: "8px",
//         "&::-webkit-scrollbar": { width: "8px" },
//         "&::-webkit-scrollbar-thumb": {
//           backgroundColor: "rgba(0,0,0,0.25)",
//           borderRadius: "4px",
//         },
//       }}
//     >
//       {loading && (
//         <Box
//           sx={{
//             position: "sticky",
//             top: 8,
//             zIndex: 10,
//             display: "flex",
//             justifyContent: "center",
//             pointerEvents: "none",
//           }}
//         >
//           <CircularProgress size={28} thickness={4} />
//         </Box>
//       )}

//       {pageNumbers.map((pageNum) => (
//         <PageCanvas
//           key={pageNum}
//           pageNum={pageNum}
//           docVersion={docVersion}
//           getLatestDocument={getLatestDocument}
//         />
//       ))}
//     </Box>
//   );
// });

// ProgressivePdfViewer.displayName = "ProgressivePdfViewer";
// export default ProgressivePdfViewer;



"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  memo,
} from "react";
import * as pdfjsLib from "pdfjs-dist";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const PDFJS_VERSION = pdfjsLib.version;
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

const CMAP_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/cmaps/`;
const STANDARD_FONT_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/standard_fonts/`;

export interface ProgressivePdfViewerHandle {
  appendPages: (blobUrl: string) => Promise<void>;
  scrollToPage: (pageNum: number) => void;
}

interface ProgressivePdfViewerProps {
  initialBlobUrl: string;
  onPageChange?: (page: number) => void;
}

async function fetchBlobAsArrayBuffer(blobUrl: string): Promise<ArrayBuffer> {
  const res = await fetch(blobUrl);
  return res.arrayBuffer();
}

// ─────────────────────────────────────────────────────────────────────────────
// PageCanvas
// Renders at dpr resolution for sharp text, displays at 100% container width.
// ─────────────────────────────────────────────────────────────────────────────

interface PageCanvasProps {
  pageNum: number;
  docVersion: number;
  getLatestDocument: () => pdfjsLib.PDFDocumentProxy | null;
}

const PageCanvas = memo(
  ({ pageNum, docVersion, getLatestDocument }: PageCanvasProps) => {
    const visibleCanvasRef = useRef<HTMLCanvasElement>(null);
    const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);
    const isFirstPaint = useRef(true);
    const [shown, setShown] = useState(false);

    useEffect(() => {
      const doc = getLatestDocument();
      if (!doc || !visibleCanvasRef.current) return;

      let cancelled = false;
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;

      const run = async () => {
        try {
          const page = await doc.getPage(pageNum);
          if (cancelled) return;

          const dpr = window.devicePixelRatio || 1;

          // DISPLAY_SCALE makes the page render wider without changing font metrics.
          // 1.5 = 50% wider than the PDF's natural point size. Adjust freely.
          const DISPLAY_SCALE = 1.5;
          const renderViewport = page.getViewport({
            scale: DISPLAY_SCALE * dpr,
          });

          const offscreen = document.createElement("canvas");
          offscreen.width = renderViewport.width;
          offscreen.height = renderViewport.height;
          const offCtx = offscreen.getContext("2d", { alpha: false });
          if (!offCtx || cancelled) return;

          const task = page.render({
            canvasContext: offCtx,
            viewport: renderViewport,
          });
          renderTaskRef.current = task;
          await task.promise;
          if (cancelled) return;

          const vis = visibleCanvasRef.current;
          if (!vis) return;

          if (
            vis.width !== renderViewport.width ||
            vis.height !== renderViewport.height
          ) {
            vis.width = renderViewport.width;
            vis.height = renderViewport.height;
          }

          const visCtx = vis.getContext("2d", { alpha: false });
          if (!visCtx) return;

          visCtx.drawImage(offscreen, 0, 0); // atomic blit — no blank frame

          // CSS: width 100% of parent, height auto preserves aspect ratio.
          // The parent Box below constrains the max width so pages don't
          // stretch absurdly on ultra-wide screens.
          vis.style.width = "100%";
          vis.style.height = "auto";

          if (isFirstPaint.current) {
            isFirstPaint.current = false;
            setShown(true);
          }
        } catch (err: any) {
          if (err?.name === "RenderingCancelledException") return;
          console.error(`Page ${pageNum} render error:`, err);
        } finally {
          renderTaskRef.current = null;
        }
      };

      run();

      return () => {
        cancelled = true;
        renderTaskRef.current?.cancel();
        renderTaskRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNum, docVersion]);

    return (
      <Box sx={{ display: "flex", justifyContent: "center", mb: "6px" }}>
        {/* 
        maxWidth: 1100px keeps A4-wide reports readable without overflowing on
        large monitors. Adjust to taste — this does NOT affect font rendering.
      */}
        <Box sx={{ width: "100%", maxWidth: 1100 }}>
          <canvas
            ref={visibleCanvasRef}
            data-page={pageNum}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
              opacity: shown ? 1 : 0,
              transition: shown ? "none" : "opacity 0.12s ease-in",
            }}
          />
        </Box>
      </Box>
    );
  },
);

PageCanvas.displayName = "PageCanvas";

// ─────────────────────────────────────────────────────────────────────────────
// ProgressivePdfViewer
// ─────────────────────────────────────────────────────────────────────────────

const ProgressivePdfViewer = forwardRef<
  ProgressivePdfViewerHandle,
  ProgressivePdfViewerProps
>(({ initialBlobUrl, onPageChange }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const latestDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const scrollTopRef = useRef<number>(0);
  const totalPagesRef = useRef(0);

  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const [docVersion, setDocVersion] = useState(0);
  const [loading, setLoading] = useState(false);

  const getLatestDocument = useCallback(() => latestDocRef.current, []);

  const loadPdf = useCallback(async (blobUrl: string, isAppend: boolean) => {
    if (!isAppend) setLoading(true);
    try {
      const arrayBuffer = await fetchBlobAsArrayBuffer(blobUrl);
      const doc = await pdfjsLib.getDocument({
        data: arrayBuffer,
        cMapUrl: CMAP_URL,
        cMapPacked: true,
        standardFontDataUrl: STANDARD_FONT_URL,
        useSystemFonts: true,
        disableAutoFetch: true,
        disableStream: true,
      }).promise;

      const newTotal = doc.numPages;
      const oldTotal = totalPagesRef.current;

      latestDocRef.current?.destroy();
      latestDocRef.current = doc;
      totalPagesRef.current = newTotal;
      scrollTopRef.current = containerRef.current?.scrollTop ?? 0;

      if (!isAppend || newTotal <= oldTotal) {
        setPageNumbers(Array.from({ length: newTotal }, (_, i) => i + 1));
      } else {
        const added = Array.from(
          { length: newTotal - oldTotal },
          (_, i) => oldTotal + i + 1,
        );
        setPageNumbers((prev) => [...prev, ...added]);
      }

      setDocVersion((v) => v + 1);
    } catch (err) {
      console.error("PDF load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const appendPages = useCallback(
    async (blobUrl: string) => loadPdf(blobUrl, true),
    [loadPdf],
  );

  const scrollToPage = useCallback(
    (pageNum: number) => {
      const el = containerRef.current?.querySelector(
        `[data-page="${pageNum}"]`,
      );
      if (el) {
        el.scrollIntoView({ behavior: "instant", block: "start" });
        onPageChange?.(pageNum);
      }
    },
    [onPageChange],
  );

  useImperativeHandle(ref, () => ({ appendPages, scrollToPage }));

  useEffect(() => {
    if (initialBlobUrl) loadPdf(initialBlobUrl, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (containerRef.current && scrollTopRef.current > 0)
      containerRef.current.scrollTop = scrollTopRef.current;
  }, [pageNumbers]);

  return (
    <Box
      ref={containerRef}
      sx={{
        height: "100%",
        overflow: "auto",
        bgcolor: "#e8e8e8",
        p: "8px",
        "&::-webkit-scrollbar": { width: "8px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,0.25)",
          borderRadius: "4px",
        },
      }}
    >
      {loading && (
        <Box
          sx={{
            position: "sticky",
            top: 8,
            zIndex: 10,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <CircularProgress size={28} thickness={4} />
        </Box>
      )}

      {pageNumbers.map((pageNum) => (
        <PageCanvas
          key={pageNum}
          pageNum={pageNum}
          docVersion={docVersion}
          getLatestDocument={getLatestDocument}
        />
      ))}
    </Box>
  );
});

ProgressivePdfViewer.displayName = "ProgressivePdfViewer";
export default ProgressivePdfViewer;
