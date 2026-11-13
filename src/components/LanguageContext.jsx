
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    LANGUAGES,
    getTranslation,
} from "./Translations";

const STORAGE_KEY = "agropulse-language";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (LANGUAGES.some((item) => item.code === saved)) {
                return saved;
            }
        } catch {
            // Ignore localStorage errors.
        }

        return "en";
    });

    function setLanguage(newLanguage) {
        if (!LANGUAGES.some((item) => item.code === newLanguage)) {
            return;
        }

        setLanguageState(newLanguage);
    }

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, language);
        } catch {
            // Ignore localStorage errors.
        }

        document.documentElement.lang = language;
    }, [language]);

    const value = useMemo(
        () => ({
            language,
            setLanguage,
            languages: LANGUAGES,
            t: (key) => getTranslation(language, key),
        }),
        [language]
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            "useLanguage must be used inside LanguageProvider"
        );
    }

    return context;
}
