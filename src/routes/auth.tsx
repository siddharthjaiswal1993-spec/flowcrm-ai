import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useServerFn } from "@tanstack/react-start";
import { ensureProfile } from "@/lib/insights.functions";
import { Sparkles, Loader2 } from "lucide-react";

const authSearchSchema = z.object({
  reason: z.enum(["expired", "signed_out"]).optional(),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — FlowCRM" }] }),
  validateSearch: authSearchSchema,
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { reason, redirect } = Route.useSearch();
  const ensureProfileFn = useServerFn(ensureProfile);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [team, setTeam] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(
    reason === "expired"
      ? "Your session expired. Please sign in to continue."
      : null,
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: redirect ?? "/", replace: true });
    });
  }, [navigate, redirect]);

  const waitForSession = async () => {
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const { data } = await supabase.auth.getSession();
      if (data.session?.access_token) return data.session;
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    return null;
  };

  const afterAuth = async () => {
    const session = await waitForSession();
    if (!session) {
      setNotice("Sign-in is still finishing. Please try Continue again in a moment.");
      return;
    }
    try {
      await ensureProfileFn({
        data: { fullName: fullName || undefined, team: team || null },
      });
    } catch {
      // Non-fatal: trigger will have created baseline rows.
    }
    navigate({ to: redirect ?? "/", replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: fullName || email.split("@")[0],
              team: team || null,
            },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setNotice("Check your email to confirm the account, then sign in.");
          return;
        }
        await afterAuth();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await afterAuth();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setNotice(null);
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError(result.error.message ?? "Google sign-in failed");
      setBusy(false);
    }
    if (!result.redirected && !result.error) {
      await afterAuth();
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded-md bg-primary text-primary-foreground grid place-items-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">FlowCRM</div>
            <div className="text-[11px] text-muted-foreground">AI Workspace</div>
          </div>
        </div>

        <h1 className="text-lg font-semibold text-foreground">
          {mode === "signin" ? "Sign in" : "Create your account"}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          {mode === "signin"
            ? "Welcome back. Continue to your CRM workspace."
            : "Start your FlowCRM AI workspace in seconds."}
        </p>

        {notice && (
          <div className="mt-4 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-foreground">
            {notice}
          </div>
        )}

        <button
          onClick={handleGoogle}
          disabled={busy}
          className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          Continue with Google
        </button>

        <div className="my-4 flex items-center gap-3 text-[11px] text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          or
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <>
              <input
                type="text"
                required
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Team (optional, e.g. North America)"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </>
          )}
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          {error && (
            <div className="text-xs text-[color:var(--danger)]">{error}</div>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "signin"
            ? "No account yet? Create one"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}