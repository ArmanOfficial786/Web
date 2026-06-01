// "use client";

// import React, {
//   forwardRef,
//   useImperativeHandle,
//   useRef,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";
// import * as pdfjsLib from "pdfjs-dist";
// import Box from "@mui/material/Box";
// import CircularProgress from "@mui/material/CircularProgress";

// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// export interface ProgressivePdfViewerHandle {
//   appendPages: (blobUrl: string) => Promise<void>;
//   scrollToPage: (pageNum: number) => void;
// }

// interface ProgressivePdfViewerProps {
//   initialBlobUrl: string;
//   onPageChange?: (page: number) => void;
// }

// const ProgressivePdfViewer = forwardRef<
//   ProgressivePdfViewerHandle,
//   ProgressivePdfViewerProps
// >(({ initialBlobUrl, onPageChange }, ref) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());
//   const renderedPages = useRef<Set<number>>(new Set());
//   const currentDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
//   const [pageNumbers, setPageNumbers] = useState<number[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Render a single page
//   const renderPage = useCallback(
//     async (doc: pdfjsLib.PDFDocumentProxy, pageNum: number) => {
//       const canvas = canvasRefs.current.get(pageNum);
//       if (!canvas) return false;
//       if (renderedPages.current.has(pageNum)) return true;

//       try {
//         const page = await doc.getPage(pageNum);
//         const viewport = page.getViewport({ scale: 1.5 });
//         canvas.width = viewport.width;
//         canvas.height = viewport.height;
//         const ctx = canvas.getContext("2d");
//         if (!ctx) return false;
//         await page.render({ canvasContext: ctx, viewport }).promise;
//         renderedPages.current.add(pageNum);
//         console.log(`✅ Rendered page ${pageNum}`);
//         return true;
//       } catch (err) {
//         console.error(`Failed to render page ${pageNum}:`, err);
//         return false;
//       }
//     },
//     [],
//   );

//   // Render all pages that are currently visible (with a buffer)
//   const renderVisiblePages = useCallback(async () => {
//     const doc = currentDocRef.current;
//     if (!doc || !containerRef.current) return;

//     const container = containerRef.current;
//     const scrollTop = container.scrollTop;
//     const viewportHeight = container.clientHeight;

//     const entries = Array.from(canvasRefs.current.entries())
//       .map(([num, canvas]) => ({
//         num,
//         top: canvas.offsetTop,
//         bottom: canvas.offsetTop + canvas.clientHeight,
//       }))
//       .sort((a, b) => a.top - b.top);

//     for (const { num, top, bottom } of entries) {
//       if (
//         bottom >= scrollTop - viewportHeight &&
//         top <= scrollTop + viewportHeight * 2
//       ) {
//         await renderPage(doc, num);
//       }
//     }
//   }, [renderPage]);

//   // Render ALL unrendered pages (used after append)
//   const renderAllUnrendered = useCallback(async () => {
//     const doc = currentDocRef.current;
//     if (!doc) return;
//     for (let i = 1; i <= doc.numPages; i++) {
//       if (!renderedPages.current.has(i)) {
//         await renderPage(doc, i);
//       }
//     }
//     console.log(`🎉 All ${doc.numPages} pages rendered`);
//   }, [renderPage]);

//   // Load a new document (initial load or full replacement)
//   const loadDocument = useCallback(
//     async (blobUrl: string, isAppend = false) => {
//       setLoading(true);
//       try {
//         const loadingTask = pdfjsLib.getDocument(blobUrl);
//         const doc = await loadingTask.promise;
//         const newTotal = doc.numPages;
//         const oldTotal = currentDocRef.current?.numPages ?? 0;

//         if (newTotal === oldTotal && isAppend) {
//           console.log("No new pages to append");
//           setLoading(false);
//           return;
//         }

//         currentDocRef.current = doc;
//         setPageNumbers(Array.from({ length: newTotal }, (_, i) => i + 1));

//         // For append, we keep existing renderedPages; for new doc, reset
//         if (!isAppend) {
//           renderedPages.current.clear();
//         }

//         console.log(
//           `📄 Document loaded: ${newTotal} pages (${isAppend ? "append" : "initial"})`,
//         );

//         // Wait for DOM to update with new canvas elements
//         setTimeout(async () => {
//           await renderAllUnrendered();
//           // Also ensure visible pages are rendered (though renderAllUnrendered covers all)
//           await renderVisiblePages();
//         }, 100);
//       } catch (err) {
//         console.error("Failed to load PDF:", err);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [renderAllUnrendered, renderVisiblePages],
//   );

//   // Public method to append new pages (call this with the latest full PDF blob)
//   const appendPages = useCallback(
//     async (blobUrl: string) => {
//       await loadDocument(blobUrl, true);
//     },
//     [loadDocument],
//   );

//   // Scroll to a specific page
//   const scrollToPage = useCallback(
//     (pageNum: number) => {
//       const canvas = canvasRefs.current.get(pageNum);
//       if (canvas && containerRef.current) {
//         canvas.scrollIntoView({ behavior: "smooth", block: "start" });
//         onPageChange?.(pageNum);
//       }
//     },
//     [onPageChange],
//   );

//   useImperativeHandle(ref, () => ({ appendPages, scrollToPage }));

//   // Initial load
//   useEffect(() => {
//     if (initialBlobUrl) {
//       loadDocument(initialBlobUrl, false);
//     }
//   }, [initialBlobUrl, loadDocument]);

//   // Render visible pages on scroll
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;
//     const onScroll = () => renderVisiblePages();
//     container.addEventListener("scroll", onScroll);
//     return () => container.removeEventListener("scroll", onScroll);
//   }, [renderVisiblePages]);

//   // Re-run rendering when pageNumbers change (new pages added)
//   useEffect(() => {
//     if (pageNumbers.length > 0 && currentDocRef.current) {
//       renderVisiblePages();
//     }
//   }, [pageNumbers, renderVisiblePages]);

//   return (
//     <Box
//       sx={{
//         position: "relative",
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       {loading && (
//         <Box
//           sx={{
//             position: "sticky",
//             top: 16,
//             left: "50%",
//             zIndex: 10,
//             width: 40,
//             mx: "auto",
//           }}
//         >
//           <CircularProgress size={30} />
//         </Box>
//       )}
//       <Box ref={containerRef} sx={{ flex: 1, overflow: "auto" }}>
//         {pageNumbers.map((pageNum) => (
//           <canvas
//             key={pageNum}
//             ref={(el) => {
//               if (el) canvasRefs.current.set(pageNum, el);
//               else canvasRefs.current.delete(pageNum);
//             }}
//             style={{
//               display: "block",
//               margin: "0 auto 8px auto",
//               boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//               backgroundColor: "#fff",
//             }}
//           />
//         ))}
//       </Box>
//     </Box>
//   );
// });

// ProgressivePdfViewer.displayName = "ProgressivePdfViewer";
// export default ProgressivePdfViewer;
"use client";

/**
 * ProgressivePdfViewer.tsx  —  flicker-free progressive PDF viewer
 *
 * Anti-flicker strategy:
 *   1. Never clear the visible canvas — paint onto an OFFSCREEN canvas first.
 *   2. Only copy to the visible canvas via drawImage() when the new frame is
 *      fully ready.  The visible canvas always shows a complete image.
 *   3. No opacity animation on re-renders — opacity:1 is set once on first
 *      paint and never touched again.
 *   4. docVersion still increments on every chunk so PageCanvas knows to
 *      re-render all pages (to pick up the updated "N of total" stamp from
 *      the backend), but the user never sees a blank/flicker between frames.
 */

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

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
// PageCanvas — flicker-free single page renderer
// ─────────────────────────────────────────────────────────────────────────────

interface PageCanvasProps {
  pageNum: number;
  scale: number;
  docVersion: number;
  getLatestDocument: () => pdfjsLib.PDFDocumentProxy | null;
}

const PageCanvas = memo(
  ({ pageNum, scale, docVersion, getLatestDocument }: PageCanvasProps) => {
    const visibleCanvasRef = useRef<HTMLCanvasElement>(null);
    const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);
    const isFirstPaintRef = useRef(true); // true until the very first frame lands
    const [visible, setVisible] = useState(false); // opacity gate for first paint only

    useEffect(() => {
      const doc = getLatestDocument();
      if (!doc || !visibleCanvasRef.current) return;

      let cancelled = false;

      // Cancel any in-flight render immediately
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;

      const run = async () => {
        try {
          const page = await doc.getPage(pageNum);
          if (cancelled) return;

          const viewport = page.getViewport({ scale });

          // ── Paint onto an OFFSCREEN canvas ────────────────────────────────
          // The visible canvas is untouched until the frame is complete.
          // This is the core anti-flicker technique: the user always sees
          // a finished image, never a blank or half-drawn canvas.
          const offscreen = document.createElement("canvas");
          offscreen.width = viewport.width;
          offscreen.height = viewport.height;
          const offCtx = offscreen.getContext("2d", { alpha: false });
          if (!offCtx || cancelled) return;

          const task = page.render({ canvasContext: offCtx, viewport });
          renderTaskRef.current = task;
          await task.promise; // ← full page is ready in offscreen memory

          if (cancelled) return; // check again after the async wait

          // ── Swap into visible canvas in one synchronous step ──────────────
          // No intermediate blank state — old pixels stay until new ones land.
          const vis = visibleCanvasRef.current;
          if (!vis) return;

          // Resize the visible canvas only when dimensions actually change
          // (avoids a clear on same-size re-renders like footer-stamp updates)
          if (vis.width !== viewport.width || vis.height !== viewport.height) {
            vis.width = viewport.width;
            vis.height = viewport.height;
          }

          const visCtx = vis.getContext("2d", { alpha: false });
          if (!visCtx) return;

          // drawImage is synchronous — old frame → new frame with zero blank gap
          visCtx.drawImage(offscreen, 0, 0);

          // Reveal the canvas on the very first paint (opacity 0 → 1 once only)
          if (isFirstPaintRef.current) {
            isFirstPaintRef.current = false;
            setVisible(true);
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
      // docVersion change → re-render all pages to pick up new "N of total" stamp.
      // No flicker because we paint offscreen first.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNum, scale, docVersion]);

    return (
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
        <canvas
          ref={visibleCanvasRef}
          data-page={pageNum}
          style={{
            display: "block",
            maxWidth: "100%",
            height: "auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
            // Fade in once on first paint only — never animated again
            opacity: visible ? 1 : 0,
            transition: isFirstPaintRef.current
              ? "opacity 0.15s ease-in"
              : "none",
          }}
        />
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

  // ── Shared load helper ────────────────────────────────────────────────────
  const loadPdf = useCallback(async (blobUrl: string, isAppend: boolean) => {
    // Show spinner only on initial load, not on background chunk appends
    if (!isAppend) setLoading(true);

    try {
      const arrayBuffer = await fetchBlobAsArrayBuffer(blobUrl);
      const doc = await pdfjsLib.getDocument({
        data: arrayBuffer,
        disableAutoFetch: true,
        disableStream: true,
      }).promise;

      const newTotal = doc.numPages;
      const oldTotal = totalPagesRef.current;

      // Free the previous document's memory
      latestDocRef.current?.destroy();
      latestDocRef.current = doc;
      totalPagesRef.current = newTotal;

      // Capture scroll position before React re-renders the page list
      scrollTopRef.current = containerRef.current?.scrollTop ?? 0;

      if (!isAppend || newTotal <= oldTotal) {
        // Initial load: set full page list
        setPageNumbers(Array.from({ length: newTotal }, (_, i) => i + 1));
      } else {
        // Append: add only newly arrived pages — existing canvases stay mounted.
        // docVersion bump below will trigger their re-render (new "N of total").
        const added = Array.from(
          { length: newTotal - oldTotal },
          (_, i) => oldTotal + i + 1,
        );
        setPageNumbers((prev) => [...prev, ...added]);
      }

      // Bump version → all mounted PageCanvas components re-render via useEffect.
      // Because they paint offscreen first, the user sees no flicker.
      setDocVersion((v) => v + 1);
    } catch (err) {
      console.error("PDF load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Public imperative API ─────────────────────────────────────────────────
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

  // ── Initial load (run once on mount) ─────────────────────────────────────
  useEffect(() => {
    if (initialBlobUrl) loadPdf(initialBlobUrl, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Restore scroll after page list grows ─────────────────────────────────
  useLayoutEffect(() => {
    if (containerRef.current && scrollTopRef.current > 0) {
      containerRef.current.scrollTop = scrollTopRef.current;
    }
  }, [pageNumbers]);

  return (
    <Box
      ref={containerRef}
      sx={{
        height: "100%",
        overflow: "auto",
        position: "relative",
        "&::-webkit-scrollbar": { width: "8px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: "4px",
        },
      }}
    >
      {/* Spinner only during initial load */}
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
          scale={1.5}
          docVersion={docVersion}
          getLatestDocument={getLatestDocument}
        />
      ))}
    </Box>
  );
});

ProgressivePdfViewer.displayName = "ProgressivePdfViewer";
export default ProgressivePdfViewer;
