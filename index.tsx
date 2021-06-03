import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface LanguagePackage {
  language: string;
  domain: string;
  context: LanguagePackageContext;
}

export interface LanguagePackageContext {
  [key: string]: string;
}

export interface ProviderProps {
  children?: React.ReactNode;
  currentLanguage: string;
  packages?: LanguagePackage[];
}

export type TranslationFunction = (src: string) => string;

export default class Translation {
  private packages: LanguagePackage[];
  currentLanguage: string;

  getContextByDomains = (
    language: string,
    ...domains: string[]
  ): LanguagePackageContext => {
    let context: LanguagePackageContext = {};
    this.packages.map((pack) => {
      if (!domains.includes(pack.domain) || pack.language !== language) {
        return pack;
      }
      context = { ...context, ...pack.context };
      return pack;
    });
    return context;
  };

  constructor(currentLanguage: string, ...packages: LanguagePackage[]) {
    this.packages = [...packages];
    this.currentLanguage = currentLanguage;
  }
}

type TranslationContext =
  | [Translation, React.Dispatch<React.SetStateAction<Translation>>]
  | undefined;

const context = createContext<TranslationContext>(undefined);

export const Provider = (props: ProviderProps) => {
  const [translation, setTranslation] = useState(
    new Translation(props.currentLanguage, ...(props.packages || []))
  );

  useEffect(() => {
    if (!Array.isArray(props.packages)) return;
    setTranslation(new Translation(props.currentLanguage, ...props.packages));
  }, [props.packages, props.currentLanguage]);

  return (
    <context.Provider value={[translation, setTranslation]}>
      {props.children}
    </context.Provider>
  );
};

export type TranslationHelper = {
  t: TranslationFunction;
};

export const useTranslation = (domains: string[]): TranslationHelper => {
  const translationContext = useContext(context);
  if (!Array.isArray(translationContext) || translationContext.length !== 2) {
    throw Error("failed to load translation context.");
  }
  const [translation] = translationContext;
  const [
    languageContext,
    setLanguageContext,
  ] = useState<LanguagePackageContext>({});

  useEffect(() => {
    const langCtx = translation.getContextByDomains(
      translation.currentLanguage,
      ...domains
    );
    setLanguageContext(langCtx);
  }, [domains, translation]);

  const tranFn = useCallback(
    (src: string): string => {
      if (src in languageContext) {
        return languageContext[src];
      }
      return src;
    },
    [languageContext]
  );

  return {
    t: tranFn,
  };
};
