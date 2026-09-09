import Link from "next/link";
import { ArrowLeft, Home, MessageSquare } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-2">
          <MessageSquare className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tight text-foreground">404</h1>
          <h2 className="text-xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-sm text-muted-foreground">
            The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto gap-2")}
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants(),
              "w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
