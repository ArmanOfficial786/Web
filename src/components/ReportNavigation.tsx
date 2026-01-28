// "use client";
// import React from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
//   Search,
//   Printer,
//   Download,
//   FileText,
//   File,
//   Sheet,
//   Image,
//   ChevronDown,
// } from "lucide-react";
// import { ReportFormat } from "@/components/MemberReport";
// import { useLanguage } from "@/contexts/LanguageContext";

// interface ReportNavigationProps {
//   currentPage: number;
//   totalPages: number;
//   totalRecords: number;
//   pageSize: number;
//   hasNextPage: boolean;
//   hasPreviousPage: boolean;
//   onPageChange: (page: number) => void;
//   onPageSizeChange: (size: number) => void;
//   searchText: string;
//   onSearchTextChange: (text: string) => void;
//   onPrint: () => void;
//   showDownloadMenu: boolean;
//   onToggleDownloadMenu: () => void;
//   onDownload: (format: ReportFormat) => void;
// }

// const ReportNavigation: React.FC<ReportNavigationProps> = ({
//   currentPage,
//   totalPages,
//   totalRecords,
//   pageSize,
//   hasNextPage,
//   hasPreviousPage,
//   onPageChange,
//   onPageSizeChange,
//   searchText,
//   onSearchTextChange,
//   onPrint,
//   showDownloadMenu,
//   onToggleDownloadMenu,
//   onDownload,
// }) => {
//   const { t, interpolate } = useLanguage();
//   return (
//     <div className="w-full min-h-[35px]  border  rounded-md flex  justify-around items-center gap-4 md:gap-0   print:hidden">
//       {/* Page Info */}
//       <span className="text-sm  font-semibold px-2">
//         {interpolate(t("pageOf"), {
//           currentPage: currentPage.toString(),
//           totalPages: totalPages.toString(),
//         })}
//       </span>

//       {/* <div className="flex items-center gap-2">
//         <label className="text-sm  font-semibold">{t("show")}</label>
//         <select
//           value={pageSize}
//           onChange={(e) => onPageSizeChange(Number(e.target.value))}
//           className="  border  rounded h-[28px] text-sm px-2  focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//         >
//           <option value={10}>10</option>
//           <option value={15}>15</option>
//           <option value={25}>25</option>
//           <option value={50}>50</option>
//           <option value={100}>100</option>
//         </select>
//         <span className="text-sm ">{t("perPage")}</span>
//       </div> */}

//       {/* Pagination Buttons */}
//       <div className="flex items-center gap-2 border-r border-gray-400 pr-4">
//         <button
//           onClick={() => onPageChange(1)}
//           disabled={!hasPreviousPage}
//           className="p-2  rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           title="First Page"
//         >
//           <ChevronsLeft size={16} />
//         </button>
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={!hasPreviousPage}
//           className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           title="Previous Page"
//         >
//           <ChevronLeft size={16} />
//         </button>
//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={!hasNextPage}
//           className="p-2  rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           title="Next Page"
//         >
//           <ChevronRight size={16} />
//         </button>
//         <button
//           onClick={() => onPageChange(totalPages)}
//           disabled={!hasNextPage}
//           className="p-2  rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           title="Last Page"
//         >
//           <ChevronsRight size={16} />
//         </button>
//       </div>

//       <div className="flex items-center gap-2 border-r border-gray-400 pr-4">
//         <div className="relative">
//           <input
//             type="text"
//             value={searchText}
//             onChange={(e) => onSearchTextChange(e.target.value)}
//             placeholder={t("search")}
//             className="w-[200px] pl-8 border border-gray-300 rounded h-[25px] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//           />
//           <Search
//             size={16}
//             className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
//           />
//         </div>
//         <button className="text-sm text-gray-700 hover:text-gray-900 font-semibold transition-colors">
//           {t("find")}
//         </button>
//         <span className="">|</span>
//         <button className="text-sm text-gray-700 hover:text-gray-900 font-semibold">
//           {t("next")}
//         </button>
//       </div>

//       <div className=" flex items-center gap-2">
//         <button
//           onClick={onPrint}
//           className="p-2  rounded transition-colors flex items-center gap-1"
//           title={t("print")}
//         >
//           <Printer size={16} className="" />
//           <span className="text-sm  font-semibold hidden sm:inline">
//             {t("print")}
//           </span>
//         </button>

//         <div className="relative">
//           <button
//             onClick={onToggleDownloadMenu}
//             className="p-2  rounded transition-colors flex items-center gap-1"
//             title="Download"
//           >
//             <Download size={16} className="" />
//             <ChevronDown size={14} className="" />
//           </button>

//           {showDownloadMenu && (
//             <div className="card absolute right-0 mt-2 w-40 border rounded-lg shadow-lg z-[9999] bg-white  dark:bg-gray-800">
//               <button
//                 onClick={() => onDownload("PDF")}
//                 className="w-full px-4 py-3 text-left flex items-center gap-2 transition-colors border-b border-gray-200 text-sm hover:bg-slate-300 dark:hover:bg-gray-700"
//               >
//                 <FileText size={16} className=" " />
//                 <span>{t("pdf")}</span>
//               </button>
//               <button
//                 onClick={() => onDownload("Word")}
//                 className="w-full px-4 py-3 text-left flex items-center gap-2 transition-colors border-b border-gray-200 text-sm  hover:bg-slate-300 dark:hover:bg-gray-700"
//               >
//                 <File size={16} className="text-blue-600" />
//                 <span>{t("word")}</span>
//               </button>
//               <button
//                 onClick={() => onDownload("Excel")}
//                 className="w-full px-4 py-3 text-left flex items-center gap-2 transition-colors border-b border-gray-200 text-sm  hover:bg-slate-300 dark:hover:bg-gray-700"
//               >
//                 <Sheet size={16} className="text-green-700" />
//                 <span>{t("excel")}</span>
//               </button>
//               <button
//                 onClick={() => onDownload("Image")}
//                 className="w-full px-4 py-3 text-left  flex items-center gap-2 transition-colors text-sm hover:bg-slate-300 dark:hover:bg-gray-700"
//               >
//                 <Image size={16} className="text-purple-600" />
//                 <span>{t("image")}</span>
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//       {/* <div className="ml-5 px-2 flex text-sm  font-semibold">
//         {interpolate(t("totalRecords"), {
//           totalRecords: totalRecords.toString(),
//         })}
//       </div> */}
//     </div>
//   );
// };

// export default ReportNavigation;

"use client";
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Printer,
  Download,
  FileText,
  File,
  Sheet,
  Image,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";
import { useLanguage } from "@/contexts/LanguageContext";

export type ReportFormat = "PDF" | "Word" | "Excel" | "Image";

interface ReportNavigationProps {
  // PDF and page data
  pdfData: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  // Report generation config for downloads
  reportConfig: {
    apiEndpoint: string;
    requestBody: Record<string, any>;
    fileNamePrefix: string;
  };
}

const ReportNavigation: React.FC<ReportNavigationProps> = ({
  pdfData,
  currentPage,
  totalPages,
  onPageChange,
  reportConfig,
}) => {
  const { t, interpolate } = useLanguage();

  // Internal state for navigation features
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  // Computed navigation states
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Navigate to first page

  const goToFirstPage = () => {
    if (hasPreviousPage) {
      onPageChange(1);
    }
  };

  // Navigate to previous page

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      onPageChange(currentPage - 1);
    }
  };

  // Navigate to next page

  const goToNextPage = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  // Navigate to last page

  const goToLastPage = () => {
    if (hasNextPage) {
      onPageChange(totalPages);
    }
  };

  // Toggle download menu visibility

  const toggleDownloadMenu = () => {
    setShowDownloadMenu(!showDownloadMenu);
  };

  // Opens PDF in new window for printing

  const handlePrint = () => {
    if (!pdfData) {
      toast.error("No report data available to print");
      return;
    }

    try {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>Print Report</title></head>
            <body style="margin:0;">
              <embed width="100%" height="100%" 
                     src="data:application/pdf;base64,${pdfData}" 
                     type="application/pdf" />
            </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
      } else {
        toast.error(
          "Unable to open print window. Please check your popup blocker.",
        );
      }
    } catch (error) {
      console.error("Print error:", error);
      toast.error("Failed to print report");
    }
  };

  // Makes API call to get report in requested format

  const handleDownload = async (format: ReportFormat) => {
    setShowDownloadMenu(false);
    setIsDownloading(true);

    try {
      // Format mapping
      const formatMap: Record<ReportFormat, string> = {
        PDF: "pdf",
        Word: "word",
        Excel: "xlsx",
        Image: "png",
      };

      const formatParam = formatMap[format];
      const url = `${reportConfig.apiEndpoint}?format=${formatParam}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "*/*" },
        body: JSON.stringify(reportConfig.requestBody),
      });

      if (!response.ok) {
        throw new Error(`Failed to download report: ${response.status}`);
      }

      // Convert response to blob and download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      // Extension mapping
      const extensionMap: Record<string, string> = {
        pdf: "pdf",
        word: "docx",
        xlsx: "xlsx",
        png: "png",
      };

      const extension = extensionMap[formatParam] || formatParam;
      const timestamp = new Date().toISOString().split("T")[0];

      link.setAttribute(
        "download",
        `${reportConfig.fileNamePrefix}_${timestamp}.${extension}`,
      );

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success(`${format} downloaded successfully`);
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error(error.message || `Failed to download ${format}`);
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle search text change

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // TODO: Implement actual search functionality with PDF.js

  const handleFind = () => {
    if (searchText.trim()) {
      console.log("Searching for:", searchText);
      // TODO: Implement search logic using PDF.js find API
      toast.info("Search functionality coming soon");
    }
  };

  // TODO: Implement find next functionality

  const handleFindNext = () => {
    if (searchText.trim()) {
      console.log("Finding next:", searchText);
      // TODO: Implement find next logic
      toast.info("Find next functionality coming soon");
    }
  };

  // Handle Enter key in search input

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleFind();
    }
  };

  return (
    <div className="w-full min-h-[35px] border rounded-md flex justify-around items-center gap-4 md:gap-0 print:hidden">
      {/* Page Info */}
      <span className="text-sm font-semibold px-2">
        {interpolate(t("pageOf"), {
          currentPage: currentPage.toString(),
          totalPages: totalPages.toString(),
        })}
      </span>

      {/* Pagination Buttons */}
      <div className="flex items-center gap-2 border-r border-gray-400 pr-4">
        <button
          onClick={goToFirstPage}
          disabled={!hasPreviousPage}
          className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          title="First Page"
          aria-label="Go to first page"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          onClick={goToPreviousPage}
          disabled={!hasPreviousPage}
          className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          title="Previous Page"
          aria-label="Go to previous page"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={goToNextPage}
          disabled={!hasNextPage}
          className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          title="Next Page"
          aria-label="Go to next page"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={goToLastPage}
          disabled={!hasNextPage}
          className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          title="Last Page"
          aria-label="Go to last page"
        >
          <ChevronsRight size={16} />
        </button>
      </div>

      {/* Search Section */}
      <div className="flex items-center gap-2 border-r border-gray-400 pr-4">
        <div className="relative">
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            placeholder={t("search")}
            className="w-[200px] pl-8 border border-gray-300 rounded h-[25px] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            aria-label="Search in report"
          />
          <Search
            size={16}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
        </div>
        <button
          onClick={handleFind}
          disabled={!searchText.trim()}
          className="text-sm text-gray-700 hover:text-gray-900 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Find text"
        >
          {t("find")}
        </button>
        <span className="text-gray-400">|</span>
        <button
          onClick={handleFindNext}
          disabled={!searchText.trim()}
          className="text-sm text-gray-700 hover:text-gray-900 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Find next occurrence"
        >
          {t("next")}
        </button>
      </div>

      {/* Action Buttons - Print & Download */}
      <div className="flex items-center gap-2">
        {/* Print Button */}
        <button
          onClick={handlePrint}
          disabled={!pdfData}
          className="p-2 rounded hover:bg-gray-100 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          title={t("print")}
          aria-label="Print report"
        >
          <Printer size={16} />
          <span className="text-sm font-semibold hidden sm:inline">
            {t("print")}
          </span>
        </button>

        {/* Download Menu */}
        <div className="relative">
          <button
            onClick={toggleDownloadMenu}
            disabled={isDownloading}
            className="p-2 rounded hover:bg-gray-100 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download"
            aria-label="Download report"
            aria-expanded={showDownloadMenu}
          >
            <Download size={16} />
            <ChevronDown size={14} />
          </button>

          {showDownloadMenu && (
            <>
              {/* Backdrop to close menu when clicking outside */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDownloadMenu(false)}
              />

              {/* Download Menu */}
              <div className="absolute right-0 mt-2 w-40 border rounded-lg shadow-lg z-20 bg-white dark:bg-gray-800">
                <button
                  onClick={() => handleDownload("PDF")}
                  disabled={isDownloading}
                  className="w-full px-4 py-3 text-left flex items-center gap-2 transition-colors border-b border-gray-200 text-sm hover:bg-slate-300 dark:hover:bg-gray-700 rounded-t-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Download as PDF"
                >
                  <FileText size={16} className="text-red-600" />
                  <span>{t("pdf")}</span>
                </button>
                <button
                  onClick={() => handleDownload("Word")}
                  disabled={isDownloading}
                  className="w-full px-4 py-3 text-left flex items-center gap-2 transition-colors border-b border-gray-200 text-sm hover:bg-slate-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Download as Word"
                >
                  <File size={16} className="text-blue-600" />
                  <span>{t("word")}</span>
                </button>
                <button
                  onClick={() => handleDownload("Excel")}
                  disabled={isDownloading}
                  className="w-full px-4 py-3 text-left flex items-center gap-2 transition-colors border-b border-gray-200 text-sm hover:bg-slate-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Download as Excel"
                >
                  <Sheet size={16} className="text-green-700" />
                  <span>{t("excel")}</span>
                </button>
                <button
                  onClick={() => handleDownload("Image")}
                  disabled={isDownloading}
                  className="w-full px-4 py-3 text-left flex items-center gap-2 transition-colors text-sm hover:bg-slate-300 dark:hover:bg-gray-700 rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Download as Image"
                >
                  <Image size={16} className="text-purple-600" />
                  <span>{t("image")}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportNavigation;
