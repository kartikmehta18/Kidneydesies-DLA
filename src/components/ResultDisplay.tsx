import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, AlertTriangle, Download, Share2 } from 'lucide-react';

interface ResultDisplayProps {
  result: 'normal' | 'tumor' | null;
  confidence?: number;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, confidence, onReset }) => {
  const { t } = useLanguage();

  if (!result) return null;

  const isNormal = result === 'normal';
  const resultText = isNormal ? t('normal') : t('tumor');
  const Icon = isNormal ? CheckCircle : AlertTriangle;
  const badgeVariant = isNormal ? 'default' : 'destructive';
  const cardClass = isNormal 
    ? 'border-medical-success shadow-green-100 dark:shadow-green-900/20' 
    : 'border-medical-error shadow-red-100 dark:shadow-red-900/20';

  return (
    <Card className={`shadow-card-medical transition-all duration-500 animate-slide-in ${cardClass}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Icon className={`h-6 w-6 ${isNormal ? 'text-medical-success' : 'text-medical-error'}`} />
            <span>{t('result')}</span>
          </span>
          <Badge variant={badgeVariant} className="text-sm">
            {confidence && `${(confidence * 100).toFixed(1)}% confidence`}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-6">
          <div className={`text-4xl font-bold ${isNormal ? 'text-medical-success' : 'text-medical-error'}`}>
            {resultText}
          </div>
          
          {!isNormal && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm text-destructive">
                <strong>Important:</strong> This result indicates potential abnormalities. 
                Please consult with a healthcare professional for proper diagnosis and treatment.
              </p>
            </div>
          )}

          {isNormal && (
            <div className="bg-medical-success/10 border border-medical-success/20 rounded-lg p-4">
              <p className="text-sm text-medical-success">
                <strong>Good news:</strong> The analysis suggests normal kidney tissue. 
                Continue regular check-ups to maintain kidney health.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share Results
            </Button>
            <Button variant="medical" size="sm" onClick={onReset}>
              Analyze Another Image
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;