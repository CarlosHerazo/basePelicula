import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ratingColor = (r) => {
  if (r >= 7) return '#4CAF50';
  if (r >= 5) return '#FFC107';
  return '#F44336';
};

// Skeleton row shown while loading
export function MovieRowSkeleton() {
  return (
    <Box sx={{ mb: 5 }}>
      <Box className="skeleton" sx={{ width: 160, height: 22, borderRadius: '6px', mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Box key={i} className="skeleton" sx={{ width: 120, height: 180, borderRadius: '8px', flexShrink: 0 }} />
        ))}
      </Box>
    </Box>
  );
}

export default function MovieRow({ titulo, icono, Peliculas }) {
  const navigate = useNavigate();

  if (!Peliculas?.length) return <MovieRowSkeleton />;

  return (
    <Box sx={{ mb: 5 }}>
      {/* Row heading */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        {icono && (
          <Box sx={{ color: '#FFC107', display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
            {icono}
          </Box>
        )}
        <Typography
          className="section-title"
          sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}
        >
          {titulo}
        </Typography>
      </Box>

      {/* Horizontal scroll */}
      <Box
        className="row-stagger"
        sx={{
          display: 'flex',
          gap: 1.2,
          overflowX: 'auto',
          pb: 1,
          '&::-webkit-scrollbar': { height: 3 },
          '&::-webkit-scrollbar-thumb': { background: 'rgba(255,193,7,0.22)', borderRadius: 2 },
        }}
      >
        {Peliculas.map((p) => (
          <Box
            key={p.id}
            onClick={() => navigate(`/detalle/${p.id}`)}
            sx={{
              width: { xs: 108, sm: 118, md: 128 },
              flexShrink: 0,
              cursor: 'pointer',
              position: 'relative',
              '&:hover .row-poster': { transform: 'scale(1.05)', boxShadow: '0 8px 28px rgba(0,0,0,0.7)' },
              '&:hover .row-title': { color: '#FFC107' },
            }}
          >
            {/* Rating badge */}
            <Box sx={{
              position: 'absolute', top: 6, right: 6, zIndex: 2,
              bgcolor: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(4px)',
              border: `1.5px solid ${ratingColor(p.vote_average)}`,
              color: ratingColor(p.vote_average),
              borderRadius: '50%', width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '9.5px', fontWeight: 700,
            }}>
              {p.vote_average?.toFixed(1)}
            </Box>

            {/* Poster */}
            <Box
              className="row-poster"
              component="img"
              src={`https://image.tmdb.org/t/p/w342${p.poster_path}`}
              alt={p.title}
              loading="lazy"
              sx={{
                width: '100%',
                aspectRatio: '2/3',
                objectFit: 'cover',
                display: 'block',
                borderRadius: '8px',
                mb: 0.75,
                transition: 'transform 0.28s ease, box-shadow 0.28s ease',
              }}
            />

            <Typography
              className="row-title"
              sx={{
                fontSize: '0.68rem', color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.3, transition: 'color 0.2s',
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}
            >
              {p.title}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
