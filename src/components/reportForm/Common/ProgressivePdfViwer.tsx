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







// components/reports/common/ProgressivePdfViewer.tsx
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
  const response = await fetch(blobUrl);
  return await response.arrayBuffer();
}

/* ───────── Memoized single‑page canvas ───────── */

interface PageCanvasProps {
  pageNum: number;
  scale: number;
  getLatestDocument: () => pdfjsLib.PDFDocumentProxy | null;
}

const PageCanvas = memo(({ pageNum, scale, getLatestDocument }: PageCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [opacity, setOpacity] = useState(0);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasRenderedRef = useRef(false);

  useEffect(() => {
    if (hasRenderedRef.current) return; // already painted → skip
    const doc = getLatestDocument();
    if (!doc || !canvasRef.current) return;

    // Cancel previous operations (StrictMode safe)
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
      renderTaskRef.current = null;
    }
    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const canvas = canvasRef.current;
    const signal = abortController.signal;

    const render = async () => {
      try {
        const page = await doc.getPage(pageNum);
        if (signal.aborted) return;

        const viewport = page.getViewport({ scale });
        if (canvas.width !== viewport.width) canvas.width = viewport.width;
        if (canvas.height !== viewport.height) canvas.height = viewport.height;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        const task = page.render({ canvasContext: ctx, viewport });
        renderTaskRef.current = task;
        await task.promise;

        if (!signal.aborted) {
          hasRenderedRef.current = true;
          setOpacity(1);
        }
      } catch (err: any) {
        if (err?.name === "RenderingCancelledException") return;
        console.error(`Error rendering page ${pageNum}:`, err);
      } finally {
        renderTaskRef.current = null;
      }
    };

    render();

    return () => {
      abortController.abort();
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
    };
  }, [pageNum, scale, getLatestDocument]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
      <canvas
        ref={canvasRef}
        data-page={pageNum}
        style={{
          display: "block",
          maxWidth: "100%",
          height: "auto",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
          opacity,
          transition: "opacity 0.15s ease-in",
        }}
      />
    </Box>
  );
});

PageCanvas.displayName = "PageCanvas";

/* ───────── Main Viewer ───────── */

const ProgressivePdfViewer = forwardRef<
  ProgressivePdfViewerHandle,
  ProgressivePdfViewerProps
>(({ initialBlobUrl, onPageChange }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const latestDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const totalPagesRef = useRef(0);
  const scrollTopRef = useRef<number>(0);

  const getLatestDocument = useCallback(() => latestDocRef.current, []);

  const loadDocumentIncremental = useCallback(
    async (blobUrl: string) => {
      try {
        const arrayBuffer = await fetchBlobAsArrayBuffer(blobUrl);
        const loadingTask = pdfjsLib.getDocument({
          data: arrayBuffer,
          disableAutoFetch: true,
          disableStream: true,
        });
        const newDoc = await loadingTask.promise;
        const oldTotal = totalPagesRef.current;
        const newTotal = newDoc.numPages;

        latestDocRef.current = newDoc;

        if (newTotal > oldTotal) {
          scrollTopRef.current = containerRef.current?.scrollTop ?? 0;
          const addedPages = Array.from(
            { length: newTotal - oldTotal },
            (_, i) => oldTotal + i + 1,
          );
          setPageNumbers((prev) => [...prev, ...addedPages]);
          totalPagesRef.current = newTotal;
        }
      } catch (err) {
        console.error("Incremental load failed:", err);
      }
    },
    [],
  );

  const loadDocumentInitial = useCallback(
    async (blobUrl: string) => {
      try {
        const arrayBuffer = await fetchBlobAsArrayBuffer(blobUrl);
        const loadingTask = pdfjsLib.getDocument({
          data: arrayBuffer,
          disableAutoFetch: true,
          disableStream: true,
        });
        const doc = await loadingTask.promise;
        latestDocRef.current = doc;
        const total = doc.numPages;
        totalPagesRef.current = total;
        setPageNumbers(Array.from({ length: total }, (_, i) => i + 1));
      } catch (err) {
        console.error("Initial load failed:", err);
      }
    },
    [],
  );

  const appendPages = useCallback(
    async (blobUrl: string) => {
      if (totalPagesRef.current === 0) {
        await loadDocumentInitial(blobUrl);
      } else {
        await loadDocumentIncremental(blobUrl);
      }
    },
    [loadDocumentInitial, loadDocumentIncremental],
  );

  const scrollToPage = useCallback(
    (pageNum: number) => {
      const el = containerRef.current?.querySelector(`[data-page="${pageNum}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "instant", block: "start" });
        onPageChange?.(pageNum);
      }
    },
    [onPageChange],
  );

  useImperativeHandle(ref, () => ({ appendPages, scrollToPage }));

  useEffect(() => {
    if (initialBlobUrl) loadDocumentInitial(initialBlobUrl);
  }, []);

  useLayoutEffect(() => {
    if (containerRef.current && scrollTopRef.current) {
      containerRef.current.scrollTop = scrollTopRef.current;
    }
  }, [pageNumbers]);

  return (
    <Box
      ref={containerRef}
      sx={{
        height: "100%",
        overflow: "auto",
        "&::-webkit-scrollbar": { width: "8px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: "4px",
        },
      }}
    >
      {pageNumbers.map((pageNum) => (
        <PageCanvas
          key={pageNum}
          pageNum={pageNum}
          scale={1.5}
          getLatestDocument={getLatestDocument}
        />
      ))}
    </Box>
  );
});

ProgressivePdfViewer.displayName = "ProgressivePdfViewer";
export default ProgressivePdfViewer;