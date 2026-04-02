"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import { RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import PdfSlideViewer from "@/components/PdfSlideViewer";
import ReportNavigation from "@/components/ReportNavigation";
import { Box } from "@mui/material";

interface FormInputs {
  startDate: string;
  endDate: string;
}

const schema = yup.object({
  startDate: yup.string().required("Start Date is required"),
  endDate: yup
    .string()
    .required("End Date is required")
    .test("date-min", "End Date cannot be before Start Date", function (value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;
      return new Date(value) >= new Date(startDate);
    }),
});

const MemberDetailReport = () => {
  const { t } = useLanguage();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [reportLoaded, setReportLoaded] = useState(false);
  const [error, setError] = useState("");
  const [pdfData, setPdfData] = useState("");

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
  //call api to generate report by default in VIEW format
  const baseurl = "http://localhost:5106/api/MemberReport/MemberDetail";
  //const baseurl = "http://localhost:5106/api/MemberDetail/MemberDetailReport";
  const generateReport = async () => {
    setLoading(true);
    setError("");

    try {
      const values = getValues();
      const requestBody = {
        fromDate: values.startDate,
        toDate: values.endDate,
        branchId: 0,
        memberGroupId: 0,
      };
      const url = `${baseurl}?format=VIEW`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "*/*" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate report: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !data.pdfData) {
        toast.error("Report generation failed");
        setError("No PDF data in response");
        return;
      }

      setPdfData(data.pdfData);
      setReportLoaded(true);
      setCurrentPage(1);
      toast.success("Report loaded successfully");
    } catch (err: any) {
      console.error("Generate report error:", err);
      toast.error(err.message || "Failed to generate report");
      setError(err.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  // Update total pages when PDF is loaded

  const handleTotalPagesChange = (pages: number) => {
    setTotalPages(pages);
  };

  // Handle PDF load errors

  const handlePdfError = (errorMsg: string) => {
    setError(errorMsg);
    toast.error(errorMsg);
  };

  // Dismiss error message

  const dismissError = () => {
    setError("");
    setReportLoaded(false);
  };

  // Report configuration for downloads
  const reportConfig = {
    apiEndpoint: baseurl,
    requestBody: {
      fromDate: getValues().startDate,
      toDate: getValues().endDate,
      branchId: 0,
      memberGroupId: 0,
    },
    fileNamePrefix: `StudentReport_${getValues().startDate}_${getValues().endDate}`,
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b shadow-sm">
        {/* Filter Section */}
        <div className="p-4">
          <div className="flex justify-center items-center gap-6">
            {/* Start Date */}
            <div className="flex flex-col">
              <label className="font-semibold text-sm mb-1 text-gray-700">
                {t("startDate")}
              </label>
              <input
                type="date"
                {...register("startDate")}
                className={`w-[200px] border rounded h-[32px] text-sm px-3 focus:outline-none focus:ring-2 ${
                  errors.startDate
                    ? "border-red-500 focus:ring-red-200"
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
              <label className="font-semibold text-sm mb-1 text-gray-700">
                {t("toDate")}
              </label>
              <input
                type="date"
                {...register("endDate")}
                className={`w-[200px] border rounded h-[32px] text-sm px-3 focus:outline-none focus:ring-2 ${
                  errors.endDate
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {errors.endDate && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.endDate.message}
                </span>
              )}
            </div>

            {/* Generate Button */}
            <div className="flex flex-col justify-end h-[57px]">
              <button
                onClick={handleSubmit(generateReport)}
                disabled={loading}
                className="px-6 h-[32px] bg-green-600 text-white font-semibold rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw size={16} className="animate-spin" />
                    {t("generating")}
                  </span>
                ) : (
                  t("generateReport")
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Bar - Handles all its own logic */}
        {reportLoaded && (
          <div className="px-4 pb-3">
            <ReportNavigation
              pdfData={pdfData}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              reportConfig={reportConfig}
            />
          </div>
        )}
      </div>

      {/* Report Content */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <RefreshCw
                size={48}
                className="animate-spin text-blue-500 mx-auto mb-4"
              />
              <p className="text-gray-700 font-medium">
                {t("generatingReport")}
              </p>
              <p className="text-gray-500 text-sm mt-2">Please wait...</p>
            </div>
          </div>
        ) : reportLoaded && pdfData ? (
          <Box>
            <PdfSlideViewer
              base64Pdf={pdfData}
              pageNumber={currentPage}
              onTotalPagesChange={handleTotalPagesChange}
              onLoadError={handlePdfError}
            />
          </Box>
        ) : (
          <div className="h-full flex items-center justify-center bg-white">
            <div className="text-center text-gray-500">
              <svg
                className="mx-auto h-24 w-24 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg font-medium mb-2">
                {t("clickGenerateReport")}
              </p>
              <p className="text-sm">
                Select date range and click "Generate Report"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDetailReport;
