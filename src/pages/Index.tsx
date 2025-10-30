import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsentDialog } from "@/components/ConsentDialog";
import { CameraCapture } from "@/components/CameraCapture";
import { ImageUpload } from "@/components/ImageUpload";
import { PredictionDisplay, Prediction } from "@/components/PredictionDisplay";
import { Camera, Upload, Activity, Shield, Zap, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { runInference, loadModel } from "@/lib/inference";
import { generateReport } from "@/lib/reportGenerator";

const Index = () => {
  const [showConsent, setShowConsent] = useState(true);
  const [hasConsented, setHasConsented] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [heatmap, setHeatmap] = useState<string | undefined>();
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    loadModel().then(setModelReady);
  }, []);

  const handleConsent = () => {
    setHasConsented(true);
    setShowConsent(false);
    toast.success("You can now proceed with analysis");
  };

  const handleDecline = () => {
    setShowConsent(false);
    toast.error("You must accept the terms to use this application");
  };

  const analyzeImage = async (imageData: string) => {
    if (!modelReady) {
      toast.error("Model is still loading. Please wait...");
      return;
    }

    setIsAnalyzing(true);
    setCurrentImage(imageData);
    
    try {
      const result = await runInference(imageData);
      setPredictions(result.predictions);
      setHeatmap(result.heatmap);
      toast.success("Analysis complete");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadReport = async () => {
    if (currentImage && predictions) {
      await generateReport(currentImage, heatmap, predictions);
      toast.success("Report downloaded successfully");
    }
  };

  const handleReset = () => {
    setCurrentImage(null);
    setPredictions(null);
    setHeatmap(undefined);
  };

  if (!hasConsented) {
    return (
      <>
        <ConsentDialog
          open={showConsent}
          onAccept={handleConsent}
          onDecline={handleDecline}
        />
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background flex items-center justify-center p-6">
          <Card className="max-w-2xl p-12 text-center">
            <div className="mb-6 inline-flex p-4 bg-primary/10 rounded-full">
              <Activity className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Skin Lesion Analysis</h1>
            <p className="text-lg text-muted-foreground mb-8">
              AI-powered preliminary screening tool for educational purposes
            </p>
            <Button size="lg" onClick={() => setShowConsent(true)}>
              Get Started
            </Button>
          </Card>
        </div>
      </>
    );
  }

  if (predictions && currentImage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Analysis Results</h1>
            <p className="text-muted-foreground">
              Review the AI-generated predictions below
            </p>
          </div>
          <PredictionDisplay
            image={currentImage}
            heatmap={heatmap}
            predictions={predictions}
            onDownloadReport={handleDownloadReport}
            onReset={handleReset}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Activity className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">DermAI Analyzer</h1>
                <p className="text-xs text-muted-foreground">Educational Screening Tool</p>
              </div>
            </div>
            {!modelReady && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
                Loading model...
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Analyze Skin Lesions with AI</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload an image or use your camera for preliminary AI analysis. Not for medical diagnosis.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center">
            <div className="inline-flex p-3 bg-primary/10 rounded-lg mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Real-time Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Get instant AI predictions with confidence scores
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="inline-flex p-3 bg-primary/10 rounded-lg mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Privacy First</h3>
            <p className="text-sm text-muted-foreground">
              Images processed locally, not stored by default
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="inline-flex p-3 bg-primary/10 rounded-lg mb-4">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Grad-CAM Visualization</h3>
            <p className="text-sm text-muted-foreground">
              See what the AI focuses on in your image
            </p>
          </Card>
        </div>

        {/* Analysis Interface */}
        <Card className="max-w-3xl mx-auto">
          <Tabs defaultValue="camera" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="camera" className="gap-2">
                <Camera className="w-4 h-4" />
                Camera
              </TabsTrigger>
              <TabsTrigger value="upload" className="gap-2">
                <Upload className="w-4 h-4" />
                Upload
              </TabsTrigger>
            </TabsList>
            <TabsContent value="camera" className="p-6">
              {isAnalyzing ? (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4 animate-pulse">
                    <Activity className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-lg font-semibold">Analyzing image...</p>
                  <p className="text-sm text-muted-foreground">This may take a few seconds</p>
                </div>
              ) : (
                <CameraCapture onCapture={analyzeImage} />
              )}
            </TabsContent>
            <TabsContent value="upload" className="p-6">
              {isAnalyzing ? (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4 animate-pulse">
                    <Activity className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-lg font-semibold">Analyzing image...</p>
                  <p className="text-sm text-muted-foreground">This may take a few seconds</p>
                </div>
              ) : (
                <ImageUpload onUpload={analyzeImage} />
              )}
            </TabsContent>
          </Tabs>
        </Card>

        {/* Disclaimer */}
        <Card className="max-w-3xl mx-auto mt-8 p-6 border-warning/50 bg-warning/5">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Medical Disclaimer</h3>
              <p className="text-sm text-foreground/80">
                This tool is for educational and screening purposes only. It does not provide medical
                diagnosis or treatment advice. Always consult a qualified dermatologist for any skin
                concerns. The AI predictions may be inaccurate and should not be solely relied upon for
                health decisions.
              </p>
            </div>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t mt-24">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          <p>
            Built for educational purposes. Not FDA approved. Not for clinical use without proper validation.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
