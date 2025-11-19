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
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            {t('disclaimerText')} Think of this experience as a friendly explainer that prepares you for a conversation with a clinician—it is not a diagnosis.
          </p>
          <p>
            If anything here worries you, reach out to your healthcare team or a local urgent care line. Bringing a screenshot or printed copy of the results can make those chats easier.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Disclaimer;