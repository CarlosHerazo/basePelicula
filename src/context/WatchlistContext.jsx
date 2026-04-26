import React, { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext(null);
const KEY = 'cinebase_watchlist_v1';

export function WatchlistProvider({ children }) {
  const [list, setList] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) ?? {}; }
    catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(list));
  }, [list]);

  // status: 'pendiente' | 'vista' — toggle off if already that status
  const setStatus = (movie, status) =>
    setList(prev => {
      if (prev[movie.id]?.status === status) {
        const next = { ...prev };
        delete next[movie.id];
        return next;
      }
      return { ...prev, [movie.id]: { status, movie } };
    });

  const getStatus  = id     => list[id]?.status ?? null;
  const getByStatus = status => Object.values(list).filter(e => e.status === status).map(e => e.movie);
  const totalCount  = Object.keys(list).length;

  return (
    <WatchlistContext.Provider value={{ setStatus, getStatus, getByStatus, totalCount, list }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export const useWatchlist = () => useContext(WatchlistContext);
