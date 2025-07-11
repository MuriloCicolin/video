-- Create modules table
CREATE TABLE public.modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT NOT NULL,
  lesson_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on modules
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- Create policies for modules (public read access)
CREATE POLICY "Everyone can view modules" 
ON public.modules 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert modules" 
ON public.modules 
FOR INSERT 
WITH CHECK (false); -- Will be updated when admin system is implemented

CREATE POLICY "Only admins can update modules" 
ON public.modules 
FOR UPDATE 
USING (false); -- Will be updated when admin system is implemented

CREATE POLICY "Only admins can delete modules" 
ON public.modules 
FOR DELETE 
USING (false); -- Will be updated when admin system is implemented

-- Create videos table with module reference
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  is_special BOOLEAN NOT NULL DEFAULT false,
  lesson_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on videos
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create policies for videos (public read access)
CREATE POLICY "Everyone can view videos" 
ON public.videos 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert videos" 
ON public.videos 
FOR INSERT 
WITH CHECK (false); -- Will be updated when admin system is implemented

CREATE POLICY "Only admins can update videos" 
ON public.videos 
FOR UPDATE 
USING (false); -- Will be updated when admin system is implemented

CREATE POLICY "Only admins can delete videos" 
ON public.videos 
FOR DELETE 
USING (false); -- Will be updated when admin system is implemented

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_modules_updated_at
  BEFORE UPDATE ON public.modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample modules
INSERT INTO public.modules (title, description, cover_image, lesson_order) VALUES
('Módulo Iniciante', 'Aprenda os fundamentos do artesanato em E.V.A com aulas básicas e essenciais', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop', 1),
('Módulo Dicas', 'Dicas avançadas e truques profissionais para aperfeiçoar suas técnicas', 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop', 2);