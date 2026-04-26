import React, { useState, useEffect } from 'react';
import { Box, Typography, Tooltip, CircularProgress } from '@mui/material';
import TvIcon                   from '@mui/icons-material/Tv';
import OpenInNewIcon             from '@mui/icons-material/OpenInNew';
import ShoppingCartOutlinedIcon  from '@mui/icons-material/ShoppingCartOutlined';
import VideoLibraryOutlinedIcon  from '@mui/icons-material/VideoLibraryOutlined';
import SearchIcon                from '@mui/icons-material/Search';

const API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68";
const HEADERS = { accept: 'application/json', Authorization: API_TOKEN };

const COUNTRY_PRIORITY = ['CO', 'MX', 'AR', 'ES', 'US', 'GB'];

function ProviderLogo({ p }) {
  return (
    <Tooltip title={p.provider_name} placement="top" arrow>
      <Box
        component="img"
        src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
        alt={p.provider_name}
        sx={{
          width: 38, height: 38,
          borderRadius: '10px',
          objectFit: 'cover',
          border: '1px solid rgba(255,255,255,0.08)',
          cursor: 'default',
          transition: 'transform 0.18s, border-color 0.18s',
          '&:hover': { transform: 'scale(1.12)', borderColor: 'rgba(255,193,7,0.45)' },
        }}
      />
    </Tooltip>
  );
}

function ProviderRow({ icon, label, providers }) {
  if (!providers?.length) return null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 82 }}>
        {icon}
        <Typography sx={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.32)', fontWeight: 700, letterSpacing: '0.5px' }}>
          {label}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
        {providers.map(p => <ProviderLogo key={p.provider_id} p={p} />)}
      </Box>
    </Box>
  );
}

export default function WhereToWatch({ movieId, movieTitle }) {
  // 'loading' | 'found' | 'empty'
  const [status,   setStatus]   = useState('loading');
  const [info,     setInfo]     = useState(null);
  const [jwLink,   setJwLink]   = useState(null);

  useEffect(() => {
    if (!movieId) return;
    setStatus('loading');
    setInfo(null);

    fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers`, { headers: HEADERS })
      .then(r => r.json())
      .then(res => {
        const results = res.results ?? {};

        // Grab JustWatch link from any country as global fallback
        const anyCountry = Object.values(results)[0];
        if (anyCountry?.link) setJwLink(anyCountry.link);

        const country = COUNTRY_PRIORITY.find(c => {
          const e = results[c];
          return e && (e.flatrate?.length || e.rent?.length || e.buy?.length);
        });

        if (!country) { setStatus('empty'); return; }

        setInfo({ ...results[country], country });
        setJwLink(results[country].link ?? jwLink);
        setStatus('found');
      })
      .catch(() => setStatus('empty'));
  }, [movieId]);

  const jwSearchLink = `https://www.justwatch.com/es/buscar?q=${encodeURIComponent(movieTitle ?? '')}`;

  return (
    <Box sx={{ mt: 3, pt: 2.5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <TvIcon sx={{ color: '#FFC107', fontSize: 16 }} />
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.1px' }}>
            Dónde ver
          </Typography>
          {info?.country && (
            <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.28)', ml: 0.3 }}>
              ({info.country})
            </Typography>
          )}
        </Box>
        <Box
          component="a"
          href={jwLink ?? jwSearchLink}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'flex', alignItems: 'center', gap: 0.35,
            color: 'rgba(255,255,255,0.28)', fontSize: '0.65rem',
            textDecoration: 'none', transition: 'color 0.2s',
            '&:hover': { color: '#FFC107' },
          }}
        >
          JustWatch <OpenInNewIcon sx={{ fontSize: 11 }} />
        </Box>
      </Box>

      {/* Loading */}
      {status === 'loading' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, py: 1 }}>
          <CircularProgress size={14} thickness={4} sx={{ color: 'rgba(255,255,255,0.2)' }} />
          <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
            Buscando plataformas…
          </Typography>
        </Box>
      )}

      {/* No data */}
      {status === 'empty' && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>
            No encontramos disponibilidad en tu región
          </Typography>
          <Box
            component="a"
            href={jwSearchLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.5,
              fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)',
              px: 1.5, py: 0.6, borderRadius: '7px', transition: 'all 0.2s',
              '&:hover': { color: '#FFC107', borderColor: 'rgba(255,193,7,0.4)' },
            }}
          >
            <SearchIcon sx={{ fontSize: 14 }} /> Buscar en JustWatch
          </Box>
        </Box>
      )}

      {/* Providers */}
      {status === 'found' && info && (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.4 }}>
            <ProviderRow
              icon={<TvIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }} />}
              label="STREAMING"
              providers={info.flatrate}
            />
            <ProviderRow
              icon={<VideoLibraryOutlinedIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }} />}
              label="ALQUILAR"
              providers={info.rent}
            />
            <ProviderRow
              icon={<ShoppingCartOutlinedIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }} />}
              label="COMPRAR"
              providers={info.buy}
            />
          </Box>
          <Typography sx={{ fontSize: '0.59rem', color: 'rgba(255,255,255,0.18)', mt: 1.5 }}>
            Datos de JustWatch · disponibilidad puede variar por país
          </Typography>
        </>
      )}
    </Box>
  );
}
