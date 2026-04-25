import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

const API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68";
const HEADERS = { 'Content-Type': 'application/json', Authorization: API_TOKEN };

const COLLECTION_IDS = [9485, 1241, 119, 645, 87359, 404609, 295, 10194, 86311, 131296];

export function CollectionRowSkeleton() {
  return (
    <Box sx={{ mb: 5 }}>
      <Box className="skeleton" sx={{ width: 180, height: 22, borderRadius: '6px', mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Box key={i} className="skeleton" sx={{ width: 220, height: 130, borderRadius: '10px', flexShrink: 0 }} />
        ))}
      </Box>
    </Box>
  );
}

export default function CollectionRow() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all(
      COLLECTION_IDS.map(id =>
        fetch(`https://api.themoviedb.org/3/collection/${id}?language=es`, { headers: HEADERS })
          .then(r => r.json())
          .catch(() => null)
      )
    ).then(results => {
      setCollections(results.filter(c => c && c.backdrop_path));
      setLoaded(true);
    });
  }, []);

  if (!loaded) return <CollectionRowSkeleton />;
  if (!collections.length) return null;

  return (
    <Box sx={{ mb: 5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <CollectionsBookmarkIcon sx={{ color: '#FFC107', fontSize: 18 }} />
        <Typography className="section-title"
          sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>
          Sagas y franquicias
        </Typography>
      </Box>

      <Box sx={{
        display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1,
        '&::-webkit-scrollbar': { height: 3 },
        '&::-webkit-scrollbar-thumb': { background: 'rgba(255,193,7,0.22)', borderRadius: 2 },
      }}>
        {collections.map(col => (
          <Box
            key={col.id}
            onClick={() => navigate(`/colecciones/${col.id}`)}
            sx={{
              position: 'relative',
              width: { xs: 200, sm: 230, md: 260 },
              height: { xs: 116, sm: 133, md: 150 },
              flexShrink: 0,
              borderRadius: '10px',
              overflow: 'hidden',
              cursor: 'pointer',
              '&:hover .col-img': { transform: 'scale(1.06)' },
              '&:hover .col-overlay': { background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' },
            }}
          >
            <Box
              className="col-img"
              component="img"
              src={`https://image.tmdb.org/t/p/w500${col.backdrop_path}`}
              alt={col.name}
              loading="lazy"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
            />

            {/* Gradient */}
            <Box className="col-overlay" sx={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)',
              transition: 'background 0.3s',
            }} />

            {/* Info */}
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: { xs: 1.2, md: 1.5 } }}>
              <Typography sx={{
                fontSize: { xs: '0.75rem', md: '0.82rem' }, fontWeight: 700,
                color: '#fff', lineHeight: 1.2, mb: 0.4,
                textShadow: '0 1px 8px rgba(0,0,0,0.8)',
              }}>
                {col.name}
              </Typography>
              {col.parts?.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,193,7,0.85)' }}>
                  <ViewModuleIcon sx={{ fontSize: 11 }} />
                  <Typography sx={{ fontSize: '0.62rem', fontWeight: 600 }}>
                    {col.parts.length} {col.parts.length === 1 ? 'película' : 'películas'}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
