"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "np";

export interface Translations {
  // MemberReport component
  memberRegistrationReport: string;
  startDate: string;
  toDate: string;
  generateReport: string;
  generating: string;
  error: string;
  generatingReport: string;
  clickGenerateReport: string;

  // ReportNavigation component
  pageOf: string;
  show: string;
  perPage: string;
  search: string;
  find: string;
  next: string;
  print: string;
  pdf: string;
  word: string;
  excel: string;
  image: string;
  totalRecords: string;

  // Navbar
  home: string;
  about: string;
  Contact: string;
  english: string;
  nepali: string;
}

const translations: Record<Language, Translations> = {
  en: {
    memberRegistrationReport: "MemberRegistration Report",
    startDate: "Start Date:",
    toDate: "To Date:",
    generateReport: "Generate Report",
    generating: "Generating...",
    error: "Error",
    generatingReport: "Generating report...",
    clickGenerateReport:
      'Click "Generate Report" to view the transaction report',
    pageOf: "Page {currentPage} of {totalPages}",
    show: "Show:",
    perPage: "per page",
    search: "Search...",
    find: "Find",
    next: "Next",
    print: "Print",
    pdf: "PDF",
    word: "Word",
    excel: "Excel",
    image: "Image",
    totalRecords: "Total Records: {totalRecords}",
    home: "Home",
    about: "About",
    Contact: "Contact",
    english: "English",
    nepali: "Nepali",
  },
  np: {
    memberRegistrationReport: "सदस्य दर्ता रिपोर्ट",
    startDate: "सुरु मिति:",
    toDate: "अन्तिम मिति:",
    generateReport: "रिपोर्ट उत्पन्न गर्नुहोस्",
    generating: "उत्पन्न हुँदैछ...",
    error: "त्रुटि",
    generatingReport: "रिपोर्ट उत्पन्न हुँदैछ...",
    clickGenerateReport:
      'कारोबार रिपोर्ट हेर्न "रिपोर्ट उत्पन्न गर्नुहोस्" क्लिक गर्नुहोस्',
    pageOf: "पृष्ठ {currentPage} को {totalPages}",
    show: "देखाउनुहोस्:",
    perPage: "प्रति पृष्ठ",
    search: "खोज्नुहोस्...",
    find: "फेला पार्नुहोस्",
    next: "अर्को",
    print: "प्रिन्ट",
    pdf: "PDF",
    word: "शब्द",
    excel: "एक्सेल",
    image: "छवि",
    totalRecords: "कुल रेकर्डहरू: {totalRecords}",
    home: "गृह",
    about: "हाम्रो बारेमा",
    Contact: "सम्पर्क गर्नुहोस्",
    english: "अंग्रेजी",
    nepali: "नेपाली",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
  interpolate: (
    text: string,
    values: Record<string, string | number>,
  ) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: keyof Translations): string => {
    return translations[language][key];
  };

  const interpolate = (
    text: string,
    values: Record<string, string | number>,
  ): string => {
    return text.replace(/{(\w+)}/g, (match, key) => {
      return values[key]?.toString() || match;
    });
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    interpolate,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
