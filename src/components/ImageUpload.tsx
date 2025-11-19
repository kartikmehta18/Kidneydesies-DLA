import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, ShieldCheck, Heart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClearImage: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  selectedImage,
  onClearImage,
}) => {
  const { t } = useLanguage();
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    onImageSelect(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setPreview(null);
    onClearImage();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {!selectedImage ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-500 ${
            dragOver
              ? 'border-primary bg-gradient-accent scale-105 shadow-glow'
              : 'border-border/60 hover:border-primary/60 hover:bg-gradient-accent/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="p-6 rounded-full bg-gradient-hero shadow-glow animate-float">
                <Upload className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-medical-success rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-3 text-center">
              <p className="text-xl font-semibold text-foreground">
                {t('uploadText')}
              </p>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Take your time—this space is judgement-free. When you upload a CT scan we gently walk you through the findings and never store your file on a server without your consent.
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-medical-success rounded-full mr-1"></div>
                  PNG, JPG, JPEG
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-medical-info rounded-full mr-1"></div>
                  Max 10MB
                </span>
              </div>
            </div>
            <Button variant="medical" size="xl" className="shadow-button hover:shadow-glow">
              <ImageIcon className="mr-2 h-5 w-5" />
              Select CT Scan Image
            </Button>
            <div className="grid sm:grid-cols-3 gap-3 text-left text-xs text-muted-foreground w-full mt-6">
              <div className="flex items-start space-x-2 rounded-xl bg-white/60 dark:bg-white/5 p-3 border border-border/60">
                <ShieldCheck className="h-4 w-4 text-medical-success mt-0.5" />
                <p>Images stay private on your device until you choose to analyze.</p>
              </div>
              <div className="flex items-start space-x-2 rounded-xl bg-white/60 dark:bg-white/5 p-3 border border-border/60">
                <Heart className="h-4 w-4 text-medical-info mt-0.5" />
                <p>Friendly language accompanies every result so nothing feels cryptic.</p>
              </div>
              <div className="flex items-start space-x-2 rounded-xl bg-white/60 dark:bg-white/5 p-3 border border-border/60">
                <Clock className="h-4 w-4 text-medical-warning mt-0.5" />
                <p>Average review takes under a minute—pause anytime you need.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden bg-gradient-card shadow-card-hover border border-border/50">
          <div className="relative group">
            {preview && (
              <div className="relative">
                <img
                  src={preview}
                  alt="Selected CT scan"
                  className="w-full max-h-[500px] object-contain bg-gradient-surface"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            )}
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-3 right-3 shadow-lg hover:scale-110 transition-transform"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-6 bg-gradient-surface border-t border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-medical-success rounded-full"></div>
                  <span className="font-medium text-foreground">File Name:</span>
                </div>
                <p className="text-muted-foreground ml-4 truncate">{selectedImage.name}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-medical-info rounded-full"></div>
                  <span className="font-medium text-foreground">File Size:</span>
                </div>
                <p className="text-muted-foreground ml-4">
                  {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-white/70 dark:bg-white/5 p-4 text-sm text-muted-foreground border border-border/40">
              We know health updates can bring up emotions. Take a breath, and when you feel ready, continue to the analysis—we’ll translate the findings into clear language.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;