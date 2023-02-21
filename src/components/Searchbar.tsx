import { memo, useEffect } from 'react';

import { useRouter } from 'next/router';
import { useSearchStore } from '@/store/search';
import { useFavoriteStore } from '@/store/favorite';

import { IconHeartFilled, IconSearch } from '@tabler/icons-react';
import {
  Flex,
  Loader,
  Tooltip,
  Indicator,
  TextInput,
  ActionIcon,
  type FlexProps,
  type TextInputProps,
} from '@mantine/core';

type SearchbarProps = {
  withFavorite?: boolean;
  inputProps?: Omit<TextInputProps, 'icon' | 'placeholder' | 'radius'>;
  onSearch?: (q: string) => void;
} & FlexProps;

const Searchbar: React.FC<SearchbarProps> = ({ withFavorite = false, inputProps, onSearch, ...props }) => {
  const [favoriteCount, sync] = useFavoriteStore((s) => [s.count, s.sync]);
  const { search, loading, setSearch, setLoading } = useSearchStore();
  const { push } = useRouter();

  useEffect(() => {
    sync();
  }, [sync]);

  return (
    <form
      onSubmit={(e) => {
        setLoading(true);
        e.preventDefault();
        onSearch?.(search);
      }}
    >
      <Flex align="center" gap={12} {...props}>
        <TextInput
          {...inputProps}
          radius="xl"
          value={search}
          placeholder="Search any book"
          icon={loading ? <Loader size="xs" /> : <IconSearch size={16} />}
          onChange={(e) => setSearch(e.target.value)}
        />
        {withFavorite && (
          <Indicator
            inline
            dot={false}
            size={16}
            color="indigo"
            label={favoriteCount}
            showZero={false}
            overflowCount={99}
          >
            <Tooltip label="Your Favorites" position="bottom" withArrow arrowSize={6} openDelay={500}>
              <ActionIcon onClick={() => push('/favorite')} color="pink" variant="transparent">
                <IconHeartFilled />
              </ActionIcon>
            </Tooltip>
          </Indicator>
        )}
      </Flex>
    </form>
  );
};

export default memo(Searchbar);
