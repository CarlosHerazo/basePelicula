import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Grid, Typography, Chip, Link,
  Button, CircularProgress,
  Avatar, IconButton, Tooltip,
} from '@mui/material';
import RatingCircle  from '../components/RatingCircle';
import MovieRow      from '../components/MovieRow';
import TrailerModal    from '../components/TrailerYoutube';
import WatchMovie      from '../components/WatchMovie';
import WhereToWatch    from '../components/WhereToWatch';
import MovieDashboard  from '../components/MovieDashboard';
import WikiTrivia      from '../components/WikiTrivia';
import ShareCard       from '../components/ShareCard';
import { useWatchlist } from '../context/WatchlistContext';
import BookmarkAddOutlinedIcon    from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkAddedIcon          from '@mui/icons-material/BookmarkAdded';
import CheckCircleOutlineIcon     from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon            from '@mui/icons-material/CheckCircle';
import IosShareIcon               from '@mui/icons-material/IosShare';
import CompareArrowsIcon          from '@mui/icons-material/CompareArrows';
import MovieIcon          from '@mui/icons-material/Movie';
import PlayArrowIcon      from '@mui/icons-material/PlayArrow';
import LinkIcon           from '@mui/icons-material/OpenInNew';
import FavoriteIcon       from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useFav } from '../context/FavoritesContext';

const API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68";
const HEADERS = { accept: 'application/json', Authorization: API_TOKEN };

const fmt = (n) => n > 0 ? `$${new Intl.NumberFormat('en-US').format(n)}` : 'N/A';
const fmtRuntime = (m) => {
  if (!m) return null;
  const h = Math.floor(m / 60), min = m % 60;
  return h > 0 ? `${h}h ${min}m` : `${min}m`;
};

const InfoRow = ({ label, children }) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography component="span" sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', letterSpacing: '0.8px', display: 'block', mb: 0.25 }}>
      {label.toUpperCase()}
    </Typography>
    {typeof children === 'string'
      ? <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{children}</Typography>
      : children}
  </Box>
);

export default function DetallesPelis() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { isFav, toggle } = useFav();

  const [pelicula,  setPelicula]  = useState(null);
  const [cast,      setCast]      = useState([]);
  const [similares, setSimilares] = useState([]);
  const [error,     setError]     = useState(null);
  const [openModal,  setOpenModal]  = useState(false);
  const [openShare,  setOpenShare]  = useState(false);
  const watchRef = useRef(null);
  const { getStatus, setStatus } = useWatchlist();

  useEffect(() => {
    window.scrollTo(0, 0);
    setPelicula(null); setCast([]); setSimilares([]); setError(null);

    Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${id}?language=es`,                       { headers: HEADERS }).then(r => r.json()),
      fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=es`,               { headers: HEADERS }).then(r => r.json()),
      fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?language=es&page=1`, { headers: HEADERS }).then(r => r.json()),
    ])
      .then(([movie, credits, recs]) => {
        if (!movie.id) throw new Error('Película no encontrada');
        setPelicula(movie);
        setCast(credits.cast?.slice(0, 8) ?? []);

        const recResults = (recs.results ?? []).filter(p => p.poster_path);

        if (recResults.length >= 8) {
          setSimilares(recResults.slice(0, 16));
          return;
        }

        // Complementar con discover por géneros de la película
        const genreIds = (movie.genres ?? []).map(g => g.id).join(',');
        if (!genreIds) { setSimilares(recResults.slice(0, 16)); return; }

        fetch(
          `https://api.themoviedb.org/3/discover/movie?with_genres=${genreIds}&sort_by=vote_count.desc&vote_count.gte=200&language=es&page=1`,
          { headers: HEADERS }
        )
          .then(r => r.json())
          .then(disc => {
            const extra = (disc.results ?? []).filter(
              p => p.poster_path && p.id !== Number(id) && !recResults.some(r => r.id === p.id)
            );
            setSimilares([...recResults, ...extra].slice(0, 16));
          })
          .catch(() => setSimilares(recResults.slice(0, 16)));
      })
      .catch(e => setError(e.message));
  }, [id]);


  if (error) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 2 }}>
      <Typography sx={{ color: '#E50914', fontSize: '1.1rem' }}>Error al cargar la película</Typography>
      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)' }}>{error}</Typography>
    </Box>
  );

  if (!pelicula) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 2 }}>
      <CircularProgress color="warning" size={44} thickness={3} />
      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '2px' }}>CARGANDO</Typography>
    </Box>
  );

  const favored      = isFav(pelicula.id);
  const wlStatus     = getStatus(pelicula.id);
  const isPendiente  = wlStatus === 'pendiente';
  const isVista      = wlStatus === 'vista';

  return (
    <>
      {/* ── Hero backdrop ── */}
      <Box sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '60vh', sm: '66vh', md: '75vh' },
        backgroundImage: `url(https://image.tmdb.org/t/p/original${pelicula.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.35) 65%, rgba(0,0,0,0.1) 100%)' }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0D0D0D 0%, rgba(13,13,13,0.1) 55%, transparent 100%)' }} />

        {/* Hero text */}
        <Box sx={{
          position: 'absolute',
          bottom: { xs: 36, md: 60 },
          left: { xs: 16, sm: 32, md: 72 },
          maxWidth: { xs: '92%', md: '52%' },
          zIndex: 1,
          animation: 'fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) both',
        }}>
          {pelicula.genres?.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
              {pelicula.genres.map(g => (
                <Chip key={g.id} label={g.name} size="small" sx={{
                  bgcolor: 'rgba(255,193,7,0.12)', color: '#FFC107',
                  border: '1px solid rgba(255,193,7,0.3)', fontSize: '0.68rem', height: 22, borderRadius: '4px',
                }} />
              ))}
            </Box>
          )}

          <Typography variant="h2" sx={{
            fontWeight: 900, lineHeight: 1.05, letterSpacing: '-1.5px',
            textShadow: '0 2px 24px rgba(0,0,0,0.55)', mb: 1,
            fontSize: { xs: '1.8rem', sm: '2.4rem', md: '3rem' },
          }}>
            {pelicula.title}
          </Typography>

          {pelicula.tagline && (
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', mb: 1.5, fontSize: '0.9rem' }}>
              "{pelicula.tagline}"
            </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
            {pelicula.vote_average > 0 && (
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4, bgcolor: '#FFC107', color: '#000', fontWeight: 800, fontSize: '0.8rem', px: 1.2, py: 0.3, borderRadius: '5px' }}>
                ★ {pelicula.vote_average?.toFixed(1)}
              </Box>
            )}
            {pelicula.runtime > 0 && (
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>{fmtRuntime(pelicula.runtime)}</Typography>
            )}
            {pelicula.release_date && (
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>{pelicula.release_date.slice(0, 4)}</Typography>
            )}
          </Box>

          {pelicula.imdb_id && (
            <Box sx={{ mt: 2.5 }}>
              <Button
                onClick={() => watchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                variant="contained"
                startIcon={<PlayArrowIcon sx={{ fontSize: 22 }} />}
                sx={{
                  bgcolor: '#FFC107', color: '#000', fontWeight: 800,
                  fontSize: '0.95rem', px: 3.5, py: 1.2, borderRadius: '10px',
                  textTransform: 'none', letterSpacing: '-0.2px',
                  boxShadow: '0 4px 20px rgba(255,193,7,0.4)',
                  '&:hover': { bgcolor: '#FFD54F', boxShadow: '0 6px 28px rgba(255,193,7,0.55)', transform: 'scale(1.03)' },
                  transition: 'all 0.2s',
                }}
              >
                Ver ahora
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Content ── */}
      <Container maxWidth="xl" className="page-enter" sx={{ py: { xs: 3, md: 5 } }}>
        <Grid container spacing={{ xs: 3, md: 4 }}>

          {/* ── Poster ── */}
          <Grid item xs={12} sm={4} md={3} lg={2.5}>
            <Box sx={{ mt: { sm: 0, md: '-70px' }, position: 'relative', zIndex: 2 }}>
              <Box
                component="img"
                src={`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`}
                alt={pelicula.title}
                sx={{
                  width: '100%', maxWidth: { xs: 200, sm: '100%' },
                  display: 'block', mx: { xs: 'auto', sm: 0 },
                  borderRadius: '12px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              />
            </Box>
          </Grid>

          {/* ── Details ── */}
          <Grid item xs={12} sm={8} md={5.5} lg={6}>

            {/* Overview */}
            <Typography sx={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, fontSize: '0.97rem', mb: 3 }}>
              {pelicula.overview}
            </Typography>

            {/* ── Cast ── */}
            {cast.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', fontWeight: 700, mb: 1.5, display: 'block' }}>
                  REPARTO
                </Typography>
                <Box sx={{
                  display: 'flex', gap: 2, overflowX: 'auto', pb: 1,
                  '&::-webkit-scrollbar': { height: 4 },
                  '&::-webkit-scrollbar-thumb': { background: 'rgba(255,193,7,0.25)', borderRadius: 2 },
                }}>
                  {cast.map(actor => (
                    <Box key={actor.id} onClick={() => navigate(`/persona/${actor.id}`)}
                      sx={{ minWidth: 72, textAlign: 'center', flexShrink: 0, cursor: 'pointer',
                        '&:hover .actor-avatar': { borderColor: '#FFC107', transform: 'scale(1.07)' },
                        '&:hover .actor-name': { color: '#FFC107' } }}>
                      <Avatar
                        className="actor-avatar"
                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : undefined}
                        sx={{ width: 62, height: 62, mx: 'auto', mb: 0.75, border: '2px solid rgba(255,255,255,0.1)', bgcolor: '#2a2a2a', fontSize: '1.2rem', transition: 'border-color 0.2s, transform 0.2s' }}
                      >
                        {actor.name[0]}
                      </Avatar>
                      <Typography className="actor-name" sx={{ fontSize: '0.68rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', lineHeight: 1.2, mb: 0.25, transition: 'color 0.2s' }}>
                        {actor.name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.2 }}>
                        {actor.character}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Info grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
              <InfoRow label="Estreno">{pelicula.release_date}</InfoRow>
              {pelicula.runtime > 0 && <InfoRow label="Duración">{fmtRuntime(pelicula.runtime)}</InfoRow>}
              {pelicula.budget > 0   && <InfoRow label="Presupuesto">{fmt(pelicula.budget)}</InfoRow>}
              {pelicula.revenue > 0  && <InfoRow label="Recaudación">{fmt(pelicula.revenue)}</InfoRow>}
              {pelicula.imdb_id && (
                <InfoRow label="IMDB">
                  <Link href={`https://www.imdb.com/title/${pelicula.imdb_id}`} target="_blank" rel="noopener noreferrer"
                    sx={{ color: '#FFC107', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: 0.4 }}>
                    {pelicula.imdb_id} <LinkIcon sx={{ fontSize: 13 }} />
                  </Link>
                </InfoRow>
              )}
              {pelicula.homepage && (
                <InfoRow label="Página oficial">
                  <Link href={pelicula.homepage} target="_blank" rel="noopener noreferrer"
                    sx={{ color: '#FFC107', fontSize: '0.87rem', display: 'inline-flex', alignItems: 'center', gap: 0.4 }}>
                    Visitar <LinkIcon sx={{ fontSize: 13 }} />
                  </Link>
                </InfoRow>
              )}
            </Box>

            {/* Genres */}
            {pelicula.genres?.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', fontWeight: 700, mb: 1, display: 'block' }}>GÉNEROS</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {pelicula.genres.map(g => (
                    <Chip key={g.id} label={g.name} variant="outlined" size="small" sx={{
                      borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.78rem',
                      '&:hover': { borderColor: '#FFC107', color: '#FFC107' },
                      transition: 'all 0.2s',
                    }} />
                  ))}
                </Box>
              </Box>
            )}

            {/* Production companies */}
            {pelicula.production_companies?.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', fontWeight: 700, mb: 1, display: 'block' }}>PRODUCCIÓN</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {pelicula.production_companies.map(c => (
                    <Chip key={c.id} label={c.name} size="small" sx={{
                      bgcolor: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.22)',
                      color: 'rgba(255,193,7,0.75)', fontSize: '0.75rem',
                    }} />
                  ))}
                </Box>
              </Box>
            )}

            {/* Rating + actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3, mt: 2 }}>
              <RatingCircle rating={pelicula.vote_average} color="#4CAF50" title="Puntuación" />
              <RatingCircle rating={Math.min(pelicula.vote_count / 1000, 10)} color="#FFC107" title="Popularidad" />

              <Button
                variant="outlined"
                startIcon={<MovieIcon />}
                onClick={() => setOpenModal(true)}
                sx={{
                  borderColor: 'rgba(255,193,7,0.45)', color: '#FFC107', fontWeight: 600,
                  px: 3, py: 1.1,
                  '&:hover': { bgcolor: 'rgba(255,193,7,0.1)', borderColor: '#FFC107', transform: 'scale(1.02)' },
                  transition: 'all 0.2s',
                }}
              >
                Ver Tráiler
              </Button>

              <Tooltip title={favored ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
                <IconButton onClick={() => toggle(pelicula)} sx={{ color: favored ? '#E50914' : 'rgba(255,255,255,0.35)', border: `1px solid ${favored ? 'rgba(229,9,20,0.4)' : 'rgba(255,255,255,0.12)'}`, borderRadius: '8px', p: 1.2, '&:hover': { color: '#E50914', borderColor: 'rgba(229,9,20,0.5)', bgcolor: 'rgba(229,9,20,0.08)', transform: 'scale(1.07)' }, transition: 'all 0.2s' }}>
                  {favored ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Tooltip>

              <Tooltip title={isPendiente ? 'Quitar de pendientes' : 'Agregar a pendientes'}>
                <IconButton onClick={() => setStatus(pelicula, 'pendiente')} sx={{ color: isPendiente ? '#FFC107' : 'rgba(255,255,255,0.35)', border: `1px solid ${isPendiente ? 'rgba(255,193,7,0.4)' : 'rgba(255,255,255,0.12)'}`, borderRadius: '8px', p: 1.2, '&:hover': { color: '#FFC107', borderColor: 'rgba(255,193,7,0.5)', bgcolor: 'rgba(255,193,7,0.08)', transform: 'scale(1.07)' }, transition: 'all 0.2s' }}>
                  {isPendiente ? <BookmarkAddedIcon /> : <BookmarkAddOutlinedIcon />}
                </IconButton>
              </Tooltip>

              <Tooltip title={isVista ? 'Marcar como no vista' : 'Marcar como vista'}>
                <IconButton onClick={() => setStatus(pelicula, 'vista')} sx={{ color: isVista ? '#4CAF50' : 'rgba(255,255,255,0.35)', border: `1px solid ${isVista ? 'rgba(76,175,80,0.4)' : 'rgba(255,255,255,0.12)'}`, borderRadius: '8px', p: 1.2, '&:hover': { color: '#4CAF50', borderColor: 'rgba(76,175,80,0.5)', bgcolor: 'rgba(76,175,80,0.08)', transform: 'scale(1.07)' }, transition: 'all 0.2s' }}>
                  {isVista ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Comparar con otra película">
                <IconButton onClick={() => navigate('/comparar')} sx={{ color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', p: 1.2, '&:hover': { color: '#7C4DFF', borderColor: 'rgba(124,77,255,0.5)', bgcolor: 'rgba(124,77,255,0.08)', transform: 'scale(1.07)' }, transition: 'all 0.2s' }}>
                  <CompareArrowsIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Compartir">
                <IconButton onClick={() => setOpenShare(true)} sx={{ color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', p: 1.2, '&:hover': { color: '#2196F3', borderColor: 'rgba(33,150,243,0.5)', bgcolor: 'rgba(33,150,243,0.08)', transform: 'scale(1.07)' }, transition: 'all 0.2s' }}>
                  <IosShareIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Dónde ver */}
            <WhereToWatch movieId={pelicula.id} movieTitle={pelicula.title} />
          </Grid>

          {/* ── Dashboard ── */}
          <Grid item xs={12} md={3.5} lg={3.5}>
            <Box sx={{ mt: { md: 0 }, pt: { xs: 0, md: 1 } }}>
              <MovieDashboard movie={pelicula} movieId={pelicula.id} />
            </Box>
          </Grid>
        </Grid>

        {/* ── Wikipedia ── */}
        <WikiTrivia movieTitle={pelicula.title} />

        {/* ── Similar movies ── */}
        {similares.length > 0 && (
          <Box sx={{ mt: 7 }}>
            <MovieRow
              titulo="Películas similares"
              icono={<MovieIcon sx={{ fontSize: 18 }} />}
              Peliculas={similares}
            />
          </Box>
        )}

        {/* ── Ver película gratis ── */}
        <Box ref={watchRef}>
          <WatchMovie
            movieTitle={pelicula.title}
            year={pelicula.release_date?.slice(0, 4)}
            imdbId={pelicula.imdb_id}
          />
        </Box>
      </Container>

      <TrailerModal
        movieId={pelicula?.id}
        movieTitle={pelicula?.title}
        open={openModal}
        onClose={() => setOpenModal(false)}
      />

      <ShareCard
        open={openShare}
        onClose={() => setOpenShare(false)}
        movie={pelicula}
      />
    </>
  );
}
