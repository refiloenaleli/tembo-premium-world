import { useEffect, useState } from "react";

const AGE_GATE_KEY = "tembo-age-gate";

const AgeGate = () => {
  const [status, setStatus] = useState<"pending" | "allowed" | "blocked">("pending");

  useEffect(() => {
    const saved = window.localStorage.getItem(AGE_GATE_KEY);
    if (saved === "allowed" || saved === "blocked") {
      setStatus(saved);
    }
  }, []);

  const setGateStatus = (nextStatus: "allowed" | "blocked") => {
    window.localStorage.setItem(AGE_GATE_KEY, nextStatus);
    setStatus(nextStatus);
  };

  if (status === "allowed") {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/95 px-4 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-2xl border border-primary/30 bg-card p-8 text-center shadow-2xl shadow-black/40">
        <img
          src="/images/misc/tembo-logo.jpg"
          alt="Tembo Premium"
          className="mx-auto mb-5 h-20 w-20 rounded-full border border-primary/30 object-cover"
        />
        <p className="mb-2 text-xs uppercase tracking-[0.35em] text-primary">Age Verification</p>
        <h1 className="font-display text-4xl text-foreground">Are you 18 or older?</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
          Alcohol is not for persons under the 18. Please confirm your age before browsing Tembo Premium.
        </p>

        {status === "blocked" ? (
          <div className="mt-8 space-y-3">
            <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-4 text-sm text-destructive-foreground">
              You must be 18 or older to enter this website.
            </p>
            <button
              onClick={() => setGateStatus("pending")}
              className="rounded-md border border-border px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => setGateStatus("allowed")}
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground"
            >
              Yes, I am 18+
            </button>
            <button
              onClick={() => setGateStatus("blocked")}
              className="rounded-md border border-border px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-secondary"
            >
              No, I am under 18
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgeGate;
