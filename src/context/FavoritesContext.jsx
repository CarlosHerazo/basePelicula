import React, { createContext, useContext, useState, useCallback } from 'react';

const Ctx = createContext(null);
const KEY = 'pelihz_favs';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) ?? []; } catch { return []; } };

export function FavoritesProvider({ children }) {
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
            backdrop_path: movie.backdrop_path,
            vote_average: movie.vote_average,
            overview:     movie.overview,
          }];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFav = useCallback((id) => favorites.some(f => f.id === id), [favorites]);

  return (
    <Ctx.Provider value={{ favorites, toggle, isFav }}>
      {children}
    </Ctx.Provider>
  );
}

export const useFav = () =>
  useContext(Ctx) ?? { favorites: [], toggle: () => {}, isFav: () => false };
