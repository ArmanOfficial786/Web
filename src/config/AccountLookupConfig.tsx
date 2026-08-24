// // config/AccountLookupConfig.tsx
// import { Chip } from "@mui/material";
// import type { FieldValues } from "react-hook-form";
// import type { EntityLookupConfig } from "../../types/lookup";
// import { accountLookUpService } from "@/services/Common/AccountLookUpService";
// import type { AccountRecord } from "types/AccountRecord";

// export interface AccountFilterFields {
//   accountNo: string;
//   memberId: string;
//   memberName: string;
//   depositType: string;
//   status: string;
//   officeName: string;
//   interestRate: string;
//   openedDate: string;
//   maturityDate: string;
//   accountType: string;
// }

// /**
//  * Create Account Lookup configuration for EntityLookupField component
//  * Provides grid columns, filters, search, and form mapping
//  */
// export function createAccountLookupConfig<
//   TForm extends FieldValues,
// >(): EntityLookupConfig<AccountRecord, AccountFilterFields, TForm> {
//   return {
//     title: "Account Directory",
//     rowKey: "mamAccountOpeningId",

//     filterDefaults: {
//       accountNo: "",
//       memberId: "",
//       memberName: "",
//       depositType: "",
//       status: "",
//       officeName: "",
//       interestRate: "",
//       openedDate: "",
//       maturityDate: "",
//       accountType: "",
//     },

//     columns: [
//       {
//         key: "#",
//         label: "#",
//         width: 50,
//       },
//       {
//         key: "accountNo",
//         label: "Account No",
//         filterKey: "accountNo",
//         width: 120,
//       },
//       {
//         key: "memberId",
//         label: "Member ID",
//         filterKey: "memberId",
//         width: 100,
//       },
//       {
//         key: "memberName",
//         label: "Member Name",
//         filterKey: "memberName",
//         width: 160,
//       },
//       {
//         key: "depositType",
//         label: "Deposit Type",
//         filterKey: "depositType",
//         width: 120,
//       },
//       {
//         key: "accountType",
//         label: "Account Type",
//         filterKey: "accountType",
//         width: 120,
//       },
//       {
//         key: "interestRate",
//         label: "Interest Rate (%)",
//         filterKey: "interestRate",
//         width: 100,
//         render: (row) => (row.interestRate ? row.interestRate.toFixed(2) : "—"),
//       },
//       {
//         key: "openedDate",
//         label: "Opened Date",
//         filterKey: "openedDate",
//         width: 110,
//       },
//       {
//         key: "maturityDate",
//         label: "Maturity Date",
//         filterKey: "maturityDate",
//         width: 110,
//       },
//       {
//         key: "status",
//         label: "Status",
//         filterKey: "status",
//         width: 100,
//         render: (row) => (
//           <Chip label={row.status || "—"} size="small" variant="outlined" />
//         ),
//       },
//       {
//         key: "officeName",
//         label: "Office",
//         filterKey: "officeName",
//         width: 140,
//       },
//     ],

//     searchField: {
//       name: "accountNo" as any,
//       label: "Account No",
//       placeholder: "Enter Account No",
//     },

//     autofillFields: [
//       {
//         name: "memberId" as any,
//         label: "Member ID",
//         placeholder: "Member ID",
//       },
//       {
//         name: "memberName" as any,
//         label: "Member Name",
//         placeholder: "Member name",
//       },
//     ],

//     /**
//      * Fetch paginated account data
//      * @param page - Page number (1-indexed)
//      */
//     fetchPage: async (page) => {
//       try {
//         const data = await accountLookUpService.getPaged(page, 20);
//         return {
//           items: data.items ?? [],
//           totalPages: data.totalPages ?? 1,
//           currentPage: data.currentPage ?? 1,
//         };
//       } catch (error) {
//         console.error("Error fetching account lookup page:", error);
//         return {
//           items: [],
//           totalPages: 1,
//           currentPage: page,
//         };
//       }
//     },

//     /**
//      * Map selected row to form values
//      */
//     mapToFormValues: (row) =>
//       ({
//         accountNo: row.accountNo,
//         memberId: row.memberId,
//         memberName: row.memberName,
//       }) as any,
//   };
// }

// config/AccountLookupConfig.tsx
import { Chip } from "@mui/material";
import type { FieldValues } from "react-hook-form";
import type { EntityLookupConfig } from "../../types/lookup";
import { accountLookUpService } from "@/services/Common/AccountLookUpService";
import type { AccountRecord } from "types/AccountRecord";

export interface AccountFilterFields {
  accountNo: string;
  memberId: string;
  memberName: string;
  depositType: string;
  status: string;
  officeName: string;
  interestRate: string;
  openedDate: string;
  maturityDate: string;
  accountType: string;
}

export function createAccountLookupConfig<
  TForm extends FieldValues,
>(): EntityLookupConfig<AccountRecord, AccountFilterFields, TForm> {
  return {
    // ✅ Distinct cache key — completely independent from "member-lookup".
    // Never collides, never gets invalidated by member lookup refreshes.
    cacheKey: "account-lookup",
    title: "Account Directory",
    rowKey: "mamAccountOpeningId",
    filterDefaults: {
      accountNo: "",
      memberId: "",
      memberName: "",
      depositType: "",
      status: "",
      officeName: "",
      interestRate: "",
      openedDate: "",
      maturityDate: "",
      accountType: "",
    },
    columns: [
      { key: "#", label: "#", width: 50 },
      {
        key: "accountNo",
        label: "Account No",
        filterKey: "accountNo",
        width: 120,
      },
      {
        key: "memberId",
        label: "Member ID",
        filterKey: "memberId",
        width: 100,
      },
      {
        key: "memberName",
        label: "Member Name",
        filterKey: "memberName",
        width: 160,
      },
      {
        key: "depositType",
        label: "Deposit Type",
        filterKey: "depositType",
        width: 120,
      },
      {
        key: "accountType",
        label: "Account Type",
        filterKey: "accountType",
        width: 120,
      },
      {
        key: "interestRate",
        label: "Interest Rate (%)",
        filterKey: "interestRate",
        width: 100,
        render: (row) => (row.interestRate ? row.interestRate.toFixed(2) : "—"),
      },
      {
        key: "openedDate",
        label: "Opened Date",
        filterKey: "openedDate",
        width: 110,
      },
      {
        key: "maturityDate",
        label: "Maturity Date",
        filterKey: "maturityDate",
        width: 110,
      },
      {
        key: "status",
        label: "Status",
        filterKey: "status",
        width: 100,
        render: (row) => (
          <Chip label={row.status || "—"} size="small" variant="outlined" />
        ),
      },
      {
        key: "officeName",
        label: "Office",
        filterKey: "officeName",
        width: 140,
      },
    ],
    searchField: {
      name: "accountNo" as any,
      label: "Account No",
      placeholder: "Enter Account No",
    },
    autofillFields: [
      { name: "memberId" as any, label: "Member ID", placeholder: "Member ID" },
      {
        name: "memberName" as any,
        label: "Member Name",
        placeholder: "Member name",
      },
    ],
    fetchPage: async (page) => {
      try {
        const data = await accountLookUpService.getPaged(page, 20);
        return {
          items: data.items ?? [],
          totalPages: data.totalPages ?? 1,
          currentPage: data.currentPage ?? 1,
        };
      } catch (error) {
        console.error("Error fetching account lookup page:", error);
        return { items: [], totalPages: 1, currentPage: page };
      }
    },
    mapToFormValues: (row) =>
      ({
        accountNo: row.accountNo,
        memberId: row.memberId,
        memberName: row.memberName,
      }) as any,
  };
}
