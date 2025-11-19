import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    title: 'Kidney Disease Classification',
    subtitle: 'Upload a CT Scan image to detect Normal or Tumor',
    uploadText: 'Drag & drop your CT scan image here or click to browse',
    predict: 'Analyze Image',
    result: 'Analysis Result',
    normal: 'Normal Kidney',
    tumor: 'Kidney Tumor Detected',
    about: 'About Kidney Health',
    aboutText: 'Learn about kidney function, common diseases, and the importance of early detection through medical imaging.',
    howItWorks: 'How It Works',
    step1: 'Upload CT Scan',
    step1Desc: 'Upload your kidney CT scan image',
    step2: 'AI Analysis',
    step2Desc: 'Our AI analyzes the image for abnormalities',
    step3: 'Get Results',
    step3Desc: 'Receive instant classification results',
    kidneyFacts: 'Kidney Facts',
    fact1: 'Kidneys filter 120-150 quarts of blood daily',
    fact2: 'Each kidney contains about 1 million nephrons',
    fact3: 'Early detection can prevent kidney failure',
    disclaimer: 'Medical Disclaimer',
    disclaimerText: 'This tool is for educational purposes only and should not replace professional medical diagnosis.',
    symptoms: 'Common Symptoms',
    symptom1: 'Changes in urination',
    symptom2: 'Fatigue and weakness',
    symptom3: 'Swelling in legs or feet',
    symptom4: 'Persistent back pain',
    prevention: 'Prevention Tips',
    tip1: 'Stay hydrated with plenty of water',
    tip2: 'Maintain a healthy diet',
    tip3: 'Exercise regularly',
    tip4: 'Avoid smoking and excessive alcohol'
  },
  es: {
    title: 'Clasificación de Enfermedades Renales',
    subtitle: 'Sube una imagen de tomografía para detectar Normal o Tumor',
    uploadText: 'Arrastra y suelta tu imagen de tomografía aquí o haz clic para navegar',
    predict: 'Analizar Imagen',
    result: 'Resultado del Análisis',
    normal: 'Riñón Normal',
    tumor: 'Tumor Renal Detectado',
    about: 'Sobre la Salud Renal',
    aboutText: 'Aprende sobre la función renal, enfermedades comunes y la importancia de la detección temprana.',
    howItWorks: 'Cómo Funciona',
    step1: 'Subir Tomografía',
    step1Desc: 'Sube tu imagen de tomografía renal',
    step2: 'Análisis de IA',
    step2Desc: 'Nuestra IA analiza la imagen en busca de anomalías',
    step3: 'Obtener Resultados',
    step3Desc: 'Recibe resultados de clasificación instantáneos',
    kidneyFacts: 'Datos Renales',
    fact1: 'Los riñones filtran 120-150 litros de sangre diariamente',
    fact2: 'Cada riñón contiene aproximadamente 1 millón de nefronas',
    fact3: 'La detección temprana puede prevenir la insuficiencia renal',
    disclaimer: 'Descargo Médico',
    disclaimerText: 'Esta herramienta es solo para fines educativos y no debe reemplazar el diagnóstico médico profesional.',
    symptoms: 'Síntomas Comunes',
    symptom1: 'Cambios en la micción',
    symptom2: 'Fatiga y debilidad',
    symptom3: 'Hinchazón en piernas o pies',
    symptom4: 'Dolor persistente de espalda',
    prevention: 'Consejos de Prevención',
    tip1: 'Mantente hidratado con abundante agua',
    tip2: 'Mantén una dieta saludable',
    tip3: 'Ejercítate regularmente',
    tip4: 'Evita fumar y el alcohol excesivo'
  },
  fr: {
    title: 'Classification des Maladies Rénales',
    subtitle: 'Téléchargez une image de scanner pour détecter Normal ou Tumeur',
    uploadText: 'Glissez-déposez votre image de scanner ici ou cliquez pour parcourir',
    predict: 'Analyser l\'Image',
    result: 'Résultat de l\'Analyse',
    normal: 'Rein Normal',
    tumor: 'Tumeur Rénale Détectée',
    about: 'À Propos de la Santé Rénale',
    aboutText: 'Apprenez sur la fonction rénale, les maladies courantes et l\'importance de la détection précoce.',
    howItWorks: 'Comment Ça Marche',
    step1: 'Télécharger Scanner',
    step1Desc: 'Téléchargez votre image de scanner rénal',
    step2: 'Analyse IA',
    step2Desc: 'Notre IA analyse l\'image pour détecter des anomalies',
    step3: 'Obtenir Résultats',
    step3Desc: 'Recevez des résultats de classification instantanés',
    kidneyFacts: 'Faits Rénaux',
    fact1: 'Les reins filtrent 120-150 litres de sang quotidiennement',
    fact2: 'Chaque rein contient environ 1 million de néphrons',
    fact3: 'La détection précoce peut prévenir l\'insuffisance rénale',
    disclaimer: 'Avertissement Médical',
    disclaimerText: 'Cet outil est à des fins éducatives uniquement et ne doit pas remplacer un diagnostic médical professionnel.',
    symptoms: 'Symptômes Courants',
    symptom1: 'Changements dans la miction',
    symptom2: 'Fatigue et faiblesse',
    symptom3: 'Gonflement des jambes ou des pieds',
    symptom4: 'Douleur dorsale persistante',
    prevention: 'Conseils de Prévention',
    tip1: 'Restez hydraté avec beaucoup d\'eau',
    tip2: 'Maintenez une alimentation saine',
    tip3: 'Exercez-vous régulièrement',
    tip4: 'Évitez de fumer et l\'alcool excessif'
  },
  de: {
    title: 'Nierenerkrankung Klassifikation',
    subtitle: 'Laden Sie ein CT-Bild hoch, um Normal oder Tumor zu erkennen',
    uploadText: 'Ziehen Sie Ihr CT-Bild hierher oder klicken Sie zum Durchsuchen',
    predict: 'Bild Analysieren',
    result: 'Analyseergebnis',
    normal: 'Normale Niere',
    tumor: 'Nierentumor Erkannt',
    about: 'Über Nierengesundheit',
    aboutText: 'Erfahren Sie über Nierenfunktion, häufige Krankheiten und die Bedeutung der Früherkennung.',
    howItWorks: 'Wie es Funktioniert',
    step1: 'CT-Scan Hochladen',
    step1Desc: 'Laden Sie Ihr Nieren-CT-Bild hoch',
    step2: 'KI-Analyse',
    step2Desc: 'Unsere KI analysiert das Bild auf Anomalien',
    step3: 'Ergebnisse Erhalten',
    step3Desc: 'Erhalten Sie sofortige Klassifikationsergebnisse',
    kidneyFacts: 'Nierenfakten',
    fact1: 'Nieren filtern täglich 120-150 Liter Blut',
    fact2: 'Jede Niere enthält etwa 1 Million Nephrone',
    fact3: 'Früherkennung kann Nierenversagen verhindern',
    disclaimer: 'Medizinischer Haftungsausschluss',
    disclaimerText: 'Dieses Tool dient nur zu Bildungszwecken und sollte keine professionelle medizinische Diagnose ersetzen.',
    symptoms: 'Häufige Symptome',
    symptom1: 'Veränderungen beim Wasserlassen',
    symptom2: 'Müdigkeit und Schwäche',
    symptom3: 'Schwellungen in Beinen oder Füßen',
    symptom4: 'Anhaltende Rückenschmerzen',
    prevention: 'Präventionsratschläge',
    tip1: 'Bleiben Sie mit viel Wasser hydratisiert',
    tip2: 'Halten Sie eine gesunde Ernährung',
    tip3: 'Trainieren Sie regelmäßig',
    tip4: 'Vermeiden Sie Rauchen und übermäßigen Alkohol'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};