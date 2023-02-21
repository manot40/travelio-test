export function rangeSearch(search: string) {
  const split = search.split(' ');
  const labels = split.filter((label) => label.includes(':'));
  const q = split.filter((label) => !label.includes(':')).join(' ');

  if (!split[0]) return { q: '' };
  if (!labels[0]) return { q };

  const result = { q } as Record<string, string | number>;

  labels.forEach((label) => {
    const [key, mode, value] = label.split(':');
    if (!key || !mode || !value) return;
    switch (mode) {
      case 'gte':
        result[`${key}_gte`] = value;
        break;
      case 'lte':
        result[`${key}_lte`] = value;
        break;
      default:
        break;
    }
  });

  return result;
}
