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

export interface AccountLookUpDtosListGeneralResponse {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: AccountLookUpDtos[] | null;
  pagination?: Pagination;
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

export interface AccountSelectedDtoGeneralResponse {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: AccountSelectedDto;
  pagination?: Pagination;
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

export interface AllReportOrderByResponseModel {
  memberIdCard?: OrderByResponse[] | null;
  savingTypeWiseBalance?: OrderByResponse[] | null;
}

export interface AllReportOrderByResponseModelGeneralResponse {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: AllReportOrderByResponseModel;
  pagination?: Pagination;
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

export interface BranchResponse {
  /** @format int64 */
  branchId?: number;
  branchName?: string | null;
}

export interface BranchResponseListGeneralResponse {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: BranchResponse[] | null;
  pagination?: Pagination;
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

export interface CollectorResponseListGeneralResponse {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: CollectorResponse[] | null;
  pagination?: Pagination;
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

export interface DepositStatementVerificationDtoListGeneralResponse {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: DepositStatementVerificationDto[] | null;
  pagination?: Pagination;
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

export interface DepositTypeResponseListGeneralResponse {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: DepositTypeResponse[] | null;
  pagination?: Pagination;
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

export interface LmtLoanMaseterListResponse {
  /** @format int64 */
  lmtLoanTypeMasterId?: number;
  loanTypeName?: string | null;
}

export interface LmtLoanMaseterListResponseListGeneralResponse {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: LmtLoanMaseterListResponse[] | null;
  pagination?: Pagination;
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
  officeIds?: string | null;
  companyName?: string | null;
  systemEditionName?: string | null;
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

export interface MemberLookUpDtosPagination {
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

export interface ReportResponseDtosGeneralResponse {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: ReportResponseDtos;
  pagination?: Pagination;
}

export interface SMSCategoryRequest {
  branchId?: string | null;
  branchName?: string | null;
  smsCategoryId?: string | null;
  orderBy?: string | null;
  visualReport?: boolean;
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

export interface ShareTypeResponse {
  /** @format int32 */
  shmShareTypeId?: number;
  shareTypeName?: string | null;
}

export interface ShareTypeResponseListGeneralResponse {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: ShareTypeResponse[] | null;
  pagination?: Pagination;
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

export interface TellerLookupResponse {
  /** @format int64 */
  id?: number;
  name?: string | null;
}

export interface TellerWiseCollectionRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  /** @format int64 */
  tellerId?: number | null;
  orderBy?: string | null;
  sameCompanyName?: boolean;
  visualReport?: boolean;
}

export interface TellerWiseExpenseRequestDto {
  fromDateBs?: string | null;
  toDateBs?: string | null;
  /** @format int64 */
  tellerId?: number | null;
  orderBy?: string | null;
  sameCompanyName?: boolean;
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

export interface VerificationStatusDtoGeneralResponse {
  isValid?: boolean;
  /** @format int32 */
  statusCode?: number;
  message?: string | null;
  data?: VerificationStatusDto;
  pagination?: Pagination;
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
     * @tags AccountLookUp
     * @name AccountLookUpSearchCreate
     * @request POST:/api/AccountLookUp/search
     * @secure
     */
    accountLookUpSearchCreate: (data: Filter, params: RequestParams = {}) =>
      this.request<AccountLookUpDtosListGeneralResponse, any>({
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
     * @tags AccountLookUp
     * @name AccountLookUpSelectDetail
     * @request GET:/api/AccountLookUp/select/{mamAccountOpeningId}
     * @secure
     */
    accountLookUpSelectDetail: (
      mamAccountOpeningId: number,
      params: RequestParams = {},
    ) =>
      this.request<AccountSelectedDtoGeneralResponse, any>({
        path: `/api/AccountLookUp/select/${mamAccountOpeningId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AccountLookUp
     * @name AccountLookUpValidateDetail
     * @request GET:/api/AccountLookUp/validate/{accountNo}
     * @secure
     */
    accountLookUpValidateDetail: (
      accountNo: string,
      params: RequestParams = {},
    ) =>
      this.request<AccountSelectedDtoGeneralResponse, any>({
        path: `/api/AccountLookUp/validate/${accountNo}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AccountStatement
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
      this.request<ReportResponseDtosGeneralResponse, any>({
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
     * @tags Auth
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
     * @tags Auth
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
     * @tags BalanceSheet
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
     * @tags Branch
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
      this.request<BranchResponseListGeneralResponse, any>({
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
     * @tags Calendar
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
     * @tags Calendar
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
     * @tags Calendar
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
     * @tags CashFlow
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
     * @tags CashFlowDetails
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
     * @tags CollectionCenter
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
     * @tags Collector
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
      this.request<CollectorResponseListGeneralResponse, any>({
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
     * @tags CostOfFund
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
     * @tags DataEditedReport
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
      this.request<ReportResponseDtosGeneralResponse, any>({
        path: `/api/DataEditedReport`,
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
     * @tags DepositeType
     * @name DepositeTypeGetDepositeTypeList
     * @request GET:/api/DepositeType/getDepositeType
     * @secure
     */
    depositeTypeGetDepositeTypeList: (params: RequestParams = {}) =>
      this.request<DepositTypeResponseListGeneralResponse, any>({
        path: `/api/DepositeType/getDepositeType`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DepositStatement
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
     * @tags DepositStatementVerify
     * @name DepositStatementVerifyStatusDetail
     * @request GET:/api/DepositStatementVerify/Status/{mamAccountOpeningId}
     * @secure
     */
    depositStatementVerifyStatusDetail: (
      mamAccountOpeningId: number,
      params: RequestParams = {},
    ) =>
      this.request<VerificationStatusDtoGeneralResponse, any>({
        path: `/api/DepositStatementVerify/Status/${mamAccountOpeningId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DepositStatementVerify
     * @name DepositStatementVerifyHistoryDetail
     * @request GET:/api/DepositStatementVerify/History/{mamAccountOpeningId}
     * @secure
     */
    depositStatementVerifyHistoryDetail: (
      mamAccountOpeningId: number,
      params: RequestParams = {},
    ) =>
      this.request<DepositStatementVerificationDtoListGeneralResponse, any>({
        path: `/api/DepositStatementVerify/History/${mamAccountOpeningId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DepositStatementVerify
     * @name DepositStatementVerifyVerifyCreate
     * @request POST:/api/DepositStatementVerify/Verify
     * @secure
     */
    depositStatementVerifyVerifyCreate: (
      data: DepositStatementVerifyRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<VerificationStatusDtoGeneralResponse, any>({
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
     * @tags DepositUnverified
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
     * @tags DepositWithdrawMaxAmountRange
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
     * @tags DetailTrialBalance
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
     * @tags LmtLoanMaseterList
     * @name LmtLoanMaseterListList
     * @request GET:/api/LmtLoanMaseterList
     * @secure
     */
    lmtLoanMaseterListList: (params: RequestParams = {}) =>
      this.request<LmtLoanMaseterListResponseListGeneralResponse, any>({
        path: `/api/LmtLoanMaseterList`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemberAccountDeactive
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
     * @tags MemberAccountDetail
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
     * @tags MemberAccountDetailNo
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
     * @tags MemberAllDetails
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
      this.request<ReportResponseDtosGeneralResponse, any>({
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
     * @tags MemberBasicDetails
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
      this.request<ReportResponseDtosGeneralResponse, any>({
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
     * @tags MemberBloodGroupReport
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
     * @tags MemberDetailsSummary
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
     * @tags MemberGroup
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
     * @tags MemberIdCard
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
     * @tags MemberLookUp
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
      this.request<MemberLookUpDtosPagination, any>({
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
     * @tags MemberLookUp
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
     * @tags MemberPenaltyDepositWithdraw
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
     * @tags MemberRegistration
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
      this.request<ReportResponseDtosGeneralResponse, any>({
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
     * @tags MemberSummary
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
     * @tags MonthlyReport
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
     * @tags OfficeProgress
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
     * @tags OrderBy
     * @name OrderByGetAllOrderByList
     * @request GET:/api/OrderBy/GetAllOrderBy
     * @secure
     */
    orderByGetAllOrderByList: (params: RequestParams = {}) =>
      this.request<AllReportOrderByResponseModelGeneralResponse, any>({
        path: `/api/OrderBy/GetAllOrderBy`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PLAccount
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
     * @tags RatioAnalysis
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
     * @tags SavingACWiseBalanceReport
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
     * @tags SavingACWiseBalanceReport
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
     * @tags SavingTypeWiseBalance
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
     * @tags SavingTypeWiseIndividualBalance
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
     * @tags ShareType
     * @name ShareTypeList
     * @request GET:/api/ShareType
     * @secure
     */
    shareTypeList: (params: RequestParams = {}) =>
      this.request<ShareTypeResponseListGeneralResponse, any>({
        path: `/api/ShareType`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SMSCategory
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

    /**
     * No description
     *
     * @tags SoleMemberGroup
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
     * @tags SummaryTrialBalance
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
     * @tags Teller
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
     * @tags TellerExpenseList
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
     * @tags TellerWiseCollection
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
      this.request<ReportResponseDtosGeneralResponse, any>({
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
     * @tags TellerWiseExpense
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
      this.request<ReportResponseDtosGeneralResponse, any>({
        path: `/api/TellerWiseExpense`,
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
     * @tags ThresholdTransaction
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
     * @tags UserLookup
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
  };
}
