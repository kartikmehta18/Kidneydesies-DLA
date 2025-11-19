import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertTriangle } from 'lucide-react';

const Disclaimer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Card className="border-medical-warning/20 bg-medical-warning/5 shadow-card-medical">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-medical-warning">
          <AlertTriangle className="h-5 w-5" />
          <span>{t('disclaimer')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t('disclaimerText')} This AI-powered tool provides preliminary analysis 
          and should always be verified by qualified medical professionals. 
          Always consult with your healthcare provider for accurate diagnosis and treatment recommendations.
        </p>
      </CardContent>
    </Card>
  );
};

export default Disclaimer;