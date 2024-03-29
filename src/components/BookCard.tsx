import { memo } from 'react';

import { useDisclosure } from '@mantine/hooks';

import Link from 'next/link';
import { IconHeartPlus } from '@tabler/icons-react';
import { Box, Image, Flex, Stack, Divider, Title, Text, ActionIcon, Rating, Loader } from '@mantine/core';

type BookCardProps = {
  data: VolumeInfo;
  onFavorite?: (book: VolumeInfo) => Promise<void>;
};

const BookCard: React.FC<BookCardProps> = ({ data, onFavorite }) => {
  const [loading, handler] = useDisclosure(false);
  return (
    <>
      <Flex gap="md">
        <Box w={120} h={180} sx={(t) => ({ boxShadow: t.shadows.md })}>
          <Image
            src={data.imageLinks?.thumbnail}
            alt={data.title}
            radius="md"
            width={120}
            height="100%"
            fit="cover"
            withPlaceholder
          />
        </Box>
        <Flex direction="column" gap={12}>
          <Stack spacing={2}>
            <Flex gap={4} align="center">
              <Link href={data.canonicalVolumeLink} target="_blank" rel="noreferrer noopener">
                <Title mb={2} size={18} weight={500} order={1}>
                  {data.title}
                </Title>
              </Link>
              {loading ? (
                <Loader px={1} size={18} />
              ) : (
                <ActionIcon
                  color="red"
                  title="Add to favorite"
                  onClick={() => {
                    if (!onFavorite) return;
                    handler.open();
                    onFavorite(data).finally(handler.close);
                  }}
                >
                  <IconHeartPlus size={18} stroke={2} />
                </ActionIcon>
              )}
            </Flex>
            <Rating value={data.averageRating || 0} fractions={2} count={5} size="xs" mb={2} readOnly />
            <Flex>
              {data.authors && <Text size={13}>{data.authors.join(', ')}&nbsp;-</Text>}
              {data.publishedDate && <Text size={13}>&nbsp;{new Date(data.publishedDate).getFullYear()}</Text>}
            </Flex>
            {data.publisher && <Text size={13}>{data.publisher}</Text>}
          </Stack>
          <Text size={15}>
            {data.description?.length > 260 ? `${data.description?.slice(0, 260).trim()}...` : data.description}
          </Text>
        </Flex>
      </Flex>
      <Divider my="sm" variant="dashed" />
    </>
  );
};

export default memo(BookCard);
