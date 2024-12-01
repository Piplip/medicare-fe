import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18next
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
        lng: 'vi',
        fallbackLng: 'en',
        ns: ['common', 'homepage', 'findDoctor', 'appointmentRequest', 'admin'],
        defaultNS: 'common',
        debug: false,
        interpolation: {
            escapeValue: false
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        addPath: '/locales/add/{{lng}}/{{ns}}',
        saveMissing: true,
    })

export default i18next;