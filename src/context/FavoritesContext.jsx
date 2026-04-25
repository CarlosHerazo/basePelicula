import React, { createContext, useContext } from 'react';
import { useFavorites } from '../hooks/useFavorites';

const Ctx = createContext(null);

export function FavoritesProvider({ children }) {
  return <Ctx.Provider value={useFavorites()}>{children}</Ctx.Provider>;
}

export const useFav = () =>
  useContext(Ctx) ?? { favorites: [], toggle: () => {}, isFav: () => false };
