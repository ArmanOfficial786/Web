import React from "react";
import * as yup from "yup";

export interface FormInputs {
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

const schema: yup.ObjectSchema<FormInputs> = yup.object({
  fromDate: yup.string().nullable().optional(),
  toDate: yup
    .string()
    .nullable()
    .optional()
    .test("date-order", "Till Date cannot be before From Date", function (val) {
      const { fromDate } = this.parent as { fromDate: string | null };
      if (!fromDate || !val) return true;
      return String(val) >= String(fromDate);
    }),
  branchSelected: yup.string().nullable().optional(),
  branchId: yup.number().optional().min(1, "At least one branch is required"),
  branchName: yup.string().nullable().optional(),
  reportType: yup.string().nullable().optional().default("Summary"),
  transactionType: yup.string().nullable().optional().default("All"),
  orderBy: yup.string().nullable().optional(),
});

function page() {
  return (
    <div>
      <h1>SavingAcWiseBalanceReport</h1>
    </div>
  );
}

export default page;
