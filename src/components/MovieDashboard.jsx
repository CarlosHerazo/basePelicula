import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import StarIcon              from '@mui/icons-material/Star';
import AttachMoneyIcon       from '@mui/icons-material/AttachMoney';
import LabelOutlinedIcon     from '@mui/icons-material/LabelOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import TrendingUpIcon        from '@mui/icons-material/TrendingUp';

const API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68";
const HEADERS = { accept: 'application/json', Authorization: API_TOKEN };

const fmtM  = n => n >= 1e9 ? `$${(n/1e9).toFixed(2)}B` : n >= 1e6 ? `$${(n/1e6).toFixed(0)}M` : n > 0 ? `$${n.toLocaleString()}` : null;
const fmtN  = n => n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `${(n/1e3).toFixed(0)}K` : String(n);

function Card({ children, sx = {} }) {
  return (
    <Box sx={{
      bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '14px',
      p: 2.2, border: '1px solid rgba(255,255,255,0.06)', ...sx,
    }}>
      {children}
    </Box>
  );
}

function CardHead({ icon, label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 1.8 }}>
      {icon}
      <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.9px' }}>
        {label}
      </Typography>
    </Box>
  );
}

function AnimBar({ value, max, color, label, formatted, ready, delay = 0 }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.45 }}>
        <Typography sx={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.35)' }}>{label}</Typography>
        <Typography sx={{ fontSize: '0.7rem', color: '#fff', fontWeight: 700 }}>{formatted}</Typography>
      </Box>
      <Box sx={{ height: 7, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
        <Box sx={{
          position: 'absolute', top: 0, left: 0, height: '100%',
          width: ready ? `${pct}%` : '0%',
          background: `linear-gradient(90deg, ${color} 0%, ${color}99 100%)`,
          borderRadius: 4,
          transition: `width 1.4s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
          boxShadow: `0 0 12px ${color}55`,
        }} />
      </Box>
    </Box>
  );
}

export default function MovieDashboard({ movie, movieId }) {
  const [keywords, setKeywords] = useState([]);
  const [ready,    setReady]    = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!movieId) return;
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/keywords`, { headers: HEADERS })
      .then(r => r.json())
      .then(d => setKeywords(d.keywords?.slice(0, 16) ?? []))
      .catch(() => {});
  }, [movieId]);

  const score      = movie.vote_average ?? 0;
  const votes      = movie.vote_count   ?? 0;
  const popularity = movie.popularity   ?? 0;
  const budget     = movie.budget       ?? 0;
  const revenue    = movie.revenue      ?? 0;
  const profit     = revenue - budget;
  const roi        = budget > 0 && revenue > 0 ? (revenue / budget).toFixed(1) : null;
  const maxBO      = Math.max(budget, revenue, 1);
  const popPct     = Math.min(100, (popularity / 250) * 100);

  const scoreColor = score >= 7.5 ? '#4CAF50' : score >= 6 ? '#FFC107' : '#E53935';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

      {/* ── Score ── */}
      <Card>
        <CardHead icon={<StarIcon sx={{ color: '#FFC107', fontSize: 13 }} />} label="PUNTUACIÓN TMDB" />

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.4, mb: 1.4 }}>
          <Typography sx={{
            fontSize: '4rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-3px',
            background: `linear-gradient(135deg, ${scoreColor} 0%, ${scoreColor}77 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            {score.toFixed(1)}
          </Typography>
          <Typography sx={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.2)', fontWeight: 300 }}>/10</Typography>
        </Box>

        {/* Score bar */}
        <Box sx={{ height: 5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.06)', overflow: 'hidden', mb: 1.4 }}>
          <Box sx={{
            height: '100%',
            width: ready ? `${score * 10}%` : '0%',
            background: `linear-gradient(90deg, ${scoreColor} 0%, ${scoreColor}88 100%)`,
            borderRadius: 3,
            transition: 'width 1.2s cubic-bezier(0.22,1,0.36,1)',
            boxShadow: `0 0 14px ${scoreColor}44`,
          }} />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.45 }}>
            <PeopleAltOutlinedIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.28)' }} />
            <Typography sx={{ fontSize: '0.69rem', color: 'rgba(255,255,255,0.32)' }}>
              {fmtN(votes)} votos
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.45 }}>
            <TrendingUpIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.28)' }} />
            <Typography sx={{ fontSize: '0.69rem', color: 'rgba(255,255,255,0.32)' }}>
              Pop. {popularity.toFixed(0)}
            </Typography>
          </Box>
        </Box>

        {/* Popularity bar */}
        <Box sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
          <Box sx={{
            height: '100%',
            width: ready ? `${popPct}%` : '0%',
            bgcolor: '#7C4DFF',
            borderRadius: 2,
            transition: 'width 1.5s cubic-bezier(0.22,1,0.36,1) 0.25s',
            boxShadow: '0 0 10px rgba(124,77,255,0.5)',
          }} />
        </Box>
      </Card>

      {/* ── Box office ── */}
      {(budget > 0 || revenue > 0) && (
        <Card>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <AttachMoneyIcon sx={{ color: '#FFC107', fontSize: 13 }} />
              <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.9px' }}>
                TAQUILLA
              </Typography>
            </Box>
            {roi && (
              <Box sx={{
                px: 1.2, py: 0.3, borderRadius: '7px',
                bgcolor: profit > 0 ? 'rgba(76,175,80,0.14)' : 'rgba(229,57,53,0.12)',
                border: `1px solid ${profit > 0 ? 'rgba(76,175,80,0.35)' : 'rgba(229,57,53,0.3)'}`,
              }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: profit > 0 ? '#4CAF50' : '#E53935' }}>
                  {profit > 0 ? `${roi}× ROI` : 'Sin ganancias'}
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.4 }}>
            {budget > 0 && (
              <AnimBar value={budget}            max={maxBO} color="#FFC107" label="Presupuesto"   formatted={fmtM(budget)}            ready={ready} delay={0}   />
            )}
            {revenue > 0 && (
              <AnimBar value={revenue}           max={maxBO} color="#4CAF50" label="Recaudación"   formatted={fmtM(revenue)}           ready={ready} delay={0.1} />
            )}
            {budget > 0 && revenue > 0 && (
              <AnimBar value={Math.abs(profit)}  max={maxBO} color={profit > 0 ? '#2196F3' : '#E53935'} label={profit > 0 ? 'Ganancia neta' : 'Pérdida'} formatted={fmtM(Math.abs(profit))} ready={ready} delay={0.2} />
            )}
          </Box>
        </Card>
      )}

      {/* ── Keywords ── */}
      {keywords.length > 0 && (
        <Card>
          <CardHead icon={<LabelOutlinedIcon sx={{ color: '#FFC107', fontSize: 13 }} />} label="ETIQUETAS" />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.55 }}>
            {keywords.map(k => (
              <Chip key={k.id} label={k.name} size="small" sx={{
                bgcolor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.48)',
                border: '1px solid rgba(255,255,255,0.07)', fontSize: '0.66rem', height: 22,
                '&:hover': { bgcolor: 'rgba(255,193,7,0.1)', color: '#FFC107', borderColor: 'rgba(255,193,7,0.3)' },
                transition: 'all 0.2s', cursor: 'default',
              }} />
            ))}
          </Box>
        </Card>
      )}
    </Box>
  );
}
