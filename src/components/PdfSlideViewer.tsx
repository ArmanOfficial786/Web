"use client";

import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

interface PdfSlideViewerProps {
  base64Pdf: string;
  pageNumber: number;
  onTotalPages: (pages: number) => void;
  onLoadError?: (error: string) => void;
}

export default function PdfSlideViewer({
  base64Pdf,
  pageNumber,
  onTotalPages,
  onLoadError,
}: PdfSlideViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  // Load PDF document once when base64Pdf changes
  useEffect(() => {
    if (!base64Pdf) return;

    let isMounted = true;

    const loadPdf = async () => {
      try {
        setIsRendering(true);

        // Convert base64 to Uint8Array
        const pdfData = Uint8Array.from(atob(base64Pdf), (c) =>
          c.charCodeAt(0),
        );

        // Load PDF document
        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        const pdf = await loadingTask.promise;

        if (!isMounted) return;

        setPdfDoc(pdf);
        onTotalPages(pdf.numPages);
        setIsRendering(false);
      } catch (error: any) {
        console.error("Error loading PDF:", error);
        if (isMounted) {
          setIsRendering(false);
          onLoadError?.(error.message || "Failed to load PDF");
        }
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
    };
  }, [base64Pdf, onTotalPages, onLoadError]);

  // Render specific page when pageNumber or pdfDoc changes
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let isMounted = true;

    const renderPage = async () => {
      try {
        setIsRendering(true);

        const page = await pdfDoc.getPage(pageNumber);

        if (!isMounted) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        // Calculate scale to fit container width
        const container = canvas.parentElement;
        const containerWidth = container?.clientWidth || 800;
        const viewport = page.getViewport({ scale: 1.0 });

        // Calculate scale (max 2.0 for quality)
        const scale = Math.min((containerWidth - 40) / viewport.width, 2.0);
        const scaledViewport = page.getViewport({ scale });

        // Set canvas dimensions
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        // Clear canvas before rendering
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Render PDF page
        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
        };

        await page.render(renderContext).promise;

        if (isMounted) {
          setIsRendering(false);
        }
      } catch (error: any) {
        console.error("Error rendering page:", error);
        if (isMounted) {
          setIsRendering(false);
          onLoadError?.(error.message || "Failed to render page");
        }
      }
    };

    renderPage();

    return () => {
      isMounted = false;
    };
  }, [pdfDoc, pageNumber, onLoadError]);

  return (
    <div className="flex justify-center items-center bg-gray-100 p-4 min-h-[600px] relative">
      {isRendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Rendering page...</p>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="shadow-lg rounded bg-white max-w-full"
        style={{ display: isRendering ? "none" : "block" }}
      />
    </div>
  );
}
