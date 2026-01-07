// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import * as yup from "yup";
// import { RefreshCw } from "lucide-react";
// import ReportNavigation from "@/components/ReportNavigation";

// type ReportFormat = "PDF" | "Word" | "Excel" | "Image";

// interface FormInputs {
//   startDate: string;
//   endDate: string;
// }

// // Validation schema
// const schema = yup.object({
//   startDate: yup
//     .string()
//     .required("Start Date is required")
//     .test("not-empty", "Start Date is required", (value) => {
//       return value !== "" && value !== undefined && value !== null;
//     }),
//   endDate: yup
//     .string()
//     .required("End Date is required")
//     .test("not-empty", "End Date is required", (value) => {
//       return value !== "" && value !== undefined && value !== null;
//     })
//     .test("date-min", "End Date cannot be before Start Date", function (value) {
//       const { startDate } = this.parent;
//       if (!startDate || !value) return true;
//       return new Date(value) >= new Date(startDate);
//     }),
// });

// const MemberReportViewer = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [reportLoaded, setReportLoaded] = useState(false);
//   //const [reportImage, setReportImage] = useState("");
//   const [error, setError] = useState("");
//   const [searchText, setSearchText] = useState("");
//   const [showDownloadMenu, setShowDownloadMenu] = useState(false);
//   const [reportUrl] = useState(""); // Changed from reportImage to reportUrl
//   //const [contentType, setContentType] = useState("");
//   const [htmlReport, setHtmlReport] = useState("");

//   const reportRef = useRef(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     getValues,
//   } = useForm<FormInputs>({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       startDate: "2024-12-01",
//       endDate: "2025-12-19",
//     },
//   });

//   // Cleanup function for blob URL
//   useEffect(() => {
//     return () => {
//       if (reportUrl) {
//         URL.revokeObjectURL(reportUrl);
//       }
//     };
//   }, [reportUrl]);

//   // Validation errors are now shown inline below inputs

//   const handleDownload = async (format: ReportFormat) => {
//     setShowDownloadMenu(false);
//     setLoading(true);

//     try {
//       const formatMap = {
//         PDF: "pdf",
//         Word: "word",
//         Excel: "xlsx",
//         Image: "png",
//       };

//       const values = getValues();

//       const requestBody = {
//         fromDate: values.startDate,
//         toDate: values.endDate,
//         branchId: 0,
//         memberGroupId: 0,
//         currentPage: 0,
//         pageSize: 0,
//       };

//       const apiFormat = formatMap[format] || format.toLowerCase();

//       const response = await fetch(
//         `http://localhost:5106/api/MemberDetailReport/generate?format=${apiFormat}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             accept: "*/*",
//           },
//           body: JSON.stringify(requestBody),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to download ${format}`);
//       }

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;

//       const extensionMap: Record<string, string> = {
//         PDF: "pdf",
//         Word: "docx",
//         Excel: "xlsx",
//         Image: "png",
//       };

//       const extension = extensionMap[format] || format.toLowerCase();
//       const filename = `MemberReport_${values.startDate}_to_${values.endDate}.${extension}`;
//       link.setAttribute("download", filename);

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);

//       toast.success(`${format} report downloaded successfully`);
//     } catch (err: any) {
//       toast.error(err.message || `Failed to download ${format}`);
//       console.error("Error downloading report:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   // const fetchReport = async (page: number) => {
//   //   setLoading(true);
//   //   setError("");

//   //   try {
//   //     const values = getValues();
//   //     const params = new URLSearchParams({
//   //       fromDate: values.startDate,
//   //       toDate: values.endDate,
//   //       branchId: "0",
//   //       memberGroupId: "0",
//   //       currentPage: page.toString(),
//   //       pageSize: "10",
//   //     });

//   //     const response = await fetch(
//   //       `http://localhost:5106/api/MemberDetailReport/view?${params}`,
//   //       {
//   //         method: "GET",
//   //         headers: {
//   //           accept: "*/*",
//   //         },
//   //       }
//   //     );

//   //     if (!response.ok) {
//   //       throw new Error("Failed to fetch report");
//   //     }

//   //     const data = await response.json();

//   //     console.log("No report data available:", data.htmls);
//   //     if (!data.success || !data.htmls) {
//   //       toast.error("No report data available");
//   //       return;
//   //     }

//   //     setHtmlReport(data.htmls);
//   //     setReportLoaded(true);

//   //     if (data.pagination) {
//   //       setCurrentPage(data.pagination.currentPage);
//   //       setTotalPages(data.pagination.totalPages);
//   //       setTotalRecords(data.pagination.totalRecords);
//   //     }

//   //     toast.success("Report loaded successfully");
//   //   } catch (err: any) {
//   //     toast.error(err.message || "Failed to load report");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const fetchReport = async (page: number) => {
//     setLoading(true);
//     setError("");

//     try {
//       const values = getValues();
//       const params = new URLSearchParams({
//         fromDate: values.startDate,
//         toDate: values.endDate,
//         branchId: "0",
//         memberGroupId: "0",
//         currentPage: page.toString(),
//         pageSize: "10",
//       });

//       const response = await fetch(
//         `http://localhost:5106/api/MemberDetailReport/view?${params}`,
//         {
//           method: "GET",
//           headers: {
//             accept: "*/*",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(
//           `Failed to fetch report: ${response.status} ${response.statusText}`
//         );
//       }

//       // Check content type to see what we're getting
//       const contentType = response.headers.get("content-type");
//       console.log("Response Content-Type:", contentType);

//       let data;
//       try {
//         data = await response.json();
//         console.log("Parsed JSON response:", data);
//       } catch (jsonError) {
//         console.error("JSON parsing failed:", jsonError);
//         // If JSON parsing fails, try getting it as text
//         const textContent = await response.text();
//         console.log(
//           "Raw response (first 500 chars):",
//           textContent.substring(0, 500)
//         );
//         throw new Error(
//           "Server returned invalid JSON. Check console for raw response."
//         );
//       }

//       // Debug: Log all properties of the response
//       console.log("Response properties:", Object.keys(data));
//       console.log("data.success:", data.success);
//       console.log("data.htmls exists:", !!data.htmls);
//       console.log("data.html exists:", !!data.html); // Check singular form too
//       console.log("data.pagination:", data.pagination);

//       // Check for both htmls and html (in case of typo in API)
//       const htmlContent = data.htmls || data.html;

//       if (!data.success) {
//         toast.error("Report generation failed");
//         setError("Report generation failed on server");
//         return;
//       }

//       if (!htmlContent) {
//         console.error("No HTML content found. Full response:", data);
//         toast.error("No report content available");
//         setError("No HTML content in response");
//         return;
//       }

//       // Verify the HTML content is actually HTML
//       if (
//         !htmlContent.trim().startsWith("<!DOCTYPE") &&
//         !htmlContent.trim().startsWith("<html")
//       ) {
//         console.warn(
//           "HTML content doesn't look like valid HTML:",
//           htmlContent.substring(0, 100)
//         );
//       }

//       setHtmlReport(htmlContent);
//       setReportLoaded(true);

//       // Handle pagination
//       if (data.pagination) {
//         console.log("Setting pagination:", data.pagination);
//         setCurrentPage(data.pagination.currentPage || page);
//         setTotalPages(data.pagination.totalPages || 1);
//         setTotalRecords(data.pagination.totalRecords || 0);
//       } else {
//         console.warn("No pagination data in response");
//         // Set defaults if pagination is missing
//         setCurrentPage(page);
//         setTotalPages(1);
//         setTotalRecords(0);
//       }

//       toast.success("Report loaded successfully");
//     } catch (err: any) {
//       console.error("Fetch error:", err);
//       const errorMessage = err.message || "Failed to load report";
//       toast.error(errorMessage);
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onSubmit = (data: FormInputs) => {
//     console.log("Form submitted with data:", data);
//     fetchReport(1);
//   };

//   const handlePageChange = (newPage: number) => {
//     console.log("🔄 Page change requested:", {
//       currentPage,
//       newPage,
//       totalPages,
//       isValid: newPage >= 1 && newPage <= totalPages && newPage !== currentPage,
//     });

//     if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
//       console.log("✓ Fetching new page:", newPage);
//       fetchReport(newPage);
//     } else {
//       console.log("❌ Page change rejected");
//     }
//   };

//   // const onSubmit = (data: FormInputs) => {
//   //   // Validation passed, now fetch the report
//   //   fetchReport(1);
//   // };

//   // const handlePageChange = (newPage: number) => {
//   //   console.log("🔄 Page change requested:", {
//   //     currentPage,
//   //     newPage,
//   //     totalPages,
//   //   });
//   //   if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
//   //     console.log("✓ Fetching new page:", newPage);
//   //     fetchReport(newPage);
//   //   }
//   // };

//   return (
//     <div className="min-w-screen min-h-screen flex flex-col items-center justify-center bg-gray-50">
//       <div className="w-[95vw] h-[95vh] mx-auto bg-white rounded-lg shadow-md mt-2">
//         {/* Fixed Header Section */}
//         <div className="sticky top-0 z-30 bg-white rounded-t-lg mt-2">
//           {/* Report Title */}
//           <div className="text-center py-4 md:py-6 border-b border-gray-200">
//             <h2 className="text-lg md:text-xl font-semibold text-gray-700">
//               MemberRegistration Report
//             </h2>
//           </div>

//           {/* Filter Section as Card */}
//           <div className="p-2 md:p-4 border-b border-gray-200">
//             <div className="bg-white p-2 md:p-4 shadow-md rounded-lg">
//               <div className="flex justify-center items-center gap-20 bg-gray-50 border border-gray-300 rounded-lg min-h-[90px] md:p-4">
//                 {/* Start Date */}
//                 <div className="flex flex-col">
//                   <label className="font-semibold text-sm text-gray-700 mb-1">
//                     Start Date:
//                   </label>
//                   <input
//                     type="date"
//                     {...register("startDate")}
//                     className={`w-full md:w-[200px] border rounded h-[30px] text-sm px-2 focus:outline-none focus:ring-2 ${
//                       errors.startDate
//                         ? "border-red-500 focus:border-red-500 focus:ring-red-200"
//                         : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
//                     }`}
//                   />
//                   {errors.startDate && (
//                     <span className="text-red-500 text-xs mt-1">
//                       {errors.startDate.message}
//                     </span>
//                   )}
//                 </div>

//                 {/* End Date */}
//                 <div className="flex flex-col">
//                   <label className="font-semibold text-sm text-gray-700 mb-1">
//                     To Date:
//                   </label>
//                   <input
//                     type="date"
//                     {...register("endDate")}
//                     className={`w-full md:w-[200px] border rounded h-[30px] text-sm px-2 focus:outline-none focus:ring-2 ${
//                       errors.endDate
//                         ? "border-red-500 focus:border-red-500 focus:ring-red-200"
//                         : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
//                     }`}
//                   />
//                   {errors.endDate && (
//                     <span className="text-red-500 text-xs mt-1">
//                       {errors.endDate.message}
//                     </span>
//                   )}
//                 </div>

//                 {/* Generate Report Button */}
//                 <div className="flex flex-col justify-end items-end h-[55px]">
//                   <button
//                     onClick={handleSubmit(onSubmit)}
//                     disabled={loading}
//                     className="w-full md:w-[150px] h-[35px] bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors md:mt-5"
//                   >
//                     {loading ? "Generating..." : "Generate Report"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Navigation Bar */}
//           {reportLoaded && (
//             <div className="sticky top-0 z-20">
//               <ReportNavigation
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 totalRecords={totalRecords}
//                 onPageChange={handlePageChange}
//                 searchText={searchText}
//                 onSearchTextChange={setSearchText}
//                 onPrint={handlePrint}
//                 showDownloadMenu={showDownloadMenu}
//                 onToggleDownloadMenu={() =>
//                   setShowDownloadMenu(!showDownloadMenu)
//                 }
//                 onDownload={handleDownload}
//               />
//             </div>
//           )}
//         </div>

//         {/* Report Content - Scrollable */}
//         <div className="overflow-auto">
//           {loading ? (
//             <div className="h-[100vh] bg-white rounded-lg p-4 md:p-8 flex items-center justify-center min-h-96">
//               <div className="text-center">
//                 <RefreshCw
//                   size={48}
//                   className="animate-spin text-blue-500 mx-auto mb-4"
//                 />
//                 <p className="text-gray-600">Generating report...</p>
//               </div>
//             </div>
//           ) : error ? (
//             <div className="h-[100vh] bg-white rounded-b-lg p-4 md:p-8 text-center text-red-500 min-h-96 flex items-center justify-center">
//               <div>
//                 <p className="text-base md:text-lg font-semibold mb-2">Error</p>
//                 <p className="text-sm">{error}</p>
//               </div>
//             </div>
//           ) : reportLoaded ? (
//             <div className="bg-white rounded-b-lg shadow-sm max-h-[calc(100vh-200px)] overflow-auto">
//               <div
//                 ref={reportRef}
//                 className="p-4 md:p-8"
//                 style={{
//                   minHeight: "100vh",
//                   transition: "all 0.3s ease-in-out",
//                 }}
//               >
//                 {htmlReport && (
//                   // <img
//                   //   src={reportImage}
//                   //   alt="Member Report"
//                   //   className="w-full h-auto"
//                   // />
//                   // <embed
//                   //   src={reportUrl}
//                   //   title="Member Report"
//                   //   className="w-full h-[90vh] border-0"
//                   // ></embed>

//                   <div
//                     key={currentPage}
//                     ref={reportRef}
//                     className="rdlc-html-report flex justify-center items-center"
//                   >
//                     <div
//                       dangerouslySetInnerHTML={{ __html: htmlReport }}
//                       className="w-full md:w-[95%]"
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="h-[100vh] bg-white rounded-b-lg p-4 md:p-8 text-center text-gray-400 min-h-96 flex items-center justify-center">
//               <p className="text-base md:text-lg">
//                 Click "Generate Report" to view the transaction report
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MemberReportViewe

"use client";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import { RefreshCw } from "lucide-react";
import ReportNavigation from "@/components/ReportNavigation";

type ReportFormat = "PDF" | "Word" | "Excel" | "Image";

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

  const reportRef = useRef(null);

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
    size: number = pageSize
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
      const url = format
        ? `http://localhost:5106/api/MemberDetailReport/generate?format=${format}`
        : `http://localhost:5106/api/MemberDetailReport/generate`;

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
          `Failed to generate report: ${response.status} ${response.statusText}`
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

        if (!data.htmls) {
          console.error("No HTML content found. Full response:", data);
          toast.error("No report content available");
          setError("No HTML content in response");
          return;
        }

        setHtmlReport(data.htmls);
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
          `${format?.toUpperCase()} report downloaded successfully`
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
    <div className="min-w-screen min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-[95vw] h-[95vh] mx-auto bg-white rounded-lg shadow-md mt-2">
        {/* Fixed Header Section */}
        <div className="sticky top-0 z-30 bg-white rounded-t-lg mt-2">
          {/* Report Title */}
          <div className="text-center py-4 md:py-6 border-b border-gray-200">
            <h2 className="text-lg md:text-xl font-semibold text-gray-700">
              MemberRegistration Report
            </h2>
          </div>

          {/* Filter Section as Card */}
          <div className="p-2 md:p-4 border-b border-gray-200">
            <div className="bg-white p-2 md:p-4 shadow-md rounded-lg">
              <div className="flex justify-center items-center gap-20 bg-gray-50 border border-gray-300 rounded-lg min-h-[90px] md:p-4">
                {/* Start Date */}
                <div className="flex flex-col">
                  <label className="font-semibold text-sm text-gray-700 mb-1">
                    Start Date:
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
                  <label className="font-semibold text-sm text-gray-700 mb-1">
                    To Date:
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
                    className="w-full md:w-[150px] h-[35px] bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors md:mt-5"
                  >
                    {loading ? "Generating..." : "Generate Report"}
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
                onToggleDownloadMenu={() =>
                  setShowDownloadMenu(!showDownloadMenu)
                }
                onDownload={handleDownload}
              />
            </div>
          )}
        </div>

        {/* Report Content - Scrollable */}
        <div
          className="w-full overflow-auto bg-white rounded-b-lg"
          style={{ height: "90vh" }}
        >
          <style>{`
            @keyframes slideInRight {
              from {
                opacity: 0;
                transform: translateX(50px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            .report-slide {
              animation: slideInRight 0.4s ease-in-out;
            }
          `}</style>
          {loading ? (
            <div className="h-full bg-white rounded-lg p-4 md:p-8 flex items-center justify-center">
              <div className="text-center">
                <RefreshCw
                  size={48}
                  className="animate-spin text-blue-500 mx-auto mb-4"
                />
                <p className="text-gray-600">Generating report...</p>
              </div>
            </div>
          ) : error ? (
            <div className="h-full bg-white rounded-b-lg p-4 md:p-8 text-center text-red-500 flex items-center justify-center">
              <div>
                <p className="text-base md:text-lg font-semibold mb-2">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : reportLoaded ? (
            <div
              key={currentPage}
              className="report-slide p-4 md:p-8"
              style={{
                minHeight: "100%",
              }}
            >
              {htmlReport && (
                <div
                  dangerouslySetInnerHTML={{ __html: htmlReport }}
                  className="rdlc-html-report w-full"
                />
              )}
            </div>
          ) : (
            <div className="h-full bg-white rounded-b-lg p-4 md:p-8 text-center text-gray-400 flex items-center justify-center">
              <p className="text-base md:text-lg">
                Click "Generate Report" to view the transaction report
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberReportViewer;
