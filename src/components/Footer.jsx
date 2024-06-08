import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#212121',
        color: '#fff',
        textAlign: 'end',
        padding: 5,
        marginTop: 10,
      }}
    >
      <Typography variant="h6" gutterBottom>
        ¡Síguenos en las redes sociales!
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'end', marginBottom: '15px' }}>
        <Link href="https://www.themoviedb.org/" color="inherit" sx={{ marginRight: '10px' }}>
        The Movie Database (TMDB)
        </Link>
      </Box>
      <Typography variant="body2" gutterBottom>
        Contáctanos: Herazodev@gmail.com
      </Typography>
      <Typography variant="body2">
        © {new Date().getFullYear()} THEMOVIEBD. Todos los derechos reservados.
      </Typography>
    </Box>
  );
};

export default Footer;
