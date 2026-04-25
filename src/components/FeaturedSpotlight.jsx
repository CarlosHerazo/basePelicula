import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';

export default function FeaturedSpotlight({ pelicula, etiqueta, invertir = false }) {
  const navigate = useNavigate();
  if (!pelicula) return null;

  return (
    <Box
      onClick={() => navigate(`/detalle/${pelicula.id}`)}
      sx={{
        position: 'relative',
        borderRadius: '14px',
        overflow: 'hidden',
        height: { xs: 200, sm: 260, md: 310 },
        cursor: 'pointer',
        '&:hover .spot-img': { transform: 'scale(1.06)' },
        '&:hover .spot-btn': { bgcolor: '#FFC107', color: '#000' },
        transition: 'box-shadow 0.3s',
        '&:hover': { boxShadow: '0 20px 60px rgba(0,0,0,0.65)' },
        // diagonal clip on left card (default), mirror on right
        clipPath: invertir
          ? 'polygon(4% 0, 100% 0, 100% 100%, 0% 100%)'
          : 'polygon(0 0, 100% 0, 96% 100%, 0% 100%)',
      }}
    >
      {/* Backdrop image */}
      <Box
        className="spot-img"
        component="img"
        src={`https://image.tmdb.org/t/p/original${pelicula.backdrop_path}`}
        alt={pelicula.title}
        sx={{
          width: '100%', height: '100%',
          objectFit: 'cover', display: 'block',
          transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      {/* Gradient overlay — direccional según `invertir` */}
      <Box sx={{
        position: 'absolute', inset: 0,
        background: invertir
          ? 'linear-gradient(to left, rgba(0,0,0,0.92) 20%, rgba(0,0,0,0.35) 65%, transparent 100%)'
          : 'linear-gradient(to right, rgba(0,0,0,0.92) 20%, rgba(0,0,0,0.35) 65%, transparent 100%)',
      }} />
      {/* Bottom fade */}
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />

      {/* Content */}
      <Box sx={{
        position: 'absolute',
        top: '50%', transform: 'translateY(-50%)',
        [invertir ? 'right' : 'left']: { xs: 16, md: 32 },
        textAlign: invertir ? 'right' : 'left',
        maxWidth: { xs: '80%', md: '50%' },
        zIndex: 1,
      }}>
        {/* Label tag */}
        <Box sx={{
          display: 'inline-flex', alignItems: 'center', gap: 0.5,
          bgcolor: 'rgba(255,193,7,0.15)',
          border: '1px solid rgba(255,193,7,0.45)',
          color: '#FFC107', fontWeight: 800,
          fontSize: '0.62rem', px: 1.2, py: 0.35,
          borderRadius: '4px', mb: 1.2, letterSpacing: '1.2px',
        }}>
          <StarIcon sx={{ fontSize: 10 }} /> {etiqueta}
        </Box>

        <Typography sx={{
          fontWeight: 900, lineHeight: 1.08,
          letterSpacing: '-0.8px',
          textShadow: '0 2px 16px rgba(0,0,0,0.6)',
          mb: 1,
          fontSize: { xs: '1.1rem', sm: '1.4rem', md: '1.75rem' },
          color: '#fff',
        }}>
          {pelicula.title}
        </Typography>

        <Typography sx={{
          color: 'rgba(255,255,255,0.6)', lineHeight: 1.5,
          display: { xs: 'none', sm: 'block' },
          fontSize: '0.78rem', mb: 1.5,
        }}>
          {pelicula.overview?.slice(0, 110)}…
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: invertir ? 'flex-end' : 'flex-start' }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 0.4,
            bgcolor: '#FFC107', color: '#000',
            fontWeight: 800, fontSize: '0.72rem',
            px: 1, py: 0.2, borderRadius: '4px',
          }}>
            ★ {pelicula.vote_average?.toFixed(1)}
          </Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.38)' }}>
            {pelicula.release_date?.slice(0, 4)}
          </Typography>
          <Box
            className="spot-btn"
            sx={{
              fontSize: '0.68rem', fontWeight: 700,
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'rgba(255,255,255,0.7)',
              px: 1.5, py: 0.3, borderRadius: '4px',
              transition: 'all 0.2s', cursor: 'pointer',
            }}
          >
            Ver más →
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
