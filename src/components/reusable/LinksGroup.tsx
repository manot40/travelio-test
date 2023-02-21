import { useState } from 'react';

import Link from 'next/link';
import {
  Box,
  Text,
  Group,
  Collapse,
  ThemeIcon,
  UnstyledButton,
  createStyles,
  type UnstyledButtonProps,
} from '@mantine/core';

import { type Icon as TablerIcon, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

type Links = Array<{
  label: string;
  link: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}>;

export type LinksGroupOptions = {
  icon: TablerIcon;
  label: string;
  links?: Links;
  active?: boolean;
  initiallyOpened?: boolean;
};

type LinksGroupProps = LinksGroupOptions & UnstyledButtonProps & React.BaseHTMLAttributes<HTMLButtonElement>;

export function LinksGroup({ icon: Icon, label, initiallyOpened, links, active = false, ...rest }: LinksGroupProps) {
  const { classes, theme } = useStyles();
  const [opened, setOpened] = useState(initiallyOpened || false);

  const hasLinks = Array.isArray(links);
  const isSingleLink = hasLinks && links.length === 1;

  const LinkWrap = isSingleLink ? Link : 'div';
  const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft;
  const Items = (hasLinks ? links : []).map((l) => (
    <Link key={l.label} href={l.link}>
      <Text className={classes.link} onClick={l.onClick}>
        {l.label}
      </Text>
    </Link>
  ));

  return (
    <LinkWrap href={isSingleLink ? links![0].link : ''} style={{ textDecorationLine: 'none' }}>
      <UnstyledButton
        {...rest}
        onClick={(e) => (rest.onClick?.(e), setOpened((o) => !o))}
        className={`${classes.control}${active ? ' active' : ''} ${rest.className || ''}`}
      >
        <Group position="apart" spacing={0}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <Icon size={18} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && !isSingleLink && (
            <ChevronIcon
              className={classes.chevron}
              size={14}
              stroke={1.5}
              style={{
                transform: opened ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)` : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks && !isSingleLink ? <Collapse in={opened}>{Items}</Collapse> : null}
    </LinkWrap>
  );
}

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: 'block',
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    '&.active, &.active:hover': {
      backgroundColor: theme.colors.blue[6],
      color: theme.white,
    },

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : 'rgba(231, 245, 255, 1)',
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  link: {
    fontWeight: 500,
    display: 'block',
    textDecoration: 'none',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    paddingLeft: 31,
    marginLeft: 30,
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    borderLeft: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  chevron: {
    transition: 'transform 200ms ease',
  },
}));
