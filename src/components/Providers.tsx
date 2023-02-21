import { Inter } from '@next/font/google';

import { NotificationsProvider } from '@mantine/notifications';
import { MantineProvider, type MantineThemeOverride } from '@mantine/core';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <NotificationsProvider position="top-right">{children}</NotificationsProvider>
    </MantineProvider>
  );
}

const interFont = Inter({ subsets: ['latin'] });

const theme: MantineThemeOverride = {
  colorScheme: 'light',
  fontFamily: interFont.style.fontFamily,
  globalStyles: (theme) => ({
    body: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0] },
  }),
};
