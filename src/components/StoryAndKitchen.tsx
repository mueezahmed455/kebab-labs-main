import { Flame, Compass, Users, Clock, Leaf, Shield, BadgeAlert } from "lucide-react";

export default function StoryAndKitchen() {
  return (
    <div className="w-full min-h-screen pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col gap-16 select-none relative z-10">
      
      {/* Narrative Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.2em] text-primary uppercase inline-block">
          Culinary Philosophy
        </span>
        <h2 className="font-display text-4xl sm:text-6xl font-black leading-tight text-white drop-shadow-lg tracking-tight uppercase">
          Precision Heat. Sacred Craft.
        </h2>
        <p className="font-sans text-sm text-on-surface-variant uppercase tracking-[0.15em] font-medium mt-2">
          Inside the kitchen of The Kebab Lab.
        </p>
      </div>

      {/* Main Grid: Visuals and Story text */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Editorial Columns */}
        <div className="col-span-1 lg:col-span-6 space-y-6 text-on-surface-variant leading-relaxed text-sm lg:text-base">
          <p className="font-display text-2xl text-primary font-bold leading-relaxed tracking-wide">
            "We do not simply grill meat; we engineer precise flavor profiles through uncompromising heat control."
          </p>
          <p className="text-gray-300">
            Founded with a passion for elevated fast food, <strong>The Kebab Lab</strong> represents a modern approach to Mediterranean smoke and fire cookery. We replace guest assumptions with precise standards—calibrating heat, moisture, and marinades down to the detail.
          </p>
          <p className="text-gray-300">
            By sourcing only authentic heritage cuts and exposing them to high temperatures over natural charcoal, we lock in delicate, savory juices. This creates an unparalleled dining experience right here in Burnley.
          </p>

          {/* Operational metrics/counters */}
          <div className="grid grid-cols-3 gap-4 pt-6 text-center">
            <div className="p-4 bg-neutral-900/60 rounded-xl border border-outline-variant/20 shadow-md">
              <span className="block font-display text-3xl sm:text-4xl font-bold text-primary">820°C</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold block mt-1">Searing Temp</span>
            </div>
            <div className="p-4 bg-neutral-900/60 rounded-xl border border-outline-variant/20 shadow-md">
              <span className="block font-display text-3xl sm:text-4xl font-bold text-primary">48H</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold block mt-1">Dough Proof</span>
            </div>
            <div className="p-4 bg-neutral-900/60 rounded-xl border border-outline-variant/20 shadow-md">
              <span className="block font-display text-3xl sm:text-4xl font-bold text-primary">100%</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold block mt-1">Authentic</span>
            </div>
          </div>
        </div>

        {/* Right Side: Editorial Image Layout */}
        <div className="col-span-1 lg:col-span-6 relative">
          <div className="glass-card rounded-2xl overflow-hidden aspect-video relative max-w-lg mx-auto shadow-2xl">
            <img 
              alt="Artisan cooking skewered cubes"
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=85"
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Culinary Protocols Grid Section */}
      <div className="space-y-8 pt-8 border-t border-outline-variant/20">
        <h3 className="font-display text-3xl tracking-wide text-white text-center lg:text-left font-black uppercase">
          Kitchen Protocols
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Searing section */}
          <div className="glass-panel p-8 rounded-xl border border-outline-variant/20 space-y-4 shadow-lg">
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">Live Fire Cooking</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Exposing skewers briefly to 820°C on natural charcoal. This thermal shock crystalizes outer surfaces, achieving optimal caramelized crusts and locking in flavor.
            </p>
          </div>

          {/* Saffron infusion section */}
          <div className="glass-panel p-8 rounded-xl border border-outline-variant/20 space-y-4 shadow-lg">
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Compass className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">Signature Marinades</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Our poultry is deeply marinated for 24 hours, infused with complex spices. This renders the proteins remarkably tender and incredibly responsive to fire.
            </p>
          </div>

          {/* Organic values of herbs */}
          <div className="glass-panel p-8 rounded-xl border border-outline-variant/20 space-y-4 shadow-lg">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Leaf className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">Fresh Ingredients</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Fresh produce, high-grade meats, and carefully selected garnishes are sourced purely to deliver an uncompromising finish to every dish.
            </p>
          </div>
        </div>
      </div>

      {/* Team Profile Bios Section */}
      <div className="space-y-8 pt-8 border-t border-outline-variant/20">
        <div className="text-center md:text-left">
          <h3 className="font-display text-3xl text-white font-black uppercase tracking-wide">The Kitchen Team</h3>
          <p className="text-sm text-gray-400 mt-2 uppercase tracking-wider font-medium">
            The uncompromised minds directing our physical operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-xl bg-neutral-900/60 border border-outline-variant/20 flex flex-col sm:flex-row gap-6 items-center shadow-lg hover:border-primary/30 transition-colors">
            <div className="w-28 h-28 rounded-full bg-neutral-800 shrink-0 border-2 border-primary/20 overflow-hidden relative shadow-[0_0_15px_rgba(132,204,22,0.15)]">
              <img 
                alt="Chef biography portrait Alexis Sterling" 
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&h=300&q=85"
                className="w-full h-full object-cover scale-110 opacity-95"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-3 text-center sm:text-left">
              <h4 className="font-display text-2xl text-primary font-bold">Chef Alexis Sterling</h4>
              <span className="text-[10px] text-gray-300 uppercase tracking-widest block font-bold bg-neutral-800 border border-neutral-700 px-3 py-1 rounded inline-block">Head Chef</span>
              <p className="text-sm text-gray-400 leading-relaxed">
                Alexis brings vigorous standards and high-end culinary execution methods to Mediterranean street food classics.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-xl bg-neutral-900/60 border border-outline-variant/20 flex flex-col sm:flex-row gap-6 items-center shadow-lg hover:border-primary/30 transition-colors">
            <div className="w-28 h-28 rounded-full bg-neutral-800 shrink-0 border-2 border-primary/20 overflow-hidden relative shadow-[0_0_15px_rgba(132,204,22,0.15)]">
              <img 
                alt="Chef biography portrait Marcus Drake" 
                src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=300&h=300&q=85"
                className="w-full h-full object-cover scale-110 opacity-95"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-3 text-center sm:text-left">
              <h4 className="font-display text-2xl text-primary font-bold">Marcus Drake</h4>
              <span className="text-[10px] text-gray-300 uppercase tracking-widest block font-bold bg-neutral-800 border border-neutral-700 px-3 py-1 rounded inline-block">Grill Master</span>
              <p className="text-sm text-gray-400 leading-relaxed">
                Educated in traditional Levant flame techniques, Marcus guides our natural charcoal heating sections with absolute precision.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
