import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Box, Button,
  Collapse, Alert, CircularProgress, Chip, Divider,
} from '@mui/material';
import SearchIcon           from '@mui/icons-material/Search';
import ExpandMoreIcon       from '@mui/icons-material/ExpandMore';
import LocalMoviesIcon      from '@mui/icons-material/LocalMovies';
import StarIcon             from '@mui/icons-material/Star';
import CalendarMonthIcon    from '@mui/icons-material/CalendarMonth';
import WhatshotIcon         from '@mui/icons-material/Whatshot';
import BoltIcon             from '@mui/icons-material/Bolt';
import NightlifeIcon        from '@mui/icons-material/Nightlife';
import EmojiEmotionsIcon    from '@mui/icons-material/EmojiEmotions';
import RocketLaunchIcon     from '@mui/icons-material/RocketLaunch';
import FavoriteIcon         from '@mui/icons-material/Favorite';
import PsychologyIcon       from '@mui/icons-material/Psychology';
import AutoFixHighIcon      from '@mui/icons-material/AutoFixHigh';
import TheatersIcon         from '@mui/icons-material/Theaters';
import { useNavigate }   from 'react-router-dom';

import BlueCard             from '../components/BlueCard';
import SkeletonCard         from '../components/SkeletonCard';
import RecomendacionBanner  from '../components/RecomendacionBanner';
import MovieRow, { MovieRowSkeleton } from '../components/MovieRow';
import FeaturedSpotlight    from '../components/FeaturedSpotlight';
import TrendingActors       from '../components/TrendingActors';
import CollectionRow        from '../components/CollectionRow';
import MoodRow              from '../components/MoodRow';
import AnimReveal           from '../components/AnimReveal';

const API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68";
const HEADERS  = { 'Content-Type': 'application/json', Authorization: API_TOKEN };

const GENEROS = [
  { label: 'Acción',          id: 28,    icon: BoltIcon },
  { label: 'Terror',          id: 27,    icon: NightlifeIcon },
  { label: 'Comedia',         id: 35,    icon: EmojiEmotionsIcon },
  { label: 'Ciencia ficción', id: 878,   icon: RocketLaunchIcon },
  { label: 'Romance',         id: 10749, icon: FavoriteIcon },
  { label: 'Misterio',        id: 9648,  icon: PsychologyIcon },
  { label: 'Animación',       id: 16,    icon: AutoFixHighIcon },
  { label: 'Drama',           id: 18,    icon: TheatersIcon },
];

function Inicio({ Peliculas }) {
  const navigate = useNavigate();

  // Search state
  const [searchTerm,        setSearchTerm]        = useState('');
  const [searchResults,     setSearchResults]     = useState([]);
  const [searchPage,        setSearchPage]        = useState(1);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [mostrarAlerta,     setMostrarAlerta]     = useState(false);
  const [hasMoreSearch,     setHasMoreSearch]     = useState(false);

  // Discover load-more state
  const [allMovies,   setAllMovies]   = useState([]);
  const [page,        setPage]        = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore,     setHasMore]     = useState(true);

  // Section data
  const [nowPlaying, setNowPlaying] = useState([]);
  const [topRated,   setTopRated]   = useState([]);
  const [upcoming,   setUpcoming]   = useState([]);
  const [sectionsLoaded, setSectionsLoaded] = useState(false);

  useEffect(() => {
    if (Peliculas) { setAllMovies(Peliculas); setPage(1); setHasMore(true); }
  }, [Peliculas]);

  // Fetch curated sections
  useEffect(() => {
    Promise.all([
      fetch('https://api.themoviedb.org/3/movie/now_playing?language=es&page=1', { headers: HEADERS }).then(r => r.json()),
      fetch('https://api.themoviedb.org/3/movie/top_rated?language=es&page=1',   { headers: HEADERS }).then(r => r.json()),
      fetch('https://api.themoviedb.org/3/movie/upcoming?language=es&page=1',    { headers: HEADERS }).then(r => r.json()),
    ])
      .then(([np, tr, up]) => {
        setNowPlaying(np.results?.filter(p => p.poster_path).slice(0, 16) ?? []);
        setTopRated(tr.results?.filter(p => p.poster_path).slice(0, 16)   ?? []);
        setUpcoming(up.results?.filter(p => p.poster_path).slice(0, 16)   ?? []);
        setSectionsLoaded(true);
      })
      .catch(console.error);
  }, []);

  const showAlert = () => { setMostrarAlerta(true); setTimeout(() => setMostrarAlerta(false), 3000); };

  const handleSearch = () => {
    if (!searchTerm.trim()) { showAlert(); return; }
    fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchTerm)}&include_adult=false&language=es&page=1`, { headers: HEADERS })
      .then(r => r.json())
      .then(data => {
        if (data.results?.length) {
          setSearchResults(data.results);
          setSearchPage(1);
          setHasMoreSearch(data.page < data.total_pages);
          setBusquedaRealizada(true);
        } else { showAlert(); }
      })
      .catch(console.error);
  };

  const clearSearch = () => { setBusquedaRealizada(false); setSearchResults([]); setSearchTerm(''); setHasMoreSearch(false); };
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch(); };

  const loadMoreDiscover = async () => {
    setLoadingMore(true);
    try {
      const next = page + 1;
      const res  = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&language=es&page=${next}&sort_by=popularity.desc`, { headers: HEADERS });
      const data = await res.json();
      if (data.results?.length) { setAllMovies(prev => [...prev, ...data.results]); setPage(next); if (next >= data.total_pages) setHasMore(false); }
      else setHasMore(false);
    } catch (err) { console.error(err); } finally { setLoadingMore(false); }
  };

  const loadMoreSearch = async () => {
    setLoadingMore(true);
    try {
      const next = searchPage + 1;
      const res  = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchTerm)}&include_adult=false&language=es&page=${next}`, { headers: HEADERS });
      const data = await res.json();
      if (data.results?.length) { setSearchResults(prev => [...prev, ...data.results]); setSearchPage(next); if (next >= data.total_pages) setHasMoreSearch(false); }
      else setHasMoreSearch(false);
    } catch (err) { console.error(err); } finally { setLoadingMore(false); }
  };

  const displayedMovies = busquedaRealizada ? searchResults : allMovies;
  const canLoadMore     = busquedaRealizada ? hasMoreSearch : hasMore;
  const onLoadMore      = busquedaRealizada ? loadMoreSearch : loadMoreDiscover;

  return (
    <Container maxWidth="xl" className="page-enter" sx={{ pt: 10, pb: 6 }}>

      {/* ── Header ── */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 2, mb: 1 }}>
        <Typography component="h1" className="section-title"
          sx={{ fontSize: { xs: '1.25rem', md: '1.45rem' }, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
          {busquedaRealizada ? `Resultados: "${searchTerm}"` : 'Películas populares'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField placeholder="Buscar película…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown} size="small"
            sx={{ width: { xs: '100%', sm: 260 }, '& .MuiInputBase-input': { color: '#fff', fontSize: '0.9rem' } }} />
          <Button variant="contained" onClick={handleSearch} startIcon={<SearchIcon />}
            sx={{ bgcolor: '#FFC107', color: '#000', fontWeight: 700, px: 2.5, py: 0.9, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#FFD54F', transform: 'scale(1.02)' }, transition: 'all 0.2s' }}>
            Buscar
          </Button>
          {busquedaRealizada && (
            <Button variant="text" size="small" onClick={clearSearch}
              sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', '&:hover': { color: '#FFC107' } }}>
              Limpiar
            </Button>
          )}
        </Box>
      </Box>

      <Collapse in={mostrarAlerta} timeout={800}>
        <Alert variant="outlined" severity="warning"
          sx={{ my: 1.5, bgcolor: 'rgba(255,193,7,0.07)', borderColor: 'rgba(255,193,7,0.4)', color: '#FFC107' }}>
          Por favor, ingresa el nombre de la película.
        </Alert>
      </Collapse>

      {/* ── SEARCH RESULTS ── */}
      {busquedaRealizada ? (
        <>
          {!displayedMovies?.length
            ? <SkeletonCard count={12} />
            : <BlueCard Peliculas={displayedMovies} />
          }
          {canLoadMore && displayedMovies?.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <Button onClick={onLoadMore} disabled={loadingMore} variant="outlined"
                startIcon={loadingMore ? <CircularProgress size={16} color="inherit" /> : <ExpandMoreIcon />}
                sx={{ borderColor: 'rgba(255,193,7,0.35)', color: '#FFC107', px: 5, py: 1.2, '&:hover': { borderColor: '#FFC107', bgcolor: 'rgba(255,193,7,0.07)' }, '&.Mui-disabled': { color: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.08)' }, transition: 'all 0.2s' }}>
                {loadingMore ? 'Cargando…' : 'Cargar más'}
              </Button>
            </Box>
          )}
        </>
      ) : (
        <>
          {/* ── Para Ti ── */}
          <AnimReveal><RecomendacionBanner /></AnimReveal>

          {/* ── Géneros rápidos ── */}
          <AnimReveal delay={60}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
              {GENEROS.map(g => {
                const GenIcon = g.icon;
                return (
                  <Chip
                    key={g.id}
                    label={g.label}
                    clickable
                    icon={<GenIcon sx={{ fontSize: '14px !important', color: 'inherit !important' }} />}
                    onClick={() => navigate('/categorias')}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.05)',
                      color: 'rgba(255,255,255,0.65)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      fontSize: '0.78rem', borderRadius: '20px',
                      '& .MuiChip-icon': { color: 'inherit' },
                      '&:hover': { bgcolor: 'rgba(255,193,7,0.12)', color: '#FFC107', borderColor: 'rgba(255,193,7,0.3)' },
                      transition: 'all 0.2s',
                    }}
                  />
                );
              })}
            </Box>
          </AnimReveal>

          {/* ── Ahora en cines ── */}
          <AnimReveal>
            {sectionsLoaded
              ? <MovieRow titulo="Ahora en cines" icono={<LocalMoviesIcon sx={{ fontSize: 18 }} />} Peliculas={nowPlaying} />
              : <MovieRowSkeleton />
            }
          </AnimReveal>

          {/* ── SPOTLIGHT 1: Película más popular ── */}
          {allMovies?.[0] && (
            <AnimReveal>
              <Box sx={{ mb: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <WhatshotIcon sx={{ color: '#E50914', fontSize: 18 }} />
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>
                    La más popular ahora
                  </Typography>
                </Box>
                <FeaturedSpotlight pelicula={allMovies[0]} etiqueta="MÁS POPULAR" />
              </Box>
            </AnimReveal>
          )}

          {/* ── Mejor valoradas ── */}
          <AnimReveal>
            {sectionsLoaded
              ? <MovieRow titulo="Mejor valoradas" icono={<StarIcon sx={{ fontSize: 18 }} />} Peliculas={topRated} />
              : <MovieRowSkeleton />
            }
          </AnimReveal>

          {/* ── SPOTLIGHT DOBLE diagonal ── */}
          {topRated.length >= 2 && (
            <AnimReveal>
              <Box sx={{ mb: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <StarIcon sx={{ color: '#FFC107', fontSize: 18 }} />
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>
                    Destacadas de la semana
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 0 }}>
                  <FeaturedSpotlight pelicula={topRated[1]} etiqueta="TOP VALORADA"   invertir={false} />
                  <FeaturedSpotlight pelicula={topRated[2]} etiqueta="CRÍTICA FAVORITA" invertir={true} />
                </Box>
              </Box>
            </AnimReveal>
          )}

          {/* ── Próximos estrenos ── */}
          <AnimReveal>
            {sectionsLoaded
              ? <MovieRow titulo="Próximos estrenos" icono={<CalendarMonthIcon sx={{ fontSize: 18 }} />} Peliculas={upcoming} />
              : <MovieRowSkeleton />
            }
          </AnimReveal>

          {/* ── Divider hacia catálogo ── */}
          <AnimReveal>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 4 }}>
              <Divider sx={{ flex: 1, borderColor: 'rgba(255,255,255,0.06)' }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1.5px', whiteSpace: 'nowrap' }}>
                EXPLORAR TODO EL CATÁLOGO
              </Typography>
              <Divider sx={{ flex: 1, borderColor: 'rgba(255,255,255,0.06)' }} />
            </Box>
          </AnimReveal>

          {/* ── Catálogo completo ── */}
          <AnimReveal>
            {!allMovies?.length
              ? <SkeletonCard count={12} />
              : <BlueCard Peliculas={allMovies} />
            }
          </AnimReveal>

          {canLoadMore && allMovies?.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <Button onClick={onLoadMore} disabled={loadingMore} variant="outlined"
                startIcon={loadingMore ? <CircularProgress size={16} color="inherit" /> : <ExpandMoreIcon />}
                sx={{ borderColor: 'rgba(255,193,7,0.35)', color: '#FFC107', px: 5, py: 1.2, fontSize: '0.9rem', '&:hover': { borderColor: '#FFC107', bgcolor: 'rgba(255,193,7,0.07)', transform: 'translateY(-1px)' }, '&.Mui-disabled': { color: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.08)' }, transition: 'all 0.2s' }}>
                {loadingMore ? 'Cargando…' : 'Cargar más películas'}
              </Button>
            </Box>
          )}

          {/* ── Divider ── */}
          <AnimReveal>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 5 }}>
              <Divider sx={{ flex: 1, borderColor: 'rgba(255,255,255,0.06)' }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.22)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1.5px', whiteSpace: 'nowrap' }}>
                DESCUBRE MÁS
              </Typography>
              <Divider sx={{ flex: 1, borderColor: 'rgba(255,255,255,0.06)' }} />
            </Box>
          </AnimReveal>

          {/* ── Personas del momento ── */}
          <AnimReveal><TrendingActors /></AnimReveal>

          {/* ── Sagas y franquicias ── */}
          <AnimReveal><CollectionRow /></AnimReveal>

          {/* ── ¿Qué quieres ver hoy? ── */}
          <AnimReveal><MoodRow /></AnimReveal>
        </>
      )}
    </Container>
  );
}

export default Inicio;
