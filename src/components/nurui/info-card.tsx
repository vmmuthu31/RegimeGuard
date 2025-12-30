"use client";
import React, { useRef, useState } from "react";
import "./styles/info-card.css";

function isRTL(text: string) {
  return /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F]/.test(text);
}

export interface InfoCardProps {
  title: string;
  description: string;
  width?: number;
  height?: number;
  borderColor?: string;
  borderBgColor?: string;
  borderWidth?: number;
  borderPadding?: number;
  cardBgColor?: string;
  shadowColor?: string;
  patternColor1?: string;
  patternColor2?: string;
  textColor?: string;
  hoverTextColor?: string;
  fontFamily?: string;
  rtlFontFamily?: string;
  effectBgColor?: string;
  contentPadding?: string;
  icon?: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  width = 388,
  height = 378,
  borderColor = "#10b981",
  borderBgColor = "rgba(16, 185, 129, 0.2)",
  borderWidth = 3,
  borderPadding = 14,
  cardBgColor = "#09090b",
  textColor = "#ffffff",
  hoverTextColor = "#09090b",
  fontFamily = "'Roboto Mono', monospace",
  rtlFontFamily = "'Montserrat', sans-serif",
  effectBgColor = "#10b981",
  contentPadding = "10px 16px",
  icon,
}) => {
  const [hovered, setHovered] = useState(false);
  const borderRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const border = borderRef.current;
    if (!border) return;
    const rect = border.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const angle = Math.atan2(y, x);
    border.style.setProperty("--rotation", `${angle}rad`);
  };

  const rtl = isRTL(title) || isRTL(description);
  const effectiveFont = rtl ? rtlFontFamily : fontFamily;
  const titleDirection = isRTL(title) ? "rtl" : "ltr";
  const descDirection = isRTL(description) ? "rtl" : "ltr";

  const borderGradient = `conic-gradient(from var(--rotation,0deg), ${borderColor} 0deg, ${borderColor} 90deg, ${borderBgColor} 90deg, ${borderBgColor} 360deg)`;

  return (
    <div
      ref={borderRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        if (borderRef.current)
          borderRef.current.style.setProperty("--rotation", "0deg");
      }}
      style={
        {
          width,
          height,
          border: `${borderWidth}px solid transparent`,
          borderRadius: "1em",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          backgroundImage: `linear-gradient(${cardBgColor}, ${cardBgColor}), ${borderGradient}`,
          padding: borderPadding,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          userSelect: "none",
          transition: "box-shadow 0.3s",
          position: "relative",
          fontFamily: effectiveFont,
        } as React.CSSProperties
      }
    >
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: contentPadding,
          minHeight: 0,
        }}
      >
        <h1
          style={{
            fontSize: 21,
            fontWeight: "bold",
            letterSpacing: "-.01em",
            lineHeight: "normal",
            marginBottom: 5,
            color: hovered ? hoverTextColor : textColor,
            transition: "color 0.3s ease",
            position: "relative",
            overflow: "hidden",
            direction: titleDirection,
            width: "auto",
          }}
        >
          <span
            style={{
              position: "relative",
              zIndex: 10,
              padding: "2px 4px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              width: "100%",
              height: "100%",
            }}
          >
            {icon && (
              <span className="mr-2 inline-flex items-center">{icon}</span>
            )}
            {title}
          </span>
          <span
            style={{
              clipPath: hovered
                ? "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
                : "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)",
              transformOrigin: "center",
              transition: "all cubic-bezier(.1,.5,.5,1) 0.4s",
              position: "absolute",
              left: -4,
              right: -4,
              top: -4,
              bottom: -4,
              zIndex: 0,
              backgroundColor: effectBgColor,
            }}
          />
        </h1>
        <p
          style={{
            fontSize: 14,
            color: textColor,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            direction: descDirection,
            marginBottom: 0,
            paddingBottom: 0,
            minHeight: 0,
            textAlign: "center",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};
