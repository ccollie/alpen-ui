import React from 'react';
import { isString } from './assertion';

// utils.ts
// https://javascript.plainenglish.io/a-cleaner-api-for-react-ts-components-47d0704a508c
export type GetComponentProps<T> = T extends
  | React.ComponentType<infer P>
  | React.Component<infer P>
  ? P
  : never;

export function randomId(): string {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  return uint32.toString(16);
}

export function hash(x: string): number {
  let h, i, l;
  for (h = 5381 | 0, i = 0, l = x.length | 0; i < l; i++) {
    h = (h << 5) + h + x.charCodeAt(i);
  }
  return h >>> 0;
}

export function safeParse(item: unknown): any {
  try {
    if (!isString(item)) return item;
    const str = item as string;

    if (!str.length) {
      return item;
    }

    return JSON.parse(str);
  } catch (e) {
    return item;
  }
}

export const ucFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

export function attempt(
  fn: () => void | Promise<void>,
  retries = 1,
  delayBetweenTries = 500,
): Promise<void> {
  function wrapFn(fn: () => void | Promise<void>): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        resolve(fn());
      } catch (err) {
        reject(err);
      }
    });
  }

  return wrapFn(fn).catch((err) => {
    if (retries > 1) {
      return delay(delayBetweenTries).then(() =>
        attempt(fn, retries - 1, delayBetweenTries * 2),
      );
    } else {
      return Promise.reject(err);
    }
  });
}

const omitDeepArrayWalk = (arr: any[], key: string): any[] => {
  return arr.map((val) => {
    if (Array.isArray(val)) return omitDeepArrayWalk(val, key);
    else if (typeof val === 'object') return omitDeep(val, key);
    return val;
  });
};

export const omitDeep = (obj: Record<string, any>, key: string) => {
  const newObj: Record<string, any> = Object.create(null);
  if (!obj) {
    return newObj;
  }
  const keys = Object.keys(obj);
  keys.forEach((i) => {
    if (i !== key) {
      const val = obj[i];
      if (val instanceof Date) {
        newObj[i] = val;
      } else if (Array.isArray(val)) {
        newObj[i] = omitDeepArrayWalk(val, key);
      } else if (typeof val === 'object' && val !== null) {
        newObj[i] = omitDeep(val, key);
      } else newObj[i] = val;
    }
  });
  return newObj;
};

export function getNestedValue(obj: Record<string, any>, key: string): any {
  return key.split('.').reduce((result, key) => {
    return result[key];
  }, obj);
}

export function isNil(value: unknown): boolean {
  return value === null || value === undefined;
}

export const TYPENAME_FIELD = '__typename';

export const removeTypename = (
  obj: Record<string, any>,
): Record<string, any> | null => {
  return obj ? omitDeep(obj, TYPENAME_FIELD) : null;
};

export function roundNumber(num: number, dec = 1): string {
  const result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
  let resultAsString = result.toString();
  if (resultAsString.indexOf('.') === -1) {
    resultAsString = resultAsString + '.0';
  }
  return resultAsString;
}

export const escapeRegExp = (text: string) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

export const toBool = (val: unknown): boolean => {
  const type = typeof val;
  if (type === 'boolean') return val as boolean;
  if (type === 'number') return !!(val as number);
  if (['true', '1'].includes(`${val}`)) return true;
  return false;
};

export function stringify(obj: Record<string, any>): string {
  return JSON.stringify(obj)
    .replace(/ ?\n ? ?/g, '')
    .replace(/ {2,}/g, ' ');
}

export const downloadFile = async (
  data: unknown,
  filename: string,
): Promise<void> => {
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: 'application/json' });
  const href = await URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = filename + '.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export function exportToJson(objectData: unknown, filename: string) {
  const contentType = 'application/json;charset=utf-8;';
  const json = JSON.stringify(objectData);
  // @ts-ignore
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    const blob = new Blob([decodeURIComponent(encodeURI(json))], {
      type: contentType,
    });
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    const a = document.createElement('a');
    a.download = filename;
    a.href = 'data:' + contentType + ',' + encodeURIComponent(json);
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
