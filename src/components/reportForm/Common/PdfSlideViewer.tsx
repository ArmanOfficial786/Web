// "use client";

// import { useEffect, useRef, useState, useCallback } from "react";
// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
// import { Box, Paper, CircularProgress, Typography, Fade } from "@mui/material";

// // ✅ Worker setup
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

//   const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
//   const [isRendering, setIsRendering] = useState(false);

//   const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

//   /**
//    * Load PDF
//    */
//   useEffect(() => {
//     if (!base64Pdf) return;

//     let isMounted = true;

//     const loadPdf = async () => {
//       try {
//         setIsRendering(true);

//         const pdfData = Uint8Array.from(atob(base64Pdf), (c) =>
//           c.charCodeAt(0),
//         );

//         const loadingTask = pdfjsLib.getDocument({ data: pdfData });
//         const pdf = await loadingTask.promise;

//         if (!isMounted) return;

//         setPdfDoc(pdf);
//         onTotalPagesChange(pdf.numPages);
//         setIsRendering(false);
//       } catch (error: any) {
//         console.error("PDF load error:", error);
//         setIsRendering(false);
//         onLoadError?.(error.message);
//       }
//     };

//     loadPdf();

//     return () => {
//       isMounted = false;
//       if (renderTaskRef.current) renderTaskRef.current.cancel();
//     };
//   }, [base64Pdf, onTotalPagesChange, onLoadError]);

//   /**
//    * Render Page (FULL WIDTH + HD)
//    */
//   const renderPage = useCallback(async () => {
//     if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

//     try {
//       setIsRendering(true);

//       if (renderTaskRef.current) {
//         renderTaskRef.current.cancel();
//       }

//       const page = await pdfDoc.getPage(pageNumber);

//       const canvas = canvasRef.current;
//       const context = canvas.getContext("2d");
//       if (!context) return;

//       // 🔥 BASE VIEWPORT
//       const viewport = page.getViewport({ scale: 1 });

//       // 🔥 FIT TO WIDTH
//       const containerWidth = containerRef.current.clientWidth - 40;
//       const scale = containerWidth / viewport.width;

//       // 🔥 HIGH DPI FIX
//       const devicePixelRatio = window.devicePixelRatio || 1;

//       const scaledViewport = page.getViewport({
//         scale: scale * devicePixelRatio,
//       });

//       // 🔥 SET CANVAS SIZE (REAL + DISPLAY)
//       canvas.width = scaledViewport.width;
//       canvas.height = scaledViewport.height;

//       canvas.style.width = `${scaledViewport.width / devicePixelRatio}px`;
//       canvas.style.height = `${scaledViewport.height / devicePixelRatio}px`;

//       context.setTransform(1, 0, 0, 1, 0, 0);
//       context.clearRect(0, 0, canvas.width, canvas.height);

//       const renderContext = {
//         canvasContext: context,
//         viewport: scaledViewport,
//       };

//       renderTaskRef.current = page.render(renderContext);
//       await renderTaskRef.current.promise;

//       setIsRendering(false);
//     } catch (error: any) {
//       if (error.name === "RenderingCancelledException") return;

//       console.error("Render error:", error);
//       setIsRendering(false);
//       onLoadError?.(error.message);
//     }
//   }, [pdfDoc, pageNumber, onLoadError]);

//   /**
//    * Trigger render
//    */
//   useEffect(() => {
//     renderPage();
//   }, [renderPage]);

//   /**
//    * Re-render on resize
//    */
//   useEffect(() => {
//     const handleResize = () => {
//       renderPage();
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [renderPage]);

//   return (
//     <Box
//       ref={containerRef}
//       sx={{
//         width: "100%",
//         height: "100%",
//         overflow: "auto",
//         bgcolor: "transparent", // Adobe-like background
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "flex-start",
//         p: 1,
//         position: "relative",
//       }}
//     >
//       {/* Loader */}
//       {isRendering && (
//         <Fade in={isRendering}>
//           <Box
//             sx={{
//               position: "absolute",
//               top: 0,
//               bottom: 0,
//               left: 0,
//               right: 0,
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               bgcolor: "rgba(255,255,255,0.7)",
//               zIndex: 10,
//             }}
//           >
//             <CircularProgress />
//           </Box>
//         </Fade>
//       )}

//       {/* PDF Page */}
//       <Paper
//         elevation={6}
//         sx={{
//           background: "white",
//           padding: 2,
//           boxShadow: "0 0 10px rgba(0,0,0,0.6)",
//         }}
//       >
//         <canvas
//           ref={canvasRef}
//           style={{
//             display: "block",
//             borderRadius: 4,
//           }}
//         />
//       </Paper>

//       {/* Page Indicator below the canvas */}
//       {pdfDoc && (
//         <Box
//           sx={{
//             position: "absolute",
//             bottom: 16,
//             right: 16,
//             bgcolor: "rgba(0,0,0,0.7)",
//             color: "white",
//             px: 1.5,
//             py: 0.5,
//             borderRadius: 1,
//             fontSize: "0.75rem",
//           }}
//         >
//           Page {pageNumber} of {pdfDoc.numPages}
//         </Box>
//       )}
//     </Box>
//   );
// }

import React from "react";

function PdfSlideViewer() {
  return <div>pdf slide viewer</div>;
}

export default PdfSlideViewer;
