import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wine, Shield, AlertTriangle } from "lucide-react";

const AgeGate = () => {
  const navigate = useNavigate();
  const [showDenied, setShowDenied] = useState(false);

  // Check if user already confirmed age (remember for this browser session)
  useEffect(() => {
    const hasConfirmed = localStorage.getItem("ageConfirmed");
    if (hasConfirmed === "true") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleYes = () => {
    localStorage.setItem("ageConfirmed", "true");
    navigate("/", { replace: true });
  };

  const handleNo = () => {
    setShowDenied(true);
  };

  if (showDenied) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="mx-auto w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center mb-8">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="font-display text-4xl text-white mb-4">Sorry</h1>
          <p className="text-xl text-gray-400 mb-8">
            You must be 18 years or older to enter this website.
          </p>
          <p className="text-gray-500 mb-10">
            Please come back when you are of legal drinking age.<br />
            Drink responsibly.
          </p>
          <button
            onClick={() => window.close()}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-10 py-4 rounded-lg font-medium transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] bg-[length:40px_40px] opacity-30" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-lg w-full text-center">
          {/* Logo / Brand */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center">
                <Wine className="w-12 h-12 text-black" />
              </div>
              <div>
                <div className="font-display text-5xl tracking-widest font-bold text-amber-400">TEMBO</div>
                <div className="text-xs tracking-[4px] text-gray-500 -mt-1">PREMIUM SPIRITS</div>
              </div>
            </div>
          </div>

          <h1 className="font-display text-6xl md:text-7xl font-bold mb-4 tracking-tight">
            ARE YOU 18?
          </h1>

          <p className="text-2xl text-gray-400 mb-12 max-w-sm mx-auto">
            You must be of legal drinking age to enter this site
          </p>

          {/* Nice Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto">
            <button
              onClick={handleYes}
              className="group relative bg-gradient-to-br from-amber-400 to-yellow-600 hover:from-amber-300 hover:to-yellow-500 text-black font-semibold py-8 px-10 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-900/50"
            >
              <div className="text-2xl mb-2">✅</div>
              <div className="text-xl">YES, I AM 18 OR OLDER</div>
              <div className="text-xs mt-3 opacity-75">Enter Site</div>
            </button>

            <button
              onClick={handleNo}
              className="group bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 font-semibold py-8 px-10 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="text-2xl mb-2">❌</div>
              <div className="text-xl text-gray-400">NO, I AM UNDER 18</div>
              <div className="text-xs mt-3 text-gray-500">Exit</div>
            </button>
          </div>

          <div className="mt-16 flex items-center justify-center gap-2 text-xs text-gray-500">
            <Shield className="w-4 h-4" />
            We promote responsible drinking
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeGate;