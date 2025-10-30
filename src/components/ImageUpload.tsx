import { useCallback, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  onUpload: (imageData: string) => void;
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearPreview = useCallback(() => {
    setPreview(null);
  }, []);

  const confirmUpload = useCallback(() => {
    if (preview) {
      onUpload(preview);
      setPreview(null);
      toast.success("Image uploaded successfully");
    }
  }, [preview, onUpload]);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {!preview ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`relative aspect-video border-2 border-dashed rounded-lg transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">
                  Drop your image here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse (max 10MB)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={clearPreview} className="flex-1">
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button onClick={confirmUpload} className="flex-1">
                <CheckCircle className="w-4 h-4 mr-2" />
                Analyze
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
