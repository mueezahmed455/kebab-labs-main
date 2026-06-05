import React, { useRef, useState, useEffect } from "react";

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // Divisor limit for rotation angle
  key?: React.Key;
}

export default function ThreeDCard({ children, className = "", intensity = 15 }: ThreeDCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate relative mouse coordinates centered inside card bounds
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Convert to rotational coordinate mapping (rx: tilt vertical, ry: tilt horizontal)
    const ry = (mouseX / (width / 2)) * intensity; 
    const rx = -(mouseY / (height / 2)) * intensity;

    setRotation({ rx, ry });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ rx: 0, ry: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-all duration-300 ease-out ${className}`}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
        transform: isHovered 
          ? `rotateX(${rotation.rx}deg) rotateY(${rotation.ry}deg) scale3d(1.02, 1.02, 1.02)` 
          : "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        boxShadow: isHovered 
          ? "0 25px 50px -12px rgba(132, 204, 22, 0.25), 0 0 40px rgba(132, 204, 22, 0.15)"
          : "0 10px 30px -15px rgba(0, 0, 0, 0.5)"
      }}
    >
      <div 
        style={{ 
          transform: isHovered ? "translateZ(30px)" : "translateZ(0px)",
          transition: "transform 0.3s ease-out",
          transformStyle: "preserve-3d"
        }}
        className="h-full w-full"
      >
        {children}
      </div>
    </div>
  );
}
