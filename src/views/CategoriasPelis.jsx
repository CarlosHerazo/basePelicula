import React, { useState } from 'react';
import { Button, Container, Typography, Collapse, Alert, Box, CircularProgress } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SelectionP from '../components/SelectionP';
import BlueCard from '../components/BlueCard';
import SkeletonCard from '../components/SkeletonCard';

const API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68";
const HEADERS  = { accept: 'application/json', Authorization: API_TOKEN };

export default function CategoriasPelis({ Peliculas }) {
  const [generoSeleccionado, setGeneroSeleccionado] = useState('');
  const [peliculas,          setPeliculas]          = useState([]);
  const [page,               setPage]               = useState(1);
  const [busquedaRealizada,  setBusquedaRealizada]  = useState(false);
  const [loadingSearch,      setLoadingSearch]      = useState(false);
  const [loadingMore,        setLoadingMore]        = useState(false);
  const [mostrarAlerta,      setMostrarAlerta]      = useState(false);
  const [hasMore,            setHasMore]            = useState(false);

  const handleSearch = async () => {
    if (!generoSeleccionado) {
      setMostrarAlerta(true);
      setTimeout(() => setMostrarAlerta(false), 3000);
      return;
    }
    setLoadingSearch(true);
    try {
      const res  = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${generoSeleccionado}&language=es&page=1`, { headers: HEADERS });
      const data = await res.json();
      setPeliculas(data.results ?? []);
      setPage(1);
      setBusquedaRealizada(true);
      setHasMore(data.page < data.total_pages);
    } catch (err) {
      console.error('Error al obtener películas:', err);
    } finally {
      setLoadingSearch(false);
    }
  };

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res  = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${generoSeleccionado}&language=es&page=${nextPage}`, { headers: HEADERS });
      const data = await res.json();
      if (data.results?.length) {
        setPeliculas(prev => [...prev, ...data.results]);
        setPage(nextPage);
        if (nextPage >= data.total_pages) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error cargando más:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const clearSearch = () => {
    setBusquedaRealizada(false);
    setPeliculas([]);
    setHasMore(false);
    setGeneroSeleccionado('');
  };

  const displayedMovies = busquedaRealizada ? peliculas : Peliculas;

  return (
    <Container maxWidth="xl" sx={{ pt: 10, pb: 5 }}>
      <Typography component="h1" className="section-title" sx={{ mb: 3, fontSize: { xs: '1.25rem', md: '1.45rem' }, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
        Categorías
      </Typography>

      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
        <SelectionP onSelectChange={e => setGeneroSeleccionado(e.target.value)} />
        <Button
          variant="contained"
          startIcon={loadingSearch ? <CircularProgress size={16} color="inherit" /> : <FilterListIcon />}
          onClick={handleSearch}
          disabled={loadingSearch}
          sx={{
            bgcolor: '#FFC107', color: '#000', fontWeight: 700, px: 3, py: 1,
            '&:hover': { bgcolor: '#FFD54F', transform: 'scale(1.02)' },
            '&.Mui-disabled': { bgcolor: 'rgba(255,193,7,0.3)', color: 'rgba(0,0,0,0.4)' },
            transition: 'all 0.2s',
          }}
        >
          {loadingSearch ? 'Buscando…' : 'Filtrar'}
        </Button>
        {busquedaRealizada && (
          <Button variant="text" size="small" onClick={clearSearch}
            sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', '&:hover': { color: '#FFC107' } }}>
            Limpiar
          </Button>
        )}
      </Box>

      <Collapse in={mostrarAlerta} timeout={800}>
        <Alert variant="outlined" severity="warning"
          sx={{ mb: 2, bgcolor: 'rgba(255,193,7,0.07)', borderColor: 'rgba(255,193,7,0.4)', color: '#FFC107' }}>
          Por favor, selecciona un género.
        </Alert>
      </Collapse>

      {loadingSearch
        ? <SkeletonCard count={12} />
        : <BlueCard Peliculas={displayedMovies} />
      }

      {/* Load more — only when genre is filtered */}
      {busquedaRealizada && hasMore && !loadingSearch && (
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
            {loadingMore ? 'Cargando…' : 'Cargar más películas'}
          </Button>
        </Box>
      )}
    </Container>
  );
}
