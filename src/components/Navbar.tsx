import { memo } from 'react';

import { useRouter } from 'next/router';

import Link from 'next/link';
import Searchbar from '@/components/Searchbar';
import { Box, Flex, Text, Navbar as MantineNav, createStyles } from '@mantine/core';

type NavigationProps = {};

const Navbar = ({}: NavigationProps) => {
  const { push } = useRouter();
  const { classes } = useStyles();

  return (
    <MantineNav className={classes.navbar} height="auto">
      <MantineNav.Section className={classes.header}>
        <Box>
          <Flex gap={{ base: 12, md: 24 }} align="center" direction={{ base: 'column', md: 'row' }}>
            <Link href="/" style={{ textDecoration: 'auto', color: 'initial' }}>
              <Text weight={700} style={{ userSelect: 'none' }}>
                SIMPLE{' '}
                <Text component="span" weight={500}>
                  BOOKSHELF
                </Text>
              </Text>
            </Link>
            <Searchbar
              withFavorite
              inputProps={{ w: { base: '80vw', md: 480 } }}
              onSearch={(q) => push(`/search?q=${q}`)}
            />
          </Flex>
        </Box>
      </MantineNav.Section>
    </MantineNav>
  );
};

const useStyles = createStyles((theme) => ({
  navbar: {
    zIndex: 99,
    display: 'flex',
    padding: `calc(${theme.spacing.xs}px + 1.5px)`,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: { padding: theme.spacing.md + 0.5 },
  },

  header: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
  },
}));

export default memo(Navbar);
