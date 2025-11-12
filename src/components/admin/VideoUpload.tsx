import { useCallback, useState, useRef } from "react";
import { Upload, X, Video, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface VideoUploadProps {
  onUpload: (file: File, duration: number) => Promise<void>;
  accept?: string;
  maxSize?: number; // in MB
  preview?: string | null;
  onRemove?: () => void;
  label?: string;
  className?: string;
}

export const VideoUpload = ({
  onUpload,
  accept = "video/*",
  maxSize = 500,
  preview,
  onRemove,
  label = "Upload de vídeo",
  className,
}: VideoUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        await handleFile(file);
      }
    },
    [onUpload]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await handleFile(file);
      }
    },
    [onUpload]
  );

  const detectVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const durationInSeconds = Math.round(video.duration);
        resolve(durationInSeconds);
      };

      video.onerror = () => {
        reject(new Error("Erro ao carregar vídeo"));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleFile = async (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`Arquivo muito grande. Tamanho máximo: ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("video/")) {
      alert("Apenas arquivos de vídeo são permitidos");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Detect video duration
      const videoDuration = await detectVideoDuration(file);
      setDuration(videoDuration);
      
      await onUpload(file, videoDuration);
      setProgress(100);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Erro ao fazer upload do vídeo");
    } finally {
      clearInterval(interval);
      setIsUploading(false);
      setProgress(0);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (preview) {
    return (
      <div className={cn("relative", className)}>
        <div className="relative w-full rounded-lg overflow-hidden border border-border bg-black">
          <video
            ref={videoRef}
            src={preview}
            className="w-full aspect-video object-contain"
            onLoadedMetadata={(e) => {
              const video = e.currentTarget;
              setDuration(Math.round(video.duration));
            }}
            onEnded={() => setIsPlaying(false)}
          />
          
          {/* Play/Pause Overlay */}
          <button
            type="button"
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors group"
          >
            {isPlaying ? (
              <Pause className="h-16 w-16 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            ) : (
              <Play className="h-16 w-16 text-white opacity-75 group-hover:opacity-100 transition-opacity" />
            )}
          </button>

          {/* Remove Button */}
          {onRemove && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {/* Duration Badge */}
          {duration && (
            <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
              {formatDuration(duration)}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50",
          isUploading && "pointer-events-none opacity-60"
        )}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            {isUploading ? (
              <Upload className="h-6 w-6 text-primary animate-pulse" />
            ) : (
              <Video className="h-6 w-6 text-primary" />
            )}
          </div>

          {isUploading ? (
            <div className="w-full max-w-xs">
              <p className="text-sm text-muted-foreground mb-2">
                Enviando vídeo e detectando duração...
              </p>
              <Progress value={progress} className="h-2" />
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground mb-1">
                Arraste um vídeo ou clique para selecionar
              </p>
              <p className="text-xs text-muted-foreground">
                Formatos: MP4, WebM, MOV (máx. {maxSize}MB)
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
