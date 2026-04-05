import Button, { type ButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import type { PropsWithChildren } from "react";

interface SubmitButtonProps extends ButtonProps {
  loading: boolean;
}

function SubmitButton({
  children,
  loading,
  disabled,
  type,
  ...props
}: PropsWithChildren<SubmitButtonProps>) {
  return (
    <Button
      type={type ?? "submit"}
      disabled={disabled || loading}
      startIcon={
        loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : <></>
      }
      {...props}
    >
      {children}
    </Button>
  );
}

export default SubmitButton;
