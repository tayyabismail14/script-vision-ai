import { useState } from "react";
import { Header } from "@/components/Header";
import { ScriptInput } from "@/components/ScriptInput";
import { ScenesView } from "@/components/ScenesView";
import { Scene, ImageStyleId } from "@/types/script";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showScenes, setShowScenes] = useState(false);
  const { toast } = useToast();

  const handleAnalyzeScript = async (script: string) => {
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-script', {
        body: { script }
      });

      if (error) throw error;

      const parsedScenes: Scene[] = data.scenes.map((scene: any, index: number) => ({
        id: `scene-${index + 1}`,
        sceneNumber: scene.sceneNumber,
        sceneTitle: scene.sceneTitle,
        sceneDescription: scene.sceneDescription,
        prompts: scene.prompts.map((prompt: any, pIndex: number) => ({
          id: `scene-${index + 1}-prompt-${pIndex + 1}`,
          style: prompt.style,
          text: prompt.text,
        }))
      }));

      setScenes(parsedScenes);
      setShowScenes(true);
      
      toast({
        title: "Script analyzed successfully",
        description: `Found ${parsedScenes.length} visual scenes with ${parsedScenes.reduce((a, s) => a + s.prompts.length, 0)} prompts`,
      });
    } catch (error) {
      console.error('Error analyzing script:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze script. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateImage = async (sceneId: string, promptId: string, style: ImageStyleId) => {
    setScenes(prev => prev.map(scene => {
      if (scene.id === sceneId) {
        return {
          ...scene,
          prompts: scene.prompts.map(prompt => {
            if (prompt.id === promptId) {
              return { ...prompt, isGenerating: true };
            }
            return prompt;
          })
        };
      }
      return scene;
    }));

    try {
      const scene = scenes.find(s => s.id === sceneId);
      const prompt = scene?.prompts.find(p => p.id === promptId);
      
      if (!prompt) throw new Error("Prompt not found");

      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt: prompt.text,
          style 
        }
      });

      if (error) throw error;

      setScenes(prev => prev.map(scene => {
        if (scene.id === sceneId) {
          return {
            ...scene,
            prompts: scene.prompts.map(p => {
              if (p.id === promptId) {
                return { 
                  ...p, 
                  isGenerating: false, 
                  generatedImageUrl: data.imageUrl 
                };
              }
              return p;
            })
          };
        }
        return scene;
      }));

      toast({
        title: "Image generated",
        description: "Your image has been created successfully.",
      });
    } catch (error) {
      console.error('Error generating image:', error);
      
      setScenes(prev => prev.map(scene => {
        if (scene.id === sceneId) {
          return {
            ...scene,
            prompts: scene.prompts.map(p => {
              if (p.id === promptId) {
                return { ...p, isGenerating: false };
              }
              return p;
            })
          };
        }
        return scene;
      }));

      toast({
        title: "Image generation failed",
        description: error instanceof Error ? error.message : "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportPrompts = () => {
    const exportData = scenes.map(scene => ({
      sceneNumber: scene.sceneNumber,
      sceneTitle: scene.sceneTitle,
      sceneDescription: scene.sceneDescription,
      prompts: scene.prompts.map(p => ({
        style: p.style,
        text: p.text,
        hasGeneratedImage: !!p.generatedImageUrl
      }))
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'script-prompts.json';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Prompts exported",
      description: "Your prompts have been downloaded as JSON.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-8 md:py-12">
        {!showScenes ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Transform Scripts into
                <span className="text-primary block mt-1">Visual Stories</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Paste your video script and let AI break it down into visual scenes 
                with detailed image prompts ready for generation.
              </p>
            </div>
            <ScriptInput onAnalyze={handleAnalyzeScript} isAnalyzing={isAnalyzing} />
          </div>
        ) : (
          <ScenesView
            scenes={scenes}
            onBack={() => setShowScenes(false)}
            onGenerateImage={handleGenerateImage}
            onExportPrompts={handleExportPrompts}
          />
        )}
      </main>
    </div>
  );
}
