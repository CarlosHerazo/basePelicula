import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate } from 'react-router-dom';
import { useFav } from '../context/FavoritesContext';

const API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68";
const HEADERS = { accept: 'application/json', Authorization: API_TOKEN };

export default function RecomendacionBanner() {
  const { favorites, isFav } = useFav();
  const navigate = useNavigate();

  const [similares,   setSimilares]   = useState([]);
  const [dismissedId, setDismissedId] = useState(
    () => sessionStorage.getItem('rec_dismissed_id')
  );

  // Use the most recently favorited movie as the base
  const basePeli = favorites.length > 0 ? favorites[favorites.length - 1] : null;
  const isDismissed = dismissedId === String(basePeli?.id);

  useEffect(() => {
    if (!basePeli || isDismissed) return;
    setSimilares([]);

    Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${basePeli.id}?language=es`, { headers: HEADERS }).then(r => r.json()),
      fetch(`https://api.themoviedb.org/3/movie/${basePeli.id}/recommendations?language=es&page=1`, { headers: HEADERS }).then(r => r.json()),
    ])
      .then(([details, recs]) => {
        const recResults = (recs.results ?? []).filter(p => p.poster_path && !isFav(p.id));

        if (recResults.length >= 8) {
          setSimilares(recResults.slice(0, 14));
          return;
        }

        // Complementar con discover filtrado por los géneros reales de la película
        const genreIds = (details.genres ?? []).map(g => g.id).join(',');
        if (!genreIds) { setSimilares(recResults.slice(0, 14)); return; }

        fetch(
          `https://api.themoviedb.org/3/discover/movie?with_genres=${genreIds}&sort_by=vote_count.desc&vote_count.gte=200&language=es&page=1`,
          { headers: HEADERS }
        )
          .then(r => r.json())
          .then(disc => {
            const extra = (disc.results ?? []).filter(
              p => p.poster_path && !isFav(p.id) && p.id !== basePeli.id && !recResults.some(r => r.id === p.id)
            );
            setSimilares([...recResults, ...extra].slice(0, 14));
          })
          .catch(() => setSimilares(recResults.slice(0, 14)));
      })
      .catch(console.error);
  }, [basePeli?.id]);

  const dismiss = () => {
    sessionStorage.setItem('rec_dismissed_id', String(basePeli?.id));
    setDismissedId(String(basePeli?.id));
  };

  if (!basePeli || !similares.length || isDismissed) return null;

  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: 'rgba(255,193,7,0.04)',
        border: '1px solid rgba(255,193,7,0.16)',
        borderRadius: '14px',
        p: { xs: 2, md: 2.5 },
        mb: 4,
        overflow: 'hidden',
        animation: 'fadeUp 0.5s ease both',
        // subtle left accent line
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0, top: 0, bottom: 0,
          width: '3px',
          background: 'linear-gradient(to bottom, #FFC107, transparent)',
          borderRadius: '14px 0 0 14px',
        },
      }}
    >
      {/* Dismiss */}
      <IconButton
        size="small"
        onClick={dismiss}
        sx={{
          position: 'absolute', top: 10, right: 10,
          color: 'rgba(255,255,255,0.25)',
          '&:hover': { color: '#FFC107', bgcolor: 'rgba(255,193,7,0.08)' },
          transition: 'all 0.2s',
        }}
      >
        <CloseIcon sx={{ fontSize: 16 }} />
      </IconButton>

      {/* Header row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, pr: 4 }}>
        {/* Thumbnail of the base favorite */}
        <Box
          component="img"
          src={`https://image.tmdb.org/t/p/w92${basePeli.poster_path}`}
          alt={basePeli.title}
          sx={{
            width: 34, height: 50, borderRadius: '5px',
            objectFit: 'cover', flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
        />
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.3 }}>
            <AutoAwesomeIcon sx={{ fontSize: 13, color: '#FFC107' }} />
            <Typography sx={{ color: '#FFC107', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '1px' }}>
              PARA TI
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>
            Vimos que te interesó{' '}
            <Box component="span" sx={{ color: '#fff', fontWeight: 700 }}>
              {basePeli.title}
            </Box>
            , tal vez esto también te guste:
          </Typography>
        </Box>
      </Box>

      {/* Horizontal scroll */}
      <Box
        sx={{
          display: 'flex', gap: 1.2, overflowX: 'auto', pb: 0.5,
          '&::-webkit-scrollbar': { height: 3 },
          '&::-webkit-scrollbar-thumb': { background: 'rgba(255,193,7,0.22)', borderRadius: 2 },
        }}
      >
        {similares.map(p => (
          <Box
            key={p.id}
            onClick={() => navigate(`/detalle/${p.id}`)}
            sx={{
              width: { xs: 76, sm: 84, md: 92 },
              flexShrink: 0,
              cursor: 'pointer',
              '&:hover .rec-img': { transform: 'scale(1.06)' },
              '&:hover .rec-title': { color: '#FFC107' },
            }}
          >
            <Box sx={{ borderRadius: '7px', overflow: 'hidden', mb: 0.5 }}>
              <Box
                className="rec-img"
                component="img"
                src={`https://image.tmdb.org/t/p/w342${p.poster_path}`}
                alt={p.title}
                loading="lazy"
                sx={{ width: '100%', display: 'block', transition: 'transform 0.3s ease' }}
              />
            </Box>
            <Typography
              className="rec-title"
              sx={{
                fontSize: '0.65rem', lineHeight: 1.25,
                color: 'rgba(255,255,255,0.5)',
                transition: 'color 0.2s',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
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
