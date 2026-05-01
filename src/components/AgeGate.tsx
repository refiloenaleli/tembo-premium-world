import { useEffect, useState } from "react";

const AGE_GATE_KEY = "tembo-age-gate";
type AgeGateStatus = "pending" | "allowed" | "blocked";

const getInitialStatus = (): AgeGateStatus => {
  if (typeof window === "undefined") {
    return "pending";
  }

  const saved = window.localStorage.getItem(AGE_GATE_KEY);
  return saved === "allowed" || saved === "blocked" ? saved : "pending";
};

const AgeGate = () => {
  const [status, setStatus] = useState<AgeGateStatus>(getInitialStatus);

  useEffect(() => {
    setStatus(getInitialStatus());
  }, []);

  const setGateStatus = (nextStatus: AgeGateStatus) => {
    if (nextStatus === "pending") {
      window.localStorage.removeItem(AGE_GATE_KEY);
    } else {
      window.localStorage.setItem(AGE_GATE_KEY, nextStatus);
    }
    setStatus(nextStatus);
  };

  if (status === "allowed") {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] bg-white px-4">
      <div className="flex min-h-screen items-center justify-center py-10">
        <div className="w-full max-w-md rounded-[2rem] border border-border bg-white px-8 py-10 text-center shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
          <img
            src="/images/misc/tembo-logo.jpg"
            alt="Tembo Premium"
            className="mx-auto h-20 w-20 rounded-full object-cover"
          />

          <h1 className="mt-6 font-display text-3xl text-foreground">
            Are you 18 or older?
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Please confirm your age to enter.
          </p>

          {status === "blocked" ? (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-foreground">
                You must be 18 or older to enter this website.
              </p>
              <button
                onClick={() => setGateStatus("pending")}
                className="w-full rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Go Back
              </button>
            </div>
          ) : (
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => setGateStatus("allowed")}
                className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Yes, I am 18+
              </button>
              <button
                onClick={() => setGateStatus("blocked")}
                className="w-full rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                No, I am under 18
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgeGate;
