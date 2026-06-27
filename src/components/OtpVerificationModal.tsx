import type { FocusEventHandler, FormEventHandler } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type OtpVerificationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  otp: string;
  touched?: boolean;
  error?: string;
  isSubmitting?: boolean;
  onOtpChange: (otp: string) => void;
  onOtpBlur: FocusEventHandler<HTMLInputElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onResendOtp: () => void | Promise<void>;
};

type FormFieldErrorProps = {
  error?: string;
  touched?: boolean;
};

function FormFieldError({ error, touched }: FormFieldErrorProps) {
  if (!touched || !error) return null;

  return <p className="text-xs text-destructive">{error}</p>;
}

export function OtpVerificationModal({
  open,
  onOpenChange,
  email,
  otp,
  touched,
  error,
  isSubmitting = false,
  onOtpChange,
  onOtpBlur,
  onSubmit,
  onResendOtp,
}: OtpVerificationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="text-center">
          <DialogTitle>Verify your email</DialogTitle>
          <DialogDescription>
            Enter the OTP sent to{" "}
            <span className="font-medium">{email}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div className="flex flex-col items-center gap-2">
            <Label htmlFor="otp">Verification OTP</Label>

            <Input
              id="otp"
              name="otp"
              value={otp}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "").slice(0, 5);
                onOtpChange(value);
              }}
              onBlur={onOtpBlur}
              placeholder="00000"
              inputMode="numeric"
              disabled={isSubmitting}
              className="w-36 text-center text-lg tracking-[0.35em] font-mono"
            />

            <FormFieldError touched={touched} error={error} />
          </div>

          <div className="space-y-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={onResendOtp}
              disabled={isSubmitting}
            >
              Resend OTP
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
