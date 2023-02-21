import axios from 'axios';
import { showNotification } from '@mantine/notifications';

export async function updateFavorite(data: VolumeInfo, sync: () => void) {
  try {
    await axios.post<Favorite, Omit<Favorite, '_id'>>('/api/favorite', {
      title: data.title,
      authors: data.authors,
      publisher: data.publisher,
      publishedDate: new Date(data.publishedDate),
      description: data.description,
      ratingsCount: data.ratingsCount || 0,
      averageRating: data.averageRating || 0,
      image: data.imageLinks?.smallThumbnail || 'N/A',
    });
    showNotification({
      color: 'green',
      title: 'Added to favorite',
      message: 'This book has been added to your favorite list',
    });
  } catch (err: any) {
    const res = err.response;
    if (res?.status === 409) {
      await axios.delete(`/api/favorite/${res.data.result}`);
      showNotification({
        color: 'yellow',
        title: 'Removed from favorite',
        message: 'This book has been removed from your favorite list',
      });
    } else {
      showNotification({
        color: 'red',
        title: "Can't add to favorite",
        message: 'Something went wrong when trying to add this book to your favorite list',
      });
    }
  } finally {
    sync();
  }
}
