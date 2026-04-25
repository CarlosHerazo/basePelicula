import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MicIcon from '@mui/icons-material/Mic';
import MovieIcon from '@mui/icons-material/Movie';

const API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68";
const HEADERS = { 'Content-Type': 'application/json', Authorization: API_TOKEN };

const deptIcon = (dept) => {
  if (dept === 'Acting') return <MovieIcon sx={{ fontSize: 9 }} />;
  if (dept === 'Directing') return <MicIcon sx={{ fontSize: 9 }} />;
  return null;
};

const deptLabel = (dept) => {
  if (dept === 'Acting') return 'Actor/Actriz';
  if (dept === 'Directing') return 'Director/a';
  if (dept === 'Writing') return 'Guionista';
  return dept ?? '';
};

export function TrendingActorsSkeleton() {
  return (
    <Box sx={{ mb: 5 }}>
      <Box className="skeleton" sx={{ width: 200, height: 22, borderRadius: '6px', mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 2.5 }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            <Box className="skeleton" sx={{ width: 80, height: 80, borderRadius: '50%' }} />
            <Box className="skeleton" sx={{ width: 68, height: 11, borderRadius: '4px' }} />
            <Box className="skeleton" sx={{ width: 50, height: 9, borderRadius: '4px' }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function TrendingActors() {
  const [actors, setActors] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/trending/person/week?language=es', { headers: HEADERS })
      .then(r => r.json())
      .then(data => {
        setActors((data.results ?? []).filter(p => p.profile_path).slice(0, 14));
        setLoaded(true);
      })
      .catch(console.error);
  }, []);

  if (!loaded) return <TrendingActorsSkeleton />;
  if (!actors.length) return null;

  return (
    <Box sx={{ mb: 5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <PeopleAltIcon sx={{ color: '#FFC107', fontSize: 18 }} />
        <Typography className="section-title"
          sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>
          Personas del momento
        </Typography>
      </Box>

      <Box className="avatar-stagger" sx={{
        display: 'flex', gap: 2.5, overflowX: 'auto', pb: 1,
        '&::-webkit-scrollbar': { height: 3 },
        '&::-webkit-scrollbar-thumb': { background: 'rgba(255,193,7,0.22)', borderRadius: 2 },
      }}>
        {actors.map(actor => (
          <Box
            key={actor.id}
            sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 0.7, flexShrink: 0,
              '&:hover .actor-img': { transform: 'scale(1.07)', borderColor: '#FFC107' },
              '&:hover .actor-name': { color: '#FFC107' },
            }}
          >
            <Box
              className="actor-img"
              component="img"
              src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
              alt={actor.name}
              loading="lazy"
              sx={{
                width: { xs: 72, sm: 80, md: 88 },
                height: { xs: 72, sm: 80, md: 88 },
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(255,255,255,0.08)',
                transition: 'transform 0.28s ease, border-color 0.28s ease',
              }}
            />
            <Typography className="actor-name" sx={{
              fontSize: '0.7rem', color: 'rgba(255,255,255,0.65)',
              textAlign: 'center', width: { xs: 76, md: 90 },
              lineHeight: 1.3, transition: 'color 0.2s',
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {actor.name}
            </Typography>
            {actor.known_for_department && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: 'rgba(255,255,255,0.28)' }}>
                {deptIcon(actor.known_for_department)}
                <Typography sx={{ fontSize: '0.6rem' }}>
                  {deptLabel(actor.known_for_department)}
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
