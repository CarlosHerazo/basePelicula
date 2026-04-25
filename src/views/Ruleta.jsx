import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, Typography, Button, Chip, CircularProgress, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CasinoIcon        from '@mui/icons-material/Casino';
import ReplayIcon        from '@mui/icons-material/Replay';
import PlayArrowIcon     from '@mui/icons-material/PlayArrow';
import ArrowBackIcon     from '@mui/icons-material/ArrowBack';
import StarIcon          from '@mui/icons-material/Star';
import WhatshotIcon      from '@mui/icons-material/Whatshot';
import TrendingUpIcon    from '@mui/icons-material/TrendingUp';
import FavoriteIcon      from '@mui/icons-material/Favorite';
import BoltIcon          from '@mui/icons-material/Bolt';
import NightlifeIcon     from '@mui/icons-material/Nightlife';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import RocketLaunchIcon  from '@mui/icons-material/RocketLaunch';
import TheatersIcon      from '@mui/icons-material/Theaters';
import PsychologyIcon    from '@mui/icons-material/Psychology';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteBorder';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon        from '@mui/icons-material/People';
import AnimReveal        from '../components/AnimReveal';
import { useFav }        from '../context/FavoritesContext';

const API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68";
const HEADERS = { 'Content-Type': 'application/json', Authorization: API_TOKEN };

const GENRE_MAP = {
  28: 'Acción', 12: 'Aventura', 16: 'Animación', 35: 'Comedia',
  80: 'Crimen', 18: 'Drama', 10751: 'Familia', 14: 'Fantasía',
  27: 'Terror', 9648: 'Misterio', 10749: 'Romance', 878: 'Ciencia ficción',
  53: 'Thriller', 10752: 'Bélica', 37: 'Western',
};

const CATEGORIES = [
  { label: 'Populares',    value: 'popular',   Icon: WhatshotIcon,      color: '#E53935', bg: 'rgba(229,57,53,0.12)',    border: 'rgba(229,57,53,0.35)'    },
  { label: 'Tendencias',   value: 'trending',  Icon: TrendingUpIcon,    color: '#00BCD4', bg: 'rgba(0,188,212,0.1)',     border: 'rgba(0,188,212,0.35)'    },
  { label: 'Favoritos',    value: 'favorites', Icon: FavoriteIcon,      color: '#E91E63', bg: 'rgba(233,30,99,0.1)',     border: 'rgba(233,30,99,0.35)'    },
  { label: 'Acción',       value: 28,          Icon: BoltIcon,          color: '#FF6F00', bg: 'rgba(255,111,0,0.1)',     border: 'rgba(255,111,0,0.35)'    },
  { label: 'Terror',       value: 27,          Icon: NightlifeIcon,     color: '#9C27B0', bg: 'rgba(156,39,176,0.1)',    border: 'rgba(156,39,176,0.35)'   },
  { label: 'Comedia',      value: 35,          Icon: EmojiEmotionsIcon, color: '#FFC107', bg: 'rgba(255,193,7,0.1)',     border: 'rgba(255,193,7,0.35)'    },
  { label: 'Ciencia ficción', value: 878,      Icon: RocketLaunchIcon,  color: '#2196F3', bg: 'rgba(33,150,243,0.1)',    border: 'rgba(33,150,243,0.35)'   },
  { label: 'Drama',        value: 18,          Icon: TheatersIcon,      color: '#4CAF50', bg: 'rgba(76,175,80,0.1)',     border: 'rgba(76,175,80,0.35)'    },
  { label: 'Misterio',     value: 9648,        Icon: PsychologyIcon,    color: '#607D8B', bg: 'rgba(96,125,139,0.1)',    border: 'rgba(96,125,139,0.35)'   },
];

const SPIN_DELAYS = [
  65, 65, 70, 75, 80, 85, 90, 95,
  110, 130, 155, 185, 220,
  270, 330, 400, 480,
  570, 680, 800,
  950,
];

const ratingColor = (r) => r >= 7 ? '#4CAF50' : r >= 5 ? '#FFC107' : '#F44336';

export default function Ruleta() {
  const navigate = useNavigate();
  const { favorites } = useFav();

  const [step,         setStep]         = useState('select'); // 'select' | 'ready' | 'result'
  const [selectedCat,  setSelectedCat]  = useState(null);
  const [pool,         setPool]         = useState([]);
  const [loadingPool,  setLoadingPool]  = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [spinning,     setSpinning]     = useState(false);
  const [winner,       setWinner]       = useState(null);
  const [spinKey,      setSpinKey]      = useState(0);

  const fetchPool = useCallback(async (cat) => {
    setLoadingPool(true);
    try {
      if (cat.value === 'favorites') {
        setPool(favorites.filter(f => f.poster_path));
        setCurrentMovie(favorites[0] ?? null);
        return;
      }
      const url = cat.value === 'trending'
        ? 'https://api.themoviedb.org/3/trending/movie/week?language=es'
        : cat.value === 'popular'
          ? 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&vote_count.gte=500&language=es&page=1'
          : `https://api.themoviedb.org/3/discover/movie?with_genres=${cat.value}&sort_by=vote_count.desc&vote_count.gte=200&language=es&page=1`;
      const data = await fetch(url, { headers: HEADERS }).then(r => r.json());
      const movies = (data.results ?? []).filter(m => m.poster_path && m.backdrop_path);
      setPool(movies);
      setCurrentMovie(movies[Math.floor(Math.random() * movies.length)] ?? null);
    } catch (e) { console.error(e); }
    finally { setLoadingPool(false); }
  }, [favorites]);

  const selectCategory = (cat) => {
    setSelectedCat(cat);
    setWinner(null);
    setStep('ready');
    fetchPool(cat);
  };

  const spin = useCallback(() => {
    if (!pool.length || spinning) return;
    setSpinning(true);
    setWinner(null);

    const winnerMovie = pool[Math.floor(Math.random() * pool.length)];
    let tick = 0;

    const next = () => {
      const isLast = tick >= SPIN_DELAYS.length - 1;
      const shown  = isLast ? winnerMovie : pool[Math.floor(Math.random() * pool.length)];
      setCurrentMovie(shown);
      setSpinKey(k => k + 1);
      if (isLast) {
        setWinner(winnerMovie);
        setSpinning(false);
        setStep('result');
      } else {
        tick++;
        setTimeout(next, SPIN_DELAYS[tick]);
      }
    };
    setTimeout(next, SPIN_DELAYS[0]);
  }, [pool, spinning]);

  const reset = () => { setWinner(null); setStep('ready'); };
  const changeCategory = () => { setStep('select'); setSelectedCat(null); setWinner(null); };

  const genreNames = (ids) => (ids ?? []).map(id => GENRE_MAP[id]).filter(Boolean).slice(0, 3);

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* ── Cinematic background ── */}
      {currentMovie?.backdrop_path && (
        <Box
          key={currentMovie.id}
          component="img"
          src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
          alt=""
          sx={{
            position: 'fixed', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', zIndex: 0,
            filter: `blur(${step === 'result' ? 14 : 22}px) brightness(${step === 'result' ? 0.22 : 0.18})`,
            transform: 'scale(1.08)',
            animation: 'backdropShift 0.4s ease both',
            transition: 'filter 0.8s ease',
          }}
        />
      )}
      <Box sx={{ position: 'fixed', inset: 0, zIndex: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 100%)' }} />

      <Container maxWidth="lg" className="page-enter" sx={{ position: 'relative', zIndex: 1, pt: { xs: 10, md: 11 }, pb: 6 }}>

        {/* ── Header ── */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <CasinoIcon sx={{ color: '#FFC107', fontSize: { xs: 28, md: 36 }, animation: spinning ? 'spinBtn 0.6s ease infinite' : 'none' }} />
            <Typography sx={{ fontSize: { xs: '1.6rem', md: '2.4rem' }, fontWeight: 900, color: '#fff', letterSpacing: '-0.8px' }}>
              Ruleta de películas
            </Typography>
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
            {step === 'select' && 'Elige una categoría y deja que el azar decida por ti'}
            {step === 'ready'  && `Categoría: ${selectedCat?.label} · ${pool.length} películas disponibles`}
            {step === 'result' && 'Tu película de esta noche es...'}
          </Typography>
        </Box>

        {/* ══════════════ STEP: SELECT ══════════════ */}
        {step === 'select' && (
          <AnimReveal>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2,1fr)', sm: 'repeat(3,1fr)', md: 'repeat(3,1fr)' },
              gap: { xs: 1.5, md: 2 },
              maxWidth: 700, mx: 'auto',
            }}>
              {CATEGORIES.map(cat => (
                <Box
                  key={cat.value}
                  onClick={() => selectCategory(cat)}
                  sx={{
                    p: { xs: 2, md: 2.5 },
                    borderRadius: '14px',
                    border: `1px solid ${cat.border}`,
                    bgcolor: cat.bg,
                    cursor: 'pointer',
                    textAlign: 'center',
                    position: 'relative', overflow: 'hidden',
                    transition: 'transform 0.22s, box-shadow 0.22s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 16px 40px ${cat.bg.replace('0.1', '0.25').replace('0.12', '0.3')}` },
                    '&:hover .cat-icon': { transform: 'scale(1.18)', opacity: 1 },
                  }}
                >
                  <Box sx={{ position: 'absolute', top: -16, right: -16, width: 64, height: 64, borderRadius: '50%', background: cat.color, opacity: 0.07, filter: 'blur(16px)' }} />
                  <Box className="cat-icon" sx={{ color: cat.color, mb: 1, transition: 'transform 0.25s, opacity 0.25s', opacity: 0.85 }}>
                    <cat.Icon sx={{ fontSize: { xs: 28, md: 34 } }} />
                  </Box>
                  <Typography sx={{ fontSize: { xs: '0.82rem', md: '0.9rem' }, fontWeight: 700, color: '#fff' }}>
                    {cat.label}
                  </Typography>
                  {cat.value === 'favorites' && (
                    <Typography sx={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', mt: 0.3 }}>
                      {favorites.length} guardadas
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </AnimReveal>
        )}

        {/* ══════════════ STEP: READY / SPINNING ══════════════ */}
        {(step === 'ready' || (step === 'result' && !winner)) && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            {loadingPool
              ? <CircularProgress color="warning" size={40} thickness={3} />
              : currentMovie && (
                <Box
                  key={spinKey}
                  sx={{
                    width: { xs: 160, sm: 200, md: 240 },
                    borderRadius: '14px', overflow: 'hidden',
                    boxShadow: spinning ? '0 0 0 3px rgba(255,193,7,0.3)' : '0 20px 60px rgba(0,0,0,0.7)',
                    animation: 'cardFlash 0.12s ease both',
                    transition: 'box-shadow 0.3s',
                  }}
                >
                  <Box component="img"
                    src={`https://image.tmdb.org/t/p/w342${currentMovie.poster_path}`}
                    alt={currentMovie.title}
                    sx={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }}
                  />
                </Box>
              )
            }
            <Button
              variant="contained"
              size="large"
              startIcon={spinning ? <CircularProgress size={18} color="inherit" /> : <CasinoIcon />}
              onClick={spin}
              disabled={spinning || loadingPool || pool.length < 2}
              sx={{
                bgcolor: '#FFC107', color: '#000', fontWeight: 900,
                fontSize: { xs: '1rem', md: '1.1rem' },
                px: { xs: 4, md: 6 }, py: 1.5,
                borderRadius: '50px',
                animation: (!spinning && !loadingPool) ? 'spinBtn 2s ease-in-out infinite' : 'none',
                '&:hover': { bgcolor: '#FFD54F', transform: 'scale(1.04)' },
                '&.Mui-disabled': { bgcolor: 'rgba(255,193,7,0.25)', color: 'rgba(0,0,0,0.4)' },
                transition: 'all 0.2s',
              }}
            >
              {spinning ? 'Eligiendo...' : 'GIRAR'}
            </Button>
            <Button size="small" startIcon={<ArrowBackIcon />} onClick={changeCategory}
              sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#FFC107' }, fontSize: '0.75rem' }}>
              Cambiar categoría
            </Button>
          </Box>
        )}

        {/* ══════════════ STEP: RESULT ══════════════ */}
        {step === 'result' && winner && (
          <AnimReveal>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 5 }, alignItems: { xs: 'center', md: 'flex-start' }, maxWidth: 860, mx: 'auto' }}>

              {/* Poster */}
              <Box sx={{
                flexShrink: 0,
                width: { xs: 180, sm: 220, md: 260 },
                borderRadius: '16px', overflow: 'hidden',
                boxShadow: '0 0 0 3px rgba(255,193,7,0.5), 0 24px 70px rgba(0,0,0,0.8)',
                animation: 'winnerReveal 0.7s var(--ease-spring) both',
              }}>
                <Box component="img"
                  src={`https://image.tmdb.org/t/p/w500${winner.poster_path}`}
                  alt={winner.title}
                  sx={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }}
                />
              </Box>

              {/* Info + metrics */}
              <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' }, animation: 'fadeUp 0.6s 0.2s var(--ease-spring) both', opacity: 0 }}>
                {/* Tag */}
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, bgcolor: 'rgba(255,193,7,0.15)', border: '1px solid rgba(255,193,7,0.4)', color: '#FFC107', fontSize: '0.62rem', fontWeight: 800, px: 1.2, py: 0.35, borderRadius: '4px', mb: 1.5, letterSpacing: '1.2px' }}>
                  <CasinoIcon sx={{ fontSize: 11 }} /> ELEGIDA POR EL AZAR
                </Box>

                <Typography sx={{ fontSize: { xs: '1.5rem', md: '2.1rem' }, fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.5px', mb: 1 }}>
                  {winner.title}
                </Typography>

                {/* Meta chips */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  {winner.release_date && (
                    <Chip icon={<CalendarMonthIcon sx={{ fontSize: '13px !important' }} />} label={winner.release_date.slice(0, 4)} size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', '& .MuiChip-icon': { color: 'rgba(255,255,255,0.5)' } }} />
                  )}
                  {genreNames(winner.genre_ids).map(g => (
                    <Chip key={g} label={g} size="small"
                      sx={{ bgcolor: 'rgba(255,193,7,0.1)', color: '#FFC107', border: '1px solid rgba(255,193,7,0.25)', fontSize: '0.7rem' }} />
                  ))}
                </Box>

                {/* ── Métricas ── */}
                <Box sx={{ mb: 2.5 }}>
                  <MetricBar label="Calificación" value={winner.vote_average} max={10} color={ratingColor(winner.vote_average)} icon={<StarIcon sx={{ fontSize: 13 }} />} display={`${winner.vote_average?.toFixed(1)} / 10`} />
                  <MetricBar label="Popularidad" value={Math.min(winner.popularity / 300 * 10, 10)} max={10} color="#00BCD4" icon={<WhatshotIcon sx={{ fontSize: 13 }} />} display={Math.round(winner.popularity).toLocaleString()} />
                  <MetricBar label="Votos" value={Math.min(winner.vote_count / 10000 * 10, 10)} max={10} color="#9C27B0" icon={<PeopleIcon sx={{ fontSize: 13 }} />} display={winner.vote_count?.toLocaleString()} />
                </Box>

                {/* Overview */}
                <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', lineHeight: 1.65, mb: 3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {winner.overview}
                </Typography>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button variant="contained" startIcon={<PlayArrowIcon />}
                    onClick={() => navigate(`/detalle/${winner.id}`)}
                    sx={{ bgcolor: '#FFC107', color: '#000', fontWeight: 700, px: 3, py: 1, '&:hover': { bgcolor: '#FFD54F', transform: 'scale(1.02)' }, transition: 'all 0.2s' }}>
                    Ver película
                  </Button>
                  <Button variant="outlined" startIcon={<ReplayIcon />} onClick={reset}
                    sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', px: 3, py: 1, '&:hover': { borderColor: '#FFC107', color: '#FFC107' }, transition: 'all 0.2s' }}>
                    Girar de nuevo
                  </Button>
                  <Button size="small" startIcon={<ArrowBackIcon />} onClick={changeCategory}
                    sx={{ color: 'rgba(255,255,255,0.25)', '&:hover': { color: '#FFC107' } }}>
                    Categoría
                  </Button>
                </Box>
              </Box>
            </Box>
          </AnimReveal>
        )}
      </Container>
    </Box>
  );
}

function MetricBar({ label, value, max, color, icon, display }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <Box sx={{ mb: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.45)' }}>
          <Box sx={{ color, display: 'flex' }}>{icon}</Box>
          <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.5px' }}>{label.toUpperCase()}</Typography>
        </Box>
        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color }}>{display}</Typography>
      </Box>
      <Box sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <Box sx={{
          height: '100%', borderRadius: 2, bgcolor: color,
          width: `${pct}%`,
          animation: 'metricBar 1s var(--ease-out-expo) both 0.4s',
          '@keyframes metricBar': { from: { width: '0%' }, to: { width: `${pct}%` } },
        }} />
      </Box>
    </Box>
  );
}
