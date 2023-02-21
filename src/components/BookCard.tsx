import { memo } from 'react';

import Link from 'next/link';
import { IconHeartPlus } from '@tabler/icons-react';
import { Box, Image, Flex, Stack, Divider, Title, Text, ActionIcon, Rating } from '@mantine/core';

type BookCardProps = {
  data: VolumeInfo;
  onFavorite?: (book: VolumeInfo) => void;
};

const BookCard: React.FC<BookCardProps> = ({ data, onFavorite }) => {
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
            <Flex gap={4}>
              <Link href={data.canonicalVolumeLink} target="_blank" rel="noreferrer noopener">
                <Title mb={2} size={18} weight={500} order={1}>
                  {data.title}
                </Title>
              </Link>
              <ActionIcon onClick={() => onFavorite?.(data)} title="Add to favorite" color="red">
                <IconHeartPlus size={18} stroke={2} />
              </ActionIcon>
            </Flex>
            <Rating
              mb={2}
              value={data.averageRating || 0}
              count={data.ratingsCount || 5}
              readOnly
              fractions={3}
              size="xs"
            />
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
