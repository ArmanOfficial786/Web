/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

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
  /** @format int64 */
  mamAccountOpeningId?: number;
  memberId?: string | null;
  memberName?: string | null;
  accountNo?: string | null;
  depositType?: string | null;
  accountType?: string | null;
  /** @format double */
  interestRate?: number | null;
  openedDate?: string | null;
  maturityDate?: string | null;
  status?: string | null;
  /** @format int64 */
  usmOfficeId?: number;
  officeName?: string | null;
}

export interface AccountSelectedDto {
  /** @format int64 */
  mamAccountOpeningId?: number;
  accountNo?: string | null;
  /** @format int64 */
  memMemberRegistrationId?: number;
  memberId?: string | null;
  memberName?: string | null;
  /** @format int64 */
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
  /** @format int64 */
  branchId?: number;
  branchName?: string | null;
}

export interface BranchToBranchCollectionRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  /** @format int64 */
  branchFromId?: number;
  /** @format int64 */
  branchToId?: number;
  /** @format int64 */
  collectorId?: number | null;
  reportType?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface BranchToBranchExpenseRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  /** @format int64 */
  branchFromId?: number;
  /** @format int64 */
  branchToId?: number;
  /** @format int64 */
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

export interface ChequeBookIssueRequestDto {
  /** @format int64 */
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
  /** @format int64 */
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
  /** @format int64 */
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
  /** @format int64 */
  lstOfficeId?: number;
}

export interface CollectionCenterResponseDto {
  /** @format int64 */
  collectionCenterId?: number;
  collectionCenterShortCode?: string | null;
  collectionCenterName?: string | null;
}

export interface CollectorResponse {
  /** @format int64 */
  id?: number;
  collectorName?: string | null;
  collectorCode?: string | null;
}

export interface CollectorWiseAccountCloseRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  orderBy?: string | null;
  /** @format int64 */
  collectorId?: number;
  collectorName?: string | null;
  visualReport?: boolean;
}

export interface CollectorWiseCommissionRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  orderBy?: string | null;
  /** @format int64 */
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

export interface CollectorWiseVisitRequestDto {
  month?: string | null;
  year?: string | null;
  /** @format int64 */
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
  /** @format int64 */
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
  /** @format int32 */
  year?: number;
  /** @format int32 */
  month?: number;
  /** @format int32 */
  day?: number;
}

export interface CostOfFundRequest {
  tillDate?: string | null;
  /** @format int64 */
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
  /** @format int64 */
  entryBy?: number | null;
  /** @format int64 */
  editedBy?: number | null;
  /** @format int64 */
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
  /** @format int32 */
  year?: number;
  /** @format int32 */
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
  /** @format int64 */
  mamDepositStatementVerificationId?: number;
  verifiedFromDateOnBs?: string | null;
  verifiedToDateOnBs?: string | null;
  /** @format date-time */
  createdOn?: string;
  verifiedDateBs?: string | null;
  verifiedBy?: string | null;
}

export interface DepositStatementVerifyRequestDto {
  /** @format int64 */
  mamAccountOpeningId?: number;
  accountNo?: string | null;
  verifiedFromDateOnBs?: string | null;
  verifiedToDateOnBs?: string | null;
}

export interface DepositTypeResponse {
  /** @format int64 */
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
  /** @format int32 */
  transactionType?: number;
  /** @format double */
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

export interface Filter {
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
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
  /** @format int64 */
  ledgerHeadId?: number;
  ledgerName?: string | null;
  subLedgerName?: string | null;
  orderBy?: string | null;
  showOpeningBalance?: boolean;
  reportType?: string | null;
  visualReport?: boolean;
}

export interface FixedDepositCertificateScheduleRequestDto {
  /** @format int64 */
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

export interface GeneralResponseOfAccountSelectedDto {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: AccountSelectedDto;
  pagination?: Pagination;
}

export interface GeneralResponseOfAllReportOrderByResponseModel {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: AllReportOrderByResponseModel;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfAccountLookUpDtos {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: AccountLookUpDtos[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfBranchResponse {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: BranchResponse[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfCollectorResponse {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: CollectorResponse[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfDepositStatementVerificationDto {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: DepositStatementVerificationDto[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfDepositTypeResponse {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: DepositTypeResponse[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfLmtLoanMaseterListResponse {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: LmtLoanMaseterListResponse[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfShareTypeResponse {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: ShareTypeResponse[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfListOfVoucherOptionResponse {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: VoucherOptionResponse[] | null;
  pagination?: Pagination;
}

export interface GeneralResponseOfReportResponseDtos {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: ReportResponseDtos;
  pagination?: Pagination;
}

export interface GeneralResponseOfVerificationStatusDto {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: VerificationStatusDto;
  pagination?: Pagination;
}

export interface IBTStatementBranchwiseRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  officeId?: string | null;
  payableBranchId?: string | null;
  reportType?: string | null;
  /** @format double */
  interestRate?: number;
  /** @format double */
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
  /** @format int64 */
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
  /** @format int64 */
  selectedAccountType?: number;
  showOpeningBalance?: boolean;
  isSummary?: boolean;
}

export interface LmtLoanMaseterListResponse {
  /** @format int64 */
  lmtLoanTypeMasterId?: number;
  loanTypeName?: string | null;
}

export interface LoanAccountClosedRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  memberGroupId?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanAppraisalRequestDto {
  memberId?: string | null;
  branchIds?: string | null;
  visualReport?: boolean;
}

export interface LoanCommissionRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  /** @format int64 */
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

export interface LoanDueInstallmentRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  memberId?: string | null;
  /** @format int32 */
  lmtPaymentDurationTypeId?: number;
  branchIds?: string | null;
  memberGroupId?: string | null;
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

export interface LoanInterestDiscountRequestDto {
  memberId?: string | null;
  /** @format int64 */
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
  memberGroupId?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanInterestReceivableYearEndRequestDto {
  selectType?: string | null;
  asOnDateBs?: string | null;
  /** @format int32 */
  yearlyYear?: number | null;
  /** @format int32 */
  monthlyYear?: number | null;
  /** @format int32 */
  monthlyMonth?: number | null;
  branchIds?: string | null;
  memberGroupId?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanMiscellaneousIncomeRequestDto {
  memberId?: string | null;
  branchIds?: string | null;
  memberGroupId?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanPaymentRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  paymentBy?: string | null;
  branchIds?: string | null;
  memberGroupId?: string | null;
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
  /** @format int64 */
  loanTypeId?: number;
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  visualReport?: boolean;
  orderBy?: string | null;
}

export interface LoanReScheduleRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  memberGroupId?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoanRepaymentRequestDto {
  memberId?: string | null;
  branchIds?: string | null;
  visualReport?: boolean;
}

export interface LoanSummaryRequestDto {
  /** @format int64 */
  loanTypeId?: number;
  branchIds?: string | null;
  memberGroupId?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface LoginRequest {
  /**
   * @format email
   * @minLength 1
   */
  email: string;
  /** @minLength 1 */
  password: string;
  /** @format int32 */
  companyId: number;
}

export interface LoginResponse {
  token?: string | null;
  /** @format int64 */
  userId?: number;
  fullName?: string | null;
  email?: string | null;
  /** @format int64 */
  userTypeId?: number;
  userTypeName?: string | null;
  /** @format int64 */
  genderId?: number;
  /** @format int64 */
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
  memberGroupId?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface MemberAccountDeactiveRequest {
  tillDate?: string | null;
  branchIds?: string | null;
  branchName?: string | null;
  /** @format int32 */
  duePeriod?: number;
  transactionType?: string | null;
  /** @format int64 */
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
  /** @format int32 */
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
  /** @format int64 */
  memberRegistrationId?: number | null;
  /** @format int32 */
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
  /** @format int64 */
  memberGroupId?: number;
  /** @format int64 */
  branchId?: number;
  visualReport?: boolean;
  selectedColumns?: string[] | null;
}

export interface MemberBasicDetailsRequest {
  /** @format int64 */
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
  /** @format int64 */
  branchId?: number;
  /** @format int64 */
  memberGroupId?: number;
  /** @format int64 */
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
  /** @format int64 */
  branchId?: number;
  /** @format int64 */
  memberGroupId?: number;
  orderby?: string | null;
  visualReport?: boolean;
}

export interface MemberDetailsSummaryRequest {
  /** @format int64 */
  memberRegistrationId?: number;
  fromDate?: string | null;
  toDate?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface MemberGroupRequestDtos {
  /** @format int64 */
  lstOfficeId?: number;
  /** @format int64 */
  collectionCenterId?: number;
}

export interface MemberGroupResponseDto {
  /** @format int64 */
  memberGroupId?: number;
  /** @format int64 */
  collectionCenterId?: number;
  /** @format int64 */
  usmOfficeId?: number;
  name?: string | null;
}

export interface MemberIdCardRequest {
  fromDate?: string | null;
  toDate?: string | null;
  memberId?: string | null;
  orderby?: string | null;
  /** @format int64 */
  branchId?: number;
  /** @format int64 */
  memberGroupId?: number;
  /** @format int32 */
  currentPage?: number;
  /** @format int32 */
  pageSize?: number;
}

export interface MemberLookUpDtos {
  /** @format int64 */
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
  /** @format int32 */
  totalCount?: number;
  /** @format int32 */
  currentPage?: number;
  /** @format int32 */
  pageSize?: number;
  /** @format int32 */
  totalPages?: number;
}

export interface MemberPenaltyDepositWithdrawRequest {
  fromDate?: string | null;
  toDate?: string | null;
  branchIds?: string | null;
  branchName?: string | null;
  /** @format int32 */
  transactionType?: number;
  /** @format double */
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

export interface MiscellaneousIncomeRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  branchName?: string | null;
  orderBy?: string | null;
  reportType?: string | null;
  /** @format int64 */
  memberId?: number | null;
  visualReport?: boolean;
}

export interface MonthlyReportRequest {
  tillDate?: string | null;
  branchId?: string | null;
  branchName?: string | null;
  /** @format int32 */
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
  /** @format int32 */
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
  /** @format int32 */
  currentPage?: number | null;
  /** @format int32 */
  totalPages?: number | null;
  /** @format int32 */
  pageSize?: number | null;
  /** @format int32 */
  totalRecord?: number | null;
  hasNextPage?: boolean | null;
  hasPreviousPage?: boolean | null;
  items?: any[] | null;
}

export interface PaginationOfMemberLookUpDtos {
  /** @format int32 */
  currentPage?: number | null;
  /** @format int32 */
  totalPages?: number | null;
  /** @format int32 */
  pageSize?: number | null;
  /** @format int32 */
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
  /** @format int32 */
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
  /** @format int32 */
  reportType?: number;
  transferOn?: string | null;
  staffSelection?: string | null;
  /** @format int64 */
  staffId?: number | null;
}

export interface SavingAcWiseBalanceRequest {
  tillDate?: string | null;
  /** @format int64 */
  depositId?: number;
  branchSelected?: string | null;
  branchName?: string | null;
  status?: string | null;
  orderBy?: string | null;
  /** @format int64 */
  collectorId?: number;
  /** @format int64 */
  memberGroupId?: number;
  /** @format int64 */
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
  /** @format int64 */
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
  /** @format int64 */
  memberId?: number | null;
  reportMode?: string | null;
}

export interface SavingDepositDateWiseRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  transactionType?: string | null;
  /** @format int64 */
  memberId?: number | null;
  /** @format int64 */
  savingTypeId?: number | null;
  branchName?: string | null;
  visualReport?: boolean;
  reportMode?: string | null;
  /** @format int32 */
  chequeDetail?: number;
}

export interface SavingDepositMemberWiseRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  orderBy?: string | null;
  transactionType?: string | null;
  /** @format int64 */
  memberId?: number | null;
  /** @format int64 */
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
  /** @format int64 */
  depositTypeId?: number | null;
  /** @format int64 */
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
  /** @format int64 */
  depositTypeId?: number | null;
  /** @format int64 */
  collectorId?: number | null;
  /** @format int64 */
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
  /** @format int64 */
  depositTypeId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface SavingsAccountMaturityRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  branchIds?: string | null;
  branchName?: string | null;
  /** @format int64 */
  depositTypeId?: number;
  orderBy?: string | null;
  visualReport?: boolean;
  format?: string | null;
}

export interface SecondLedgerDetailsRequestDto {
  fromDate?: string | null;
  toDate?: string | null;
  branchIds?: string | null;
  /** @format int32 */
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

export interface ShareTypeResponse {
  /** @format int32 */
  shmShareTypeId?: number;
  shareTypeName?: string | null;
}

export interface SoleMemberGroupRequestDtos {
  /** @format int64 */
  lstOfficeId?: number;
}

export interface SoleMemberGroupResponseDto {
  /** @format int64 */
  memberGroupId?: number;
  /** @format int64 */
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
  /** @format int64 */
  ledgerHeadId?: number;
  ledgerName?: string | null;
  showOpeningBalance?: boolean;
  /** @format int32 */
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
  /** @format int64 */
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
  /** @format int64 */
  tellerId?: number | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface TellerWiseExpenseRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  /** @format int64 */
  tellerId?: number | null;
  orderBy?: string | null;
  visualReport?: boolean;
}

export interface ThirdLedgerDetailsRequestDto {
  fromDate?: string | null;
  toDate?: string | null;
  branchIds?: string | null;
  /** @format int32 */
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
  /** @format int64 */
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
  /** @format int64 */
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
  /** @format int64 */
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
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
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

/**
 * @title NexgenCosysReport API
 * @version v1
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Account/AccountingReports
     * @name AccountStatementAccountStatementReportCreate
     * @request POST:/api/AccountStatement/AccountStatementReport
     * @secure
     */
    accountStatementAccountStatementReportCreate: (
      data: AccountStatementRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/AccountingReports
     * @name BalanceSheetCreate
     * @request POST:/api/BalanceSheet
     * @secure
     */
    balanceSheetCreate: (
      data: BalanceSheetRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/AccountingReports
     * @name CashFlowCreate
     * @request POST:/api/CashFlow
     * @secure
     */
    cashFlowCreate: (
      data: CashFlowRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/AccountingReports
     * @name CashFlowDetailsCreate
     * @request POST:/api/CashFlowDetails
     * @secure
     */
    cashFlowDetailsCreate: (
      data: CashFlowDetailsRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/AccountingReports
     * @name CostOfFundCreate
     * @request POST:/api/CostOfFund
     * @secure
     */
    costOfFundCreate: (
      data: CostOfFundRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/AccountingReports
     * @name DetailTrialBalanceCreate
     * @request POST:/api/DetailTrialBalance
     * @secure
     */
    detailTrialBalanceCreate: (
      data: DetailTrialBalanceRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/AccountingReports
     * @name MonthlyReportCreate
     * @request POST:/api/MonthlyReport
     * @secure
     */
    monthlyReportCreate: (
      data: MonthlyReportRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/AccountingReports
     * @name OfficeProgressGenerateReportCreate
     * @request POST:/api/OfficeProgress/GenerateReport
     * @secure
     */
    officeProgressGenerateReportCreate: (
      data: OfficeProgressRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/AccountingReports
     * @name PlAccountCreate
     * @request POST:/api/PLAccount
     * @secure
     */
    plAccountCreate: (
      data: PLAccountRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/AccountingReports
     * @name RatioAnalysisCreate
     * @request POST:/api/RatioAnalysis
     * @secure
     */
    ratioAnalysisCreate: (
      data: RatioAnalysisRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/AccountingReports
     * @name SummaryTrialBalanceCreate
     * @request POST:/api/SummaryTrialBalance
     * @secure
     */
    summaryTrialBalanceCreate: (
      data: SummaryTrialBalanceRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/AccountingReports
     * @name ThresholdTransactionGenerateReportCreate
     * @request POST:/api/ThresholdTransaction/GenerateReport
     * @secure
     */
    thresholdTransactionGenerateReportCreate: (
      data: ThresholdTransactionRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/IBTReports
     * @name IbtStatementBranchwiseCreate
     * @request POST:/api/IBTStatementBranchwise
     * @secure
     */
    ibtStatementBranchwiseCreate: (
      data: IBTStatementBranchwiseRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/IBTReports
     * @name IbtTransactionCreate
     * @request POST:/api/IBTTransaction
     * @secure
     */
    ibtTransactionCreate: (
      data: IBTTransactionRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/MainLedgerReport
     * @name FourthLedgerDetailsCreate
     * @request POST:/api/FourthLedgerDetails
     * @secure
     */
    fourthLedgerDetailsCreate: (
      data: LedgerDetailsReqResponse,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/MainLedgerReport
     * @name FirstLedgerDetailsCreate
     * @request POST:/api/FirstLedgerDetails
     * @secure
     */
    firstLedgerDetailsCreate: (
      data: FirstLedgerDetailsRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/MainLedgerReport
     * @name LedgerDetailsCreate
     * @request POST:/api/LedgerDetails
     * @secure
     */
    ledgerDetailsCreate: (
      data: SubLedgerDetailsRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/MainLedgerReport
     * @name SecondLedgerDetailsCreate
     * @request POST:/api/SecondLedgerDetails
     * @secure
     */
    secondLedgerDetailsCreate: (
      data: SecondLedgerDetailsRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/MainLedgerReport
     * @name ThirdLedgerDetailsCreate
     * @request POST:/api/ThirdLedgerDetails
     * @secure
     */
    thirdLedgerDetailsCreate: (
      data: ThirdLedgerDetailsRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/OtherReports
     * @name AccountDayOpenAndCloseCreate
     * @request POST:/api/AccountDayOpenAndClose
     * @secure
     */
    accountDayOpenAndCloseCreate: (
      data: AccountDayOpenAndCloseRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/OtherReports
     * @name AccountAccountYearClosingCreate
     * @request POST:/api/account/AccountYearClosing
     * @secure
     */
    accountAccountYearClosingCreate: (
      data: AccountYearClosingRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/OtherReports
     * @name BankReceivedPaymentCreate
     * @request POST:/api/BankReceivedPayment
     * @secure
     */
    bankReceivedPaymentCreate: (
      data: BankReceivedPaymentRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/OtherReports
     * @name CashAndBankBalanceCreate
     * @request POST:/api/CashAndBankBalance
     * @secure
     */
    cashAndBankBalanceCreate: (
      data: CashAndBankBalanceRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/OtherReports
     * @name AccountDailyExpenseCreate
     * @request POST:/api/account/DailyExpense
     * @secure
     */
    accountDailyExpenseCreate: (
      data: DailyExpenseRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/OtherReports
     * @name AccountDailyIncomeCreate
     * @request POST:/api/account/DailyIncome
     * @secure
     */
    accountDailyIncomeCreate: (
      data: DailyIncomeRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/OtherReports
     * @name AccountDayBookLedgerWiseCreate
     * @request POST:/api/account/DayBookLedgerWise
     * @secure
     */
    accountDayBookLedgerWiseCreate: (
      data: DayBookLedgerWiseRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/OtherReports
     * @name DayBookVoucherWiseCreate
     * @request POST:/api/DayBookVoucherWise
     * @secure
     */
    dayBookVoucherWiseCreate: (
      data: DayBookVoucherWiseRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/OtherReports
     * @name PaymentThroughSavingCreate
     * @request POST:/api/PaymentThroughSaving
     * @secure
     */
    paymentThroughSavingCreate: (
      data: PaymentThroughSavingRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/OtherReports
     * @name PearlsAnalysisCreate
     * @request POST:/api/PEARLSAnalysis
     * @secure
     */
    pearlsAnalysisCreate: (
      data: PEARLSAnalysisRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/OtherReports
     * @name AccountReserveMasterCreate
     * @request POST:/api/account/ReserveMaster
     * @secure
     */
    accountReserveMasterCreate: (
      data: ReserveMasterRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/OtherReports
     * @name TellerCashBalanceCreate
     * @request POST:/api/TellerCashBalance
     * @secure
     */
    tellerCashBalanceCreate: (
      data: TellerCashBalanceRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/OtherReports
     * @name TellerCashDetailCreate
     * @request POST:/api/TellerCashDetail
     * @secure
     */
    tellerCashDetailCreate: (
      data: TellerCashDetailRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/OtherReports
     * @name TellerCashVaultCreate
     * @request POST:/api/TellerCashVault
     * @secure
     */
    tellerCashVaultCreate: (
      data: TellerCashVaultRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/OtherReports
     * @name TellerToTellerCashTransferCreate
     * @request POST:/api/TellerToTellerCashTransfer
     * @secure
     */
    tellerToTellerCashTransferCreate: (
      data: TellerToTellerCashTransferRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Account/OtherReports
     * @name AccountVoucherDetailsCreate
     * @request POST:/api/account/VoucherDetails
     * @secure
     */
    accountVoucherDetailsCreate: (
      data: VoucherDetailsRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Common
     * @name AccountLookUpSearchCreate
     * @request POST:/api/AccountLookUp/search
     * @secure
     */
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

    /**
     * No description
     *
     * @tags Common
     * @name AccountLookUpSelectDetail
     * @request GET:/api/AccountLookUp/select/{mamAccountOpeningId}
     * @secure
     */
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

    /**
     * No description
     *
     * @tags Common
     * @name AccountLookUpValidateDetail
     * @request GET:/api/AccountLookUp/validate/{accountNo}
     * @secure
     */
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

    /**
     * No description
     *
     * @tags Common
     * @name AuthLoginCreate
     * @request POST:/api/Auth/login
     * @secure
     */
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

    /**
     * No description
     *
     * @tags Common
     * @name AuthLogoutCreate
     * @request POST:/api/Auth/logout
     * @secure
     */
    authLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Auth/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Common
     * @name BranchGetAllBranchesList
     * @request GET:/api/Branch/GetAllBranches
     * @secure
     */
    branchGetAllBranchesList: (
      query?: {
        /** @format int64 */
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

    /**
     * No description
     *
     * @tags Common
     * @name BranchGetCollectionBranchList
     * @request GET:/api/Branch/GetCollectionBranch
     * @secure
     */
    branchGetCollectionBranchList: (
      query?: {
        /** @format int64 */
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

    /**
     * No description
     *
     * @tags Common
     * @name CollectionCenterCollectionCentersCreate
     * @request POST:/api/CollectionCenter/collection-centers
     * @secure
     */
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

    /**
     * No description
     *
     * @tags Common
     * @name CollectorGetCollectorList
     * @request GET:/api/Collector/getCollector
     * @secure
     */
    collectorGetCollectorList: (
      query?: {
        /** @format int64 */
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

    /**
     * No description
     *
     * @tags Common
     * @name CalendarYearsList
     * @request GET:/api/Calendar/years
     * @secure
     */
    calendarYearsList: (params: RequestParams = {}) =>
      this.request<YearsResponseDto, any>({
        path: `/api/Calendar/years`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Common
     * @name CalendarDaysList
     * @request GET:/api/Calendar/days
     * @secure
     */
    calendarDaysList: (
      query?: {
        /** @format int32 */
        year?: number;
        /** @format int32 */
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

    /**
     * No description
     *
     * @tags Common
     * @name CalendarConvertCreate
     * @request POST:/api/Calendar/convert
     * @secure
     */
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

    /**
     * No description
     *
     * @tags Common
     * @name DepositeTypeGetDepositeTypeList
     * @request GET:/api/DepositeType/getDepositeType
     * @secure
     */
    depositeTypeGetDepositeTypeList: (params: RequestParams = {}) =>
      this.request<GeneralResponseOfListOfDepositTypeResponse, any>({
        path: `/api/DepositeType/getDepositeType`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Common
     * @name DepositStatementVerifyStatusDetail
     * @request GET:/api/DepositStatementVerify/Status/{mamAccountOpeningId}
     * @secure
     */
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

    /**
     * No description
     *
     * @tags Common
     * @name DepositStatementVerifyHistoryDetail
     * @request GET:/api/DepositStatementVerify/History/{mamAccountOpeningId}
     * @secure
     */
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

    /**
     * No description
     *
     * @tags Common
     * @name DepositStatementVerifyVerifyCreate
     * @request POST:/api/DepositStatementVerify/Verify
     * @secure
     */
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

    /**
     * No description
     *
     * @tags Common
     * @name LedgerLookupLedgerHeadList
     * @request GET:/api/LedgerLookup/LedgerHead
     * @secure
     */
    ledgerLookupLedgerHeadList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/LedgerLookup/LedgerHead`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Common
     * @name LedgerLookupLedgerNameList
     * @request GET:/api/LedgerLookup/LedgerName
     * @secure
     */
    ledgerLookupLedgerNameList: (
      query?: {
        FromDate?: string;
        ToDate?: string;
        BranchId?: string;
        /** @format int32 */
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

    /**
     * No description
     *
     * @tags Common
     * @name LedgerLookupSubLedgerNameList
     * @request GET:/api/LedgerLookup/SubLedgerName
     * @secure
     */
    ledgerLookupSubLedgerNameList: (
      query?: {
        FromDate?: string;
        ToDate?: string;
        BranchId?: string;
        /** @format int32 */
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

    /**
     * No description
     *
     * @tags Common
     * @name LedgerLookupSecondSubLedgerNameList
     * @request GET:/api/LedgerLookup/SecondSubLedgerName
     * @secure
     */
    ledgerLookupSecondSubLedgerNameList: (
      query?: {
        FromDate?: string;
        ToDate?: string;
        BranchId?: string;
        /** @format int32 */
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

    /**
     * No description
     *
     * @tags Common
     * @name LedgerLookupThirdSubLedgerNameList
     * @request GET:/api/LedgerLookup/ThirdSubLedgerName
     * @secure
     */
    ledgerLookupThirdSubLedgerNameList: (
      query?: {
        FromDate?: string;
        ToDate?: string;
        BranchId?: string;
        /** @format int32 */
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

    /**
     * No description
     *
     * @tags Common
     * @name LedgerLookupFourthSubLedgerNameList
     * @request GET:/api/LedgerLookup/FourthSubLedgerName
     * @secure
     */
    ledgerLookupFourthSubLedgerNameList: (
      query?: {
        FromDate?: string;
        ToDate?: string;
        BranchId?: string;
        /** @format int32 */
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

    /**
     * No description
     *
     * @tags Common
     * @name LmtLoanMaseterListList
     * @request GET:/api/LmtLoanMaseterList
     * @secure
     */
    lmtLoanMaseterListList: (params: RequestParams = {}) =>
      this.request<GeneralResponseOfListOfLmtLoanMaseterListResponse, any>({
        path: `/api/LmtLoanMaseterList`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Common
     * @name MemberGroupMemberGroupsCreate
     * @request POST:/api/MemberGroup/member-groups
     * @secure
     */
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

    /**
     * No description
     *
     * @tags Common
     * @name MemberLookUpSearchList
     * @request GET:/api/MemberLookUp/search
     * @secure
     */
    memberLookUpSearchList: (
      query?: {
        /** @format int32 */
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

    /**
     * No description
     *
     * @tags Common
     * @name MemberLookUpSelectDetail
     * @request GET:/api/MemberLookUp/select/{memMemberRegistrationId}
     * @secure
     */
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

    /**
     * No description
     *
     * @tags Common
     * @name OrderByGetAllOrderByList
     * @request GET:/api/OrderBy/GetAllOrderBy
     * @secure
     */
    orderByGetAllOrderByList: (params: RequestParams = {}) =>
      this.request<GeneralResponseOfAllReportOrderByResponseModel, any>({
        path: `/api/OrderBy/GetAllOrderBy`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Common
     * @name PaymentDurationTypeList
     * @request GET:/api/PaymentDurationType
     * @secure
     */
    paymentDurationTypeList: (params: RequestParams = {}) =>
      this.request<PaymentDurationTypeResponse[], any>({
        path: `/api/PaymentDurationType`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Common
     * @name ShareTypeList
     * @request GET:/api/ShareType
     * @secure
     */
    shareTypeList: (params: RequestParams = {}) =>
      this.request<GeneralResponseOfListOfShareTypeResponse, any>({
        path: `/api/ShareType`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Common
     * @name SoleMemberGroupCreate
     * @request POST:/api/SoleMemberGroup
     * @secure
     */
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

    /**
     * No description
     *
     * @tags Common
     * @name TellerList
     * @request GET:/api/Teller
     * @secure
     */
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

    /**
     * No description
     *
     * @tags Common
     * @name TellerExpenseListList
     * @request GET:/api/TellerExpenseList
     * @secure
     */
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

    /**
     * No description
     *
     * @tags Common
     * @name UserLookupList
     * @request GET:/api/UserLookup
     * @secure
     */
    userLookupList: (params: RequestParams = {}) =>
      this.request<UserLookupResponse[], any>({
        path: `/api/UserLookup`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Common
     * @name VoucherListCreate
     * @request POST:/api/Voucher/list
     * @secure
     */
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

    /**
     * No description
     *
     * @tags Common
     * @name VoucherByNumberList
     * @request GET:/api/Voucher/by-number
     * @secure
     */
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

    /**
     * No description
     *
     * @tags Loan/OtherReports
     * @name LoanAccountClosedCreate
     * @request POST:/api/LoanAccountClosed
     * @secure
     */
    loanAccountClosedCreate: (
      data: LoanAccountClosedRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Loan/OtherReports
     * @name LoanAppraisalCreate
     * @request POST:/api/LoanAppraisal
     * @secure
     */
    loanAppraisalCreate: (
      data: LoanAppraisalRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Loan/OtherReports
     * @name LoanCommissionCreate
     * @request POST:/api/LoanCommission
     * @secure
     */
    loanCommissionCreate: (
      data: LoanCommissionRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Loan/OtherReports
     * @name LoanDefaulterDueSummaryCreate
     * @request POST:/api/LoanDefaulterDueSummary
     * @secure
     */
    loanDefaulterDueSummaryCreate: (
      data: LoanDefaulterDueSummaryRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Loan/OtherReports
     * @name LoanDueInstallmentCreate
     * @request POST:/api/LoanDueInstallment
     * @secure
     */
    loanDueInstallmentCreate: (
      data: LoanDueInstallmentRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Loan/OtherReports
     * @name LoanFollowUpCreate
     * @request POST:/api/LoanFollowUp
     * @secure
     */
    loanFollowUpCreate: (
      data: LoanFollowUpRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Loan/OtherReports
     * @name LoanGuaranteerCreate
     * @request POST:/api/LoanGuaranteer
     * @secure
     */
    loanGuaranteerCreate: (
      data: LoanGuaranteerRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Loan/OtherReports
     * @name LoanInterestDiscountCreate
     * @request POST:/api/LoanInterestDiscount
     * @secure
     */
    loanInterestDiscountCreate: (
      data: LoanInterestDiscountRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Loan/OtherReports
     * @name LoanInterestReceivableMonthlyCreate
     * @request POST:/api/LoanInterestReceivableMonthly
     * @secure
     */
    loanInterestReceivableMonthlyCreate: (
      data: LoanInterestReceivableMonthlyRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Loan/OtherReports
     * @name LoanInterestReceivableYearEndCreate
     * @request POST:/api/LoanInterestReceivableYearEnd
     * @secure
     */
    loanInterestReceivableYearEndCreate: (
      data: LoanInterestReceivableYearEndRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Loan/OtherReports
     * @name LoanMiscellaneousIncomeCreate
     * @request POST:/api/LoanMiscellaneousIncome
     * @secure
     */
    loanMiscellaneousIncomeCreate: (
      data: LoanMiscellaneousIncomeRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Loan/OtherReports
     * @name LoanPaymentCreate
     * @request POST:/api/LoanPayment
     * @secure
     */
    loanPaymentCreate: (
      data: LoanPaymentRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Loan/OtherReports
     * @name LoanPenaltyDiscountCreate
     * @request POST:/api/LoanPenaltyDiscount
     * @secure
     */
    loanPenaltyDiscountCreate: (
      data: LoanPenaltyDiscountRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Loan/OtherReports
     * @name LoanRepaymentCreate
     * @request POST:/api/LoanRepayment
     * @secure
     */
    loanRepaymentCreate: (
      data: LoanRepaymentRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Loan/OtherReports
     * @name LoanReScheduleCreate
     * @request POST:/api/LoanReSchedule
     * @secure
     */
    loanReScheduleCreate: (
      data: LoanReScheduleRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Loan/OtherReports
     * @name LoanSummaryCreate
     * @request POST:/api/LoanSummary
     * @secure
     */
    loanSummaryCreate: (
      data: LoanSummaryRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Loan/OtherReports
     * @name MaturedLoanCreate
     * @request POST:/api/MaturedLoan
     * @secure
     */
    maturedLoanCreate: (
      data: MaturedLoanRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Member
     * @name MemberAllDetailsCreate
     * @request POST:/api/MemberAllDetails
     * @secure
     */
    memberAllDetailsCreate: (
      data: MemberAllDetailRequst,
      query?: {
        /** @default "View" */
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

    /**
     * No description
     *
     * @tags Member
     * @name MemberBasicDetailsCreate
     * @request POST:/api/MemberBasicDetails
     * @secure
     */
    memberBasicDetailsCreate: (
      data: MemberBasicDetailsRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Member
     * @name MemberBloodGroupReportCreate
     * @request POST:/api/MemberBloodGroupReport
     * @secure
     */
    memberBloodGroupReportCreate: (
      data: MemberBloodGroupReportRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Member
     * @name MemberDetailsSummaryCreate
     * @request POST:/api/MemberDetailsSummary
     * @secure
     */
    memberDetailsSummaryCreate: (
      data: MemberDetailsSummaryRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Member
     * @name MemberIdCardMemberIdCardCreate
     * @request POST:/api/MemberIdCard/MemberIdCard
     * @secure
     */
    memberIdCardMemberIdCardCreate: (
      data: MemberIdCardRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags Member
     * @name MemberRegistrationCreate
     * @request POST:/api/MemberRegistration
     * @secure
     */
    memberRegistrationCreate: (
      data: MemberDetailRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/ChequeBookReport
     * @name ChequeBookIssueCreate
     * @request POST:/api/ChequeBookIssue
     * @secure
     */
    chequeBookIssueCreate: (
      data: ChequeBookIssueRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/ChequeBookReport
     * @name ChequeBookLostCreate
     * @request POST:/api/ChequeBookLost
     * @secure
     */
    chequeBookLostCreate: (
      data: ChequeBookLostRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/ChequeBookReport
     * @name ChequeBookWithdrawalCreate
     * @request POST:/api/ChequeBookWithdrawal
     * @secure
     */
    chequeBookWithdrawalCreate: (
      data: ChequeBookWithdrawalRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/CollectorDetailReport
     * @name CollectorWiseAccountCloseCreate
     * @request POST:/api/CollectorWiseAccountClose
     * @secure
     */
    collectorWiseAccountCloseCreate: (
      data: CollectorWiseAccountCloseRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/CollectorDetailReport
     * @name CollectorWiseCommissionCreate
     * @request POST:/api/CollectorWiseCommission
     * @secure
     */
    collectorWiseCommissionCreate: (
      data: CollectorWiseCommissionRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/CollectorDetailReport
     * @name CollectorWiseCommissionSummaryCreate
     * @request POST:/api/CollectorWiseCommissionSummary
     * @secure
     */
    collectorWiseCommissionSummaryCreate: (
      data: CollectorWiseCommissionSummaryRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/CollectorDetailReport
     * @name CollectorWiseVisitCreate
     * @request POST:/api/CollectorWiseVisit
     * @secure
     */
    collectorWiseVisitCreate: (
      data: CollectorWiseVisitRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/CollectorDetailReport
     * @name CollectorWiseWithdrawalCreate
     * @request POST:/api/CollectorWiseWithdrawal
     * @secure
     */
    collectorWiseWithdrawalCreate: (
      data: CollectorWiseWithdrawalRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/InterestExpenseReport
     * @name FixedDepositInterestTransferCreate
     * @request POST:/api/FixedDepositInterestTransfer
     * @secure
     */
    fixedDepositInterestTransferCreate: (
      data: FixedDepositInterestTransferRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/InterestExpenseReport
     * @name InterestAndTaxDetailCreate
     * @request POST:/api/InterestAndTaxDetail
     * @secure
     */
    interestAndTaxDetailCreate: (
      data: InterestAndTaxDetailRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/InterestExpenseReport
     * @name InterestAndTaxPostedCreate
     * @request POST:/api/InterestAndTaxPosted
     * @secure
     */
    interestAndTaxPostedCreate: (
      data: InterestAndTaxPostedRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/InterestExpenseReport
     * @name InterestAndTaxTypeWiseCreate
     * @request POST:/api/InterestAndTaxTypeWise
     * @secure
     */
    interestAndTaxTypeWiseCreate: (
      data: InterestAndTaxTypeWiseRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/InterestPayableReport
     * @name FixedDepositCertificateScheduleCreate
     * @request POST:/api/FixedDepositCertificateSchedule
     * @secure
     */
    fixedDepositCertificateScheduleCreate: (
      data: FixedDepositCertificateScheduleRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/InterestPayableReport
     * @name InterestPayableCreate
     * @request POST:/api/InterestPayable
     * @secure
     */
    interestPayableCreate: (
      data: InterestPayableRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/InterestPayableReport
     * @name PayableInterestTransferredCreate
     * @request POST:/api/PayableInterestTransferred
     * @secure
     */
    payableInterestTransferredCreate: (
      data: PayableInterestTransferredRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/InterestPayableReport
     * @name SavingsAccountMaturityCreate
     * @request POST:/api/SavingsAccountMaturity
     * @secure
     */
    savingsAccountMaturityCreate: (
      data: SavingsAccountMaturityRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/InterestPayableReport
     * @name SavingsAccountNextInterestTransferCreate
     * @request POST:/api/SavingsAccountNextInterestTransfer
     * @secure
     */
    savingsAccountNextInterestTransferCreate: (
      data: SavingsAccountInterestTransferRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/OthersReport
     * @name BranchToBranchCollectionCreate
     * @request POST:/api/BranchToBranchCollection
     * @secure
     */
    branchToBranchCollectionCreate: (
      data: BranchToBranchCollectionRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/OthersReport
     * @name BranchToBranchExpenseCreate
     * @request POST:/api/BranchToBranchExpense
     * @secure
     */
    branchToBranchExpenseCreate: (
      data: BranchToBranchExpenseRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/OthersReport
     * @name ChequeClearanceCreate
     * @request POST:/api/ChequeClearance
     * @secure
     */
    chequeClearanceCreate: (
      data: ChequeClearanceRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/OthersReport
     * @name DataEditedReportCreate
     * @request POST:/api/DataEditedReport
     * @secure
     */
    dataEditedReportCreate: (
      data: DataEditedReportRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/OthersReport
     * @name LoanPaymentThroughSavingCreate
     * @request POST:/api/LoanPaymentThroughSaving
     * @secure
     */
    loanPaymentThroughSavingCreate: (
      data: LoanPaymentThroughSavingRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/OthersReport
     * @name MiscellaneousIncomeCreate
     * @request POST:/api/MiscellaneousIncome
     * @secure
     */
    miscellaneousIncomeCreate: (
      data: MiscellaneousIncomeRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/OthersReport
     * @name SalaryTransactionCreate
     * @request POST:/api/SalaryTransaction
     * @secure
     */
    salaryTransactionCreate: (
      data: SalaryTransactionRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/OthersReport
     * @name SavingAccountClosedCreate
     * @request POST:/api/SavingAccountClosed
     * @secure
     */
    savingAccountClosedCreate: (
      data: SavingAccountClosedRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/OthersReport
     * @name SavingAccountDeletedCreate
     * @request POST:/api/SavingAccountDeleted
     * @secure
     */
    savingAccountDeletedCreate: (
      data: SavingAccountDeletedRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/OthersReport
     * @name SavingAccountRenewedCreate
     * @request POST:/api/SavingAccountRenewed
     * @secure
     */
    savingAccountRenewedCreate: (
      data: SavingAccountRenewedRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/OthersReport
     * @name SavingDepositAmountDateWiseCreate
     * @request POST:/api/SavingDepositAmountDateWise
     * @secure
     */
    savingDepositAmountDateWiseCreate: (
      data: SavingDepositDateWiseRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/OthersReport
     * @name SavingDepositAmountMemberWiseCreate
     * @request POST:/api/SavingDepositAmountMemberWise
     * @secure
     */
    savingDepositAmountMemberWiseCreate: (
      data: SavingDepositMemberWiseRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/OthersReport
     * @name SavingInterestChangeLogCreate
     * @request POST:/api/SavingInterestChangeLog
     * @secure
     */
    savingInterestChangeLogCreate: (
      data: SavingInterestChangeLogRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/OthersReport
     * @name SavingIssueCreate
     * @request POST:/api/SavingIssue
     * @secure
     */
    savingIssueCreate: (
      data: SavingIssueRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/OthersReport
     * @name SavingTransferCreate
     * @request POST:/api/SavingTransfer
     * @secure
     */
    savingTransferCreate: (
      data: SavingTransferRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/OthersReport
     * @name TellerWiseCollectionCreate
     * @request POST:/api/TellerWiseCollection
     * @secure
     */
    tellerWiseCollectionCreate: (
      data: TellerWiseCollectionRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/OthersReport
     * @name TellerWiseExpenseCreate
     * @request POST:/api/TellerWiseExpense
     * @secure
     */
    tellerWiseExpenseCreate: (
      data: TellerWiseExpenseRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/SavingAccWiseReport
     * @name DepositStatementCreate
     * @request POST:/api/DepositStatement
     * @secure
     */
    depositStatementCreate: (
      data: DepositStatementRequestDto,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/SavingAccWiseReport
     * @name DepositUnverifiedGenerateReportCreate
     * @request POST:/api/DepositUnverified/GenerateReport
     * @secure
     */
    depositUnverifiedGenerateReportCreate: (
      data: DepositUnverifiedRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/SavingAccWiseReport
     * @name DepositWithdrawMaxAmountRangeGenerateReportCreate
     * @request POST:/api/DepositWithdrawMaxAmountRange/GenerateReport
     * @secure
     */
    depositWithdrawMaxAmountRangeGenerateReportCreate: (
      data: DepositWithdrawMaxAmountRangeRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/SavingAccWiseReport
     * @name MemberAccountDeactiveCreate
     * @request POST:/api/MemberAccountDeactive
     * @secure
     */
    memberAccountDeactiveCreate: (
      data: MemberAccountDeactiveRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/SavingAccWiseReport
     * @name MemberAccountDetailNoCreate
     * @request POST:/api/MemberAccountDetailNo
     * @secure
     */
    memberAccountDetailNoCreate: (
      data: MemberAccountDetailNoRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/SavingAccWiseReport
     * @name MemberAccountDetailCreate
     * @request POST:/api/MemberAccountDetail
     * @secure
     */
    memberAccountDetailCreate: (
      data: MemberAccountDetailRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/SavingAccWiseReport
     * @name MemberPenaltyDepositWithdrawCreate
     * @request POST:/api/MemberPenaltyDepositWithdraw
     * @secure
     */
    memberPenaltyDepositWithdrawCreate: (
      data: MemberPenaltyDepositWithdrawRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/SavingAccWiseReport
     * @name MemberSummaryCreate
     * @request POST:/api/MemberSummary
     * @secure
     */
    memberSummaryCreate: (
      data: MemberSummaryRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/SavingAccWiseReport
     * @name SavingAcWiseBalanceReportCreate
     * @request POST:/api/SavingACWiseBalanceReport
     * @secure
     */
    savingAcWiseBalanceReportCreate: (
      data: SavingAcWiseBalanceRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/SavingAccWiseReport
     * @name SavingAcWiseBalanceReportProgressiveDetail
     * @request GET:/api/SavingACWiseBalanceReport/progressive/{jobId}
     * @secure
     */
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

    /**
     * No description
     *
     * @tags MemberAccount/SavingAccWiseReport
     * @name SavingTypeWiseBalanceCreate
     * @request POST:/api/SavingTypeWiseBalance
     * @secure
     */
    savingTypeWiseBalanceCreate: (
      data: SavingTypeWiseBalanceRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/SavingAccWiseReport
     * @name SavingTypeWiseIndividualBalanceCreate
     * @request POST:/api/SavingTypeWiseIndividualBalance
     * @secure
     */
    savingTypeWiseIndividualBalanceCreate: (
      data: SavingTypeWiseIndividualBalanceRequest,
      query?: {
        /** @default "VIEW" */
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

    /**
     * No description
     *
     * @tags MemberAccount/SavingAccWiseReport
     * @name SmsCategoryCreate
     * @request POST:/api/SMSCategory
     * @secure
     */
    smsCategoryCreate: (
      data: SMSCategoryRequest,
      query?: {
        /** @default "VIEW" */
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
  };
}
