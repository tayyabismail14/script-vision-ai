import { IMAGE_STYLES, ImageStyleId } from "@/types/script";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StyleSelectorProps {
  onSelect: (style: ImageStyleId) => void;
  onClose: () => void;
  selectedStyle?: ImageStyleId;
}

export function StyleSelector({ onSelect, onClose, selectedStyle }: StyleSelectorProps) {
  return (
    <Card className="p-4 animate-scale-in border-2 border-primary/20 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-sm">Select Image Style</h4>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {IMAGE_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style.id)}
            className={cn(
              "relative flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all duration-200 hover:border-primary/50 hover:bg-primary/5",
              selectedStyle === style.id
                ? "border-primary bg-primary/10"
                : "border-border"
            )}
          >
            {selectedStyle === style.id && (
              <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
            <span className="font-medium text-sm">{style.name}</span>
            <span className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {style.description}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}
