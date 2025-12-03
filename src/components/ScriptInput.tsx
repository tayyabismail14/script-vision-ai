import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, FileText, Loader2 } from "lucide-react";

interface ScriptInputProps {
  onAnalyze: (script: string) => void;
  isAnalyzing: boolean;
}

export function ScriptInput({ onAnalyze, isAnalyzing }: ScriptInputProps) {
  const [script, setScript] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (script.trim()) {
      onAnalyze(script);
    }
  };

  const exampleScript = `Welcome to our video about the future of renewable energy.

Opening shot of a sunrise over solar panels in a vast desert landscape. Golden light reflects off the panels as morning fog lifts.

Cut to a modern wind farm with massive turbines spinning gracefully against a cloudy sky. Workers in safety gear inspect the base of one turbine.

Interior shot of a high-tech control room. Engineers monitor multiple screens showing real-time energy data. Green graphs trend upward.

Aerial drone footage sweeping over a coastal city at dusk. Building lights flicker on as solar-powered streetlights illuminate the roads below.

Close-up of a child planting a small tree in a community garden. Adults in the background install residential solar panels on nearby homes.

Final shot pulls back to reveal a thriving green city with clean air, electric vehicles, and solar rooftops as far as the eye can see.`;

  return (
    <Card className="w-full max-w-4xl mx-auto animate-fade-in-up shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <FileText className="h-7 w-7 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl md:text-3xl font-bold">Paste Your Video Script</CardTitle>
        <CardDescription className="text-base mt-2 max-w-lg mx-auto">
          Enter your complete video script below. Our AI will analyze it and generate visual scene breakdowns with detailed image prompts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Textarea
              placeholder="Paste your video script here..."
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="min-h-[280px] text-base leading-relaxed"
              disabled={isAnalyzing}
            />
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>{script.length} characters</span>
              <button
                type="button"
                onClick={() => setScript(exampleScript)}
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Load example script
              </button>
            </div>
          </div>
          
          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={!script.trim() || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing Script...
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5" />
                Generate Visual Scenes
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
