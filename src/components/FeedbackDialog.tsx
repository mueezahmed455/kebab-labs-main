import React from "react";
import { useState } from "react";
import { Star, X, Send, Sparkles } from "lucide-react";

interface FeedbackDialogProps {
  transactionId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export default function FeedbackDialog({ transactionId, isOpen, onClose, onSubmit }: FeedbackDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network delay
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(rating, comment);
      onClose();
      // Reset state for future dialogs
      setRating(0);
      setComment("");
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#050505]/80 backdrop-blur-sm">
      <div 
        className="glass-panel w-full max-w-md p-6 sm:p-8 rounded-2xl border border-primary/20 shadow-[0_0_50px_color-mix(in_srgb,var(--app-primary)_15%,transparent)] relative transform transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-labelledby="feedback-dialog-title"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded font-bold uppercase tracking-widest inline-block font-sans">
              Transaction Evaluation
            </span>
            <h2 id="feedback-dialog-title" className="font-display text-2xl text-white font-bold tracking-tight uppercase">
              Rate Order <span className="text-primary">{transactionId}</span>
            </h2>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-sans">
              Please calibrate your thermal and flavor feedback below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star 
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating) 
                        ? "fill-primary text-primary drop-shadow-[0_0_12px_color-mix(in_srgb,var(--app-primary)_60%,transparent)]" 
                        : "text-neutral-700"
                    }`} 
                  />
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label htmlFor="feedback-comment" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest font-sans">
                Dietary Synthesis Report (Optional)
              </label>
              <textarea
                id="feedback-comment"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the Maillard crust? Structural integrity of the kebab?"
                className="w-full bg-neutral-900/60 border border-neutral-700/50 rounded-xl p-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="w-full py-3.5 rounded-xl gold-button flex justify-center items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-black" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Telemetry</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
