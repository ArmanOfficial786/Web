// "use client";

// import { useEffect, useRef, useState } from "react";
// import * as pdfjsLib from "pdfjs-dist";

// // Configure PDF.js worker
// if (typeof window !== "undefined") {
//   pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
// }

// interface PdfSlideViewerProps {
//   base64Pdf: string;
//   pageNumber: number;
//   onTotalPages: (pages: number) => void;
//   onLoadError?: (error: string) => void;
// }

// export default function PdfSlideViewer({
//   base64Pdf,
//   pageNumber,
//   onTotalPages,
//   onLoadError,
// }: PdfSlideViewerProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isRendering, setIsRendering] = useState(false);
//   const [pdfDoc, setPdfDoc] = useState<any>(null);

//   // Load PDF document once when base64Pdf changes
//   useEffect(() => {
//     if (!base64Pdf) return;

//     let isMounted = true;

//     const loadPdf = async () => {
//       try {
//         setIsRendering(true);

//         // Convert base64 to Uint8Array
//         const pdfData = Uint8Array.from(atob(base64Pdf), (c) =>
//           c.charCodeAt(0),
//         );

//         // Load PDF document
//         const loadingTask = pdfjsLib.getDocument({ data: pdfData });
//         const pdf = await loadingTask.promise;

//         if (!isMounted) return;

//         setPdfDoc(pdf);
//         onTotalPages(pdf.numPages);
//         setIsRendering(false);
//       } catch (error: any) {
//         console.error("Error loading PDF:", error);
//         if (isMounted) {
//           setIsRendering(false);
//           onLoadError?.(error.message || "Failed to load PDF");
//         }
//       }
//     };

//     loadPdf();

//     return () => {
//       isMounted = false;
//     };
//   }, [base64Pdf, onTotalPages, onLoadError]);

//   // Render specific page when pageNumber or pdfDoc changes
//   useEffect(() => {
//     if (!pdfDoc || !canvasRef.current) return;

//     let isMounted = true;

//     const renderPage = async () => {
//       try {
//         setIsRendering(true);

//         const page = await pdfDoc.getPage(pageNumber);

//         if (!isMounted) return;

//         const canvas = canvasRef.current;
//         if (!canvas) return;

//         const context = canvas.getContext("2d");
//         if (!context) return;

//         // Calculate scale to fit container width
//         const container = canvas.parentElement;
//         const containerWidth = container?.clientWidth || 800;
//         const viewport = page.getViewport({ scale: 1.0 });

//         // Calculate scale (max 2.0 for quality)
//         const scale = Math.min((containerWidth - 40) / viewport.width, 2.0);
//         const scaledViewport = page.getViewport({ scale });

//         // Set canvas dimensions
//         canvas.height = scaledViewport.height;
//         canvas.width = scaledViewport.width;

//         // Clear canvas before rendering
//         context.clearRect(0, 0, canvas.width, canvas.height);

//         // Render PDF page
//         const renderContext = {
//           canvasContext: context,
//           viewport: scaledViewport,
//         };

//         await page.render(renderContext).promise;

//         if (isMounted) {
//           setIsRendering(false);
//         }
//       } catch (error: any) {
//         console.error("Error rendering page:", error);
//         if (isMounted) {
//           setIsRendering(false);
//           onLoadError?.(error.message || "Failed to render page");
//         }
//       }
//     };

//     renderPage();

//     return () => {
//       isMounted = false;
//     };
//   }, [pdfDoc, pageNumber, onLoadError]);

//   return (
//     <div className="flex justify-center items-center bg-gray-100 p-4 min-h-[600px] relative">
//       {isRendering && (
//         <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-2"></div>
//             <p className="text-sm text-gray-600">Rendering page...</p>
//           </div>
//         </div>
//       )}
//       <canvas
//         ref={canvasRef}
//         className="shadow-lg rounded bg-white max-w-full"
//         style={{ display: isRendering ? "none" : "block" }}
//       />
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef, useState, useCallback } from "react";
// import * as pdfjsLib from "pdfjs-dist";

// //pageNumber: Tells the PdfSlideViewer which page of the PDF to render. Without it, the component doesn't know which page to show.
// //onTotalPagesChange: This callback allows the PdfSlideViewer to communicate back to the parent component how many pages are in the PDF, so the navigation can show the correct total pages.

// // Configure PDF.js worker
// if (typeof window !== "undefined") {
//   pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
// }

// interface PdfSlideViewerProps {
//   base64Pdf: string;
//   pageNumber: number;
//   onTotalPagesChange: (pages: number) => void;
//   onLoadError?: (error: string) => void;
// }

// export default function PdfSlideViewer({
//   base64Pdf,
//   pageNumber,
//   onTotalPagesChange,
//   onLoadError,
// }: PdfSlideViewerProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [isRendering, setIsRendering] = useState(false);
//   const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
//   const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

//   /**
//    * Load PDF document from base64 string
//    * This effect runs once when the base64Pdf prop changes
//    */
//   useEffect(() => {
//     if (!base64Pdf) return;

//     let isMounted = true;

//     const loadPdf = async () => {
//       try {
//         setIsRendering(true);

//         // Convert base64 to Uint8Array
//         const pdfData = Uint8Array.from(atob(base64Pdf), (c) =>
//           c.charCodeAt(0),
//         );

//         // Load PDF document
//         const loadingTask = pdfjsLib.getDocument({ data: pdfData });
//         const pdf = await loadingTask.promise;

//         if (!isMounted) return;

//         setPdfDoc(pdf);
//         onTotalPagesChange(pdf.numPages);
//         setIsRendering(false);
//       } catch (error: any) {
//         console.error("Error loading PDF:", error);
//         if (isMounted) {
//           setIsRendering(false);
//           onLoadError?.(error.message || "Failed to load PDF");
//         }
//       }
//     };

//     loadPdf();

//     return () => {
//       isMounted = false;
//       // Cleanup: Cancel any ongoing render task
//       if (renderTaskRef.current) {
//         renderTaskRef.current.cancel();
//       }
//     };
//   }, [base64Pdf, onTotalPagesChange, onLoadError]);

//   /**
//    * Calculate optimal scale for rendering
//    * Ensures PDF fits within container while maintaining quality
//    */
//   const calculateScale = useCallback(
//     (viewport: pdfjsLib.PageViewport): number => {
//       const container = containerRef.current;
//       if (!container) return 1.5; // Default scale

//       const containerWidth = container.clientWidth;
//       const baseScale = (containerWidth - 40) / viewport.width;

//       // Limit scale between 1.0 and 2.5 for optimal quality and performance
//       return Math.min(Math.max(baseScale, 1.0), 2.5);
//     },
//     [],
//   );

//   /**
//    * Render specific PDF page on canvas
//    * This effect runs when pageNumber or pdfDoc changes
//    */
//   useEffect(() => {
//     if (!pdfDoc || !canvasRef.current) return;

//     let isMounted = true;

//     const renderPage = async () => {
//       try {
//         // Cancel any previous render task
//         if (renderTaskRef.current) {
//           renderTaskRef.current.cancel();
//           renderTaskRef.current = null;
//         }

//         setIsRendering(true);

//         // Get the page
//         const page = await pdfDoc.getPage(pageNumber);

//         if (!isMounted) return;

//         const canvas = canvasRef.current;
//         if (!canvas) return;

//         const context = canvas.getContext("2d");
//         if (!context) return;

//         // Calculate viewport and scale
//         const viewport = page.getViewport({ scale: 1.0 });
//         const scale = calculateScale(viewport);
//         const scaledViewport = page.getViewport({ scale });

//         // Set canvas dimensions
//         canvas.height = scaledViewport.height;
//         canvas.width = scaledViewport.width;

//         // Clear canvas before rendering
//         context.clearRect(0, 0, canvas.width, canvas.height);

//         // Render PDF page
//         const renderContext = {
//           canvasContext: context,
//           viewport: scaledViewport,
//         };

//         renderTaskRef.current = page.render(renderContext);
//         await renderTaskRef.current.promise;

//         if (isMounted) {
//           setIsRendering(false);
//           renderTaskRef.current = null;
//         }
//       } catch (error: any) {
//         // Ignore cancellation errors (they're expected when changing pages)
//         if (error.name === "RenderingCancelledException") {
//           return;
//         }

//         console.error("Error rendering page:", error);
//         if (isMounted) {
//           setIsRendering(false);
//           onLoadError?.(error.message || "Failed to render page");
//         }
//       }
//     };

//     renderPage();

//     return () => {
//       isMounted = false;
//       // Cancel render task on cleanup
//       if (renderTaskRef.current) {
//         renderTaskRef.current.cancel();
//         renderTaskRef.current = null;
//       }
//     };
//   }, [pdfDoc, pageNumber, calculateScale, onLoadError]);

//   /**
//    * Handle window resize to re-render page with optimal scale
//    */
//   useEffect(() => {
//     const handleResize = () => {
//       // Trigger re-render by updating a dummy state
//       // This will cause the render effect to run again with new scale
//       if (pdfDoc && canvasRef.current) {
//         // Force re-render by clearing canvas
//         const canvas = canvasRef.current;
//         const context = canvas.getContext("2d");
//         if (context) {
//           context.clearRect(0, 0, canvas.width, canvas.height);
//         }
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [pdfDoc]);

//   return (
//     <div
//       ref={containerRef}
//       className="flex justify-center items-center bg-gray-100 p-4 min-h-[600px] relative"
//     >
//       {/* Loading Overlay */}
//       {isRendering && (
//         <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-2"></div>
//             <p className="text-sm text-gray-600">Rendering page...</p>
//           </div>
//         </div>
//       )}

//       {/* PDF Canvas */}
//       <canvas
//         ref={canvasRef}
//         className="shadow-lg rounded bg-white max-w-full"
//         style={{ display: isRendering ? "none" : "block" }}
//       />
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef, useState, useCallback } from "react";
// import * as pdfjsLib from "pdfjs-dist";
// import { Box, Paper, CircularProgress, Typography, Fade } from "@mui/material";

// // Configure PDF.js worker
// if (typeof window !== "undefined") {
//   pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
// }

// interface PdfSlideViewerProps {
//   base64Pdf: string;
//   pageNumber: number;
//   onTotalPagesChange: (pages: number) => void;
//   onLoadError?: (error: string) => void;
// }

// export default function PdfSlideViewer({
//   base64Pdf,
//   pageNumber,
//   onTotalPagesChange,
//   onLoadError,
// }: PdfSlideViewerProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [isRendering, setIsRendering] = useState(false);
//   const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
//   const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);
//   const [showCanvas, setShowCanvas] = useState(true);

//   // Track current rendered page to prevent unnecessary re-renders
//   const [currentRenderedPage, setCurrentRenderedPage] = useState<number | null>(
//     null,
//   );

//   /**
//    * Load PDF document from base64 string
//    */
//   useEffect(() => {
//     if (!base64Pdf) return;

//     let isMounted = true;

//     const loadPdf = async () => {
//       try {
//         setIsRendering(true);

//         // Don't hide canvas on initial load
//         if (currentRenderedPage !== null) {
//           setShowCanvas(false);
//         }

//         // Convert base64 to Uint8Array
//         const pdfData = Uint8Array.from(atob(base64Pdf), (c) =>
//           c.charCodeAt(0),
//         );

//         // Load PDF document
//         const loadingTask = pdfjsLib.getDocument({ data: pdfData });
//         const pdf = await loadingTask.promise;

//         if (!isMounted) return;

//         setPdfDoc(pdf);
//         onTotalPagesChange(pdf.numPages);
//         setIsRendering(false);

//         // Only show canvas if we're rendering a specific page
//         if (currentRenderedPage === null) {
//           setShowCanvas(true);
//         }
//       } catch (error: any) {
//         console.error("Error loading PDF:", error);
//         if (isMounted) {
//           setIsRendering(false);
//           setShowCanvas(true); // Ensure canvas is visible on error
//           onLoadError?.(error.message || "Failed to load PDF");
//         }
//       }
//     };

//     loadPdf();

//     return () => {
//       isMounted = false;
//       if (renderTaskRef.current) {
//         renderTaskRef.current.cancel();
//       }
//     };
//   }, [base64Pdf, onTotalPagesChange, onLoadError]);

//   /**
//    * Calculate optimal scale for rendering
//    */
//   const calculateScale = useCallback(
//     (viewport: pdfjsLib.PageViewport): number => {
//       const container = containerRef.current;
//       if (!container) return 1.5;

//       const containerWidth = container.clientWidth;
//       const baseScale = (containerWidth - 40) / viewport.width;

//       return Math.min(Math.max(baseScale, 1.0), 2.5);
//     },
//     [],
//   );

//   /**
//    * Cache rendered pages to prevent re-rendering
//    */
//   const pageCache = useRef<Map<number, HTMLCanvasElement>>(new Map());

//   /**
//    * Render specific PDF page on canvas
//    */
//   useEffect(() => {
//     if (!pdfDoc || !canvasRef.current) return;

//     // Skip if we're already rendering this page
//     if (
//       currentRenderedPage === pageNumber &&
//       pageCache.current.has(pageNumber)
//     ) {
//       return;
//     }

//     let isMounted = true;

//     const renderPage = async () => {
//       try {
//         // Check cache first
//         if (pageCache.current.has(pageNumber)) {
//           const cachedCanvas = pageCache.current.get(pageNumber);
//           if (cachedCanvas && canvasRef.current) {
//             const context = canvasRef.current.getContext("2d");
//             if (context) {
//               // Get cached dimensions
//               canvasRef.current.width = cachedCanvas.width;
//               canvasRef.current.height = cachedCanvas.height;

//               // Clear canvas
//               context.clearRect(
//                 0,
//                 0,
//                 canvasRef.current.width,
//                 canvasRef.current.height,
//               );
//               // Draw cached page
//               context.drawImage(cachedCanvas, 0, 0);

//               setCurrentRenderedPage(pageNumber);
//               return;
//             }
//           }
//         }

//         // Only show loading if we're changing to a different page
//         if (
//           currentRenderedPage !== null &&
//           currentRenderedPage !== pageNumber
//         ) {
//           setIsRendering(true);
//           setShowCanvas(false);
//         }

//         // Cancel any previous render task
//         if (renderTaskRef.current) {
//           renderTaskRef.current.cancel();
//           renderTaskRef.current = null;
//         }

//         // Get the page
//         const page = await pdfDoc.getPage(pageNumber);

//         if (!isMounted) return;

//         const canvas = canvasRef.current;
//         if (!canvas) return;

//         const context = canvas.getContext("2d");
//         if (!context) return;

//         // Calculate viewport and scale
//         const viewport = page.getViewport({ scale: 1.0 });
//         const scale = calculateScale(viewport);
//         const scaledViewport = page.getViewport({ scale });

//         // Set canvas dimensions
//         canvas.height = scaledViewport.height;
//         canvas.width = scaledViewport.width;

//         // Clear canvas before rendering
//         context.clearRect(0, 0, canvas.width, canvas.height);

//         // Render PDF page
//         const renderContext = {
//           canvasContext: context,
//           viewport: scaledViewport,
//         };

//         renderTaskRef.current = page.render(renderContext);
//         await renderTaskRef.current.promise;

//         // Cache the rendered page
//         const cachedCanvas = document.createElement("canvas");
//         cachedCanvas.width = canvas.width;
//         cachedCanvas.height = canvas.height;
//         const cachedContext = cachedCanvas.getContext("2d");
//         if (cachedContext) {
//           cachedContext.drawImage(canvas, 0, 0);
//           pageCache.current.set(pageNumber, cachedCanvas);
//         }

//         if (isMounted) {
//           setIsRendering(false);
//           setShowCanvas(true);
//           setCurrentRenderedPage(pageNumber);
//           renderTaskRef.current = null;
//         }
//       } catch (error: any) {
//         // Ignore cancellation errors
//         if (error.name === "RenderingCancelledException") {
//           return;
//         }

//         console.error("Error rendering page:", error);
//         if (isMounted) {
//           setIsRendering(false);
//           setShowCanvas(true);
//           onLoadError?.(error.message || "Failed to render page");
//         }
//       }
//     };

//     // Use requestAnimationFrame for smoother rendering
//     const animationFrameId = requestAnimationFrame(() => {
//       renderPage();
//     });

//     return () => {
//       isMounted = false;
//       cancelAnimationFrame(animationFrameId);
//       if (renderTaskRef.current) {
//         renderTaskRef.current.cancel();
//         renderTaskRef.current = null;
//       }
//     };
//   }, [pdfDoc, pageNumber, calculateScale, onLoadError, currentRenderedPage]);

//   /**
//    * Clear cache when PDF changes
//    */
//   useEffect(() => {
//     return () => {
//       pageCache.current.clear();
//       setCurrentRenderedPage(null);
//     };
//   }, [base64Pdf]);

//   /**
//    * Handle window resize
//    */
//   useEffect(() => {
//     const handleResize = () => {
//       if (pdfDoc && canvasRef.current) {
//         // Clear cache on resize since scale changes
//         pageCache.current.clear();
//         setCurrentRenderedPage(null);
//       }
//     };

//     const resizeTimer = setTimeout(handleResize, 250);
//     window.addEventListener("resize", handleResize);

//     return () => {
//       clearTimeout(resizeTimer);
//       window.removeEventListener("resize", handleResize);
//     };
//   }, [pdfDoc]);

//   return (
//     <Box
//       ref={containerRef}
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         bgcolor: "grey.100",
//         p: 3,
//         minHeight: 600,
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       {/* Loading Overlay - Only show when changing pages */}
//       {isRendering && currentRenderedPage !== pageNumber && (
//         <Fade in={isRendering} timeout={300}>
//           <Paper
//             elevation={0}
//             sx={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               bgcolor: "rgba(255, 255, 255, 0.9)",
//               zIndex: 10,
//             }}
//           >
//             <Box sx={{ textAlign: "center" }}>
//               <CircularProgress
//                 size={48}
//                 sx={{
//                   mb: 2,
//                   color: "primary.main",
//                 }}
//               />
//               <Typography variant="body2" color="text.secondary">
//                 Loading page {pageNumber}...
//               </Typography>
//             </Box>
//           </Paper>
//         </Fade>
//       )}

//       {/* PDF Canvas Container - Always render but control opacity */}
//       <Paper
//         elevation={3}
//         sx={{
//           p: 2,
//           bgcolor: "white",
//           borderRadius: 1,
//           maxWidth: "100%",
//           overflow: "auto",
//           opacity: showCanvas ? 1 : 0,
//           transition: "opacity 200ms ease-in-out",
//           boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
//           visibility: showCanvas ? "visible" : "hidden",
//         }}
//       >
//         <canvas
//           ref={canvasRef}
//           style={{
//             borderRadius: 4,
//             maxWidth: "100%",
//             display: "block",
//           }}
//         />
//       </Paper>

//       {/* Page Indicator */}
//       {!isRendering && pdfDoc && showCanvas && (
//         <Box
//           sx={{
//             position: "absolute",
//             bottom: 16,
//             right: 16,
//             bgcolor: "rgba(0, 0, 0, 0.7)",
//             color: "white",
//             px: 1.5,
//             py: 0.5,
//             borderRadius: 1,
//             fontSize: "0.75rem",
//             zIndex: 5,
//             opacity: showCanvas ? 1 : 0,
//             transition: "opacity 200ms ease-in-out",
//           }}
//         >
//           Page {pageNumber} of {pdfDoc.numPages}
//         </Box>
//       )}
//     </Box>
//   );
// }

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { Box, Paper, CircularProgress, Typography, Fade } from "@mui/material";

// ✅ Worker setup
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

interface PdfSlideViewerProps {
  base64Pdf: string;
  pageNumber: number;
  onTotalPagesChange: (pages: number) => void;
  onLoadError?: (error: string) => void;
}

export default function PdfSlideViewer({
  base64Pdf,
  pageNumber,
  onTotalPagesChange,
  onLoadError,
}: PdfSlideViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  /**
   * Load PDF
   */
  useEffect(() => {
    if (!base64Pdf) return;

    let isMounted = true;

    const loadPdf = async () => {
      try {
        setIsRendering(true);

        const pdfData = Uint8Array.from(atob(base64Pdf), (c) =>
          c.charCodeAt(0),
        );

        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        const pdf = await loadingTask.promise;

        if (!isMounted) return;

        setPdfDoc(pdf);
        onTotalPagesChange(pdf.numPages);
        setIsRendering(false);
      } catch (error: any) {
        console.error("PDF load error:", error);
        setIsRendering(false);
        onLoadError?.(error.message);
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
      if (renderTaskRef.current) renderTaskRef.current.cancel();
    };
  }, [base64Pdf, onTotalPagesChange, onLoadError]);

  /**
   * Render Page (FULL WIDTH + HD)
   */
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

    try {
      setIsRendering(true);

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      const page = await pdfDoc.getPage(pageNumber);

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;

      // 🔥 BASE VIEWPORT
      const viewport = page.getViewport({ scale: 1 });

      // 🔥 FIT TO WIDTH
      const containerWidth = containerRef.current.clientWidth - 40;
      const scale = containerWidth / viewport.width;

      // 🔥 HIGH DPI FIX
      const devicePixelRatio = window.devicePixelRatio || 1;

      const scaledViewport = page.getViewport({
        scale: scale * devicePixelRatio,
      });

      // 🔥 SET CANVAS SIZE (REAL + DISPLAY)
      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      canvas.style.width = `${scaledViewport.width / devicePixelRatio}px`;
      canvas.style.height = `${scaledViewport.height / devicePixelRatio}px`;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);

      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport,
      };

      renderTaskRef.current = page.render(renderContext);
      await renderTaskRef.current.promise;

      setIsRendering(false);
    } catch (error: any) {
      if (error.name === "RenderingCancelledException") return;

      console.error("Render error:", error);
      setIsRendering(false);
      onLoadError?.(error.message);
    }
  }, [pdfDoc, pageNumber, onLoadError]);

  /**
   * Trigger render
   */
  useEffect(() => {
    renderPage();
  }, [renderPage]);

  /**
   * Re-render on resize
   */
  useEffect(() => {
    const handleResize = () => {
      renderPage();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderPage]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        bgcolor: "transparent", // Adobe-like background
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: 1,
        position: "relative",
      }}
    >
      {/* Loader */}
      {isRendering && (
        <Fade in={isRendering}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "rgba(255,255,255,0.7)",
              zIndex: 10,
            }}
          >
            <CircularProgress />
          </Box>
        </Fade>
      )}

      {/* PDF Page */}
      <Paper
        elevation={6}
        sx={{
          background: "white",
          padding: 2,
          boxShadow: "0 0 10px rgba(0,0,0,0.6)",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            borderRadius: 4,
          }}
        />
      </Paper>

      {/* Page Indicator below the canvas */}
      {pdfDoc && (
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            bgcolor: "rgba(0,0,0,0.7)",
            color: "white",
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontSize: "0.75rem",
          }}
        >
          Page {pageNumber} of {pdfDoc.numPages}
        </Box>
      )}
    </Box>
  );
}
