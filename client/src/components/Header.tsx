import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe, Truck, Building, Scale, Menu, User, LogOut, Settings } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const navigation = [
    { name: "Logistics", href: "/logistics", icon: Truck },
    { name: "Real Estate", href: "/real-estate", icon: Building },
    { name: "Legal Services", href: "/legal-services", icon: Scale },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Payments", href: "/payments" }, // Added Payments link
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Globe className="text-primary-foreground h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground">Global Business Gateway</span>
              <span className="text-xs text-muted-foreground">Logistics • Real Estate • Legal</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 text-foreground hover:text-primary transition-colors font-medium ${
                    isActive(item.href) ? "text-primary" : ""
                  }`}
                  data-testid={`link-${item.name.toLowerCase().replace(" ", "-")}`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Authentication */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="button-user-menu">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImageUrl || ""} alt={user.firstName || "User"} />
                      <AvatarFallback>
                        {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/auth/account-dashboard" data-testid="link-dashboard">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" data-testid="link-admin">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <a href="/api/logout" data-testid="link-logout">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <a
                  href="/api/login"
                  className="text-foreground hover:text-primary transition-colors font-medium"
                  data-testid="link-login"
                >
                  Login
                </a>
                <a
                  href="/api/login"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors font-medium"
                  data-testid="button-get-started"
                >
                  Get Started
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" data-testid="button-mobile-menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-2 text-foreground hover:text-primary transition-colors font-medium ${
                        isActive(item.href) ? "text-primary" : ""
                      }`}
                      data-testid={`mobile-link-${item.name.toLowerCase().replace(" ", "-")}`}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                {isAuthenticated && user ? (
                  <>
                    <Link
                      href="/auth/account-dashboard"
                      className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors font-medium"
                      data-testid="mobile-link-dashboard"
                    >
                      <User className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    <a
                      href="/api/logout"
                      className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors font-medium"
                      data-testid="mobile-link-logout"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href="/api/login"
                      className="text-foreground hover:text-primary transition-colors font-medium"
                      data-testid="mobile-link-login"
                    >
                      Login
                    </a>
                    <a
                      href="/api/login"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors font-medium text-center"
                      data-testid="mobile-button-get-started"
                    >
                      Get Started
                    </a>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}