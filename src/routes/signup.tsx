import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useUser } from "@/store/user";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create Account — The Scented Aura" }] }),
  component: SignupPage,
});

function SignupPage() {
  const register = useUser((s) => s.register);
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName && lastName && email && password) {
      register(firstName, lastName, email);
      navigate({ to: "/profile" });
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-[80vh] flex flex-col justify-center">
      <div className="mx-auto max-w-[400px] w-full px-6">
        <h1 className="font-display text-3xl font-bold text-center text-foreground mb-10 tracking-widest uppercase">
          Create Account
        </h1>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
              <input 
                required
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] transition-colors text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
              <input 
                required
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] transition-colors text-foreground"
              />
            </div>
          </div>
          
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
          </div>
          <button type="submit" className="w-full bg-foreground text-background py-4 font-medium uppercase tracking-widest text-sm hover:bg-foreground/90 transition-colors mt-4">
            Create Account
          </button>
          <div className="text-center pt-4 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-foreground hover:underline underline-offset-4 font-medium">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
