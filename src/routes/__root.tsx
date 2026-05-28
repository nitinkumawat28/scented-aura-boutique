import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/store/user";
import { isAdmin } from "@/lib/auth";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Scented Aura — House of Perfume" },
      { name: "description", content: "Handcrafted luxury fragrances inspired by nature, elegance, and timeless artistry." },
      { name: "author", content: "The Scented Aura" },
      { property: "og:title", content: "The Scented Aura — House of Perfume" },
      { property: "og:description", content: "Handcrafted luxury fragrances inspired by nature, elegance, and timeless artistry." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isAdmin = pathname.startsWith("/admin");
  const showNavbar = !isAdmin;
  const showFooter = !isAdmin && pathname !== "/login" && pathname !== "/signup";
  
  const setUser = useUser((s) => s.setUser);
  const setIsAdmin = useUser((s) => s.setIsAdmin);

  useEffect(() => {
    // 0. Clear bloated legacy stores from localStorage to prevent QuotaExceededError crashes
    if (typeof window !== "undefined") {
      const keysToClear = ["scented-aura-products", "scented-aura-orders"];
      keysToClear.forEach(key => {
        if (localStorage.getItem(key)) {
          try {
            localStorage.removeItem(key);
            console.log(`Cleared legacy localStorage cache key: ${key}`);
          } catch (e) {
            console.error(`Failed to clear localStorage key "${key}":`, e);
          }
        }
      });
    }

    // 1. Recover session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const metadata = session.user.user_metadata || {};
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          firstName: metadata.first_name || "Guest",
          lastName: metadata.last_name || "User",
          gender: metadata.gender || "",
          mobile: metadata.mobile || "",
          addresses: metadata.addresses || [],
        });
        
        try {
          if (typeof isAdmin === "function") {
            isAdmin(session.user.id, session.user.email).then((adminStatus) => {
              if (typeof setIsAdmin === "function") {
                setIsAdmin(adminStatus);
              } else {
                console.error("setIsAdmin is not a function:", setIsAdmin);
              }
            }).catch((err) => {
              console.error("Error in isAdmin check on mount:", err);
            });
          } else {
            console.error("isAdmin is not a function:", isAdmin);
          }
        } catch (e) {
          console.error("Synchronous exception in isAdmin on mount:", e);
        }
      } else {
        setUser(null);
        if (typeof setIsAdmin === "function") {
          setIsAdmin(false);
        }
      }
    }).catch((err) => {
      console.error("Error in getSession:", err);
    });

    // 2. Listen to real-time auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const metadata = session.user.user_metadata || {};
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          firstName: metadata.first_name || "Guest",
          lastName: metadata.last_name || "User",
          gender: metadata.gender || "",
          mobile: metadata.mobile || "",
          addresses: metadata.addresses || [],
        });
        
        try {
          if (typeof isAdmin === "function") {
            isAdmin(session.user.id, session.user.email).then((adminStatus) => {
              if (typeof setIsAdmin === "function") {
                setIsAdmin(adminStatus);
              } else {
                console.error("setIsAdmin is not a function:", setIsAdmin);
              }
            }).catch((err) => {
              console.error("Error in isAdmin check on auth change:", err);
            });
          } else {
            console.error("isAdmin is not a function:", isAdmin);
          }
        } catch (e) {
          console.error("Synchronous exception in isAdmin on auth change:", e);
        }
      } else {
        setUser(null);
        if (typeof setIsAdmin === "function") {
          setIsAdmin(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setIsAdmin]);

  return (
    <QueryClientProvider client={queryClient}>
      {showNavbar && <Navbar />}
      <main className={isAdmin ? "min-h-screen bg-[var(--color-secondary)]/30" : "min-h-screen"}>
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </QueryClientProvider>
  );
}
