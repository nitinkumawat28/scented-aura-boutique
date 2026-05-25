import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useUser } from "@/store/user";

export const Route = createFileRoute("/signup")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || "/profile",
    };
  },
  head: () => ({ meta: [{ title: "Create Account — The Scented Aura" }] }),
  component: SignupPage,
});

function SignupPage() {
  const register = useUser((s) => s.register);
  const isLoading = useUser((s) => s.isLoading);
  const navigate = useNavigate();
  const search = Route.useSearch();
  const redirectPath = search.redirect || "/profile";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await register(firstName, lastName, email, password);
      // Clean redirect upon successful Supabase registration
      navigate({ to: redirectPath });
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-[80vh] flex flex-col justify-center animate-in fade-in duration-500">
      <div className="mx-auto max-w-[400px] w-full px-6">
        <div className="text-center mb-8">
          <span className="gold-divider mb-4">Join our House</span>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-widest uppercase">
            Create Account
          </h1>
          {redirectPath === "/checkout" && (
            <p className="mt-3 text-xs uppercase tracking-[0.15em] text-[var(--color-gold-deep)] font-medium">
              Create an account to complete your secure checkout.
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-3">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                First Name
              </label>
              <input 
                required
                disabled={isLoading}
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Jean"
                className="w-full bg-transparent border-b border-foreground/30 focus:border-foreground py-2 outline-none transition-colors text-foreground disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Last Name
              </label>
              <input 
                required
                disabled={isLoading}
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Dupont"
                className="w-full bg-transparent border-b border-foreground/30 focus:border-foreground py-2 outline-none transition-colors text-foreground disabled:opacity-50"
              />
            </div>
          </div>
          
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
              placeholder="Min. 6 characters"
              className="w-full bg-transparent border-b border-foreground/30 focus:border-foreground py-2 outline-none transition-colors text-foreground disabled:opacity-50"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full btn-luxury flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
          
          <div className="text-center pt-4 text-xs text-muted-foreground uppercase tracking-wider">
            Already have an account?{" "}
            <Link 
              to="/login" 
              search={{ redirect: redirectPath }}
              className="text-foreground font-semibold hover:text-[var(--color-gold-hover)] transition-colors underline underline-offset-4"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
