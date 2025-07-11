import { Play, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Module {
  id: string;
  title: string;
  description: string | null;
  cover_image: string;
  lesson_order: number;
}

interface ModuleCardProps {
  module: Module;
  onViewModule: (moduleId: string) => void;
}

const ModuleCard = ({ module, onViewModule }: ModuleCardProps) => {
  return (
    <div className="group relative bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
      {/* Imagem de Capa */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={module.cover_image} 
          alt={module.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            onClick={() => onViewModule(module.id)}
            size="lg"
            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 rounded-full w-16 h-16 p-0"
          >
            <Play className="w-6 h-6 fill-current" />
          </Button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <h3 className="text-white font-medium text-lg mb-2 group-hover:text-orange-300 transition-colors">
          {module.title}
        </h3>
        
        {module.description && (
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            {module.description}
          </p>
        )}
        
        <Button
          onClick={() => onViewModule(module.id)}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 h-9"
        >
          <Users className="w-4 h-4 mr-2" />
          Ver Aulas
        </Button>
      </div>
    </div>
  );
};

export default ModuleCard;