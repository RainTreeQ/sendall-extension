import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LOCALE_STORAGE_KEY = "siteLocale";
const THEME_STORAGE_KEY = "siteThemeMode";

const SUPPORTED_LOCALES = [
  { code: "en", label: "English" },
  { code: "zh-CN", label: "简体中文" },
  { code: "zh-TW", label: "繁體中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
];

const PLANNED_LOCALES = [
  { code: "ru", label: "Русский" },
  { code: "pt", label: "Português" },
  { code: "ar", label: "العربية" },
];

const THEME_MODES = ["system", "light", "dark"];

const SiteSettingsContext = createContext(null);

function normalizeLocale(raw) {
  const input = String(raw || "").toLowerCase();
  if (input.startsWith("zh-tw") || input.startsWith("zh-hk")) return "zh-TW";
  if (input.startsWith("zh")) return "zh-CN";
  if (input.startsWith("ja")) return "ja";
  if (input.startsWith("ko")) return "ko";
  if (input.startsWith("es")) return "es";
  if (input.startsWith("de")) return "de";
  if (input.startsWith("fr")) return "fr";
  return "en";
}

function getInitialLocale() {
  if (typeof window === "undefined") return "en";
  try {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved) return normalizeLocale(saved);
  } catch {
    // noop
  }
  if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
    const supportedCodes = SUPPORTED_LOCALES.map(l => l.code);
    for (const locale of navigator.languages) {
      const normalized = normalizeLocale(locale);
      if (supportedCodes.includes(normalized) && normalized !== "en") return normalized;
    }
  }
  return normalizeLocale(navigator.language);
}

function getInitialThemeMode() {
  if (typeof window === "undefined") return "system";
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && THEME_MODES.includes(saved)) return saved;
  } catch {
    // noop
  }
  return "system";
}

function getSystemPrefersDark() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveThemeMode(themeMode) {
  if (themeMode === "dark") return "dark";
  if (themeMode === "light") return "light";
  return getSystemPrefersDark() ? "dark" : "light";
}

export function SiteSettingsProvider({ children }) {
  const [locale, setLocale] = useState(getInitialLocale);
  const [themeMode, setThemeMode] = useState(getInitialThemeMode);
  const [resolvedTheme, setResolvedTheme] = useState(() => resolveThemeMode(getInitialThemeMode()));

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // noop
    }
    document.documentElement.setAttribute("lang", locale);
  }, [locale]);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    } catch {
      // noop
    }

    const applyTheme = () => {
      const next = resolveThemeMode(themeMode);
      setResolvedTheme(next);
      document.documentElement.classList.toggle("dark", next === "dark");
      document.documentElement.setAttribute("data-theme-mode", themeMode);
    };

    applyTheme();

    if (!window.matchMedia) return undefined;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (themeMode === "system") applyTheme();
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [themeMode]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      supportedLocales: SUPPORTED_LOCALES,
      plannedLocales: PLANNED_LOCALES,
      themeMode,
      setThemeMode,
      resolvedTheme,
    }),
    [locale, themeMode, resolvedTheme]
  );

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  }
  return ctx;
}
