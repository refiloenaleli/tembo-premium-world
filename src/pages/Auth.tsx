import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [processingLink, setProcessingLink] = useState(true);
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthLink = async () => {
      const url = new URL(window.location.href);
      const hash = url.hash.startsWith("#") ? url.hash.slice(1) : "";
      const hashParams = new URLSearchParams(hash);
      const searchParams = url.searchParams;
      const errorDescription = hashParams.get("error_description") || searchParams.get("error_description");

      if (errorDescription) {
        toast.error(decodeURIComponent(errorDescription.replace(/\+/g, " ")));
        setProcessingLink(false);
        return;
      }

      const code = searchParams.get("code");
      const tokenHash = searchParams.get("token_hash");
      const otpType = searchParams.get("type") as
        | "signup"
        | "recovery"
        | "invite"
        | "email"
        | "email_change"
        | null;
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Your email has been confirmed. You can continue with Tembo.");
          window.history.replaceState({}, document.title, "/auth");
        }
      } else if (tokenHash && otpType) {
        const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: otpType });
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Your email has been confirmed. You can continue with Tembo.");
          window.history.replaceState({}, document.title, "/auth");
        }
      } else if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          toast.error(error.message);
        } else {
          const type = hashParams.get("type");
          toast.success(
            type === "signup"
              ? "Your email has been confirmed. You can continue with Tembo."
              : "You are signed in.",
          );
          window.history.replaceState({}, document.title, "/auth");
        }
      }

      setProcessingLink(false);
    };

    void handleAuthLink();
  }, []);

  useEffect(() => {
    if (!processingLink && user) {
      navigate("/");
    }
  }, [navigate, processingLink, user]);

  if (processingLink) {
    return <div className="pt-16 min-h-screen flex items-center justify-center text-muted-foreground">Preparing your Tembo account...</div>;
  }

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (mode === "register" && !form.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    setLoading(true);
    if (mode === "login") {
      const { error } = await signIn(form.email, form.password);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Welcome back!");
        navigate("/");
      }
    } else {
      const { error } = await signUp(form.email, form.password, form.name);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Account created! Please check your email to verify.");
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();

    if (error) {
      toast.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-3xl font-bold text-foreground tracking-wider">TEMBO</Link>
          <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mt-1">Premium Spirits</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex mb-6">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 pb-2 text-sm font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                mode === "login" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 pb-2 text-sm font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                mode === "register" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
              }`}
            >
              Register
            </button>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mb-4 flex w-full items-center justify-center gap-3 rounded border border-border bg-secondary px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.6-2.5C16.9 3.5 14.7 2.5 12 2.5A9.5 9.5 0 0 0 2.5 12 9.5 9.5 0 0 0 12 21.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.5H12Z" />
              <path fill="#34A853" d="M3.6 7.6 6.8 10c.9-1.8 2.8-3 5.2-3 1.9 0 3.2.8 3.9 1.5l2.6-2.5C16.9 3.5 14.7 2.5 12 2.5c-3.7 0-7 2.1-8.4 5.1Z" />
              <path fill="#FBBC05" d="M2.5 12c0 1.5.4 3 1.1 4.3l3.7-2.8c-.2-.5-.3-1-.3-1.5s.1-1 .3-1.5L3.6 7.6A9.4 9.4 0 0 0 2.5 12Z" />
              <path fill="#4285F4" d="M12 21.5c2.6 0 4.8-.9 6.4-2.5l-3.1-2.4c-.8.6-1.8 1-3.3 1-2.4 0-4.4-1.6-5.1-3.8l-3.8 2.9c1.4 2.9 4.4 4.8 8.9 4.8Z" />
            </svg>
            Continue with Google
          </button>

          <p className="mb-4 text-center text-xs text-muted-foreground">
            If you sign up with email, check your inbox and confirm your address before signing in.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={100}
                className="w-full bg-secondary border border-border text-foreground rounded px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
              />
            )}
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              maxLength={255}
              className="w-full bg-secondary border border-border text-foreground rounded px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              maxLength={128}
              className="w-full bg-secondary border border-border text-foreground rounded px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded font-semibold uppercase text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
