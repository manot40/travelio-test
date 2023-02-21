import useSWR from 'swr';
import axios from 'axios';

import { useCallback } from 'react';
import { useUrlQuery } from '@/hooks';
import { useFavoriteStore } from '@/store/favorite';

import { qsFormat, debounce } from '@/utils';
import { Flex, Pagination, Stack, TextInput } from '@mantine/core';
import { updateFavorite } from '@/components/helpers/update-favorite';

import BookCard from '@/components/BookCard';
import { Result } from '@/components/reusable';
import IntersectionLoader from '@/components/IntersectionLoader';

export default function Favorite() {
  const syncCount = useFavoriteStore((s) => s.sync);

  const { query, setQuery } = useUrlQuery(BASE_QUERY);
  const { data: res, error, mutate } = useSWR<{ data: Res<Favorite> }>(`/api/favorite?${qsFormat(query)}`, axios.get);

  const handleFavorite = useCallback(updateFavorite, [syncCount]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce((title_like: string) => setQuery({ title_like, _page: 1 }), 600),
    []
  );

  if (error)
    return (
      <Flex justify={{ base: 'center', md: 'inherit' }} ml={{ base: 0, md: 180 }} px="md">
        <Stack spacing="xl" h="40vh" w={{ base: '100%', md: 640 }}>
          <Result title="Error" message="Something went wrong" />
        </Stack>
      </Flex>
    );

  return (
    <Flex justify={{ base: 'center', md: 'inherit' }} ml={{ base: 0, md: 180 }} px="md">
      <Stack spacing="xl" w={{ base: '100%', md: 640 }}>
        <TextInput placeholder="Search in favorite" onChange={(e) => handleSearch(e.target.value)} />
        {res ? (
          <Stack spacing="md">
            {res.data.result.length ? (
              res.data.result.map((f) => (
                <BookCard
                  key={f._id}
                  data={{
                    ...f,
                    canonicalVolumeLink: '#',
                    publishedDate: f.publishedDate + '',
                    imageLinks: { thumbnail: f.image, smallThumbnail: f.image },
                  }}
                  onFavorite={(d) => handleFavorite(d, syncCount).then(() => mutate())}
                />
              ))
            ) : (
              <Result title="Not Found" type="404" message="No favorite book found" />
            )}
          </Stack>
        ) : (
          <Flex h="40vh" justify="center" align="center">
            <IntersectionLoader />
          </Flex>
        )}
        <Flex justify="center" pb="md">
          <Pagination onChange={(_page) => setQuery({ _page })} total={res?.data.totalPage || 0} />
        </Flex>
      </Stack>
    </Flex>
  );
}

const BASE_QUERY = {
  _page: 1,
  _limit: 10,
  title_like: '',
};
