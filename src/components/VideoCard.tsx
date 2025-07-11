
import { useState } from "react";
import { Play, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Video {
  id: string;
  title: string;
  youtubeUrl: string;
  coverImage: string;
  isSpecial?: boolean;
}

interface VideoCardProps {
  video: Video;
  lessonNumber?: number;
}

const VideoCard = ({ video, lessonNumber }: VideoCardProps) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const handleWatch = () => {
    setIsVideoOpen(true);
  };

  const videoId = getYouTubeVideoId(video.youtubeUrl);

  return (
    <>
      <div className="group relative bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
        {/* Imagem de Capa */}
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={video.coverImage} 
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              onClick={handleWatch}
              size="lg"
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 rounded-full w-16 h-16 p-0"
            >
              <Play className="w-6 h-6 fill-current" />
            </Button>
          </div>
          
          {/* Número da Aula */}
          {lessonNumber && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Aula {lessonNumber}
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="p-4">
          <h3 className="text-white font-medium text-sm line-clamp-2 mb-3 group-hover:text-orange-300 transition-colors">
            {video.title}
          </h3>
          
          <Button
            onClick={handleWatch}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 h-9"
          >
            <Play className="w-4 h-4 mr-2" />
            Assistir Aula
          </Button>
        </div>
      </div>

      {/* Modal do Vídeo */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black">
          <DialogHeader className="p-4">
            <DialogTitle className="text-white">{video.title}</DialogTitle>
          </DialogHeader>
          
          {videoId && (
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-b-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoCard;
