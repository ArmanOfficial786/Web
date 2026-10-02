"use client";

import Button from "@mui/material/Button";
import type {
  Control,
  FieldValues,
  Path,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";
import { useWatch } from "react-hook-form";

interface ViewReportButtonProps<T extends FieldValues> {
  control: Control<T>;
  handleSubmit: UseFormHandleSubmit<T>;
  onSubmit: SubmitHandler<T>;
  setValue: UseFormSetValue<T>;
  loading: boolean;
  onBeforeSubmit?: () => void;
  onInvalid?: () => void;

  watchField?: Path<T>;
  clearFields?: Path<T>[];

  label?: string;
  disabled?: boolean;
}

export default function ViewReportButton<T extends FieldValues>({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  loading,
  onBeforeSubmit,
  onInvalid,
  watchField,
  clearFields = [],
  label = "View Report",
  disabled,
}: ViewReportButtonProps<T>) {
  const watchedValue = useWatch({
    control,
    name: watchField as Path<T>,
    disabled: !watchField,
  });

  const handleClick = () => {
    if (watchedValue) {
      clearFields.forEach((field) => setValue(field, "" as any));
    }

    handleSubmit((data) => {
      onBeforeSubmit?.();
      onSubmit(data);
    }, onInvalid)();
  };

  return (
    <Button
      variant="outlined"
      size="small"
      disabled={disabled ?? loading}
      onClick={handleClick}
      sx={{ whiteSpace: "nowrap", height: 30 }}
    >
      {loading ? "Loading..." : label}
    </Button>
  );
}
