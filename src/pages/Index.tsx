
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Play, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModuleCard from "@/components/ModuleCard";
import { supabase } from "@/integrations/supabase/client";

interface Module {
  id: string;
  title: string;
  description: string | null;
  cover_image: string;
  lesson_order: number;
}

const Index = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const { data, error } = await supabase
          .from('modules')
          .select('*')
          .order('lesson_order', { ascending: true });

        if (error) {
          console.error('Erro ao buscar módulos:', error);
          return;
        }

        setModules(data || []);
      } catch (error) {
        console.error('Erro geral:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const handleViewModule = (moduleId: string) => {
    navigate(`/module/${moduleId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Play className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Artesanato em E.V.A - Passo a Passo</h1>
            <p className="text-gray-300 text-sm">Módulos de Aprendizado</p>
          </div>
        </div>
      </header>

      <div className="px-6 pb-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Carregando módulos...</h2>
          </div>
        ) : modules.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Nenhum módulo disponível</h2>
            <p className="text-gray-400 mb-6">Os módulos serão adicionados em breve</p>
          </div>
        ) : (
          <section>
            <h2 className="text-lg font-semibold text-white mb-6">Módulos Disponíveis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <ModuleCard 
                  key={module.id} 
                  module={module} 
                  onViewModule={handleViewModule}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Index;
