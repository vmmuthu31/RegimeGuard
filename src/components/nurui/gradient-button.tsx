import { cn } from "@/src/lib/utils";
import React, { CSSProperties } from "react";
import "./styles/gradient-button.css";

interface GradientButtonProps {
  borderWidth?: number;
  colors?: string[];
  duration?: number;
  borderRadius?: number;
  blur?: number;
  className?: string;
  bgColor?: string;
  text?: string;
  onClick?: () => void;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  borderWidth = 2,
  colors = [
    "#10b981", // Emerald-500
    "#34d399", // Emerald-400
    "#059669", // Emerald-600
    "#06b6d4", // Cyan-500
    "#10b981", // Emerald-500
  ],
  duration = 3000,
  borderRadius = 9999, // Pill shaped by default for this theme
  blur = 6,
  className,
  bgColor = "#09090b", // Match zinc-950
  text = "Start Trading",
  onClick,
}) => {
  const gradientStyle = {
    "--allColors": colors.join(", "),
    "--duration": `${duration}ms`,
    "--borderWidth": `${borderWidth}px`,
    "--borderRadius": `${borderRadius}px`,
    "--blur": `${blur}px`,
    "--bgColor": bgColor,
  } as CSSProperties;

  return (
    <div className="inline-block">
      <button
        onClick={onClick}
        style={gradientStyle}
        className={cn(
          "relative flex items-center justify-center min-w-28 min-h-10 overflow-hidden rainbow-btn before:absolute before:-inset-[200%] animate-rainbow cursor-pointer",
          className,
        )}
      >
        <span className="text-white btn-content inline-flex w-full h-full items-center justify-center px-4 py-2">
          {text}
        </span>
      </button>
    </div>
  );
};

export default GradientButton;
