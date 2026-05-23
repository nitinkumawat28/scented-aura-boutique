import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useUser } from "@/store/user";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — The Scented Aura" }] }),
  component: LoginPage,
});

function LoginPage() {
  const login = useUser((s) => s.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login(email, password);
      navigate({ to: "/profile" });
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-[80vh] flex flex-col justify-center">
      <div className="mx-auto max-w-[400px] w-full px-6">
        <h1 className="font-display text-3xl font-bold text-center text-foreground mb-10 tracking-widest uppercase">
          Login
        </h1>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] transition-colors text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] transition-colors text-foreground"
            />
            <div className="text-right mt-2">
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4">Forgot password?</a>
            </div>
          </div>
          <button type="submit" className="w-full bg-foreground text-background py-4 font-medium uppercase tracking-widest text-sm hover:bg-foreground/90 transition-colors">
            Sign In
          </button>
          <div className="text-center pt-2">
            <Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
