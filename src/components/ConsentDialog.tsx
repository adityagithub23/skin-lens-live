import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";

interface ConsentDialogProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function ConsentDialog({ open, onAccept, onDecline }: ConsentDialogProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [understoodLimitations, setUnderstoodLimitations] = useState(false);

  const canProceed = agreedToTerms && agreedToPrivacy && understoodLimitations;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onDecline()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-warning/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <DialogTitle className="text-2xl">Important Medical Disclaimer</DialogTitle>
          </div>
          <DialogDescription className="text-base space-y-4 pt-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="font-semibold text-destructive-foreground mb-2">
                This is NOT a medical diagnostic tool
              </p>
              <p className="text-sm text-foreground/90">
                This application uses artificial intelligence to provide preliminary analysis of skin lesions.
                It is designed for educational and screening purposes only and should never replace professional
                medical advice, diagnosis, or treatment.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Before proceeding, you must understand:</h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-foreground/80">
                <li>AI predictions may be inaccurate and should not be solely relied upon</li>
                <li>Always consult a qualified dermatologist for any skin concerns</li>
                <li>This tool cannot detect all types of skin conditions or cancers</li>
                <li>Images are processed locally and not stored by default</li>
                <li>You are responsible for your own health decisions</li>
              </ul>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                />
                <label htmlFor="terms" className="text-sm cursor-pointer">
                  I understand this is not a medical diagnostic tool and will consult a healthcare professional
                  for any medical concerns
                </label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="privacy"
                  checked={agreedToPrivacy}
                  onCheckedChange={(checked) => setAgreedToPrivacy(checked === true)}
                />
                <label htmlFor="privacy" className="text-sm cursor-pointer">
                  I consent to the use of camera/images for AI analysis and understand data handling practices
                </label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="limitations"
                  checked={understoodLimitations}
                  onCheckedChange={(checked) => setUnderstoodLimitations(checked === true)}
                />
                <label htmlFor="limitations" className="text-sm cursor-pointer">
                  I understand the limitations of AI predictions and will not make medical decisions based
                  solely on this tool
                </label>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onDecline} className="flex-1">
            Decline
          </Button>
          <Button onClick={onAccept} disabled={!canProceed} className="flex-1">
            Accept & Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
