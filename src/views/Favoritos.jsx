import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useFav } from '../context/FavoritesContext';
import BlueCard from '../components/BlueCard';

export default function Favoritos() {
  const { favorites } = useFav();

  return (
    <Container maxWidth="xl" sx={{ pt: 12, pb: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <FavoriteIcon sx={{ color: '#E50914', fontSize: 28 }} />
        <Typography component="h1" className="section-title" sx={{ fontSize: { xs: '1.25rem', md: '1.45rem' }, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
          Mis Favoritos
        </Typography>
      </Box>

      {favorites.length === 0 ? (
        <Box sx={{
          textAlign: 'center',
          py: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}>
          <FavoriteIcon sx={{ fontSize: 72, color: 'rgba(255,255,255,0.08)' }} />
          <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
            Aún no tienes favoritos
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.2)', maxWidth: 360 }}>
            Haz clic en el corazón de cualquier película para guardarla aquí.
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.35)', mb: 2 }}>
            {favorites.length} {favorites.length === 1 ? 'película guardada' : 'películas guardadas'}
          </Typography>
          <BlueCard Peliculas={favorites} />
        </>
      )}
    </Container>
  );
}
