import { Types, type FilterQuery, type Model, type SortOrder, type LeanDocument as L, LeanDocument } from 'mongoose';

type ModelDoc<T> = T extends Model<infer U> ? U : never;

type FilterSortOpts<D> = {
  exclusion?: (keyof LeanDocument<D>)[];
  initialFilter?: { $and: FilterQuery<D>[]; $or: FilterQuery<D>[] };
};

export function filterSortQuery<T extends Model<any>, D extends ModelDoc<T>>(
  model: T,
  query: Partial<Record<string, string | string[]>>,
  { exclusion = [], initialFilter } = {} as FilterSortOpts<D>
) {
  const reqQ = { ...query },
    sort = {} as Record<keyof T, SortOrder>,
    projection = [] as (keyof T)[],
    filter = initialFilter || {
      $and: [] as FilterQuery<T>[],
      $or: [] as FilterQuery<T>[],
    };

  const _sort = reqQ._sort + '',
    _order = reqQ._order + '',
    _select = reqQ._select + '';

  delete reqQ._sort;
  delete reqQ._order;
  delete reqQ._start;
  delete reqQ._end;
  delete reqQ._limit;

  Object.keys(reqQ).forEach((qKey) => {
    if (exclusion.length && exclusion.findIndex((e) => e.toString().includes(qKey)) > -1) {
      delete reqQ[qKey];
      return;
    }
    const mKeys = Object.keys(model.schema.paths);
    if (mKeys.includes(qKey)) {
      const filterEligible = !qKey.includes('_') && !qKey.startsWith('_') && !Array.isArray(reqQ[qKey]);
      if (filterEligible) filter.$or.push({ [qKey as D]: reqQ[qKey] });
      return;
    }

    if (!/(_lte|_gte|_ne|_like|_in)$/.test(qKey)) delete reqQ[qKey];
  });

  Object.keys(reqQ).forEach((key) => {
    if (key !== 'callback' && key !== '_') {
      const val = Array.isArray(reqQ[key]) ? reqQ[key]?.[0] : (reqQ[key] as string);
      if (!val) return;

      const isDifferent = /_ne$/.test(key);
      const isRange = /_lte$/.test(key) || /_gte$/.test(key);
      const isLike = /_like$/.test(key);
      const isIn = /_in$/.test(key);
      const path = key.replace(/(_lte|_gte|_ne|_like|_in)$/, '') as D;

      if (isRange) {
        filter.$and.push({ [path]: { $gte: val, $lte: val } });
      } else if (isDifferent) {
        filter.$and.push({ [path]: { $ne: val } });
      } else if (isLike) {
        filter.$and.push({ [path]: { $regex: val, $options: 'i' } });
      } else if (isIn) {
        filter.$and.push({ [path]: { $in: val.split(',') } });
      } else {
        //filter.$and.push({ [path]: { $in: val } });
      }
    }
  });

  // Sort
  if (_sort !== 'undefined') {
    const _sortSet = _sort.split(',');
    const _orderSet = _order.split(',').map((s) => s.toLowerCase());

    _sortSet.forEach((key, index) => {
      sort[key as keyof T] = _orderSet[index] === 'desc' ? -1 : 1;
    });
  } else {
    // @ts-ignore
    sort.createdAt = -1;
  }

  if (_select !== 'undefined') {
    const _selectSet = _select.split(',');

    _selectSet.forEach((key) => {
      projection.push(key as D);
    });

    if (!_selectSet.includes('_id')) projection.push('_id' as D);
  }

  return { filter, sort, projection };
}

export async function paginationQuery<T extends Model<any>, D extends ModelDoc<T>, L extends LeanDocument<D>>(
  model: T,
  query: Partial<Record<string, string | string[]>>,
  opts: FilterSortOpts<L> & { populate?: [keyof L, string][] | (keyof L)[] } = {}
) {
  const reqQ = { ...query };

  const start = reqQ._start as string,
    page = isNaN(+reqQ._page!) ? 1 : +reqQ._page! || 1,
    limit = isNaN(+reqQ._limit!) ? 10 : +reqQ._limit! || 10;

  const { filter, sort, projection } = filterSortQuery(model, reqQ, opts);

  if (start) {
    if (!Types.ObjectId.isValid(start)) throw new Error('Invalid start id');
    filter.$and.push({ _id: { $lt: start } });
  }

  let dbQuery = model.find(filter).sort(sort).select(projection),
    totalItems,
    totalPage;

  if (!start) {
    totalItems = await model.count(filter);
    totalPage = totalItems ? Math.ceil(totalItems / limit) : 0;
    dbQuery = dbQuery.skip((page - 1) * limit).limit(limit);
  }

  if (opts.populate)
    opts.populate.forEach((p) => {
      if (Array.isArray(p)) dbQuery = dbQuery.populate(p[0] as string, p[1]);
      else dbQuery = dbQuery.populate(p.toString());
    });

  const result: L[] = await dbQuery.lean();

  return { result, totalItems, totalPage };
}
