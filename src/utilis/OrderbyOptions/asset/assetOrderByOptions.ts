import type { OrderByOption } from "../DefineOrderByOptions";
import { defineOrderByOptions } from "../DefineOrderByOptions";

export const puchaseDetailByOptions = defineOrderByOptions([
  { key: "code", label: "Code" },
  { key: "assetName", label: "Asset Name" },
  { key: "serialNo", label: "Serial Number" },
  { key: "modelNo", label: "Model Number" },
  { key: "amount", label: "Amount" },
  { key: "purchaseType", label: "Purchase Type" },
  { key: "purchaseDate", label: "Purchase Date" },
  { key: "transactionDate", label: "Transaction Date" },
  { key: "lastDeprectedValue", label: "Last Deprecated Value" },
  { key: "lastDeprectedDate", label: "Last Deprecated Date" },
] as const);

export const depreciationByOptions = defineOrderByOptions([
  { key: "code", label: "Code" },
  { key: "assetName", label: "Asset Name" },
  { key: "purchaseOn", label: "Purchase On" },
  { key: "purchaseAmount", label: "Purchase Amount" },
  { key: "depreciationMethod", label: "Depreciation Method" },
  { key: "percentage", label: "Percentage" },
  { key: "previousAssetValue", label: "Previous Asset Value" },
  { key: "depreciationAmount", label: "Depreciation Amount" },
  { key: "newAssetValue", label: "New Asset Value" },
  { key: "depreciationBranch", label: "Depreciation Branch" },
] as const);

//========================================================
export type AssetOrderByReportKey =
  | "fam-purchase-report"
  | "fam-depreciation-report";

//=========================================================
export const assetOrderByOptionsMap: Record<
  AssetOrderByReportKey,
  readonly OrderByOption[]
> = {
  "fam-purchase-report": puchaseDetailByOptions,
  "fam-depreciation-report": depreciationByOptions,
};
