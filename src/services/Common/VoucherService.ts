import { VoucherListRequest, VoucherOptionResponse } from "types/api/api";
import { apiClient } from "../apiClient";

export interface VoucherLookupResponse {
  acoVoucherId: number;
  voucherNo: string;
}

const voucherService = {
  getAll: async (
    params: VoucherListRequest,
  ): Promise<VoucherLookupResponse[]> => {
    const response = await apiClient.api.voucherListCreate({
      fromDate: params.fromDate,
      toDate: params.toDate,
      branchIds: params.branchIds ?? [],
    });
    const raw = response.data as unknown;
    const items: VoucherOptionResponse[] = Array.isArray(raw)
      ? (raw as VoucherOptionResponse[])
      : ((raw as { data?: VoucherOptionResponse[] })?.data ?? []);

    return items
      .filter((v) => !!v?.voucherNo || v?.acoVoucherId != null)
      .map((v, index) => ({
        acoVoucherId: v.acoVoucherId ?? index + 1,
        voucherNo: v.voucherNo ?? `Voucher ${index + 1}`,
      }));
  },
};

export default voucherService;
