import { useState, useEffect } from "react";
import { CheckCircle2, Flame, Truck, Package, Clock } from "lucide-react";

export default function FooterOrderStatusTracker() {
  const [status, setStatus] = useState<"prepping" | "firing" | "transit" | "delivered">("prepping");
  const [progress, setProgress] = useState(0);

  // Simulate progress
  useEffect(() => {
    let timer: number;
    
    const statuses: ("prepping" | "firing" | "transit" | "delivered")[] = ["prepping", "firing", "transit", "delivered"];
    let currentIndex = 0;

    const advanceStatus = () => {
      if (currentIndex >= statuses.length - 1) {
         setStatus("delivered");
         setProgress(100);
         return;
      }
      
      const nextIndex = currentIndex + 1;
      currentIndex = nextIndex;
      setStatus(statuses[nextIndex]);
      setProgress((nextIndex / (statuses.length - 1)) * 100);
      
      timer = window.setTimeout(advanceStatus, Math.random() * 5000 + 4000); 
    };

    timer = window.setTimeout(advanceStatus, Math.random() * 3000 + 2000); 

    return () => clearTimeout(timer);
  }, []);

  const steps = [
    { id: "prepping", icon: Package, label: "Prepping" },
    { id: "firing", icon: Flame, label: "Firing" },
    { id: "transit", icon: Truck, label: "Transit" },
    { id: "delivered", icon: CheckCircle2, label: "Delivered" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full glass-panel bg-white/5 border border-white/10 p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      <div className="flex flex-col pr-4">
        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1.5 font-sans mb-1">
          <Clock className="w-3.5 h-3.5 text-primary animate-pulse" />
          Live Tracking
        </span>
        <span className="text-xs text-primary font-mono tracking-wider font-medium">
          Order #KL-994
        </span>
        <p className="text-[10px] text-gray-500 font-mono tracking-wide mt-1 max-w-[150px]">
          {status === "prepping" && "Assembling."}
          {status === "firing" && "Subjecting to 820°C."}
          {status === "transit" && "Dispatched."}
          {status === "delivered" && "Completed."}
        </p>
      </div>

      <div className="flex-grow w-full max-w-sm relative">
        {/* Progress rail */}
        <div className="absolute top-[12px] left-3 right-3 h-0.5 bg-neutral-800 -translate-y-1/2 rounded-full overflow-hidden">
          <div 
             className="h-full bg-primary transition-all duration-1000 ease-in-out"
             style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between relative px-1">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = progress >= (index / (steps.length - 1)) * 100;
            const isCurrent = status === step.id;
            
            return (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div 
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 z-10 shadow-sm ${
                    isCompleted 
                      ? "bg-primary border-primary text-[var(--app-on-primary)]" 
                      : "bg-[var(--app-bg)] border-neutral-700 text-gray-500"
                  } ${isCurrent ? "shadow-[0_0_10px_color-mix(in_srgb,var(--app-primary)_40%,transparent)] scale-110" : "scale-90"}`}
                >
                  <Icon className={`w-3 h-3 ${isCurrent && !isCompleted && step.id === 'firing' ? "text-orange-500" : ""} ${isCurrent && !isCompleted ? "animate-pulse" : ""}`} />
                </div>
                <span 
                  className={`text-[8px] font-sans uppercase tracking-[0.1em] font-medium ${
                    isCurrent ? "text-primary drop-shadow-sm" : isCompleted ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
