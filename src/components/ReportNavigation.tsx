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
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t, interpolate } = useLanguage();
  return (
    <div className="w-full min-h-[35px]  border  rounded-md flex  justify-around items-center gap-4 md:gap-0   print:hidden">
      {/* Page Info */}
      <span className="text-sm  font-semibold px-2">
        {interpolate(t("pageOf"), {
          currentPage: currentPage.toString(),
          totalPages: totalPages.toString(),
        })}
      </span>

      {/* Page Size Selector */}
      <div className="flex items-center gap-2">
        <label className="text-sm  font-semibold">{t("show")}</label>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="  border  rounded h-[28px] text-sm px-2  focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-sm ">{t("perPage")}</span>
      </div>

      {/* Pagination Buttons */}
      <div className="flex items-center gap-2 border-r border-gray-400 pr-4">
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPreviousPage}
          className="p-2  rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="First Page"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Previous Page"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="p-2  rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Next Page"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          className="p-2  rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Last Page"
        >
          <ChevronsRight size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2 border-r border-gray-400 pr-4">
        <div className="relative">
          <input
            type="text"
            value={searchText}
            onChange={(e) => onSearchTextChange(e.target.value)}
            placeholder={t("search")}
            className="w-[200px] pl-8 border border-gray-300 rounded h-[25px] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <Search
            size={16}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          />
        </div>
        <button className="text-sm text-gray-700 hover:text-gray-900 font-semibold transition-colors">
          {t("find")}
        </button>
        <span className="">|</span>
        <button className="text-sm text-gray-700 hover:text-gray-900 font-semibold">
          {t("next")}
        </button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onPrint}
          className="p-2  rounded transition-colors flex items-center gap-1"
          title={t("print")}
        >
          <Printer size={16} className="" />
          <span className="text-sm  font-semibold hidden sm:inline">
            {t("print")}
          </span>
        </button>

        <div className="relative">
          <button
            onClick={onToggleDownloadMenu}
            className="p-2  rounded transition-colors flex items-center gap-1"
            title="Download"
          >
            <Download size={16} className="" />
            <ChevronDown size={14} className="" />
          </button>

          {showDownloadMenu && (
            <div className="absolute right-0 mt-2 w-40 border rounded-lg shadow-lg z-50">
              <button
                onClick={() => onDownload("PDF")}
                className="w-full px-4 py-3 text-left flex items-center gap-2 transition-colors border-b border-gray-200 text-sm"
              >
                <FileText size={16} className="text-red-600" />
                <span>{t("pdf")}</span>
              </button>
              <button
                onClick={() => onDownload("Word")}
                className="w-full px-4 py-3 text-left flex items-center gap-2 transition-colors border-b border-gray-200 text-sm"
              >
                <File size={16} className="text-blue-600" />
                <span>{t("word")}</span>
              </button>
              <button
                onClick={() => onDownload("Excel")}
                className="w-full px-4 py-3 text-left flex items-center gap-2 transition-colors border-b border-gray-200 text-sm"
              >
                <Sheet size={16} className="text-green-700" />
                <span>{t("excel")}</span>
              </button>
              <button
                onClick={() => onDownload("Image")}
                className="w-full px-4 py-3 text-left  flex items-center gap-2 transition-colors text-sm"
              >
                <Image size={16} className="text-purple-600" />
                <span>{t("image")}</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="ml-5 px-2 flex text-sm  font-semibold">
        {interpolate(t("totalRecords"), {
          totalRecords: totalRecords.toString(),
        })}
      </div>
    </div>
  );
};

export default ReportNavigation;
