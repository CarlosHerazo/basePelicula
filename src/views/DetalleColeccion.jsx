import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon       from '@mui/icons-material/ArrowBack';
import ViewModuleIcon      from '@mui/icons-material/ViewModule';
import StarIcon            from '@mui/icons-material/Star';
import CalendarMonthIcon   from '@mui/icons-material/CalendarMonth';
import BlueCard            from '../components/BlueCard';
import SkeletonCard        from '../components/SkeletonCard';

const API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68";
const HEADERS = { 'Content-Type': 'application/json', Authorization: API_TOKEN };

export default function DetalleColeccion() {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const [col,     setCol]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setCol(null);
    fetch(`https://api.themoviedb.org/3/collection/${id}?language=es`, { headers: HEADERS })
      .then(r => r.json())
      .then(data => { setCol(data); setLoading(false); })
      .catch(console.error);
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress color="warning" size={44} thickness={3} />
      </Box>
    );
  }

  if (!col || col.success === false) {
    return (
      <Container maxWidth="xl" sx={{ pt: 12, pb: 6 }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', mt: 10 }}>
          Colección no encontrada.
        </Typography>
      </Container>
    );
  }

  const movies  = (col.parts ?? [])
    .filter(p => p.poster_path)
    .sort((a, b) => (a.release_date ?? '').localeCompare(b.release_date ?? ''));

  const avgScore = movies.length
    ? (movies.reduce((s, m) => s + (m.vote_average ?? 0), 0) / movies.length).toFixed(1)
    : null;

  const years = movies
    .map(m => m.release_date?.slice(0, 4))
    .filter(Boolean)
    .sort();

  const yearRange = years.length
    ? years.length > 1 ? `${years[0]} – ${years[years.length - 1]}` : years[0]
    : null;

  return (
    <>
      {/* ── Hero ── */}
      <Box sx={{ position: 'relative', width: '100%', height: { xs: '52vh', sm: '58vh', md: '68vh' }, overflow: 'hidden' }}>
        {col.backdrop_path && (
          <Box
            component="img"
            src={`https://image.tmdb.org/t/p/original${col.backdrop_path}`}
            alt={col.name}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}

        {/* Gradients */}
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.2) 100%)' }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0D0D0D 0%, transparent 55%)' }} />

        {/* Back button */}
        <Box
          onClick={() => navigate('/colecciones')}
          sx={{
            position: 'absolute', top: { xs: 72, md: 80 }, left: { xs: 16, md: 32 },
            display: 'flex', alignItems: 'center', gap: 0.8,
            color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontSize: '0.8rem',
            transition: 'color 0.2s',
            '&:hover': { color: '#FFC107' },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          Sagas &amp; Franquicias
        </Box>

        {/* Content */}
        <Box sx={{
          position: 'absolute',
          bottom: { xs: 28, md: 48 },
          left: { xs: 20, md: 48 },
          maxWidth: { xs: '90%', md: '55%' },
          animation: 'fadeUp 0.6s ease both',
        }}>
          {/* Tag */}
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 0.6,
            bgcolor: 'rgba(255,193,7,0.15)', border: '1px solid rgba(255,193,7,0.4)',
            color: '#FFC107', fontSize: '0.62rem', fontWeight: 800,
            px: 1.2, py: 0.35, borderRadius: '4px', mb: 1.5, letterSpacing: '1.2px',
          }}>
            <ViewModuleIcon sx={{ fontSize: 11 }} /> COLECCIÓN
          </Box>

          <Typography sx={{
            fontSize: { xs: '1.6rem', sm: '2.2rem', md: '2.8rem' },
            fontWeight: 900, color: '#fff', lineHeight: 1.05,
            letterSpacing: '-0.8px', textShadow: '0 2px 20px rgba(0,0,0,0.6)',
            mb: 1.5,
          }}>
            {col.name}
          </Typography>

          {/* Stats row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 1.5 }}>
            <Chip
              icon={<ViewModuleIcon sx={{ fontSize: '13px !important' }} />}
              label={`${movies.length} película${movies.length !== 1 ? 's' : ''}`}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', '& .MuiChip-icon': { color: 'rgba(255,255,255,0.5)' } }}
            />
            {avgScore && (
              <Chip
                icon={<StarIcon sx={{ fontSize: '13px !important' }} />}
                label={`${avgScore} promedio`}
                size="small"
                sx={{ bgcolor: 'rgba(255,193,7,0.12)', color: '#FFC107', fontSize: '0.72rem', border: '1px solid rgba(255,193,7,0.3)', '& .MuiChip-icon': { color: '#FFC107' } }}
              />
            )}
            {yearRange && (
              <Chip
                icon={<CalendarMonthIcon sx={{ fontSize: '13px !important' }} />}
                label={yearRange}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', '& .MuiChip-icon': { color: 'rgba(255,255,255,0.5)' } }}
              />
            )}
          </Box>

          {col.overview && (
            <Typography sx={{
              color: 'rgba(255,255,255,0.55)', fontSize: { xs: '0.8rem', md: '0.88rem' },
              lineHeight: 1.6, display: { xs: 'none', sm: 'block' },
              display: '-webkit-box', WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {col.overview}
            </Typography>
          )}
        </Box>
      </Box>

      {/* ── Movies ── */}
      <Container maxWidth="xl" className="page-enter" sx={{ pt: 4, pb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <ViewModuleIcon sx={{ color: '#FFC107', fontSize: 18 }} />
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
            Películas de la saga
          </Typography>
        </Box>

        {!movies.length
          ? <SkeletonCard count={8} />
          : <BlueCard Peliculas={movies} />
        }
      </Container>
    </>
  );
}
