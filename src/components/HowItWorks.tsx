import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, Brain, FileText } from 'lucide-react';
import medicalLab from '@/assets/medical-lab.jpg';
import doctorAnalysis from '@/assets/doctor-analysis.jpg';

const HowItWorks: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Upload,
      title: t('step1'),
      description: t('step1Desc'),
      image: medicalLab,
      bgColor: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      icon: Brain,
      title: t('step2'),
      description: t('step2Desc'),
      image: doctorAnalysis,
      bgColor: 'from-purple-500/20 to-pink-500/20',
    },
    {
      icon: FileText,
      title: t('step3'),
      description: t('step3Desc'),
      image: medicalLab,
      bgColor: 'from-green-500/20 to-emerald-500/20',
    },
  ];

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
          {t('howItWorks')}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our advanced AI system uses machine learning to analyze CT scan images and provide accurate kidney health assessments.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <Card 
            key={index} 
            className="relative overflow-hidden shadow-card-medical hover:shadow-medical transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${step.bgColor} opacity-50`} />
            
            <CardContent className="relative p-6">
              <div className="text-center">
                {/* Step number */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-hero text-white font-bold text-lg mb-4">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background/80 backdrop-blur mb-4">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground mb-4">{step.description}</p>

                {/* Image */}
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-32 object-cover"
                  />
                </div>
              </div>
            </CardContent>

            {/* Connecting line (except for last item) */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                <div className="w-8 h-0.5 bg-gradient-hero"></div>
                <div className="w-3 h-3 bg-gradient-hero rounded-full absolute -right-1 top-1/2 transform -translate-y-1/2"></div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;