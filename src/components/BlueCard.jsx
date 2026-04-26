import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import FavoriteIcon            from '@mui/icons-material/Favorite';
import FavoriteBorderIcon      from '@mui/icons-material/FavoriteBorder';
import BookmarkAddedIcon        from '@mui/icons-material/BookmarkAdded';
import CheckCircleIcon          from '@mui/icons-material/CheckCircle';
import { useFav }              from '../context/FavoritesContext';
import { useWatchlist }        from '../context/WatchlistContext';

const ratingColor = (r) => {
  if (r >= 7) return '#4CAF50';
  if (r >= 5) return '#FFC107';
  return '#F44336';
};

export default function BlueCard({ Peliculas }) {
  const navigate = useNavigate();
  const { isFav, toggle }  = useFav();
  const { getStatus }      = useWatchlist();

  if (!Peliculas?.length) return null;

  return (
    <div className="movie-card-grid">
      {Peliculas.map((pelicula) => {
        const favored  = isFav(pelicula.id);
        const wlStatus = getStatus(pelicula.id);

        return (
          <Box
            key={pelicula.id}
            onClick={() => navigate(`/detalle/${pelicula.id}`)}
            sx={{
              position: 'relative',
              borderRadius: '10px',
              overflow: 'hidden',
              cursor: 'pointer',
              bgcolor: '#161616',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              aspectRatio: '2 / 3',
              '&:hover': {
                transform: 'scale(1.04) translateY(-3px)',
                boxShadow: '0 14px 40px rgba(0,0,0,0.7)',
                zIndex: 2,
              },
              '&:hover .card-overlay': {
                opacity: 1,
                transform: 'translateY(0)',
              },
              '&:hover .fav-btn': { opacity: 1 },
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            }}
          >
            {/* Rating badge */}
            <Box sx={{
              position: 'absolute', top: 8, right: 8, zIndex: 3,
              bgcolor: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)',
              border: `2px solid ${ratingColor(pelicula.vote_average)}`,
              color: ratingColor(pelicula.vote_average),
              borderRadius: '50%', width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10.5px', fontWeight: 700, lineHeight: 1,
            }}>
              {pelicula.vote_average?.toFixed(1)}
            </Box>

            {/* Poster */}
            <Box
              component="img"
              src={`https://image.tmdb.org/t/p/w342${pelicula.poster_path}`}
              alt={pelicula.title}
              loading="lazy"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />

            {/* Always-visible title gradient */}
            <Box sx={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 45%, transparent 100%)',
              p: 1.2, pt: 4,
            }}>
              <Typography sx={{
                fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.3,
                color: 'rgba(255,255,255,0.9)',
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {pelicula.title}
              </Typography>
            </Box>

            {/* Watchlist badge */}
            {wlStatus && (
              <Box sx={{
                position: 'absolute', top: 8, left: 8, zIndex: 3,
                bgcolor: wlStatus === 'vista' ? 'rgba(76,175,80,0.88)' : 'rgba(255,193,7,0.88)',
                backdropFilter: 'blur(6px)',
                borderRadius: '50%', width: 26, height: 26,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {wlStatus === 'vista'
                  ? <CheckCircleIcon    sx={{ fontSize: 14, color: '#fff' }} />
                  : <BookmarkAddedIcon  sx={{ fontSize: 14, color: '#000' }} />
                }
              </Box>
            )}

            {/* Heart button */}
            <Box
              className="fav-btn"
              onClick={e => { e.stopPropagation(); toggle(pelicula); }}
              sx={{
                position: 'absolute', bottom: 44, left: 8,
                zIndex: 4,
                opacity: favored ? 1 : 0,
                transition: 'opacity 0.2s, transform 0.15s',
                bgcolor: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(6px)',
                borderRadius: '50%',
                width: 30, height: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': { transform: 'scale(1.2)' },
              }}
            >
              {favored
                ? <FavoriteIcon sx={{ fontSize: 15, color: '#E50914' }} />
                : <FavoriteBorderIcon sx={{ fontSize: 15, color: 'rgba(255,255,255,0.85)' }} />
              }
            </Box>

            {/* Hover overlay */}
            <Box
              className="card-overlay"
              sx={{
                position: 'absolute', inset: 0,
                bgcolor: 'rgba(0,0,0,0.84)',
                opacity: 0, transform: 'translateY(6px)',
                transition: 'opacity 0.28s ease, transform 0.28s ease',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'flex-end', p: 1.5,
              }}
            >
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, mb: 0.5, lineHeight: 1.3, color: '#FFC107' }}>
                {pelicula.title}
              </Typography>
              <Typography sx={{
                fontSize: '0.7rem', color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.45,
                display: '-webkit-box', WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {pelicula.overview}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </div>
  );
}
