import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, ArrowLeft, Trash2, Upload, Star, LogOut, BookOpen, FolderPlus, Edit } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Video {
  id: string;
  title: string;
  youtube_url: string;
  cover_image: string;
  is_special: boolean;
  module_id: string;
  lesson_order: number;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  cover_image: string;
  lesson_order: number;
}

const Admin = () => {
  const { signOut, user } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [moduleFormData, setModuleFormData] = useState({
    title: "",
    description: "",
    coverImage: ""
  });
  
  const [editModuleFormData, setEditModuleFormData] = useState({
    title: "",
    description: "",
    coverImage: ""
  });
  
  const [videoFormData, setVideoFormData] = useState({
    title: "",
    youtubeUrl: "",
    coverImage: "",
    isSpecial: false,
    moduleId: ""
  });

  const [editVideoFormData, setEditVideoFormData] = useState({
    title: "",
    youtubeUrl: "",
    coverImage: "",
    isSpecial: false,
    moduleId: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .order('lesson_order', { ascending: true });

      if (modulesError) {
        console.error('Erro ao buscar módulos:', modulesError);
      } else {
        setModules(modulesData || []);
      }

      // Fetch videos
      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .order('lesson_order', { ascending: true });

      if (videosError) {
        console.error('Erro ao buscar vídeos:', videosError);
      } else {
        setVideos(videosData || []);
      }
    } catch (error) {
      console.error('Erro geral:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setModuleFormData({ ...moduleFormData, coverImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setVideoFormData({ ...videoFormData, coverImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditModuleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditModuleFormData({ ...editModuleFormData, coverImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditVideoImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditVideoFormData({ ...editVideoFormData, coverImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!moduleFormData.title || !moduleFormData.coverImage) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('modules')
        .insert({
          title: moduleFormData.title,
          description: moduleFormData.description,
          cover_image: moduleFormData.coverImage,
          lesson_order: modules.length + 1
        });

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao criar módulo. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      setModuleFormData({ title: "", description: "", coverImage: "" });
      setIsAddingModule(false);
      fetchData();
      
      toast({
        title: "Sucesso!",
        description: "Módulo criado com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar módulo. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFormData.title || !videoFormData.youtubeUrl || !videoFormData.coverImage || !videoFormData.moduleId) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('videos')
        .insert({
          title: videoFormData.title,
          youtube_url: videoFormData.youtubeUrl,
          cover_image: videoFormData.coverImage,
          is_special: videoFormData.isSpecial,
          module_id: videoFormData.moduleId,
          lesson_order: videos.filter(v => v.module_id === videoFormData.moduleId).length + 1
        });

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao criar aula. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      setVideoFormData({ title: "", youtubeUrl: "", coverImage: "", isSpecial: false, moduleId: "" });
      setIsAddingVideo(false);
      fetchData();
      
      toast({
        title: "Sucesso!",
        description: "Aula criada com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar aula. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setEditModuleFormData({
      title: module.title,
      description: module.description || "",
      coverImage: module.cover_image
    });
  };

  const handleUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingModule || !editModuleFormData.title || !editModuleFormData.coverImage) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('modules')
        .update({
          title: editModuleFormData.title,
          description: editModuleFormData.description,
          cover_image: editModuleFormData.coverImage
        })
        .eq('id', editingModule.id);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao atualizar módulo. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      setEditingModule(null);
      setEditModuleFormData({ title: "", description: "", coverImage: "" });
      fetchData();
      
      toast({
        title: "Sucesso!",
        description: "Módulo atualizado com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar módulo. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleEditVideo = (video: Video) => {
    console.log('handleEditVideo called with:', video);
    console.log('Current editingVideo state:', editingVideo);
    setEditingVideo(video);
    setEditVideoFormData({
      title: video.title,
      youtubeUrl: video.youtube_url,
      coverImage: video.cover_image,
      isSpecial: video.is_special,
      moduleId: video.module_id
    });
    console.log('After setting editingVideo:', video);
  };

  const handleUpdateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingVideo || !editVideoFormData.title || !editVideoFormData.youtubeUrl || !editVideoFormData.coverImage || !editVideoFormData.moduleId) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('videos')
        .update({
          title: editVideoFormData.title,
          youtube_url: editVideoFormData.youtubeUrl,
          cover_image: editVideoFormData.coverImage,
          is_special: editVideoFormData.isSpecial,
          module_id: editVideoFormData.moduleId
        })
        .eq('id', editingVideo.id);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao atualizar aula. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      setEditingVideo(null);
      setEditVideoFormData({ title: "", youtubeUrl: "", coverImage: "", isSpecial: false, moduleId: "" });
      fetchData();
      
      toast({
        title: "Sucesso!",
        description: "Aula atualizada com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar aula. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteModule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao deletar módulo. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      fetchData();
      toast({
        title: "Removido",
        description: "Módulo removido com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao deletar módulo. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao deletar aula. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      fetchData();
      toast({
        title: "Removido",
        description: "Aula removida com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao deletar aula. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
            <p className="text-gray-300 text-sm">Gerencie módulos e aulas do curso</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAddingModule(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            Novo Módulo
          </Button>
          <Button
            onClick={() => setIsAddingVideo(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Aula
          </Button>
          <Button
            onClick={signOut}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <div className="p-6">
        {/* Formulário de Adicionar Módulo */}
        {isAddingModule && (
          <Card className="mb-6 bg-black/20 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Adicionar Novo Módulo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleModuleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="moduleTitle" className="text-white">Título do Módulo *</Label>
                  <Input
                    id="moduleTitle"
                    type="text"
                    value={moduleFormData.title}
                    onChange={(e) => setModuleFormData({ ...moduleFormData, title: e.target.value })}
                    placeholder="Ex: Módulo Iniciante"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="moduleDescription" className="text-white">Descrição</Label>
                  <Textarea
                    id="moduleDescription"
                    value={moduleFormData.description}
                    onChange={(e) => setModuleFormData({ ...moduleFormData, description: e.target.value })}
                    placeholder="Descreva o conteúdo do módulo..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="moduleCoverImage" className="text-white">Imagem de Capa *</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="moduleCoverImage"
                      type="file"
                      accept="image/*"
                      onChange={handleModuleImageUpload}
                      className="bg-white/10 border-white/20 text-white file:bg-white/10 file:border-0 file:text-white"
                    />
                    <Button type="button" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  {moduleFormData.coverImage && (
                    <div className="mt-2">
                      <img 
                        src={moduleFormData.coverImage} 
                        alt="Preview" 
                        className="w-32 h-20 object-cover rounded border border-white/20"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  >
                    Adicionar Módulo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddingModule(false)}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Formulário de Adicionar Aula */}
        {isAddingVideo && (
          <Card className="mb-6 bg-black/20 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Adicionar Nova Aula</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleVideoSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="moduleSelect" className="text-white">Módulo *</Label>
                  <Select value={videoFormData.moduleId} onValueChange={(value) => setVideoFormData({ ...videoFormData, moduleId: value })}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Selecione um módulo" />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="videoTitle" className="text-white">Título da Aula *</Label>
                  <Input
                    id="videoTitle"
                    type="text"
                    value={videoFormData.title}
                    onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                    placeholder="Ex: Aula 1 - Materiais Necessários"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="youtubeUrl" className="text-white">Link do YouTube *</Label>
                  <Input
                    id="youtubeUrl"
                    type="url"
                    value={videoFormData.youtubeUrl}
                    onChange={(e) => setVideoFormData({ ...videoFormData, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="videoCoverImage" className="text-white">Imagem de Capa *</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="videoCoverImage"
                      type="file"
                      accept="image/*"
                      onChange={handleVideoImageUpload}
                      className="bg-white/10 border-white/20 text-white file:bg-white/10 file:border-0 file:text-white"
                    />
                    <Button type="button" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  {videoFormData.coverImage && (
                    <div className="mt-2">
                      <img 
                        src={videoFormData.coverImage} 
                        alt="Preview" 
                        className="w-32 h-20 object-cover rounded border border-white/20"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isSpecial"
                    checked={videoFormData.isSpecial}
                    onCheckedChange={(checked) => setVideoFormData({ ...videoFormData, isSpecial: checked })}
                  />
                  <Label htmlFor="isSpecial" className="text-white flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Arquivo Principal (Destaque)
                  </Label>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    Adicionar Aula
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddingVideo(false)}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Formulário de Editar Módulo */}
        {editingModule && (
          <Card className="mb-6 bg-black/20 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Editar Módulo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleUpdateModule} className="space-y-4">
                <div>
                  <Label htmlFor="editModuleTitle" className="text-white">Título do Módulo *</Label>
                  <Input
                    id="editModuleTitle"
                    type="text"
                    value={editModuleFormData.title}
                    onChange={(e) => setEditModuleFormData({ ...editModuleFormData, title: e.target.value })}
                    placeholder="Ex: Módulo Iniciante"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="editModuleDescription" className="text-white">Descrição</Label>
                  <Textarea
                    id="editModuleDescription"
                    value={editModuleFormData.description}
                    onChange={(e) => setEditModuleFormData({ ...editModuleFormData, description: e.target.value })}
                    placeholder="Descreva o conteúdo do módulo..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="editModuleCoverImage" className="text-white">Imagem de Capa *</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="editModuleCoverImage"
                      type="file"
                      accept="image/*"
                      onChange={handleEditModuleImageUpload}
                      className="bg-white/10 border-white/20 text-white file:bg-white/10 file:border-0 file:text-white"
                    />
                    <Button type="button" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  {editModuleFormData.coverImage && (
                    <div className="mt-2">
                      <img 
                        src={editModuleFormData.coverImage} 
                        alt="Preview" 
                        className="w-32 h-20 object-cover rounded border border-white/20"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  >
                    Atualizar Módulo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingModule(null);
                      setEditModuleFormData({ title: "", description: "", coverImage: "" });
                    }}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Formulário de Editar Aula */}
        {(() => {
          console.log('Checking editingVideo state:', editingVideo);
          return editingVideo;
        })() && (
          <Card className="mb-6 bg-black/20 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Editar Aula</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleUpdateVideo} className="space-y-4">
                <div>
                  <Label htmlFor="editModuleSelect" className="text-white">Módulo *</Label>
                  <Select value={editVideoFormData.moduleId} onValueChange={(value) => setEditVideoFormData({ ...editVideoFormData, moduleId: value })}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Selecione um módulo" />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="editVideoTitle" className="text-white">Título da Aula *</Label>
                  <Input
                    id="editVideoTitle"
                    type="text"
                    value={editVideoFormData.title}
                    onChange={(e) => setEditVideoFormData({ ...editVideoFormData, title: e.target.value })}
                    placeholder="Ex: Aula 1 - Materiais Necessários"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="editYoutubeUrl" className="text-white">Link do YouTube *</Label>
                  <Input
                    id="editYoutubeUrl"
                    type="url"
                    value={editVideoFormData.youtubeUrl}
                    onChange={(e) => setEditVideoFormData({ ...editVideoFormData, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="editVideoCoverImage" className="text-white">Imagem de Capa *</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="editVideoCoverImage"
                      type="file"
                      accept="image/*"
                      onChange={handleEditVideoImageUpload}
                      className="bg-white/10 border-white/20 text-white file:bg-white/10 file:border-0 file:text-white"
                    />
                    <Button type="button" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  {editVideoFormData.coverImage && (
                    <div className="mt-2">
                      <img 
                        src={editVideoFormData.coverImage} 
                        alt="Preview" 
                        className="w-32 h-20 object-cover rounded border border-white/20"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="editIsSpecial"
                    checked={editVideoFormData.isSpecial}
                    onCheckedChange={(checked) => setEditVideoFormData({ ...editVideoFormData, isSpecial: checked })}
                  />
                  <Label htmlFor="editIsSpecial" className="text-white flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Arquivo Principal (Destaque)
                  </Label>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    Atualizar Aula
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingVideo(null);
                      setEditVideoFormData({ title: "", youtubeUrl: "", coverImage: "", isSpecial: false, moduleId: "" });
                    }}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tabs para Módulos e Aulas */}
        <Tabs defaultValue="modules" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/20 border-white/10">
            <TabsTrigger value="modules" className="text-white data-[state=active]:bg-white/20">
              <BookOpen className="w-4 h-4 mr-2" />
              Módulos ({modules.length})
            </TabsTrigger>
            <TabsTrigger value="videos" className="text-white data-[state=active]:bg-white/20">
              <Star className="w-4 h-4 mr-2" />
              Aulas ({videos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="mt-6">
            {modules.length === 0 ? (
              <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400">Nenhum módulo cadastrado ainda</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {modules.map((module) => (
                  <Card key={module.id} className="bg-black/20 backdrop-blur-sm border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={module.cover_image} 
                          alt={module.title}
                          className="w-24 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="text-white font-medium mb-1">{module.title}</h3>
                          <p className="text-gray-400 text-sm">{module.description}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            {videos.filter(v => v.module_id === module.id).length} aula(s)
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditModule(module)}
                            variant="outline"
                            size="sm"
                            className="bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteModule(module.id)}
                            variant="outline"
                            size="sm"
                            className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            {videos.length === 0 ? (
              <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400">Nenhuma aula cadastrada ainda</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {videos.map((video) => {
                  const module = modules.find(m => m.id === video.module_id);
                  return (
                    <Card key={video.id} className="bg-black/20 backdrop-blur-sm border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={video.cover_image} 
                            alt={video.title}
                            className="w-24 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-white font-medium">{video.title}</h3>
                              {video.is_special && (
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              )}
                            </div>
                            <p className="text-gray-400 text-sm mb-1">{module?.title}</p>
                            <p className="text-gray-500 text-xs truncate">{video.youtube_url}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEditVideo(video)}
                              variant="outline"
                              size="sm"
                              className="bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteVideo(video.id)}
                              variant="outline"
                              size="sm"
                              className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;