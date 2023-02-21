import { useRouter } from 'next/router';

import Searchbar from '@/components/Searchbar';
import { Flex, Stack, Text } from '@mantine/core';

export default function Home() {
  const { push } = useRouter();
  return (
    <Flex justify="center" align="center" w="100vw" h="80vh">
      <Stack spacing={32}>
        <Text weight={700} style={{ userSelect: 'none', textAlign: 'center', fontSize: '2rem' }}>
          SIMPLE{' '}
          <Text component="span" weight={500}>
            BOOKSHELF
          </Text>
        </Text>
        <Searchbar w={{ md: 480 }} inputProps={{ w: '100%' }} onSearch={(q) => push(`/search?q=${q}`)} />
      </Stack>
    </Flex>
  );
}
