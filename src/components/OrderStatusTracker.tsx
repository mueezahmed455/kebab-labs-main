import { useState, useEffect } from "react";
import { CheckCircle2, Flame, Truck, Package, Clock } from "lucide-react";

interface OrderStatusTrackerProps {
  // Can extend in the future
}

export default function OrderStatusTracker({}: OrderStatusTrackerProps) {
  const [status, setStatus] = useState<"prepping" | "firing" | "transit" | "delivered">("prepping");
  const [progress, setProgress] = useState(0);

  // Simulate progress
  useEffect(() => {
    let timer: number;
    
    // Quick simulation for the sake of the demo
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
      
      // Randomize timing between 4 to 9 seconds per stage for realistic simulation
      timer = window.setTimeout(advanceStatus, Math.random() * 5000 + 4000); 
    };

    // Initial delay
    timer = window.setTimeout(advanceStatus, Math.random() * 3000 + 2000); 

    return () => clearTimeout(timer);
  }, []);

  const steps = [
    { id: "prepping", icon: Package, label: "Oven Prepping" },
    { id: "firing", icon: Flame, label: "Firing" },
    { id: "transit", icon: Truck, label: "In Transit" },
    { id: "delivered", icon: CheckCircle2, label: "Delivered" },
  ];

  return (
    <div className="glass-panel p-4 rounded-lg border border-primary/20 space-y-4 relative overflow-hidden shadow-inner">
      {/* Background glow based on status */}
      <div 
        className={`absolute inset-0 opacity-[0.03] transition-colors duration-1000 ${
           status === 'prepping' ? 'bg-blue-500' :
           status === 'firing' ? 'bg-orange-500 animate-pulse' :
           status === 'transit' ? 'bg-primary' :
           'bg-primary'
        }`}
      />
      
      <div className="relative z-10 flex justify-between items-center">
        <span className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold flex items-center gap-1.5 font-sans">
          <Clock className="w-3 h-3 text-primary animate-pulse" />
          Active Transaction Tracker
        </span>
        <span className="text-[10px] text-primary font-mono bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
          TX-CURRENT
        </span>
      </div>

      <div className="relative z-10 pt-3 pb-1">
        {/* Progress rail */}
        <div className="absolute top-[22px] left-4 right-4 h-1 bg-neutral-800 -translate-y-1/2 rounded-full overflow-hidden">
          <div 
             className="h-full bg-primary transition-all duration-1000 ease-in-out"
             style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = progress >= (index / (steps.length - 1)) * 100;
            const isCurrent = status === step.id;
            
            return (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div 
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 z-10 shadow-sm ${
                    isCompleted 
                      ? "bg-primary border-primary text-[var(--app-on-primary)]" 
                      : "bg-[var(--app-bg)] border-neutral-700 text-gray-500"
                  } ${isCurrent ? "shadow-[0_0_15px_color-mix(in_srgb,var(--app-primary)_40%,transparent)] scale-110" : ""}`}
                >
                  <Icon className={`w-4 h-4 ${isCurrent && !isCompleted && step.id === 'firing' ? "text-orange-500" : ""} ${isCurrent && !isCompleted ? "animate-pulse" : ""}`} />
                </div>
                <span 
                  className={`text-[8px] font-sans uppercase tracking-[0.2em] font-medium ${
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
      
      {/* Detail description of current stage */}
      <div className="relative z-10 mt-2 text-center border-t border-white/5 pt-2">
        <p className="text-[10px] text-gray-400 font-mono tracking-wider">
          {status === "prepping" && "Marinating and assembling ingredients..."}
          {status === "firing" && "Subjecting to 820°C clay oven thermal event..."}
          {status === "transit" && "Dispatched for localized coordination..."}
          {status === "delivered" && "Transaction complete. Enjoy the formula."}
        </p>
      </div>
    </div>
  );
}
