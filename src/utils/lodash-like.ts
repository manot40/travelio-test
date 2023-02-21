export function deepFreeze<T = {}>(obj: T): Readonly<T> {
  const propNames = Object.getOwnPropertyNames(obj);
  for (const name of propNames) {
    const _name = name as keyof typeof obj;
    const value = obj[_name];
    obj[_name] = (value && typeof value === 'object' ? deepFreeze(value) : value) as T[typeof _name];
  }
  return Object.freeze(obj);
}

export function prettyString(sentence: string) {
  return sentence
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1).toLocaleLowerCase())
    .join(' ');
}

export function pickTop<T extends { value: number }>(data: T[], limit = 10) {
  const _data = [...data].sort((a, b) => b.value - a.value);
  const topTen = _data.splice(0, limit);
  const others = _data.reduce((acc, curr) => acc + curr.value, 0);
  return [...topTen, { label: 'Others', value: others }];
}

export function debounce<T = any, P = any>(cb: (...args: P[]) => T, wait = 0) {
  let timeout: NodeJS.Timeout;
  return (...args: P[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb.apply(null, args);
    }, wait);
  };
}

export function throttleDebounce<T = any, P = any>(cb: (...args: P[]) => T, delay = 0) {
  let timeout: NodeJS.Timeout;
  let called: boolean;

  return (...args: P[]) => {
    if (timeout) clearTimeout(timeout);

    if (!called) {
      cb.apply(null, args);
      called = true;
      setTimeout(() => {
        called = false;
      }, delay);
    } else {
      timeout = setTimeout(cb, delay);
    }
  };
}
