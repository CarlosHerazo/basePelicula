import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import ViewModuleIcon          from '@mui/icons-material/ViewModule';
import MovieFilterIcon         from '@mui/icons-material/MovieFilter';

const API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68";
const HEADERS = { 'Content-Type': 'application/json', Authorization: API_TOKEN };

const COLLECTION_IDS = [
  9485,   // Fast & Furious
  1241,   // Harry Potter
  119,    // El Señor de los Anillos
  645,    // James Bond
  87359,  // Misión Imposible
  404609, // John Wick
  295,    // Piratas del Caribe
  10194,  // Toy Story
  33751,  // El Hobbit
  2150,   // Alien
  8091,   // Terminator
  9746,   // Indiana Jones
  422837, // Jurassic World
  1709,   // Die Hard
  556,    // Spider-Man (Raimi)
  131292, // Thor
  86311,  // The Avengers
  263,    // Batman
];

export default function Colecciones() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    Promise.all(
      COLLECTION_IDS.map(id =>
        fetch(`https://api.themoviedb.org/3/collection/${id}?language=es`, { headers: HEADERS })
          .then(r => r.json())
          .catch(() => null)
      )
    ).then(results => {
      setCollections(results.filter(c => c && c.backdrop_path));
      setLoading(false);
    });
  }, []);

  return (
    <Container maxWidth="xl" className="page-enter" sx={{ pt: 10, pb: 6 }}>

      {/* ── Header ── */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <MovieFilterIcon sx={{ color: '#FFC107', fontSize: 28 }} />
          <Typography component="h1"
            sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
            Sagas &amp; Franquicias
          </Typography>
        </Box>
        <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.85rem', ml: 5 }}>
          Las colecciones cinematográficas más icónicas
        </Typography>
      </Box>

      {/* ── Loading ── */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress color="warning" size={40} thickness={3} />
        </Box>
      )}

      {/* ── Grid ── */}
      {!loading && (
        <Box className="scale-stagger" sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 2,
        }}>
          {collections.map(col => (
            <CollectionCard key={col.id} col={col} onClick={() => navigate(`/colecciones/${col.id}`)} />
          ))}
        </Box>
      )}
    </Container>
  );
}

function CollectionCard({ col, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        aspectRatio: '16 / 9',
        cursor: 'pointer',
        '&:hover .cc-img': { transform: 'scale(1.07)' },
        '&:hover .cc-overlay': {
          background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.1) 100%)',
        },
        '&:hover .cc-badge': { bgcolor: '#FFC107', color: '#000' },
        transition: 'box-shadow 0.3s',
        '&:hover': { boxShadow: '0 16px 48px rgba(0,0,0,0.7)' },
      }}
    >
      {/* Backdrop */}
      <Box
        className="cc-img"
        component="img"
        src={`https://image.tmdb.org/t/p/w780${col.backdrop_path}`}
        alt={col.name}
        loading="lazy"
        sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.45s ease' }}
      />

      {/* Gradient overlay */}
      <Box className="cc-overlay" sx={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
        transition: 'background 0.3s',
      }} />

      {/* Content */}
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: { xs: 1.5, md: 2 } }}>
        <Typography sx={{
          fontSize: { xs: '0.88rem', md: '0.95rem' }, fontWeight: 800,
          color: '#fff', lineHeight: 1.2, mb: 0.6,
          textShadow: '0 2px 10px rgba(0,0,0,0.8)',
        }}>
          {col.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {col.parts?.length > 0 && (
            <Box className="cc-badge" sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.5,
              bgcolor: 'rgba(255,193,7,0.15)',
              border: '1px solid rgba(255,193,7,0.4)',
              color: '#FFC107', fontSize: '0.62rem', fontWeight: 700,
              px: 1, py: 0.25, borderRadius: '4px',
              transition: 'all 0.2s',
            }}>
              <ViewModuleIcon sx={{ fontSize: 10 }} />
              {col.parts.length} {col.parts.length === 1 ? 'película' : 'películas'}
            </Box>
          )}
          <Box sx={{
            fontSize: '0.62rem', fontWeight: 600,
            color: 'rgba(255,255,255,0.35)',
            border: '1px solid rgba(255,255,255,0.15)',
            px: 1, py: 0.25, borderRadius: '4px',
          }}>
            Ver saga →
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
