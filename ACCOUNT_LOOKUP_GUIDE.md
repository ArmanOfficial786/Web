/\*\*

- ============================================================================
- ACCOUNT LOOKUP FEATURE - TypeScript Implementation Guide
- ============================================================================
-
- This document provides comprehensive guidance for using the Account Lookup
- feature in the NexgenCosysReports Web application.
-
- FEATURES:
- - Search and filter accounts by multiple criteria
- - Paginated grid display with backend support
- - Real-time client-side filtering within each page
- - Account selection with auto-fill to form fields
- - Dark/light theme support
- - Responsive design with sticky header and action column
    \*/

// ============================================================================
// 1. TYPE STRUCTURE
// ============================================================================

/\*\*

- src/types/api/index.ts
-
- Contains all API-related types mirrored from C# backend:
- - Filter: Request filter object with pagination, params, and sorting
- - FilterParam: Individual filter with key, value, and comparison option
- - SortParam: Sort column with field and direction
- - AccountLookUpDto: Account record for grid display
- - AccountSelectedDto: Selected account details
- - GeneralResponse<T>: API response wrapper
- - Pagination: Pagination metadata
    \*/

export interface Filter {
pageNumber?: number;
pageSize?: number;
params?: FilterParam[];
sort?: SortParam[];
}

export interface FilterParam {
key: string;
value: string;
option: FilterOption;
}

export enum FilterOption {
StartsWith,
EndsWith,
Contains,
DoesNotContain,
IsEmpty,
IsNotEmpty,
IsGreaterThan,
IsGreaterThanOrEqualTo,
IsLessThan,
IsLessThanOrEqualTo,
IsEqualTo,
IsNotEqualTo,
}

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

// ============================================================================
// 2. SERVICE LAYER
// ============================================================================

/\*\*

- src/services/Common/AccountLookUpService.ts
-
- Provides methods to interact with the AccountLookUp API endpoint:
- - search(filter): Performs paginated search with filters
- - getPaged(page, pageSize): Simple paginated fetch
- - selectAccount(id): Get details for a specific account
- - validateAccountNo(accountNo): Validate and retrieve account by number
- - searchWithFilters(filters, sorts, page, pageSize): Advanced search
-
- All methods handle:
- - GeneralResponse<T> wrapper extraction
- - Error handling and logging
- - Type conversion to expected format
    \*/

import { accountLookUpService } from "@/services/Common/AccountLookUpService";

// Search all accounts (page 1)
const result = await accountLookUpService.getPaged(1, 20);
console.log(result.items); // AccountLookUpDto[]

// Get specific account details
const selected = await accountLookUpService.selectAccount(123);
console.log(selected); // AccountSelectedDto | null

// Validate account by number
const validated = await accountLookUpService.validateAccountNo("ACC-001");
console.log(validated); // AccountSelectedDto | null

// ============================================================================
// 3. CONFIGURATION
// ============================================================================

/\*\*

- src/config/AccountLookupConfig.tsx
-
- Exports createAccountLookupConfig<TForm>() function that returns
- EntityLookupConfig with:
-
- - title: Modal dialog title
- - columns: Grid column definitions with filtering
- - filterDefaults: Default filter values
- - searchField: Primary search field
- - autofillFields: Secondary fields auto-filled on selection
- - fetchPage(page): Async function to fetch page data
- - mapToFormValues(row): Transform selected row to form values
    \*/

import { createAccountLookupConfig } from "@/config/AccountLookupConfig";
import type { FieldValues } from "react-hook-form";

interface MyFormFields extends FieldValues {
accountNo: string;
memberId: string;
memberName: string;
}

const config = createAccountLookupConfig<MyFormFields>();
// config.columns: Account grid columns
// config.fetchPage: Async page fetcher
// config.mapToFormValues: Selection to form mapper

// ============================================================================
// 4. LOOKUP MODAL COMPONENT
// ============================================================================

/\*\*

- src/components/reportForm/Common/LookUpModal.tsx
-
- Generic modal component that displays a searchable/filterable table
- with pagination. Features:
-
- - Sticky table header for scrolling
- - Alternating row colors
- - Hover highlight effects
- - Column-specific filter inputs
- - Pagination controls
- - Loading state
- - Empty state
- - Custom render function support per column
- - Dark/light theme support
-
- Props:
- - open: Boolean to show/hide modal
- - title: Modal title
- - columns: Array of LookupColumn definitions
- - data: Array of records to display
- - filterDefaults: Default values for filter inputs
- - rowKey: Property name for React key (unique ID)
- - onSelect: Callback when user selects a row
- - onClose: Callback to close modal
- - pageSize: Items per page (default: 10)
- - isLoading: Show loading state
    \*/

// ============================================================================
// 5. ENTITY LOOKUP FIELD COMPONENT
// ============================================================================

/\*\*

- src/components/reportForm/Common/EntityLookupField.tsx
-
- Wrapper component that combines:
- - Search input with icon button
- - Auto-fill fields (read-only)
- - LookUpModal for selection
-
- Props:
- - control: React Hook Form control
- - setValue: React Hook Form setValue
- - config: EntityLookupConfig from createAccountLookupConfig()
- - onSelect: Optional callback after selection
-
- Usage:
  \*/

import EntityLookupField from "@/components/reportForm/Common/EntityLookupField";
import { useForm } from "react-hook-form";

interface MyForm {
accountNo: string;
memberId: string;
memberName: string;
}

function MyComponent() {
const { control, setValue } = useForm<MyForm>();
const config = createAccountLookupConfig<MyForm>();

return (
<EntityLookupField
control={control}
setValue={setValue}
config={config}
onSelect={(row) => console.log("Selected:", row)}
/>
);
}

// ============================================================================
// 6. COLUMN DEFINITION TYPES
// ============================================================================

/\*\*

- src/types/lookup.ts
-
- LookupColumn<T> defines a single column in the modal grid:
-
- - key: Property name from data object (or "#" for row number)
- - label: Display label in header
- - width: Column width (number or string like "100px" or "20%")
- - filterKey?: If present, a filter input appears in the header
- - render?: Optional custom render function
    \*/

import type { LookupColumn } from "@/types/lookup";

const column: LookupColumn<AccountLookUpDto> = {
key: "accountNo",
label: "Account Number",
width: 140,
filterKey: "accountNo", // Enables filter input
render: (row) => (
<span style={{ fontWeight: "bold" }}>
{row.accountNo}
</span>
),
};

// ============================================================================
// 7. API INTEGRATION DETAILS
// ============================================================================

/\*\*

- Backend Endpoints:
-
- POST /api/AccountLookUp/search
- Body: {
- pageNumber: number,
- pageSize: number,
- params: [ { key, value, option } ],
- sort: [ { field, order } ]
- }
- Response: GeneralResponse<List<AccountLookUpDtos>>
-
- GET /api/AccountLookUp/select/{mamAccountOpeningId}
- Response: GeneralResponse<AccountSelectedDto>
-
- GET /api/AccountLookUp/validate/{accountNo}
- Response: GeneralResponse<AccountSelectedDto>
  \*/

// ============================================================================
// 8. FORM INTEGRATION EXAMPLE
// ============================================================================

/\*\*

- Complete example of using Account Lookup in a form
  \*/

import { Controller, useForm } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";

interface AccountFormData {
accountNo: string;
memberId: string;
memberName: string;
amount: number;
}

export function AccountSelectionForm() {
const { control, setValue, watch, handleSubmit } = useForm<AccountFormData>({
defaultValues: {
accountNo: "",
memberId: "",
memberName: "",
amount: 0,
},
});

const accountNo = watch("accountNo");

const onSubmit = (data: AccountFormData) => {
console.log("Form submitted:", data);
// Send to backend
};

const config = createAccountLookupConfig<AccountFormData>();

return (
<Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
{/_ Account Lookup Field _/}
<EntityLookupField
control={control}
setValue={setValue}
config={config}
onSelect={(account) => {
console.log("Account selected:", account.accountNo, account.memberName);
}}
/>

      {/* Other form fields */}
      <Controller
        control={control}
        name="amount"
        render={({ field }) => (
          <TextField
            {...field}
            label="Amount"
            type="number"
            inputProps={{ step: "0.01" }}
          />
        )}
      />

      <Button type="submit" variant="contained">
        Submit
      </Button>

      {/* Display selected account */}
      {accountNo && (
        <Box sx={{ p: 2, bgcolor: "info.light", borderRadius: 1 }}>
          <strong>Selected Account:</strong> {accountNo}
        </Box>
      )}
    </Box>

);
}

// ============================================================================
// 9. FILTER OPTIONS REFERENCE
// ============================================================================

/\*\*

- FilterOption enum - Comparison operators for filters
-
- String columns:
- - StartsWith: "Acc%" (case-insensitive)
- - EndsWith: "%001" (case-insensitive)
- - Contains: "%Sav%" (case-insensitive)
- - DoesNotContain: NOT LIKE (case-insensitive)
- - IsEqualTo: "ACC-001" (case-insensitive)
- - IsNotEqualTo: != (case-insensitive)
- - IsEmpty: NULL or empty string
- - IsNotEmpty: NOT NULL and not empty
-
- Numeric/Date columns:
- - IsEqualTo: = value
- - IsNotEqualTo: != value
- - IsGreaterThan: > value
- - IsGreaterThanOrEqualTo: >= value
- - IsLessThan: < value
- - IsLessThanOrEqualTo: <= value
    \*/

import { FilterOption } from "@/types/api";

// Example filters:
const stringFilter = { key: "accountNo", value: "001", option: FilterOption.EndsWith };
const numericFilter = { key: "interestRate", value: "10", option: FilterOption.IsGreaterThan };
const dateFilter = { key: "openedDate", value: "2024-01-01", option: FilterOption.IsGreaterThanOrEqualTo };

// ============================================================================
// 10. THEMING
// ============================================================================

/\*\*

- The LookUpModal automatically adapts to theme.palette.mode:
-
- Dark mode colors:
- - Surface: #1e293b (primary), #0f172a (sunken), #243347 (raised)
- - Header: #1e3a5f background, white text
- - Text: #f1f5f9 (primary), #94a3b8 (secondary)
- - Rows: Alternating #1e293b and #243347, hover: #2d4a6a
-
- Light mode colors:
- - Surface: #ffffff (primary), #f1f5f9 (sunken), #f8fafc (raised)
- - Header: #2c4a7a background, white text
- - Text: #111827 (primary), #6b7280 (secondary)
- - Rows: Alternating white and #f8fafc, hover: #e8f0fe
-
- No additional theme configuration needed!
  \*/

// ============================================================================
// 11. ERROR HANDLING
// ============================================================================

/\*\*

- AccountLookUpService methods throw errors that should be caught:
  \*/

async function safeSearch() {
try {
const result = await accountLookUpService.getPaged(1, 20);
console.log("Success:", result);
} catch (error) {
if (error instanceof Error) {
console.error("Search failed:", error.message);
}
// Show error toast to user
}
}

// ============================================================================
// 12. PERFORMANCE NOTES
// ============================================================================

/\*\*

- - Backend pagination: API returns fixed 20 items per page
- - Client-side filtering: Current page filters in-memory
- - Large datasets: Consider server-side pagination for >1000 records
- - Loading state: UI shows "Loading..." while fetching first page
- - Memoization: EntityLookupField memoizes config callback
    \*/

// ============================================================================
// 13. CUSTOMIZATION
// ============================================================================

/\*\*

- To customize the Account Lookup feature:
-
- 1.  Modify columns in AccountLookupConfig:
- - Add/remove columns
- - Change widths
- - Add custom render functions
- - Enable/disable filters
-
- 2.  Extend filterDefaults for new filterable columns:
- - Must match column filterKey names
- - Initialize with empty string or default value
-
- 3.  Modify mapToFormValues to auto-fill different fields:
- - Select which account properties populate form
- - Transform values as needed
-
- 4.  Add new API methods to AccountLookUpService:
- - Search by specific criteria
- - Export functionality
- - Bulk operations
-
- 5.  Extend AccountLookUpDto with new properties:
- - Add fields from backend
- - Update grid columns
- - Add new filter options
    \*/

// ============================================================================
