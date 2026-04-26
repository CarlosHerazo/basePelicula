import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Tooltip } from '@mui/material';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import SearchOffIcon     from '@mui/icons-material/SearchOff';
import OpenInNewIcon     from '@mui/icons-material/OpenInNew';
import InfoOutlinedIcon  from '@mui/icons-material/InfoOutlined';

const SOURCES = [
  { key: 'archive', label: 'Internet Archive', color: '#4CAF50' },
  { key: 'youtube', label: 'YouTube',          color: '#E53935' },
];

export default function WatchMovie({ movieTitle, year }) {
  const [source,       setSource]       = useState('archive');
  const [archiveId,    setArchiveId]    = useState(null);
  const [archiveFound, setArchiveFound] = useState(null); // null=loading, true, false
  const [expanded,     setExpanded]     = useState(false);

  useEffect(() => {
    if (!movieTitle) return;
    setArchiveId(null);
    setArchiveFound(null);

    // Search Archive.org — runtime:[3600 TO *] ensures full-length films only (≥60 min)
    const base  = `"${movieTitle}" AND mediatype:movies AND runtime:[3600 TO *]`;
    const q     = encodeURIComponent(base);
    fetch(`https://archive.org/advancedsearch.php?q=${q}&fl[]=identifier&fl[]=title&fl[]=year&fl[]=runtime&rows=12&output=json`)
      .then(r => r.json())
      .then(data => {
        const docs = (data.response?.docs ?? []).filter(d => Number(d.runtime) >= 3600);
        let best = docs[0] ?? null;
        // Prefer exact year match
        if (year && docs.length > 1) {
          const match = docs.find(d => String(d.year) === String(year));
          if (match) best = match;
        }
        if (best?.identifier) { setArchiveId(best.identifier); setArchiveFound(true); }
        else setArchiveFound(false);
      })
      .catch(() => setArchiveFound(false));
  }, [movieTitle, year]);

  const ytQuery  = encodeURIComponent(`${movieTitle} ${year ?? ''} pelicula completa gratis`);
  const ytSearch = `https://www.youtube.com/results?search_query=${ytQuery}`;
  const ytEmbed  = `https://www.youtube.com/embed?listType=search&list=${ytQuery}&hl=es&rel=0`;

  return (
    <Box sx={{ mt: 6 }}>
      {/* ── Header ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <OndemandVideoIcon sx={{ color: '#FFC107', fontSize: 18 }} />
          <Typography className="section-title"
            sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>
            Ver película gratis
          </Typography>
        </Box>
        <Tooltip title="El contenido proviene de plataformas externas. Solo mostramos lo que está disponible públicamente en esos servicios.">
          <InfoOutlinedIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.22)', cursor: 'help' }} />
        </Tooltip>
      </Box>

      {/* ── Source selector ── */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2.5, flexWrap: 'wrap' }}>
        {SOURCES.map(s => {
          const active = source === s.key;
          return (
            <Box
              key={s.key}
              onClick={() => { setSource(s.key); setExpanded(true); }}
              sx={{
                display: 'flex', alignItems: 'center', gap: 0.8,
                px: 2, py: 0.9, borderRadius: '8px', cursor: 'pointer',
                border: `1px solid ${active ? s.color : 'rgba(255,255,255,0.1)'}`,
                bgcolor: active ? `${s.color}18` : 'rgba(255,255,255,0.04)',
                transition: 'all 0.2s',
                '&:hover': { borderColor: s.color, bgcolor: `${s.color}12` },
              }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: active ? s.color : 'rgba(255,255,255,0.25)', transition: 'background 0.2s' }} />
              <Typography sx={{ fontSize: '0.78rem', fontWeight: active ? 700 : 400, color: active ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }}>
                {s.label}
              </Typography>
              {s.key === 'archive' && archiveFound === true  && <Box sx={{ fontSize: '0.6rem', color: '#4CAF50', fontWeight: 700 }}>✓ disponible</Box>}
              {s.key === 'archive' && archiveFound === false  && <Box sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>no encontrada</Box>}
              {s.key === 'archive' && archiveFound === null   && <CircularProgress size={10} sx={{ color: 'rgba(255,255,255,0.3)' }} />}
            </Box>
          );
        })}

        {!expanded && (
          <Box
            onClick={() => setExpanded(true)}
            sx={{ px: 2, py: 0.9, borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.08)', bgcolor: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', transition: 'all 0.2s', '&:hover': { borderColor: '#FFC107', bgcolor: 'rgba(255,193,7,0.06)' } }}
          >
            <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>Mostrar player</Typography>
          </Box>
        )}
      </Box>

      {/* ── Player ── */}
      {expanded && (
        <Box sx={{ animation: 'fadeUp 0.4s var(--ease-spring) both' }}>

          {/* ─ Internet Archive ─ */}
          {source === 'archive' && (
            <>
              {archiveFound === null && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <CircularProgress color="warning" size={32} thickness={3} />
                </Box>
              )}

              {archiveFound === true && archiveId && (
                <>
                  <Box sx={{ position: 'relative', paddingTop: '56.25%', borderRadius: '12px', overflow: 'hidden', bgcolor: '#000', boxShadow: '0 16px 48px rgba(0,0,0,0.6)' }}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, px: 0.5 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.22)' }}>
                      Fuente: Internet Archive (archive.org) — contenido de dominio público o libre distribución
                    </Typography>
                    <Button
                      href={`https://archive.org/details/${archiveId}`}
                      target="_blank" rel="noopener noreferrer"
                      size="small" endIcon={<OpenInNewIcon sx={{ fontSize: 12 }} />}
                      sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', minWidth: 0, '&:hover': { color: '#4CAF50' } }}
                    >
                      Ver en Archive.org
                    </Button>
                  </Box>
                </>
              )}

              {archiveFound === false && (
                <Box sx={{ textAlign: 'center', py: 5, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <SearchOffIcon sx={{ fontSize: 38, color: 'rgba(255,255,255,0.15)', mb: 1 }} />
                  <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', mb: 2 }}>
                    No encontrada en Internet Archive
                  </Typography>
                  <Button
                    href={`https://archive.org/search?query=${encodeURIComponent(movieTitle)}&and[]=mediatype%3A%22movies%22`}
                    target="_blank" rel="noopener noreferrer"
                    variant="outlined" size="small" endIcon={<OpenInNewIcon sx={{ fontSize: 13 }} />}
                    sx={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', '&:hover': { borderColor: '#4CAF50', color: '#4CAF50' } }}
                  >
                    Buscar manualmente
                  </Button>
                </Box>
              )}
            </>
          )}

          {/* ─ YouTube ─ */}
          {source === 'youtube' && (
            <>
              <Box sx={{ position: 'relative', paddingTop: '56.25%', borderRadius: '12px', overflow: 'hidden', bgcolor: '#000', boxShadow: '0 16px 48px rgba(0,0,0,0.6)' }}>
                <Box
                  component="iframe"
                  key={ytEmbed}
                  src={ytEmbed}
                  title={`${movieTitle} — YouTube`}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, px: 0.5 }}>
                <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.22)' }}>
                  Resultados de búsqueda en YouTube — la disponibilidad varía según el país
                </Typography>
                <Button
                  href={ytSearch} target="_blank" rel="noopener noreferrer"
                  size="small" endIcon={<OpenInNewIcon sx={{ fontSize: 12 }} />}
                  sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', minWidth: 0, '&:hover': { color: '#E53935' } }}
                >
                  Abrir en YouTube
                </Button>
              </Box>
            </>
          )}

        </Box>
      )}
    </Box>
  );
}
