import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Container, Typography, CircularProgress, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SearchIcon        from '@mui/icons-material/Search';
import CloseIcon         from '@mui/icons-material/Close';
import StarIcon          from '@mui/icons-material/Star';
import EmojiEventsIcon   from '@mui/icons-material/EmojiEvents';

const API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68";
const HEADERS = { accept: 'application/json', Authorization: API_TOKEN };
const BASE    = 'https://api.themoviedb.org/3';

const COLORS  = ['#FFC107', '#E53935'];
const fmtM    = n => n >= 1e9 ? `$${(n/1e9).toFixed(2)}B` : n >= 1e6 ? `$${(n/1e6).toFixed(0)}M` : n > 0 ? `$${n.toLocaleString()}` : 'N/A';
const fmtN    = n => n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `${(n/1e3).toFixed(0)}K` : String(n);
const fmtMin  = m => m ? `${Math.floor(m/60)}h ${m%60}m` : 'N/A';
const rColor  = r => r >= 7.5 ? '#4CAF50' : r >= 6 ? '#FFC107' : '#E53935';

// ── Radar SVG ──────────────────────────────────────────────────────────────
const RADAR_LABELS = ['Calificación', 'Popularidad', 'Audiencia', 'Taquilla', 'Duración'];

function RadarChart({ valuesA, valuesB }) {
  const N = RADAR_LABELS.length;
  const cx = 110, cy = 110, r = 85;
  const angle = i => (i / N) * 2 * Math.PI - Math.PI / 2;
  const pt = (v, i) => [cx + r * v * Math.cos(angle(i)), cy + r * v * Math.sin(angle(i))];
  const poly = vals => vals.map((v, i) => pt(v, i).join(',')).join(' ');
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg width={220} height={220} style={{ overflow: 'visible' }}>
      {/* Grid rings */}
      {rings.map(s => (
        <polygon key={s} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1"
          points={Array.from({length: N}, (_, i) => pt(s, i).join(',')).join(' ')} />
      ))}
      {/* Axes */}
      {Array.from({length: N}, (_, i) => {
        const [x, y] = pt(1, i);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />;
      })}
      {/* Polygon A */}
      <polygon points={poly(valuesA)} fill={`${COLORS[0]}28`} stroke={COLORS[0]} strokeWidth="2" />
      {/* Polygon B */}
      <polygon points={poly(valuesB)} fill={`${COLORS[1]}28`} stroke={COLORS[1]} strokeWidth="2" />
      {/* Dots A */}
      {valuesA.map((v, i) => { const [x,y] = pt(v,i); return <circle key={i} cx={x} cy={y} r={3} fill={COLORS[0]} />; })}
      {/* Dots B */}
      {valuesB.map((v, i) => { const [x,y] = pt(v,i); return <circle key={i} cx={x} cy={y} r={3} fill={COLORS[1]} />; })}
      {/* Labels */}
      {RADAR_LABELS.map((lbl, i) => {
        const [x, y] = pt(1.28, i);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            fill="rgba(255,255,255,0.42)" fontSize="8" fontWeight="700" letterSpacing="0.3">
            {lbl.toUpperCase()}
          </text>
        );
      })}
    </svg>
  );
}

// ── Movie search box ────────────────────────────────────────────────────────
function SearchBox({ label, color, selected, onSelect }) {
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open,    setOpen]    = useState(false);
  const timer = useRef(null);
  const ref   = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const search = val => {
    clearTimeout(timer.current);
    if (!val.trim()) { setResults([]); setOpen(false); return; }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(`${BASE}/search/movie?query=${encodeURIComponent(val)}&language=es&page=1`, { headers: HEADERS });
        const d = await r.json();
        setResults((d.results ?? []).filter(m => m.poster_path).slice(0, 6));
        setOpen(true);
      } catch { } finally { setLoading(false); }
    }, 380);
  };

  if (selected) return (
    <Box sx={{
      flex: 1, position: 'relative', borderRadius: '14px', overflow: 'hidden',
      border: `2px solid ${color}66`, bgcolor: `${color}08`,
    }}>
      <Box component="img" src={`https://image.tmdb.org/t/p/w500${selected.backdrop_path || selected.poster_path}`}
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(8px) brightness(0.25)', transform: 'scale(1.08)' }} />
      <Box sx={{ position: 'relative', p: 2.5, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Box component="img" src={`https://image.tmdb.org/t/p/w342${selected.poster_path}`}
          sx={{ width: 64, borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.7)', flexShrink: 0 }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'inline-block', px: 0.8, py: 0.2, borderRadius: '4px', bgcolor: `${color}22`, border: `1px solid ${color}55`, fontSize: '0.58rem', fontWeight: 800, color, mb: 0.5, letterSpacing: '0.5px' }}>
            {label}
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.3px', lineHeight: 1.2, color: '#fff' }}>
            {selected.title}
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', mt: 0.3 }}>
            {selected.release_date?.slice(0, 4)} · ★ {selected.vote_average?.toFixed(1)}
          </Typography>
        </Box>
        <Box onClick={() => onSelect(null)} sx={{ cursor: 'pointer', color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#fff' }, flexShrink: 0 }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box ref={ref} sx={{ flex: 1, position: 'relative' }}>
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1,
        px: 2, py: 1.2, borderRadius: '14px',
        border: `2px solid ${open ? color : 'rgba(255,255,255,0.12)'}`,
        bgcolor: 'rgba(255,255,255,0.03)',
        transition: 'border-color 0.2s',
      }}>
        <Box sx={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
        <Box component="input"
          value={query}
          onChange={e => { setQuery(e.target.value); search(e.target.value); }}
          placeholder={label}
          style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '0.9rem', flex: 1, fontFamily: 'inherit' }}
        />
        {loading ? <CircularProgress size={14} sx={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} /> : <SearchIcon sx={{ fontSize: 17, color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />}
      </Box>

      {open && results.length > 0 && (
        <Box sx={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 50,
          bgcolor: '#161616', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.7)', overflow: 'hidden',
        }}>
          {results.map(m => (
            <Box key={m.id} onClick={() => { onSelect(m); setQuery(''); setOpen(false); }}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.2, cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)',
                '&:last-child': { border: 'none' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }, transition: 'background 0.15s' }}>
              <Box component="img" src={`https://image.tmdb.org/t/p/w92${m.poster_path}`}
                sx={{ width: 28, height: 42, borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} />
              <Box>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{m.title}</Typography>
                <Typography sx={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.38)' }}>
                  {m.release_date?.slice(0, 4)} · ★ {m.vote_average?.toFixed(1)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

// ── Stat row ───────────────────────────────────────────────────────────────
function StatRow({ label, a, b, formatFn, higherIsBetter = true, ready }) {
  const aNum = typeof a === 'number' ? a : 0;
  const bNum = typeof b === 'number' ? b : 0;
  const max  = Math.max(aNum, bNum, 1);
  const aPct = (aNum / max) * 100;
  const bPct = (bNum / max) * 100;
  const aWins = higherIsBetter ? aNum > bNum : aNum < bNum;
  const bWins = higherIsBetter ? bNum > aNum : bNum < aNum;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Typography sx={{ fontSize: '0.72rem', color: aWins ? COLORS[0] : 'rgba(255,255,255,0.5)', fontWeight: aWins ? 700 : 400 }}>
          {formatFn ? formatFn(a) : a}{aWins && ' ▲'}
        </Typography>
        <Typography sx={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.5px' }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: '0.72rem', color: bWins ? COLORS[1] : 'rgba(255,255,255,0.5)', fontWeight: bWins ? 700 : 400, textAlign: 'right' }}>
          {bWins && '▲ '}{formatFn ? formatFn(b) : b}
        </Typography>
      </Box>
      <Box sx={{ position: 'relative', height: 7, display: 'flex', gap: '2px' }}>
        {/* Bar A (right-aligned) */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', height: '100%', bgcolor: 'rgba(255,255,255,0.04)', borderRadius: '3px 0 0 3px', overflow: 'hidden' }}>
          <Box sx={{ height: '100%', width: ready ? `${aPct}%` : '0%', bgcolor: COLORS[0], borderRadius: '3px 0 0 3px', transition: 'width 1.2s cubic-bezier(0.22,1,0.36,1)', boxShadow: `0 0 8px ${COLORS[0]}55` }} />
        </Box>
        {/* Center divider */}
        <Box sx={{ width: 2, bgcolor: 'rgba(255,255,255,0.15)', flexShrink: 0, borderRadius: 1 }} />
        {/* Bar B (left-aligned) */}
        <Box sx={{ flex: 1, height: '100%', bgcolor: 'rgba(255,255,255,0.04)', borderRadius: '0 3px 3px 0', overflow: 'hidden' }}>
          <Box sx={{ height: '100%', width: ready ? `${bPct}%` : '0%', bgcolor: COLORS[1], borderRadius: '0 3px 3px 0', transition: 'width 1.2s cubic-bezier(0.22,1,0.36,1) 0.1s', boxShadow: `0 0 8px ${COLORS[1]}55` }} />
        </Box>
      </Box>
    </Box>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
export default function Comparador() {
  const navigate = useNavigate();
  const [movieA, setMovieA] = useState(null);
  const [movieB, setMovieB] = useState(null);
  const [detailA, setDetailA] = useState(null);
  const [detailB, setDetailB] = useState(null);
  const [ready,   setReady]   = useState(false);

  // Fetch full details when a movie is selected
  useEffect(() => {
    if (!movieA) { setDetailA(null); return; }
    setReady(false);
    fetch(`${BASE}/movie/${movieA.id}?language=es`, { headers: HEADERS })
      .then(r => r.json()).then(setDetailA).catch(() => setDetailA(movieA));
  }, [movieA]);

  useEffect(() => {
    if (!movieB) { setDetailB(null); return; }
    fetch(`${BASE}/movie/${movieB.id}?language=es`, { headers: HEADERS })
      .then(r => r.json()).then(setDetailB).catch(() => setDetailB(movieB));
  }, [movieB]);

  useEffect(() => {
    if (detailA && detailB) setTimeout(() => setReady(true), 150);
  }, [detailA, detailB]);

  // Radar normalization
  const radarData = useMemo(() => {
    if (!detailA || !detailB) return null;
    const maxPop = Math.max(detailA.popularity, detailB.popularity, 1);
    const maxVotes = Math.max(detailA.vote_count, detailB.vote_count, 1);
    const maxRev = Math.max(detailA.revenue ?? 0, detailB.revenue ?? 0, 1);
    const maxRuntime = Math.max(detailA.runtime ?? 0, detailB.runtime ?? 0, 1);
    const norm = (m) => [
      (m.vote_average ?? 0) / 10,
      (m.popularity   ?? 0) / maxPop,
      (m.vote_count   ?? 0) / maxVotes,
      ((m.revenue     ?? 0)) / maxRev,
      (m.runtime      ?? 0) / maxRuntime,
    ];
    return [norm(detailA), norm(detailB)];
  }, [detailA, detailB]);

  // Winner count
  const winners = useMemo(() => {
    if (!detailA || !detailB) return { a: 0, b: 0 };
    const metrics = [
      [detailA.vote_average, detailB.vote_average],
      [detailA.popularity,   detailB.popularity],
      [detailA.vote_count,   detailB.vote_count],
      [detailA.revenue ?? 0, detailB.revenue ?? 0],
    ];
    let a = 0, b = 0;
    metrics.forEach(([va, vb]) => { if (va > vb) a++; else if (vb > va) b++; });
    return { a, b };
  }, [detailA, detailB]);

  const STATS = detailA && detailB ? [
    { label: 'CALIFICACIÓN',   a: detailA.vote_average,   b: detailB.vote_average,   fmt: v => `★ ${v?.toFixed(1)}` },
    { label: 'POPULARIDAD',    a: detailA.popularity,     b: detailB.popularity,     fmt: v => v?.toFixed(0) },
    { label: 'VOTOS',          a: detailA.vote_count,     b: detailB.vote_count,     fmt: fmtN },
    { label: 'TAQUILLA',       a: detailA.revenue,        b: detailB.revenue,        fmt: fmtM },
    { label: 'PRESUPUESTO',    a: detailA.budget,         b: detailB.budget,         fmt: fmtM },
    { label: 'DURACIÓN',       a: detailA.runtime,        b: detailB.runtime,        fmt: fmtMin },
  ] : [];

  const genresA = new Set(detailA?.genres?.map(g => g.id) ?? []);
  const genresB = new Set(detailB?.genres?.map(g => g.id) ?? []);

  return (
    <Container maxWidth="xl" className="page-enter" sx={{ pt: { xs: 3, md: 5 }, pb: 8 }}>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 0.6 }}>
          <CompareArrowsIcon sx={{ color: '#FFC107', fontSize: 28 }} />
          <Typography sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 900, letterSpacing: '-1.5px', color: '#fff' }}>
            Comparador
          </Typography>
        </Box>
        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', ml: 5 }}>
          Enfrenta dos películas en métricas reales
        </Typography>
      </Box>

      {/* Search boxes */}
      <Box sx={{ display: 'flex', gap: 2, mb: 5, flexWrap: 'wrap' }}>
        <SearchBox label="Película A" color={COLORS[0]} selected={movieA} onSelect={m => { setMovieA(m); }} />
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 900, color: 'rgba(255,255,255,0.2)' }}>VS</Typography>
        </Box>
        <SearchBox label="Película B" color={COLORS[1]} selected={movieB} onSelect={m => { setMovieB(m); }} />
      </Box>

      {/* Placeholder when no selection */}
      {(!movieA || !movieB) && (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <CompareArrowsIcon sx={{ fontSize: 56, color: 'rgba(255,255,255,0.08)', mb: 2 }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem' }}>
            Busca y selecciona dos películas para compararlas
          </Typography>
        </Box>
      )}

      {/* Loading */}
      {movieA && movieB && (!detailA || !detailB) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="warning" size={36} thickness={3} />
        </Box>
      )}

      {/* Comparison */}
      {detailA && detailB && (
        <Box sx={{ animation: 'fadeUp 0.45s var(--ease-spring) both' }}>

          {/* Posters + winner badges */}
          <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { detail: detailA, color: COLORS[0], wins: winners.a, label: 'Película A' },
              { detail: detailB, color: COLORS[1], wins: winners.b, label: 'Película B' },
            ].map(({ detail, color, wins, label }, idx) => (
              <Box key={idx}
                onClick={() => navigate(`/detalle/${detail.id}`)}
                sx={{ cursor: 'pointer', position: 'relative', flex: '0 0 auto', width: { xs: 140, sm: 180, md: 210 }, transition: 'transform 0.22s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <Box component="img" src={`https://image.tmdb.org/t/p/w342${detail.poster_path}`}
                  sx={{ width: '100%', borderRadius: '14px', display: 'block', boxShadow: `0 0 0 3px ${color}66, 0 20px 60px rgba(0,0,0,0.7)` }} />
                {wins > 0 && (
                  <Box sx={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', alignItems: 'center', gap: 0.4,
                    bgcolor: color, color: idx === 0 ? '#000' : '#fff',
                    px: 1.2, py: 0.3, borderRadius: '6px', fontSize: '0.65rem', fontWeight: 800,
                    boxShadow: `0 4px 16px ${color}66`,
                  }}>
                    <EmojiEventsIcon sx={{ fontSize: 12 }} /> {wins} victorias
                  </Box>
                )}
                <Typography sx={{ textAlign: 'center', mt: 1.2, fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                  {detail.title}
                </Typography>
                <Typography sx={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
                  {detail.release_date?.slice(0, 4)} · <span style={{ color: rColor(detail.vote_average) }}>★ {detail.vote_average?.toFixed(1)}</span>
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Radar + stats */}
          <Box sx={{
            bgcolor: 'rgba(255,255,255,0.025)', borderRadius: '18px', p: { xs: 2, md: 4 },
            border: '1px solid rgba(255,255,255,0.06)', mb: 3,
            display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center',
          }}>
            {/* Radar */}
            {radarData && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                <RadarChart valuesA={radarData[0]} valuesB={radarData[1]} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {[detailA, detailB].map((d, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[i] }} />
                      <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {d.title}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Stats */}
            <Box sx={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {STATS.map(s => (
                <StatRow key={s.label} label={s.label} a={s.a} b={s.b} formatFn={s.fmt} ready={ready} />
              ))}
            </Box>
          </Box>

          {/* Genres */}
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.025)', borderRadius: '18px', p: { xs: 2, md: 3 }, border: '1px solid rgba(255,255,255,0.06)' }}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.8px', mb: 1.5 }}>
              GÉNEROS
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {[...new Map([...(detailA?.genres ?? []), ...(detailB?.genres ?? [])].map(g => [g.id, g])).values()].map(g => {
                const inA = genresA.has(g.id), inB = genresB.has(g.id);
                const shared = inA && inB;
                return (
                  <Chip key={g.id} label={g.name} size="small" sx={{
                    bgcolor: shared ? 'rgba(255,255,255,0.12)' : inA ? `${COLORS[0]}18` : `${COLORS[1]}18`,
                    color:   shared ? '#fff' : inA ? COLORS[0] : COLORS[1],
                    border:  `1px solid ${shared ? 'rgba(255,255,255,0.2)' : inA ? `${COLORS[0]}44` : `${COLORS[1]}44`}`,
                    fontSize: '0.72rem', fontWeight: shared ? 700 : 400,
                  }} />
                );
              })}
            </Box>
            <Typography sx={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)', mt: 1.2 }}>
              Blanco = compartido · dorado = solo A · rojo = solo B
            </Typography>
          </Box>
        </Box>
      )}
    </Container>
  );
}
