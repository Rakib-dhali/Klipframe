
import { useState, useRef } from "react";
import type { IThumbnail } from "../types";

// ─── Constants ────────────────────────────────────────────────────────────────

const COLOR_SCHEMES: {
  label: string;
  value: IThumbnail["color_scheme"];
  from: string;
  to: string;
}[] = [
  { label: "Vibrant",     value: "vibrant",     from: "#00C9A7", to: "#FF6B6B" },
  { label: "Sunset",      value: "sunset",       from: "#FF4E50", to: "#F9D423" },
  { label: "Ocean",       value: "ocean",        from: "#2193b0", to: "#6dd5ed" },
  { label: "Forest",      value: "forest",       from: "#134E5E", to: "#71B280" },
  { label: "Neon",        value: "neon",         from: "#F9F002", to: "#FF2D78" },
  { label: "Purple",      value: "purple",       from: "#C471ED", to: "#F64F59" },
  { label: "Monochrome",  value: "monochrome",   from: "#4B4B4B", to: "#8E8E8E" },
  { label: "Pastel",      value: "pastel",       from: "#FFCBA4", to: "#FF8C69" },
];

const STYLES: { label: IThumbnail["style"]; desc: string }[] = [
  { label: "Bold & Graphic",   desc: "High contrast, bold typography, striking visuals" },
  { label: "Tech/Futuristic",  desc: "Sleek lines, digital gradients, cyberpunk feel" },
  { label: "Minimalist",       desc: "White space, refined layout, subtle accents" },
  { label: "Photorealistic",   desc: "Lifelike imagery, natural depth and detail" },
  { label: "Illustrated",      desc: "Hand-drawn, colorful, playful style" },
];

const ASPECT_RATIOS: { label: IThumbnail["aspect_ratio"]; icon: "landscape" | "square" | "portrait" }[] = [
  { label: "16:9", icon: "landscape" },
  { label: "1:1",  icon: "square"    },
  { label: "9:16", icon: "portrait"  },
];

// ─── Small SVG Icons ───────────────────────────────────────────────────────────

function AspectIcon({ type }: { type: "landscape" | "square" | "portrait" }) {
  if (type === "landscape")
    return (
      <svg width="20" height="13" viewBox="0 0 20 13" fill="none">
        <rect x=".6" y=".6" width="18.8" height="11.8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  if (type === "square")
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x=".6" y=".6" width="12.8" height="12.8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
      <rect x=".6" y=".6" width="8.8" height="14.8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function SparkleIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 1l1.2 4.8L14 8l-4.8 1.2L8 15l-1.2-4.8L2 8l4.8-1.2L8 1z" fill="currentColor" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="11" r="5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <path d="M4 26c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="8" fill="rgba(255,255,255,0.06)" />
      <path d="M10 36l10-10 5 5 6-7 9 12H10z" fill="rgba(255,255,255,0.1)" />
      <circle cx="17" cy="17" r="4" fill="rgba(255,255,255,0.12)" />
      <rect x="8" y="8" width="32" height="32" rx="3" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
    </svg>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ThumbnailGenerator() {
  const [title, setTitle]               = useState("");
  const [userPrompt, setUserPrompt]     = useState("");
  const [aspectRatio, setAspectRatio]   = useState<IThumbnail["aspect_ratio"]>("16:9");
  const [style, setStyle]               = useState<IThumbnail["style"]>("Bold & Graphic");
  const [colorScheme, setColorScheme]   = useState<IThumbnail["color_scheme"]>("forest");
  const [textOverlay, setTextOverlay]   = useState<boolean>(true);
  const [styleOpen, setStyleOpen]       = useState(false);
  const [photo, setPhoto]               = useState<string | null>(null);
  const [generating, setGenerating]     = useState(false);
  const [generated, setGenerated]       = useState(false);
  const fileRef                         = useRef<HTMLInputElement>(null);

  const activeColor = COLOR_SCHEMES.find((c) => c.value === colorScheme);
  const activeStyle = STYLES.find((s) => s.label === style);

  const previewCardStyle =
    aspectRatio === "16:9"
      ? "aspect-video w-full max-w-sm"
      : aspectRatio === "1:1"
      ? "aspect-square w-56"
      : "w-36 aspect-[9/16]";

  function handleGenerate() {
    if (!title.trim()) return;
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2200);
  }

  return (
    <div className="min-h-screen bg-[#0d0a12] font-sans text-white">

      {/* ── Banner ── */}
      <div className="bg-gradient-to-r from-[#1a0f2e] via-[#2d1144] to-[#1a0f2e] border-b border-white/[0.07] px-6 py-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight leading-snug">
            Recreate Thumbnails{" "}
            <span className="text-[#FF2D78]">with AI</span>
          </h1>
          <p className="mt-1 text-xs text-white/45 max-w-xs leading-relaxed">
            Upload a thumbnail or paste a URL, add your changes, and get a
            similar AI-recreated version instantly.
          </p>
        </div>
        <button className="shrink-0 border border-white/30 rounded-full px-5 py-2 text-sm font-semibold flex items-center gap-1.5 hover:bg-white/10 transition-colors">
          Try Now <span>→</span>
        </button>
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-5 p-5 max-w-5xl mx-auto">

        {/* ════ LEFT: Form Panel ════ */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-[17px] font-bold tracking-tight mb-1">Create Your Thumbnail</h2>
          <p className="text-xs text-white/40 mb-6">Describe your vision and let AI bring it to life</p>

          {/* Title */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-white/65 mb-1.5 tracking-wide">
              Title or Topic
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 100))}
              maxLength={100}
              placeholder="e.g. 10 Tips for Better Sleep"
              className="w-full bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm px-3 py-2.5 outline-none placeholder:text-white/25 focus:border-[#FF2D78]/50 transition-colors"
            />
            <p className="text-right text-[11px] text-white/30 mt-1">{title.length}/100</p>
          </div>

          {/* Aspect Ratio */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-white/65 mb-2 tracking-wide">
              Aspect Ratio
            </label>
            <div className="flex gap-2">
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar.label}
                  onClick={() => setAspectRatio(ar.label)}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-2 px-1 rounded-xl text-xs font-semibold border transition-all ${
                    aspectRatio === ar.label
                      ? "bg-[#FF2D78]/15 border-[#FF2D78] text-[#FF2D78]"
                      : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                  }`}
                >
                  <AspectIcon type={ar.icon} />
                  {ar.label}
                </button>
              ))}
            </div>
          </div>

          {/* Thumbnail Style */}
          <div className="mb-5 relative">
            <label className="block text-xs font-semibold text-white/65 mb-1.5 tracking-wide">
              Thumbnail Style
            </label>
            <button
              onClick={() => setStyleOpen(!styleOpen)}
              className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5 flex items-start justify-between gap-2 text-left hover:border-white/20 transition-colors"
            >
              <div className="flex items-start gap-2 flex-1">
                <SparkleIcon className="text-[#FF2D78] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">{activeStyle?.label}</p>
                  <p className="text-[11px] text-white/40 mt-0.5">{activeStyle?.desc}</p>
                </div>
              </div>
              <ChevronDown />
            </button>

            {styleOpen && (
              <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-[#1a1225] border border-white/10 rounded-xl overflow-hidden z-10">
                {STYLES.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => { setStyle(s.label); setStyleOpen(false); }}
                    className={`w-full px-3 py-2.5 text-left border-b border-white/[0.06] last:border-0 transition-colors ${
                      style === s.label ? "bg-[#FF2D78]/10" : "hover:bg-white/5"
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">{s.label}</p>
                    <p className="text-[11px] text-white/40 mt-0.5">{s.desc}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color Scheme */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-white/65 mb-2 tracking-wide">
              Color Scheme
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_SCHEMES.map((scheme) => (
                <button
                  key={scheme.value}
                  title={scheme.label}
                  onClick={() => setColorScheme(scheme.value)}
                  style={{
                    background: `linear-gradient(135deg, ${scheme.from}, ${scheme.to})`,
                    outline:
                      colorScheme === scheme.value
                        ? "2px solid rgba(255,45,120,0.7)"
                        : "2px solid transparent",
                    outlineOffset: "2px",
                  }}
                  className={`w-10 h-7 rounded-lg border-2 transition-all ${
                    colorScheme === scheme.value ? "border-white" : "border-transparent"
                  }`}
                />
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-white/35">
              Selected:{" "}
              <span className="capitalize">{colorScheme}</span>
            </p>
          </div>

          {/* Text Overlay Toggle */}
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white/65 tracking-wide">Text Overlay</p>
              <p className="text-[11px] text-white/35 mt-0.5">Show title text on thumbnail</p>
            </div>
            <button
              onClick={() => setTextOverlay(!textOverlay)}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                textOverlay ? "bg-[#FF2D78]" : "bg-white/20"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  textOverlay ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* User Photo */}
          <div className="mb-5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/[0.08] flex items-center justify-center shrink-0 overflow-hidden">
              {photo ? (
                <img src={photo} alt="user" className="w-full h-full object-cover" />
              ) : (
                <UserIcon />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-white/65 mb-1.5">
                User Photo{" "}
                <span className="font-normal text-white/30">(optional)</span>
              </p>
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setPhoto(URL.createObjectURL(f));
                }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="bg-white/[0.08] border border-white/10 rounded-lg text-white/70 text-xs font-semibold px-3 py-1 hover:bg-white/15 transition-colors"
              >
                Upload Photo
              </button>
            </div>
          </div>

          {/* Additional Prompts */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-white/65 mb-1.5 tracking-wide">
              Additional Prompts{" "}
              <span className="font-normal text-white/30">(optional)</span>
            </label>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              rows={3}
              placeholder="Add any specific elements, mood, or style preferences..."
              className="w-full bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm px-3 py-2.5 outline-none resize-none placeholder:text-white/25 focus:border-[#FF2D78]/50 transition-colors leading-relaxed"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating || !title.trim()}
            className="w-full bg-gradient-to-r from-[#FF2D78] to-[#FF6B6B] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl py-3.5 text-sm font-bold tracking-wide flex items-center justify-content-center justify-center gap-2 transition-opacity hover:opacity-90"
          >
            {generating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <SparkleIcon />
                Generate Thumbnail
              </>
            )}
          </button>
        </div>

        {/* ════ RIGHT: Preview Panel ════ */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 flex flex-col">
          <h2 className="text-[17px] font-bold tracking-tight mb-5">Preview</h2>

          <div
            className="flex-1 min-h-72 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500"
            style={{
              background:
                generated && activeColor
                  ? `linear-gradient(135deg, ${activeColor.from}18, ${activeColor.to}18)`
                  : "rgba(255,255,255,0.02)",
            }}
          >
            {/* Loading */}
            {generating && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3 z-10">
                <span className="w-9 h-9 border-[3px] border-[#FF2D78]/30 border-t-[#FF2D78] rounded-full animate-spin" />
                <p className="text-sm text-white/55">Generating your thumbnail...</p>
              </div>
            )}

            {/* Empty state */}
            {!generating && !generated && (
              <div className="flex flex-col items-center gap-3 text-center">
                <EmptyIcon />
                <div>
                  <p className="text-sm font-semibold text-white/45">Generate your first thumbnail</p>
                  <p className="text-xs text-white/25 mt-1">Fill out the form and click Generate</p>
                </div>
              </div>
            )}

            {/* Result */}
            {!generating && generated && (
              <div className="flex flex-col items-center gap-4 p-6 w-full animate-[fadeIn_0.5s_ease]">
                <div
                  className={`${previewCardStyle} rounded-xl flex flex-col items-center justify-center p-6 text-center`}
                  style={{
                    background: activeColor
                      ? `linear-gradient(135deg, ${activeColor.from}, ${activeColor.to})`
                      : "#333",
                    boxShadow: activeColor
                      ? `0 20px 60px ${activeColor.from}55`
                      : "none",
                  }}
                >
                  {textOverlay && (
                    <p className="text-lg font-extrabold text-white text-center leading-snug tracking-tight drop-shadow-lg">
                      {title}
                    </p>
                  )}
                  {userPrompt && (
                    <p className="mt-2 text-[11px] text-white/70 text-center line-clamp-2">
                      {userPrompt}
                    </p>
                  )}
                </div>

                <div className="flex gap-2.5 mt-1">
                  <button
                    onClick={() => { setGenerated(false); }}
                    className="bg-white/10 border border-white/15 rounded-lg text-white text-xs font-semibold px-4 py-1.5 hover:bg-white/20 transition-colors"
                  >
                    Regenerate
                  </button>
                  <button className="bg-gradient-to-r from-[#FF2D78] to-[#FF6B6B] rounded-lg text-white text-xs font-bold px-4 py-1.5 hover:opacity-90 transition-opacity">
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}