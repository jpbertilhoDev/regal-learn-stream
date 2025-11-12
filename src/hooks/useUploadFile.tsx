import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUploadFile = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (
    file: File,
    bucket: string,
    path?: string
  ): Promise<{ url: string | null; error: Error | null }> => {
    setIsUploading(true);
    setProgress(0);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = path ? `${path}/${fileName}` : fileName;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      setProgress(100);
      setIsUploading(false);

      return { url: publicUrl, error: null };
    } catch (error) {
      setIsUploading(false);
      return { url: null, error: error as Error };
    }
  };

  const deleteFile = async (
    bucket: string,
    path: string
  ): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return { uploadFile, deleteFile, isUploading, progress };
};
