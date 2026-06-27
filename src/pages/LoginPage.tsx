import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AxiosError } from "axios";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckSquare, Eye, EyeOff } from "lucide-react";
import { axiosApiInstance } from "@/lib/apiInstance";
import { getAuthUser } from "@/lib/auth-route";
import { OtpVerificationModal } from "@/components/OtpVerificationModal";
import { toast } from "sonner";

type LoginFormValues = {
  email: string;
  password: string;
};

type OtpFormValues = {
  otp: string;
};

type AuthUser = {
  uuid: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  isEmailVerified: boolean;
};

type LoginResponse = {
  success?: boolean;
  message?: string;
  data?: {
    user?: AuthUser;
  };
  user?: AuthUser;
};

type ApiErrorResponse = {
  code?: string;
  email?: string;
  message?: string | string[];
  errors?: {
    code?: string;
    email?: string;
    message?: string;
  };
};

const loginValidationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const otpValidationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
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

function getErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  const message = axiosError.response?.data?.message;

  if (Array.isArray(message)) {
    return message[0] ?? fallback;
  }

  return message ?? axiosError.response?.data?.errors?.message ?? fallback;
}

function getEmailNotVerifiedPayload(error: unknown) {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  const status = axiosError.response?.status;
  const data = axiosError.response?.data;
  const message = getErrorMessage(error, "");

  const code = data?.code ?? data?.errors?.code;

  const isEmailNotVerified =
    status === 403 &&
    (code === "EMAIL_NOT_VERIFIED" ||
      message.toLowerCase().includes("verify your email"));

  return {
    isEmailNotVerified,
    email: data?.email ?? data?.errors?.email,
  };
}

function getDashboardRoute(user?: AuthUser) {
  if (user?.role === "ADMIN") {
    return "/admin/dashboard";
  }

  return "/dashboard";
}

export function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);

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
          email: verificationEmail,
          otp: values.otp,
        });

        toast.success("Email verified successfully. Please log in again.");

        setIsOtpModalOpen(false);
        otpFormik.resetForm();
      } catch (error) {
        toast.error(getErrorMessage(error, "Email verification failed"));
      }
    },
  });

  const handleResendOtp = async () => {
    if (!verificationEmail) {
      toast.error("Email is missing. Please try logging in again.");
      return;
    }

    try {
      await axiosApiInstance.post("/auth/resend-verification-otp", {
        email: verificationEmail,
      });

      otpFormik.resetForm();
      toast.success("A new verification OTP was sent to your email.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to resend OTP"));
    }
  };

  const handleForm = async (values: LoginFormValues) => {
    const email = values.email.trim().toLowerCase();

    try {
      const response = await axiosApiInstance.post<LoginResponse>("/auth/login", {
        email,
        password: values.password,
      });

      const user = response.data.data?.user ?? response.data.user;

      toast.success(response.data.message ?? "Login successful");

      navigate({ to: getDashboardRoute(user) });
    } catch (error) {
      const { isEmailNotVerified, email: responseEmail } =
        getEmailNotVerifiedPayload(error);

      if (isEmailNotVerified) {
        const targetEmail = (responseEmail ?? email).trim().toLowerCase();

        setVerificationEmail(targetEmail);
        otpFormik.resetForm();
        setIsOtpModalOpen(true);

        toast.info("A new verification OTP was sent to your email.");
        return;
      }

      toast.error(getErrorMessage(error, "Login failed"));
    }
  };

  const loginFormik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: handleForm,
  });
  useEffect(() => {
    let isMounted = true;

    async function redirectIfAuthenticated() {
      const user = await getAuthUser();

      if (!isMounted) {
        return;
      }

      if (user) {
        navigate({ to: getDashboardRoute(user) });
        return;
      }

      setIsCheckingSession(false);
    }

    void redirectIfAuthenticated();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (isCheckingSession) {
    return (
      <div className="min-h-screen grid place-items-center bg-muted/30 p-4">
        <div className="text-sm text-muted-foreground">
          Checking session...
        </div>
      </div>
    );
  }


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
            <h1 className="text-2xl font-semibold">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to continue
            </p>
          </div>

          <form
            onSubmit={loginFormik.handleSubmit}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={loginFormik.values.email}
                onChange={loginFormik.handleChange}
                onBlur={loginFormik.handleBlur}
              />

              <FormFieldError
                touched={loginFormik.touched.email}
                error={loginFormik.errors.email}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="• • • • • • • •"
                  value={loginFormik.values.password}
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                touched={loginFormik.touched.password}
                error={loginFormik.errors.password}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loginFormik.isSubmitting}
            >
              {loginFormik.isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </Card>
      </div>

      <OtpVerificationModal
        open={isOtpModalOpen}
        onOpenChange={setIsOtpModalOpen}
        email={verificationEmail}
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
