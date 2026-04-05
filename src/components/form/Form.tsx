import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { type PropsWithChildren, useState } from "react";
import type {
  FieldValues,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormReset,
} from "react-hook-form";
import SubmitButton from "./SubmitButton";

export interface FormPropType<T extends FieldValues> {
  title: string;
  submitText: string;
  handleSubmit: UseFormHandleSubmit<T>;
  onSubmit: SubmitHandler<T>;
  reset: UseFormReset<T>;
}

export default function Form<T extends FieldValues>({
  title,
  submitText,
  handleSubmit,
  onSubmit,
  reset,
  children,
}: PropsWithChildren<FormPropType<T>>) {
  const [loading, setLoading] = useState<boolean>(false);

  const submitter: SubmitHandler<T> = async (data: T) => {
    setLoading(true);
    await onSubmit(data);
    setLoading(false);
  };

  return (
    <>
      <Typography
        variant="h1"
        align="center"
        sx={{ fontSize: "34px", mb: "30px" }}
      >
        {title}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(submitter)}
        className="space-y-4 font-sans text-md"
      >
        {children}
        <div className="flex gap-2">
          <SubmitButton variant="contained" color="primary" loading={loading}>
            {submitText}
          </SubmitButton>
          <Button type="reset" color="error" onClick={() => reset()}>
            Reset
          </Button>
        </div>
      </Box>
    </>
  );
}
