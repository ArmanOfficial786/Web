"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import BusinessIcon from "@mui/icons-material/Business";

interface Branch {
  id: number;
  name: string;
}

interface LoginFormInputs {
  username: string;
  password: string;
  branchId: string;
}

const loginSchema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must not exceed 50 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters"),
  branchId: yup
    .string()
    .required("Branch is required")
    .test("not-empty", "Please select a branch", (value) => {
      return value !== "" && value !== "0";
    }),
});

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const branches: Branch[] = [
    { id: 1, name: "Main Branch" },
    { id: 2, name: "Kathmandu Branch" },
    { id: 3, name: "Pokhara Branch" },
    { id: 4, name: "Biratnagar Branch" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      branchId: "",
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    console.log("Login Form Data:", data);

    try {
      // Use NextAuth signIn
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        branchId: data.branchId,
        redirect: false,
      });

      console.log("SignIn Result:", result);

      if (result?.error) {
        toast.error("Invalid credentials. Please try again.");
        console.error("Login error:", result.error);
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
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center w-[500px] rounded-lg shadow-xl bg-white p-6 mt-[3rem]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-gray-900 font-semibold text-2xl ">
            Please login to your account
          </h2>
        </div>

        {/* Username Field */}
        <div className="flex flex-col mb-6">
          <label className="block text-sm text-black font-semibold mb-2">
            Username <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center relative">
            <div className="absolute left-0 pl-3 flex items-center pointer-events-none">
              <PersonIcon sx={{ fontSize: 20 }} className="text-gray-400" />
            </div>
            <input
              type="text"
              {...register("username")}
              placeholder="Enter your username"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.username
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600"
              } bg-transparent`}
            />
          </div>
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col mb-6">
          <label className="block text-sm text-black font-semibold mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center relative">
            <div className="absolute left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon sx={{ fontSize: 20 }} className="text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Enter your password"
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600"
              } bg-transparent`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <VisibilityOffIcon
                  sx={{ fontSize: 20 }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                />
              ) : (
                <VisibilityIcon
                  sx={{ fontSize: 20 }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Branch Dropdown */}
        <div className="flex flex-col mb-4">
          <label className="block text-sm text-black font-semibold mb-2">
            Branch <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center relative">
            <div className="absolute  left-0 pl-3 flex items-center pointer-events-none">
              <BusinessIcon sx={{ fontSize: 20 }} style={{ color: "black" }} />
            </div>
            <select
              {...register("branchId")}
              className={`w-full pl-10 pr-4 py-3 text-black border rounded-lg focus:outline-none focus:ring-2 transition-colors appearance-none ${
                errors.branchId
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600"
              } bg-transparent cursor-pointer`}
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            <div className="absolute right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {errors.branchId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.branchId.message}
            </p>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end mb-6">
          <button
            type="button"
            className="text-sm text-black  hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            onClick={() => console.log("Forgot password clicked")}
          >
            <span className="text-blue-600"> Forgot Password?</span>
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white font-semibold rounded-lg shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mb-4"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>

        {/* Register Link */}
        <div className="flex justify-center">
          <p className="text-sm text-black">
            {"Don't have an account? "}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
              onClick={() => router.push("/register")}
            >
              <span className="text-blue-600">Register here</span>
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
