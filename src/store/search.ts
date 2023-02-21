import { create } from 'zustand';

type SearchState = {
  search: string;
  loading: boolean;
};

type SearchMutators = {
  setLoading: (state: SearchState['loading']) => void;
  setSearch: (state: SearchState['search']) => void;
};

export const useSearchStore = create<SearchState & SearchMutators>((set) => ({
  search: '',
  loading: false,
  setSearch: (search) => set({ search }),
  setLoading: (loading) => set({ loading }),
}));
