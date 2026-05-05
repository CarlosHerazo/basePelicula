import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, Backdrop, Fade } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MovieIcon from '@mui/icons-material/Movie';
import TrailerYoutube from './TrailerYoutube';

const API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68";

const MovieBanner = ({ Peliculas }) => {
  const [currentIndex, setCurrentIndex]   = useState(0);
  const [trailerKey, setTrailerKey]       = useState('');
  const [openModal, setOpenModal]         = useState(false);
  const [openPlayModal, setOpenPlayModal] = useState(false);
  const [imdbId,       setImdbId]         = useState(null);
  const [playSnapshot, setPlaySnapshot]   = useState({ imdbId: null, title: '' });

  useEffect(() => {
    if (!Peliculas?.length) return;
    const interval = setInterval(() => {
      if (!openModal && !openPlayModal) setCurrentIndex(i => (i + 1) % Peliculas.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [Peliculas, openModal, openPlayModal]);

  useEffect(() => {
    const id = Peliculas?.[currentIndex]?.id;
    if (!id) return;
    setImdbId(null);
    fetch(`https://api.themoviedb.org/3/movie/${id}/external_ids`, {
      headers: { 'Content-Type': 'application/json', Authorization: API_TOKEN },
    })
      .then(r => r.json())
      .then(d => { if (d.imdb_id) setImdbId(d.imdb_id); })
      .catch(() => {});
  }, [currentIndex, Peliculas]);

  const handleCloseModal = () => { setOpenModal(false); setTrailerKey(''); };

  const abrirTrailer = async (idMovie) => {
    try {
      const res  = await fetch(`https://api.themoviedb.org/3/movie/${idMovie}/videos?language=en-US`, {
        headers: { 'Content-Type': 'application/json', Authorization: API_TOKEN },
      });
      const data = await res.json();
      const trailer = data.results?.find(v => v.name.includes('Official Trailer')) ?? data.results?.[0];
      if (trailer?.key) { setTrailerKey(trailer.key); setOpenModal(true); }
    } catch (err) {
      console.error('Error al obtener el trailer:', err);
    }
  };

  if (!Peliculas?.length) return null;

  const pelicula = Peliculas[currentIndex];

  return (
    <Box
      className="ImgBanner"
      key={pelicula.id}
      sx={{
        width: '100%',
        height: { xs: '72vh', md: '85vh' },
        position: 'relative',
        backgroundImage: `url(https://image.tmdb.org/t/p/original${pelicula.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        overflow: 'hidden',
      }}
    >
      {/* Left-to-right dark gradient */}
      <Box sx={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(0,0,0,0.88) 25%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.1) 100%)',
      }} />
      {/* Bottom-to-top gradient (for the mask fade-out at bottom) */}
      <Box sx={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, #0D0D0D 0%, rgba(13,13,13,0.15) 45%, transparent 100%)',
      }} />

      {/* Content */}
      <Box
        className="banner-content"
        key={`content-${currentIndex}`}
        sx={{
          position: 'absolute',
          bottom: { xs: 80, md: 100 },
          left: { xs: 20, sm: 40, md: 72 },
          maxWidth: { xs: '92%', md: '44%' },
          zIndex: 1,
        }}
      >
        {/* Score badge */}
        {pelicula.vote_average > 0 && (
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 0.5,
            bgcolor: 'rgba(255,193,7,0.15)',
            border: '1px solid rgba(255,193,7,0.4)',
            color: '#FFC107',
            fontWeight: 700,
            fontSize: '0.78rem',
            px: 1.2, py: 0.4,
            borderRadius: '6px',
            mb: 2,
            backdropFilter: 'blur(8px)',
          }}>
            ★ {pelicula.vote_average?.toFixed(1)}
          </Box>
        )}

        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            lineHeight: 1.08,
            letterSpacing: '-1.5px',
            textShadow: '0 2px 24px rgba(0,0,0,0.6)',
            mb: 2,
            fontSize: { xs: '2rem', sm: '2.6rem', md: '3.2rem' },
          }}
        >
          {pelicula.title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255,255,255,0.78)',
            lineHeight: 1.65,
            mb: 3,
            display: { xs: 'none', md: 'block' },
            fontSize: '0.97rem',
          }}
        >
          {pelicula.overview?.slice(0, 160)}{pelicula.overview?.length > 160 ? '…' : ''}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            disabled={!imdbId}
            onClick={() => { setPlaySnapshot({ imdbId, title: pelicula.title }); setOpenPlayModal(true); }}
            sx={{
              bgcolor: '#FFC107',
              color: '#000',
              fontWeight: 700,
              px: { xs: 2.5, md: 3 },
              py: 1.2,
              fontSize: '0.9rem',
              boxShadow: '0 4px 22px rgba(255,193,7,0.35)',
              '&:hover': {
                bgcolor: '#FFD54F',
                transform: 'scale(1.03)',
                boxShadow: '0 6px 28px rgba(255,193,7,0.45)',
              },
              '&.Mui-disabled': { bgcolor: 'rgba(255,193,7,0.35)', color: 'rgba(0,0,0,0.5)' },
              transition: 'all 0.22s ease',
            }}
          >
            Ver Ahora
          </Button>
          <Button
            variant="outlined"
            startIcon={<MovieIcon />}
            onClick={() => abrirTrailer(pelicula.id)}
            sx={{
              borderColor: 'rgba(255,255,255,0.4)',
              color: 'rgba(255,255,255,0.9)',
              px: { xs: 2.5, md: 3 },
              py: 1.2,
              fontSize: '0.9rem',
              backdropFilter: 'blur(8px)',
              '&:hover': {
                borderColor: '#FFC107',
                color: '#FFC107',
                bgcolor: 'rgba(255,193,7,0.08)',
                transform: 'scale(1.02)',
              },
              transition: 'all 0.22s ease',
            }}
          >
            Ver Tráiler
          </Button>
        </Box>
      </Box>

      {/* Carousel dots */}
      {Peliculas.length > 1 && (
        <Box sx={{
          position: 'absolute',
          bottom: 28,
          left: { xs: 20, md: 72 },
          display: 'flex',
          gap: 1,
          zIndex: 1,
        }}>
          {Peliculas.slice(0, 8).map((_, i) => (
            <Box
              key={i}
              onClick={() => setCurrentIndex(i)}
              sx={{
                width: i === currentIndex ? 24 : 6,
                height: 4,
                borderRadius: '2px',
                bgcolor: i === currentIndex ? '#FFC107' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Box>
      )}

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openModal}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#0F0F0F',
            boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
            borderRadius: 2,
            p: 3,
            outline: 'none',
          }}>
            <TrailerYoutube trailerKey={trailerKey} />
          </Box>
        </Fade>
      </Modal>

      {/* ── Modal PlayIMDB ── */}
      <Modal
        open={openPlayModal}
        onClose={() => setOpenPlayModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 400, sx: { bgcolor: 'rgba(0,0,0,0.88)' } }}
      >
        <Fade in={openPlayModal}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '96vw', sm: '88vw', md: '80vw' },
            maxWidth: 1100,
            bgcolor: '#0a0a0a',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 32px 100px rgba(0,0,0,0.9)',
            outline: 'none',
          }}>
            {/* Header */}
            <Box sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              px: 2.5, py: 1.5,
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontWeight: 600 }}>
                {playSnapshot.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Button
                  href={`https://www.playimdb.com/es-es/title/${playSnapshot.imdbId}/`}
                  target="_blank" rel="noopener noreferrer"
                  size="small"
                  sx={{ color: 'rgba(255,193,7,0.6)', fontSize: '0.7rem', minWidth: 0, '&:hover': { color: '#FFC107' } }}
                >
                  Abrir en PlayIMDB ↗
                </Button>
                <Box
                  onClick={() => setOpenPlayModal(false)}
                  sx={{
                    width: 28, height: 28, borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.07)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: '1rem', color: 'rgba(255,255,255,0.5)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.14)', color: '#fff' },
                    transition: 'all 0.2s',
                  }}
                >
                  ✕
                </Box>
              </Box>
            </Box>

            {/* iFrame */}
            <Box sx={{ position: 'relative', paddingTop: '56.25%', bgcolor: '#000' }}>
              <Box
                component="iframe"
                src={`https://www.playimdb.com/es-es/title/${playSnapshot.imdbId}/`}
                title={playSnapshot.title}
                allowFullScreen
                allow="fullscreen; autoplay"
                sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              />
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default MovieBanner;
