import { localeMap } from './locale';

/**
 * Format the template string with values from an object
 * If the value is not found in the object, throw an error
 * @param template The template string
 * @param valueObj The object containing the values
 * @returns string The formatted string
 * @example
 * format('Hello ${name}', { name: 'SeeLog' }); // Hello SeeLog
 */
export const fmt = (template: string, valueObj?: { [key: string]: string | number | null | undefined }): string => {
  return !valueObj
    ? template
    : template.replace(/\${(.*?)}/g, (match, key) => {
        if (valueObj[key] === undefined) {
          throw new Error(fmt(localeMap('commando.error.valueForKeyNotFound'), { key }));
        }
        return valueObj[key] as string;
      });
};
