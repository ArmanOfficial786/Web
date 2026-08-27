"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DropDown from "@/components/form/DropDown";
import IconTextInput from "@/components/form/IconTextInput";
import TextInput from "@/components/form/TextInput";
import branchService from "@/services/Common/BranchService";

interface Branch {
  id: number;
  name: string;
}

interface LoginFormInputs {
  email: string;
  password: string;
  companyId: string;
}

const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters"),
  companyId: yup
    .string()
    .required("Company is required")
    .test("not-empty", "Please select a branch", (value) => {
      return value !== "" && value !== "0";
    }),
});

const defaultBranchOption: Branch = { id: 0, name: "-- Select --" };

const LoginForm: React.FC = () => {
  const router = useRouter();
  const loginInFlight = useRef(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([defaultBranchOption]);
  const [branchesLoading, setBranchesLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadBranches = async () => {
      setBranchesLoading(true);
      try {
        const response = await branchService.getAll({ skipAuth: true });
        if (!isMounted) return;

        const branchOptions = response
          .filter((branch) => branch.branchId)
          .map((branch) => ({
            id: branch.branchId as number,
            name: branch.branchName ?? "",
          }));

        setBranches([defaultBranchOption, ...branchOptions]);
      } catch (error) {
        console.error("Failed to load branches:", error);
        if (isMounted) setBranches([defaultBranchOption]);
      } finally {
        if (isMounted) setBranchesLoading(false);
      }
    };

    loadBranches();
    return () => {
      isMounted = false;
    };
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      companyId: "",
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    if (loginInFlight.current) return;

    loginInFlight.current = true;
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: data.email.trim(),
        password: data.password,
        companyId: Number(data.companyId),
        redirect: false,
      });

      if (result?.error) {
        console.error("Login error:", result.error);
        toast.error(
          result.error === "CredentialsSignin"
            ? "Login was rejected. Check your credentials or active session."
            : result.error,
        );
      } else if (result?.ok) {
        toast.success("Login successful!");
        // Redirect to dashboard or home page
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      loginInFlight.current = false;
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Paper
      elevation={12}
      sx={{
        width: "min(100%, 500px)",
        p: { xs: 3, sm: 5 },
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={3}>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700 }}
              color="text.primary"
            >
              Please login to your account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Enter your credentials to continue
            </Typography>
          </Box>

          {errors.root && <Alert severity="error">{errors.root.message}</Alert>}

          <TextInput
            name="email"
            control={control}
            type="email"
            label="Email"
            placeholder="Enter your email"
            fullWidth
            autoComplete="email"
          />

          <IconTextInput
            name="password"
            control={control}
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="Enter your password"
            fullWidth
            autoComplete="current-password"
            icon={showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            onIconClick={togglePasswordVisibility}
          />

          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <BusinessIcon color="action" fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Branch
              </Typography>
            </Box>
            <DropDown
              name="companyId"
              control={control}
              label="Branch"
              fullWidth
              disabled={branchesLoading}
              options={branches}
            />
          </Box>

          <Box sx={{ textAlign: "right", mt: -1 }}>
            <Link
              component="button"
              type="button"
              underline="hover"
              color="primary"
              onClick={() => console.log("Forgot password clicked")}
            >
              Forgot Password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            fullWidth
            sx={{ py: 1.5, fontWeight: 700, borderRadius: 2 }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CircularProgress size={20} color="inherit" />
                <span>Logging in...</span>
              </Box>
            ) : (
              "Login"
            )}
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            Don&apos;t have an account?{" "}
            <Link
              component="button"
              type="button"
              underline="hover"
              sx={{ fontWeight: 700 }}
              onClick={() => router.push("/register")}
            >
              Register here
            </Link>
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );
};

export default LoginForm;
