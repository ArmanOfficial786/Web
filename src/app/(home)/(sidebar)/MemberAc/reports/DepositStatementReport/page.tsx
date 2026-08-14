"use client";

import React, { useCallback } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DepositStatementForm, {
  type DepositStatementFormValues,
} from "@/components/reports/memberAccount/DepositStatementForm";

const schema: yup.ObjectSchema<DepositStatementFormValues> = yup
  .object({
    accountNo: yup.string().optional().default(""),
    memberId: yup.string().optional().default(""),
    memberName: yup.string().optional().default(""),
    fromDate: yup.string().optional().default(""),
    toDate: yup.string().optional().default(""),
    fromDateAd: yup.string().optional().default(""),
    toDateAd: yup.string().optional().default(""),
    sameCompanyName: yup.boolean().optional().default(false),
    valueDate: yup.boolean().optional().default(false),
    nepaliDate: yup.boolean().optional().default(false),
    generateInterest: yup.boolean().optional().default(false),
    billNumber: yup.boolean().optional().default(false),
    language: yup.mixed<"English" | "Nepali">().optional().default("English"),
    statementVerifiedTill: yup.string().optional().default(""),
    passbookVerifiedTill: yup.string().optional().default(""),
  })
  .required();

function DepositStatementPage() {
  const { control, handleSubmit, setValue } =
    useForm<DepositStatementFormValues>({
      resolver: yupResolver(schema),
      defaultValues: schema.getDefault(),
    });

  const onSubmit: SubmitHandler<DepositStatementFormValues> = useCallback(
    (data) => {
      console.log("Deposit Statement request", data);
    },
    [],
  );

  return (
    <DepositStatementForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
    />
  );
}

export default DepositStatementPage;
