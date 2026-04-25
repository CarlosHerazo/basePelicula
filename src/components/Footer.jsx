import React from 'react';
import { Box, Container, Divider, Link, Typography } from '@mui/material';

const Footer = () => (
  <Box
    component="footer"
    sx={{
      backgroundColor: '#0A0A0A',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      mt: 10,
      pt: 5,
      pb: 3,
    }}
  >
    <Container maxWidth="xl">
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          justifyContent: { xs: 'center', md: 'space-between' },
          textAlign: { xs: 'center', md: 'left' },
          mb: 4,
        }}
      >
        {/* Brand */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.5px',
              background: 'linear-gradient(135deg, #FFC107 0%, #FF8F00 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            PeliHz
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', maxWidth: 220, lineHeight: 1.6 }}>
            Tu plataforma para descubrir, explorar y disfrutar el cine.
          </Typography>
        </Box>

        {/* Links */}
        <Box>
          <Typography variant="caption" sx={{ color: '#FFC107', fontWeight: 700, letterSpacing: '1.5px', mb: 1.5, display: 'block' }}>
            RECURSOS
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <Link
              href="https://www.themoviedb.org/"
              target="_blank" rel="noopener noreferrer"
              underline="hover"
              sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', '&:hover': { color: '#FFC107' }, transition: 'color 0.2s' }}
            >
              The Movie Database (TMDB)
            </Link>
          </Box>
        </Box>

        {/* Contact */}
        <Box>
          <Typography variant="caption" sx={{ color: '#FFC107', fontWeight: 700, letterSpacing: '1.5px', mb: 1.5, display: 'block' }}>
            CONTACTO
          </Typography>
          <Link
            href="mailto:Herazodev@gmail.com"
            underline="hover"
            sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', '&:hover': { color: '#FFC107' }, transition: 'color 0.2s' }}
          >
            Herazodev@gmail.com
          </Link>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 3 }} />

      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)', display: 'block', textAlign: 'center', letterSpacing: '0.5px' }}>
        © {new Date().getFullYear()} PeliHz. Datos proporcionados por TMDB. Todos los derechos reservados.
      </Typography>
    </Container>
  </Box>
);

export default Footer;
