// AccountLookUpService.ts - Service for Account Lookup API calls
import { apiClient } from "../apiClient";
import type { AccountLookUpDtos } from "types/AccountRecord";

export interface FilterParam {
  key: string;
  value: string;
  option:
    | "StartsWith"
    | "EndsWith"
    | "Contains"
    | "DoesNotContain"
    | "IsEmpty"
    | "IsNotEmpty"
    | "IsGreaterThan"
    | "IsGreaterThanOrEqualTo"
    | "IsLessThan"
    | "IsLessThanOrEqualTo"
    | "IsEqualTo"
    | "IsNotEqualTo";
}

export interface SortParam {
  field: string;
  sortOrder: "Asc" | "Desc";
}

export interface AccountLookUpSearchParams {
  pageNumber?: number;
  pageSize?: number;
  params?: FilterParam[];
  sort?: SortParam[];
}

interface Filter {
  pageNumber?: number;
  pageSize?: number;
  params?: FilterParam[];
  sort?: SortParam[];
}

interface PagedResult {
  items?: AccountLookUpDtos[] | null;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
}

export const accountLookUpService = {
  /**
   * Search accounts with pagination and filtering
   */
  search: async (filter?: Filter): Promise<PagedResult> => {
    try {
      const response = await apiClient.instance.post<any>(
        "/api/AccountLookUp/search",
        filter || {
          pageNumber: 1,
          pageSize: 20,
          params: [],
          sort: [],
        },
      );
      const data = response.data;

      // Extract pagination and items from GeneralResponse wrapper
      if (data?.pagination?.items) {
        return {
          items: data.data || [],
          totalPages: data.pagination.totalPages || 1,
          currentPage: data.pagination.currentPage || 1,
          totalRecord: data.pagination.totalRecord || 0,
          pageSize: data.pagination.pageSize || 20,
          hasNextPage: data.pagination.hasNextPage || false,
          hasPreviousPage: data.pagination.hasPreviousPage || false,
        };
      }

      return {
        items: data?.data || [],
        totalPages: 1,
        currentPage: 1,
        totalRecord: 0,
        pageSize: 20,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    } catch (error) {
      console.error("AccountLookUp search failed:", error);
      throw error;
    }
  },

  /**
   * Get account list with filters
   */
  getAllWithFilters: async (
    params: AccountLookUpSearchParams,
  ): Promise<PagedResult> => {
    const filter: Filter = {
      pageNumber: params.pageNumber || 1,
      pageSize: params.pageSize || 20,
      params: params.params || [],
      sort: params.sort || [],
    };
    return accountLookUpService.search(filter);
  },

  /**
   * Get paginated accounts
   */
  getPaged: async (
    page: number = 1,
    pageSize: number = 20,
  ): Promise<PagedResult> => {
    return accountLookUpService.search({
      pageNumber: page,
      pageSize: pageSize,
      params: [],
      sort: [],
    });
  },

  /**
   * Select specific account by ID
   */
  selectAccount: async (
    mamAccountOpeningId: number,
  ): Promise<Record<string, any> | null> => {
    try {
      const response = await apiClient.instance.get<any>(
        `/api/AccountLookUp/select/${mamAccountOpeningId}`,
      );
      const data = response.data;
      return data?.data || null;
    } catch (error) {
      console.error(
        `AccountLookUp select failed for ID ${mamAccountOpeningId}:`,
        error,
      );
      throw error;
    }
  },

  /**
   * Validate account by account number
   */
  validateAccountNo: async (
    accountNo: string,
  ): Promise<Record<string, any> | null> => {
    try {
      const response = await apiClient.instance.get<any>(
        `/api/AccountLookUp/validate/${encodeURIComponent(accountNo)}`,
      );
      const data = response.data;

      if (data?.isValid) {
        return data?.data || null;
      }

      throw new Error(data?.message || "Account validation failed");
    } catch (error) {
      console.error(
        `AccountLookUp validate failed for account ${accountNo}:`,
        error,
      );
      throw error;
    }
  },

  /**
   * Search with dynamic filters
   */
  searchWithFilters: async (
    filters: FilterParam[],
    sorts?: SortParam[],
    page: number = 1,
    pageSize: number = 20,
  ): Promise<PagedResult> => {
    return accountLookUpService.search({
      pageNumber: page,
      pageSize: pageSize,
      params: filters,
      sort: sorts,
    });
  },
};
