import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { isAdmin } from "@/lib/auth";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      try {
        // 1. Get logged in user from Supabase Auth
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user || !session.user.email) {
          if (active) {
            setIsAuthorized(false);
            setLoading(false);
            toast.error("Unauthorized access. Please login first.");
            navigate({ to: "/" });
          }
          return;
        }

        // 2. Fetch admin access permission using the new email-based list check
        const adminStatus = await isAdmin(session.user.email);

        // 3. Allow access only if email exists in the 'admin access' table
        if (active) {
          if (adminStatus) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
            toast.error("Unauthorized access. Admin privileges required.");
            navigate({ to: "/" });
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Exception during admin auth check:", err);
        if (active) {
          setIsAuthorized(false);
          setLoading(false);
          toast.error("An error occurred during verification.");
          navigate({ to: "/" });
        }
      }
    }

    checkAuth();

    // Listen to changes in auth state to auto-resolve dynamically
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        if (active) {
          setIsAuthorized(false);
          setLoading(false);
          toast.error("Session expired. Please login again.");
          navigate({ to: "/" });
        }
      } else {
        checkAuth();
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-ivory)] px-6">
        <Loader2 className="animate-spin text-[var(--color-gold-deep)] mb-4" size={32} strokeWidth={1.5} />
        <p className="font-serif italic text-muted-foreground text-lg animate-pulse tracking-wide">
          Verifying olfactory credentials...
        </p>
      </div>
    );
  }

  // Only render children if authorized, otherwise render nothing as we are redirecting
  return isAuthorized ? <>{children}</> : null;
}
