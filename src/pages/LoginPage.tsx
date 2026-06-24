import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckSquare, Shield, User } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen grid place-items-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <Link to="/" className="flex items-center gap-2 justify-center font-semibold text-lg">
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
            onSubmit={(e) => {
              e.preventDefault();
              toast.info(
                "Demo only. Please use Continue as Admin or Continue as User.",
              );
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" />
            OR DEMO ACCESS
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid sm:grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/admin/dashboard" })}
            >
              <Shield className="h-4 w-4 mr-2" /> Continue as Admin
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/user/dashboard" })}
            >
              <User className="h-4 w-4 mr-2" /> Continue as User
            </Button>
          </div>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Register
            </Link>
          </p>
        </Card>

        <Card className="p-5 bg-muted/40">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Demo Credentials
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <div className="font-medium flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" /> Admin
              </div>
              <div className="text-muted-foreground mt-1 font-mono text-xs leading-5">
                admin@gmail.com
                <br />
                admin@password123
              </div>
            </div>
            <div>
              <div className="font-medium flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> User
              </div>
              <div className="text-muted-foreground mt-1 font-mono text-xs leading-5">
                user@gmail.com
                <br />
                user@password123
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
