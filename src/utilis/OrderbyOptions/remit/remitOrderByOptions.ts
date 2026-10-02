import type { OrderByOption } from "../DefineOrderByOptions";
import { defineOrderByOptions } from "../DefineOrderByOptions";

export const remittancePaymentOrderByOptions = defineOrderByOptions([
  { key: "receiver", label: "Receiver" },
  { key: "sender", label: "Sender" },
  { key: "paymentAmount", label: "Payment Amount" },
  { key: "commission", label: "Commission" },
  { key: "date", label: "Date" },
  { key: "cashTeller", label: "Cash Teller" },
] as const);

export const remittanceReceivedOrderByOptions = defineOrderByOptions([
  { key: "receiver", label: "Receiver" },
  { key: "sender", label: "Sender" },
  { key: "receivedAmount", label: "Received Amount" },
  { key: "commission", label: "Commission" },
  { key: "balance", label: "Balance" },
  { key: "date", label: "Date" },
  { key: "cashTeller", label: "Cash Teller" },
] as const);

export const remittancePaymentDetailOrderByOptions = defineOrderByOptions([
  { key: "receiver", label: "Receiver" },
  { key: "paymentAmount", label: "Payment Amount" },
  { key: "paymentBy", label: "Payment By" },
  { key: "date", label: "Date" },
  { key: "cashTeller", label: "Cash Teller" },
] as const);

export type RemittancePaymentOrderByReportKey =
  | "remittance-payment-report"
  | "remittance-received-report"
  | "remittance-payment-detail-report";

export const remittancePaymentOrderByOptionsMap: Record<
  RemittancePaymentOrderByReportKey,
  readonly OrderByOption[]
> = {
  "remittance-payment-report": remittancePaymentOrderByOptions,
  "remittance-received-report": remittanceReceivedOrderByOptions,
  "remittance-payment-detail-report": remittancePaymentDetailOrderByOptions,
};
