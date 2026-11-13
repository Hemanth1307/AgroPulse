
import { useEffect, useRef } from "react";

const GOOGLE_LANGUAGES = "en,kn,te,hi,ta,ml";

export default function GoogleTranslateRuntime({ language = "en" }) {
    const appliedLanguage = useRef(null);

    useEffect(() => {
        const style = document.createElement("style");
        style.id = "agropulse-google-translate-style";

        style.textContent = `
            .goog-te-banner-frame,
            iframe.goog-te-banner-frame {
                display: none !important;
            }

            body {
                top: 0 !important;
            }

            .goog-te-gadget {
                font-size: 0 !important;
            }

            #google_translate_element {
                position: fixed !important;
                left: -10000px !important;
                top: 0 !important;
                width: 1px !important;
                height: 1px !important;
                overflow: hidden !important;
            }

            .goog-logo-link,
            .goog-te-gadget span {
                display: none !important;
            }
        `;

        document.head.appendChild(style);

        const target = document.getElementById(
            "google_translate_element"
        );

        if (!target) return () => style.remove();

        function applyLanguage() {
            const combo = document.querySelector(
                ".goog-te-combo"
            );

            if (!combo) return;

            if (appliedLanguage.current === language) return;

            combo.value = language === "en" ? "" : language;

            combo.dispatchEvent(
                new Event("change", { bubbles: true })
            );

            appliedLanguage.current = language;
        }

        window.googleTranslateElementInit = () => {
            if (!window.google?.translate?.TranslateElement) {
                return;
            }

            if (target.dataset.ready !== "true") {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: "en",
                        includedLanguages: GOOGLE_LANGUAGES,
                        autoDisplay: false,
                        multilanguagePage: true,
                    },
                    "google_translate_element"
                );

                target.dataset.ready = "true";
            }

            setTimeout(applyLanguage, 700);
        };

        if (
            window.google?.translate?.TranslateElement
        ) {
            window.googleTranslateElementInit();
        } else {
            let script = document.getElementById(
                "google-translate-script"
            );

            if (!script) {
                script = document.createElement("script");
                script.id = "google-translate-script";
                script.src =
                    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
                script.async = true;
                document.body.appendChild(script);
            }
        }

        const observer = new MutationObserver(() => {
            applyLanguage();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => {
            observer.disconnect();
            style.remove();
        };
    }, [language]);

    return (
        <div
            id="google_translate_element"
            aria-hidden="true"
        />
    );
}
