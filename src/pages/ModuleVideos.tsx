import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import { supabase } from "@/integrations/supabase/client";

interface Video {
  id: string;
  title: string;
  youtube_url: string;
  cover_image: string;
  is_special: boolean;
  lesson_order: number;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  cover_image: string;
}

const ModuleVideos = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModuleAndVideos = async () => {
      if (!moduleId) return;

      setLoading(true);
      
      try {
        // Buscar informações do módulo
        const { data: moduleData, error: moduleError } = await supabase
          .from('modules')
          .select('*')
          .eq('id', moduleId)
          .single();

        if (moduleError) {
          console.error('Erro ao buscar módulo:', moduleError);
          return;
        }

        setModule(moduleData);

        // Buscar vídeos do módulo
        const { data: videosData, error: videosError } = await supabase
          .from('videos')
          .select('*')
          .eq('module_id', moduleId)
          .order('lesson_order', { ascending: true });

        if (videosError) {
          console.error('Erro ao buscar vídeos:', videosError);
          return;
        }

        setVideos(videosData || []);
      } catch (error) {
        console.error('Erro geral:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleAndVideos();
  }, [moduleId]);

  const specialVideos = videos.filter(video => video.is_special);
  const regularVideos = videos.filter(video => !video.is_special);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Módulo não encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{module.title}</h1>
              <p className="text-gray-300 text-sm">{module.description}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 pb-8">
        {videos.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Nenhuma aula disponível</h2>
            <p className="text-gray-400 mb-6">As aulas serão adicionadas em breve</p>
          </div>
        ) : (
          <>
            {/* Videos Especiais */}
            {specialVideos.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <h2 className="text-lg font-semibold text-white">ARQUIVOS PRINCIPAIS</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {specialVideos.map((video) => (
                    <VideoCard key={video.id} video={{
                      id: video.id,
                      title: video.title,
                      youtubeUrl: video.youtube_url,
                      coverImage: video.cover_image,
                      isSpecial: video.is_special
                    }} />
                  ))}
                </div>
              </section>
            )}

            {/* Videos Regulares */}
            {regularVideos.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-white mb-4">Aulas do Módulo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {regularVideos.map((video, index) => (
                    <VideoCard key={video.id} video={{
                      id: video.id,
                      title: video.title,
                      youtubeUrl: video.youtube_url,
                      coverImage: video.cover_image,
                      isSpecial: video.is_special
                    }} lessonNumber={index + 1} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ModuleVideos;