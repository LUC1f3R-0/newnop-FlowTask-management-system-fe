import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckSquare, Eye, EyeOff } from "lucide-react";
import { axiosApiInstance } from "@/lib/apiInstance";

import { OtpVerificationModal } from "@/components/OtpVerificationModal";

type ApiErrorResponse = {
  message?: string | string[];
  errors?: unknown;
};

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirm: string;
};

type OtpFormValues = {
  otp: string;
};

const registerValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .required("Full name is required"),

  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  confirm: Yup.string()
    .oneOf([Yup.ref("password")], "Password and confirm password do not match")
    .required("Confirm password is required"),
});

const otpValidationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{5}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

type FormFieldErrorProps = {
  error?: string;
  touched?: boolean;
};

function FormFieldError({ error, touched }: FormFieldErrorProps) {
  if (!touched || !error) return null;

  return <p className="text-xs text-destructive">{error}</p>;
}

export function RegisterPage() {
  const navigate = useNavigate();

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const getErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const message = axiosError.response?.data?.message;

    if (Array.isArray(message)) {
      return message[0] ?? fallback;
    }

    return message ?? fallback;
  };

  const registerFormik = useFormik<RegisterFormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
    },
    validationSchema: registerValidationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        await axiosApiInstance.post("/auth/register", {
          fullName: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
          confirmPassword: values.confirm,
        });

        setRegisteredEmail(values.email.trim());
        otpFormik.resetForm();
        setIsOtpModalOpen(true);

        toast.success("Account created. Verification OTP sent to your email.");
      } catch (error) {
        toast.error(getErrorMessage(error, "Registration failed"));
      }
    },
  });

  const otpFormik = useFormik<OtpFormValues>({
    initialValues: {
      otp: "",
    },
    validationSchema: otpValidationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        await axiosApiInstance.post("/auth/verify-email", {
          email: registeredEmail,
          otp: values.otp.trim(),
        });

        toast.success("Email verified successfully. You can now login.");

        setIsOtpModalOpen(false);

        navigate({
          to: "/login",
        });
      } catch (error) {
        toast.error(getErrorMessage(error, "OTP verification failed"));
      }
    },
  });

  const handleResendOtp = async () => {
    if (!registeredEmail) {
      toast.error("Email is missing. Please register again.");
      return;
    }

    try {
      await axiosApiInstance.post("/auth/resend-verification-otp", {
        email: registeredEmail,
      });

      toast.success("Verification OTP sent again.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to resend OTP"));
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <Link
          to="/"
          className="flex items-center gap-2 justify-center font-semibold text-lg"
        >
          <span className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center">
            <CheckSquare className="h-4 w-4" />
          </span>
          FlowTask
        </Link>

        <Card className="p-6 sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Start managing your team's work
            </p>
          </div>

          <form onSubmit={registerFormik.handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                name="name"
                value={registerFormik.values.name}
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                placeholder="Jane Doe"
                disabled={registerFormik.isSubmitting}
              />
              <FormFieldError
                touched={registerFormik.touched.name}
                error={registerFormik.errors.name}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="text"
                value={registerFormik.values.email}
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                placeholder="you@example.com"
                disabled={registerFormik.isSubmitting}
              />
              <FormFieldError
                touched={registerFormik.touched.email}
                error={registerFormik.errors.email}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={registerFormik.values.password}
                  onChange={registerFormik.handleChange}
                  onBlur={registerFormik.handleBlur}
                  placeholder="* * * * * * * * * *"
                  disabled={registerFormik.isSubmitting}
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={registerFormik.isSubmitting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:cursor-not-allowed"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <FormFieldError
                touched={registerFormik.touched.password}
                error={registerFormik.errors.password}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                name="confirm"
                type="password"
                value={registerFormik.values.confirm}
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                placeholder="* * * * * * * * * *"
                disabled={registerFormik.isSubmitting}
              />
              <FormFieldError
                touched={registerFormik.touched.confirm}
                error={registerFormik.errors.confirm}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={registerFormik.isSubmitting}
            >
              {registerFormik.isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </Card>
      </div>

      <OtpVerificationModal
        open={isOtpModalOpen}
        onOpenChange={setIsOtpModalOpen}
        email={registeredEmail}
        otp={otpFormik.values.otp}
        touched={otpFormik.touched.otp}
        error={otpFormik.errors.otp}
        isSubmitting={otpFormik.isSubmitting}
        onOtpChange={(value) => otpFormik.setFieldValue("otp", value)}
        onOtpBlur={otpFormik.handleBlur}
        onSubmit={otpFormik.handleSubmit}
        onResendOtp={handleResendOtp}
      />
    </div>
  );
}