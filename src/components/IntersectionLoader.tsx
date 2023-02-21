import { memo, useCallback, useEffect, useRef } from 'react';

import { Text, Loader, Flex } from '@mantine/core';

import { debounce } from '@/utils';
import { useIntersection } from '@mantine/hooks';

type IntersectionLoaderProps = {
  cb?: () => void;
};

const IntersectionLoader: React.FC<IntersectionLoaderProps> = ({ cb = () => {} }) => {
  const containerRef = useRef<HTMLDivElement>();

  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 0.1,
  });

  useEffect(() => {
    containerRef.current = document.getElementById('screen-overflow') as HTMLDivElement;
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCb = useCallback(debounce(cb, 1500), [cb]);

  useEffect(() => {
    if (entry?.isIntersecting) debouncedCb();
  }, [entry?.isIntersecting, debouncedCb]);

  return (
    <Flex align="center" justify="center" py="md" gap={8} style={{ position: 'relative' }}>
      <div
        ref={ref}
        style={{ position: 'absolute', bottom: '100%', left: 0, width: '100%', height: 480, zIndex: -1 }}
      />
      <Loader size="sm" />
      <Text size="sm">Hang tight! Fetching more books...</Text>
    </Flex>
  );
};

export default memo(IntersectionLoader);
