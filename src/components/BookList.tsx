import { memo, useCallback } from 'react';
import { useFavoriteStore } from '@/store/favorite';

import BookCard from '@/components/BookCard';
import { updateFavorite } from '@/components/helpers/update-favorite';

const BookList: React.FC<{ books: VolumeInfo[] }> = ({ books }) => {
  const syncCount = useFavoriteStore((s) => s.sync);
  const handleFavorite = useCallback(updateFavorite, [syncCount]);
  return (
    <>
      {books.map((f) => (
        <BookCard
          data={f}
          onFavorite={(d) => handleFavorite(d, syncCount)}
          key={getBookId(f.canonicalVolumeLink) || Math.random().toFixed(5)}
        />
      ))}
    </>
  );
};

function getBookId(link: string) {
  return link.match(/(?<=\?id=).*/)?.[0];
}

export default memo(BookList);
