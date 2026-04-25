import React, { useState, useEffect } from 'react'
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BlueCard from '../components/BlueCard'
import SkeletonCard from '../components/SkeletonCard'

const API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68";
const HEADERS  = { accept: 'application/json', Authorization: API_TOKEN };

function Tendencias({ PeliTendencias }) {
  const [allMovies,   setAllMovies]   = useState([]);
  const [page,        setPage]        = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore,     setHasMore]     = useState(true);

  useEffect(() => {
    if (PeliTendencias) { setAllMovies(PeliTendencias); setPage(1); setHasMore(true); }
  }, [PeliTendencias]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res  = await fetch(`https://api.themoviedb.org/3/trending/movie/day?language=es&page=${nextPage}`, { headers: HEADERS });
      const data = await res.json();
      if (data.results?.length) {
        setAllMovies(prev => [...prev, ...data.results]);
        setPage(nextPage);
        if (nextPage >= data.total_pages) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error cargando más tendencias:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ pt: 10, pb: 5 }}>
      <Typography component="h1" className="section-title" sx={{ fontSize: { xs: '1.25rem', md: '1.45rem' }, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
        Tendencias
      </Typography>

      {!allMovies?.length
        ? <SkeletonCard count={12} />
        : <BlueCard Peliculas={allMovies} />
      }

      {hasMore && allMovies?.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <Button
            onClick={loadMore}
            disabled={loadingMore}
            variant="outlined"
            startIcon={loadingMore ? <CircularProgress size={16} color="inherit" /> : <ExpandMoreIcon />}
            sx={{
              borderColor: 'rgba(255,193,7,0.35)', color: '#FFC107',
              px: 5, py: 1.2, fontSize: '0.9rem',
              '&:hover': { borderColor: '#FFC107', bgcolor: 'rgba(255,193,7,0.07)', transform: 'translateY(-1px)' },
              '&.Mui-disabled': { color: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.08)' },
              transition: 'all 0.2s',
            }}
          >
            {loadingMore ? 'Cargando…' : 'Cargar más tendencias'}
          </Button>
        </Box>
      )}
    </Container>
  )
}

export default Tendencias
