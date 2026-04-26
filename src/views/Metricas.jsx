import React, { useState, useEffect, useMemo } from 'react';
import { Box, Container, Typography, CircularProgress, Tooltip, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BarChartIcon        from '@mui/icons-material/BarChart';
import StarIcon            from '@mui/icons-material/Star';
import ForumOutlinedIcon   from '@mui/icons-material/ForumOutlined';
import AttachMoneyIcon     from '@mui/icons-material/AttachMoney';
import BubbleChartIcon     from '@mui/icons-material/BubbleChart';
import CategoryIcon        from '@mui/icons-material/Category';
import EmojiEventsIcon     from '@mui/icons-material/EmojiEvents';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import TrendingUpIcon      from '@mui/icons-material/TrendingUp';
import WhatshotIcon        from '@mui/icons-material/Whatshot';

const API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68";
const HEADERS  = { accept: 'application/json', Authorization: API_TOKEN };
const BASE     = 'https://api.themoviedb.org/3';

const fmtM  = n => n >= 1e9 ? `$${(n/1e9).toFixed(2)}B` : n >= 1e6 ? `$${(n/1e6).toFixed(0)}M` : `$${n.toLocaleString()}`;
const fmtN  = n => n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `${(n/1e3).toFixed(0)}K` : String(n);

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];
const GENRE_COLORS = ['#FFC107','#E53935','#2196F3','#4CAF50','#7C4DFF','#FF6D00','#00BCD4','#F06292','#8BC34A','#FF8F00'];

// ── count-up hook ───────────────────────────────────────────────────────────
function useCountUp(target, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let cur = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [target, duration]);
  return val;
}

// ── KPI card ────────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, suffix = '', color = '#FFC107', fmt }) {
  const displayed = useCountUp(typeof value === 'number' ? value : 0);
  const show = fmt ? fmt(displayed) : `${displayed}${suffix}`;
  return (
    <Box sx={{
      flex: '1 1 0', minWidth: { xs: 'calc(50% - 8px)', md: 0 },
      bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '16px',
      p: { xs: 2, md: 2.5 }, border: '1px solid rgba(255,255,255,0.07)',
      position: 'relative', overflow: 'hidden',
    }}>
      <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.06, fontSize: 110, lineHeight: 1, color }}>
        {icon}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 1 }}>
        {React.cloneElement(icon, { sx: { fontSize: 15, color } })}
        <Typography sx={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '0.8px' }}>
          {label}
        </Typography>
      </Box>
      <Typography sx={{
        fontSize: { xs: '1.8rem', md: '2.2rem' }, fontWeight: 900, lineHeight: 1,
        letterSpacing: '-1.5px', color,
      }}>
        {show}
      </Typography>
    </Box>
  );
}

// ── leaderboard row ─────────────────────────────────────────────────────────
function LeaderRow({ movie, rank, barValue, maxBar, color, suffix, ready, navigate }) {
  const pct   = maxBar > 0 ? (barValue / maxBar) * 100 : 0;
  const medal = rank <= 3 ? MEDAL_COLORS[rank - 1] : null;
  return (
    <Box
      onClick={() => navigate(`/detalle/${movie.id}`)}
      sx={{
        display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer',
        p: 1, borderRadius: '10px', transition: 'background 0.2s',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
      }}
    >
      {/* rank */}
      <Typography sx={{
        fontSize: '0.78rem', fontWeight: 900, minWidth: 22, textAlign: 'center',
        color: medal ?? 'rgba(255,255,255,0.22)',
      }}>
        {rank}
      </Typography>

      {/* poster */}
      {movie.poster_path
        ? <Box component="img" src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
            alt={movie.title}
            sx={{ width: 32, height: 48, borderRadius: '5px', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255,255,255,0.08)' }} />
        : <Box sx={{ width: 32, height: 48, borderRadius: '5px', bgcolor: '#222', flexShrink: 0 }} />
      }

      {/* info + bar */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', mb: 0.3,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {movie.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ flex: 1, height: 5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <Box sx={{
              height: '100%', borderRadius: 3,
              width: ready ? `${pct}%` : '0%',
              bgcolor: color,
              transition: `width 1.2s cubic-bezier(0.22,1,0.36,1) ${rank * 0.05}s`,
              boxShadow: `0 0 8px ${color}55`,
            }} />
          </Box>
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color, minWidth: 40, textAlign: 'right' }}>
            {suffix === '★' ? `★ ${barValue.toFixed(1)}` : fmtN(barValue)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ── genre bar ────────────────────────────────────────────────────────────────
function GenreBar({ name, count, maxCount, color, rank, ready }) {
  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', minWidth: 110, textAlign: 'right' }}>
        {name}
      </Typography>
      <Box sx={{ flex: 1, height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
        <Box sx={{
          height: '100%', borderRadius: 4,
          width: ready ? `${pct}%` : '0%',
          background: `linear-gradient(90deg, ${color} 0%, ${color}88 100%)`,
          transition: `width 1.3s cubic-bezier(0.22,1,0.36,1) ${rank * 0.07}s`,
          boxShadow: `0 0 10px ${color}44`,
        }} />
      </Box>
      <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color, minWidth: 26 }}>
        {count}
      </Typography>
    </Box>
  );
}

// ── box-office row ───────────────────────────────────────────────────────────
function BoRow({ movie, maxRev, ready, navigate }) {
  const roi    = movie.budget > 0 ? (movie.revenue / movie.budget).toFixed(1) : null;
  const profit = movie.revenue - movie.budget;
  const revPct = maxRev > 0 ? (movie.revenue / maxRev) * 100 : 0;
  const budPct = maxRev > 0 ? (movie.budget  / maxRev) * 100 : 0;
  return (
    <Box
      onClick={() => navigate(`/detalle/${movie.id}`)}
      sx={{
        display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', p: 1,
        borderRadius: '10px', transition: 'background 0.2s',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
      }}
    >
      {movie.poster_path
        ? <Box component="img" src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
            sx={{ width: 32, height: 48, borderRadius: '5px', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255,255,255,0.08)' }} />
        : <Box sx={{ width: 32, height: 48, borderRadius: '5px', bgcolor: '#222', flexShrink: 0 }} />
      }
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
          <Typography sx={{ fontSize: '0.77rem', fontWeight: 700, color: '#fff',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
            {movie.title}
          </Typography>
          {roi && (
            <Box sx={{
              px: 0.8, py: 0.15, borderRadius: '5px', fontSize: '0.64rem', fontWeight: 800,
              bgcolor: profit > 0 ? 'rgba(76,175,80,0.15)' : 'rgba(229,57,53,0.12)',
              color: profit > 0 ? '#4CAF50' : '#E53935',
              border: `1px solid ${profit > 0 ? 'rgba(76,175,80,0.3)' : 'rgba(229,57,53,0.25)'}`,
            }}>
              {profit > 0 ? `${roi}× ROI` : 'Pérdida'}
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
            <Typography sx={{ fontSize: '0.59rem', color: 'rgba(255,255,255,0.3)', minWidth: 66 }}>Presupuesto</Typography>
            <Box sx={{ flex: 1, height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
              <Box sx={{ height: '100%', borderRadius: 2, bgcolor: '#FFC107', width: ready ? `${budPct}%` : '0%', transition: 'width 1.3s cubic-bezier(0.22,1,0.36,1)' }} />
            </Box>
            <Typography sx={{ fontSize: '0.62rem', color: '#FFC107', minWidth: 46, textAlign: 'right' }}>{fmtM(movie.budget)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
            <Typography sx={{ fontSize: '0.59rem', color: 'rgba(255,255,255,0.3)', minWidth: 66 }}>Recaudación</Typography>
            <Box sx={{ flex: 1, height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
              <Box sx={{ height: '100%', borderRadius: 2, bgcolor: '#4CAF50', width: ready ? `${revPct}%` : '0%', transition: 'width 1.4s cubic-bezier(0.22,1,0.36,1) 0.1s' }} />
            </Box>
            <Typography sx={{ fontSize: '0.62rem', color: '#4CAF50', minWidth: 46, textAlign: 'right' }}>{fmtM(movie.revenue)}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ── SECTION HEADER ────────────────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.4 }}>
        {React.cloneElement(icon, { sx: { color: '#FFC107', fontSize: 18 } })}
        <Typography className="section-title" sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>
          {title}
        </Typography>
      </Box>
      {subtitle && (
        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', ml: 3.2 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

function Panel({ children, sx = {} }) {
  return (
    <Box sx={{ bgcolor: 'rgba(255,255,255,0.025)', borderRadius: '18px', p: { xs: 2, md: 3 }, border: '1px solid rgba(255,255,255,0.06)', ...sx }}>
      {children}
    </Box>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function Metricas() {
  const navigate = useNavigate();

  const [loading,       setLoading]       = useState(true);
  const [topRated,      setTopRated]      = useState([]);
  const [popular,       setPopular]       = useState([]);
  const [genreMap,      setGenreMap]      = useState({});
  const [boxOffice,     setBoxOffice]     = useState([]);
  const [ready,         setReady]         = useState(false);

  // ── Phase 1: lists + genres ──────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/movie/top_rated?language=es&page=1`, { headers: HEADERS }).then(r => r.json()),
      fetch(`${BASE}/movie/top_rated?language=es&page=2`, { headers: HEADERS }).then(r => r.json()),
      fetch(`${BASE}/movie/popular?language=es&page=1`,   { headers: HEADERS }).then(r => r.json()),
      fetch(`${BASE}/movie/popular?language=es&page=2`,   { headers: HEADERS }).then(r => r.json()),
      fetch(`${BASE}/genre/movie/list?language=es`,       { headers: HEADERS }).then(r => r.json()),
    ])
      .then(([tr1, tr2, pop1, pop2, genreData]) => {
        const trMovies  = [...(tr1.results ?? []), ...(tr2.results ?? [])].filter(p => p.poster_path);
        const popMovies = [...(pop1.results ?? []), ...(pop2.results ?? [])].filter(p => p.poster_path);
        const gMap = Object.fromEntries((genreData.genres ?? []).map(g => [g.id, g.name]));

        setTopRated(trMovies);
        setPopular(popMovies);
        setGenreMap(gMap);
        setLoading(false);

        // Trigger bar animations
        setTimeout(() => setReady(true), 150);

        // ── Phase 2: box office (top 8 popular → fetch details) ──────────
        const ids = popMovies.slice(0, 8).map(p => p.id);
        Promise.all(ids.map(id =>
          fetch(`${BASE}/movie/${id}?language=es`, { headers: HEADERS }).then(r => r.json())
        ))
          .then(details => {
            const withBO = details
              .filter(d => d.budget > 0 && d.revenue > 0)
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 6);
            setBoxOffice(withBO);
          })
          .catch(() => {});
      })
      .catch(() => setLoading(false));
  }, []);

  // ── Derived data ─────────────────────────────────────────────────────────
  const leaderboard = useMemo(() =>
    [...topRated].sort((a, b) => b.vote_average - a.vote_average).slice(0, 10),
  [topRated]);

  const mostDiscussed = useMemo(() => {
    const all = [...topRated, ...popular];
    const seen = new Set();
    return all.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; })
      .sort((a, b) => b.vote_count - a.vote_count).slice(0, 10);
  }, [topRated, popular]);

  const genreStats = useMemo(() => {
    const count = {};
    popular.forEach(m => m.genre_ids?.forEach(gid => { count[gid] = (count[gid] || 0) + 1; }));
    return Object.entries(count)
      .sort(([,a], [,b]) => b - a).slice(0, 10)
      .map(([id, cnt], i) => ({ id: Number(id), name: genreMap[id] ?? 'Otro', count: cnt, color: GENRE_COLORS[i] }));
  }, [popular, genreMap]);

  const scatterMovies = useMemo(() => {
    const all = [...topRated, ...popular];
    const seen = new Set();
    return all.filter(m => {
      if (seen.has(m.id) || !m.poster_path || !m.popularity || !m.vote_average) return false;
      seen.add(m.id); return true;
    }).slice(0, 60);
  }, [topRated, popular]);

  // Scatter normalization
  const scatterCoords = useMemo(() => {
    if (!scatterMovies.length) return [];
    const logP = m => Math.log10(Math.max(1, m.popularity));
    const logs = scatterMovies.map(logP);
    const minLog = Math.min(...logs), maxLog = Math.max(...logs);
    const scores = scatterMovies.map(m => m.vote_average);
    const minS = Math.min(...scores), maxS = Math.max(...scores);
    return scatterMovies.map(m => ({
      ...m,
      x: ((logP(m) - minLog) / (maxLog - minLog || 1)) * 88 + 4,
      y: (1 - ((m.vote_average - minS) / (maxS - minS || 1))) * 84 + 6,
    }));
  }, [scatterMovies]);

  // KPI values
  const avgRating   = topRated.length ? (topRated.reduce((s, m) => s + m.vote_average, 0) / topRated.length) : 0;
  const topGenre    = genreStats[0];
  const totalVotes  = mostDiscussed[0]?.vote_count ?? 0;
  const maxRevenue  = boxOffice[0]?.revenue ?? 0;
  const maxDisc     = mostDiscussed[0]?.vote_count ?? 1;

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', gap: 2 }}>
      <CircularProgress color="warning" size={44} thickness={3} />
      <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', letterSpacing: '3px' }}>ANALIZANDO</Typography>
    </Box>
  );

  return (
    <Container maxWidth="xl" className="page-enter" sx={{ pt: { xs: 3, md: 5 }, pb: 8 }}>

      {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 0.8 }}>
          <BarChartIcon sx={{ color: '#FFC107', fontSize: 28 }} />
          <Typography sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, fontWeight: 900, color: '#fff', letterSpacing: '-1.5px' }}>
            Métricas del Cine
          </Typography>
        </Box>
        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.88rem', ml: 5 }}>
          Análisis en tiempo real de {topRated.length + popular.length} películas · datos de TMDB
        </Typography>
      </Box>

      {/* ── KPI STRIP ────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: { xs: 1.2, md: 2 }, flexWrap: 'wrap', mb: 5 }}>
        <KpiCard icon={<StarIcon />}           label="CALIFICACIÓN PROMEDIO" value={Math.round(avgRating * 10)}  fmt={v => (v / 10).toFixed(2)} color="#FFC107" />
        <KpiCard icon={<ForumOutlinedIcon />}  label="VOTOS EN TOP DISCUTIDA" value={totalVotes}   fmt={fmtN} color="#2196F3" />
        <KpiCard icon={<TrendingUpIcon />}     label="PELÍCULAS ANALIZADAS"   value={topRated.length + popular.length} color="#4CAF50" />
        <KpiCard icon={<WhatshotIcon />}       label="GÉNERO DOMINANTE"       value={topGenre?.count ?? 0} suffix="" fmt={v => topGenre ? `${topGenre.name} (${v})` : '—'} color="#E53935" />
      </Box>

      {/* ── LEADERBOARD + MOST DISCUSSED ─────────────────────────────────── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Panel>
            <SectionHeader icon={<EmojiEventsIcon />} title="Podio de los Dioses" subtitle="Top 10 mejor calificadas de todos los tiempos" />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2 }}>
              {leaderboard.map((m, i) => (
                <LeaderRow key={m.id} movie={m} rank={i + 1} barValue={m.vote_average} maxBar={10} color="#FFC107" suffix="★" ready={ready} navigate={navigate} />
              ))}
            </Box>
          </Panel>
        </Grid>
        <Grid item xs={12} md={6}>
          <Panel>
            <SectionHeader icon={<ForumOutlinedIcon />} title="Las más debatidas" subtitle="Top 10 con mayor cantidad de votos de audiencia" />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2 }}>
              {mostDiscussed.map((m, i) => (
                <LeaderRow key={m.id} movie={m} rank={i + 1} barValue={m.vote_count} maxBar={maxDisc} color="#2196F3" suffix="" ready={ready} navigate={navigate} />
              ))}
            </Box>
          </Panel>
        </Grid>
      </Grid>

      {/* ── GENRE DISTRIBUTION ────────────────────────────────────────────── */}
      <Panel sx={{ mb: 4 }}>
        <SectionHeader icon={<CategoryIcon />} title="Géneros dominantes" subtitle={`Frecuencia en las ${popular.length} películas más populares`} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              {genreStats.map((g, i) => (
                <GenreBar key={g.id} name={g.name} count={g.count} maxCount={genreStats[0]?.count ?? 1} color={g.color} rank={i} ready={ready} />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            {/* Bubble chart visual */}
            <Box sx={{ position: 'relative', height: 280 }}>
              {genreStats.map((g, i) => {
                const size = 28 + (g.count / (genreStats[0]?.count || 1)) * 70;
                // deterministic layout in a grid-ish pattern
                const col = i % 3, row = Math.floor(i / 3);
                const x = 8 + col * 31 + (row % 2 ? 12 : 0);
                const y = 6 + row * 28;
                return (
                  <Tooltip key={g.id} title={`${g.name}: ${g.count} películas`} placement="top" arrow>
                    <Box sx={{
                      position: 'absolute',
                      left: `${x}%`, top: `${y}%`,
                      width: size, height: size,
                      borderRadius: '50%',
                      bgcolor: `${g.color}22`,
                      border: `2px solid ${g.color}66`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'default',
                      transition: 'transform 0.2s, border-color 0.2s',
                      '&:hover': { transform: 'scale(1.15)', borderColor: g.color },
                      animation: `popIn 0.5s var(--ease-spring) ${i * 0.06}s both`,
                    }}>
                      <Typography sx={{ fontSize: `${Math.max(0.5, size / 60)}rem`, fontWeight: 800, color: g.color, textAlign: 'center', lineHeight: 1.1, px: 0.3 }}>
                        {g.name.split(' ').map(w => w[0]).join('').slice(0, 3)}
                      </Typography>
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>
          </Grid>
        </Grid>
      </Panel>

      {/* ── GALAXIA CINEMATOGRÁFICA ────────────────────────────────────────── */}
      <Panel sx={{ mb: 4 }}>
        <SectionHeader
          icon={<BubbleChartIcon />}
          title="Galaxia Cinematográfica"
          subtitle="Cada poster es una película · eje X = popularidad · eje Y = calificación · hover para ampliar"
        />
        <Box sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 340, sm: 450, md: 540 },
          bgcolor: 'rgba(0,0,0,0.35)',
          borderRadius: '14px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.04)',
          background: 'radial-gradient(ellipse at 70% 30%, rgba(124,77,255,0.06) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(255,193,7,0.05) 0%, transparent 50%), #0a0a0a',
        }}>

          {/* Quadrant lines */}
          <Box sx={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, bgcolor: 'rgba(255,255,255,0.05)', zIndex: 0 }} />
          <Box sx={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, bgcolor: 'rgba(255,255,255,0.05)', zIndex: 0 }} />

          {/* Quadrant labels */}
          {[
            { label: 'Iconos del Cine',  top: '4%',  left: '52%', color: '#FFC107' },
            { label: 'Joyas Ocultas',    top: '4%',  left: '4%',  color: '#7C4DFF' },
            { label: 'Fenómenos',        top: '54%', left: '52%', color: '#E53935'  },
            { label: 'En el olvido',     top: '54%', left: '4%',  color: 'rgba(255,255,255,0.2)' },
          ].map(q => (
            <Typography key={q.label} sx={{
              position: 'absolute', top: q.top, left: q.left,
              fontSize: '0.6rem', fontWeight: 700, color: q.color,
              letterSpacing: '0.6px', zIndex: 0, userSelect: 'none',
            }}>
              {q.label}
            </Typography>
          ))}

          {/* Axis labels */}
          <Typography sx={{ position: 'absolute', bottom: 8, right: 12, fontSize: '0.58rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.5px' }}>
            Popularidad →
          </Typography>
          <Typography sx={{ position: 'absolute', top: 8, left: 12, fontSize: '0.58rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.5px', writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>
            ← Calificación
          </Typography>

          {/* Movie posters */}
          {scatterCoords.map(m => (
            <Tooltip
              key={m.id}
              title={`${m.title}  ★${m.vote_average.toFixed(1)}  Pop.${m.popularity.toFixed(0)}`}
              placement="top" arrow
            >
              <Box
                onClick={() => navigate(`/detalle/${m.id}`)}
                sx={{
                  position: 'absolute',
                  left:   `${m.x}%`,
                  top:    `${m.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width:  34, height: 50,
                  borderRadius: '4px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1.5px solid rgba(255,255,255,0.12)',
                  zIndex: 1,
                  transition: 'transform 0.22s cubic-bezier(0.22,1,0.36,1), z-index 0s, box-shadow 0.22s, border-color 0.22s',
                  '&:hover': {
                    transform: 'translate(-50%, -50%) scale(2.6)',
                    zIndex: 20,
                    boxShadow: '0 10px 32px rgba(0,0,0,0.85)',
                    borderColor: '#FFC107',
                  },
                }}
              >
                <Box
                  component="img"
                  src={`https://image.tmdb.org/t/p/w92${m.poster_path}`}
                  alt={m.title}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </Box>
            </Tooltip>
          ))}
        </Box>
      </Panel>

      {/* ── BOX OFFICE ────────────────────────────────────────────────────── */}
      {boxOffice.length > 0 && (
        <Panel sx={{ mb: 4 }}>
          <SectionHeader icon={<AttachMoneyIcon />} title="Taquilla & ROI" subtitle="Presupuesto vs recaudación de las más populares" />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {boxOffice.map(m => (
              <BoRow key={m.id} movie={m} maxRev={maxRevenue} ready={ready} navigate={navigate} />
            ))}
          </Box>
        </Panel>
      )}

      {/* ── JOYAS OCULTAS ─────────────────────────────────────────────────── */}
      <Panel>
        <SectionHeader icon={<DiamondOutlinedIcon />} title="Joyas ocultas" subtitle="Alta calificación · baja popularidad · poco conocidas" />
        {(() => {
          const avgPop = popular.reduce((s, m) => s + m.popularity, 0) / (popular.length || 1);
          const gems = [...topRated, ...popular]
            .filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i)
            .filter(m => m.vote_average >= 7.8 && m.vote_count > 500 && m.popularity < avgPop * 0.6 && m.poster_path)
            .sort((a, b) => b.vote_average - a.vote_average)
            .slice(0, 12);

          if (!gems.length) return (
            <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
              No hay suficiente contraste en los datos actuales.
            </Typography>
          );

          return (
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {gems.map(m => (
                <Box
                  key={m.id}
                  onClick={() => navigate(`/detalle/${m.id}`)}
                  sx={{
                    position: 'relative', width: { xs: 96, sm: 110 }, flexShrink: 0,
                    cursor: 'pointer', borderRadius: '10px', overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 14px 36px rgba(0,0,0,0.6)' },
                    '&:hover .gem-overlay': { opacity: 1 },
                  }}
                >
                  <Box
                    component="img"
                    src={`https://image.tmdb.org/t/p/w185${m.poster_path}`}
                    alt={m.title}
                    sx={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }}
                  />
                  <Box className="gem-overlay" sx={{
                    position: 'absolute', inset: 0, opacity: 0, transition: 'opacity 0.2s',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                    display: 'flex', alignItems: 'flex-end', p: 1,
                  }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff', lineHeight: 1.2, mb: 0.25 }}>
                        {m.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.62rem', color: '#7C4DFF', fontWeight: 700 }}>
                        ★ {m.vote_average.toFixed(1)}
                      </Typography>
                    </Box>
                  </Box>
                  {/* Score badge */}
                  <Box sx={{
                    position: 'absolute', top: 6, right: 6,
                    bgcolor: 'rgba(124,77,255,0.9)', borderRadius: '5px',
                    px: 0.7, py: 0.2, fontSize: '0.62rem', fontWeight: 800, color: '#fff',
                  }}>
                    ★ {m.vote_average.toFixed(1)}
                  </Box>
                </Box>
              ))}
            </Box>
          );
        })()}
      </Panel>

    </Container>
  );
}
