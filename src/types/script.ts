export interface ImagePrompt {
  id: string;
  style: string;
  text: string;
  generatedImageUrl?: string;
  isGenerating?: boolean;
}

export interface Scene {
  id: string;
  sceneNumber: number;
  sceneTitle: string;
  sceneDescription: string;
  prompts: ImagePrompt[];
}

export interface Script {
  id: string;
  userId: string;
  title: string;
  content: string;
  scenes: Scene[];
  createdAt: string;
  updatedAt: string;
}

export const IMAGE_STYLES = [
  { id: 'realistic', name: 'Realistic', description: 'Photorealistic imagery with natural lighting' },
  { id: 'cinematic', name: 'Cinematic', description: 'Movie-quality visuals with dramatic lighting' },
  { id: 'creative', name: 'Creative', description: 'Artistic interpretation with bold choices' },
  { id: 'dynamic', name: 'Dynamic', description: 'Action-focused with movement and energy' },
  { id: 'cartoonish', name: 'Cartoonish', description: 'Playful animated style' },
  { id: 'sketch', name: 'Sketch', description: 'Hand-drawn pencil or charcoal look' },
  { id: 'watercolor', name: 'Watercolor', description: 'Soft, flowing paint aesthetic' },
  { id: 'oil-painting', name: 'Oil Painting', description: 'Classic fine art brushwork' },
  { id: 'hyper-real-4k', name: 'Hyper-Real 4K', description: 'Ultra-detailed photorealism' },
  { id: 'bokeh', name: 'Bokeh', description: 'Shallow depth of field with blur' },
  { id: 'fashion-editorial', name: 'Fashion Editorial', description: 'High-fashion magazine aesthetic' },
  { id: 'minimal', name: 'Minimal Aesthetic', description: 'Clean, simple composition' },
] as const;

export type ImageStyleId = typeof IMAGE_STYLES[number]['id'];
