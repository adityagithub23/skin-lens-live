import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Download, AlertTriangle, Info, Activity } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface Prediction {
  label: string;
  confidence: number;
  description: string;
}

interface PredictionDisplayProps {
  image: string;
  heatmap?: string;
  predictions: Prediction[];
  onDownloadReport: () => void;
  onReset: () => void;
}

export function PredictionDisplay({
  image,
  heatmap,
  predictions,
  onDownloadReport,
  onReset,
}: PredictionDisplayProps) {
  const topPrediction = predictions[0];
  const isLowConfidence = topPrediction.confidence < 0.6;

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return <Badge className="bg-success">High Confidence</Badge>;
    if (confidence >= 0.6) return <Badge className="bg-warning">Medium Confidence</Badge>;
    return <Badge variant="destructive">Low Confidence</Badge>;
  };

  return (
    <div className="space-y-6">
      {isLowConfidence && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Low confidence detected. Please retake the image with better lighting and focus, or consult
            a dermatologist for proper diagnosis.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Original Image
          </h3>
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img src={image} alt="Original" className="w-full h-full object-cover" />
          </div>
        </Card>

        {heatmap && (
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Grad-CAM Heatmap
            </h3>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img src={heatmap} alt="Heatmap" className="w-full h-full object-cover" />
            </div>
          </Card>
        )}
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
        <div className="space-y-4">
          {predictions.map((prediction, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{prediction.label}</span>
                  {index === 0 && getConfidenceBadge(prediction.confidence)}
                </div>
                <span className="text-sm font-medium">
                  {(prediction.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={prediction.confidence * 100} className="h-2" />
              {index === 0 && (
                <p className="text-sm text-muted-foreground">{prediction.description}</p>
              )}
            </div>
          ))}
        </div>

        <Alert className="mt-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            These results are AI-generated predictions and should not be used for medical diagnosis.
            Always consult a qualified dermatologist for professional evaluation.
          </AlertDescription>
        </Alert>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onReset} className="flex-1">
          Analyze Another Image
        </Button>
        <Button onClick={onDownloadReport} className="flex-1 gap-2">
          <Download className="w-4 h-4" />
          Download Report
        </Button>
      </div>
    </div>
  );
}
