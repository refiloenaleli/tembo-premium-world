import { useRegion } from "@/context/RegionContext";
import { regions } from "@/data/regions";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegionSelectorProps {
  triggerClassName?: string;
}

const RegionSelector = ({ triggerClassName = "" }: RegionSelectorProps) => {
  const { region, setRegion } = useRegion();

  return (
    <Select value={region.id} onValueChange={(val) => {
      const r = regions.find((r) => r.id === val);
      if (r) setRegion(r);
    }}>
      <SelectTrigger className={`w-auto gap-1 sm:gap-2 border-border bg-secondary text-foreground text-[10px] sm:text-xs h-7 sm:h-8 px-1.5 sm:px-2 max-w-[120px] sm:max-w-none ${triggerClassName}`}>
        <Globe size={14} className="text-primary" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-card border-border">
        {regions.map((r) => (
          <SelectItem key={r.id} value={r.id} className="text-foreground">
            <span className="flex items-center gap-2">
              <span>{r.flag}</span>
              <span>{r.name}</span>
              <span className="text-muted-foreground">({r.currency})</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default RegionSelector;
