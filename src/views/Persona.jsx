import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress, Chip, Avatar } from '@mui/material';
import ArrowBackIcon      from '@mui/icons-material/ArrowBack';
import CakeOutlinedIcon   from '@mui/icons-material/CakeOutlined';
import PlaceOutlinedIcon  from '@mui/icons-material/PlaceOutlined';
import MovieIcon          from '@mui/icons-material/Movie';
import TheaterComedyIcon  from '@mui/icons-material/TheaterComedy';
import OpenInNewIcon      from '@mui/icons-material/OpenInNew';

const API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68";
const HEADERS = { accept: 'application/json', Authorization: API_TOKEN };
const BASE    = 'https://api.themoviedb.org/3';

const ratingColor = r => r >= 7 ? '#4CAF50' : r >= 5 ? '#FFC107' : '#F44336';

function fmtDate(d) {
  if (!d) return null;
  const [y, m, day] = d.split('-');
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${parseInt(day)} ${months[parseInt(m)-1]} ${y}`;
}

function age(bd) {
  if (!bd) return null;
  const diff = Date.now() - new Date(bd).getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

function FilmCard({ movie, navigate }) {
  return (
    <Box
      onClick={() => navigate(`/detalle/${movie.id}`)}
      sx={{
        position: 'relative', borderRadius: '10px', overflow: 'hidden',
        cursor: 'pointer', bgcolor: '#161616', aspectRatio: '2/3',
        transition: 'transform 0.22s, box-shadow 0.22s',
        '&:hover': { transform: 'scale(1.04) translateY(-3px)', boxShadow: '0 16px 40px rgba(0,0,0,0.7)' },
        '&:hover .fc-overlay': { opacity: 1 },
      }}
    >
      {movie.poster_path
        ? <Box component="img" src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`} alt={movie.title}
            loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        : <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#1e1e1e' }}>
            <MovieIcon sx={{ fontSize: 32, color: 'rgba(255,255,255,0.2)' }} />
          </Box>
      }

      {movie.vote_average > 0 && (
        <Box sx={{
          position: 'absolute', top: 7, right: 7, zIndex: 2,
          bgcolor: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)',
          border: `2px solid ${ratingColor(movie.vote_average)}`,
          color: ratingColor(movie.vote_average),
          borderRadius: '50%', width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10px', fontWeight: 700,
        }}>
          {movie.vote_average.toFixed(1)}
        </Box>
      )}

      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 45%, transparent 100%)',
        p: 1, pt: 3 }}>
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {movie.title}
        </Typography>
        {(movie.release_date || movie.character || movie.job) && (
          <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.38)', mt: 0.25 }}>
            {movie.release_date?.slice(0, 4)}{movie.character ? ` · ${movie.character}` : ''}{movie.job ? ` · ${movie.job}` : ''}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default function Persona() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [person,  setPerson]  = useState(null);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [tab,     setTab]     = useState('actor');
  const [wiki,    setWiki]    = useState(null);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setPerson(null); setCredits({ cast: [], crew: [] }); setWiki(null); setError(null);

    Promise.all([
      fetch(`${BASE}/person/${id}?language=es`,              { headers: HEADERS }).then(r => r.json()),
      fetch(`${BASE}/person/${id}/movie_credits?language=es`, { headers: HEADERS }).then(r => r.json()),
    ])
      .then(([p, c]) => {
        if (!p.id) throw new Error('Persona no encontrada');
        setPerson(p);

        const cast = (c.cast ?? [])
          .filter(m => m.poster_path)
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 40);

        const seen = new Set();
        const crew = (c.crew ?? [])
          .filter(m => m.poster_path && (m.job === 'Director' || m.job === 'Writer' || m.job === 'Producer'))
          .filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; })
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 40);

        setCredits({ cast, crew });

        // auto-select tab with more content
        if (!cast.length && crew.length) setTab('crew');

        // Wikipedia bio
        fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(p.name)}`)
          .then(r => r.ok ? r.json() : Promise.reject())
          .then(d => {
            if (d.type === 'disambiguation' || !d.extract || d.extract.length < 60) return;
            setWiki({ extract: d.extract.slice(0, 500) + (d.extract.length > 500 ? '…' : ''), url: d.content_urls?.desktop?.page });
          })
          .catch(() => {});
      })
      .catch(e => setError(e.message));
  }, [id]);

  if (error) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: 2 }}>
      <Typography sx={{ color: '#E50914' }}>Error al cargar la persona</Typography>
      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)' }}>{error}</Typography>
    </Box>
  );

  if (!person) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: 2 }}>
      <CircularProgress color="warning" size={44} thickness={3} />
      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '2px' }}>CARGANDO</Typography>
    </Box>
  );

  const deptLabel = d => ({ Acting: 'Actor / Actriz', Directing: 'Dirección', Writing: 'Guionista', Production: 'Producción' }[d] ?? d);
  const films = tab === 'actor' ? credits.cast : credits.crew;

  return (
    <>
      {/* ── Hero ── */}
      <Box sx={{
        position: 'relative', width: '100%', minHeight: { xs: 260, md: 340 },
        bgcolor: '#0a0a0a', display: 'flex', alignItems: 'flex-end',
        overflow: 'hidden',
      }}>
        {/* Blurred photo as background */}
        {person.profile_path && (
          <Box component="img"
            src={`https://image.tmdb.org/t/p/original${person.profile_path}`}
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', filter: 'blur(28px) brightness(0.2)', transform: 'scale(1.1)' }}
          />
        )}
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0D0D0D 0%, rgba(13,13,13,0.5) 60%, transparent 100%)' }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, pb: 4, pt: 2 }}>
          <Box
            onClick={() => navigate(-1)}
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mb: 3, cursor: 'pointer',
              color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', transition: 'color 0.2s', '&:hover': { color: '#fff' } }}
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} /> Volver
          </Box>

          <Box sx={{ display: 'flex', gap: { xs: 2.5, md: 4 }, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            {/* Profile photo */}
            <Avatar
              src={person.profile_path ? `https://image.tmdb.org/t/p/w342${person.profile_path}` : undefined}
              sx={{
                width: { xs: 100, md: 140 }, height: { xs: 100, md: 140 },
                border: '3px solid rgba(255,193,7,0.5)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
                fontSize: '2rem',
                flexShrink: 0,
              }}
            >
              {person.name[0]}
            </Avatar>

            {/* Info */}
            <Box sx={{ animation: 'fadeUp 0.55s var(--ease-spring) both' }}>
              <Chip label={deptLabel(person.known_for_department)} size="small"
                sx={{ bgcolor: 'rgba(255,193,7,0.12)', color: '#FFC107', border: '1px solid rgba(255,193,7,0.3)', fontSize: '0.65rem', mb: 1 }} />
              <Typography sx={{ fontSize: { xs: '1.6rem', md: '2.2rem' }, fontWeight: 900, letterSpacing: '-1px', lineHeight: 1, mb: 1 }}>
                {person.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {person.birthday && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CakeOutlinedIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }} />
                    <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
                      {fmtDate(person.birthday)}{age(person.birthday) ? ` (${age(person.birthday)} años)` : ''}
                    </Typography>
                  </Box>
                )}
                {person.place_of_birth && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PlaceOutlinedIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }} />
                    <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
                      {person.place_of_birth}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Content ── */}
      <Container maxWidth="xl" className="page-enter" sx={{ py: { xs: 3, md: 5 } }}>

        {/* Bio */}
        {(person.biography || wiki) && (
          <Box sx={{ mb: 4, maxWidth: 760 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.92rem', lineHeight: 1.8 }}>
              {person.biography?.slice(0, 600) || wiki?.extract}
              {person.biography?.length > 600 ? '…' : ''}
            </Typography>
            {wiki?.url && !person.biography && (
              <Box component="a" href={wiki.url} target="_blank" rel="noopener noreferrer"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.3, mt: 0.5, fontSize: '0.65rem', color: 'rgba(255,255,255,0.28)', textDecoration: 'none', '&:hover': { color: '#FFC107' } }}>
                Wikipedia <OpenInNewIcon sx={{ fontSize: 11 }} />
              </Box>
            )}
          </Box>
        )}

        {/* Tabs */}
        {credits.cast.length > 0 && credits.crew.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            {[
              { key: 'actor', label: 'Como Actor/Actriz', icon: <TheaterComedyIcon sx={{ fontSize: 15 }} />, count: credits.cast.length },
              { key: 'crew',  label: 'Como Dirección',    icon: <MovieIcon sx={{ fontSize: 15 }} />,          count: credits.crew.length },
            ].map(t => (
              <Box key={t.key} onClick={() => setTab(t.key)} sx={{
                display: 'flex', alignItems: 'center', gap: 0.6,
                px: 2, py: 0.9, borderRadius: '9px', cursor: 'pointer',
                border: `1px solid ${tab === t.key ? '#FFC107' : 'rgba(255,255,255,0.1)'}`,
                bgcolor: tab === t.key ? 'rgba(255,193,7,0.1)' : 'rgba(255,255,255,0.03)',
                transition: 'all 0.2s',
                '&:hover': { borderColor: 'rgba(255,193,7,0.4)' },
              }}>
                {React.cloneElement(t.icon, { sx: { fontSize: 15, color: tab === t.key ? '#FFC107' : 'rgba(255,255,255,0.4)' } })}
                <Typography sx={{ fontSize: '0.8rem', fontWeight: tab === t.key ? 700 : 400, color: tab === t.key ? '#FFC107' : 'rgba(255,255,255,0.5)' }}>
                  {t.label}
                </Typography>
                <Box sx={{ px: 0.7, py: 0.1, borderRadius: '4px', bgcolor: 'rgba(255,255,255,0.08)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>
                  {t.count}
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* Filmography grid */}
        {films.length > 0
          ? <Box className="movie-card-grid">
              {films.map(m => <FilmCard key={m.id} movie={m} navigate={navigate} />)}
            </Box>
          : <Typography sx={{ color: 'rgba(255,255,255,0.3)', mt: 3 }}>Sin filmografía disponible.</Typography>
        }
      </Container>
    </>
  );
}
