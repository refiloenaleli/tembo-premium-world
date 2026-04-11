import { createContext, useContext, useState, ReactNode } from "react";
import { Region, regions } from "@/data/regions";

interface RegionContextType {
  region: Region;
  setRegion: (region: Region) => void;
  formatPrice: (zarPrice: number) => string;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegion] = useState<Region>(regions[0]);

  const formatPrice = (zarPrice: number) => {
    const converted = zarPrice * region.exchangeRate;
    return `${region.currencySymbol}${converted.toFixed(2)}`;
  };

  return (
    <RegionContext.Provider value={{ region, setRegion, formatPrice }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (!context) throw new Error("useRegion must be used within RegionProvider");
  return context;
}
