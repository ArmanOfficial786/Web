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

// const ReportNavigation = ({
//   currentPage,
//   totalPages,
//   totalRecords,
//   onPageChange,
//   searchText,
//   onSearchTextChange,
//   onPrint,
//   showDownloadMenu,
//   onToggleDownloadMenu,
//   onDownload,
// }: any) => {
//   return (
//     <div className="w-full min-h-[35px] bg-gradient-to-r from-gray-300 to-gray-200 border border-gray-400 rounded-t-lg flex flex-wrap justify-center items-center gap-4 md:gap-[150px] px-2 py-2 md:py-0 print:hidden">
//       <span className="text-sm text-gray-700 font-semibold">
//         {currentPage} of {totalPages}
//       </span>
//       <div className="flex items-center gap-2 border-r border-gray-400 pr-4">
//         <button
//           onClick={() => onPageChange(1)}
//           disabled={currentPage === 1}
//           className="p-2 hover:bg-gray-300 rounded disabled:opacity-50 transition-colors"
//           title="First Page"
//         >
//           <ChevronsLeft size={16} className="text-gray-700" />
//         </button>
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="p-2 hover:bg-gray-300 rounded disabled:opacity-50 transition-colors"
//           title="Previous Page"
//         >
//           <ChevronLeft size={16} className="text-gray-700" />
//         </button>
//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="p-2 hover:bg-gray-300 rounded disabled:opacity-50 transition-colors"
//           title="Next Page"
//         >
//           <ChevronRight size={16} className="text-gray-700" />
//         </button>
//         <button
//           onClick={() => onPageChange(totalPages)}
//           disabled={currentPage === totalPages}
//           className="p-2 hover:bg-gray-300 rounded disabled:opacity-50 transition-colors"
//           title="Last Page"
//         >
//           <ChevronsRight size={16} className="text-gray-700" />
//         </button>
//       </div>

//       <div className="flex items-center gap-2 border-r border-gray-400 pr-4">
//         <div className="relative">
//           <input
//             type="text"
//             value={searchText}
//             onChange={(e) => onSearchTextChange(e.target.value)}
//             placeholder="Search..."
//             className="w-[200px] pl-8 border bg-white border-gray-300 rounded h-[25px] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//           />
//           <Search
//             size={16}
//             className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
//           />
//         </div>
//         <button className="text-sm text-gray-700 hover:text-gray-900 font-semibold transition-colors">
//           Find
//         </button>
//         <span className="text-gray-700">|</span>
//         <button className="text-sm text-gray-700 hover:text-gray-900 font-semibold">
//           Next
//         </button>
//       </div>

//       <div className="ml-auto flex items-center gap-2">
//         <button
//           onClick={onPrint}
//           className="p-2 hover:bg-gray-300 rounded transition-colors flex items-center gap-1"
//           title="Print"
//         >
//           <Printer size={16} className="text-gray-700" />
//           <span className="text-sm text-gray-700 font-semibold hidden sm:inline">
//             Print
//           </span>
//         </button>

//         <div className="relative">
//           <button
//             onClick={onToggleDownloadMenu}
//             className="p-2 hover:bg-gray-300 rounded transition-colors flex items-center gap-1"
//             title="Download"
//           >
//             <Download size={16} className="text-gray-700" />
//             <ChevronDown size={14} className="text-gray-700" />
//           </button>

//           {showDownloadMenu && (
//             <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
//               <button
//                 onClick={() => onDownload("PDF")}
//                 className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-2 transition-colors border-b border-gray-200 text-sm"
//               >
//                 <FileText size={16} className="text-red-600" />
//                 <span>PDF</span>
//               </button>
//               <button
//                 onClick={() => onDownload("Word")}
//                 className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-2 transition-colors border-b border-gray-200 text-sm"
//               >
//                 <File size={16} className="text-blue-600" />
//                 <span>Word</span>
//               </button>
//               {/* <button
//                 onClick={() => onDownload("CSV")}
//                 className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-2 transition-colors border-b border-gray-200 text-sm"
//               >
//                 <Sheet size={16} className="text-green-600" />
//                 <span>CSV</span>
//               </button> */}
//               <button
//                 onClick={() => onDownload("Excel")}
//                 className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-2 transition-colors border-b border-gray-200 text-sm"
//               >
//                 <Sheet size={16} className="text-green-700" />
//                 <span>Excel</span>
//               </button>
//               <button
//                 onClick={() => onDownload("Image")}
//                 className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-2 transition-colors text-sm"
//               >
//                 <Image size={16} className="text-purple-600" />
//                 <span>Image</span>
//               </button>
//             </div>
//           )}
//           {/* Total Records */}
//         </div>
//       </div>
//       <div className="flex  text-sm text-gray-700 font-semibold">
//         Total Records: {totalRecords}
//       </div>
//     </div>
//   );
// };
// export default ReportNavigation;

"use client";
import React from "react";
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
import { ReportFormat } from "@/components/MemberReport";

interface ReportNavigationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  searchText: string;
  onSearchTextChange: (text: string) => void;
  onPrint: () => void;
  showDownloadMenu: boolean;
  onToggleDownloadMenu: () => void;
  onDownload: (format: ReportFormat) => void;
}

const ReportNavigation: React.FC<ReportNavigationProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onPageSizeChange,
  searchText,
  onSearchTextChange,
  onPrint,
  showDownloadMenu,
  onToggleDownloadMenu,
  onDownload,
}) => {
  return (
    <div className="w-full min-h-[35px] bg-gradient-to-r from-gray-300 to-gray-200 border border-gray-400 rounded-t-lg flex flex-wrap justify-center items-center gap-4 md:gap-8 px-2 py-2 md:py-0 print:hidden">
      {/* Page Info */}
      <span className="text-sm text-gray-700 font-semibold">
        Page {currentPage} of {totalPages}
      </span>

      {/* Page Size Selector */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-700 font-semibold">Show:</label>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-gray-300 rounded h-[28px] text-sm px-2 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-sm text-gray-700">per page</span>
      </div>

      {/* Pagination Buttons */}
      <div className="flex items-center gap-2 border-r border-gray-400 pr-4">
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPreviousPage}
          className="p-2 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="First Page"
        >
          <ChevronsLeft size={16} className="text-gray-700" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          className="p-2 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Previous Page"
        >
          <ChevronLeft size={16} className="text-gray-700" />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="p-2 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Next Page"
        >
          <ChevronRight size={16} className="text-gray-700" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          className="p-2 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Last Page"
        >
          <ChevronsRight size={16} className="text-gray-700" />
        </button>
      </div>

      <div className="flex items-center gap-2 border-r border-gray-400 pr-4">
        <div className="relative">
          <input
            type="text"
            value={searchText}
            onChange={(e) => onSearchTextChange(e.target.value)}
            placeholder="Search..."
            className="w-[200px] pl-8 border bg-white border-gray-300 rounded h-[25px] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <Search
            size={16}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          />
        </div>
        <button className="text-sm text-gray-700 hover:text-gray-900 font-semibold transition-colors">
          Find
        </button>
        <span className="text-gray-700">|</span>
        <button className="text-sm text-gray-700 hover:text-gray-900 font-semibold">
          Next
        </button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onPrint}
          className="p-2 hover:bg-gray-300 rounded transition-colors flex items-center gap-1"
          title="Print"
        >
          <Printer size={16} className="text-gray-700" />
          <span className="text-sm text-gray-700 font-semibold hidden sm:inline">
            Print
          </span>
        </button>

        <div className="relative">
          <button
            onClick={onToggleDownloadMenu}
            className="p-2 hover:bg-gray-300 rounded transition-colors flex items-center gap-1"
            title="Download"
          >
            <Download size={16} className="text-gray-700" />
            <ChevronDown size={14} className="text-gray-700" />
          </button>

          {showDownloadMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
              <button
                onClick={() => onDownload("PDF")}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-2 transition-colors border-b border-gray-200 text-sm"
              >
                <FileText size={16} className="text-red-600" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => onDownload("Word")}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-2 transition-colors border-b border-gray-200 text-sm"
              >
                <File size={16} className="text-blue-600" />
                <span>Word</span>
              </button>
              <button
                onClick={() => onDownload("Excel")}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-2 transition-colors border-b border-gray-200 text-sm"
              >
                <Sheet size={16} className="text-green-700" />
                <span>Excel</span>
              </button>
              <button
                onClick={() => onDownload("Image")}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-2 transition-colors text-sm"
              >
                <Image size={16} className="text-purple-600" />
                <span>Image</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex text-sm text-gray-700 font-semibold">
        Total Records: {totalRecords}
      </div>
    </div>
  );
};

export default ReportNavigation;
