'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

if (!i18n.isInitialized) {
    i18n
        .use(HttpBackend)
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            fallbackLng: 'vi',
            supportedLngs: ['vi', 'en'],
            debug: false,//process.env.NODE_ENV === 'development',
            backend: {
                loadPath: '/locales/{{lng}}/{{ns}}.json',
                crossDomain: false,
                withCredentials: false
            },
            ns: ['common'],
            defaultNS: 'common',
            interpolation: { escapeValue: false },
            detection: {
                order: ['localStorage', 'navigator'],
                caches: ['localStorage']
            },
        });
}

export default i18n;