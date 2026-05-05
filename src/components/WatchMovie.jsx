import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Tooltip } from '@mui/material';
import OndemandVideoIcon  from '@mui/icons-material/OndemandVideo';
import PlayCircleIcon     from '@mui/icons-material/PlayCircle';
import SearchOffIcon      from '@mui/icons-material/SearchOff';
import OpenInNewIcon      from '@mui/icons-material/OpenInNew';
import InfoOutlinedIcon   from '@mui/icons-material/InfoOutlined';

const FREE_PLATFORMS = (title, year) => {
  const q = encodeURIComponent(`${title} ${year ?? ''} pelicula completa gratis`);
  return [
    { label: 'YouTube',  color: '#E53935', bg: 'rgba(229,57,53,0.08)',   url: `https://www.youtube.com/results?search_query=${q}`,              note: 'buscar' },
    { label: 'VIX',      color: '#7B2FE0', bg: 'rgba(123,47,224,0.08)',  url: `https://www.vix.com/es-419/search?q=${encodeURIComponent(title)}`, note: 'latino' },
    { label: 'Pluto TV', color: '#00B4D8', bg: 'rgba(0,180,216,0.08)',   url: `https://pluto.tv/search#${encodeURIComponent(title)}`,            note: 'gratis' },
    { label: 'Crackle',  color: '#FF6600', bg: 'rgba(255,102,0,0.08)',   url: `https://www.crackle.com/search?q=${encodeURIComponent(title)}`,   note: 'gratis' },
    { label: 'Plex',     color: '#E5A00D', bg: 'rgba(229,160,13,0.08)',  url: `https://watch.plex.tv/search?q=${encodeURIComponent(title)}`,     note: 'gratis' },
  ];
};

export default function WatchMovie({ movieTitle, year }) {
  const [archiveId,  setArchiveId]  = useState(null);
  const [archiveFound, setArchiveFound] = useState(null);
  const [playerOpen, setPlayerOpen] = useState(false);

  useEffect(() => {
    if (!movieTitle) return;
    setArchiveId(null);
    setArchiveFound(null);
    setPlayerOpen(false);

    const q = encodeURIComponent(`${movieTitle} AND mediatype:movies`);
    fetch(`https://archive.org/advancedsearch.php?q=${q}&fl[]=identifier&fl[]=title&fl[]=year&rows=15&output=json`)
      .then(r => r.json())
      .then(data => {
        const docs = data.response?.docs ?? [];
        let best = null;
        if (year && docs.length > 0) {
          best = docs.find(d => String(d.year) === String(year)) ?? docs[0];
        } else {
          best = docs[0] ?? null;
        }
        if (best?.identifier) { setArchiveId(best.identifier); setArchiveFound(true); }
        else setArchiveFound(false);
      })
      .catch(() => setArchiveFound(false));
  }, [movieTitle, year]);

  const platforms = FREE_PLATFORMS(movieTitle, year);

  return (
    <Box sx={{ mt: 6 }}>

      {/* ── Título sección ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <OndemandVideoIcon sx={{ color: '#FFC107', fontSize: 18 }} />
          <Typography className="section-title"
            sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>
            Ver película gratis
          </Typography>
          {archiveFound === null && <CircularProgress size={11} sx={{ color: 'rgba(255,255,255,0.25)', ml: 0.5 }} />}
        </Box>
        <Tooltip title="Contenido de plataformas externas. La disponibilidad varía por región y título.">
          <InfoOutlinedIcon sx={{ fontSize: 15, color: 'rgba(255,255,255,0.2)', cursor: 'help' }} />
        </Tooltip>
      </Box>

      {/* ── Internet Archive ── */}
      {archiveFound === true && archiveId && (
        <Box sx={{ mb: 3 }}>
          {!playerOpen ? (
            <Box
              onClick={() => setPlayerOpen(true)}
              sx={{
                display: 'flex', alignItems: 'center', gap: 2,
                p: 2, borderRadius: '12px', cursor: 'pointer',
                border: '1px solid rgba(76,175,80,0.35)',
                bgcolor: 'rgba(76,175,80,0.07)',
                transition: 'all 0.22s',
                '&:hover': { bgcolor: 'rgba(76,175,80,0.13)', borderColor: 'rgba(76,175,80,0.65)', transform: 'translateY(-2px)' },
              }}
            >
              <PlayCircleIcon sx={{ color: '#4CAF50', fontSize: 30, flexShrink: 0 }} />
              <Box>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#4CAF50', lineHeight: 1.2 }}>
                  Encontrada en Internet Archive
                </Typography>
                <Typography sx={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.38)', mt: 0.2 }}>
                  Clic para abrir el reproductor
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box sx={{
                position: 'relative', paddingTop: '56.25%',
                borderRadius: '12px', overflow: 'hidden',
                bgcolor: '#000', boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
              }}>
                <Box
                  component="iframe"
                  key={archiveId}
                  src={`https://archive.org/embed/${archiveId}?autoplay=0`}
                  title={movieTitle}
                  allowFullScreen
                  allow="fullscreen"
                  sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, px: 0.5 }}>
                <Typography sx={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.2)' }}>
                  Internet Archive · dominio público / libre distribución
                </Typography>
                <Button
                  href={`https://archive.org/details/${archiveId}`}
                  target="_blank" rel="noopener noreferrer"
                  size="small" endIcon={<OpenInNewIcon sx={{ fontSize: 11 }} />}
                  sx={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.62rem', minWidth: 0, '&:hover': { color: '#4CAF50' } }}
                >
                  Ver en Archive.org
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}

      {archiveFound === false && (
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          mb: 2.5, px: 1.5, py: 1.2, borderRadius: '8px',
          bgcolor: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <SearchOffIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
          <Typography sx={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.28)' }}>
            No disponible en Internet Archive — busca en las plataformas gratuitas de abajo
          </Typography>
        </Box>
      )}

      {/* ── Plataformas gratuitas ── */}
      <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '1.8px', mb: 1.2 }}>
        BUSCAR EN PLATAFORMAS GRATUITAS
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {platforms.map(p => (
          <Button
            key={p.label}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNewIcon sx={{ fontSize: 11 }} />}
            sx={{
              px: 1.8, py: 0.75, borderRadius: '8px', textTransform: 'none',
              border: `1px solid ${p.color}33`, bgcolor: p.bg, color: p.color,
              fontSize: '0.75rem', fontWeight: 600,
              transition: 'all 0.2s',
              '&:hover': { bgcolor: `${p.color}20`, borderColor: `${p.color}77`, transform: 'translateY(-1px)' },
            }}
          >
            {p.label}
            <Box component="span" sx={{ ml: 0.7, fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>
              {p.note}
            </Box>
          </Button>
        ))}
      </Box>

      <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.18)', mt: 1.2 }}>
        La disponibilidad depende de tu país y del título. Algunas plataformas requieren registro gratuito.
      </Typography>
    </Box>
  );
}
