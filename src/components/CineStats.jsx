import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate }     from 'react-router-dom';
import StarIcon              from '@mui/icons-material/Star';
import WhatshotIcon          from '@mui/icons-material/Whatshot';
import ForumOutlinedIcon     from '@mui/icons-material/ForumOutlined';
import DiamondOutlinedIcon   from '@mui/icons-material/DiamondOutlined';
import BarChartIcon          from '@mui/icons-material/BarChart';

const CONFIGS = [
  {
    key:     'topRated',
    label:   'MEJOR CALIFICADA',
    Icon:    StarIcon,
    color:   '#FFC107',
    pick:    movies => [...movies].filter(p => p.vote_count > 300).sort((a, b) => b.vote_average - a.vote_average)[0],
    stat:    p => `★ ${p.vote_average.toFixed(1)}`,
  },
  {
    key:     'hottest',
    label:   'MÁS POPULAR HOY',
    Icon:    WhatshotIcon,
    color:   '#E53935',
    pick:    movies => [...movies].sort((a, b) => b.popularity - a.popularity)[0],
    stat:    p => `Pop. ${p.popularity.toFixed(0)}`,
  },
  {
    key:     'mostDiscussed',
    label:   'MÁS DISCUTIDA',
    Icon:    ForumOutlinedIcon,
    color:   '#2196F3',
    pick:    movies => [...movies].filter(p => p.vote_count > 0).sort((a, b) => b.vote_count - a.vote_count)[0],
    stat:    p => { const n = p.vote_count; return n >= 1000 ? `${(n/1000).toFixed(0)}K votos` : `${n} votos`; },
  },
  {
    key:     'gem',
    label:   'JOYA OCULTA',
    Icon:    DiamondOutlinedIcon,
    color:   '#7C4DFF',
    pick:    movies => {
      const avgPop  = movies.reduce((s, p) => s + p.popularity, 0) / movies.length;
      const gems    = movies.filter(p => p.vote_average >= 7.5 && p.vote_count > 200 && p.popularity < avgPop);
      return gems.sort((a, b) => b.vote_average - a.vote_average)[0] ?? null;
    },
    stat:    p => `★ ${p.vote_average.toFixed(1)} · baja popularidad`,
  },
];

function StatCard({ config, movie }) {
  const navigate = useNavigate();
  if (!movie) return null;

  const { Icon, color, label, stat } = config;

  return (
    <Box
      onClick={() => navigate(`/detalle/${movie.id}`)}
      sx={{
        position: 'relative', borderRadius: '16px', overflow: 'hidden',
        height: { xs: 148, sm: 168 },
        flex: '1 1 0', minWidth: { xs: 'calc(50% - 6px)', sm: 0 },
        cursor: 'pointer',
        transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s',
        '&:hover':         { transform: 'translateY(-5px)', boxShadow: `0 22px 55px rgba(0,0,0,0.55)` },
        '&:hover .ci-bg':  { transform: 'scale(1.1)' },
        '&:hover .ci-btn': { opacity: 1, transform: 'translateX(0)' },
      }}
    >
      {/* backdrop */}
      {movie.backdrop_path
        ? <Box className="ci-bg" component="img"
            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
            alt={movie.title}
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                  transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)' }} />
        : <Box sx={{ position: 'absolute', inset: 0, bgcolor: '#1a1a2e' }} />
      }

      {/* overlays */}
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.18) 100%)' }} />
      <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${color}28 0%, transparent 55%)` }} />

      {/* content */}
      <Box sx={{ position: 'absolute', inset: 0, p: { xs: 1.5, sm: 2 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

        {/* badge */}
        <Box sx={{
          display: 'inline-flex', alignItems: 'center', gap: 0.45, alignSelf: 'flex-start',
          bgcolor: `${color}28`, border: `1px solid ${color}66`,
          px: 1, py: 0.28, borderRadius: '5px',
        }}>
          <Icon sx={{ fontSize: 11, color }} />
          <Typography sx={{ fontSize: '0.57rem', fontWeight: 800, color, letterSpacing: '0.7px' }}>
            {label}
          </Typography>
        </Box>

        {/* bottom */}
        <Box>
          <Typography sx={{
            fontWeight: 800, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.2px',
            fontSize: { xs: '0.82rem', sm: '0.94rem' },
            overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            mb: 0.5,
          }}>
            {movie.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '0.73rem', fontWeight: 700, color }}>
              {stat(movie)}
            </Typography>
            <Box
              className="ci-btn"
              sx={{
                fontSize: '0.62rem', color: 'rgba(255,255,255,0.55)',
                opacity: 0, transform: 'translateX(4px)',
                transition: 'all 0.22s',
              }}
            >
              Ver →
            </Box>
          </Box>
          <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', mt: 0.2 }}>
            {movie.release_date?.slice(0, 4)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function CineStats({ Peliculas }) {
  const picks = useMemo(() => {
    if (!Peliculas?.length) return {};
    const movies = Peliculas.filter(p => p.backdrop_path);
    return Object.fromEntries(CONFIGS.map(c => [c.key, c.pick(movies)]));
  }, [Peliculas]);

  if (!Peliculas?.length) return null;

  return (
    <Box sx={{ mb: 5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <BarChartIcon sx={{ color: '#FFC107', fontSize: 18 }} />
        <Typography className="section-title" sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>
          En números
        </Typography>
      </Box>
      <Box className="scale-stagger" sx={{ display: 'flex', gap: { xs: 1.2, sm: 1.5 }, flexWrap: 'wrap' }}>
        {CONFIGS.map(c => (
          <StatCard key={c.key} config={c} movie={picks[c.key]} />
        ))}
      </Box>
    </Box>
  );
}
