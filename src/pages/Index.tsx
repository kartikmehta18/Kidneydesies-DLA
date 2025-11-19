import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { kidneyAPI, type PredictionResponse, type ApiError } from '@/services/api';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import ResultDisplay from '@/components/ResultDisplay';
import HowItWorks from '@/components/HowItWorks';
import KidneyInfo from '@/components/KidneyInfo';
import Disclaimer from '@/components/Disclaimer';
import { Stethoscope, Brain, Wifi, WifiOff, AlertTriangle } from 'lucide-react';

const Index = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<'normal' | 'tumor' | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [error, setError] = useState<string | null>(null);

  // Check server status on component mount
  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    setServerStatus('checking');
    try {
      const isOnline = await kidneyAPI.healthCheck();
      setServerStatus(isOnline ? 'online' : 'offline');
    } catch {
      setServerStatus('offline');
    }
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setResult(null);
    setConfidence(null);
    setError(null);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setResult(null);
    setConfidence(null);
    setError(null);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response: PredictionResponse = await kidneyAPI.predictKidneyDisease(selectedImage);
      
      setResult(response.result as 'normal' | 'tumor');
      setConfidence(response.confidence || null);
      
      toast({
        title: "Analysis Complete",
        description: `Results show ${response.result === 'normal' ? 'normal kidney tissue' : 'potential abnormalities'}`,
        variant: response.result === 'normal' ? 'default' : 'destructive',
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      // If server is unreachable, update status
      if (errorMessage.includes('connect to the prediction server')) {
        setServerStatus('offline');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setConfidence(null);
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header />
      
      {/* Server Status Indicator */}
      <div className="container mx-auto px-4 pt-4">
        <div className="flex justify-end">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
            serverStatus === 'online' 
              ? 'bg-medical-success/10 text-medical-success border border-medical-success/20' 
              : serverStatus === 'offline'
              ? 'bg-medical-error/10 text-medical-error border border-medical-error/20'
              : 'bg-muted text-muted-foreground border border-border'
          }`}>
            {serverStatus === 'online' ? (
              <><Wifi className="h-3 w-3" /> Server Online</>
            ) : serverStatus === 'offline' ? (
              <><WifiOff className="h-3 w-3" /> Server Offline</>
            ) : (
              <><Brain className="h-3 w-3 animate-pulse" /> Checking...</>
            )}
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-8 py-16">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-hero mb-8 animate-float shadow-glow">
            <Stethoscope className="h-12 w-12 text-white" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <div className="w-24 h-1 bg-gradient-hero mx-auto rounded-full"></div>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center items-center text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-medical-success rounded-full"></div>
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-medical-info rounded-full"></div>
              <span>Instant Results</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-medical-warning rounded-full"></div>
              <span>Educational Purpose</span>
            </div>
          </div>
        </div>

        {/* Upload and Analysis Section */}
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="bg-gradient-card rounded-2xl p-8 shadow-card-medical border border-border/50">
            <ImageUpload
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              onClearImage={handleClearImage}
            />

            {selectedImage && !result && (
              <div className="text-center mt-8">
                <div className="space-y-4">
                  {serverStatus === 'offline' && (
                    <div className="bg-gradient-error rounded-lg p-4 border border-medical-error/20">
                      <p className="text-sm text-medical-error font-medium">
                        ⚠️ Server Connection Issue
                      </p>
                      <p className="text-xs text-medical-error/80 mt-1">
                        Please ensure the Flask server is running on http://127.0.0.1:8080
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={checkServerStatus}
                        className="mt-2 border-medical-error/20 text-medical-error hover:bg-medical-error/5"
                      >
                        Retry Connection
                      </Button>
                    </div>
                  )}
                  
                  <Button
                    variant="medical"
                    size="xl"
                    onClick={analyzeImage}
                    disabled={isAnalyzing || serverStatus === 'offline'}
                    className="relative shadow-button hover:shadow-glow"
                  >
                    {isAnalyzing ? (
                      <>
                        <Brain className="mr-2 h-6 w-6 animate-pulse-medical" />
                        <span className="animate-pulse">Analyzing Image...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-6 w-6" />
                        {t('predict')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-center space-y-6 mt-8">
                <div className="relative">
                  <div className="w-full max-w-md mx-auto bg-muted rounded-full h-3 overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-hero animate-pulse-medical rounded-full"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full shadow-lg animate-bounce"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-foreground">
                    🧠 Processing CT Scan Image
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Advanced AI algorithms are analyzing your image for kidney abnormalities...
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-8 bg-gradient-error rounded-lg p-6 border border-medical-error/20">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-medical-error flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-medical-error">Analysis Failed</h4>
                    <p className="text-sm text-medical-error/80 mt-1">{error}</p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" onClick={checkServerStatus}>
                        Check Server
                      </Button>
                      <Button variant="medical" size="sm" onClick={analyzeImage}>
                        Try Again
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <ResultDisplay
            result={result}
            confidence={confidence || undefined}
            onReset={handleReset}
          />
        </div>

        {/* How It Works */}
        <HowItWorks />

        {/* Kidney Information */}
        <KidneyInfo />

        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto">
          <Disclaimer />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-hero flex items-center justify-center">
                <span className="text-white font-bold text-sm">🧬</span>
              </div>
              <span className="font-semibold text-foreground">{t('title')}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Advancing medical diagnosis through artificial intelligence
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <span>© 2024 Kidney Disease Classifier</span>
              <span>•</span>
              <span>For Educational Use Only</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
