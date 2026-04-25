import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TuneIcon           from '@mui/icons-material/Tune';
import BoltIcon           from '@mui/icons-material/Bolt';
import EmojiEmotionsIcon  from '@mui/icons-material/EmojiEmotions';
import NightlifeIcon      from '@mui/icons-material/Nightlife';
import RocketLaunchIcon   from '@mui/icons-material/RocketLaunch';
import FavoriteIcon       from '@mui/icons-material/Favorite';
import PsychologyIcon     from '@mui/icons-material/Psychology';

const MOODS = [
  { label: 'Acción pura',      sub: 'Adrenalina al máximo',    genreId: 28,    Icon: BoltIcon,          color: '#E53935', bg: 'rgba(229,57,53,0.1)',    border: 'rgba(229,57,53,0.3)'   },
  { label: 'Para reír',        sub: 'Comedias y más',           genreId: 35,    Icon: EmojiEmotionsIcon, color: '#FFC107', bg: 'rgba(255,193,7,0.08)',   border: 'rgba(255,193,7,0.3)'   },
  { label: 'Noche de terror',  sub: 'Suspenso y horror',        genreId: 27,    Icon: NightlifeIcon,     color: '#9C27B0', bg: 'rgba(156,39,176,0.1)',   border: 'rgba(156,39,176,0.3)'  },
  { label: 'Ciencia ficción',  sub: 'Futuros posibles',         genreId: 878,   Icon: RocketLaunchIcon,  color: '#00BCD4', bg: 'rgba(0,188,212,0.08)',   border: 'rgba(0,188,212,0.3)'   },
  { label: 'Historia de amor', sub: 'Romance y drama',          genreId: 10749, Icon: FavoriteIcon,      color: '#E91E63', bg: 'rgba(233,30,99,0.08)',   border: 'rgba(233,30,99,0.3)'   },
  { label: 'Para reflexionar', sub: 'Drama e historias reales', genreId: 18,    Icon: PsychologyIcon,    color: '#4CAF50', bg: 'rgba(76,175,80,0.08)',   border: 'rgba(76,175,80,0.3)'   },
];

export default function MoodRow() {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <TuneIcon sx={{ color: '#FFC107', fontSize: 18 }} />
        <Typography className="section-title"
          sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>
          ¿Qué quieres ver hoy?
        </Typography>
      </Box>

      <Box className="scale-stagger" sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
        gap: 1.2,
      }}>
        {MOODS.map(m => (
          <Box
            key={m.genreId}
            onClick={() => navigate('/categorias')}
            sx={{
              position: 'relative',
              bgcolor: m.bg,
              border: `1px solid ${m.border}`,
              borderRadius: '12px',
              p: { xs: 1.6, md: 2 },
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: `0 12px 32px ${m.bg.replace('0.0', '0.2').replace('0.1', '0.25')}`,
              },
              '&:hover .mood-icon': { transform: 'scale(1.15)', opacity: 1 },
            }}
          >
            {/* Background glow */}
            <Box sx={{
              position: 'absolute', top: -20, right: -20,
              width: 80, height: 80, borderRadius: '50%',
              background: m.color, opacity: 0.06, filter: 'blur(20px)',
              pointerEvents: 'none',
            }} />

            <Box className="mood-icon" sx={{
              color: m.color, mb: 1, opacity: 0.85,
              transition: 'transform 0.25s, opacity 0.25s',
              display: 'flex',
            }}>
              <m.Icon sx={{ fontSize: { xs: 22, md: 26 } }} />
            </Box>

            <Typography sx={{ fontSize: { xs: '0.8rem', md: '0.85rem' }, fontWeight: 700, color: '#fff', lineHeight: 1.2, mb: 0.4 }}>
              {m.label}
            </Typography>
            <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.3 }}>
              {m.sub}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
