// Custom type for Account Lookup record
// Used until AccountLookUpDtos is generated from swagger
export interface AccountLookUpDtos {
  mamAccountOpeningId: number;
  accountNo: string;
  memberId: string;
  memberName: string;
  depositType: string;
  accountType: string;
  interestRate?: number;
  openedDate: string;
  maturityDate: string;
  status: string;
  officeName: string;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
}

export type AccountRecord = AccountLookUpDtos;
