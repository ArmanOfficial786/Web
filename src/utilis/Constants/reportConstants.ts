export const PaginationHeader = "x-pagination";

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalRecord: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const DefaultPagination: PaginationMeta = {
  currentPage: 1,
  totalPages: 1,
  totalRecord: 0,
  pageSize: 15,
  hasNextPage: false,
  hasPreviousPage: false,
};

export interface ReportState {
  currentPage: number;
  totalPages: number;
  totalRecord: number;
  pageSize: number;
  loading: boolean;
  reportLoaded: boolean;
  error: string;
  pdfData: string;
}

export const InitialReportState: ReportState = {
  currentPage: 1,
  totalPages: 1,
  totalRecord: 0,
  pageSize: 15,
  loading: false,
  reportLoaded: false,
  error: "",
  pdfData: "",
};

export const ExportFormat: Record<string, string> = {
  PDF: "PDF",
  Word: "WORD",
  Excel: "EXCEL",
  Image: "PNG",
};
