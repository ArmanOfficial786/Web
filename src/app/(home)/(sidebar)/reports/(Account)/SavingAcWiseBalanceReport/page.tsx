import React from "react";
import { SavingAcWiseBalanceRequest } from "types/api/api";
import * as yup from "yup";

const schema: yup.ObjectSchema<SavingAcWiseBalanceRequest> = yup.object({
  fromDate: yup.string().nullable().optional(),
  toDate: yup.string().nullable().optional(),
  depositId: yup.number().required("Deposit Type  is required"),
  branchSelected: yup.string().nullable().optional(),
  branchId: yup.number().optional().min(1, "At least one branch is required"),
  branchName: yup.string().nullable().optional(),
  status: yup.string().nullable().optional().default("Summary"),
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
