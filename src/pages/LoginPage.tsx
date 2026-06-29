import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AxiosError } from "axios";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  CheckSquare,
  Eye,
  EyeOff,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { axiosApiInstance } from "@/lib/apiInstance";
import { getAuthUser } from "@/lib/auth-route";
import { OtpVerificationModal } from "@/components/OtpVerificationModal";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type LoginFormValues = {
  email: string;
  password: string;
};

type OtpFormValues = {
  otp: string;
};

type ForgotPasswordFormValues = {
  email: string;
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

const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
});

const otpValidationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{5}$/, "OTP must be exactly 5 digits")
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
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

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

  const forgotPasswordFormik = useFormik<ForgotPasswordFormValues>({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordValidationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        await axiosApiInstance.post("/auth/forgot-password", {
          email: values.email.trim().toLowerCase(),
        });

        toast.success("Password reset instructions sent", {
          description: "Please check your email to continue.",
        });

        setIsForgotPasswordOpen(false);
        forgotPasswordFormik.resetForm();
      } catch (error) {
        toast.error(
          getErrorMessage(
            error,
            "Password reset is not available yet. Backend endpoint is required.",
          ),
        );
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

      navigate({
        to: getDashboardRoute(user),
      });
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
        navigate({
          to: getDashboardRoute(user),
        });
        return;
      }

      setIsCheckingSession(false);
    }

    void redirectIfAuthenticated();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const openForgotPassword = () => {
    const loginEmail = loginFormik.values.email.trim();

    forgotPasswordFormik.setFieldValue("email", loginEmail);
    forgotPasswordFormik.setTouched({});
    setIsForgotPasswordOpen(true);
  };

  if (isCheckingSession) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/30 p-4">
        <div className="text-sm text-muted-foreground">Checking session...</div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-lg font-semibold"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <CheckSquare className="h-4 w-4" />
          </span>
          FlowTask
        </Link>

        <Card className="p-6 sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Login to continue managing your tasks
            </p>
          </div>

          <form onSubmit={loginFormik.handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                name="email"
                type="email"
                value={loginFormik.values.email}
                onChange={loginFormik.handleChange}
                onBlur={loginFormik.handleBlur}
                placeholder="you@example.com"
                disabled={loginFormik.isSubmitting}
              />

              <FormFieldError
                touched={loginFormik.touched.email}
                error={loginFormik.errors.email}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="password">Password</Label>

                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                  onClick={openForgotPassword}
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={loginFormik.values.password}
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                  placeholder="Enter your password"
                  disabled={loginFormik.isSubmitting}
                  className="pr-10"
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={loginFormik.isSubmitting}
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

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
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
        onOtpChange={(otp) => {
          void otpFormik.setFieldValue("otp", otp);
        }}
        onOtpBlur={otpFormik.handleBlur}
        onSubmit={otpFormik.handleSubmit}
        onResendOtp={handleResendOtp}
      />

      <Dialog
        open={isForgotPasswordOpen}
        onOpenChange={(open) => {
          setIsForgotPasswordOpen(open);

          if (!open) {
            forgotPasswordFormik.resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mb-2 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
              <Mail className="h-6 w-6" />
            </div>

            <DialogTitle>Forgot password?</DialogTitle>

            <DialogDescription>
              Enter your email address and we will send password reset
              instructions if your account exists.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={forgotPasswordFormik.handleSubmit}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email address</Label>

              <Input
                id="forgot-email"
                name="email"
                type="email"
                value={forgotPasswordFormik.values.email}
                onChange={forgotPasswordFormik.handleChange}
                onBlur={forgotPasswordFormik.handleBlur}
                placeholder="you@example.com"
                disabled={forgotPasswordFormik.isSubmitting}
              />

              <FormFieldError
                touched={forgotPasswordFormik.touched.email}
                error={forgotPasswordFormik.errors.email}
              />
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={forgotPasswordFormik.isSubmitting}
                onClick={() => setIsForgotPasswordOpen(false)}
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back to login
              </Button>

              <Button
                type="submit"
                disabled={forgotPasswordFormik.isSubmitting}
              >
                {forgotPasswordFormik.isSubmitting
                  ? "Sending..."
                  : "Send reset link"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
