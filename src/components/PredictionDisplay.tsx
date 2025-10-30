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
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 border-2 hover:border-primary/50 transition-all duration-300 shadow-lg">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-primary" />
            Original Image
          </h3>
          <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden ring-2 ring-primary/20">
            <img src={image} alt="Original" className="w-full h-full object-cover" />
          </div>
        </Card>

        {heatmap && (
          <Card className="p-6 border-2 hover:border-primary/50 transition-all duration-300 shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-lg">
              <Info className="w-5 h-5 text-primary" />
              Grad-CAM Heatmap
            </h3>
            <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden ring-2 ring-primary/20">
              <img src={heatmap} alt="Heatmap" className="w-full h-full object-cover" />
            </div>
          </Card>
        )}
      </div>

      <Card className="p-8 border-2 shadow-2xl bg-gradient-to-br from-card to-card/80">
        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Analysis Results</h3>
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
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onReset} className="flex-1 h-12 text-base font-semibold border-2 hover:border-primary transition-all">
          Analyze Another Image
        </Button>
        <Button onClick={onDownloadReport} className="flex-1 h-12 gap-2 text-base font-semibold bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg hover:shadow-primary/50 transition-all">
          <Download className="w-5 h-5" />
          Download Report
        </Button>
      </div>
    </div>
  );
}
