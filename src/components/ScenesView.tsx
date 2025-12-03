import { Scene, ImageStyleId } from "@/types/script";
import { SceneCard } from "./SceneCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileJson } from "lucide-react";

interface ScenesViewProps {
  scenes: Scene[];
  onBack: () => void;
  onGenerateImage: (sceneId: string, promptId: string, style: ImageStyleId) => void;
  onExportPrompts: () => void;
}

export function ScenesView({ scenes, onBack, onGenerateImage, onExportPrompts }: ScenesViewProps) {
  const totalPrompts = scenes.reduce((acc, scene) => acc + scene.prompts.length, 0);
  const generatedImages = scenes.reduce(
    (acc, scene) => acc + scene.prompts.filter(p => p.generatedImageUrl).length,
    0
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Visual Scenes</h2>
            <p className="text-muted-foreground text-sm">
              {scenes.length} scenes · {totalPrompts} prompts · {generatedImages} images generated
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={onExportPrompts} className="flex-1 sm:flex-none">
            <FileJson className="h-4 w-4 mr-1" />
            Export Prompts
          </Button>
        </div>
      </div>

      {/* Scenes */}
      <div className="space-y-6">
        {scenes.map((scene, index) => (
          <div
            key={scene.id}
            style={{ animationDelay: `${index * 100}ms` }}
            className="animate-fade-in-up"
          >
            <SceneCard scene={scene} onGenerateImage={onGenerateImage} />
          </div>
        ))}
      </div>
    </div>
  );
}
