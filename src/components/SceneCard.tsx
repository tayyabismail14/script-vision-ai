import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scene, ImagePrompt, IMAGE_STYLES, ImageStyleId } from "@/types/script";
import { StyleSelector } from "./StyleSelector";
import { Image, Sparkles, Download, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface SceneCardProps {
  scene: Scene;
  onGenerateImage: (sceneId: string, promptId: string, style: ImageStyleId) => void;
}

export function SceneCard({ scene, onGenerateImage }: SceneCardProps) {
  const [expandedPrompts, setExpandedPrompts] = useState<string[]>([scene.prompts[0]?.id].filter(Boolean));
  const [selectedStyle, setSelectedStyle] = useState<Record<string, ImageStyleId>>({});
  const [showStyleSelector, setShowStyleSelector] = useState<string | null>(null);

  const togglePrompt = (promptId: string) => {
    setExpandedPrompts(prev =>
      prev.includes(promptId)
        ? prev.filter(id => id !== promptId)
        : [...prev, promptId]
    );
  };

  const handleStyleSelect = (promptId: string, style: ImageStyleId) => {
    setSelectedStyle(prev => ({ ...prev, [promptId]: style }));
    setShowStyleSelector(null);
    onGenerateImage(scene.id, promptId, style);
  };

  return (
    <Card className="w-full animate-fade-in-up shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
              {scene.sceneNumber}
            </div>
            <div>
              <CardTitle className="text-lg">{scene.sceneTitle}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {scene.sceneDescription}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {scene.prompts.length} prompts
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {scene.prompts.map((prompt, index) => (
          <div
            key={prompt.id}
            className="border border-border rounded-xl overflow-hidden transition-all duration-200 hover:border-primary/30"
          >
            <button
              onClick={() => togglePrompt(prompt.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                  <Image className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">Prompt {index + 1}</p>
                  <p className="text-xs text-muted-foreground capitalize">{prompt.style} style base</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {prompt.generatedImageUrl && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    Generated
                  </Badge>
                )}
                {expandedPrompts.includes(prompt.id) ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </button>
            
            {expandedPrompts.includes(prompt.id) && (
              <div className="px-4 pb-4 space-y-4 animate-slide-up">
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm leading-relaxed text-foreground/90">{prompt.text}</p>
                </div>
                
                {prompt.generatedImageUrl ? (
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                      <img
                        src={prompt.generatedImageUrl}
                        alt={`Generated image for ${scene.sceneTitle}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <a href={prompt.generatedImageUrl} download target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </a>
                      </Button>
                      <Button
                        variant="subtle"
                        size="sm"
                        onClick={() => setShowStyleSelector(prompt.id)}
                      >
                        <Sparkles className="h-4 w-4 mr-1" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setShowStyleSelector(prompt.id)}
                    disabled={prompt.isGenerating}
                    className="w-full"
                  >
                    {prompt.isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-1" />
                        Generate Image
                      </>
                    )}
                  </Button>
                )}

                {showStyleSelector === prompt.id && (
                  <StyleSelector
                    onSelect={(style) => handleStyleSelect(prompt.id, style)}
                    onClose={() => setShowStyleSelector(null)}
                    selectedStyle={selectedStyle[prompt.id]}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
