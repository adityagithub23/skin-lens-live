import * as ort from "onnxruntime-web";
import { Prediction } from "@/components/PredictionDisplay";

// Mock ONNX model inference - replace with actual model when available
export async function runInference(imageData: string): Promise<{
  predictions: Prediction[];
  heatmap?: string;
}> {
  // Simulate inference delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock predictions based on HAM10000 dataset classes
  const classes = [
    { 
      label: "Melanocytic Nevus (Mole)", 
      description: "A benign growth of melanocytes. Most moles are harmless but should be monitored for changes." 
    },
    { 
      label: "Melanoma", 
      description: "A serious form of skin cancer. Immediate dermatologist consultation is strongly recommended." 
    },
    { 
      label: "Benign Keratosis", 
      description: "A non-cancerous skin growth, typically harmless but may be removed for cosmetic reasons." 
    },
    { 
      label: "Basal Cell Carcinoma", 
      description: "The most common type of skin cancer, highly treatable when detected early." 
    },
    { 
      label: "Actinic Keratosis", 
      description: "A precancerous skin growth caused by sun damage. Should be monitored by a dermatologist." 
    },
    { 
      label: "Vascular Lesion", 
      description: "A skin lesion involving blood vessels, generally benign but varies in type." 
    },
    { 
      label: "Dermatofibroma", 
      description: "A common benign skin growth, typically harmless and often doesn't require treatment." 
    },
  ];

  // Generate random predictions with boosted top confidence (always > 78%)
  const shuffled = [...classes].sort(() => Math.random() - 0.5);
  const rawPredictions = shuffled.slice(0, 5).map((cls, i) => ({
    ...cls,
    confidence: Math.random() * (i === 0 ? 0.5 : 0.3) + (i === 0 ? 0.4 : 0.05),
  })).sort((a, b) => b.confidence - a.confidence);

  // Normalize and ensure top prediction is always > 78%
  const total = rawPredictions.reduce((sum, p) => sum + p.confidence, 0);
  const normalized = rawPredictions.map(p => ({
    ...p,
    confidence: p.confidence / total
  }));

  // Boost top prediction to at least 79%
  if (normalized[0].confidence < 0.79) {
    const boost = 0.79 - normalized[0].confidence;
    normalized[0].confidence = 0.79;
    
    // Redistribute the difference among others
    const remaining = 1 - 0.79;
    const otherTotal = normalized.slice(1).reduce((sum, p) => sum + p.confidence, 0);
    for (let i = 1; i < normalized.length; i++) {
      normalized[i].confidence = (normalized[i].confidence / otherTotal) * remaining;
    }
  }

  const predictions: Prediction[] = normalized;

  // Generate mock heatmap (replace with actual Grad-CAM)
  const heatmap = await generateMockHeatmap(imageData);

  return { predictions, heatmap };
}

async function generateMockHeatmap(imageData: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        
        // Apply a simple red overlay as mock heatmap
        const gradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 2
        );
        gradient.addColorStop(0, "rgba(255, 0, 0, 0.6)");
        gradient.addColorStop(0.5, "rgba(255, 165, 0, 0.4)");
        gradient.addColorStop(1, "rgba(255, 255, 0, 0.1)");
        
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        resolve(canvas.toDataURL("image/png"));
      }
    };
    img.src = imageData;
  });
}

// TODO: Replace with actual ONNX model loading
export async function loadModel() {
  try {
    // Configure ONNX Runtime
    ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/";
    
    // Mock model loading - replace with actual model URL
    console.log("Model loaded (mock)");
    return true;
  } catch (error) {
    console.error("Failed to load model:", error);
    return false;
  }
}
