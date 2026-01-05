import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, LayoutDashboard, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="gradient-accent p-2 rounded-xl">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">MindfulAI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link to="/">
            <Button
              variant="ghost"
              className={cn(isActive("/") && "bg-muted")}
            >
              Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button
              variant="ghost"
              className={cn("gap-2", isActive("/dashboard") && "bg-muted")}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link to="/journal">
            <Button
              variant="ghost"
              className={cn("gap-2", isActive("/journal") && "bg-muted")}
            >
              <BookOpen className="h-4 w-4" />
              Journal
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
            <User className="h-4 w-4" />
            Sign In
          </Button>
          <Button size="sm" className="gap-2">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
