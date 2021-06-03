/// <reference types="react" />
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
export declare type TranslationFunction = (src: string) => string;
export default class Translation {
    private packages;
    currentLanguage: string;
    getContextByDomains: (language: string, ...domains: string[]) => LanguagePackageContext;
    constructor(currentLanguage: string, ...packages: LanguagePackage[]);
}
export declare const Provider: (props: ProviderProps) => JSX.Element;
export declare type TranslationHelper = {
    t: TranslationFunction;
};
export declare const useTranslation: (domains: string[]) => TranslationHelper;
