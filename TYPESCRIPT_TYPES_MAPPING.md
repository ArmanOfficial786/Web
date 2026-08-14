/\*\*

- ============================================================================
- TYPESCRIPT TYPES - C# Backend Mapping
- ============================================================================
-
- This file documents the TypeScript types generated from the C# backend
- code and how they map to the Account Lookup feature.
-
- Location: src/types/api/index.ts
  \*/

// ============================================================================
// 1. ENUMS
// ============================================================================

/\*\*

- FilterOption - Comparison operators for filtering
-
- Maps from C# enum in:
- NexgenCosysReport.Dtos.RequestDtos.Common.FilterOption
  \*/
  export enum FilterOption {
  StartsWith = "StartsWith",
  EndsWith = "EndsWith",
  Contains = "Contains",
  DoesNotContain = "DoesNotContain",
  IsEmpty = "IsEmpty",
  IsNotEmpty = "IsNotEmpty",
  IsGreaterThan = "IsGreaterThan",
  IsGreaterThanOrEqualTo = "IsGreaterThanOrEqualTo",
  IsLessThan = "IsLessThan",
  IsLessThanOrEqualTo = "IsLessThanOrEqualTo",
  IsEqualTo = "IsEqualTo",
  IsNotEqualTo = "IsNotEqualTo",
  }

/\*\*

- SortOrder - Sort direction
-
- Maps from C# enum in:
- NexgenCosysReport.Dtos.RequestDtos.Common.SortOrder
  \*/
  export enum SortOrder {
  Asc = "Asc",
  Desc = "Desc",
  }

// ============================================================================
// 2. REQUEST DTÖS
// ============================================================================

/\*\*

- Filter - Main filter request object
-
- C# Model:
- namespace NexgenCosysReport.Dtos.RequestDtos.Common
- {
- public class Filter
- {
-     public uint PageNumber { get; set; } = 1;
-     public uint PageSize { get; set; } = 20;
-     public List<FilterParam> Params { get; set; } = [];
-     public List<SortParam> Sort { get; set; } = [];
- }
- }
-
- TypeScript Mapping:
- - PageNumber → pageNumber?: number
- - PageSize → pageSize?: number
- - Params → params?: FilterParam[]
- - Sort → sort?: SortParam[]
-
- Notes:
- - All properties optional (defaults applied on backend)
- - uint in C# → number in TypeScript
- - Optional in TS because backend has defaults
    \*/
    export interface Filter {
    pageNumber?: number;
    pageSize?: number;
    params?: FilterParam[];
    sort?: SortParam[];
    }

/\*\*

- FilterParam - Individual filter criterion
-
- C# Model:
- public class FilterParam
- {
- public string Key { get; set; } = string.Empty;
- public string Value { get; set; } = string.Empty;
- public FilterOption Option { get; set; }
- }
-
- TypeScript Mapping:
- - Key → key: string
- - Value → value: string
- - Option → option: FilterOption
    \*/
    export interface FilterParam {
    key: string;
    value: string;
    option: FilterOption;
    }

/\*\*

- SortParam - Sort criterion
-
- C# Model:
- public class SortParam
- {
- public SortParam() { }
- public SortParam(string field, SortOrder sortOrder) { ... }
- public string Field { get; set; } = string.Empty;
- public SortOrder SortOrder { get; set; }
- }
-
- TypeScript Mapping:
- - Field → field: string
- - SortOrder → sortOrder: SortOrder
-
- Notes:
- - Constructor with parameters not needed in TypeScript
- - Can initialize object literals instead
    \*/
    export interface SortParam {
    field: string;
    sortOrder: SortOrder;
    }

// ============================================================================
// 3. RESPONSE DTÖS
// ============================================================================

/\*\*

- AccountLookUpDto - Account record for lookup grid
-
- C# Model:
- public class AccountLookUpDtos (used in LINQ select)
- {
- public long MamAccountOpeningId { get; set; }
- public string MemberId { get; set; }
- public string MemberName { get; set; }
- public string AccountNo { get; set; }
- public string DepositType { get; set; }
- public string? AccountType { get; set; }
- public decimal? InterestRate { get; set; }
- public string? OpenedDate { get; set; }
- public string? MaturityDate { get; set; }
- public string? Status { get; set; }
- public long UsmOfficeId { get; set; }
- public string OfficeName { get; set; }
- }
-
- TypeScript Mapping:
- - long → number (JavaScript doesn't distinguish)
- - string → string
- - string? (nullable) → string | null
- - decimal? (nullable) → number | null
-
- Notes:
- - This is the main DTO for grid display
- - MamAccountOpeningId is the unique key (rowKey)
- - Interest rates stored as decimals in C#, as numbers in TS
- - Dates come as strings (format: "YYYY-MM-DD BS" Nepali calendar)
- - All properties required on wire, but some may be null
    \*/
    export interface AccountLookUpDto {
    mamAccountOpeningId: number;
    memberId: string;
    memberName: string;
    accountNo: string;
    depositType: string;
    accountType?: string | null;
    interestRate?: number | null;
    openedDate?: string | null;
    maturityDate?: string | null;
    status?: string | null;
    usmOfficeId: number;
    officeName: string;
    }

/\*\*

- AccountSelectedDto - Account details on selection
-
- C# Model:
- public class AccountSelectedDto
- {
- public long MamAccountOpeningId { get; set; }
- public string AccountNo { get; set; }
- public long MemMemberRegistrationId { get; set; }
- public string MemberId { get; set; }
- public string MemberName { get; set; }
- public long UsmOfficeId { get; set; }
- public bool AccountNamingOption { get; set; }
- public string? AccountName { get; set; }
- }
-
- TypeScript Mapping:
- - long → number
- - string → string
- - bool → boolean
- - string? → string | null
-
- Notes:
- - AccountNamingOption: If true, use AccountName; else use MemberName
- - Returned by /select/{id} and /validate/{accountNo} endpoints
- - Contains full member name (derived from first/middle/last)
- - MemMemberRegistrationId needed for further operations
    \*/
    export interface AccountSelectedDto {
    mamAccountOpeningId: number;
    accountNo: string;
    memMemberRegistrationId: number;
    memberId: string;
    memberName: string;
    usmOfficeId: number;
    accountNamingOption: boolean;
    accountName?: string | null;
    }

/\*\*

- AccountValidationResult - Result of account validation
-
- C# Model (not explicit, but inferred from service):
- public class AccountValidationResult
- {
- public bool IsValid { get; set; }
- public string? Message { get; set; }
- public AccountSelectedDto? Account { get; set; }
- }
-
- TypeScript Mapping:
- - bool → boolean
- - string? → string | undefined
- - AccountSelectedDto? → AccountSelectedDto | undefined
-
- Notes:
- - IsValid = false: Message contains error reason
- - IsValid = true: Account contains AccountSelectedDto
- - Used by ValidateAccountNoAsync
    \*/
    export interface AccountValidationResult {
    isValid: boolean;
    message?: string;
    account?: AccountSelectedDto;
    }

// ============================================================================
// 4. PAGINATION
// ============================================================================

/\*\*

- PaginationMeta - Base pagination metadata
-
- C# Model:
- public class PaginationMeta
- {
- public int? CurrentPage { get; set; }
- public int? TotalPages { get; set; }
- public int? PageSize { get; set; }
- public int? TotalRecord { get; set; }
- public bool? HasNextPage { get; set; }
- public bool? HasPreviousPage { get; set; }
- }
-
- TypeScript Mapping:
- - int? → number | undefined
- - bool? → boolean | undefined
    \*/
    export interface PaginationMeta {
    currentPage?: number;
    totalPages?: number;
    pageSize?: number;
    totalRecord?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    }

/\*\*

- Pagination<T> - Generic pagination with items
-
- C# Model:
- public class Pagination<T> : PaginationMeta
- {
- public List<T>? Items { get; set; } = [];
- }
-
- TypeScript Mapping:
- - Extends PaginationMeta
- - Items field contains the actual records
- - Items is List<T> in C#, T[] in TypeScript (usually array)
-
- Notes:
- - Allows type-safe pagination of any record type
- - Used for AccountLookUpDtosPagedResult
    \*/
    export interface Pagination<T> extends PaginationMeta {
    items?: T[];
    }

/\*\*

- AccountLookUpDtosPagedResult - Paginated account lookup results
-
- Specialized version of Pagination<AccountLookUpDto>
- Used specifically for account search responses
-
- Example response from backend:
- {
- items: [
-     {
-       mamAccountOpeningId: 123,
-       memberId: "MEM-001",
-       memberName: "John Doe",
-       accountNo: "ACC-001",
-       depositType: "Saving",
-       accountType: "Individual",
-       interestRate: 5.5,
-       openedDate: "2023-01-15",
-       maturityDate: null,
-       status: "Active",
-       usmOfficeId: 1,
-       officeName: "Head Office"
-     },
-     ...
- ],
- totalPages: 10,
- currentPage: 1,
- totalRecord: 198,
- pageSize: 20,
- hasNextPage: true,
- hasPreviousPage: false
- }
  \*/
  export interface AccountLookUpDtosPagedResult {
  items?: AccountLookUpDto[];
  totalPages?: number;
  currentPage?: number;
  totalRecord?: number;
  pageSize?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  }

// ============================================================================
// 5. RESPONSE WRAPPER
// ============================================================================

/\*\*

- GeneralResponse<T> - API response wrapper
-
- C# Model:
- public class GeneralResponse<T>
- {
- public bool isValid { get; set; }
- public Int32 statusCode { get; set; }
- public string message { get; set; } = "";
- [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
- public T? data { get; set; }
- [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
- public Pagination? pagination { get; set; }
- }
-
- TypeScript Mapping:
- - isValid → isValid: boolean
- - statusCode → statusCode: number
- - message → message?: string
- - data → data?: T | null
- - pagination → pagination?: Pagination
-
- Notes:
- - Wraps all API responses
- - isValid = false when error occurs
- - statusCode follows HTTP status codes (200, 404, 500, etc.)
- - message contains error details when isValid = false
- - data is null when error
- - pagination included only for paginated responses
- - [JsonIgnore] means null values omitted from JSON
-
- Example error response:
- {
- "isValid": false,
- "statusCode": 500,
- "message": "An unexpected error occurred.",
- "data": null
- }
-
- Example success response:
- {
- "isValid": true,
- "statusCode": 200,
- "message": "",
- "data": [...account list...],
- "pagination": {
-     "currentPage": 1,
-     "totalPages": 10,
-     "pageSize": 20,
-     ...
- }
- }
  \*/
  export interface GeneralResponse<T> {
  isValid: boolean;
  statusCode: number;
  message?: string;
  data?: T | null;
  pagination?: Pagination;
  }

// ============================================================================
// 6. C# TO TYPESCRIPT MAPPING REFERENCE
// ============================================================================

/\*\*

- Data Type Conversions:
-
- C# Type → TypeScript Type
- ─────────────────────────────────────
- bool → boolean
- int, long, uint → number
- decimal, float → number
- string → string
- T? → T | undefined (or | null)
- List<T> → T[]
- Dictionary<K,V> → Record<K, V>
- DateTime → string (ISO 8601 format)
- Enum → enum (named constants)
-
- Nullable Reference Types:
- - string? means it could be null
- - In TypeScript: string | null or string | undefined
-
- Optional vs Required:
- - C# nullable (?) → TypeScript optional or union with null
- - C# required → TypeScript required
-
- Case Conventions:
- - C# uses PascalCase: MamAccountOpeningId
- - TypeScript uses camelCase: mamAccountOpeningId
- - JSON serializer handles conversion (default in C# is camelCase)
    \*/

// ============================================================================
// 7. USAGE EXAMPLES
// ============================================================================

/\*\*

- Building a filter request:
  \*/

import { Filter, FilterParam, SortParam, FilterOption, SortOrder } from "@/types/api";

const searchFilter: Filter = {
pageNumber: 1,
pageSize: 20,
params: [
{
key: "accountNo",
value: "ACC",
option: FilterOption.StartsWith,
},
{
key: "status",
value: "Active",
option: FilterOption.IsEqualTo,
},
],
sort: [
{
field: "accountNo",
sortOrder: SortOrder.Asc,
},
],
};

/\*\*

- Handling paginated response:
  \*/

import type { GeneralResponse } from "@/types/api";
import type { AccountLookUpDtosPagedResult } from "@/types/api";

async function fetchAccounts(): Promise<void> {
const response: GeneralResponse<any> = await fetch("/api/AccountLookUp/search", {
method: "POST",
body: JSON.stringify(searchFilter),
}).then((r) => r.json());

if (!response.isValid) {
console.error("Error:", response.message);
return;
}

const result: AccountLookUpDtosPagedResult = {
items: response.data,
totalPages: response.pagination?.totalPages,
currentPage: response.pagination?.currentPage,
totalRecord: response.pagination?.totalRecord,
pageSize: response.pagination?.pageSize,
hasNextPage: response.pagination?.hasNextPage,
hasPreviousPage: response.pagination?.hasPreviousPage,
};

console.log(`Found ${result.totalRecord} accounts`);
console.log(`Current page: ${result.currentPage} of ${result.totalPages}`);
result.items?.forEach((account) => {
console.log(`${account.accountNo} - ${account.memberName}`);
});
}

// ============================================================================
