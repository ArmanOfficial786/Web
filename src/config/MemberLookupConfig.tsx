// config/memberLookupConfig.tsx
import { Chip } from "@mui/material";
import type { FieldValues } from "react-hook-form";
import type { EntityLookupConfig } from "../../types/lookup";
import { memberLookUpService } from "@/services/Common/MemberLookUpService";
import type { MemberLookUpDtos } from "types/api/api";

type MemberRecord = MemberLookUpDtos;

export interface MemberFilterFields {
  centerName: string;
  centerCode: string;
  groupName: string;
  groupCode: string;
  officeName: string;
  memberId: string;
  memberName: string;
  gender: string;
  temporaryAddress: string;
  mobileNo: string;
}

export function createMemberLookupConfig<
  TForm extends FieldValues,
>(): EntityLookupConfig<MemberRecord, MemberFilterFields, TForm> {
  return {
    title: "Member Directory",
    rowKey: "memMemberRegistrationId",
    filterDefaults: {
      centerName: "",
      centerCode: "",
      groupName: "",
      groupCode: "",
      officeName: "",
      memberId: "",
      memberName: "",
      gender: "",
      temporaryAddress: "",
      mobileNo: "",
    },
    columns: [
      { key: "#", label: "#", width: 50 },
      {
        key: "centerName",
        label: "Center Name",
        filterKey: "centerName",
        width: 160,
      },
      {
        key: "centerCode",
        label: "CenterCode",
        filterKey: "centerCode",
        width: 100,
      },
      {
        key: "groupName",
        label: "Group Name",
        filterKey: "groupName",
        width: 160,
      },
      {
        key: "groupCode",
        label: "GroupCode",
        filterKey: "groupCode",
        width: 100,
      },
      {
        key: "officeName",
        label: "Office Name",
        filterKey: "officeName",
        width: 140,
      },
      {
        key: "memberId",
        label: "Member Id",
        filterKey: "memberId",
        width: 110,
      },
      {
        key: "memberName",
        label: "Member Name",
        filterKey: "memberName",
        width: 150,
      },
      {
        key: "gender",
        label: "Gender",
        filterKey: "gender",
        width: 90,
        render: (row) => <Chip label={row.gender} size="small" />,
      },
      {
        key: "temporaryAddress",
        label: "Temporary Address",
        filterKey: "temporaryAddress",
        width: 150,
      },
      {
        key: "mobileNo",
        label: "Mobile No",
        filterKey: "mobileNo",
        width: 120,
      },
    ],
    searchField: {
      name: "memberId" as any,
      label: "Member ID",
      placeholder: "Enter Member ID",
    },
    autofillFields: [
      {
        name: "memberName" as any,
        label: "Member Name",
        placeholder: "Member name",
      },
    ],
    fetchPage: async (page) => {
      const data = await memberLookUpService.getAllWithFilters({ Page: page });
      return {
        items: data.items ?? [],
        totalPages: data.totalPages ?? 1,
        currentPage: data.currentPage ?? 1,
      };
    },
    mapToFormValues: (row) =>
      ({ memberId: row.memberId, memberName: row.memberName }) as any,
  };
}
