-- Create storage buckets for admin uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('videos', 'videos', false, 524288000, ARRAY['video/mp4', 'video/webm', 'video/quicktime']::text[]),
  ('thumbnails', 'thumbnails', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]),
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]);

-- RLS Policies for videos bucket (private - only authenticated users can view)
CREATE POLICY "Authenticated users can view videos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'videos');

CREATE POLICY "Admins can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'videos' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'videos' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete videos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'videos' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies for thumbnails bucket (public)
CREATE POLICY "Anyone can view thumbnails"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'thumbnails');

CREATE POLICY "Admins can upload thumbnails"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'thumbnails' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update thumbnails"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'thumbnails' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete thumbnails"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'thumbnails' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies for avatars bucket (public)
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);