import type { AutoTableProps, ColumnSort } from './table';

import { memo, useMemo, useState } from 'react';
import { Table, Flex, Text, ScrollArea, Pagination, createStyles, LoadingOverlay } from '@mantine/core';

import { IconError404, IconArrowsSort, IconSortAscending, IconSortDescending } from '@tabler/icons-react';

export const AutoTable = memo<AutoTableProps<any>>(function AutoTable({
  id = 'id',
  data,
  footer,
  onClick,
  columns,
  isLoading,
  useScroll = true,
  pagination,
  wrapperProps,
  ...restProps
}) {
  const { classes } = useStyles();
  const [loading, setLoading] = useState(false);
  const [prevTable, setPrevTable] = useState(data);
  const [sortState, setSortState] = useState<ColumnSort<any>>({ key: '', order: '' });
  const [prevPaginate, setPrevPaginate] = useState(pagination ? pagination.total : 0);

  const Wrapper = useScroll ? ScrollArea : 'div';

  const headerElement = useMemo(
    () =>
      columns.map((column, index) => {
        const sortable = column.onSort || !!column.dataKey;
        const isCurrentlySort = column.dataKey === sortState.key;
        const Icon = sortState.order === 'asc' ? IconSortAscending : IconSortDescending;
        return (
          <th
            key={index}
            style={{ ...column.style, cursor: sortable ? 'pointer' : '', userSelect: 'none' }}
            onClick={() => {
              if (!sortable) return;
              const change = handleSortChange(sortState, column.dataKey as string);
              column.onSort?.(change);
              setSortState(change);
            }}
          >
            <Flex align="center" gap={4}>
              {column.onSort && (isCurrentlySort ? <Icon size={16} /> : <IconArrowsSort size={16} />)}
              {column.title}
            </Flex>
          </th>
        );
      }),
    [columns, sortState]
  );

  const tableData = useMemo(() => {
    setLoading(!data);
    if (!data && typeof prevTable == 'undefined') return [];
    if (!data) return prevTable!;

    const result = data.map((row, i) => (
      <tr key={row[id] || i} onClick={() => onClick?.(row)} style={{ cursor: onClick && 'pointer' }}>
        {columns.map((column, i) => {
          const cell = getNestedValue(row, column.dataKey);
          return <td key={column.idKey ? row[column.idKey] : i}>{row ? column.render?.(cell, row) || cell : null}</td>;
        })}
      </tr>
    ));

    setLoading(false);
    setPrevTable(result);
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const pageTotal = useMemo(() => {
    if (typeof pagination != 'boolean' && pagination) {
      if (!pagination.total) return prevPaginate;

      if (pagination.total !== prevPaginate) {
        setPrevPaginate(pagination.total);
        return pagination.total;
      }

      return prevPaginate;
    } else return 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  return (
    <Flex {...wrapperProps} direction="column">
      <Wrapper style={{ position: 'relative' }}>
        <LoadingOverlay zIndex={100} visible={typeof isLoading == 'boolean' ? isLoading : loading} />
        <Table {...restProps}>
          <thead className={classes.thead}>
            <tr>{headerElement}</tr>
          </thead>
          <tbody>{tableData}</tbody>
          {footer && !!tableData.length && (
            <tfoot>
              <tr>{headerElement}</tr>
            </tfoot>
          )}
        </Table>
        {!tableData.length && (
          <Flex h={200} align="center" justify="center">
            <div style={{ textAlign: 'center' }}>
              <IconError404 size={42} color="gray" />
              <Text color="dimmed">Nothing to show here</Text>
            </div>
          </Flex>
        )}
      </Wrapper>
      {pagination && <Pagination py={18} sx={{ alignSelf: 'center' }} {...pagination} total={pageTotal} />}
    </Flex>
  );
});

function handleSortChange(sort: ColumnSort<any>, currentKey?: string) {
  const { key, order } = sort;
  if (key === currentKey) {
    if (order === 'asc') return { key, order: 'desc' } as ColumnSort<any>;
    else return { key: '', order: '' } as ColumnSort<any>;
  } else return { key: currentKey || '', order: 'asc' } as ColumnSort<any>;
}

function getNestedValue<T>(obj: T, path: keyof T) {
  try {
    const _path = path as string;
    // @ts-ignore
    if (_path.includes('.')) return _path.split('.').reduce((acc, key) => acc && acc[key], obj);
    else return obj[path];
  } catch (e) {
    return undefined;
  }
}

const useStyles = createStyles((theme) => ({
  thead: {
    'tr th': {
      backgroundColor: theme.colors.gray[2],
      borderBottom: 'transparent !important',
      ':first-of-type': {
        borderTopLeftRadius: theme.radius.md,
        borderBottomLeftRadius: theme.radius.md,
      },
      ':last-of-type': {
        borderTopRightRadius: theme.radius.md,
        borderBottomRightRadius: theme.radius.md,
      },
    },
  },
}));
