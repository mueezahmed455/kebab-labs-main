import { useState } from "react";
import { Camera, Heart, Eye, Sparkles, AlertCircle, X, Maximize } from "lucide-react";
import ThreeDCard from "./ThreeDCard";

interface GalleryImage {
  id: string;
  imgUrl: string;
  tag: string;
  likes: number;
  comments: number;
  caption: string;
}

export function Instagram3DGrid() {
  const [activePhoto, setActivePhoto] = useState<GalleryImage | null>(null);

  const images: GalleryImage[] = [
    {
      id: "gal-1",
      imgUrl: "https://images.unsplash.com/photo-1529692236671-f1f6e9481b25?auto=format&fit=crop&w=800&q=85",
      tag: "Wagyu Seared",
      likes: 1240,
      comments: 64,
      caption: "A5 grade Wagyu, flash-seared at 800°C on micro binchotan rods. Garnished with wild rosemary."
    },
    {
      id: "gal-2",
      imgUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=85",
      tag: "Molecule Liquid",
      likes: 980,
      comments: 32,
      caption: "Our signature Saffron & Aged-Whiskey molecular cocktail under ambient prism lighting."
    },
    {
      id: "gal-3",
      imgUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=85",
      tag: "Truffle Fries",
      likes: 840,
      comments: 29,
      caption: "Crisp hand-cut rust potatoes tossed with mountain salt crystals and white truffle shaving foam."
    },
    {
      id: "gal-4",
      imgUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=85",
      tag: "Saffron Synthesis",
      likes: 1102,
      comments: 48,
      caption: "Deconstructed Saffron rice panels layered with micro 24K edible gold sheets. Immersive side assets."
    }
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Gallery Header */}
      <div className="flex flex-col items-center justify-center text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <Camera className="w-4.5 h-4.5 text-primary" />
        </div>
        <h3 className="font-display text-2xl sm:text-3xl text-primary font-bold">Artisan Lookbook</h3>
        <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-widest max-w-md mx-auto">
          A visual log of active sensory experiences at Kebab Labs.
        </p>
      </div>

      {/* Grid wrapper */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {images.map((img) => (
          <ThreeDCard
            key={img.id}
            intensity={12}
            className="aspect-square w-full"
          >
            <div
              onClick={() => setActivePhoto(img)}
              className="group h-full w-full relative rounded-xl overflow-hidden glass-card cursor-pointer border border-primary/10 hover:border-primary/45 transition-colors shadow-md"
            >
              <img
                alt={img.tag}
                src={img.imgUrl}
                className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out z-0"
                referrerPolicy="no-referrer"
              />
              {/* Dark glass panel cover showing metrics on hover */}
              <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 z-10">
                <span className="text-[10px] font-bold tracking-widest text-primary uppercase bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-sm">
                  {img.tag}
                </span>
                <div className="flex items-center gap-4 text-xs font-bold text-on-surface mt-1">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-primary fill-primary" />
                    {img.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Maximize className="w-4 h-4 text-on-surface-variant" />
                    View
                  </span>
                </div>
              </div>
            </div>
          </ThreeDCard>
        ))}
      </div>

      {/* Immersive Photo Lightbox Overlay Modal */}
      {activePhoto && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[120] flex items-center justify-center p-4">
          <div className="bg-surface border border-outline-variant/35 rounded-2xl w-full max-w-xl overflow-hidden glass-panel relative shadow-2xl animate-fade-in">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-800/60 border border-outline-variant/20 flex items-center justify-center text-on-surface hover:text-primary hover:bg-neutral-800 transition-all cursor-pointer z-50"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Image Display */}
            <div className="relative aspect-video bg-neutral-950">
              <img
                alt={activePhoto.tag}
                src={activePhoto.imgUrl}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
              
              <span className="absolute bottom-4 left-4 bg-black/80 border border-primary-container/20 text-[9px] font-bold text-primary uppercase tracking-widest px-2.5 py-1 rounded">
                Category Log • {activePhoto.tag}
              </span>
            </div>

            {/* Modal Image Caption stats details */}
            <div className="p-6 sm:p-8 space-y-4">
              <p className="text-xs sm:text-sm text-on-surface leading-relaxed italic">
                "{activePhoto.caption}"
              </p>

              <div className="flex justify-between items-center text-[11px] text-on-surface-variant/60 font-medium pt-2 border-t border-outline-variant/15">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
                    <strong>{activePhoto.likes}</strong> Reactions
                  </span>
                </div>
                <span className="uppercase tracking-wider font-mono text-[9px]">Captured under 800°C Heat Vector</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
