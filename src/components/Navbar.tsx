import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Heart,
  LayoutDashboard,
  BookOpen,
  User,
  LogOut,
  Loader2,
  Sun,
  Moon,
  Home,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/journal", label: "Journal", icon: BookOpen },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const isActive = (path: string) => location.pathname === path;

  // Sliding indicator
  useEffect(() => {
    if (!navRef.current) return;
    const activeLink = navRef.current.querySelector(
      '[data-active="true"]'
    ) as HTMLElement | null;
    if (activeLink) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      setIndicatorStyle({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
      });
    }
  }, [location.pathname]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  const toggleTheme = () => {
    document.documentElement.classList.add("transitioning");
    setTheme(theme === "dark" ? "light" : "dark");
    setTimeout(() => {
      document.documentElement.classList.remove("transitioning");
    }, 300);
  };

  return (
    <>
      {/* Desktop Top Bar */}
      <header className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-border/30">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="gradient-accent p-2 rounded-xl shadow-glow transition-transform duration-300 group-hover:scale-110">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground hidden sm:block">
              MindfulMe
            </span>
          </Link>

          {/* Desktop Floating Pill Nav */}
          <nav
            ref={navRef}
            className="hidden md:flex items-center relative bg-muted/60 backdrop-blur-sm rounded-2xl p-1 border border-border/40"
          >
            {/* Animated Sliding Indicator */}
            <div
              className="absolute top-1 h-[calc(100%-8px)] rounded-xl bg-background shadow-soft transition-all duration-300 ease-out"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
              }}
            />

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                data-active={isActive(item.path)}
                className={cn(
                  "relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200",
                  isActive(item.path)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 transition-all duration-300",
                    isActive(item.path) && "text-primary scale-110"
                  )}
                />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="h-9 w-9 rounded-xl hover:bg-muted"
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </TooltipContent>
            </Tooltip>

            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : user ? (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/profile">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:bg-muted"
                      >
                        <User className="h-4 w-4" />
                        <span className="sr-only">Profile</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Profile</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSignOut}
                      className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="sr-only">Sign Out</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sign out</TooltipContent>
                </Tooltip>
              </>
            ) : (
              <>
                <Link to="/auth" className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="rounded-xl gap-2">
                    <User className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="rounded-xl gap-2">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
        <div className="mx-3 mb-3">
          <div className="flex items-center justify-around bg-card/80 backdrop-blur-xl border border-border/40 rounded-2xl shadow-elevated p-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative flex flex-col items-center gap-0.5 py-2 px-5 rounded-xl transition-all duration-300",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground active:scale-95"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-all duration-300",
                      active && "scale-110"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium transition-all duration-300",
                      active ? "opacity-100 translate-y-0" : "opacity-60"
                    )}
                  >
                    {item.label}
                  </span>
                  {active && (
                    <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-primary animate-scale-in" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
