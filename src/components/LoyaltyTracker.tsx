import { Trophy, Gift, ArrowRight, Lock, Unlock, Star } from "lucide-react";

export default function LoyaltyTracker() {
  const currentPoints = 450;
  const nextTierPoints = 500;
  const progress = (currentPoints / nextTierPoints) * 100;

  const tiers = [
    { name: "Bronze", pts: 0, rewards: "Base Perks", color: "text-[#cd7f32]", border: "border-[#cd7f32]" },
    { name: "Silver", pts: 150, rewards: "Secret Menu", color: "text-gray-400", border: "border-gray-400" },
    { name: "Gold", pts: 300, rewards: "Priority Prep", color: "text-yellow-500", border: "border-yellow-500" },
    { name: "Platinum", pts: 500, rewards: "Free Payload", color: "text-cyan-400", border: "border-cyan-400" },
  ];

  return (
    <div className="bg-neutral-900/40 p-4 rounded-lg border border-primary/20 space-y-5">
      <div className="flex justify-between items-center">
        <span className="text-[9px] text-primary uppercase tracking-widest font-bold flex items-center gap-1.5">
          <Trophy className="w-3 h-3" />
          Loyalty Matrix
        </span>
        <span className="text-[10px] text-yellow-500 font-mono font-bold bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
          Gold Rank
        </span>
      </div>

      <div className="flex items-end gap-2">
        <span className="font-display text-4xl text-white font-black leading-none drop-shadow-md">{currentPoints}</span>
        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest pb-1">/ {nextTierPoints} PTS</span>
      </div>

      <div className="space-y-1.5">
        <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(132,204,22,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">
          <span>Current</span>
          <span>50 pts to Platinum Payload</span>
        </div>
      </div>

      {/* Tiers Breakdown */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        {tiers.map((tier, index) => {
          const isUnlocked = currentPoints >= tier.pts;
          const isNext = !isUnlocked && currentPoints < tier.pts && (index === 0 || currentPoints >= tiers[index - 1].pts);
          
          return (
            <div key={tier.name} className={`flex items-center justify-between p-2 rounded bg-black/20 border-l-2 ${isUnlocked ? tier.border : 'border-neutral-800'} ${isNext ? 'bg-primary/5' : ''}`}>
              <div className="flex items-center gap-2">
                {isUnlocked ? (
                  <Unlock className={`w-3.5 h-3.5 ${tier.color}`} />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-neutral-600" />
                )}
                <div className="flex flex-col">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isUnlocked ? tier.color : 'text-neutral-500'}`}>
                    {tier.name}
                  </span>
                  <span className="text-[8px] text-gray-500 uppercase tracking-wider">{tier.rewards}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono">
                {isUnlocked ? (
                  <span className="text-emerald-400 tracking-wider">UNLOCKED</span>
                ) : (
                  <span className="text-neutral-600">{tier.pts} PTS</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/20 hover:border-primary/40 transition-colors">
        <Gift className="w-3.5 h-3.5" />
        <span>View Rewards Catalog</span>
        <ArrowRight className="w-3 h-3 opacity-50" />
      </button>
    </div>
  );
}
