import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Modal, Backdrop, CircularProgress } from '@mui/material';
import CloseIcon       from '@mui/icons-material/Close';
import MovieIcon       from '@mui/icons-material/Movie';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import TheatersIcon    from '@mui/icons-material/Theaters';

const API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68";
const HEADERS = { 'Content-Type': 'application/json', Authorization: API_TOKEN };

const TYPE_LABELS = {
  Trailer:             'Tráiler',
  Teaser:              'Teaser',
  Clip:                'Clip',
  Featurette:          'Featurette',
  'Behind the Scenes': 'Detrás de cámaras',
  Bloopers:            'Bloopers',
};

function sortClips(all) {
  const isOfficial = v => /oficial|official/i.test(v.name);
  return [
    ...all.filter(v => isOfficial(v) && v.type === 'Trailer'),
    ...all.filter(v => !isOfficial(v) && v.type === 'Trailer'),
    ...all.filter(v => v.type === 'Teaser'),
    ...all.filter(v => !['Trailer', 'Teaser'].includes(v.type)),
  ].filter((v, i, arr) => arr.findIndex(x => x.key === v.key) === i);
}

export default function TrailerModal({ movieId, open, onClose, movieTitle }) {
  const [clips,     setClips]     = useState([]);
  const [activeKey, setActiveKey] = useState(null);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    if (!open || !movieId) return;
    setClips([]); setActiveKey(null); setLoading(true);

    // Buscar en español primero, luego inglés
    Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?language=es-ES`, { headers: HEADERS }).then(r => r.json()),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`, { headers: HEADERS }).then(r => r.json()),
    ]).then(([esData, enData]) => {
      const esClips = (esData.results ?? []).filter(v => v.site === 'YouTube');
      const enClips = (enData.results ?? []).filter(v => v.site === 'YouTube' && !esClips.some(e => e.key === v.key));
      const sorted  = sortClips([...esClips, ...enClips]).slice(0, 10);
      setClips(sorted);
      setActiveKey(sorted[0]?.key ?? null);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, [movieId, open]);

  const activeClip = clips.find(c => c.key === activeKey);

  return (
    <Modal
      open={open}
      onClose={onClose}
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 350, sx: { bgcolor: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(10px)' } } }}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 1, sm: 2 } }}
    >
      {/* Sin Fade — el Modal centra con flex y la animación usa solo translateY */}
      <Box
        sx={{
          width: { xs: '98vw', sm: '92vw', md: '82vw', lg: '900px' },
          maxWidth: 960,
          outline: 'none',
          animation: 'fadeUp 0.38s var(--ease-spring) both',
        }}
      >

          {/* ── Header ── */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, px: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <MovieIcon sx={{ color: '#FFC107', fontSize: 18, flexShrink: 0 }} />
              <Typography sx={{
                color: '#fff', fontWeight: 700,
                fontSize: { xs: '0.85rem', md: '0.98rem' },
                letterSpacing: '-0.2px',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {movieTitle}
              </Typography>
              {activeClip && (
                <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', flexShrink: 0 }}>
                  — {TYPE_LABELS[activeClip.type] ?? activeClip.type}
                </Typography>
              )}
            </Box>
            <IconButton onClick={onClose} sx={{
              color: 'rgba(255,255,255,0.45)', flexShrink: 0, ml: 1,
              '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.08)' },
              transition: 'all 0.2s',
            }}>
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          {/* ── Player ── */}
          <Box sx={{
            position: 'relative', paddingTop: '56.25%',
            borderRadius: '12px', overflow: 'hidden',
            bgcolor: '#000',
            boxShadow: '0 32px 80px rgba(0,0,0,0.85)',
          }}>
            {loading && (
              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress color="warning" size={40} thickness={3} />
              </Box>
            )}
            {!loading && !activeKey && (
              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <TheatersIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.2)' }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
                  No hay tráiler disponible
                </Typography>
              </Box>
            )}
            {activeKey && (
              <Box
                component="iframe"
                key={activeKey}
                src={`https://www.youtube.com/embed/${activeKey}?autoplay=1&rel=0&modestbranding=1&color=white`}
                title={activeClip?.name ?? 'Tráiler'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              />
            )}
          </Box>

          {/* ── Clip selector ── */}
          {clips.length > 1 && (
            <Box sx={{
              display: 'flex', gap: 1, mt: 1.5, overflowX: 'auto', pb: 0.5,
              '&::-webkit-scrollbar': { height: 3 },
              '&::-webkit-scrollbar-thumb': { background: 'rgba(255,193,7,0.25)', borderRadius: 2 },
            }}>
              {clips.map(clip => {
                const active = clip.key === activeKey;
                return (
                  <Box
                    key={clip.key}
                    onClick={() => setActiveKey(clip.key)}
                    sx={{
                      flexShrink: 0, cursor: 'pointer',
                      px: 1.5, py: 0.8, borderRadius: '8px',
                      border: `1px solid ${active ? '#FFC107' : 'rgba(255,255,255,0.1)'}`,
                      bgcolor: active ? 'rgba(255,193,7,0.1)' : 'rgba(255,255,255,0.04)',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: 'rgba(255,193,7,0.45)', bgcolor: 'rgba(255,193,7,0.07)' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.2 }}>
                      <OndemandVideoIcon sx={{ fontSize: 11, color: active ? '#FFC107' : 'rgba(255,255,255,0.35)' }} />
                      <Typography sx={{
                        fontSize: '0.68rem', fontWeight: active ? 700 : 400,
                        color: active ? '#FFC107' : 'rgba(255,255,255,0.55)',
                        whiteSpace: 'nowrap', maxWidth: 160,
                        overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {clip.name}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.25)', pl: 2 }}>
                      {TYPE_LABELS[clip.type] ?? clip.type}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
      </Box>
    </Modal>
  );
}
