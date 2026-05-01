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

const isLegalDrinkingAge = (day: string, month: string, year: string) => {
  const parsedDay = Number.parseInt(day, 10);
  const parsedMonth = Number.parseInt(month, 10);
  const parsedYear = Number.parseInt(year, 10);

  if (
    Number.isNaN(parsedDay) ||
    Number.isNaN(parsedMonth) ||
    Number.isNaN(parsedYear) ||
    parsedDay < 1 ||
    parsedDay > 31 ||
    parsedMonth < 1 ||
    parsedMonth > 12 ||
    year.length !== 4
  ) {
    return null;
  }

  const birthDate = new Date(parsedYear, parsedMonth - 1, parsedDay);
  if (
    birthDate.getFullYear() !== parsedYear ||
    birthDate.getMonth() !== parsedMonth - 1 ||
    birthDate.getDate() !== parsedDay
  ) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - parsedYear;
  const birthdayThisYearPassed =
    today.getMonth() > parsedMonth - 1 ||
    (today.getMonth() === parsedMonth - 1 && today.getDate() >= parsedDay);

  if (!birthdayThisYearPassed) {
    age -= 1;
  }

  return age >= 18;
};

const AgeGate = () => {
  const [status, setStatus] = useState<AgeGateStatus>(getInitialStatus);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");

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

  const handleContinue = () => {
    const isAllowed = isLegalDrinkingAge(day, month, year);

    if (isAllowed === null) {
      setError("Enter a valid date of birth.");
      return;
    }

    if (!isAllowed) {
      setError("You must be 18 or older to enter this website.");
      setGateStatus("blocked");
      return;
    }

    setError("");
    setGateStatus("allowed");
  };

  const resetGate = () => {
    setDay("");
    setMonth("");
    setYear("");
    setError("");
    setGateStatus("pending");
  };

  if (status === "allowed") {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden bg-[#120707]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(255,72,0,0.28),transparent_22%),radial-gradient(circle_at_78%_24%,rgba(255,15,15,0.18),transparent_26%),radial-gradient(circle_at_40%_90%,rgba(0,195,255,0.22),transparent_24%),linear-gradient(180deg,rgba(40,8,8,0.96),rgba(10,4,4,0.98))]" />
      <div className="absolute inset-x-0 top-[18%] h-40 bg-[linear-gradient(90deg,transparent,rgba(255,92,0,0.28),transparent)] blur-3xl" />
      <div className="absolute inset-x-0 bottom-[10%] h-24 bg-[linear-gradient(90deg,rgba(0,170,255,0.18),rgba(255,40,0,0.24),rgba(255,200,0,0.16))] blur-2xl" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-[38%] bg-black/45" />
        <div className="absolute left-[8%] top-[20%] h-24 w-6 rounded-full bg-[#ff4d00]/70 blur-md" />
        <div className="absolute right-[10%] top-[18%] h-28 w-6 rounded-full bg-[#ff5a00]/60 blur-md" />
        <div className="absolute left-[16%] bottom-[18%] h-64 w-20 rounded-[3rem] border border-cyan-300/25 bg-[linear-gradient(180deg,rgba(0,0,0,0.15),rgba(15,15,15,0.82))] shadow-[0_0_40px_rgba(0,200,255,0.18)] blur-[0.2px]" />
        <div className="absolute left-[34%] bottom-[16%] h-72 w-28 rounded-[2rem] border border-red-300/15 bg-[linear-gradient(180deg,rgba(0,0,0,0.2),rgba(24,14,14,0.92))] shadow-[0_0_45px_rgba(255,72,0,0.22)]" />
        <div className="absolute left-[57%] bottom-[14%] h-40 w-32 rounded-[1.8rem] border border-amber-300/15 bg-[linear-gradient(180deg,rgba(26,26,26,0.55),rgba(18,18,18,0.92))] shadow-[0_0_40px_rgba(255,166,0,0.18)]" />
        <div className="absolute left-[29%] bottom-[12%] h-12 w-12 rounded-full border border-lime-200/10 bg-lime-200/10 blur-[1px]" />
        <div className="absolute left-[48%] bottom-[10%] h-8 w-32 rounded-full bg-cyan-400/50 blur-xl" />
        <div className="absolute left-[61%] bottom-[12%] h-8 w-32 rounded-full bg-red-500/45 blur-xl" />
      </div>

      <div className="absolute inset-0 backdrop-blur-[6px]" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[rgba(18,8,8,0.68)] shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
          <div className="relative p-6 sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,90,0,0.18),transparent_35%)]" />
            <div className="relative">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/70">
                Tembo Premium
              </p>

              <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-none text-white sm:text-5xl">
                Become a Tembo Premium Member
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/78 sm:text-base">
                Explore premium spirits crafted for you. Confirm your legal drinking age to enter.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_1fr_1.4fr]">
                <input
                  inputMode="numeric"
                  maxLength={2}
                  value={day}
                  onChange={(event) => {
                    setDay(event.target.value.replace(/\D/g, "").slice(0, 2));
                    setError("");
                  }}
                  placeholder="DD"
                  className="h-12 rounded-none border border-white/70 bg-transparent px-4 text-base text-white placeholder:text-white/65 focus:border-white focus:outline-none"
                />
                <input
                  inputMode="numeric"
                  maxLength={2}
                  value={month}
                  onChange={(event) => {
                    setMonth(event.target.value.replace(/\D/g, "").slice(0, 2));
                    setError("");
                  }}
                  placeholder="MM"
                  className="h-12 rounded-none border border-white/70 bg-transparent px-4 text-base text-white placeholder:text-white/65 focus:border-white focus:outline-none"
                />
                <input
                  inputMode="numeric"
                  maxLength={4}
                  value={year}
                  onChange={(event) => {
                    setYear(event.target.value.replace(/\D/g, "").slice(0, 4));
                    setError("");
                  }}
                  placeholder="YYYY"
                  className="h-12 rounded-none border border-white/70 bg-transparent px-4 text-base text-white placeholder:text-white/65 focus:border-white focus:outline-none"
                />
              </div>

              <button
                onClick={handleContinue}
                className="mt-4 h-12 w-full rounded-[2px] bg-white px-6 text-base font-medium text-black transition-colors hover:bg-white/90"
              >
                Continue
              </button>

              {error && (
                <p className="mt-4 text-sm text-red-300">
                  {error}
                </p>
              )}

              {status === "blocked" && (
                <button
                  onClick={resetGate}
                  className="mt-4 text-sm font-medium text-white/85 underline underline-offset-4"
                >
                  Try again
                </button>
              )}

              <p className="mt-5 text-center text-xs leading-5 text-white/72">
                By entering this site you are agreeing to the Terms of Use and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeGate;
