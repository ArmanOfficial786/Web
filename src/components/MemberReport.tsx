"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import { RefreshCw } from "lucide-react";
import ReportNavigation from "@/components/ReportNavigation";
import { useLanguage } from "@/contexts/LanguageContext";
import PdfSlideViewer from "./PdfSlideViewer";

export type ReportFormat = "PDF" | "Word" | "Excel" | "Image";

interface FormInputs {
  startDate: string;
  endDate: string;
}

// Validation schema
const schema = yup.object({
  startDate: yup
    .string()
    .required("Start Date is required")
    .test("not-empty", "Start Date is required", (value) => {
      return value !== "" && value !== undefined && value !== null;
    }),
  endDate: yup
    .string()
    .required("End Date is required")
    .test("not-empty", "End Date is required", (value) => {
      return value !== "" && value !== undefined && value !== null;
    })
    .test("date-min", "End Date cannot be before Start Date", function (value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;
      return new Date(value) >= new Date(startDate);
    }),
});

const MemberReportViewer = () => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [loading, setLoading] = useState(false);
  const [reportLoaded, setReportLoaded] = useState(false);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [htmlReport, setHtmlReport] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      startDate: "2024-12-01",
      endDate: "2025-12-19",
    },
  });

  const generateReport = async (
    format?: string,
    page: number = 1,
    size: number = pageSize,
  ) => {
    setLoading(true);
    setError("");

    try {
      const values = getValues();

      const requestBody = {
        fromDate: values.startDate,
        toDate: values.endDate,
        branchId: 0,
        memberGroupId: 0,
        currentPage: page,
        pageSize: size,
      };

      // Build URL with format query parameter only if format is provided
      // const url = format
      //   ? `http://localhost:5106/api/MemberDetailReport/generate?format=${format}`
      //   : `http://localhost:5106/api/MemberDetailReport/generate`;

      const url = format
        ? `http://localhost:5106/api/MemberDetail/MemberDetailReport?format=${format}`
        : `http://localhost:5106/api/MemberDetail/MemberDetailReport`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to generate report: ${response.status} ${response.statusText}`,
        );
      }

      // Handle HTML format (for viewing) - when no format or format is html
      if (!format || format.toLowerCase() === "html") {
        const data = await response.json();
        console.log("API Response:", data);

        if (!data.success) {
          toast.error("Report generation failed");
          setError("Report generation failed on server");
          return;
        }

        if (!data.pdfData) {
          console.error("No HTML content found. Full response:", data);
          toast.error("No report content available");
          setError("No HTML content in response");
          return;
        }

        setHtmlReport(data.pdfData);
        setReportLoaded(true);

        // Handle pagination from backend response
        if (data.pagination) {
          console.log("Setting pagination:", data.pagination);
          setCurrentPage(data.pagination.currentPage || page);
          setTotalPages(data.pagination.totalPages || 1);
          setTotalRecords(data.pagination.totalRecords || 0);
          setPageSize(data.pagination.pageSize || size);
          setHasNextPage(data.pagination.hasNextPage || false);
          setHasPreviousPage(data.pagination.hasPreviousPage || false);
        } else {
          console.warn("No pagination data in response");
          setCurrentPage(page);
          setTotalPages(1);
          setTotalRecords(0);
          setHasNextPage(false);
          setHasPreviousPage(false);
        }

        toast.success(`Page ${page} loaded successfully`);
      } else {
        // Handle other formats (for downloading)
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        const extensionMap: Record<string, string> = {
          pdf: "pdf",
          word: "docx",
          docx: "docx",
          xlsx: "xlsx",
          excel: "xlsx",
          png: "png",
          image: "png",
        };

        const formatLower = format.toLowerCase();
        const extension = extensionMap[formatLower] || formatLower;
        const filename = `MemberReport_${values.startDate}_to_${values.endDate}.${extension}`;
        link.setAttribute("download", filename);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success(
          `${format?.toUpperCase()} report downloaded successfully`,
        );
      }
    } catch (err: any) {
      console.error("Generate report error:", err);
      const errorMessage = err.message || "Failed to generate report";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format: ReportFormat) => {
    setShowDownloadMenu(false);

    const formatMap = {
      PDF: "pdf",
      Word: "word",
      Excel: "xlsx",
      Image: "png",
    };

    const apiFormat = formatMap[format] || format.toLowerCase();
    await generateReport(apiFormat);
  };

  const handlePrint = () => {
    window.print();
  };

  // const fetchReport = async (page: number) => {
  //   await generateReport(); // No format parameter - backend defaults to HTML
  // };

  const onSubmit = (data: FormInputs) => {
    console.log("Form submitted with data:", data);
    setCurrentPage(1);
    generateReport(undefined, 1, pageSize);
  };

  const handlePageChange = (newPage: number) => {
    console.log("🔄 Page change requested:", {
      currentPage,
      newPage,
      totalPages,
      isValid: newPage >= 1 && newPage <= totalPages && newPage !== currentPage,
    });

    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      console.log("✓ Fetching new page:", newPage);
      generateReport(undefined, newPage, pageSize);
    } else {
      console.log("❌ Page change rejected");
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    console.log("📊 Page size changed:", newSize);
    setPageSize(newSize);
    setCurrentPage(1);
    generateReport(undefined, 1, newSize);
  };

  return (
    <div className=" card  flex flex-col   rounded-lg shadow-md overflow-visible">
      {/* Filter Section as Card */}
      <div className="md:p-4 border-b ">
        <div className=" shadow-md rounded-lg">
          <div className="flex justify-center items-center gap-20 border  rounded-lg p-2">
            {/* Start Date */}
            <div className="flex flex-col">
              <label className="font-semibold text-sm  mb-1">
                {t("startDate")}
              </label>
              <input
                type="date"
                {...register("startDate")}
                className={`w-full md:w-[200px] border rounded h-[30px] text-sm px-2 focus:outline-none focus:ring-2 ${
                  errors.startDate
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {errors.startDate && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.startDate.message}
                </span>
              )}
            </div>

            {/* End Date */}
            <div className="flex flex-col">
              <label className="font-semibold text-sm  mb-1">
                {t("toDate")}
              </label>
              <input
                type="date"
                {...register("endDate")}
                className={`w-full md:w-[200px] border rounded h-[30px] text-sm px-2 focus:outline-none focus:ring-2 ${
                  errors.endDate
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {errors.endDate && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.endDate.message}
                </span>
              )}
            </div>

            {/* Generate Report Button */}
            <div className="flex flex-col justify-end items-end h-[55px]">
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                className="w-full md:w-[150px] h-[35px] bg-green-500  font-semibold rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors md:mt-5"
              >
                {loading ? t("generating") : t("generateReport")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      {reportLoaded && (
        <div className="sticky top-0 z-20">
          <ReportNavigation
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            pageSize={pageSize}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            searchText={searchText}
            onSearchTextChange={setSearchText}
            onPrint={handlePrint}
            showDownloadMenu={showDownloadMenu}
            onToggleDownloadMenu={() => setShowDownloadMenu(!showDownloadMenu)}
            onDownload={handleDownload}
          />
        </div>
      )}
      {/* </div> */}

      {/* Report Content - Scrollable */}
      <div
        className=" w-full overflow-auto  rounded-b-lg "
        style={{ height: "100vh" }}
      >
        {loading ? (
          <div className="h-full rounded-lg p-4 md:p-8 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw
                size={48}
                className="animate-spin text-blue-500 mx-auto mb-4"
              />
              <p className="">{t("generatingReport")}</p>
            </div>
          </div>
        ) : error ? (
          <div className="h-full  rounded-b-lg p-4 md:p-8 text-center text-red-500 flex items-center justify-center">
            <div>
              <p className="text-base md:text-lg font-semibold mb-2">
                {t("error")}
              </p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : reportLoaded ? (
          <div
            key={currentPage}
            className="flex justify-center items-center p-2 md:p-2"
            style={{
              minHeight: "100%",
            }}
          >
            <div className="w-full flex justify-center ">
              {/* {htmlReport && (
                <div
                  dangerouslySetInnerHTML={{ __html: htmlReport }}
                  className="card"
                  style={{ maxWidth: "1200px", margin: "0 auto" }}
                />
              )} */}
              {htmlReport && (
                <PdfSlideViewer
                  base64Pdf={htmlReport}
                  pageNumber={currentPage}
                  onTotalPagesChange={(pages: any) => setTotalPages(pages)}
                  onLoadError={(err: any) => setError(err)}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="h-full rounded-b-lg p-4 md:p-8 text-center  flex items-center justify-center">
            <p className="text-base md:text-lg">{t("clickGenerateReport")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberReportViewer;
