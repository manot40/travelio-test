export function qsFormat(query: Record<string, unknown>): string {
  return Object.keys(query)
    .map((key) => {
      const value = query[key];
      if (value === null || typeof value == 'undefined') return '';
      return `${key}=${value}`;
    })
    .join('&');
}

export function qsParse<T = Record<string, unknown>>(query: string): T {
  return query
    .split('&')
    .map((pair) => pair.split('='))
    .reduce((acc: Record<string, unknown>, [key, value]) => {
      const val = isNaN(+value) ? parseValue(value) : +value;
      if (key) acc[key] = val;
      return acc;
    }, {}) as T;
}

export function parseValue(val: string) {
  if (val === 'true') return true;
  if (val === 'false') return false;
  if (val === 'null') return null;
  return val;
}
