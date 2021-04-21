import type { Composer } from 'vue-i18n';
export default function withMessagesFetch(i18n: Composer, fetchMessages: any): {
    t: {
        (key: string | number): string;
        (key: string | number, plural: number, options?: import("vue-i18n").TranslateOptions): string;
        (key: string | number, defaultMsg: string, options?: import("vue-i18n").TranslateOptions): string;
        (key: string | number, list: unknown[], options?: import("vue-i18n").TranslateOptions): string;
        (key: string | number, list: unknown[], plural: number): string;
        (key: string | number, list: unknown[], defaultMsg: string): string;
        (key: string | number, named: Record<string, unknown>, options?: import("vue-i18n").TranslateOptions): string;
        (key: string | number, named: Record<string, unknown>, plural: number): string;
        (key: string | number, named: Record<string, unknown>, defaultMsg: string): string;
    };
};
