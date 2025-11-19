import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    title: ' Kidney Disease Classifier',
    subtitle: 'A calm space to upload CT scans, hear friendly explanations, and prepare for your next conversation with a clinician.',
    uploadText: 'Bring your CT scan here whenever you feel ready—we guide you in simple language.',
    predict: 'Begin gentle analysis',
    result: 'Personal insight',
    normal: 'Kidney tissue looks typical',
    tumor: 'Areas to discuss with your doctor',
    about: 'About Kidney Health',
    aboutText: 'Learn how your kidneys protect you, what warning signs to watch for, and why compassionate monitoring matters.',
    howItWorks: 'How It Works',
    step1: 'Upload CT Scan',
    step1Desc: 'Choose a CT scan image from your device at your own pace.',
    step2: 'AI Analysis',
    step2Desc: 'Our assistant reviews the image and highlights anything unusual.',
    step3: 'Get Results',
    step3Desc: 'Read a clear summary with suggested next steps for loved ones and clinicians.',
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
    title: 'Clasificador de Enfermedad Renal',
    subtitle: 'Un espacio tranquilo para subir tomografías, recibir explicaciones cercanas y prepararte para hablar con tu médico.',
    uploadText: 'Trae tu tomografía cuando te sientas listo; te acompañamos con lenguaje sencillo.',
    predict: 'Iniciar análisis amable',
    result: 'Guía personal',
    normal: 'El tejido renal luce habitual',
    tumor: 'Zonas para conversar con tu médico',
    about: 'Sobre la Salud Renal',
    aboutText: 'Descubre cómo tus riñones te protegen, qué señales vigilar y por qué un seguimiento compasivo es importante.',
    howItWorks: 'Cómo Funciona',
    step1: 'Subir Tomografía',
    step1Desc: 'Elige una imagen de tu dispositivo cuando lo desees.',
    step2: 'Análisis de IA',
    step2Desc: 'El asistente revisa la imagen y destaca lo relevante.',
    step3: 'Obtener Resultados',
    step3Desc: 'Lee un resumen claro con pasos sugeridos para tu círculo y tu médico.',
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
    title: 'Classificateur de Maladie Rénale',
    subtitle: 'Un lieu apaisant pour déposer vos scanners, obtenir des explications bienveillantes et vous préparer à échanger avec votre médecin.',
    uploadText: 'Importez votre scanner quand vous vous sentez prêt : nous vous guidons avec des mots simples.',
    predict: 'Lancer l’analyse en douceur',
    result: 'Point personnalisé',
    normal: 'Le tissu rénal paraît habituel',
    tumor: 'Zones à discuter avec un professionnel',
    about: 'À Propos de la Santé Rénale',
    aboutText: 'Comprenez comment vos reins vous protègent, les signaux d’alerte et l’importance d’un suivi empathique.',
    howItWorks: 'Comment Ça Marche',
    step1: 'Télécharger le Scanner',
    step1Desc: 'Choisissez une image sur votre appareil à votre rythme.',
    step2: 'Analyse IA',
    step2Desc: 'L’assistant examine l’image et met en lumière les points clés.',
    step3: 'Obtenir les Résultats',
    step3Desc: 'Recevez un résumé clair avec des prochaines étapes pour vos proches et votre médecin.',
    kidneyFacts: 'Faits Rénaux',
    fact1: 'Les reins filtrent 120-150 litres de sang quotidiennement',
    fact2: 'Chaque rein contient environ 1 million de néphrons',
    fact3: 'La détection précoce peut prévenir l\'insuffisance rénale',
    disclaimer: 'Avertissement Médical',
    disclaimerText: 'Cet outil est destiné à l’éducation et ne remplace pas un diagnostic médical professionnel.',
    symptoms: 'Symptômes Courants',
    symptom1: 'Changements dans la miction',
    symptom2: 'Fatigue et faiblesse',
    symptom3: 'Gonflement des jambes ou des pieds',
    symptom4: 'Douleur dorsale persistante',
    prevention: 'Conseils de Prévention',
    tip1: 'Restez hydraté avec beaucoup d\'eau',
    tip2: 'Maintenez une alimentation saine',
    tip3: 'Bougez régulièrement',
    tip4: 'Évitez le tabac et l’alcool excessif'
  },
  de: {
    title: 'Nierenkrankheits-Klassifikator',
    subtitle: 'Ein ruhiger Ort, um CT-Bilder hochzuladen, verständliche Erklärungen zu erhalten und sich auf das Gespräch mit Ärzt:innen vorzubereiten.',
    uploadText: 'Laden Sie Ihren Scan hoch, wenn es sich gut anfühlt – wir begleiten Sie mit klaren Worten.',
    predict: 'Sanfte Analyse starten',
    result: 'Persönlicher Hinweis',
    normal: 'Nierengewebe wirkt unauffällig',
    tumor: 'Bereiche für das Gespräch mit der Praxis',
    about: 'Über Nierengesundheit',
    aboutText: 'Erfahren Sie, wie die Nieren schützen, welche Signale wichtig sind und warum ein einfühlsames Monitoring zählt.',
    howItWorks: 'Wie es Funktioniert',
    step1: 'CT-Scan Hochladen',
    step1Desc: 'Wählen Sie ein Bild von Ihrem Gerät – ganz in Ruhe.',
    step2: 'KI-Analyse',
    step2Desc: 'Der Assistent prüft das Bild und hebt Auffälligkeiten hervor.',
    step3: 'Ergebnisse Erhalten',
    step3Desc: 'Lesen Sie eine verständliche Zusammenfassung mit nächsten Schritten.',
    kidneyFacts: 'Nierenfakten',
    fact1: 'Nieren filtern täglich 120-150 Liter Blut',
    fact2: 'Jede Niere enthält etwa 1 Million Nephrone',
    fact3: 'Früherkennung kann Nierenversagen verhindern',
    disclaimer: 'Medizinischer Hinweis',
    disclaimerText: 'Dieses Werkzeug dient Bildungszwecken und ersetzt keine ärztliche Diagnose.',
    symptoms: 'Häufige Symptome',
    symptom1: 'Veränderungen beim Wasserlassen',
    symptom2: 'Müdigkeit und Schwäche',
    symptom3: 'Schwellungen an Beinen oder Füßen',
    symptom4: 'Anhaltende Rückenschmerzen',
    prevention: 'Präventionsratschläge',
    tip1: 'Viel Wasser trinken',
    tip2: 'Ausgewogen ernähren',
    tip3: 'Regelmäßig bewegen',
    tip4: 'Rauchen und übermäßigen Alkohol meiden'
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