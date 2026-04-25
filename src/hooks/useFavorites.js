import { useState, useCallback } from 'react';

const KEY = 'pelihz_favs';

const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? []; }
  catch { return []; }
};

export function useFavorites() {
  const [favorites, setFavorites] = useState(load);

  const toggle = useCallback((movie) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === movie.id);
      const next = exists
        ? prev.filter(f => f.id !== movie.id)
        : [...prev, {
            id:           movie.id,
            title:        movie.title,
            poster_path:  movie.poster_path,
            vote_average: movie.vote_average,
            overview:     movie.overview,
          }];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFav = useCallback((id) => favorites.some(f => f.id === id), [favorites]);

  return { favorites, toggle, isFav };
}
