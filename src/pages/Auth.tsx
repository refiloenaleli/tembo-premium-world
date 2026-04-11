import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate("/");
    return null;
  }

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
