import { useEffect, useState } from "react";
import type { IThumbnail } from "../types";
import { aspectRatios, dummyThumbnails } from "../constant/assets";
import { Link, redirect, useNavigate } from "react-router-dom";
import { Download, Share2, Trash } from "lucide-react";

const MyGeneration = () => {
  const navigate = useNavigate();

  const [thumbnails, setThumbnails] = useState<IThumbnail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<string>(aspectRatios[0]);

  const previewCardStyle =
    aspectRatio === "16:9"
      ? "aspect-video w-full max-w-md"
      : aspectRatio === "1:1"
        ? "aspect-square w-56"
        : "w-36 aspect-[9/16]";

  const fetchThumbnail = async () => {
    setThumbnails(dummyThumbnails as unknown as IThumbnail[]);
  };

  const handleDownload = (image_url: string) => {
    window.open(image_url, "_blank");
  };

  const handleDelete = (id: string) => {
    console.log(id);
  };

  useEffect(() => {
    fetchThumbnail();
    setLoading(false);
  }, []);

  return (
    <div className=" min-h-screen overflow-hidden space-y-10 pt-20 lg:pt-30 mx-auto px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="absolute top-20 -z-10 left-1/4 size-72 bg-blue-600 blur-[300px]" />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-200">My Generations</h1>
        <p className="text-sm text-zinc-400 mt-1">
          {" "}
          View and manage your generated thumbnails
        </p>
      </div>
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i: number) => (
            <div
              className="rounded-2xl bg-white/6 border border-white/10 animate-pulse h-[260px]"
              key={i}
            />
          ))}
        </div>
      )}

      {!loading && thumbnails.length === 0 && (
        <div className=" py-24 text-center">
          <h3>no thumbnails yet</h3>
          <p className="text-sm text-zinc-400">
            Create your first thumbnail to get started
          </p>
          <button
            onClick={() => redirect("/generate")}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold"
          >
            Generate Thumbnail
          </button>
        </div>
      )}

      {!loading && thumbnails.length > 0 && (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {thumbnails.map((thumbnail: IThumbnail) => {
            return (
              <div
                key={thumbnail._id}
                onClick={() => navigate(`/generate/${thumbnail._id}`)}
                className="mb-8 group relative cursor-pointer rounded-2xl bg-white/6 border border-white/10 transition shadow-xl break-inside-avoid"
              >
                <div
                  className={`relative ${previewCardStyle} overflow-hidden rounded-t-2xl bg-black`}
                >
                  {thumbnail.image_url && (
                    <img
                      src={thumbnail.image_url}
                      alt={thumbnail.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}

                  {!thumbnail.image_url && (
                    <div className="w-full h-full flex items-center justify-center text-sm text-zinc-400">
                      {thumbnail.isGenerating ? "generating..." : "no image"}
                    </div>
                  )}

                  {thumbnail.isGenerating && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-sm font-medium text-white">
                      generating...
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-zinc-100">
                    {thumbnail.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                    <span className="px-2 py-0.5 rounded bg-white/10">
                      {thumbnail.style}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/10">
                      {thumbnail.aspect_ratio}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/10">
                      {thumbnail.color_scheme}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    {new Date(thumbnail.createdAt!).toDateString()}
                  </p>
                </div>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className=" absolute bottom-2 right-2 max-sm:flex sm:hidden group-hover:flex gap-1.5 "
                >
                  <Trash
                    onClick={() => handleDelete(thumbnail._id)}
                    className="size-6 bg-black/50 p-1 rounded hover:bg-blue-600 transition-all "
                  />
                  <Link
                    target="_blank"
                    to={`/preview?thumbnail_url=${thumbnail.image_url}&title=${thumbnail.title}`}
                  >
                    <Share2 className="size-6 bg-black/50 p-1 rounded hover:bg-blue-600 transition-all " />
                  </Link>
                  <Download
                    onClick={() => handleDownload(thumbnail.image_url!)}
                    className="size-6 bg-black/50 p-1 rounded hover:bg-blue-600 transition-all "
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyGeneration;
