import * as vscode from 'vscode';
import localeEn from '../package.nls.json';
import localeJa from '../package.nls.ja.json';

export type LocaleKeyType = keyof typeof localeEn;

interface LocaleEntry {
  [key: string]: string;
}

const localeTableKey = vscode.env.language;
const localeTable = Object.assign(
  localeEn,
  (<{ [key: string]: LocaleEntry }>{
    ja: localeJa,
  })[localeTableKey] || {}
);

/**
 * Return localized string
 * @param key
 * @returns localized string
 */
export const localeString = (key: string): string => localeTable[key] || key;

/**
 * Return localized string by predefined key
 * @param key
 * @returns localized string
 */
export const localeMap = (key: LocaleKeyType): string => localeString(key);
