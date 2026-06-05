import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";

const SHAPES = [
  { id:1, x:8, y:15, size:80, rot:45, color:"rgba(197,160,89,0.08)", type:"diamond", delay:0, dur:18 },
  { id:2, x:85, y:25, size:120, rot:0, color:"rgba(197,160,89,0.05)", type:"ring", delay:200, dur:22 },
  { id:3, x:15, y:70, size:60, rot:30, color:"rgba(239,68,68,0.06)", type:"triangle", delay:400, dur:16 },
  { id:4, x:75, y:65, size:100, rot:15, color:"rgba(197,160,89,0.04)", type:"circle", delay:600, dur:20 },
  { id:5, x:50, y:10, size:50, rot:60, color:"rgba(249,115,22,0.06)", type:"diamond", delay:800, dur:15 },
  { id:6, x:30, y:45, size:90, rot:0, color:"rgba(197,160,89,0.03)", type:"ring", delay:1000, dur:25 },
  { id:7, x:90, y:80, size:70, rot:45, color:"rgba(16,185,129,0.05)", type:"diamond", delay:1200, dur:19 },
  { id:8, x:60, y:85, size:55, rot:20, color:"rgba(197,160,89,0.06)", type:"triangle", delay:300, dur:17 },
];

export default function HeroVisuals3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const shapeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const skewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    shapeRefs.current.forEach((el, i) => {
      if (!el) return;
      const shape = SHAPES[i];
      animate(el, {
        translateY: [0, -30 - Math.random() * 20, 0],
        translateX: [0, (Math.random() - 0.5) * 20, 0],
        rotate: [shape.rot, shape.rot + 360],
        scale: [1, 1.1, 1],
        duration: shape.dur * 1000,
        easing: "easeInOutSine",
        loop: true,
        delay: shape.delay,
      });
    });

    if (skewerRef.current) {
      animate(skewerRef.current, {
        rotateY: [0, 360],
        duration: 20000,
        easing: "linear",
        loop: true,
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
    >
      {SHAPES.map((shape, i) => (
        <div
          key={shape.id}
          ref={(el) => { shapeRefs.current[i] = el; }}
          className="absolute will-change-transform"
          style={{
            left: shape.x + "%",
            top: shape.y + "%",
            width: shape.size,
            height: shape.size,
            transform: "translate(-50%, -50%) translateX(" + mousePos.x * (10 + i * 3) + "px) translateY(" + mousePos.y * (10 + i * 3) + "px)",
            transition: "transform 0.3s ease-out",
          }}
        >
          {shape.type === "diamond" && (
            <div className="w-full h-full border-2" style={{ borderColor: shape.color, background: shape.color, transform: "rotate(" + shape.rot + "deg)", borderRadius: "4px" }} />
          )}
          {shape.type === "ring" && (
            <div className="w-full h-full rounded-full border-2" style={{ borderColor: shape.color }} />
          )}
          {shape.type === "circle" && (
            <div className="w-full h-full rounded-full" style={{ background: shape.color }} />
          )}
          {shape.type === "triangle" && (
            <div className="w-full h-full" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", background: shape.color }} />
          )}
        </div>
      ))}

      <div
        ref={skewerRef}
        className="absolute"
        style={{
          right: "5%", top: "20%", width: "4px", height: "300px",
          background: "linear-gradient(to bottom, rgba(197,160,89,0.6), rgba(197,160,89,0.1))",
          borderRadius: "2px", transformStyle: "preserve-3d",
          boxShadow: "0 0 20px rgba(197,160,89,0.15)",
          transform: "translateX(" + mousePos.x * 15 + "px) translateY(" + mousePos.y * 10 + "px)",
          transition: "transform 0.4s ease-out",
        }}
      >
        {[0,1,2,3,4].map((i) => (
          <div key={i} className="absolute rounded-full" style={{
            top: (20 + i * 55) + "px", left: "50%",
            transform: "translateX(-50%) rotateY(" + (i * 72) + "deg)",
            width: 24 - i * 2, height: 24 - i * 2,
            background: "radial-gradient(circle, rgba(197,160,89,0.4), rgba(197,160,89,0.1))",
            border: "1px solid rgba(197,160,89,0.3)",
            boxShadow: "0 0 10px rgba(197,160,89,0.1)",
          }} />
        ))}
      </div>

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(rgba(197,160,89,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(197,160,89,0.4) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          transform: "translate(" + mousePos.x * 5 + "px, " + mousePos.y * 5 + "px)",
          transition: "transform 0.6s ease-out",
        }}
      />

      <div
        className="absolute rounded-full will-change-transform"
        style={{
          width: 300, height: 300,
          left: "calc(50% + " + mousePos.x * 100 + "px)",
          top: "calc(50% + " + mousePos.y * 100 + "px)",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(197,160,89,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
          transition: "left 0.5s ease-out, top 0.5s ease-out",
        }}
      />
    </div>
  );
}
