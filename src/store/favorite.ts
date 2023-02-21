import axios from 'axios';
import { create } from 'zustand';

type FavoriteState = {
  count: number;
};

type FavoriteMutators = {
  sync: () => void;
};

export const useFavoriteStore = create<FavoriteState & FavoriteMutators>((set, get) => ({
  count: 0,
  sync: async () => {
    const { data } = await axios.get('/api/favorite/count');
    set({ count: data.count });
  },
}));
