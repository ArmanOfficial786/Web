import type { RemittanceReceiptResponse } from "types/api/api";

import remitService from "@/services/Remit/remitService";

export interface RemittanceReceiptOption {
  id: number | string;
  name: string;
}

export interface RemittanceReceiptParams {
  isReceived?: boolean;
  createdBy?: number;
  fromDateBs: string;
  toDateBs: string;
  officeIds?: number[];
}

const remittanceReceiptService = {
  getRemittanceReceipts: async (
    params: RemittanceReceiptParams,
  ): Promise<RemittanceReceiptOption[]> => {
    const res =
      await remitService.api.remittanceReceiptGetRemittanceReceiptsList({
        isReceived: params.isReceived,
        createdBy: params.createdBy,
        fromDateBs: params.fromDateBs,
        toDateBs: params.toDateBs,
        officeIds: params.officeIds,
      });

    const rows: RemittanceReceiptResponse[] = Array.isArray(res?.data?.data)
      ? res.data.data
      : [];

    return rows
      .map((row) => ({
        id: row.remittanceReceiptId ?? "",
        name: row.remittanceReceiptName ?? "",
      }))
      .filter((option) => option.id !== "" && option.name !== "");
  },
};

export default remittanceReceiptService;
