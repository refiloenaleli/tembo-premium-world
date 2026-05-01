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
    <div className="fixed inset-0 z-[70] overflow-auto bg-white/40 px-4 py-8 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.18)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="order-2 flex items-center justify-center bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,246,242,0.98))] p-8 lg:order-1 lg:p-10">
            <img
              src="/images/misc/age-gate-bottle.jpeg"
              alt="Tembo bottle"
              className="h-auto max-h-[32rem] w-full max-w-sm object-contain"
            />
          </div>

          <div className="order-1 flex items-center bg-white p-8 lg:order-2 lg:p-10">
            <div className="w-full">
              <img
                src="/images/misc/tembo-logo.jpg"
                alt="Tembo Premium"
                className="h-16 w-16 rounded-full object-cover"
              />

              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-foreground">
                Age Verification
              </p>

              <h1 className="mt-3 text-4xl font-semibold leading-tight text-foreground">
                Confirm your age
              </h1>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Alcohol is not for persons under the age of <span className="font-semibold text-red-600">18</span>.
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
      </div>
    </div>
  );
};

export default AgeGate;
