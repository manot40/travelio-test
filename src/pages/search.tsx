import type { AxiosError } from 'axios';
import type { GetServerSideProps } from 'next/types';

import { fetcher, qsFormat } from '@/utils';

import { useUrlQuery } from '@/hooks';
import { useSearchStore } from '@/store/search';
import { useCallback, useEffect, useState } from 'react';

import { Flex, Stack } from '@mantine/core';
import { Result } from '@/components/reusable';

import BookList from '@/components/BookList';
import IntersectionLoader from '@/components/IntersectionLoader';

type SearchPageProps = {
  _books: VolumeInfo[];
  _query: {
    q: string;
    startIndex: number;
    maxResults: number;
  };
};

export default function Search({ _books, _query }: SearchPageProps) {
  const { query, setQuery } = useUrlQuery(_query);
  const [setSearch, setLoading] = useSearchStore((s) => [s.setSearch, s.setLoading]);

  const [books, setBooks] = useState<VolumeInfo[]>(_books);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    setSearch(_query.q);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setBooks(_books);
    setLoading(false);
    // eslint-disable-next-line
  }, [_books]);

  const handleLoadMore = useCallback(() => {
    const q = { ...query, startIndex: query.startIndex! + query.maxResults! };
    setQuery(q);
    runtimeBookFetcher(q, setBooks, setError);
    // eslint-disable-next-line
  }, [query]);

  if (error)
    return (
      <Flex align="center" justify="center" h="50vh">
        <Result title="Ouch" message="Something went wrong when trying to get books data" />
      </Flex>
    );

  return (
    <Flex justify={{ base: 'center', md: 'inherit' }} ml={{ base: 0, md: 180 }} px="md">
      <Stack w={{ base: '100%', md: 640 }}>
        <Stack spacing="md">
          <BookList books={books} />
        </Stack>
        <Flex w="100%" justify="center">
          <IntersectionLoader cb={handleLoadMore} />
        </Flex>
      </Stack>
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  const { q, startIndex = 0, maxResults = 20 } = query as Record<string, string | number>;

  if (!q)
    return {
      redirect: { destination: '/', permanent: false },
    };

  try {
    const _books = await bookFetcher({ q, startIndex, maxResults });
    return { props: { _books, _query: { q, startIndex, maxResults } } };
  } catch (err) {
    res.statusCode = 500;
    return { props: { error: err } };
  }
};

async function bookFetcher(query: Record<string, string | number>) {
  return await fetcher
    .get<GoogleAPIRes<Book>>(`/volumes?${qsFormat({ ...query })}`)
    .then((b) => b.items.map((d) => d.volumeInfo));
}

async function runtimeBookFetcher(query: Record<string, string | number>, bookMutator: any, errorMutator: any) {
  try {
    const res = await bookFetcher(query);
    bookMutator((prev: VolumeInfo[]) => {
      errorMutator(null);
      const newBooks = res.filter((v1) => prev.findIndex((v2) => v2.title === v1.title) == -1);
      return [...prev, ...newBooks];
    });
  } catch (err) {
    errorMutator(err);
  }
}
