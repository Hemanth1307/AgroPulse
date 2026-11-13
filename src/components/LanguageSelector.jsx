
import { useLanguage } from "./LanguageContext";

export default function LanguageSelector() {
    const { language, setLanguage, languages } = useLanguage();

    return (
        <div className="healthai-language-selector">
            <label htmlFor="agropulse-language">
                🌐 Language
            </label>

            <select
                id="agropulse-language"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
            >
                {languages.map((item) => (
                    <option key={item.code} value={item.code}>
                        {item.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
