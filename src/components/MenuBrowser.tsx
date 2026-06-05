import React, { useState, useMemo, useEffect } from "react";
import { MenuItem } from "../types";
import { MENU_ITEMS, CATEGORIES, BRAND } from "../data";
import { 
  Plus, Check, Flame, Sparkles, Scale, Thermometer, Search, Sliders, X, 
  Heart, MessageSquare, Volume2, VolumeX, Eye, Info, CheckSquare, Coffee 
} from "lucide-react";
import ThreeDCard from "./ThreeDCard";

interface MenuBrowserProps {
  onAddToCart: (item: MenuItem, notes?: string, selectedSize?: string) => void;
  cartItemIds: Set<string>;
}

export default function MenuBrowser({ onAddToCart, cartItemIds }: MenuBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Kebabs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  // Accessibility parameters
  const [audioGuided, setAudioGuided] = useState<boolean>(() => {
    const saved = localStorage.getItem("kl_audio_guided");
    return saved === "true";
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    const saved = localStorage.getItem("kl_high_contrast");
    return saved === "true";
  });
  const [textScale, setTextScale] = useState<"base" | "large" | "xl">(() => {
    const saved = localStorage.getItem("kl_text_scale");
    return (saved as "base" | "large" | "xl") || "base";
  });
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "halal" | "veg" | "spicy" | "deal">("all");

  // Custom adjustments for modal detail selection
  const [dishNotes, setDishNotes] = useState("");
  const [saltLevel, setSaltLevel] = useState("Balanced Protocol");
  const [doneness, setDoneness] = useState("Artisan Recommendation");
  const [chosenSize, setChosenSize] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("kl_audio_guided", String(audioGuided));
  }, [audioGuided]);

  useEffect(() => {
    localStorage.setItem("kl_high_contrast", String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem("kl_text_scale", textScale);
  }, [textScale]);

  // Voice Speech Synthesizer for accessibility
  const speakText = (text: string) => {
    if (!audioGuided) return;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleOpenDishDetail = (dish: MenuItem) => {
    setSelectedDish(dish);
    setDishNotes("");
    setSaltLevel("Balanced Protocol");
    setDoneness("Artisan Recommendation");
    setChosenSize(dish.sizes && dish.sizes.length > 0 ? dish.sizes[0].l : "");
    speakText(`Opening customization for ${dish.name}. Grade: ${dish.grade || "Prestige quality"}. Price: ${dish.price} pounds.`);
  };

  const handleApplyDishToCart = () => {
    if (!selectedDish) return;
    const finalNotes = `[Temp: ${doneness}] [Seasoning: ${saltLevel}] ${dishNotes}`.trim();
    onAddToCart(selectedDish, finalNotes, chosenSize || undefined);
    speakText(`Added ${selectedDish.name} to checkout protocol!`);
    setSelectedDish(null);
  };

  const handleQuickAdd = (dish: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(dish);
    speakText(`Added ${dish.name} directly to your collection carriage!`);
  };

  // Dynamic filter combining category, search text, and sensory dietary values
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchCategory = item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.grade && item.grade.toLowerCase().includes(searchQuery.toLowerCase()));
      
      let matchDietary = true;
      if (dietaryFilter === "veg") {
        matchDietary = !!item.badge?.toLowerCase().includes("vegetarian") || 
                       item.description.toLowerCase().includes("veg") ||
                       item.description.toLowerCase().includes("potato") ||
                       item.name.toLowerCase().includes("margherita") ||
                       item.name.toLowerCase().includes("veg");
      } else if (dietaryFilter === "spicy") {
        matchDietary = !!item.badge?.toLowerCase().includes("spicy") ||
                       !!item.badge?.toLowerCase().includes("fiery") ||
                       item.description.toLowerCase().includes("chilli") ||
                       item.description.toLowerCase().includes("spicy") ||
                       item.name.toLowerCase().includes("hot") ||
                       item.name.toLowerCase().includes("spicy") ||
                       item.name.toLowerCase().includes("asian");
      } else if (dietaryFilter === "deal") {
        matchDietary = item.category === "Meal Deals" || 
                       item.category === "Sharing Platters" || 
                       !!item.badge?.toLowerCase().includes("deal") || 
                       !!item.badge?.toLowerCase().includes("value") ||
                       !!item.badge?.toLowerCase().includes("serves");
      } else if (dietaryFilter === "halal") {
        // Our entire meat source is Halal formulated
        matchDietary = true;
      }
      
      return matchCategory && matchSearch && matchDietary;
    });
  }, [selectedCategory, searchQuery, dietaryFilter]);

  const activePrice = useMemo(() => {
    if (!selectedDish) return 0;
    if (selectedDish.sizes && chosenSize) {
      const match = selectedDish.sizes.find(s => s.l === chosenSize);
      if (match) return match.p;
    }
    return selectedDish.price;
  }, [selectedDish, chosenSize]);

  // Adjust css styling according to user textScale selection
  const getTextSizeClass = (level: "small" | "normal" | "large") => {
    if (textScale === "large") {
      if (level === "small") return "text-sm";
      if (level === "normal") return "text-base";
      return "text-2xl";
    }
    if (textScale === "xl") {
      if (level === "small") return "text-base";
      if (level === "normal") return "text-lg";
      return "text-3xl";
    }
    // Base defaults
    if (level === "small") return "text-[11px] sm:text-xs";
    if (level === "normal") return "text-xs sm:text-sm";
    return "text-xl sm:text-2xl";
  };

  return (
    <div className={`w-full min-h-screen pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col gap-10 relative z-10 select-none ${
      highContrast ? "bg-[#020202] text-white" : ""
    }`}>
      
      {/* Dynamic 3D Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--app-primary)]/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-block px-2.5 py-0.5 bg-[var(--app-primary)]/10 border border-[var(--app-primary)]/30 text-[var(--app-primary)] text-[9px] font-bold uppercase tracking-widest rounded">
              BURNLEY BB10 TAKEAWAY MENU
            </span>
            <span className="inline-block px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold uppercase tracking-widest rounded">
              100% Halal
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl text-white font-black tracking-tight mt-2 uppercase drop-shadow-md">
            Explore Our Menu
          </h2>
          <p className="font-sans text-sm text-on-surface-variant uppercase tracking-widest font-medium">
            Browse our selection of freshly prepared dishes. Give us a call to order.
          </p>
        </div>

        {/* Global Search Input widget */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search our takeaway menu..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              speakText(`Searching menu for ${e.target.value}`);
            }}
            className={`w-full bg-[#07080f]/75 border rounded-xl py-3 pl-10 pr-10 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-all ${
              highContrast 
                ? "border-white focus:border-[var(--app-accent)]" 
                : "border-[var(--app-primary)]/20 focus:border-[var(--app-primary)] focus:shadow-[0_0_15px_color-mix(in_srgb,var(--app-primary)_20%,transparent)]"
            }`}
          />
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery("");
                speakText("Search cleared");
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white"
              aria-label="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* --- PREMIUM ACCESSIBILITY AND DIETARY CONSOLE --- */}
      <section 
        className={`glass-panel p-6 rounded-2xl border flex flex-col gap-6 shadow-xl select-none ${
          highContrast ? "border-white bg-[#0f0f12]" : "border-[var(--app-primary)]/20 bg-neutral-900/40"
        }`}
        aria-label="Accessibility and Dietary Filters"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/15 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-lg uppercase tracking-wide text-white">
              Menu Filters & Accessibility
            </h3>
          </div>
          <p className="font-sans text-xs text-gray-400 uppercase tracking-widest">
            Customize your viewing experience.
          </p>
        </div>

        {/* Adjustments row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          {/* Audio Output setting */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
              Audio Screen Reader
            </span>
            <button
              onClick={() => {
                const nextVal = !audioGuided;
                setAudioGuided(nextVal);
                if (nextVal) {
                  // Direct demonstration of auditory response
                  setTimeout(() => {
                    if (typeof window !== "undefined" && "speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                      const utter = new SpeechSynthesisUtterance("Audio menu guide is now enabled. Hover or click items below to hear details.");
                      window.speechSynthesis.speak(utter);
                    }
                  }, 100);
                }
              }}
              className={`p-3 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer ${
                audioGuided 
                  ? "bg-[var(--app-primary)]/20 text-[var(--app-primary)] border-[var(--app-primary)]" 
                  : "bg-black/40 border-neutral-700 text-gray-400 hover:border-primary/40 text-left"
              }`}
            >
              <span>{audioGuided ? "Audio ON" : "Audio OFF"}</span>
              {audioGuided ? <Volume2 className="w-4 h-4 text-[var(--app-primary)]" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
            </button>
          </div>

          {/* Contrast Settings */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
              Visual Contrast
            </span>
            <button
              onClick={() => {
                setHighContrast(!highContrast);
                speakText("High contrast mode toggled.");
              }}
              className={`p-3 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer ${
                highContrast 
                  ? "bg-white text-black border-white font-black" 
                  : "bg-black/40 border-neutral-700 text-gray-400 hover:border-primary/40 text-left"
              }`}
            >
              <span>{highContrast ? "High Contrast" : "Standard Theme"}</span>
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Typography Scale selection */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
              Text Size
            </span>
            <div className="grid grid-cols-3 gap-1.5 bg-black/50 p-1 border border-neutral-700 rounded-lg">
              {(["base", "large", "xl"] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => {
                    setTextScale(sz);
                    speakText(`Text size updated`);
                  }}
                  className={`py-2 text-[10px] font-bold uppercase tracking-tight rounded transition-all cursor-pointer ${
                    textScale === sz 
                      ? "bg-[var(--app-primary)] text-black font-black" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {sz === "base" ? "Normal" : sz === "large" ? "Large" : "Extra"}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Dietary and Fast Filtration Bar */}
        <div className="border-t border-outline-variant/15 pt-4 flex flex-col gap-3">
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest block">
            Dietary Filters
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "Show All" },
              { id: "halal", label: "100% Halal" },
              { id: "veg", label: "Vegetarian" },
              { id: "spicy", label: "Spicy 🌶️" },
              { id: "deal", label: "Meal Deals" },
            ].map((diet) => (
              <button
                key={diet.id}
                onClick={() => {
                  setDietaryFilter(diet.id as any);
                  speakText(`Applying ${diet.label} filter`);
                }}
                className={`px-4 py-2 border text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all duration-200 cursor-pointer ${
                  dietaryFilter === diet.id
                    ? "bg-[var(--app-primary)]/20 border-[var(--app-primary)] text-[var(--app-primary)]"
                    : "bg-black/30 border-neutral-700 text-gray-400 hover:border-[var(--app-primary)]/40 hover:text-white"
                }`}
              >
                {diet.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- HORIZONTAL CATEGORY MATRIX SELECTORS --- */}
      <nav 
        className="overflow-x-auto no-scrollbar py-3.5 -my-2 flex gap-3 min-w-full select-none snap-x scroll-smooth z-10"
        aria-label="Menu Categories Navigation"
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.name;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.name);
                setSearchQuery("");
                speakText(`Entering ${cat.name} takeaway category.`);
              }}
              className={`px-6 py-4 font-bold text-xs uppercase tracking-[0.12em] rounded-xl border transition-all duration-300 cursor-pointer flex items-center gap-2 shrink-0 snap-start select-none ${
                isActive
                  ? highContrast 
                    ? "bg-white text-black border-4 border-primary font-black scale-105"
                    : "bg-[var(--app-primary)] text-[#07080f] border-[var(--app-accent)] shadow-[0_4px_20px_color-mix(in_srgb,var(--app-primary)_35%,transparent)] scale-105"
                  : "bg-[#0c0d15]/65 text-on-surface-variant border-outline-variant/15 hover:border-[var(--app-primary)]/40 hover:text-[var(--app-primary)] hover:bg-[#0c0d15]/95"
              }`}
            >
              <span className="text-base" aria-hidden="true">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </nav>

      {/* --- GRID LAYOUT OF INTERACTIVE 3D CARDS --- */}
      {filteredItems.length === 0 ? (
        <div className="glass-panel text-center py-20 rounded-2xl border border-outline-variant/10">
          <Coffee className="w-12 h-12 text-primary-container/30 mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-bold text-on-surface uppercase tracking-wider font-display">No Matches Under Active Filters</h3>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-2 max-w-sm mx-auto leading-relaxed">
            Adjust search keys or dietary parameters. All tandoor products are made fresh from BB10.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {filteredItems.map((dish, idx) => {
            const isFeatured = idx % 3 === 0; // Create an asymmetrical layout (feature every 3rd item)
            const isAdded = cartItemIds.has(dish.id);

            return (
              <ThreeDCard
                key={dish.id}
                className={`w-full ${isFeatured ? "md:col-span-8" : "md:col-span-4"}`}
                intensity={8}
              >
                <article
                  tabIndex={0}
                  onKeyPress={(e) => { if (e.key === 'Enter') handleOpenDishDetail(dish); }}
                  onClick={() => handleOpenDishDetail(dish)}
                  className={`glass-card rounded-2xl overflow-hidden flex flex-col group relative h-full border hover:shadow-[0_0_25px_color-mix(in_srgb,var(--app-primary)_15%,transparent)] transition-all cursor-pointer ${
                    highContrast 
                      ? "border-2 border-white bg-[#0f0f12] text-white" 
                      : "border-[var(--app-primary)]/10 hover:border-[var(--app-primary)]/40 bg-[#0d0e17]/85"
                  } ${isFeatured ? "md:flex-row" : ""}`}
                >
                  {/* Image Section */}
                  <div
                    className={`relative bg-neutral-950 overflow-hidden shrink-0 ${
                      isFeatured ? "w-full md:w-1/2 h-64 md:h-full min-h-[260px]" : "w-full h-56"
                    }`}
                  >
                    <img
                      alt={dish.altText || dish.name}
                      src={dish.imgUrl}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-all duration-700 ease-out z-0 opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    {/* Subtle vignette gradient cover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent z-1 pointer-events-none" />

                    {/* Left corner status identifiers */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      {dish.grade && (
                        <span className="bg-black/80 backdrop-blur-md border border-[var(--app-primary)]/30 text-[9px] font-black text-[var(--app-primary)] uppercase tracking-widest px-2.5 py-1 rounded">
                          {dish.grade}
                        </span>
                      )}
                      {dish.temp && (
                        <span className="bg-[#ef4444]/15 backdrop-blur-md border border-red-500/30 text-[9px] font-black text-red-400 uppercase tracking-widest px-2.5 py-1 rounded flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5 text-red-400 animate-pulse" />
                          {dish.temp}
                        </span>
                      )}
                    </div>

                    {/* Popular / Best Seller indicator */}
                    {dish.badge && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="bg-primary text-on-primary text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded shadow-lg animate-pulse">
                          {dish.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Details */}
                  <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow relative z-10 bg-[#07080f]/50">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className={`font-display font-semibold text-on-surface group-hover:text-primary transition-colors leading-tight ${getTextSizeClass("large")}`}>
                          {dish.name}
                        </h3>
                        <span className="font-sans font-extrabold text-primary shrink-0 text-base sm:text-lg">
                          £{dish.price.toFixed(2)}
                        </span>
                      </div>

                      <p className={`font-sans text-on-surface-variant/80 leading-relaxed ${getTextSizeClass("normal")}`}>
                        {dish.description}
                      </p>

                      {dish.calories && (
                        <div className="flex items-center gap-1.5 text-[10px] text-[var(--app-accent)]/70 uppercase tracking-widest font-black pt-1">
                          <Scale className="w-3.5 h-3.5 text-primary" />
                          <span>Standard Calories: {dish.calories} Kcal</span>
                        </div>
                      )}
                    </div>

                    {/* Interactive 3D Action Strip */}
                    <div className="mt-8 flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDishDetail(dish);
                        }}
                        className="px-4.5 py-3 hover:bg-neutral-800/80 border border-outline-variant/30 hover:border-primary/40 rounded-xl text-[10px] font-bold text-on-surface-variant hover:text-primary uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                        aria-label={`Adjust variables for ${dish.name}`}
                      >
                        <Sliders className="w-4 h-4 text-primary" />
                        <span>Parameters</span>
                      </button>

                      <button
                        onClick={(e) => {
                          if (dish.sizes && dish.sizes.length > 0) {
                            e.stopPropagation();
                            handleOpenDishDetail(dish);
                          } else {
                            handleQuickAdd(dish, e);
                          }
                        }}
                        className={`flex-grow py-3 px-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                          isAdded
                            ? "bg-primary-container/20 border border-primary-container/40 text-primary"
                            : "bg-[var(--app-primary)]/10 border border-[var(--app-primary)]/20 text-primary hover:bg-[var(--app-primary)] hover:text-[#07080f] hover:shadow-[0_0_20px_color-mix(in_srgb,var(--app-primary)_30%,transparent)]"
                        }`}
                        aria-label={`Add ${dish.name} to order progress`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>ADDED</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>SELECT EXTRA</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              </ThreeDCard>
            );
          })}
        </div>
      )}

      {/* --- DETAILED CUSTOMIZATION MODAL WITH AUDIO READOUTS --- */}
      {selectedDish && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-110 flex items-center justify-center p-4">
          <div 
            className={`border rounded-2xl w-full max-w-2xl overflow-hidden relative shadow-2xl animate-fade-in flex flex-col md:flex-row h-auto max-h-[90vh] ${
              highContrast ? "border-white bg-[#0a0a0d]" : "border-[var(--app-primary)]/20 bg-[#07080f]"
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dish-detail-title"
          >
            {/* Left Column - Beautiful Large Product Vector/Image */}
            <div className="w-full md:w-1/2 h-44 md:h-auto min-h-[250px] relative bg-neutral-950">
              <img
                alt={selectedDish.altText || selectedDish.name}
                src={selectedDish.imgUrl}
                className="w-full h-full object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background via-transparent to-transparent pointer-events-none" />
              
              {/* Floating status badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-black/90 px-2.5 py-1 text-[9px] font-bold tracking-widest text-primary uppercase rounded border border-primary/20">
                  {selectedDish.grade || "Connoisseur Choice"}
                </span>
                <span className="bg-black/90 px-2.5 py-1 text-[9px] font-bold tracking-widest text-error uppercase rounded flex items-center gap-1 border border-error/20">
                  <Thermometer className="w-3 h-3 text-[#f43f5e]" />
                  {selectedDish.temp || "Heated Embers"}
                </span>
              </div>
            </div>

            {/* Right Column - Parameters tuning */}
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between overflow-y-auto">
              <button 
                onClick={() => {
                  setSelectedDish(null);
                  speakText("Customization panel closed");
                }}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-800/60 border border-outline-variant/20 flex items-center justify-center text-on-surface hover:text-[var(--app-primary)] hover:bg-neutral-800 transition-all cursor-pointer"
                aria-label="Close custom order configurations"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <h3 id="dish-detail-title" className="font-display text-2.5xl text-primary font-bold tracking-tight">
                    {selectedDish.name}
                  </h3>
                  <p className="text-[10px] text-on-surface-variant/80 uppercase tracking-widest font-bold mt-1">
                    {selectedDish.category} • Total £{activePrice.toFixed(2)}
                  </p>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {selectedDish.description}
                </p>

                {/* Sizing Toggles (If available) */}
                {selectedDish.sizes && selectedDish.sizes.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--app-primary)] uppercase tracking-widest block">
                      Size Calibration
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedDish.sizes.map((sz) => (
                        <button
                          key={sz.l}
                          type="button"
                          onClick={() => {
                            setChosenSize(sz.l);
                            speakText(`Size selected: ${sz.l}. Adjusted price: ${sz.p} pounds.`);
                          }}
                          className={`py-2 px-1.5 text-xs font-bold uppercase tracking-wider rounded border text-center transition-all cursor-pointer ${
                            chosenSize === sz.l
                              ? "bg-primary/25 border-primary text-primary"
                              : "bg-[#07080f]/50 border-outline-variant/30 text-on-surface-variant hover:border-primary/45"
                          }`}
                        >
                          <span className="block text-[11px] font-display tracking-wider">{sz.l}</span>
                          <span className="block text-[9px] text-[var(--app-accent)] font-mono font-bold">£{sz.p.toFixed(2)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Doneness thermal adjustments */}
                {selectedDish.category === "Kebabs" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--app-primary)] uppercase tracking-widest block">
                      Thermal Oven Sear Doneness
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Seared Warm", "Artisan Recommendation", "Crisp Crust Coating"].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => {
                            setDoneness(level);
                            speakText(`Sear set to ${level}`);
                          }}
                          className={`py-2 px-1 text-[9px] font-bold uppercase tracking-wider rounded border text-center transition-all cursor-pointer ${
                            doneness === level
                              ? "bg-primary/20 border-primary text-primary"
                              : "bg-neutral-900/40 border-outline-variant/30 text-on-surface-variant hover:border-primary/40"
                          }`}
                        >
                          {level === "Artisan Recommendation" ? "ARTISAN REC" : level}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seasoning Infusion parameters */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--app-primary)] uppercase tracking-widest block">
                    Salt Minerals Infusion Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Low Sodium", "Balanced Protocol", "Double Crystals"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSaltLevel(opt);
                          speakText(`Seasoning level of salt set to ${opt}`);
                        }}
                        className={`py-2 px-1 text-[9px] font-bold uppercase tracking-wider rounded border text-center transition-all cursor-pointer ${
                          saltLevel === opt
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-neutral-900/40 border-outline-variant/30 text-on-surface-variant hover:border-primary/40"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personal Notes input text box for allergies/extra options */}
                <div className="space-y-2" tabIndex={0} aria-label="Bespoke instructions input area">
                  <label className="text-[10px] font-black text-[var(--app-primary)] uppercase tracking-widest block">
                    Bespoke Takeaway Instructions
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-4.5 h-4.5 text-on-surface-variant/40 absolute left-3 top-3" />
                    <textarea
                      rows={2}
                      placeholder="Specify absolute instructions (allergies, no sauce, etc.)"
                      value={dishNotes}
                      onChange={(e) => setDishNotes(e.target.value)}
                      className="w-full bg-[#07080f] border border-outline-variant/30 rounded-lg p-3 pl-10 text-xs text-on-surface placeholder:text-on-surface-variant/45 focus:outline-none focus:border-primary/60 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Confirm adding customized dish to carriage */}
              <div className="mt-8">
                <button
                  type="button"
                  onClick={handleApplyDishToCart}
                  className="w-full gold-button py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-on-primary animate-pulse" />
                  <span>Verify Specs & Add Box</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
