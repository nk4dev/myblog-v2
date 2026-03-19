import { createClient } from 'microcms-js-sdk';

function readEnv(name: string): string {
    const viteEnv = import.meta.env?.[name as keyof ImportMetaEnv];
    const nodeEnv = typeof process !== 'undefined' ? process.env[name] : undefined;
    return String(viteEnv ?? nodeEnv ?? '').trim();
}

function normalizeServiceDomain(value: string): string {
    return value
        .replace(/^https?:\/\//, '')
        .replace(/\.microcms\.io$/i, '')
        .replace(/\/.*/, '')
        .trim();
}

const serviceDomain = normalizeServiceDomain(readEnv('VITE_MICROCMS_HOST') || readEnv('MICROCMS_HOST'));
const apiKey = readEnv('VITE_MICROCMS_API_KEY') || readEnv('MICROCMS_API_KEY');

if (!serviceDomain || !apiKey) {
    console.warn('[microCMS] Missing env vars. Set VITE_MICROCMS_HOST (or MICROCMS_HOST) and VITE_MICROCMS_API_KEY (or MICROCMS_API_KEY).');
}

export const client = createClient({
    serviceDomain,
    apiKey,
});