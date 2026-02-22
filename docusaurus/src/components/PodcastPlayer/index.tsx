import React, { useState, useRef } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import podcastData from "@site/src/data/podcasts.json";

interface Episode {
  id: string;
  title: string;
  description: string;
  audioUrlEn?: string;
  audioUrlUr?: string;
  durationSeconds: number;
  relatedChapters: string[];
}

interface PodcastPlayerProps {
  episodeId: string;
}

function PlayerInner({ episodeId }: PodcastPlayerProps) {
  const episode = (podcastData as Episode[]).find((e) => e.id === episodeId);
  const [currentLang, setCurrentLang] = useState<"en" | "ur">("en");
  const audioRef = useRef<HTMLAudioElement>(null);

  if (!episode) {
    return (
      <p
        style={{ color: "var(--ifm-color-emphasis-500)", fontStyle: "italic" }}
      >
        Episode not found. Check back soon!
      </p>
    );
  }

  const audioUrl =
    currentLang === "en" ? episode.audioUrlEn : episode.audioUrlUr;
  const minutes = Math.floor(episode.durationSeconds / 60);

  const handleLangSwitch = (lang: "en" | "ur") => {
    setCurrentLang(lang);
    // Reset audio element so it loads the new source
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  };

  return (
    <div
      style={{
        padding: 16,
        border: "1px solid var(--ifm-color-emphasis-200)",
        borderRadius: 8,
        background: "var(--ifm-color-emphasis-100)",
        marginBottom: 8,
      }}
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          className={`button ${currentLang === "en" ? "button--primary" : "button--secondary"} button--sm`}
          onClick={() => handleLangSwitch("en")}
        >
          English
        </button>
        <button
          className={`button ${currentLang === "ur" ? "button--primary" : "button--secondary"} button--sm`}
          onClick={() => handleLangSwitch("ur")}
        >
          اردو
        </button>
        <span
          style={{
            fontSize: 12,
            color: "var(--ifm-color-emphasis-500)",
            alignSelf: "center",
            marginLeft: "auto",
          }}
        >
          {minutes} min
        </span>
      </div>

      {audioUrl ? (
        <audio ref={audioRef} controls style={{ width: "100%" }} key={audioUrl}>
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "var(--ifm-color-emphasis-500)",
          }}
        >
          Audio file not yet available. Check back soon!
        </p>
      )}
    </div>
  );
}

export default function PodcastPlayer(props: PodcastPlayerProps) {
  return (
    <BrowserOnly fallback={<div>Loading podcast player...</div>}>
      {() => <PlayerInner {...props} />}
    </BrowserOnly>
  );
}
