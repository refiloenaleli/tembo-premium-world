import { useEffect, useState } from "react";
import { Martini } from "lucide-react";

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
    <div className="fixed inset-0 z-[70] overflow-hidden bg-black px-4">
      <img
        src="/images/about/about-barrels.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(214,160,74,0.28),_transparent_38%),linear-gradient(135deg,rgba(18,11,7,0.9),rgba(8,8,8,0.82))]"
      />
      <div className="absolute inset-0 backdrop-blur-[6px]" />

      <div className="relative flex min-h-screen items-center justify-center py-10">
        <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="border-b border-white/10 bg-white/5 px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src="/images/misc/tembo-logo.jpg"
                  alt="Tembo Premium"
                  className="h-16 w-16 rounded-full border border-primary/40 object-cover shadow-lg shadow-black/30"
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-primary">Age Verification</p>
                  <p className="mt-1 text-sm text-white/70">Private pours. Adult guests only.</p>
                </div>
              </div>
              <div className="hidden rounded-full border border-white/15 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/70 sm:block">
                Tembo Premium
              </div>
            </div>
          </div>

          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5 text-center lg:text-left">
              <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl">
                Are you 18 or older?
              </h1>
              <p className="max-w-xl text-sm leading-7 text-white/72 sm:text-base">
                Tembo serves premium spirits and private club house experiences intended only for adults of legal drinking age. Please confirm before entering.
              </p>

              {status === "blocked" ? (
                <div className="space-y-4">
                  <p className="rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-4 text-sm leading-6 text-white">
                    You must be 18 or older to enter this website.
                  </p>
                  <button
                    onClick={() => setGateStatus("pending")}
                    className="rounded-xl border border-white/20 bg-white/8 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/14"
                  >
                    Go Back
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => setGateStatus("allowed")}
                    className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-primary-foreground shadow-[0_12px_30px_rgba(214,160,74,0.32)] transition-transform hover:-translate-y-0.5"
                  >
                    Yes, I am 18+
                  </button>
                  <button
                    onClick={() => setGateStatus("blocked")}
                    className="rounded-xl border border-white/20 bg-white/8 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-white/14"
                  >
                    No, I am under 18
                  </button>
                </div>
              )}
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.75rem] border border-white/15 bg-black/20 p-5 shadow-inner shadow-black/20">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/35 bg-primary/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary via-amber-300 to-primary text-sm font-black tracking-[0.12em] text-black">
                      18+
                    </div>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-primary">Legal Age</p>
                    <p className="mt-1 text-sm leading-6 text-white/72">
                      Entry is reserved for guests who are 18 years and older.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/15 bg-black/20 p-5 shadow-inner shadow-black/20">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/35 bg-primary/12 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <Martini size={30} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-primary">Drink Responsibly</p>
                    <p className="mt-1 text-sm leading-6 text-white/72">
                      Premium pours are best enjoyed with care, balance, and celebration.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-4 text-center text-xs uppercase tracking-[0.28em] text-white/60">
                Barrel aged atmosphere. Tembo standard.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeGate;
