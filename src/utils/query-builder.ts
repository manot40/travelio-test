import { Types, type FilterQuery, type Model, type SortOrder, type LeanDocument } from 'mongoose';

type ModelDoc<T> = T extends Model<infer U> ? U : never;

export function mongooseQueryBuilder<T extends Model<any>, D extends ModelDoc<T>>(
  model: T,
  query: Partial<Record<string, string | string[]>>,
  exclusion = [] as (keyof LeanDocument<D>)[]
) {
  const reqQ = { ...query };
  const filter = {
    $and: [] as FilterQuery<T>[],
    $or: [] as FilterQuery<T>[],
  };
  const sort = {} as Record<keyof T, SortOrder>;
  const projection = [] as (keyof T)[];

  let _sort = reqQ._sort as string,
    _order = reqQ._order as string,
    _select = reqQ._select as string;

  delete reqQ._sort;
  delete reqQ._order;

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
  if (_sort) {
    const _sortSet = _sort.split(',');
    const _orderSet = (_order || '').split(',').map((s) => s.toLowerCase());

    _sortSet.forEach((key, index) => {
      sort[key as keyof T] = _orderSet[index] === 'desc' ? -1 : 1;
    });
  }

  if (_select) {
    const _selectSet = _select.split(',');

    _selectSet.forEach((key) => {
      projection.push(key as D);
    });

    if (!_selectSet.includes('_id')) projection.push('_id' as D);
  }

  return { filter, sort, projection };
}

export async function mongoosePagination<T extends Model<any>, D extends ModelDoc<T>>(
  model: T,
  query: Partial<Record<string, string | string[]>>,
  exclusion: (keyof LeanDocument<D>)[] | Partial<ReturnType<typeof mongooseQueryBuilder>> = []
) {
  const reqQ = { ...query };

  let start = reqQ._start as string,
    page = isNaN(+(reqQ._page || '')) ? 1 : +(reqQ._page || '1'),
    limit = isNaN(+(reqQ._limit || '')) ? 10 : +(reqQ._limit || '10');

  delete reqQ._start;
  delete reqQ._end;
  delete reqQ._limit;

  const {
    filter,
    sort,
    projection = [],
  } = Array.isArray(exclusion) ? mongooseQueryBuilder(model, reqQ, exclusion) : exclusion;

  if (start) {
    if (Types.ObjectId.isValid(start)) filter.$and.push({ _id: { $lt: start } });
    const result: LeanDocument<D>[] = await model.find(filter).sort(sort).limit(limit).select(projection).lean();

    return { result };
  } else {
    const totalItems = await model.count(filter);
    const totalPage = totalItems ? Math.ceil(totalItems / limit) : 0;
    const result: LeanDocument<D>[] = await model
      .find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .select(projection)
      .lean();

    return { result, totalItems, totalPage };
  }
}
