"use client";

import React, { useMemo } from "react";
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
  Path,
} from "react-hook-form";
import { Grid, Box, Paper, Typography, Divider, Button } from "@mui/material";
import FieldRow from "@/utilis/FieldRow";
import DateInput from "@/components/form/DateInput";
import CheckboxInput from "@/components/form/CheckboxInput";
import EntityLookupField from "@/components/reportForm/Common/EntityLookUpField";
import { createAccountLookupConfig } from "@/config/AccountLookupConfig";

export interface DepositStatementFormValues {
  accountNo?: string;
  memberId?: string;
  memberName?: string;
  fromDate?: string;
  toDate?: string;
  fromDateAd?: string;
  toDateAd?: string;
  sameCompanyName?: boolean;
  valueDate?: boolean;
  nepaliDate?: boolean;
  generateInterest?: boolean;
  billNumber?: boolean;
  language?: "English" | "Nepali";
  statementVerifiedTill?: string;
  passbookVerifiedTill?: string;
}

interface DepositStatementFormProps {
  control: Control<DepositStatementFormValues>;
  handleSubmit: UseFormHandleSubmit<DepositStatementFormValues>;
  onSubmit: SubmitHandler<DepositStatementFormValues>;
  setValue: UseFormSetValue<DepositStatementFormValues>;
}

export default function DepositStatementForm({
  control,
  handleSubmit,
  onSubmit,
  setValue,
}: DepositStatementFormProps) {
  const accountConfig = useMemo(
    () => createAccountLookupConfig<DepositStatementFormValues>(),
    [],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Paper variant="outlined" sx={{ px: 2, py: 1 }}>
        <Typography
          variant="h6"
          sx={{ color: "primary.main", fontWeight: 600, fontSize: 16 }}
        >
          Deposit Statement Report
        </Typography>
        <Divider sx={{ mb: 1 }} />

        <Box sx={{ mb: 1 }}>
          <EntityLookupField
            control={control}
            setValue={setValue}
            config={accountConfig}
          />
        </Box>

        <Divider sx={{ mb: 1 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            mb: 1,
          }}
        >
          <Box>
            <FieldRow label="From Date">
              <DateInput
                name={"fromDate" as Path<DepositStatementFormValues>}
                control={control}
                dateType="BS"
              />
            </FieldRow>
          </Box>
          <Box>
            <FieldRow label="To Date">
              <DateInput
                name={"toDate" as Path<DepositStatementFormValues>}
                control={control}
                dateType="BS"
              />
            </FieldRow>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            mb: 1,
          }}
        >
          <Box>
            <FieldRow label="From Date (AD)">
              <DateInput
                name={"fromDateAd" as Path<DepositStatementFormValues>}
                control={control}
                dateType="AD"
              />
            </FieldRow>
          </Box>
          <Box>
            <FieldRow label="To Date (AD)">
              <DateInput
                name={"toDateAd" as Path<DepositStatementFormValues>}
                control={control}
                dateType="AD"
              />
            </FieldRow>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr 1fr 1fr 1fr" },
            gap: 1,
            mb: 1,
          }}
        >
          <Box>
            <CheckboxInput
              name="sameCompanyName"
              control={control}
              label="Same Company Name"
              size="small"
            />
          </Box>
          <Box>
            <CheckboxInput
              name="valueDate"
              control={control}
              label="Value Date"
              size="small"
            />
          </Box>
          <Box>
            <CheckboxInput
              name="nepaliDate"
              control={control}
              label="Nepali Date"
              size="small"
            />
          </Box>
          <Box>
            <CheckboxInput
              name="generateInterest"
              control={control}
              label="Generate Interest"
              size="small"
            />
          </Box>
          <Box>
            <CheckboxInput
              name="billNumber"
              control={control}
              label="Bill Number"
              size="small"
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 1,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Language:
            </Typography>
            <Button
              type="button"
              variant={
                control._formValues.language === "English"
                  ? "contained"
                  : "outlined"
              }
              size="small"
              onClick={() => setValue("language", "English")}
            >
              English
            </Button>
            <Button
              type="button"
              variant={
                control._formValues.language === "Nepali"
                  ? "contained"
                  : "outlined"
              }
              size="small"
              onClick={() => setValue("language", "Nepali")}
            >
              Nepali
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 1 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <FieldRow label="Statement Verified Till">
              <DateInput
                name={
                  "statementVerifiedTill" as Path<DepositStatementFormValues>
                }
                control={control}
                dateType="AD"
              />
            </FieldRow>
          </Box>
          <Box>
            <FieldRow label="Passbook Verified Till">
              <DateInput
                name={
                  "passbookVerifiedTill" as Path<DepositStatementFormValues>
                }
                control={control}
                dateType="AD"
              />
            </FieldRow>
          </Box>
        </Box>

        <Grid container spacing={1} justifyContent="center">
          <Grid size={{ xs: 12 }}>
            <Box display="flex" justifyContent="center">
              <Button
                type="button"
                variant="contained"
                size="small"
                onClick={handleSubmit(onSubmit)}
              >
                View Report
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
