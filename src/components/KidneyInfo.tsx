import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Activity, 
  Heart, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Zap,
  Filter
} from 'lucide-react';
import kidneyAnatomy from '@/assets/kidney-anatomy.jpg';

const KidneyInfo: React.FC = () => {
  const { t } = useLanguage();

  const facts = [
    { icon: Filter, text: t('fact1') },
    { icon: Zap, text: t('fact2') },
    { icon: Shield, text: t('fact3') },
  ];

  const symptoms = [
    { icon: AlertTriangle, text: t('symptom1') },
    { icon: Activity, text: t('symptom2') },
    { icon: Heart, text: t('symptom3') },
    { icon: Info, text: t('symptom4') },
  ];

  const tips = [
    { icon: CheckCircle, text: t('tip1') },
    { icon: CheckCircle, text: t('tip2') },
    { icon: CheckCircle, text: t('tip3') },
    { icon: CheckCircle, text: t('tip4') },
  ];

  return (
    <div className="space-y-8">
      {/* About Section */}
      <Card className="shadow-card-medical">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-gradient-medical">
              <Info className="h-5 w-5 text-primary" />
            </div>
            <span>{t('about')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-muted-foreground leading-relaxed">
                {t('aboutText')}
              </p>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img
                src={kidneyAnatomy}
                alt="Kidney anatomy"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Kidney Facts */}
        <Card className="shadow-card-medical">
          <CardHeader>
            <CardTitle className="text-lg">{t('kidneyFacts')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {facts.map((fact, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-success">
                    <fact.icon className="h-4 w-4 text-medical-success" />
                  </div>
                  <p className="text-sm text-muted-foreground flex-1">
                    {fact.text}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Symptoms */}
        <Card className="shadow-card-medical">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <span>{t('symptoms')}</span>
              <Badge variant="outline" className="text-medical-warning border-medical-warning">
                Important
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {symptoms.map((symptom, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <symptom.icon className="h-4 w-4 text-medical-warning mt-1" />
                  <p className="text-sm text-muted-foreground flex-1">
                    {symptom.text}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Prevention */}
        <Card className="shadow-card-medical">
          <CardHeader>
            <CardTitle className="text-lg">{t('prevention')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <tip.icon className="h-4 w-4 text-medical-success mt-1" />
                  <p className="text-sm text-muted-foreground flex-1">
                    {tip.text}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KidneyInfo;