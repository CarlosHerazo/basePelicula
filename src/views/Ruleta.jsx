import React, { useState, useCallback, useRef } from 'react';
import {
  Box, Container, Typography, Button, Chip,
  CircularProgress, LinearProgress, TextField, InputAdornment,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CasinoIcon           from '@mui/icons-material/Casino';
import ReplayIcon           from '@mui/icons-material/Replay';
import PlayArrowIcon        from '@mui/icons-material/PlayArrow';
import ArrowBackIcon        from '@mui/icons-material/ArrowBack';
import StarIcon             from '@mui/icons-material/Star';
import WhatshotIcon         from '@mui/icons-material/Whatshot';
import TrendingUpIcon       from '@mui/icons-material/TrendingUp';
import FavoriteIcon         from '@mui/icons-material/Favorite';
import FavoriteBorderIcon   from '@mui/icons-material/FavoriteBorder';
import BoltIcon             from '@mui/icons-material/Bolt';
import NightlifeIcon        from '@mui/icons-material/Nightlife';
import EmojiEmotionsIcon    from '@mui/icons-material/EmojiEmotions';
import RocketLaunchIcon     from '@mui/icons-material/RocketLaunch';
import TheatersIcon         from '@mui/icons-material/Theaters';
import PsychologyIcon       from '@mui/icons-material/Psychology';
import CalendarMonthIcon    from '@mui/icons-material/CalendarMonth';
import PeopleIcon           from '@mui/icons-material/People';
import SearchIcon           from '@mui/icons-material/Search';
import AutoAwesomeIcon      from '@mui/icons-material/AutoAwesome';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AutoFixHighIcon      from '@mui/icons-material/AutoFixHigh';
import AnimReveal           from '../components/AnimReveal';
import { useFav }           from '../context/FavoritesContext';

const API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68";
const HEADERS = { 'Content-Type': 'application/json', Authorization: API_TOKEN };
const BASE    = 'https://api.themoviedb.org/3';

const GENRE_MAP = {
  28: 'Acción', 12: 'Aventura', 16: 'Animación', 35: 'Comedia',
  80: 'Crimen',  18: 'Drama',  10751: 'Familia',  14: 'Fantasía',
  27: 'Terror', 9648: 'Misterio', 10749: 'Romance', 878: 'Ciencia ficción',
  53: 'Thriller', 10752: 'Bélica', 37: 'Western',
};

const CATEGORIES = [
  { label: 'Sorpréndeme',    value: 'random',    Icon: AutoAwesomeIcon,      color: '#FF4081', bg: 'rgba(255,64,129,0.1)',   border: 'rgba(255,64,129,0.3)'   },
  { label: 'Populares',      value: 'popular',   Icon: WhatshotIcon,         color: '#E53935', bg: 'rgba(229,57,53,0.1)',    border: 'rgba(229,57,53,0.3)'    },
  { label: 'Tendencias',     value: 'trending',  Icon: TrendingUpIcon,       color: '#00BCD4', bg: 'rgba(0,188,212,0.1)',    border: 'rgba(0,188,212,0.3)'    },
  { label: 'Aclamadas',      value: 'acclaimed', Icon: WorkspacePremiumIcon, color: '#FFD700', bg: 'rgba(255,215,0,0.1)',    border: 'rgba(255,215,0,0.3)'    },
  { label: 'Mis favoritos',  value: 'favorites', Icon: FavoriteIcon,         color: '#E91E63', bg: 'rgba(233,30,99,0.1)',    border: 'rgba(233,30,99,0.3)'    },
  { label: 'Acción',         value: 28,          Icon: BoltIcon,             color: '#FF6F00', bg: 'rgba(255,111,0,0.1)',    border: 'rgba(255,111,0,0.3)'    },
  { label: 'Terror',         value: 27,          Icon: NightlifeIcon,        color: '#9C27B0', bg: 'rgba(156,39,176,0.1)',   border: 'rgba(156,39,176,0.3)'   },
  { label: 'Comedia',        value: 35,          Icon: EmojiEmotionsIcon,    color: '#FFC107', bg: 'rgba(255,193,7,0.1)',    border: 'rgba(255,193,7,0.3)'    },
  { label: 'Ciencia ficción',value: 878,         Icon: RocketLaunchIcon,     color: '#2196F3', bg: 'rgba(33,150,243,0.1)',   border: 'rgba(33,150,243,0.3)'   },
  { label: 'Drama',          value: 18,          Icon: TheatersIcon,         color: '#4CAF50', bg: 'rgba(76,175,80,0.1)',    border: 'rgba(76,175,80,0.3)'    },
  { label: 'Misterio',       value: 9648,        Icon: PsychologyIcon,       color: '#607D8B', bg: 'rgba(96,125,139,0.1)',   border: 'rgba(96,125,139,0.3)'   },
  { label: 'Romance',        value: 10749,       Icon: FavoriteBorderIcon,   color: '#F48FB1', bg: 'rgba(244,143,177,0.1)', border: 'rgba(244,143,177,0.3)'  },
];

const DECADES = [
  { label: 'Clásicos 80s', value: 'decade_80', start: 1980, end: 1989, color: '#FF8A65' },
  { label: 'Nostalgia 90s',value: 'decade_90', start: 1990, end: 1999, color: '#A5D6A7' },
  { label: 'Dos miles',    value: 'decade_00', start: 2000, end: 2009, color: '#90CAF9' },
  { label: '2010s',        value: 'decade_10', start: 2010, end: 2019, color: '#CE93D8' },
  { label: '2020s',        value: 'decade_20', start: 2020, end: 2029, color: '#80DEEA' },
];

const MOODS = [
  { label: 'Noche de terror', Icon: NightlifeIcon,      genres: [27, 53],         color: '#9C27B0' },
  { label: 'Hacerme reír',    Icon: EmojiEmotionsIcon,  genres: [35],             color: '#FFC107' },
  { label: 'Para llorar',     Icon: TheatersIcon,       genres: [18, 10749],      color: '#2196F3' },
  { label: 'Adrenalina pura', Icon: BoltIcon,           genres: [28, 12, 53],     color: '#F44336' },
  { label: 'Hacerme pensar',  Icon: PsychologyIcon,     genres: [9648, 878, 18],  color: '#00BCD4' },
  { label: 'Para la familia', Icon: PeopleIcon,         genres: [10751, 16, 12],  color: '#4CAF50' },
  { label: 'Noche romántica', Icon: FavoriteBorderIcon, genres: [10749, 35],      color: '#E91E63' },
  { label: 'Aventura épica',  Icon: RocketLaunchIcon,   genres: [12, 14, 28],     color: '#FF6F00' },
  { label: 'Animación',       Icon: AutoFixHighIcon,    genres: [16],             color: '#81C784' },
];

const SPIN_DELAYS = [
  65, 65, 70, 75, 80, 85, 90, 95,
  110, 130, 155, 185, 220,
  270, 330, 400, 480,
  570, 680, 800, 950,
];

const ratingColor = r => r >= 7 ? '#4CAF50' : r >= 5 ? '#FFC107' : '#F44336';
const dedupe = arr => { const s = new Set(); return arr.filter(m => m.poster_path && m.backdrop_path && !s.has(m.id) && s.add(m.id)); };

async function preloadPosters(movies, onProgress) {
  let loaded = 0;
  await Promise.all(
    movies.map(m => new Promise(resolve => {
      const img = new Image();
      img.onload = img.onerror = () => { loaded++; onProgress(loaded); resolve(); };
      img.src = `https://image.tmdb.org/t/p/w342${m.poster_path}`;
    }))
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function CategoryCard({ cat, onClick, badge }) {
  return (
    <Box onClick={onClick} sx={{
      p: { xs: 1.5, md: 2 }, borderRadius: '12px',
      border: `1px solid ${cat.border}`, bgcolor: cat.bg,
      cursor: 'pointer', textAlign: 'center',
      position: 'relative', overflow: 'hidden',
      transition: 'transform 0.22s, box-shadow 0.22s, border-color 0.22s',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 16px 40px ${cat.color}20`, borderColor: `${cat.color}66` },
      '&:hover .c-icon': { transform: 'scale(1.2)', opacity: 1 },
    }}>
      <Box sx={{ position: 'absolute', top: -14, right: -14, width: 52, height: 52, borderRadius: '50%', bgcolor: cat.color, opacity: 0.08, filter: 'blur(12px)' }} />
      <Box className="c-icon" sx={{ color: cat.color, mb: 0.5, transition: 'transform 0.25s, opacity 0.25s', opacity: 0.85 }}>
        <cat.Icon sx={{ fontSize: { xs: 22, md: 26 } }} />
      </Box>
      <Typography sx={{ fontSize: { xs: '0.73rem', md: '0.8rem' }, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
        {cat.label}
      </Typography>
      {badge && (
        <Typography sx={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.28)', mt: 0.2 }}>{badge}</Typography>
      )}
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
          <Typography sx={{ fontSize: '0.67rem', fontWeight: 600, letterSpacing: '0.5px' }}>{label.toUpperCase()}</Typography>
        </Box>
        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color }}>{display}</Typography>
      </Box>
      <Box sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <Box sx={{
          height: '100%', borderRadius: 2, bgcolor: color, width: `${pct}%`,
          animation: 'metricBar 1s var(--ease-out-expo) both 0.4s',
          '@keyframes metricBar': { from: { width: '0%' }, to: { width: `${pct}%` } },
        }} />
      </Box>
    </Box>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────

export default function Ruleta() {
  const navigate = useNavigate();
  const { favorites } = useFav();

  const [step,          setStep]          = useState('select');
  const [label,         setLabel]         = useState('');
  const [pool,          setPool]          = useState([]);
  const [loadingPool,   setLoadingPool]   = useState(false);
  const [preloadDone,   setPreloadDone]   = useState(false);
  const [preloadLoaded, setPreloadLoaded] = useState(0);
  const [currentMovie,  setCurrentMovie]  = useState(null);
  const [spinning,      setSpinning]      = useState(false);
  const [winner,        setWinner]        = useState(null);
  const [spinKey,       setSpinKey]       = useState(0);
  const [searchText,    setSearchText]    = useState('');
  const [searchError,   setSearchError]   = useState('');
  const skipRef = useRef(false);

  const prepare = useCallback(async (displayLabel, fetchFn) => {
    setLoadingPool(true);
    setPreloadDone(false);
    setPreloadLoaded(0);
    setWinner(null);
    setStep('ready');
    setLabel(displayLabel);
    setSearchError('');
    skipRef.current = false;

    try {
      const movies = await fetchFn();
      if (!movies.length) {
        setSearchError('No se encontraron películas. Prueba con otro término.');
        setStep('select');
        setLoadingPool(false);
        return;
      }
      setPool(movies);
      setCurrentMovie(movies[Math.floor(Math.random() * movies.length)]);
      setLoadingPool(false);

      await preloadPosters(movies, n => { if (!skipRef.current) setPreloadLoaded(n); });
      setPreloadDone(true);
    } catch (e) {
      console.error(e);
      setLoadingPool(false);
    }
  }, []);

  const selectCategory = cat => {
    const v = cat.value;
    const fetchFn = async () => {
      if (v === 'favorites') return favorites.filter(f => f.poster_path && f.backdrop_path);

      if (v === 'random') {
        const [a, b, c] = await Promise.all([
          fetch(`${BASE}/movie/popular?language=es&page=1`,   { headers: HEADERS }).then(r => r.json()),
          fetch(`${BASE}/movie/top_rated?language=es&page=1`, { headers: HEADERS }).then(r => r.json()),
          fetch(`${BASE}/trending/movie/week?language=es`,    { headers: HEADERS }).then(r => r.json()),
        ]);
        return dedupe([...(a.results ?? []), ...(b.results ?? []), ...(c.results ?? [])]);
      }

      if (v === 'acclaimed') {
        const d = await fetch(`${BASE}/discover/movie?sort_by=vote_average.desc&vote_count.gte=1500&language=es&page=1`, { headers: HEADERS }).then(r => r.json());
        return dedupe(d.results ?? []);
      }

      if (typeof v === 'string' && v.startsWith('decade_')) {
        const d = await fetch(
          `${BASE}/discover/movie?sort_by=vote_count.desc&vote_count.gte=300&primary_release_date.gte=${cat.start}-01-01&primary_release_date.lte=${cat.end}-12-31&language=es&page=1`,
          { headers: HEADERS }
        ).then(r => r.json());
        return dedupe(d.results ?? []);
      }

      if (typeof v === 'number') {
        const d = await fetch(
          `${BASE}/discover/movie?with_genres=${v}&sort_by=vote_count.desc&vote_count.gte=200&language=es&page=1`,
          { headers: HEADERS }
        ).then(r => r.json());
        return dedupe(d.results ?? []);
      }
      return [];
    };
    prepare(cat.label, fetchFn);
  };

  const selectMood = mood => {
    const ids = mood.genres.join(',');
    prepare(mood.label, async () => {
      const [p1, p2] = await Promise.all([
        fetch(`${BASE}/discover/movie?with_genres=${ids}&sort_by=vote_count.desc&vote_count.gte=200&language=es&page=1`, { headers: HEADERS }).then(r => r.json()),
        fetch(`${BASE}/discover/movie?with_genres=${ids}&sort_by=popularity.desc&vote_count.gte=100&language=es&page=1`, { headers: HEADERS }).then(r => r.json()),
      ]);
      return dedupe([...(p1.results ?? []), ...(p2.results ?? [])]);
    });
  };

  const searchByText = () => {
    const text = searchText.trim();
    if (!text) return;
    prepare(`"${text}"`, async () => {
      // try keyword discovery first
      try {
        const kw = await fetch(`${BASE}/search/keyword?query=${encodeURIComponent(text)}`, { headers: HEADERS }).then(r => r.json());
        const ids = (kw.results ?? []).slice(0, 3).map(k => k.id).join('|');
        if (ids) {
          const d = await fetch(`${BASE}/discover/movie?with_keywords=${ids}&sort_by=vote_count.desc&vote_count.gte=50&language=es&page=1`, { headers: HEADERS }).then(r => r.json());
          const km = dedupe(d.results ?? []);
          if (km.length >= 4) return km;
        }
      } catch { /* fall through */ }
      // fallback: title search
      const s = await fetch(`${BASE}/search/movie?query=${encodeURIComponent(text)}&language=es&page=1`, { headers: HEADERS }).then(r => r.json());
      return dedupe(s.results ?? []);
    });
  };

  const spin = useCallback(() => {
    if (!pool.length || spinning) return;
    setSpinning(true);
    setWinner(null);
    const winnerMovie = pool[Math.floor(Math.random() * pool.length)];
    let tick = 0;
    const next = () => {
      const isLast = tick >= SPIN_DELAYS.length - 1;
      setCurrentMovie(isLast ? winnerMovie : pool[Math.floor(Math.random() * pool.length)]);
      setSpinKey(k => k + 1);
      if (isLast) { setWinner(winnerMovie); setSpinning(false); setStep('result'); }
      else { tick++; setTimeout(next, SPIN_DELAYS[tick]); }
    };
    setTimeout(next, SPIN_DELAYS[0]);
  }, [pool, spinning]);

  const reset          = () => { setWinner(null); setStep('ready'); setPreloadDone(true); };
  const changeCategory = () => { setStep('select'); setWinner(null); setPreloadDone(false); setPool([]); };
  const skipPreload    = () => { skipRef.current = true; setPreloadDone(true); };
  const genreNames     = ids => (ids ?? []).map(id => GENRE_MAP[id]).filter(Boolean).slice(0, 3);
  const preloadPct     = pool.length > 0 ? Math.round((preloadLoaded / pool.length) * 100) : 0;

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* Cinematic background */}
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
            transition: 'filter 0.8s ease',
          }}
        />
      )}
      <Box sx={{ position: 'fixed', inset: 0, zIndex: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 100%)' }} />

      <Container maxWidth="lg" className="page-enter" sx={{ position: 'relative', zIndex: 1, pt: { xs: 10, md: 11 }, pb: 8 }}>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <CasinoIcon sx={{ color: '#FFC107', fontSize: { xs: 28, md: 36 }, animation: spinning ? 'spinBtn 0.6s ease infinite' : 'none' }} />
            <Typography sx={{ fontSize: { xs: '1.6rem', md: '2.4rem' }, fontWeight: 900, color: '#fff', letterSpacing: '-0.8px' }}>
              Ruleta de películas
            </Typography>
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.88rem' }}>
            {step === 'select' && 'Elige cómo quieres ser sorprendido esta noche'}
            {step === 'ready'  && `${label} · ${pool.length} películas disponibles`}
            {step === 'result' && 'El azar ha decidido por ti'}
          </Typography>
        </Box>

        {/* ══ SELECT ══════════════════════════════════════════════════════════ */}
        {step === 'select' && (
          <AnimReveal>
            <Box sx={{ maxWidth: 820, mx: 'auto' }}>

              {/* Categorías */}
              <SectionLabel>CATEGORÍAS</SectionLabel>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(3,1fr)', sm: 'repeat(4,1fr)', md: 'repeat(6,1fr)' },
                gap: { xs: 1, md: 1.2 }, mb: 3,
              }}>
                {CATEGORIES.map(cat => (
                  <CategoryCard key={cat.value} cat={cat}
                    onClick={() => selectCategory(cat)}
                    badge={cat.value === 'favorites' ? `${favorites.length} guardadas` : null}
                  />
                ))}
              </Box>

              {/* Por época */}
              <SectionLabel>POR ÉPOCA</SectionLabel>
              <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                {DECADES.map(d => (
                  <Box key={d.value} onClick={() => selectCategory({ ...d, Icon: CalendarMonthIcon })}
                    sx={{
                      flex: '1 1 auto', py: 1.4, px: 1.5, borderRadius: '12px', cursor: 'pointer',
                      border: `1px solid ${d.color}33`, bgcolor: `${d.color}0C`, textAlign: 'center',
                      transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                      '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 12px 28px ${d.color}22`, borderColor: `${d.color}77` },
                    }}>
                    <CalendarMonthIcon sx={{ fontSize: 18, color: d.color, display: 'block', mx: 'auto', mb: 0.4 }} />
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff' }}>{d.label}</Typography>
                    <Typography sx={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.28)' }}>{d.start}–{d.end}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Estado de ánimo */}
              <SectionLabel>POR ESTADO DE ÁNIMO</SectionLabel>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {MOODS.map(mood => (
                  <Box key={mood.label} onClick={() => selectMood(mood)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 0.7,
                      px: 1.5, py: 0.8, borderRadius: '20px', cursor: 'pointer',
                      border: `1px solid ${mood.color}33`, bgcolor: `${mood.color}0C`,
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: `${mood.color}1A`, borderColor: `${mood.color}77`, transform: 'scale(1.04)' },
                    }}>
                    <mood.Icon sx={{ fontSize: 15, color: mood.color }} />
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff' }}>{mood.label}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Búsqueda libre */}
              <SectionLabel>BÚSQUEDA LIBRE</SectionLabel>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <TextField
                  fullWidth size="small"
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && searchByText()}
                  placeholder='"mafia italiana" · "robots del futuro" · "amor prohibido" · "space opera"'
                  error={!!searchError}
                  helperText={searchError || 'Escribe cualquier tema, personaje o característica'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'rgba(255,255,255,0.28)', fontSize: 19 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-root': { color: '#fff', bgcolor: 'rgba(255,255,255,0.04)', borderRadius: '12px' },
                    '& .MuiFormHelperText-root': { color: searchError ? '#E53935' : 'rgba(255,255,255,0.22)', ml: 0.5, fontSize: '0.65rem' },
                  }}
                />
                <Button
                  onClick={searchByText}
                  disabled={!searchText.trim()}
                  sx={{
                    minWidth: 'auto', px: 2.5, py: 1, bgcolor: '#FFC107', color: '#000',
                    fontWeight: 700, borderRadius: '12px', flexShrink: 0, height: 40,
                    '&:hover': { bgcolor: '#FFD54F' },
                    '&.Mui-disabled': { bgcolor: 'rgba(255,193,7,0.2)', color: 'rgba(0,0,0,0.3)' },
                  }}>
                  Buscar
                </Button>
              </Box>

            </Box>
          </AnimReveal>
        )}

        {/* ══ READY (loading + preload + spin) ════════════════════════════════ */}
        {step === 'ready' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>

            {/* Poster */}
            {currentMovie && (
              <Box
                key={spinKey}
                sx={{
                  width: { xs: 160, sm: 200, md: 240 },
                  borderRadius: '14px', overflow: 'hidden',
                  boxShadow: preloadDone
                    ? (spinning ? '0 0 0 3px rgba(255,193,7,0.5), 0 20px 60px rgba(0,0,0,0.7)' : '0 20px 60px rgba(0,0,0,0.7)')
                    : '0 0 0 2px rgba(255,193,7,0.2)',
                  filter: (!preloadDone && !loadingPool) ? 'blur(6px) brightness(0.5)' : 'none',
                  transition: 'filter 0.6s ease, box-shadow 0.3s',
                  animation: spinning ? 'cardFlash 0.12s ease both' : 'none',
                }}
              >
                <Box component="img"
                  src={`https://image.tmdb.org/t/p/w342${currentMovie.poster_path}`}
                  alt={currentMovie.title}
                  sx={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }}
                />
              </Box>
            )}

            {/* Fetching */}
            {loadingPool && (
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress color="warning" size={30} thickness={3} sx={{ mb: 1 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.78rem' }}>
                  Buscando películas...
                </Typography>
              </Box>
            )}

            {/* Preloading images */}
            {!loadingPool && !preloadDone && (
              <Box sx={{ width: '100%', maxWidth: 300, textAlign: 'center' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', mb: 1 }}>
                  Preparando pósters — {preloadLoaded} / {pool.length}
                </Typography>
                <LinearProgress variant="determinate" value={preloadPct}
                  sx={{
                    height: 3, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.07)',
                    '& .MuiLinearProgress-bar': { bgcolor: '#FFC107', borderRadius: 2 },
                    mb: 1.5,
                  }}
                />
                <Button size="small" onClick={skipPreload}
                  sx={{ color: 'rgba(255,255,255,0.22)', fontSize: '0.68rem', '&:hover': { color: 'rgba(255,255,255,0.5)' } }}>
                  Omitir y girar ya
                </Button>
              </Box>
            )}

            {/* Spin button — appears when preload done */}
            {!loadingPool && preloadDone && !spinning && (
              <Button variant="contained" size="large"
                startIcon={<CasinoIcon />}
                onClick={spin}
                disabled={pool.length < 2}
                sx={{
                  bgcolor: '#FFC107', color: '#000', fontWeight: 900,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  px: { xs: 5, md: 7 }, py: 1.6, borderRadius: '50px',
                  animation: 'spinBtn 2s ease-in-out infinite',
                  '&:hover': { bgcolor: '#FFD54F', transform: 'scale(1.04)' },
                  transition: 'all 0.2s',
                }}>
                GIRAR
              </Button>
            )}

            {/* Spinning indicator */}
            {spinning && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <CircularProgress size={18} color="warning" thickness={4} />
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontWeight: 600 }}>
                  Eligiendo...
                </Typography>
              </Box>
            )}

            {!loadingPool && preloadDone && (
              <Typography sx={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.7rem' }}>
                {pool.length} películas en la ruleta
              </Typography>
            )}

            <Button size="small" startIcon={<ArrowBackIcon />} onClick={changeCategory}
              sx={{ color: 'rgba(255,255,255,0.28)', '&:hover': { color: '#FFC107' }, fontSize: '0.73rem' }}>
              Cambiar categoría
            </Button>
          </Box>
        )}

        {/* ══ RESULT ══════════════════════════════════════════════════════════ */}
        {step === 'result' && winner && (
          <AnimReveal>
            <Box sx={{
              display: 'flex', flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 3, md: 5 }, alignItems: { xs: 'center', md: 'flex-start' },
              maxWidth: 860, mx: 'auto',
            }}>
              {/* Poster */}
              <Box sx={{
                flexShrink: 0, width: { xs: 180, sm: 220, md: 260 },
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

              {/* Info */}
              <Box sx={{
                flex: 1, textAlign: { xs: 'center', md: 'left' },
                animation: 'fadeUp 0.6s 0.2s var(--ease-spring) both', opacity: 0,
              }}>
                <Box sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 0.6,
                  bgcolor: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.35)',
                  color: '#FFC107', fontSize: '0.6rem', fontWeight: 800,
                  px: 1.2, py: 0.35, borderRadius: '4px', mb: 1.5, letterSpacing: '1.2px',
                }}>
                  <CasinoIcon sx={{ fontSize: 11 }} /> ELEGIDA POR EL AZAR
                </Box>

                <Typography sx={{ fontSize: { xs: '1.5rem', md: '2.1rem' }, fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.5px', mb: 1 }}>
                  {winner.title}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  {winner.release_date && (
                    <Chip icon={<CalendarMonthIcon sx={{ fontSize: '13px !important' }} />}
                      label={winner.release_date.slice(0, 4)} size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', fontSize: '0.7rem', '& .MuiChip-icon': { color: 'rgba(255,255,255,0.45)' } }}
                    />
                  )}
                  {genreNames(winner.genre_ids).map(g => (
                    <Chip key={g} label={g} size="small"
                      sx={{ bgcolor: 'rgba(255,193,7,0.1)', color: '#FFC107', border: '1px solid rgba(255,193,7,0.25)', fontSize: '0.7rem' }}
                    />
                  ))}
                </Box>

                <Box sx={{ mb: 2.5 }}>
                  <MetricBar label="Calificación" value={winner.vote_average} max={10}
                    color={ratingColor(winner.vote_average)} icon={<StarIcon sx={{ fontSize: 13 }} />}
                    display={`${winner.vote_average?.toFixed(1)} / 10`} />
                  <MetricBar label="Popularidad" value={Math.min(winner.popularity / 300 * 10, 10)} max={10}
                    color="#00BCD4" icon={<WhatshotIcon sx={{ fontSize: 13 }} />}
                    display={Math.round(winner.popularity).toLocaleString()} />
                  <MetricBar label="Votos" value={Math.min(winner.vote_count / 10000 * 10, 10)} max={10}
                    color="#9C27B0" icon={<PeopleIcon sx={{ fontSize: 13 }} />}
                    display={winner.vote_count?.toLocaleString()} />
                </Box>

                <Typography sx={{
                  color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.65, mb: 3,
                  display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {winner.overview}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button variant="contained" startIcon={<PlayArrowIcon />}
                    onClick={() => navigate(`/detalle/${winner.id}`)}
                    sx={{ bgcolor: '#FFC107', color: '#000', fontWeight: 700, px: 3, py: 1, '&:hover': { bgcolor: '#FFD54F', transform: 'scale(1.02)' }, transition: 'all 0.2s' }}>
                    Ver película
                  </Button>
                  <Button variant="outlined" startIcon={<ReplayIcon />} onClick={reset}
                    sx={{ borderColor: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.55)', px: 3, py: 1, '&:hover': { borderColor: '#FFC107', color: '#FFC107' }, transition: 'all 0.2s' }}>
                    Girar de nuevo
                  </Button>
                  <Button size="small" startIcon={<ArrowBackIcon />} onClick={changeCategory}
                    sx={{ color: 'rgba(255,255,255,0.22)', '&:hover': { color: '#FFC107' } }}>
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

function SectionLabel({ children }) {
  return (
    <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, color: 'rgba(255,255,255,0.28)', letterSpacing: '1.8px', mb: 1.2 }}>
      {children}
    </Typography>
  );
}
