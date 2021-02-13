export function trimLabel(s: string | number, max = 16): string {
  if (typeof s !== 'string') {
    return s + '';
  }

  s = s.trim();
  if (s.length <= max) {
    return s;
  } else {
    return `${s.slice(0, max)}...`;
  }
}

/**
 * Formats a label given a date, number or string.
 *
 * @export
 */
export function formatLabel(label: any): string {
  if (label instanceof Date) {
    label = label.toLocaleDateString();
  } else {
    label = label.toLocaleString();
  }

  return label;
}

/**
 * Escapes a label.
 *
 * @export
 */
export function escapeLabel(label: any): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    // tslint:disable-next-line: quotemark
    "'": '&#x27;',
    '`': '&#x60;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;',
  };
  return label.toLocaleString().replace(/[&'`"<>]/g, (match: string) => {
    return map[match];
  });
}
