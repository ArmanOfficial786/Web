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

export interface AccountStatementRequest {
  fromDate?: string | null;
  toDate?: string | null;
  branchSelected?: string | null;
  /** @format int64 */
  branchId?: number;
  branchName?: string | null;
  reportType?: string | null;
  transactionType?: string | null;
  orderBy?: string | null;
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

export interface MemberDetailRequest {
  fromDate?: string | null;
  toDate?: string | null;
  /** @format int64 */
  branchId?: number;
  /** @format int64 */
  memberGroupId?: number;
  /** @format int32 */
  currentPage?: number;
  /** @format int32 */
  pageSize?: number;
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

export interface MemberLookUpDtosPagedResult {
  items?: MemberLookUpDtos[] | null;
  /** @format int32 */
  totalCount?: number;
  /** @format int32 */
  currentPage?: number;
  /** @format int32 */
  pageSize?: number;
  /** @format int32 */
  totalPages?: number;
}

export interface MemberSelectedDto {
  memberId?: string | null;
  memberName?: string | null;
}

export interface OrderByResponse {
  /** @format int32 */
  value?: number;
  displayName?: string | null;
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
 * @title JsSampleReport
 * @version 1.0
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags AccountStatement
     * @name AccountStatementAccountStatementReportCreate
     * @request POST:/api/AccountStatement/AccountStatementReport
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
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Branch
     * @name BranchGetAllBranchesList
     * @request GET:/api/Branch/GetAllBranches
     */
    branchGetAllBranchesList: (params: RequestParams = {}) =>
      this.request<BranchResponseListGeneralResponse, any>({
        path: `/api/Branch/GetAllBranches`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CollectionCenter
     * @name CollectionCenterCollectionCentersCreate
     * @request POST:/api/CollectionCenter/collection-centers
     */
    collectionCenterCollectionCentersCreate: (
      data: CollectionCenterRequestDtos,
      params: RequestParams = {},
    ) =>
      this.request<CollectionCenterResponseDto[], any>({
        path: `/api/CollectionCenter/collection-centers`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemberDetail
     * @name MemberDetailMemberDetailReportCreate
     * @request POST:/api/MemberDetail/MemberDetailReport
     */
    memberDetailMemberDetailReportCreate: (
      data: MemberDetailRequest,
      query?: {
        /** @default "VIEW" */
        format?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ReportResponseDtosGeneralResponse, any>({
        path: `/api/MemberDetail/MemberDetailReport`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemberGroup
     * @name MemberGroupMemberGroupsCreate
     * @request POST:/api/MemberGroup/member-groups
     */
    memberGroupMemberGroupsCreate: (
      data: MemberGroupRequestDtos,
      params: RequestParams = {},
    ) =>
      this.request<MemberGroupResponseDto[], any>({
        path: `/api/MemberGroup/member-groups`,
        method: "POST",
        body: data,
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
     */
    memberIdCardMemberIdCardCreate: (
      data: MemberIdCardRequest,
      query?: {
        /** @default "VIEW" */
        requestType?: string;
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
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemberLookUp
     * @name MemberLookUpSearchList
     * @request GET:/api/MemberLookUp/search
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
      this.request<MemberLookUpDtosPagedResult, any>({
        path: `/api/MemberLookUp/search`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemberLookUp
     * @name MemberLookUpSelectDetail
     * @request GET:/api/MemberLookUp/select/{memMemberRegistrationId}
     */
    memberLookUpSelectDetail: (
      memMemberRegistrationId: number,
      params: RequestParams = {},
    ) =>
      this.request<MemberSelectedDto, any>({
        path: `/api/MemberLookUp/select/${memMemberRegistrationId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderBy
     * @name OrderByGetAllOrderByList
     * @request GET:/api/OrderBy/GetAllOrderBy
     */
    orderByGetAllOrderByList: (params: RequestParams = {}) =>
      this.request<AllReportOrderByResponseModelGeneralResponse, any>({
        path: `/api/OrderBy/GetAllOrderBy`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  preview = {
    /**
     * No description
     *
     * @tags Home
     * @name MemberReportList
     * @request GET:/preview/member-report
     */
    memberReportList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/preview/member-report`,
        method: "GET",
        ...params,
      }),
  };
}
