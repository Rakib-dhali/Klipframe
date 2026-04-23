import { useSearchParams } from "react-router-dom"
import { yt_html } from "../constant/assets"

const Preview = () => {
  const [searchParams] = useSearchParams();
  const thumbnailUrl = searchParams.get("thumbnail_url");
  const title = searchParams.get("title");

  const newHtml = yt_html.replace(/%%THUMBNAIL_URL%%/g, thumbnailUrl!).replace(/%%TITLE%%/g, title!);

  return (
    <div className="fixed inset-0 z-100 bg-black">
      <iframe srcDoc={newHtml} className="w-full h-full" allowFullScreen />
    </div>
  )
}

export default Preview