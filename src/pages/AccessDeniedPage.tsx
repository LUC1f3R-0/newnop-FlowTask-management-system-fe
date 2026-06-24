import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export function AccessDeniedPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-muted/30 p-4">
      <div className="text-center max-w-md">
        <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 text-destructive grid place-items-center">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">
          You do not have permission to access this page.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
