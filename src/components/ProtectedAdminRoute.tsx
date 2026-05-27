import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { ShieldAlert, Loader2 } from "lucide-react";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [redirectCount, setRedirectCount] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      try {
        // 1. Get logged in user from Supabase Auth
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          if (active) {
            setIsAuthorized(false);
            setLoading(false);
          }
          return;
        }

        // 2. Fetch role from profiles table
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching user profile role:", error);
          // If profiles check fails but they are signed in, we still restrict to be secure
          if (active) {
            setIsAuthorized(false);
            setLoading(false);
          }
          return;
        }

        // 3. Allow access only if role === "admin"
        if (active) {
          if (profile?.role === "admin") {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Exception during admin auth check:", err);
        if (active) {
          setIsAuthorized(false);
          setLoading(false);
        }
      }
    }

    checkAuth();

    // Listen to changes in auth state to auto-resolve dynamically
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        if (active) {
          setIsAuthorized(false);
          setLoading(false);
        }
      } else {
        checkAuth();
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // 4. Otherwise redirect to "/" after showing unauthorized page
  useEffect(() => {
    if (!loading && !isAuthorized) {
      const timer = setInterval(() => {
        setRedirectCount((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate({ to: "/" });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, isAuthorized, navigate]);

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

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-ivory)] px-6 text-center animate-in fade-in duration-500">
        <div className="bg-[var(--color-cream)] p-12 border border-border shadow-[var(--shadow-soft)] max-w-md w-full space-y-6">
          <div className="flex justify-center text-red-700/80">
            <ShieldAlert size={48} strokeWidth={1.2} />
          </div>
          <span className="gold-divider mb-2">Access Restricted</span>
          <h1 className="font-display text-3xl text-foreground">
            Unauthorized Access
          </h1>
          <p className="text-muted-foreground font-serif italic leading-relaxed text-sm">
            This workspace is locked by royal seal. Only authenticated administrators may compose formulas in this atelier.
          </p>
          <div className="pt-4 border-t border-border/60">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Redirecting to boutique in <span className="font-semibold text-foreground">{redirectCount}s</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
