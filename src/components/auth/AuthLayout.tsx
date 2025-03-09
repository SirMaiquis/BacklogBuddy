import { ReactNode } from "react";
import { Gamepad2 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Gamepad2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Backlog Buddy</h1>
          <p className="text-muted-foreground mt-2">
            Your personal gaming journey tracker
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
