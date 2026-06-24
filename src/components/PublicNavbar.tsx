import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CheckSquare } from "lucide-react";

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center">
            <CheckSquare className="h-4 w-4" />
          </span>
          FlowTask
        </Link>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Register</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
