/* eslint-disable */
// @ts-nocheck

export enum SortOrder {
  Asc = "Asc",
  Desc = "Desc",
}

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

export interface AccountDayOpenAndCloseRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchId?: string | null;
  userId?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface AccountLookUpDtos {
  mamAccountOpeningId?: number;
  memberId?: string | null;
  memberName?: string | null;
  accountNo?: string | null;
  depositType?: string | null;
  accountType?: string | null;
  interestRate?: number | null;
  openedDate?: string | null;
  maturityDate?: string | null;
  status?: string | null;
  usmOfficeId?: number;
  officeName?: string | null;
}

export interface AccountSelectedDto {
  mamAccountOpeningId?: number;
  accountNo?: string | null;
  memMemberRegistrationId?: number;
  memberId?: string | null;
  memberName?: string | null;
  usmOfficeId?: number;
  accountNamingOption?: boolean;
  accountName?: string | null;
}

export interface AccountStatementRequest {
  fromDate?: string | null;
  toDate?: string | null;
  branchSelected?: string | null;
  branchName?: string | null;
  sameCompanyName?: boolean;
  reportType?: string | null;
  transactionType?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface AccountYearClosingRequestDto {
  branchId?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface AllReportOrderByResponseModel {
  memberIdCard?: OrderByResponse[] | null;
  savingTypeWiseBalance?: OrderByResponse[] | null;
}

export interface AssetCategoryResponse {
  famAssetsCategoryId?: number;
  typeName?: string | null;
  categoryName?: string | null;
  isActive?: boolean;
}

export interface BalanceSheetRequest {
  tillDate?: string | null;
  branchIds?: string | null;
  branchName?: string | null;
  reportType?: string | null;
  orderBy?: string | null;
  includePreviousYearBalance?: boolean;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface BankReceivedPaymentRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  sameCompanyName?: boolean;
  paymentType?: string | null;
  transactionType?: string | null;
  orderBy?: string | null;
}

export interface BranchResponse {
  branchId?: number;
  branchName?: string | null;
}

export interface BranchToBranchCollectionRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchFromId?: number;
  branchToId?: number;
  collectorId?: number | null;
  reportType?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface BranchToBranchExpenseRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchFromId?: number;
  branchToId?: number;
  collectorId?: number | null;
  reportType?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface CashAndBankBalanceRequestDto {
  tillDateBs?: string | null;
  branchId?: string | null;
  orderBy?: string | null;
  nepaliReport?: boolean;
}

export interface CashFlowDetailsRequest {
  tillDate?: string | null;
  branchIds?: string | null;
  branchName?: string | null;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface CashFlowRequest {
  fromDate?: string | null;
  toDate?: string | null;
  branchId?: string | null;
  branchName?: string | null;
  orderBy?: string | null;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface CenterCollectionRequestDto {
  tillDateBs?: string | null;
  collectionCenterId?: string | null;
  visualReport?: boolean;
}

export interface CenterCollectionSheetAccountWiseRequestDto {
  tillDateBs?: string | null;
  collectionCenterId?: string | null;
  visualReport?: boolean;
}

export interface CenterCollectionSheetPrintRequestDto {
  tillDateBs?: string | null;
  collectionCenterId?: string | null;
  sheetType?: string | null;
  visualReport?: boolean;
}

export interface CenterCollectionSheetReportMasterUpdateDto {
  sycCollectionCenterScemeId?: number;
  savingName?: string | null;
  savingNameCode?: string | null;
  loanName?: string | null;
  loanNameCode?: string | null;
}

export interface CenterCollectionSheetSingleRequestDto {
  tillDateBs?: string | null;
  collectionCenterId?: string | null;
  viewType?: string | null;
  visualReport?: boolean;
}

export interface CenterMeetingDetailRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchId?: string | null;
  collectionCenterId?: string | null;
  meetingType?: string | null;
  visualReport?: boolean;
}

export interface ChequeBookIssueRequestDto {
  memberId?: number;
  memberIdText?: string | null;
  memberName?: string | null;
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  branchName?: string | null;
  orderBy?: string | null;
  reportView?: string | null;
  visualReport?: boolean;
}

export interface ChequeBookLostRequestDto {
  memberId?: number;
  memberIdText?: string | null;
  memberName?: string | null;
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  branchName?: string | null;
  orderBy?: string | null;
  reportView?: string | null;
  visualReport?: boolean;
}

export interface ChequeBookWithdrawalRequestDto {
  accountId?: number;
  accountNo?: string | null;
  memberId?: string | null;
  memberName?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface ChequeClearanceRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  chequeType?: string | null;
  visualReport?: boolean;
}

export interface CollectionCenterRequestDtos {
  lstOfficeId?: number;
}

export interface CollectionCenterResponseDto {
  collectionCenterId?: number;
  collectionCenterShortCode?: string | null;
  collectionCenterName?: string | null;
  address?: string | null;
  meetingStartDateOnBs?: string | null;
  meetingTime?: string | null;
  meetingDateTimeBS?: string | null;
}

export interface CollectorResponse {
  id?: number;
  collectorName?: string | null;
  collectorCode?: string | null;
}

export interface CollectorWiseAccountCloseRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  orderBy?: string | null;
  collectorId?: number;
  collectorName?: string | null;
  visualReport?: boolean;
}

export interface CollectorWiseCommissionRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  orderBy?: string | null;
  collectorId?: number;
  collectorName?: string | null;
  visualReport?: boolean;
}

export interface CollectorWiseCommissionSummaryRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  branchName?: string | null;
  visualReport?: boolean;
}

export interface CollectorWiseLoanAnalysisRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  collectorId?: string | null;
  collectionCenterIds?: string | null;
  penaltyType?: string | null;
  orderBy?: string | null;
  enableCollectionCenter?: boolean;
  reportMode?: string | null;
  visualReport?: boolean;
}

export interface CollectorWiseProjectionRequestDto {
  tillDateBs?: string | null;
  branchId?: string | null;
  visualReport?: boolean;
}

export interface CollectorWiseVisitRequestDto {
  month?: string | null;
  year?: string | null;
  collectorId?: number;
  collectorName?: string | null;
  visitType?: string | null;
  orderBy?: string | null;
  reportType?: string | null;
  amountType?: string | null;
  generateBy?: string | null;
  visualReport?: boolean;
}

export interface CollectorWiseWithdrawalRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  orderBy?: string | null;
  collectorId?: number;
  collectorName?: string | null;
  visualReport?: boolean;
}

export interface ConvertRequestDto {
  direction?: string | null;
  date?: string | null;
}

export interface ConvertResponseDto {
  convertedDate?: string | null;
  year?: number;
  month?: number;
  day?: number;
}

export interface CopomisRequestDto {
  tillDateBs?: string | null;
  officeIds?: string | null;
  memberTypeId?: number;
  collectionCenterId?: number;
  memberGroupId?: number;
  orderBy?: string | null;
  showMemberPhoto?: boolean;
  visualReport?: boolean;
}

export interface CostOfFundRequest {
  tillDate?: string | null;
  branchId?: number;
  branchName?: string | null;
  orderBy?: string | null;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface DailyExpenseRequestDto {
  fromDate?: string | null;
  toDate?: string | null;
  branchId?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface DailyIncomeRequestDto {
  fromDate?: string | null;
  toDate?: string | null;
  branchId?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface DataEditedReportRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  entryBy?: number | null;
  editedBy?: number | null;
  memberRegistrationId?: number | null;
  orderBy?: string | null;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface DayBookLedgerWiseRequestDto {
  fromDate?: string | null;
  toDate?: string | null;
  branchId?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface DayBookVoucherWiseRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchId?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface DaysResponseDto {
  year?: number;
  month?: number;
  days?: number[] | null;
}

export interface DepositStatementRequestDto {
  accountNo?: string | null;
  fromDateBs?: string | null;
  toDateBs?: string | null;
  enableInterest?: boolean;
  enableBillNumber?: boolean;
  entryBy?: boolean;
  valueDate?: boolean;
  sameCompanyName?: boolean;
  language?: string | null;
  customNarration?: boolean;
  visualReport?: boolean;
  viewInterest?: boolean;
  nepaliDate?: boolean;
  englishDate?: boolean;
}

export interface DepositStatementVerificationDto {
  mamDepositStatementVerificationId?: number;
  verifiedFromDateOnBs?: string | null;
  verifiedToDateOnBs?: string | null;
  createdOn?: string;
  verifiedDateBs?: string | null;
  verifiedBy?: string | null;
}

export interface DepositStatementVerifyRequestDto {
  mamAccountOpeningId?: number;
  accountNo?: string | null;
  verifiedFromDateOnBs?: string | null;
  verifiedToDateOnBs?: string | null;
}

export interface DepositTypeResponse {
  depositeTypeId?: number;
  depositeTypeName?: string | null;
  isActive?: boolean;
}

export interface DepositUnverifiedRequest {
  fromDate?: string | null;
  toDate?: string | null;
  memberId?: string | null;
  memberName?: string | null;
  branchIds?: string | null;
  branchName?: string | null;
  depositTypeId?: string | null;
  collectorId?: string | null;
  orderBy?: string | null;
  reportType?: string | null;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface DepositWithdrawMaxAmountRangeRequest {
  fromDate?: string | null;
  toDate?: string | null;
  branchIds?: string | null;
  branchName?: string | null;
  transactionType?: number;
  amount?: number;
  orderBy?: string | null;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface DetailTrialBalanceRequest {
  fromDate?: string | null;
  toDate?: string | null;
  branchId?: string | null;
  branchName?: string | null;
  orderBy?: string | null;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface FamAssetNameLookupDto {
  famFixedAssetsDetailId?: number;
  fixedAssetsName?: string | null;
  isActive?: boolean | null;
}

export interface FamClearanceStatusLookupDto {
  famFixedAssetsClearanceStatusId?: number;
  description?: string | null;
}

export interface FamDepreciationReportRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface FamDetailReportRequestDto {
  toDateBs?: string | null;
  branchIds?: string | null;
  categoryId?: number;
  assetId?: number;
  clearanceStatusId?: number;
  reportType?: string | null;
  isTypeWise?: boolean;
  isSummary?: boolean;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface FamPurchaseReportRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  categoryId?: number;
  reportType?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface Filter {
  pageNumber?: number;
  pageSize?: number;
  params?: FilterParam[] | null;
  sort?: SortParam[] | null;
}

export interface FilterParam {
  key?: string | null;
  value?: string | null;
  option?: FilterOption;
}

export interface FirstLedgerDetailsRequestDto {
  fromDate?: string | null;
  toDate?: string | null;
  branchIds?: string | null;
  voucherType?: string | null;
  ledgerHeadId?: number;
  ledgerName?: string | null;
  subLedgerName?: string | null;
  orderBy?: string | null;
  showOpeningBalance?: boolean;
  reportType?: string | null;
  visualReport?: boolean;
}

export interface FiscalYearResponse {
  fiscalYearId?: number;
  fiscalYearToOnBs?: string | null;
}

export interface FixedDepositCertificateScheduleRequestDto {
  accountId?: number;
  accountNo?: string | null;
  memberId?: string | null;
  memberName?: string | null;
  showHeader?: boolean;
  reportType?: string | null;
}

export interface FixedDepositInterestTransferRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  branchName?: string | null;
  visualReport?: boolean;
}

export interface FundWithdrawlRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  reportMode?: string | null;
  visualReport?: boolean;
}

export interface GeneralResponseOfAccountSelectedDto {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: AccountSelectedDto;
  pagination?: Pagination;
}

export interface GeneralResponseOfAllReportOrderByResponseModel {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: AllReportOrderByResponseModel;
  pagination?: Pagination;
}

export interface GeneralResponseOfFamAssetNameLookupDto {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: FamAssetNameLookupDto;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfAccountLookUpDtos {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: AccountLookUpDtos[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfAssetCategoryResponse {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: AssetCategoryResponse[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfBranchResponse {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: BranchResponse[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfCollectorResponse {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: CollectorResponse[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfDepositStatementVerificationDto {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: DepositStatementVerificationDto[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfDepositTypeResponse {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: DepositTypeResponse[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfFamClearanceStatusLookupDto {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: FamClearanceStatusLookupDto[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfFiscalYearResponse {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: FiscalYearResponse[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfLmtLoanMaseterListResponse {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: LmtLoanMaseterListResponse[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfMemberTypeResponse {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: MemberTypeResponse[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfRemittanceReceiptResponse {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: RemittanceReceiptResponse[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfRemittanceTypeResponse {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: RemittanceTypeResponse[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfShareTypeResponse {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: ShareTypeResponse[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfVoucherOptionResponse {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: VoucherOptionResponse[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfReportResponseDtos {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: ReportResponseDtos;
  pagination?: Pagination;
}

export interface GeneralResponseOfVerificationStatusDto {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: VerificationStatusDto;
  pagination?: Pagination;
}

export interface GroupWiseMemberAccountDetailsRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  collectionCenterIds?: string | null;
  memberGroupId?: string | null;
  orderBy?: string | null;
  groupByCollectionCenter?: boolean;
  groupByMemberGroup?: boolean;
  groupByBranch?: boolean;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface IBTStatementBranchwiseRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  officeId?: string | null;
  payableBranchId?: string | null;
  reportType?: string | null;
  interestRate?: number;
  minimumClosingBalance?: number;
}

export interface IBTTransactionRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchId?: string | null;
  orderBy?: string | null;
}

export interface InterestAndTaxDetailRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  branchName?: string | null;
  memberRegistrationId?: number;
  memberId?: string | null;
  memberName?: string | null;
  visualReport?: boolean;
}

export interface InterestAndTaxPostedRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  branchName?: string | null;
  visualReport?: boolean;
}

export interface InterestAndTaxTypeWiseRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  reportView?: string | null;
  branchName?: string | null;
  visualReport?: boolean;
}

export interface InterestPayableRequestDto {
  tillDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  branchName?: string | null;
  reportView?: string | null;
  visualReport?: boolean;
}

export interface LedgerDetailsReqResponse {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchId?: string | null;
  voucherType?: string | null;
  orderBy?: string | null;
  reportType?: string | null;
  ledgerHead?: string[] | null;
  selectedAccountType?: number;
  showOpeningBalance?: boolean;
  isSummary?: boolean;
}

export interface LmtLoanMaseterListResponse {
  lmtLoanTypeMasterId?: number;
  loanTypeName?: string | null;
}

export interface LoanAccountClosedRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  memberGroupId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanAccountLookUpDtos {
  loanIssueId?: number;
  accountNo?: string | null;
  memberId?: string | null;
  memberName?: string | null;
  loanStatus?: string | null;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
}

export interface LoanAccountSelectedDto {
  loanIssueId?: number;
  accountNo?: string | null;
  memberId?: string | null;
  memberName?: string | null;
  loanStatus?: string | null;
}

export interface LoanAgeingRequestDto {
  tillDateBs?: string | null;
  branchIds?: string | null;
  memberGroupId?: string | null;
  collectorId?: string | null;
  penaltyType?: string | null;
  showLoanIssueDate?: string | null;
  ageingOn?: string | null;
  orderBy?: string | null;
  isNepaliReport?: boolean;
  visualReport?: boolean;
}

export interface LoanAgeingTypeWiseRequestDto {
  tillDateBs?: string | null;
  branchIds?: string | null;
  memberGroupId?: string | null;
  penaltyType?: string | null;
  orderBy?: string | null;
  withMemberCount?: boolean;
  visualReport?: boolean;
}

export interface LoanAgingArrealCalculationRequestDto {
  tillDateBs?: string | null;
  branchIds?: string | null;
  memberGroupId?: string | null;
  penaltyType?: string | null;
  orderBy?: string | null;
  collectionCenterId?: string | null;
  enableCollectionCenter?: boolean;
  collectorId?: string | null;
  enable1To30Days?: boolean;
  visualReport?: boolean;
}

export interface LoanAgingRiskCalculationRequestDto {
  tillDateBs?: string | null;
  branchIds?: string | null;
  memberGroupId?: string | null;
  penaltyType?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanAllDetailsRequestDto {
  memberRegistrationId?: number;
  loanTypeId?: string | null;
  status?: string | null;
  tillDateBs?: string | null;
  branchIds?: string | null;
  collectionCenterId?: string | null;
  enableCollectionCenter?: boolean;
  collectorId?: string | null;
  memberGroupId?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanAppraisalRequestDto {
  memberId?: string | null;
  branchIds?: string | null;
  visualReport?: boolean;
}

export interface LoanCICRequestDto {
  tillDateBs?: string | null;
  branchIds?: string | null;
  loanTypeId?: string | null;
  provisionType?: string | null;
  enable1To30Days?: boolean;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanCommissionRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  collectorId?: number;
  visualReport?: boolean;
}

export interface LoanDefaulterDueSummaryRequestDto {
  tillDate?: string | null;
  branchIds?: string | null;
  collectionCenterId?: string | null;
  enableCollectionCenter?: boolean;
  collectorId?: string | null;
  reportType?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanDeletedRequestDto {
  reportType?: string | null;
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  visualReport?: boolean;
  memberGroupId?: string | null;
  orderBy?: string | null;
}

export interface LoanDetailsRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  loanTypeId?: string | null;
  status?: string | null;
  collectionCenterId?: string | null;
  enableCollectionCenter?: boolean;
  collectorId?: string | null;
  orderBy?: string | null;
  reportType?: string | null;
  visualReport?: boolean;
}

export interface LoanDueInstallmentRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  memberId?: string | null;
  lmtPaymentDurationTypeId?: number;
  branchIds?: string | null;
  memberGroupId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanEvaluationReqResponse {
  memberRegistrationId?: number | null;
  memberId?: string | null;
  visualReport?: boolean;
}

export interface LoanFineInterestPrinciplePaymentSummaryRequestDto {
  memberRegistrationId?: number;
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  collectionCenterId?: string | null;
  enableCollectionCenter?: boolean;
  collectorId?: string | null;
  selectAllOrOnlyCash?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanFollowUpRequestDto {
  memberId?: string | null;
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchId?: string | null;
  visualReport?: boolean;
  orderBy?: string | null;
}

export interface LoanGuaranteerRequestDto {
  memberId?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanInformationRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  loanTypeId?: string | null;
  memberGroupId?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanInterestDiscountRequestDto {
  memberId?: string | null;
  loanTypeId?: number;
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanInterestReceivableMonthlyRequestDto {
  tillDateBs?: string | null;
  branchIds?: string | null;
  memberGroupId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanInterestReceivableYearEndRequestDto {
  selectType?: string | null;
  asOnDateBs?: string | null;
  yearlyYear?: number | null;
  monthlyYear?: number | null;
  monthlyMonth?: number | null;
  branchIds?: string | null;
  memberGroupId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanIssueDetailsRequestDto {
  memberId?: string | null;
  fromDateBs?: string | null;
  toDateBs?: string | null;
  reportType?: string | null;
  branchIds?: string | null;
  visualReport?: boolean;
  orderBy?: string | null;
  enableCollectionCenter?: boolean;
  collectionCenterIds?: string | null;
}

export interface LoanMiscellaneousIncomeRequestDto {
  memberId?: string | null;
  branchIds?: string | null;
  memberGroupId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanPaymentRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  paymentBy?: string | null;
  branchIds?: string | null;
  memberGroupId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanPaymentThroughSavingRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  reportView?: string | null;
  visualReport?: boolean;
}

export interface LoanPenaltyDiscountRequestDto {
  memberId?: string | null;
  loanTypeId?: number;
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  visualReport?: boolean;
  orderBy?: string | null;
}

export interface LoanPortfolioRequestDto {
  branchIds?: string | null;
  visualReport?: boolean;
}

export interface LoanPrinciplePaymentRequestDto {
  paymentType?: string | null;
  memberRegistrationId?: number;
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  memberGroupId?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanProvisionRequestDto {
  tillDateBs?: string | null;
  branchIds?: string | null;
  memberGroupId?: string | null;
  penaltyType?: string | null;
  visualReport?: boolean;
}

export interface LoanReScheduleRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  memberGroupId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanRegisterRequestDto {
  tillDateBs?: string | null;
  branchIds?: string | null;
  loanTypeMasterId?: string | null;
  orderBy?: string | null;
  collectionCenterIds?: string | null;
  enableCollectionCenter?: boolean;
  collectorId?: string | null;
  selectLoan?: string | null;
  nepaliReport?: boolean;
  visualReport?: boolean;
}

export interface LoanRepaymentRequestDto {
  memberId?: string | null;
  branchIds?: string | null;
  visualReport?: boolean;
}

export interface LoanRevolvingStatementRequestDto {
  accountNo?: string | null;
  fromDateBs?: string | null;
  toDateBs?: string | null;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface LoanScheduleRequestDto {
  accountNo?: string | null;
  loanIssueId?: number;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface LoanStatementDateWiseRequestDto {
  accountNo?: string | null;
  branchIds?: string | null;
  fromDateBs?: string | null;
  toDateBs?: string | null;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface LoanStatementRequestDto {
  accountNo?: string | null;
  branchIds?: string | null;
  fromDateBs?: string | null;
  toDateBs?: string | null;
  reportType?: string | null;
  showEntryBy?: boolean;
  showDetailNarration?: boolean;
  showAccountCloseDetails?: boolean;
  enableBillNumber?: boolean;
  narrationType?: string | null;
  sameCompanyName?: boolean;
  visualReport?: boolean;
  language?: string | null;
}

export interface LoanStatementVerificationRequestDto {
  memberRegistrationId?: number;
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  collectorId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanSummaryRequestDto {
  loanTypeId?: number;
  branchIds?: string | null;
  memberGroupId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanTypeWiseRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  loanTypeId?: string | null;
  memberGroupId?: string | null;
  collectionCenterId?: string | null;
  enableCollectionCenter?: boolean;
  collectorId?: string | null;
  loanGuarantee?: string | null;
  shareType?: number;
  sameCompanyName?: boolean;
  showOpeningBalance?: boolean;
  showDetail?: boolean;
  groupByBranch?: boolean;
  groupByMemberGroup?: boolean;
  viewCollector?: boolean;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanVerifiedUnverifiedRequestDto {
  memberRegistrationId?: string | null;
  reportType?: string | null;
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  companyId: number;
}

export interface LoginResponse {
  token?: string | null;
  userId?: number;
  fullName?: string | null;
  email?: string | null;
  userTypeId?: number;
  userTypeName?: string | null;
  genderId?: number;
  officeId?: number;
  branchName?: string | null;
  officeIds?: string | null;
  companyName?: string | null;
  systemEditionName?: string | null;
}

export interface MaturedLoanRequestDto {
  memberId?: string | null;
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  memberGroupId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface MemberAccountDeactiveRequest {
  tillDate?: string | null;
  branchIds?: string | null;
  branchName?: string | null;
  duePeriod?: number;
  transactionType?: string | null;
  typeId?: number;
  isActive?: boolean;
  orderBy?: string | null;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface MemberAccountDetailNoRequest {
  tillDate?: string | null;
  branchIds?: string | null;
  branchName?: string | null;
  memberType?: number;
  includeSaving?: boolean;
  includeShare?: boolean;
  includeLoan?: boolean;
  savingTypeId?: string | null;
  shareTypeId?: string | null;
  loanTypeId?: string | null;
  orderBy?: string | null;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface MemberAccountDetailRequest {
  tillDate?: string | null;
  branchIds?: string | null;
  branchName?: string | null;
  depositTypeId?: string | null;
  memberId?: string | null;
  memberName?: string | null;
  memberRegistrationId?: number | null;
  status?: number;
  collectorId?: string | null;
  collectionCenterId?: string | null;
  memberGroupId?: string | null;
  enableCollectionCenterGroup?: boolean;
  enableMemberGroupGroup?: boolean;
  sameCompanyName?: boolean;
  orderBy?: string | null;
  selectedColumns?: string[] | null;
  visualReport?: boolean;
}

export interface MemberAllDetailRequst {
  fromDate?: string | null;
  toDate?: string | null;
  memberId?: string | null;
  orderby?: string | null;
  memberGroupId?: number;
  branchId?: number;
  visualReport?: boolean;
  selectedColumns?: string[] | null;
}

export interface MemberBasicDetailsRequest {
  memberRegistrationId?: number;
  fromDate?: string | null;
  toDate?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
  sameCompanyName?: boolean;
  branchSelected?: string | null;
  branchName?: string | null;
}

export interface MemberBloodGroupReportRequest {
  fromDate?: string | null;
  toDate?: string | null;
  branchId?: number;
  memberGroupId?: number;
  bloodGroupOption?: number;
  orderBy?: string | null;
  visualReport?: boolean;
  sameCompanyName?: boolean;
  branchSelected?: string | null;
  branchName?: string | null;
}

export interface MemberDetailRequest {
  fromDate?: string | null;
  toDate?: string | null;
  memberId?: string | null;
  branchId?: number;
  memberGroupId?: number;
  orderby?: string | null;
  visualReport?: boolean;
}

export interface MemberDetailsSummaryRequest {
  memberRegistrationId?: number;
  fromDate?: string | null;
  toDate?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface MemberGroupRequestDtos {
  lstOfficeId?: number;
  collectionCenterId?: number;
}

export interface MemberGroupResponseDto {
  memberGroupId?: number;
  collectionCenterId?: number;
  usmOfficeId?: number;
  name?: string | null;
}

export interface MemberIdCardRequest {
  fromDate?: string | null;
  toDate?: string | null;
  memberId?: string | null;
  orderby?: string | null;
  branchId?: number;
  memberGroupId?: number;
  currentPage?: number;
  pageSize?: number;
}

export interface MemberLookUpDtos {
  memMemberRegistrationId?: number;
  centerName?: string | null;
  centerCode?: string | null;
  groupName?: string | null;
  groupCode?: string | null;
  officeName?: string | null;
  memberId?: string | null;
  memberName?: string | null;
  gender?: string | null;
  temporaryAddress?: string | null;
  mobileNo?: string | null;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface MemberPenaltyDepositWithdrawRequest {
  fromDate?: string | null;
  toDate?: string | null;
  branchIds?: string | null;
  branchName?: string | null;
  transactionType?: number;
  amount?: number;
  orderBy?: string | null;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface MemberSelectedDto {
  memberId?: string | null;
  memberName?: string | null;
}

export interface MemberSummaryRequest {
  tillDate?: string | null;
  branchIds?: string | null;
  branchName?: string | null;
  collectionCenterId?: string | null;
  memberGroupId?: string | null;
  enableCollectionCenterGroup?: boolean;
  enableMemberGroupGroup?: boolean;
  sameCompanyName?: boolean;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface MemberTypeResponse {
  memberTypeId?: number;
  memberTypeName?: string | null;
}

export interface MiscellaneousIncomeRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  branchName?: string | null;
  orderBy?: string | null;
  reportType?: string | null;
  memberId?: number | null;
  visualReport?: boolean;
}

export interface MonthlyReportRequest {
  tillDate?: string | null;
  branchId?: string | null;
  branchName?: string | null;
  accountTypeId?: number;
  reportType?: string | null;
  isMonthWise?: boolean;
  isNepali?: boolean;
  showBudget?: boolean;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface OfficeProgressRequest {
  tillDate?: string | null;
  branchId?: string | null;
  branchName?: string | null;
  reportType?: string | null;
  enable1to30Days?: boolean;
  provisionType?: string | null;
  groupByBranch?: boolean;
  groupByCollectionCenter?: boolean;
  viewDetail?: boolean;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface OrderByResponse {
  value?: number;
  displayName?: string | null;
}

export interface PEARLSAnalysisRequestDto {
  tillDate?: string | null;
  branchId?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface PLAccountRequest {
  fromDate?: string | null;
  toDate?: string | null;
  branchIds?: string | null;
  branchName?: string | null;
  reportType?: string | null;
  orderBy?: string | null;
  displayType?: string | null;
  isNepaliReport?: boolean;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface Pagination {
  currentPage?: number | null;
  totalPages?: number | null;
  pageSize?: number | null;
  totalRecord?: number | null;
  hasNextPage?: boolean | null;
  hasPreviousPage?: boolean | null;
  items?: any[] | null;
}

export interface PaginationOfLoanAccountLookUpDtos {
  currentPage?: number | null;
  totalPages?: number | null;
  pageSize?: number | null;
  totalRecord?: number | null;
  hasNextPage?: boolean | null;
  hasPreviousPage?: boolean | null;
  items?: LoanAccountLookUpDtos[] | null;
}

export interface PaginationOfMemberLookUpDtos {
  currentPage?: number | null;
  totalPages?: number | null;
  pageSize?: number | null;
  totalRecord?: number | null;
  hasNextPage?: boolean | null;
  hasPreviousPage?: boolean | null;
  items?: MemberLookUpDtos[] | null;
}

export interface PayableInterestTransferredRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  branchName?: string | null;
  visualReport?: boolean;
}

export interface PaymentDurationTypeResponse {
  lmtPaymentDurationTypeId?: number;
  paymentDurationType?: string | null;
}

export interface PaymentThroughSavingRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  sameCompanyName?: boolean;
  transactionType?: string | null;
  orderBy?: string | null;
}

export interface RatioAnalysisRequest {
  fromDate?: string | null;
  toDate?: string | null;
  branchId?: string | null;
  branchName?: string | null;
  provisionType?: string | null;
  enable1to30Days?: boolean;
  isTotalOnly?: boolean;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface RemitOnlinePaymentDetailRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  isPaid?: string | null;
  remittanceGroupId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface RemitReceiptPrintRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  isReceived?: string | null;
  remittanceDetailId?: number;
  visualReport?: boolean;
}

export interface RemitReconcileReportRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  remittanceGroupId?: number;
  reportType?: string | null;
  sessionId?: string | null;
  visualReport?: boolean;
}

export interface RemittancePaymentDetailRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  remittanceTypeId?: number;
  remittanceServiceType?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface RemittancePaymentRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  remittanceTypeId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface RemittanceReceiptResponse {
  remittanceReceiptId?: number;
  remittanceReceiptName?: string | null;
}

export interface RemittanceReceivedRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  remittanceTypeId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface RemittanceTypeResponse {
  remittanceTypeId?: number;
  remittanceTypeName?: string | null;
}

export interface ReportResponseDtos {
  pdfData?: string | null;
  reportName?: string | null;
  pagination?: Pagination;
}

export interface ReserveMasterRequestDto {
  fromDate?: string | null;
  toDate?: string | null;
  branchId?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface SMSCategoryRequest {
  branchId?: string | null;
  branchName?: string | null;
  smsCategoryId?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface SalaryTransactionRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  branchName?: string | null;
  visualReport?: boolean;
  reportType?: number;
  transferOn?: string | null;
  staffSelection?: string | null;
  staffId?: number | null;
}

export interface SavingAcWiseBalanceRequest {
  tillDate?: string | null;
  depositId?: number;
  branchSelected?: string | null;
  branchName?: string | null;
  status?: string | null;
  orderBy?: string | null;
  collectorId?: number;
  memberGroupId?: number;
  collectionCenterId?: number;
  enableCollectionCenter?: boolean;
  enableGroup?: boolean;
  sameCompanyName?: boolean;
}

export interface SavingAccountClosedRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  branchName?: string | null;
  visualReport?: boolean;
  memberId?: number | null;
  reportMode?: string | null;
}

export interface SavingAccountDeletedRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  branchName?: string | null;
  visualReport?: boolean;
}

export interface SavingAccountRenewedRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  branchName?: string | null;
  visualReport?: boolean;
  memberId?: number | null;
  reportMode?: string | null;
}

export interface SavingDepositDateWiseRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  transactionType?: string | null;
  memberId?: number | null;
  savingTypeId?: number | null;
  branchName?: string | null;
  visualReport?: boolean;
  reportMode?: string | null;
  chequeDetail?: number;
}

export interface SavingDepositMemberWiseRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  transactionType?: string | null;
  memberId?: number | null;
  savingTypeId?: number | null;
  branchName?: string | null;
  visualReport?: boolean;
  reportMode?: string | null;
}

export interface SavingInterestChangeLogRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  reportType?: string | null;
  accountNo?: string | null;
  depositTypeId?: number | null;
  officeId?: number | null;
  officeName?: string | null;
  visualReport?: boolean;
}

export interface SavingIssueRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  branchName?: string | null;
  visualReport?: boolean;
  depositTypeId?: number | null;
  collectorId?: number | null;
  memberGroupId?: number | null;
  reportMode?: string | null;
}

export interface SavingTransferRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface SavingTypeWiseBalanceRequest {
  fromDate?: string | null;
  toDate?: string | null;
  branchId?: string | null;
  branchName?: string | null;
  collectionCenterId?: string | null;
  memberGroupId?: string | null;
  collectorId?: string | null;
  orderBy?: string | null;
  isNepali?: boolean;
  openingBalance?: boolean;
  percentageBalance?: boolean;
  groupByBranch?: boolean;
  groupByCollectionCenter?: boolean;
  groupByMemberGroup?: boolean;
  viewCollector?: boolean;
  viewDetail?: boolean;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface SavingTypeWiseIndividualBalanceRequest {
  fromDate?: string | null;
  toDate?: string | null;
  branchId?: string | null;
  branchName?: string | null;
  collectionCenterId?: string | null;
  memberGroupId?: string | null;
  collectorId?: string | null;
  orderBy?: string | null;
  openingBalance?: boolean;
  percentageBalance?: boolean;
  groupByBranch?: boolean;
  groupByCollectionCenter?: boolean;
  groupByMemberGroup?: boolean;
  viewDetail?: boolean;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface SavingsAccountInterestTransferRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  branchName?: string | null;
  depositTypeId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface SavingsAccountMaturityRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  branchName?: string | null;
  depositTypeId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
  format?: string | null;
}

export interface SecondLedgerDetailsRequestDto {
  fromDate?: string | null;
  toDate?: string | null;
  branchIds?: string | null;
  ledgerHeadId?: number;
  ledgerName?: string | null;
  subLedgerName?: string | null;
  secondSubLedgerName?: string | null;
  voucherType?: string | null;
  reportType?: string | null;
  showOpeningBalance?: boolean;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface ShareDetailsRequestDto {
  tillDateBs?: string | null;
  officeIds?: string | null;
  shareTypeId?: number;
  memberTypeId?: number;
  isGreaterThan?: boolean;
  totalShareAmount?: number;
  collectionCenterId?: number;
  memberGroupId?: number;
  orderBy?: string | null;
  enableCollectionCenter?: boolean;
  enableGroup?: boolean;
  reportType?: string | null;
  visualReport?: boolean;
}

export interface ShareDividendPatronizeTransferredRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  reportType?: string | null;
  visualReport?: boolean;
}

export interface ShareDividendRequestDto {
  fiscalYearId?: number;
  officeId?: number;
  shareTypeId?: number;
  memberGroupId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface ShareHoldingRequestDto {
  memberId?: number;
  fromDateBs?: string | null;
  toDateBs?: string | null;
  officeId?: number;
  shareTypeId?: number;
  memberTypeId?: number;
  memberGroupId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface SharePurchaseRequestDto {
  memberId?: number;
  fromDateBs?: string | null;
  toDateBs?: string | null;
  officeId?: number;
  shareTypeId?: number;
  memberGroupId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface ShareReturnPaymentRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  officeIds?: string | null;
  visualReport?: boolean;
}

export interface ShareReturnRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  officeId?: number;
  shareTypeId?: number;
  memberGroupId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface ShareStatementRequestDto {
  memberId?: string | null;
  shareTypeId?: number;
  enableHeader?: boolean;
  enableBillNo?: boolean;
  visualReport?: boolean;
}

export interface ShareTransferRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  officeId?: number;
  shareTypeId?: number;
  memberGroupId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface ShareTypeResponse {
  shmShareTypeId?: number;
  shareTypeName?: string | null;
}

export interface SoleMemberGroupRequestDtos {
  lstOfficeId?: number;
}

export interface SoleMemberGroupResponseDto {
  memberGroupId?: number;
  usmOfficeId?: number;
  name?: string | null;
}

export interface SortParam {
  field?: string | null;
  sortOrder?: SortOrder;
}

export interface SubLedgerDetailsRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchId?: string | null;
  voucherType?: string | null;
  orderBy?: string | null;
  reportType?: string | null;
  ledgerHeadId?: number;
  ledgerName?: string | null;
  showOpeningBalance?: boolean;
  selectedAccountType?: number;
  ledgerHead?: string[] | null;
  isSummary?: boolean;
}

export interface SummaryTrialBalanceRequest {
  fromDate?: string | null;
  toDate?: string | null;
  branchIds?: string | null;
  branchName?: string | null;
  orderBy?: string | null;
  withClosingBalance?: boolean;
  reportType?: string | null;
  sameCompanyName?: boolean;
  visualReport?: boolean;
  isSubLedger?: boolean;
}

export interface TellerCashBalanceRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchId?: string | null;
  orderBy?: string | null;
  nepaliReport?: boolean;
  visualReport?: boolean;
}

export interface TellerCashDetailRequestDto {
  transactionDateBs?: string | null;
  branchId?: string | null;
  tellerId?: string | null;
  orderBy?: string | null;
  reportType?: string | null;
}

export interface TellerCashVaultRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchId?: string | null;
  sameCompanyName?: boolean;
  orderBy?: string | null;
  type?: boolean;
}

export interface TellerLookupResponse {
  id?: number;
  name?: string | null;
}

export interface TellerToTellerCashTransferRequestDto {
  fromDate?: string | null;
  toDate?: string | null;
  branchId?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface TellerWiseCollectionRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  tellerId?: number | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface TellerWiseExpenseRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  tellerId?: number | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface ThirdLedgerDetailsRequestDto {
  fromDate?: string | null;
  toDate?: string | null;
  branchIds?: string | null;
  ledgerHeadId?: number;
  ledgerName?: string | null;
  subLedgerName?: string | null;
  secondSubLedgerName?: string | null;
  thirdSubLedgerName?: string | null;
  voucherType?: string | null;
  reportType?: string | null;
  showOpeningBalance?: boolean;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface ThresholdTransactionRequest {
  fromDate?: string | null;
  toDate?: string | null;
  branchId?: string | null;
  branchName?: string | null;
  transactionNumber?: string | null;
  memberName?: string | null;
  orderBy?: string | null;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface UserLookupResponse {
  id?: number;
  fullName?: string | null;
}

export interface VerificationStatusDto {
  hasVerification?: boolean;
  verifiedTillBs?: string | null;
  verifiedDateBs?: string | null;
  verifiedBy?: string | null;
  message?: string | null;
}

export interface VoucherDetailsRequestDto {
  fromDate?: string | null;
  toDate?: string | null;
  branchIds?: string | null;
  voucherId?: number | null;
  orderBy?: string | null;
  viewType?: string | null;
  visualReport?: boolean;
}

export interface VoucherListRequest {
  fromDate?: string | null;
  toDate?: string | null;
  branchIds?: number[] | null;
}

export interface VoucherOptionResponse {
  acoVoucherId?: number;
  voucherNo?: string | null;
}

export interface YearsResponseDto {
  years?: number[] | null;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  secure?: boolean;
  path: string;
  type?: ContentType;
  query?: QueryParamsType;
  format?: ResponseType;
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    accountStatementAccountStatementReportCreate: (
      data: AccountStatementRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GeneralResponseOfReportResponseDtos, any>({
        path: `/api/AccountStatement/AccountStatementReport`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    balanceSheetCreate: (
      data: BalanceSheetRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/BalanceSheet`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    cashFlowCreate: (
      data: CashFlowRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/CashFlow`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    cashFlowDetailsCreate: (
      data: CashFlowDetailsRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/CashFlowDetails`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    costOfFundCreate: (
      data: CostOfFundRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/CostOfFund`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    detailTrialBalanceCreate: (
      data: DetailTrialBalanceRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/DetailTrialBalance`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    monthlyReportCreate: (
      data: MonthlyReportRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/MonthlyReport`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    officeProgressGenerateReportCreate: (
      data: OfficeProgressRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/OfficeProgress/GenerateReport`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    plAccountCreate: (
      data: PLAccountRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/PLAccount`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    ratioAnalysisCreate: (
      data: RatioAnalysisRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/RatioAnalysis`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    summaryTrialBalanceCreate: (
      data: SummaryTrialBalanceRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/SummaryTrialBalance`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    thresholdTransactionGenerateReportCreate: (
      data: ThresholdTransactionRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/ThresholdTransaction/GenerateReport`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    ibtStatementBranchwiseCreate: (
      data: IBTStatementBranchwiseRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/IBTStatementBranchwise`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    ibtTransactionCreate: (
      data: IBTTransactionRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/IBTTransaction`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    fourthLedgerDetailsCreate: (
      data: LedgerDetailsReqResponse,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/FourthLedgerDetails`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    firstLedgerDetailsCreate: (
      data: FirstLedgerDetailsRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/FirstLedgerDetails`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    ledgerDetailsCreate: (
      data: SubLedgerDetailsRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LedgerDetails`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    secondLedgerDetailsCreate: (
      data: SecondLedgerDetailsRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/SecondLedgerDetails`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    thirdLedgerDetailsCreate: (
      data: ThirdLedgerDetailsRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/ThirdLedgerDetails`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    accountDayOpenAndCloseCreate: (
      data: AccountDayOpenAndCloseRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/AccountDayOpenAndClose`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    accountAccountYearClosingCreate: (
      data: AccountYearClosingRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/account/AccountYearClosing`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    bankReceivedPaymentCreate: (
      data: BankReceivedPaymentRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/BankReceivedPayment`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    cashAndBankBalanceCreate: (
      data: CashAndBankBalanceRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/CashAndBankBalance`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    accountDailyExpenseCreate: (
      data: DailyExpenseRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/account/DailyExpense`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    accountDailyIncomeCreate: (
      data: DailyIncomeRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/account/DailyIncome`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    accountDayBookLedgerWiseCreate: (
      data: DayBookLedgerWiseRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/account/DayBookLedgerWise`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    dayBookVoucherWiseCreate: (
      data: DayBookVoucherWiseRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/DayBookVoucherWise`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    paymentThroughSavingCreate: (
      data: PaymentThroughSavingRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/PaymentThroughSaving`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    pearlsAnalysisCreate: (
      data: PEARLSAnalysisRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/PEARLSAnalysis`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    accountReserveMasterCreate: (
      data: ReserveMasterRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/account/ReserveMaster`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    tellerCashBalanceCreate: (
      data: TellerCashBalanceRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/TellerCashBalance`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    tellerCashDetailCreate: (
      data: TellerCashDetailRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/TellerCashDetail`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    tellerCashVaultCreate: (
      data: TellerCashVaultRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/TellerCashVault`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    tellerToTellerCashTransferCreate: (
      data: TellerToTellerCashTransferRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/TellerToTellerCashTransfer`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    accountVoucherDetailsCreate: (
      data: VoucherDetailsRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/account/VoucherDetails`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    famPurchaseReportCreate: (
      data: FamPurchaseReportRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/FamPurchaseReport`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    accountLookUpSearchCreate: (data: Filter, params: RequestParams = {}) =>
      this.request<GeneralResponseOfListOfAccountLookUpDtos, any>({
        path: `/api/AccountLookUp/search`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    accountLookUpSelectDetail: (
      mamAccountOpeningId: number,
      params: RequestParams = {},
    ) =>
      this.request<GeneralResponseOfAccountSelectedDto, any>({
        path: `/api/AccountLookUp/select/${mamAccountOpeningId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    accountLookUpValidateDetail: (
      accountNo: string,
      params: RequestParams = {},
    ) =>
      this.request<GeneralResponseOfAccountSelectedDto, any>({
        path: `/api/AccountLookUp/validate/${accountNo}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    assetCategoryGetAllByTypeList: (
      query?: {
        type?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GeneralResponseOfListOfAssetCategoryResponse, any>({
        path: `/api/AssetCategory/GetAllByType`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    authLoginCreate: (data: LoginRequest, params: RequestParams = {}) =>
      this.request<LoginResponse, any>({
        path: `/api/Auth/login`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    authLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Auth/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),

    branchGetAllBranchesList: (
      query?: {
        userId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<GeneralResponseOfListOfBranchResponse, any>({
        path: `/api/Branch/GetAllBranches`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    branchGetCollectionBranchList: (
      query?: {
        userId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<GeneralResponseOfListOfBranchResponse, any>({
        path: `/api/Branch/GetCollectionBranch`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    collectionCenterCollectionCentersCreate: (
      data: CollectionCenterRequestDtos,
      params: RequestParams = {},
    ) =>
      this.request<CollectionCenterResponseDto[], any>({
        path: `/api/CollectionCenter/collection-centers`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    collectorGetCollectorList: (
      query?: {
        userId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<GeneralResponseOfListOfCollectorResponse, any>({
        path: `/api/Collector/getCollector`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    calendarYearsList: (params: RequestParams = {}) =>
      this.request<YearsResponseDto, any>({
        path: `/api/Calendar/years`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    calendarDaysList: (
      query?: {
        year?: number;
        month?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<DaysResponseDto, any>({
        path: `/api/Calendar/days`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    calendarConvertCreate: (
      data: ConvertRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<ConvertResponseDto, any>({
        path: `/api/Calendar/convert`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    depositeTypeGetDepositeTypeList: (params: RequestParams = {}) =>
      this.request<GeneralResponseOfListOfDepositTypeResponse, any>({
        path: `/api/DepositeType/getDepositeType`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    depositStatementVerifyStatusDetail: (
      mamAccountOpeningId: number,
      params: RequestParams = {},
    ) =>
      this.request<GeneralResponseOfVerificationStatusDto, any>({
        path: `/api/DepositStatementVerify/Status/${mamAccountOpeningId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    depositStatementVerifyHistoryDetail: (
      mamAccountOpeningId: number,
      params: RequestParams = {},
    ) =>
      this.request<GeneralResponseOfListOfDepositStatementVerificationDto, any>(
        {
          path: `/api/DepositStatementVerify/History/${mamAccountOpeningId}`,
          method: "GET",
          secure: true,
          format: "json",
          ...params,
        },
      ),

    depositStatementVerifyVerifyCreate: (
      data: DepositStatementVerifyRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<GeneralResponseOfVerificationStatusDto, any>({
        path: `/api/DepositStatementVerify/Verify`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    famAssetLookupGetByIdList: (
      query?: {
        famFixedAssetsDetailId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<GeneralResponseOfFamAssetNameLookupDto, any>({
        path: `/api/FamAssetLookup/GetById`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    famClearanceStatusLookupList: (params: RequestParams = {}) =>
      this.request<GeneralResponseOfListOfFamClearanceStatusLookupDto, any>({
        path: `/api/FamClearanceStatusLookup`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    fiscalYearGetFiscalYearsBsList: (params: RequestParams = {}) =>
      this.request<GeneralResponseOfListOfFiscalYearResponse, any>({
        path: `/api/FiscalYear/GetFiscalYearsBS`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    ledgerLookupLedgerHeadList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/LedgerLookup/LedgerHead`,
        method: "GET",
        secure: true,
        ...params,
      }),

    ledgerLookupLedgerNameList: (
      query?: {
        FromDate?: string;
        ToDate?: string;
        BranchId?: string;
        AccountTypeId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LedgerLookup/LedgerName`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    ledgerLookupSubLedgerNameList: (
      query?: {
        FromDate?: string;
        ToDate?: string;
        BranchId?: string;
        AccountTypeId?: number;
        MainLedger?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LedgerLookup/SubLedgerName`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    ledgerLookupSecondSubLedgerNameList: (
      query?: {
        FromDate?: string;
        ToDate?: string;
        BranchId?: string;
        AccountTypeId?: number;
        SubLedger1?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LedgerLookup/SecondSubLedgerName`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    ledgerLookupThirdSubLedgerNameList: (
      query?: {
        FromDate?: string;
        ToDate?: string;
        BranchId?: string;
        AccountTypeId?: number;
        SubLedger2?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LedgerLookup/ThirdSubLedgerName`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    ledgerLookupFourthSubLedgerNameList: (
      query?: {
        FromDate?: string;
        ToDate?: string;
        BranchId?: string;
        AccountTypeId?: number;
        SubLedger3?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LedgerLookup/FourthSubLedgerName`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    lmtLoanMaseterListList: (params: RequestParams = {}) =>
      this.request<GeneralResponseOfListOfLmtLoanMaseterListResponse, any>({
        path: `/api/LmtLoanMaseterList`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    loanAccountLookUpSearchList: (
      query?: {
        Page?: number;
        LoanIssueId?: number;
        AccountNo?: string;
        MemberId?: string;
        MemberName?: string;
        LoanStatus?: string;
        SortColumn?: string;
        SortDirection?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginationOfLoanAccountLookUpDtos, any>({
        path: `/api/LoanAccountLookUp/search`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    loanAccountLookUpSelectDetail: (
      loanIssueId: number,
      params: RequestParams = {},
    ) =>
      this.request<LoanAccountSelectedDto, any>({
        path: `/api/LoanAccountLookUp/select/${loanIssueId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    memberGroupMemberGroupsCreate: (
      data: MemberGroupRequestDtos,
      params: RequestParams = {},
    ) =>
      this.request<MemberGroupResponseDto[], any>({
        path: `/api/MemberGroup/member-groups`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    memberLookUpSearchList: (
      query?: {
        Page?: number;
        MemberId?: string;
        MemberName?: string;
        GroupName?: string;
        CenterName?: string;
        Gender?: string;
        MobileNo?: string;
        OfficeName?: string;
        GroupCode?: string;
        CenterCode?: string;
        SortColumn?: string;
        SortDirection?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginationOfMemberLookUpDtos, any>({
        path: `/api/MemberLookUp/search`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    memberLookUpSelectDetail: (
      memMemberRegistrationId: number,
      params: RequestParams = {},
    ) =>
      this.request<MemberSelectedDto, any>({
        path: `/api/MemberLookUp/select/${memMemberRegistrationId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    memberTypeGetAllActiveList: (params: RequestParams = {}) =>
      this.request<GeneralResponseOfListOfMemberTypeResponse, any>({
        path: `/api/MemberType/GetAllActive`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    orderByGetAllOrderByList: (params: RequestParams = {}) =>
      this.request<GeneralResponseOfAllReportOrderByResponseModel, any>({
        path: `/api/OrderBy/GetAllOrderBy`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    paymentDurationTypeList: (params: RequestParams = {}) =>
      this.request<PaymentDurationTypeResponse[], any>({
        path: `/api/PaymentDurationType`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    remittanceReceiptGetRemittanceReceiptsList: (
      query?: {
        isReceived?: boolean;
        createdBy?: number;
        fromDateBs?: string;
        toDateBs?: string;
        officeIds?: number[];
      },
      params: RequestParams = {},
    ) =>
      this.request<GeneralResponseOfListOfRemittanceReceiptResponse, any>({
        path: `/api/RemittanceReceipt/GetRemittanceReceipts`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    remittanceTypeGetAllRemittanceTypesList: (params: RequestParams = {}) =>
      this.request<GeneralResponseOfListOfRemittanceTypeResponse, any>({
        path: `/api/RemittanceType/GetAllRemittanceTypes`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    shareTypeList: (params: RequestParams = {}) =>
      this.request<GeneralResponseOfListOfShareTypeResponse, any>({
        path: `/api/ShareType`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    soleMemberGroupCreate: (
      data: SoleMemberGroupRequestDtos,
      params: RequestParams = {},
    ) =>
      this.request<SoleMemberGroupResponseDto[], any>({
        path: `/api/SoleMemberGroup`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    tellerList: (
      query?: {
        fromDateBs?: string;
        toDateBs?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<TellerLookupResponse[], any>({
        path: `/api/Teller`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    tellerExpenseListList: (
      query?: {
        fromDateBs?: string;
        toDateBs?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<TellerLookupResponse[], any>({
        path: `/api/TellerExpenseList`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    userLookupList: (params: RequestParams = {}) =>
      this.request<UserLookupResponse[], any>({
        path: `/api/UserLookup`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    voucherListCreate: (data: VoucherListRequest, params: RequestParams = {}) =>
      this.request<GeneralResponseOfListOfVoucherOptionResponse, any>({
        path: `/api/Voucher/list`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    voucherByNumberList: (
      query?: {
        voucherNo?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<VoucherOptionResponse, any>({
        path: `/api/Voucher/by-number`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    famDepreciationReportCreate: (
      data: FamDepreciationReportRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/FamDepreciationReport`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    famDetailReportCreate: (
      data: FamDetailReportRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/FamDetailReport`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanDeletedCreate: (
      data: LoanDeletedRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanDeleted`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanIssueDetailsCreate: (
      data: LoanIssueDetailsRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanIssueDetails`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanScheduleCreate: (
      data: LoanScheduleRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanSchedule`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanVerifiedUnverifiedCreate: (
      data: LoanVerifiedUnverifiedRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanVerifiedUnverified`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    collectorWiseLoanAnalysisCreate: (
      data: CollectorWiseLoanAnalysisRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/CollectorWiseLoanAnalysis`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanAgeingCreate: (
      data: LoanAgeingRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanAgeing`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanAgeingTypeWiseCreate: (
      data: LoanAgeingTypeWiseRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanAgeingTypeWise`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanAgingArrealCalculationCreate: (
      data: LoanAgingArrealCalculationRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanAgingArrealCalculation`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanAgingArrealCalculationExportExcelCreate: (
      data: LoanAgingArrealCalculationRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanAgingArrealCalculation/export-excel`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanAgingRiskCalculationCreate: (
      data: LoanAgingRiskCalculationRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanAgingRiskCalculation`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanAllDetailsCreate: (
      data: LoanAllDetailsRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanAllDetails`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanCicCreate: (
      data: LoanCICRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanCIC`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanDetailsCreate: (
      data: LoanDetailsRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanDetails`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanInformationCreate: (
      data: LoanInformationRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanInformation`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanPortfolioCreate: (
      data: LoanPortfolioRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanPortfolio`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanProvisionCreate: (
      data: LoanProvisionRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanProvision`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanRegisterCreate: (
      data: LoanRegisterRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanRegister`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanTypeWiseCreate: (
      data: LoanTypeWiseRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanTypeWise`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanFineInterestPrinciplePaymentSummaryCreate: (
      data: LoanFineInterestPrinciplePaymentSummaryRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanFineInterestPrinciplePaymentSummary`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanPrinciplePaymentCreate: (
      data: LoanPrinciplePaymentRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanPrinciplePayment`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanRevolvingStatementCreate: (
      data: LoanRevolvingStatementRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanRevolvingStatement`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanStatementCreate: (
      data: LoanStatementRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanStatement`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanStatementDateWiseCreate: (
      data: LoanStatementDateWiseRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanStatementDateWise`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanStatementVerificationCreate: (
      data: LoanStatementVerificationRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanStatementVerification`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanAccountClosedCreate: (
      data: LoanAccountClosedRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanAccountClosed`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanAppraisalCreate: (
      data: LoanAppraisalRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanAppraisal`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanCommissionCreate: (
      data: LoanCommissionRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanCommission`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanDefaulterDueSummaryCreate: (
      data: LoanDefaulterDueSummaryRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanDefaulterDueSummary`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanDueInstallmentCreate: (
      data: LoanDueInstallmentRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanDueInstallment`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanFollowUpCreate: (
      data: LoanFollowUpRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanFollowUp`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanGuaranteerCreate: (
      data: LoanGuaranteerRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanGuaranteer`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanInterestDiscountCreate: (
      data: LoanInterestDiscountRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanInterestDiscount`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanInterestReceivableMonthlyCreate: (
      data: LoanInterestReceivableMonthlyRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanInterestReceivableMonthly`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanInterestReceivableYearEndCreate: (
      data: LoanInterestReceivableYearEndRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanInterestReceivableYearEnd`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanMiscellaneousIncomeCreate: (
      data: LoanMiscellaneousIncomeRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanMiscellaneousIncome`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanPaymentCreate: (
      data: LoanPaymentRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanPayment`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanPenaltyDiscountCreate: (
      data: LoanPenaltyDiscountRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanPenaltyDiscount`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanRepaymentCreate: (
      data: LoanRepaymentRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanRepayment`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanReScheduleCreate: (
      data: LoanReScheduleRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanReSchedule`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanSummaryCreate: (
      data: LoanSummaryRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanSummary`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    maturedLoanCreate: (
      data: MaturedLoanRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/MaturedLoan`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    memberAllDetailsCreate: (
      data: MemberAllDetailRequst,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GeneralResponseOfReportResponseDtos, any>({
        path: `/api/MemberAllDetails`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    memberBasicDetailsCreate: (
      data: MemberBasicDetailsRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GeneralResponseOfReportResponseDtos, any>({
        path: `/api/MemberBasicDetails`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    memberBloodGroupReportCreate: (
      data: MemberBloodGroupReportRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/MemberBloodGroupReport`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    memberDetailsSummaryCreate: (
      data: MemberDetailsSummaryRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/MemberDetailsSummary`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    memberIdCardMemberIdCardCreate: (
      data: MemberIdCardRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/MemberIdCard/MemberIdCard`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    memberRegistrationCreate: (
      data: MemberDetailRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GeneralResponseOfReportResponseDtos, any>({
        path: `/api/MemberRegistration`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    chequeBookIssueCreate: (
      data: ChequeBookIssueRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/ChequeBookIssue`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    chequeBookLostCreate: (
      data: ChequeBookLostRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/ChequeBookLost`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    chequeBookWithdrawalCreate: (
      data: ChequeBookWithdrawalRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/ChequeBookWithdrawal`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    collectorWiseAccountCloseCreate: (
      data: CollectorWiseAccountCloseRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/CollectorWiseAccountClose`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    collectorWiseCommissionCreate: (
      data: CollectorWiseCommissionRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/CollectorWiseCommission`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    collectorWiseCommissionSummaryCreate: (
      data: CollectorWiseCommissionSummaryRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/CollectorWiseCommissionSummary`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    collectorWiseVisitCreate: (
      data: CollectorWiseVisitRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/CollectorWiseVisit`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    collectorWiseWithdrawalCreate: (
      data: CollectorWiseWithdrawalRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/CollectorWiseWithdrawal`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    fixedDepositInterestTransferCreate: (
      data: FixedDepositInterestTransferRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/FixedDepositInterestTransfer`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    interestAndTaxDetailCreate: (
      data: InterestAndTaxDetailRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/InterestAndTaxDetail`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    interestAndTaxPostedCreate: (
      data: InterestAndTaxPostedRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/InterestAndTaxPosted`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    interestAndTaxTypeWiseCreate: (
      data: InterestAndTaxTypeWiseRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/InterestAndTaxTypeWise`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    fixedDepositCertificateScheduleCreate: (
      data: FixedDepositCertificateScheduleRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/FixedDepositCertificateSchedule`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    interestPayableCreate: (
      data: InterestPayableRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/InterestPayable`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    payableInterestTransferredCreate: (
      data: PayableInterestTransferredRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/PayableInterestTransferred`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    savingsAccountMaturityCreate: (
      data: SavingsAccountMaturityRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/SavingsAccountMaturity`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    savingsAccountNextInterestTransferCreate: (
      data: SavingsAccountInterestTransferRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/SavingsAccountNextInterestTransfer`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    branchToBranchCollectionCreate: (
      data: BranchToBranchCollectionRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/BranchToBranchCollection`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    branchToBranchExpenseCreate: (
      data: BranchToBranchExpenseRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/BranchToBranchExpense`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    chequeClearanceCreate: (
      data: ChequeClearanceRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/ChequeClearance`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    dataEditedReportCreate: (
      data: DataEditedReportRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/DataEditedReport`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanPaymentThroughSavingCreate: (
      data: LoanPaymentThroughSavingRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanPaymentThroughSaving`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    miscellaneousIncomeCreate: (
      data: MiscellaneousIncomeRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/MiscellaneousIncome`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    salaryTransactionCreate: (
      data: SalaryTransactionRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GeneralResponseOfReportResponseDtos, any>({
        path: `/api/SalaryTransaction`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    savingAccountClosedCreate: (
      data: SavingAccountClosedRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/SavingAccountClosed`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    savingAccountDeletedCreate: (
      data: SavingAccountDeletedRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/SavingAccountDeleted`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    savingAccountRenewedCreate: (
      data: SavingAccountRenewedRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/SavingAccountRenewed`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    savingDepositAmountDateWiseCreate: (
      data: SavingDepositDateWiseRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/SavingDepositAmountDateWise`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    savingDepositAmountMemberWiseCreate: (
      data: SavingDepositMemberWiseRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/SavingDepositAmountMemberWise`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    savingInterestChangeLogCreate: (
      data: SavingInterestChangeLogRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/SavingInterestChangeLog`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    savingIssueCreate: (
      data: SavingIssueRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/SavingIssue`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    savingTransferCreate: (
      data: SavingTransferRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/SavingTransfer`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    tellerWiseCollectionCreate: (
      data: TellerWiseCollectionRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GeneralResponseOfReportResponseDtos, any>({
        path: `/api/TellerWiseCollection`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    tellerWiseExpenseCreate: (
      data: TellerWiseExpenseRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/TellerWiseExpense`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    depositStatementCreate: (
      data: DepositStatementRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/DepositStatement`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    depositUnverifiedGenerateReportCreate: (
      data: DepositUnverifiedRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/DepositUnverified/GenerateReport`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    depositWithdrawMaxAmountRangeGenerateReportCreate: (
      data: DepositWithdrawMaxAmountRangeRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/DepositWithdrawMaxAmountRange/GenerateReport`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    memberAccountDeactiveCreate: (
      data: MemberAccountDeactiveRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/MemberAccountDeactive`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    memberAccountDetailNoCreate: (
      data: MemberAccountDetailNoRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/MemberAccountDetailNo`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    memberAccountDetailCreate: (
      data: MemberAccountDetailRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/MemberAccountDetail`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    memberPenaltyDepositWithdrawCreate: (
      data: MemberPenaltyDepositWithdrawRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/MemberPenaltyDepositWithdraw`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    memberSummaryCreate: (
      data: MemberSummaryRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/MemberSummary`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    savingAcWiseBalanceReportCreate: (
      data: SavingAcWiseBalanceRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/SavingACWiseBalanceReport`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    savingAcWiseBalanceReportProgressiveDetail: (
      jobId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/SavingACWiseBalanceReport/progressive/${jobId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    savingTypeWiseBalanceCreate: (
      data: SavingTypeWiseBalanceRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/SavingTypeWiseBalance`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    savingTypeWiseIndividualBalanceCreate: (
      data: SavingTypeWiseIndividualBalanceRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/SavingTypeWiseIndividualBalance`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    smsCategoryCreate: (
      data: SMSCategoryRequest,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/SMSCategory`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    centerMeetingDetailCreate: (
      data: CenterMeetingDetailRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/CenterMeetingDetail`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    collectorWiseProjectionCreate: (
      data: CollectorWiseProjectionRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/CollectorWiseProjection`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    loanEvaluationCreate: (
      data: LoanEvaluationReqResponse,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LoanEvaluation`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    fundWithdrawlCreate: (
      data: FundWithdrawlRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/FundWithdrawl`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    groupWiseMemberAccountDetailsCreate: (
      data: GroupWiseMemberAccountDetailsRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/GroupWiseMemberAccountDetails`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    centerCollectionCreate: (
      data: CenterCollectionRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/CenterCollection`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    centerCollectionSheetAccountWiseCreate: (
      data: CenterCollectionSheetAccountWiseRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/CenterCollectionSheetAccountWise`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    centerCollectionSheetPrintCreate: (
      data: CenterCollectionSheetPrintRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/CenterCollectionSheetPrint`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    centerCollectionSheetReportMasterList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/CenterCollectionSheetReportMaster`,
        method: "GET",
        secure: true,
        ...params,
      }),

    centerCollectionSheetReportMasterUpdate: (
      data: CenterCollectionSheetReportMasterUpdateDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/CenterCollectionSheetReportMaster`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    centerCollectionSheetReportMasterDetail: (
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/CenterCollectionSheetReportMaster/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    centerCollectionSheetSingleCreate: (
      data: CenterCollectionSheetSingleRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/CenterCollectionSheetSingle`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    remitOnlinePaymentDetailCreate: (
      data: RemitOnlinePaymentDetailRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/RemitOnlinePaymentDetail`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    remitReceiptPrintCreate: (
      data: RemitReceiptPrintRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/RemitReceiptPrint`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    remitReconcileReportCreate: (
      data: RemitReconcileReportRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/RemitReconcileReport`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    remittancePaymentCreate: (
      data: RemittancePaymentRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/RemittancePayment`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    remittancePaymentDetailCreate: (
      data: RemittancePaymentDetailRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/RemittancePaymentDetail`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    remittanceReceivedCreate: (
      data: RemittanceReceivedRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/RemittanceReceived`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    copomisCreate: (
      data: CopomisRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/Copomis`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    shareDetailsCreate: (
      data: ShareDetailsRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/ShareDetails`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    shareDividendCreate: (
      data: ShareDividendRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/ShareDividend`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    shareDividendPatronizeTransferredCreate: (
      data: ShareDividendPatronizeTransferredRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/ShareDividendPatronizeTransferred`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    shareHoldingCreate: (
      data: ShareHoldingRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/ShareHolding`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    sharePurchaseCreate: (
      data: SharePurchaseRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/SharePurchase`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    shareReturnCreate: (
      data: ShareReturnRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/ShareReturn`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    shareReturnPaymentCreate: (
      data: ShareReturnPaymentRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/ShareReturnPayment`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    shareStatementCreate: (
      data: ShareStatementRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/ShareStatement`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    shareTransferCreate: (
      data: ShareTransferRequestDto,
      query?: {
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/ShareTransfer`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
}
