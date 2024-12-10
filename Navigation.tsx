import { NavLink } from "react-router-dom";
import { AuthButtons } from "./navigation/AuthButtons";
import { Logo } from "./navigation/Logo";
import { NavItems } from "./navigation/NavItems";

export function Navigation() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <NavItems />
        <div className="flex items-center gap-4">
          <AuthButtons />
          <div className="text-sm text-muted-foreground">
            <NavLink to="/contact" className="hover:text-foreground mr-4">Contact</NavLink>
            <NavLink to="/legal" className="hover:text-foreground">Legal</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}