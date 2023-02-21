import { useRouter } from 'next/router';

import Navbar from '@/components/Navbar';
import { Box, Flex, ScrollArea } from '@mantine/core';

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useRouter();
  return (
    <Flex h="100%">
      <Flex direction="column" w="100%" h="100vh" sx={{ overflowX: 'hidden', flex: '1 1 0%' }}>
        {pathname !== '/' && <Navbar />}
        <ScrollArea id="screen-overflow" h="100%" mah="100vh" sx={{ display: 'flex' }}>
          <Box w={{ base: '100vw', sm: '100%' }} py="md">
            {children}
          </Box>
        </ScrollArea>
      </Flex>
    </Flex>
  );
};

export default BaseLayout;
