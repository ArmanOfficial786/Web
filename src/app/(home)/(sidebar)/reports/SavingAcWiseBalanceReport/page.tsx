import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
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

const schema : yup.ObjectSchema<FormInputs> = yup.object({
     fromDate: yup.string().default(""),
      toDate: yup
        .string()
        .default("")
        .test("date-order", "Till Date cannot be before From Date", function (val) {
          const { fromDate } = this.parent;
          return !fromDate || !val || val >= fromDate;
        }),
      branchId: yup.mixed<number | string>().default(0),
      orderBy: yup.mixed<number | string>().default(0),
      reportType: yup.string().default("Summary"),
      transactionType: yup.string().default("All"),
});

function page() {
  return (
    <div>
      <h1>SavingAcWiseBalanceReport</h1>
    </div>
  );
}

export default page;
