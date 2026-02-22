import React from "react";

interface LoadingOverlayProps {
  message: string;
}

export default function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.45)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        style={{
          background: "var(--ifm-background-color, #fff)",
          borderRadius: 16,
          padding: "40px 48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}
      >
        {/* Spinner */}
        <div
          style={{
            width: 48,
            height: 48,
            border: "4px solid var(--ifm-color-emphasis-300, #ddd)",
            borderTopColor: "var(--ifm-color-primary)",
            borderRadius: "50%",
            animation: "loadingOverlaySpin 0.8s linear infinite",
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 600,
            color: "var(--ifm-font-color-base)",
            textAlign: "center",
          }}
        >
          {message}
        </p>
        <style>{`
          @keyframes loadingOverlaySpin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
