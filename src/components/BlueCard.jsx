import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Typography,
} from '@mui/material';
import RatingCircle from './RatingCircle';
// import AOS from 'aos';
// import 'aos/dist/aos.css';

export default function BlueCard({ Peliculas }) {
  const navigate = useNavigate();

  if (!Peliculas || Peliculas.length === 0) {
    return null; // O puedes mostrar un mensaje de carga
  }

  // Inicializa AOS una vez que el componente se haya montado

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
      }}
    >
      {Peliculas.map((pelicula) => (
        <Card
          onClick={() => navigate(`/detalle/${pelicula.id}`)}
          key={pelicula.id}
          sx={{
            position: 'relative',
            marginTop: 5,
            maxWidth: 345,
            transition: '0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
            },
            '&:hover .overlay': {
              opacity: 1,
            },
          }}
        >
          <CardActionArea >
            <CardMedia
              component="img"
              image={`https://image.tmdb.org/t/p/original${pelicula.poster_path}`}
              alt={pelicula.title}
              sx={{
                maxWidth: 350,
                height: 'auto',
                objectFit: 'contain',
              }}
            />
            <Box
              className="overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'end',
                alignItems: 'end',
                textAlign: 'justify',
                padding: '10px',
              }}
            >
              <Typography variant="h5">{pelicula.title}</Typography>
              <Typography component="p" variant="body2">
                {pelicula.overview}
              </Typography>
              <RatingCircle rating={pelicula.vote_average} color="#4CAF50" />
            </Box>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}
