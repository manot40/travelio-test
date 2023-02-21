export type ColumnSort<T extends object> = {
  key: keyof T;
  order: 'asc' | 'desc' | '';
};

export type Column<T extends object> = {
  idKey?: keyof T;
  dataKey: keyof T;
  title: string;
  style?: React.CSSProperties;
  onSort?: (sort: ColumnSort<T>) => void;
  render?: (cell: T[Column['dataKey']], row: T) => React.ReactNode;
};

export type AutoTableProps<DataRecord extends object> = {
  id?: keyof DataRecord;
  data?: DataRecord[];
  footer?: boolean;
  onClick?: (row: DataRecord) => void;
  columns: TableColumns<DataRecord>;
  isLoading?: boolean;
  useScroll?: boolean;
  pagination?: import('@mantine/core').PaginationProps | false;
  wrapperProps?: import('@mantine/core').FlexProps;
} & import('@mantine/core').TableProps;

export type TableColumns<T> = Column<T>[];
