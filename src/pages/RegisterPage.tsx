import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckSquare } from "lucide-react";
import { axiosApiInstance } from "@/lib/apiInstance";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ApiErrorResponse = {
  message?: string | string[];
  errors?: unknown;
};

export function RegisterPage() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");

  const [registeredEmail, setRegisteredEmail] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const getErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const message = axiosError.response?.data?.message;

    if (Array.isArray(message)) {
      return message[0] ?? fallback;
    }

    return message ?? fallback;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      toast.error("Password and confirm password do not match");
      return;
    }

    try {
      setIsSubmitting(true);

      await axiosApiInstance.post("/auth/register", {
        fullName: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirm,
      });

      setRegisteredEmail(form.email);
      setOtp("");
      setIsOtpModalOpen(true);

      toast.success("Account created. Verification OTP sent to your email.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Registration failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      setIsVerifying(true);

      await axiosApiInstance.post("/auth/verify-email", {
        email: registeredEmail,
        otp: otp.trim(),
      });

      toast.success("Email verified successfully. You can now login.");

      setIsOtpModalOpen(false);

      navigate({
        to: "/login",
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "OTP verification failed"));
    } finally {
      setIsVerifying(false);
    }
  };

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Jane Doe"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="••••••••"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                value={form.confirm}
                onChange={(e) => set("confirm", e.target.value)}
                placeholder="••••••••"
                required
                disabled={isSubmitting}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create Account"}
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

      <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className="text-center">
            <DialogTitle>Verify your email</DialogTitle>
            <DialogDescription>
              Enter the OTP sent to <span className="font-medium">{registeredEmail}</span>
            </DialogDescription>
          </DialogHeader>
      
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="otp">Verification OTP</Label>
      
              <Input
                id="otp"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(value);
                }}
                placeholder="000000"
                inputMode="numeric"
                maxLength={6}
                required
                disabled={isVerifying}
                className="w-36 text-center text-lg tracking-[0.35em] font-mono"
              />
            </div>
      
            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={isVerifying}>
                {isVerifying ? "Verifying..." : "Verify Email"}
              </Button>
      
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleResendOtp}
                disabled={isVerifying}
              >
                Resend OTP
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}