import { act, useState } from "react";
// import { useParams } from "react-router-dom";
import type { ColorScheme, IThumbnail, ThumbnailStyle } from "../types";
import {
  aspectRatios,
  colorSchemes,
  models,
  thumbnailStyles,
} from "../constant/assets";

import {
  RectangleVertical,
  Square,
  RectangleHorizontal,
  ChevronDown,
  Image,
} from "lucide-react";

const Generate = () => {
  const handleGenerate = () => {
    if (!title.trim()) return;
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2200);
  };

  const [title, setTitle] = useState<string>("");
  const [aspectRatio, setAspectRatio] = useState<string>(aspectRatios[0]);
  const [style, setStyle] = useState<ThumbnailStyle>(thumbnailStyles[0]);
  const [styleOpen, setStyleOpen] = useState<boolean>(false);
  const [colorScheme, setColorScheme] = useState<ColorScheme["id"]>(
    colorSchemes[0].id,
  );
  const [textOverlay, setTextOverlay] = useState(true)
  const [modelOpen, setModelOpen] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>("premium");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  
  const currentModel = models.find((m) => m.name === selectedModel);
  const activeStyle: ThumbnailStyle | undefined = thumbnailStyles.find(
    (s) => s === style,
  );
  const activeColor:ColorScheme  | undefined = colorSchemes.find((c) => c.id === colorScheme);

   const previewCardStyle =
    aspectRatio === "16:9"
      ? "aspect-video w-full max-w-md"
      : aspectRatio === "1:1"
      ? "aspect-square w-56"
      : "w-36 aspect-[9/16]";

 
    return (
  <div className="relative min-h-screen overflow-hidden space-y-10 pt-20 lg:pt-30 mx-auto px-4 md:px-16 lg:px-24 xl:px-32">
    {/* Blur orbs — same style as HeroSection */}
    <div className="absolute top-20 -z-10 left-1/4 size-72 bg-blue-600 blur-[300px]" />
      {/* ── Banner ── */}
      <div className=" border-2 rounded-2xl   border-blue-600/20 px-6 mx-5 py-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl bg-gradient-to-r from-blue-600 to-blue-200 bg-clip-text text-transparent font-bold tracking-tight leading-snug">
            Recreate Thumbnails
          with AI
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
    <main className="grid grid-cols-1 lg:grid-cols-[350px_1fr]  gap-5 p-5 ">
      {/* left */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
        <h2 className="text-[17px] font-bold tracking-tight mb-1">
          Create Your Thumbnail
        </h2>
        <p className="text-xs text-white/40 mb-6">
          Describe your vision and let AI bring it to life
        </p>

        {/* Title */}
        <div className="mb-5">
          <h3 className="block text-xs font-semibold text-white/65 mb-1.5 tracking-wide">
            Title or Topic
          </h3>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 100))}
            maxLength={100}
            placeholder="e.g. 10 Tips for Better Sleep"
            required
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm px-3 py-2.5 outline-none placeholder:text-white/25 focus:border-blue-600 transition-colors"
          />
          <p className="text-right text-[11px] text-white/30 mt-1">
            {title.length}/100
          </p>
        </div>
        {/* aspect */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-white/65 mb-2 tracking-wide">
            Aspect Ratio
          </label>
          <div className="flex gap-2">
            {aspectRatios.map((ar, idx) => (
              <button
                key={idx}
                onClick={() => setAspectRatio(ar)}
                className={`flex-1 flex items-center justify-center gap-3 py-2 px-1 rounded-xl text-xs font-semibold border transition-all ${
                  aspectRatio === ar
                    ? "bg-blue-600/15 border-blue-600 text-blue-600"
                    : "bg-blue-200/15 border-white/10 text-white/60 hover:border-white/20"
                }`}
              >
                {ar === "16:9" && <RectangleHorizontal size={16} />}
                {ar === "1:1" && <Square size={16} />}
                {ar === "9:16" && <RectangleVertical size={16} />}
                {ar}
              </button>
            ))}
          </div>
        </div>
        {/* thumbnail style */}
        <div className="mb-5 relative">
          <label className="block text-xs font-semibold text-white/65 mb-1.5 tracking-wide">
            Thumbnail Style
          </label>
          <button
            onClick={() => setStyleOpen(!styleOpen)}
            className="w-full  bg-blue-600/15 border-blue-600 text-blue-600 border  rounded-xl px-3 py-2.5 flex items-start justify-between gap-2 text-left hover:border-blue-600/20 transition-colors"
          >
            <div className="flex items-center justify-start gap-3 flex-1 ">
              <div className="flex items-center justify-center">
                {activeStyle?.icon}
              </div>
              <div>
                <p className="text-sm font-semibold ">{activeStyle?.label}</p>
                <p className="text-[11px] text-blue-600/60 mt-0.5">
                  {activeStyle?.desc}
                </p>
              </div>
            </div>
          </button>

          {styleOpen && (
            <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-blue-950 border border-white/10 rounded-xl overflow-hidden z-10">
              {thumbnailStyles.map((s) => (
                <button
                  key={s.label}
                  onClick={() => {
                    setStyle(s);
                    setStyleOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 text-left border-b border-white/[0.06] flex items-center justify-start gap-3 last:border-0 transition-colors ${
                    style === s ? "bg-blue-600/30" : "hover:bg-white/5"
                  }`}
                >
                  <div className="mr-2">{s.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {s.label}
                    </p>
                    <p className="text-[11px] text-white/40 mt-0.5">{s.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        {/* color scheme */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-white/65 mb-2 tracking-wide">
            Color Scheme
          </label>
          <div className="flex flex-wrap gap-1.5">
            {colorSchemes.map((scheme) => (
              <button
                key={scheme.id}
                title={scheme.name}
                onClick={() => setColorScheme(scheme.id)}
                style={{
                  background: `linear-gradient(
    to right,
    ${scheme.colors[0]} 0% 33.33%,
    ${scheme.colors[1]} 33.33% 66.66%,
    ${scheme.colors[2]} 66.66% 100%
  )`,
                  outline:
                    colorScheme === scheme.id
                      ? "2px solid blue"
                      : "2px solid transparent",
                  outlineOffset: "2px",
                }}
                className={`w-10 h-7 rounded-lg border-2 transition-all ${
                  colorScheme === scheme.id
                    ? "border-white"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>
          <p className="mt-1.5 text-[11px] text-white/35">
            Selected: <span className="capitalize">{colorScheme}</span>
          </p>
        </div>
        {/* model */}

        <div className="mb-5 relative">
          <label className="block text-[12px] font-semibold text-white/70 mb-1.5 tracking-[0.2px]">
            Model
          </label>

          <button
            onClick={() => {
              setModelOpen(!modelOpen);
              setStyleOpen(false);
            }}
            className="w-full bg-blue-600/20 border border-blue-600 rounded-[10px] text-white px-3 py-2.5 cursor-pointer flex items-center justify-between text-[13px] font-semibold"
          >
            <span>
              {currentModel?.name}
              <span className="font-normal text-white/40 text-[12px]">
                ({currentModel?.credit} credits)
              </span>
            </span>
            <ChevronDown />
          </button>

          {modelOpen && (
            <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-blue-900 border border-white/[0.12] rounded-[10px] overflow-hidden z-10">
              {models.map((m) => (
                <button
                  key={m.name}
                  onClick={() => {
                    setSelectedModel(m.name);
                    setModelOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 text-left border-b border-white/[0.06] flex items-center justify-start gap-3 last:border-0 transition-colors ${
                    selectedModel === m.name ? "bg-blue-600" : "bg-transparent "
                  }`}
                >
                  <span>{m.name}</span>
                  <span className="font-normal text-white/40 text-[12px]">
                    {m.credit} credits
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* additional info */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-white/65 mb-1.5 tracking-wide">
            Additional Prompts{" "}
            <span className="font-normal text-white/30">(optional)</span>
          </label>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            rows={3}
            placeholder="Add any specific elements, mood, or style preferences..."
            className="w-full bg-blue-600/[0.06] border border-white/10 rounded-xl text-white text-sm px-3 py-2.5 outline-none resize-none placeholder:text-white/25 focus:border-blue-600/50 transition-colors leading-relaxed"
          />
        </div>
        {/* generate */}
        <button
          onClick={handleGenerate}
          disabled={generating || !title.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-sky-600 text-white disabled:opacity-40 disabled:cursor-not-allowed rounded-xl py-3.5 text-sm font-bold tracking-wide flex items-center justify-content-center justify-center gap-2 transition-opacity hover:opacity-90"
        >
          {generating ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>Generate Thumbnail</>
          )}
        </button>
      </div>

      {/* right */}
      <div className={`bg-white/[0.03] border  border-white/[0.08] aspect-auto rounded-2xl p-6 flex flex-col`}>
          <h2 className="text-[17px] font-bold tracking-tight mb-5">Preview</h2>

          <div
            className="flex-1 min-h-72 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500"
            style={{
            background:
             generated && activeColor
               ? `linear-gradient(135deg, ${activeColor.colors[0]}, ${activeColor.colors[1]}, ${activeColor.colors[2]})`
               : "rgba(255,255,255,0.02)",
}}
          >
            {/* Loading */}
            {generating && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3 z-10">
                <span className="w-9 h-9 border-[3px] border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-sm text-white/55">Generating your thumbnail...</p>
              </div>
            )}

            {/* Empty state */}
            {!generating && !generated && (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="size-12 bg-blue-400/40 rounded-full flex items-center justify-center"><Image/></div>
                <div>
                  <p className="text-sm font-semibold text-blue-600/45">Generate your first thumbnail</p>
                  <p className="text-xs text-blue-200/25 mt-1">Fill out the form and click Generate</p>
                </div>
              </div>
            )}

            {/* Result */}
            {!generating && generated && (
              <div className="flex flex-col items-center gap-4 p-6 w-full animate-[fadeIn_0.5s_ease]">
                <div
                  className={`${previewCardStyle} rounded-xl flex flex-col items-center justify-center p-6 text-center`}
                  style={{
  background:
    generated && activeColor
      ? `linear-gradient(135deg, ${activeColor.colors[0]}, ${activeColor.colors[1]}, ${activeColor.colors[2]})`
      : "rgba(255,255,255,0.02)",
}}
                >
                  {textOverlay && (
                    <p className="text-lg font-extrabold text-white text-center leading-snug tracking-tight drop-shadow-lg">
                      {title}
                    </p>
                  )}
                  {additionalInfo && (
                    <p className="mt-2 text-[11px] text-white/70 text-center line-clamp-2">
                      {additionalInfo}
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
                  <button className="bg-gradient-to-r from-blue-600 to-sky-400 rounded-lg text-white text-xs font-bold px-4 py-1.5 hover:opacity-90 transition-opacity">
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
    </main>
  </div>
);
};

export default Generate;
