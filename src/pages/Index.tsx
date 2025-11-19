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
import { Stethoscope, Brain, Wifi, WifiOff, AlertTriangle, Heart, ShieldCheck, MessageCircle, Users, ArrowRight, Sparkles, CalendarCheck } from 'lucide-react';

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

  const heroHighlights = [
    {
      icon: Heart,
      title: 'Compassion-first language',
      description: 'Results are translated into calm, conversational summaries you can share.',
    },
    {
      icon: ShieldCheck,
      title: 'You’re in control',
      description: 'Files stay on your device until you explicitly send them to the analyzer.',
    },
    {
      icon: MessageCircle,
      title: 'Built for real conversations',
      description: 'Each outcome comes with suggested questions for your care team.',
    },
  ];

  const careTeamInitials = ['AL', 'MO', 'RS'];
  const heroStats = [
    { label: 'Scans gently guided', value: '3.2k+' },
    { label: 'Clinician partners', value: '85' },
    { label: 'Avg. explanation time', value: '54s' },
  ];

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
              <>
                <Wifi className="h-3 w-3" /> Server Online
                <span className="text-muted-foreground/80">(Ready when you are)</span>
              </>
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
        <div className="space-y-10 py-16">
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-white/80 dark:bg-white/5 ">
            <div className="absolute inset-0 bg-gradient-to-r from-gradient-hero/20 to-transparent pointer-events-none" />
            <div className="relative grid gap-10 p-8 lg:p-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
              <div className="space-y-6 text-left">
                <div className="inline-flex items-center rounded-full border border-border/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  <Sparkles className="mr-2 h-3 w-3 text-primary" />
                  Calm medical guidance
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero ">
                      <Stethoscope className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Trusted by nephrologists, radiologists, and patient advocates.
                    </p>
                  </div>
                  <h1 className="text-4xl md:text-5xl xl:text-6xl font-semibold leading-tight text-foreground">
                    {t('title')}
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                    {t('subtitle')}
                  </p>
                  <p className="text-base text-muted-foreground max-w-xl">
                    Medical updates can feel heavy. We slow everything down, explain every decision, and keep space for your emotions.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="medical" size="lg" className="gap-2 " asChild>
                    <a href="#analysis">
                      Begin analysis
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2" asChild>
                    <a href="#how-it-works">
                      <CalendarCheck className="h-4 w-4" />
                      See how it works
                    </a>
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {heroStats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-border/60 bg-white/70 dark:bg-white/5 p-4">
                      <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl bg-gradient-card border border-border/60 p-6  text-left space-y-4">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-sm uppercase tracking-wide text-muted-foreground">Care Coaches Online</p>
                      <p className="text-lg font-medium text-foreground">Licensed nurses ready to explain tricky wording.</p>
                    </div>
                  </div>
                  <div className="flex -space-x-3">
                    {careTeamInitials.map((initials) => (
                      <div
                        key={initials}
                        className="h-12 w-12 rounded-full border-2 border-background bg-gradient-hero text-white text-sm font-semibold flex items-center justify-center"
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="medical" size="sm" className="" asChild>
                      <a href="mailto:care@kidneycompanion.com" className="gap-2">
                        Email a care coach
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="border-dashed gap-2">
                      <Users className="h-4 w-4" />
                      Invite a loved one
                    </Button>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-white/70 dark:bg-white/5 p-5 space-y-4">
                  <p className="text-sm uppercase tracking-wide text-muted-foreground">Why people trust us</p>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    {heroHighlights.map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <item.icon className="h-4 w-4 text-primary mt-1" />
                        <div>
                          <p className="font-medium text-foreground">{item.title}</p>
                          <p>{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload and Analysis Section */}
        <div className="max-w-5xl mx-auto space-y-10" id="analysis">
          <div className="bg-gradient-card rounded-2xl p-8  border border-border/50">
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
                    className="relative hover:"
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
                  <div className="w-full max-w-md mx-auto bg-muted rounded-full h-3 overflow-hidden ">
                    <div className="h-full bg-gradient-hero animate-pulse-medical rounded-full"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full "></div>
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
        <div id="how-it-works">
          <HowItWorks />
        </div>

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
              Gentle technology that keeps humans at the center of every health decision.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <span>© 2024 Kidney Disease Classifier</span>
              <span>•</span>
              <span>For Educational Use Only</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Need someone to talk through the results with? Email <a href="mailto:care@kidneycompanion.com" className="text-primary underline underline-offset-2">care@kidneycompanion.com</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
