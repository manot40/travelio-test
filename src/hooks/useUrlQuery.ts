import { useCallback, useReducer } from 'react';

type Query<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type Reducer<T, K extends keyof T> = {
  mutator: Partial<T> | ((prev: Query<T, K>) => Query<T, K>);
  persistAll?: boolean;
};

export const useUrlQuery = <T, K extends keyof T>(
  initialState: Query<T, K>,
  optionalQuery: K[] = [],
  cb?: (q: Query<T, K>) => void
) => {
  const [query, _setQuery] = useReducer((prev: Query<T, K>, { mutator, persistAll = false }: Reducer<T, K>) => {
    let oldData: Query<T, K> = prev;
    const newData = typeof mutator === 'function' ? mutator(prev) : mutator;

    if (!persistAll && optionalQuery.length) {
      oldData = Object.keys(oldData).reduce((acc, _key) => {
        const key = _key as K;
        if (optionalQuery.findIndex((p) => key.toString().includes(p.toString())) == -1)
          acc[key] = oldData[key] as T[K];
        return acc;
      }, {} as T);
    }

    const result = { ...oldData, ...newData };
    if (cb) cb(result);
    return result;
  }, initialState);

  const setQuery = useCallback(
    (mutator: Reducer<T, K>['mutator'], opt?: Omit<Reducer<T, K>, 'mutator'>) => _setQuery({ mutator, ...opt }),
    []
  );

  return { query, setQuery };
};
