import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useUser } from "@/store/user";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || "/profile",
    };
  },
  head: () => ({ meta: [{ title: "Login — The Scented Aura" }] }),
  component: LoginPage,
});

function LoginPage() {
  const login = useUser((s) => s.login);
  const isLoading = useUser((s) => s.isLoading);
  const navigate = useNavigate();
  const search = Route.useSearch();
  const redirectPath = search.redirect || "/profile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorStack, setErrorStack] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrorStack(null);

    try {
      if (typeof login !== "function") {
        throw new Error(`login is not a function (typeof login = ${typeof login})`);
      }
      await login(email, password);
      // Clean redirect upon successful Supabase authentication
      navigate({ to: redirectPath });
    } catch (err: any) {
      console.error("Login onSubmit error caught:", err);
      setError(err.message || "Invalid email or password. Please try again.");
      setErrorStack(err.stack || "No stack trace available.");
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-[80vh] flex flex-col justify-center animate-in fade-in duration-500">
      <div className="mx-auto max-w-[400px] w-full px-6">
        <div className="text-center mb-8">
          <span className="gold-divider mb-4">Secure Sign In</span>
          <h1 className="font-display text-4xl text-foreground tracking-widest uppercase">
            Login
          </h1>
          {redirectPath === "/checkout" && (
            <p className="mt-3 text-xs uppercase tracking-[0.15em] text-[var(--color-gold-deep)] font-medium">
              Please sign in to complete your secure checkout.
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-xs flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
            {errorStack && (
              <pre className="mt-2 p-2 bg-black/10 text-[10px] overflow-auto max-h-40 whitespace-pre-wrap font-mono text-left select-text">
                {errorStack}
              </pre>
            )}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">
              Email Address
            </label>
            <input 
              required
              disabled={isLoading}
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. signature@scentedaura.com"
              className="w-full bg-transparent border-b border-foreground/30 focus:border-foreground py-2 outline-none transition-colors text-foreground disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">
              Password
            </label>
            <input 
              required
              disabled={isLoading}
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent border-b border-foreground/30 focus:border-foreground py-2 outline-none transition-colors text-foreground disabled:opacity-50"
            />
            <div className="text-right mt-3">
              <a href="#" className="text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                Forgot password?
              </a>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full btn-luxury flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
          <div className="text-center pt-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              New to our House?{" "}
            </span>
            <Link 
              to="/signup" 
              search={{ redirect: redirectPath }}
              className="text-xs text-foreground font-semibold hover:text-[var(--color-gold-hover)] transition-colors uppercase tracking-widest underline underline-offset-4"
            >
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
