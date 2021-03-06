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
  return ['true', '1'].includes(`${val}`);
};

export function stringify(obj: Record<string, any>): string {
  return JSON.stringify(obj)
    .replace(/ ?\n ? ?/g, '')
    .replace(/ {2,}/g, ' ');
}

export function exportToJson(objectData: unknown, filename: string) {
  const contentType = 'application/json;charset=utf-8;';
  const json = JSON.stringify(objectData);
  download(json, filename, contentType);
}

// https://github.com/kennethjiang/js-file-download
export function download(
  data: string | ArrayBuffer | ArrayBufferView | Blob,
  filename: string,
  mime?: string,
  bom?: string | Uint8Array,
): void {
  const blobData = typeof bom !== 'undefined' ? [bom, data] : [data];
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' });
  if (typeof (window.navigator as any).msSaveBlob !== 'undefined') {
    // IE workaround for "HTML7007: One or more blob URLs were
    // revoked by closing the blob for which they were created.
    // These URLs will no longer resolve as the data backing
    // the URL has been freed."
    (window.navigator as any).msSaveBlob(blob, filename);
  } else {
    const blobURL =
      window.URL && window.URL.createObjectURL
        ? window.URL.createObjectURL(blob)
        : window.webkitURL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);

    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }

    document.body.appendChild(tempLink);
    tempLink.click();

    // Fixes "webkit blob resource error 1"
    setTimeout(function () {
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobURL);
    }, 200);
  }
}

export function makeArray<T = any>(arr: T | T[]): T[] {
  if (arr === null || arr === undefined) return [];
  return Array.isArray(arr) ? arr : [arr];
}

export function areArraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

export function shallowEqual(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): boolean {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  const length = aKeys.length;

  if (length !== bKeys.length) {
    return false;
  }

  let index = -1;

  while (++index < length) {
    const key = aKeys[index];

    if (key !== bKeys[index] || a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}
