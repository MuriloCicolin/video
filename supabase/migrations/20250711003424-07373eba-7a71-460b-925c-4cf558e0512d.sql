-- Update RLS policies to allow authenticated users (admins) to manage modules and videos

-- Update module policies to allow authenticated users
DROP POLICY IF EXISTS "Only admins can insert modules" ON public.modules;
DROP POLICY IF EXISTS "Only admins can update modules" ON public.modules;
DROP POLICY IF EXISTS "Only admins can delete modules" ON public.modules;

CREATE POLICY "Authenticated users can insert modules" 
ON public.modules 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update modules" 
ON public.modules 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete modules" 
ON public.modules 
FOR DELETE 
TO authenticated
USING (true);

-- Update video policies to allow authenticated users
DROP POLICY IF EXISTS "Only admins can insert videos" ON public.videos;
DROP POLICY IF EXISTS "Only admins can update videos" ON public.videos;
DROP POLICY IF EXISTS "Only admins can delete videos" ON public.videos;

CREATE POLICY "Authenticated users can insert videos" 
ON public.videos 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update videos" 
ON public.videos 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete videos" 
ON public.videos 
FOR DELETE 
TO authenticated
USING (true);