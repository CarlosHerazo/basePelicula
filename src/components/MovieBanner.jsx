import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, Backdrop, Fade, Alert } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MovieIcon from '@mui/icons-material/Movie';
import TrailerYoutube from './TrailerYoutube';

const MovieBanner = ({ Peliculas }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerKey, setTrailerKey] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [disableChange, setDisableChange] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!openModal) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % Peliculas.length);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [Peliculas, openModal]);

  const handleCloseModal = () => {
    setOpenModal(false);
    setTrailerKey('');
    setDisableChange(false);
  };

  const AbrirTrailer = async (idMovie) => {
    try {
      const url = `https://api.themoviedb.org/3/movie/${idMovie}/videos?language=en-US`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68"
        },
      });
      const data = await response.json();
      let trailerKey = null;
      for (let i = 0; i < data.results.length; i++) {
        if (data.results[i].name.includes("Official Trailer")) {
          trailerKey = data.results[i].key;
          break;
        } else {
          if (trailerKey != 0) {
            trailerKey = data.results[0].key;
          } else {
            return <Alert severity="warning">Esta película no tiene trailer oficial.</Alert>;
          }
        }
      }

      if (trailerKey != 0) {
        setTrailerKey(trailerKey);
        setOpenModal(true);
        setDisableChange(true);
      } else {
        return <Alert severity="warning">Esta película no tiene trailer oficial.</Alert>;
      }
    } catch (error) {
      console.error("Error al obtener el trailer:", error);
    }
  };

  if (!Peliculas || Peliculas.length === 0) {
    return null;
  }

  const pelicula = Peliculas[currentIndex];

  return (
    <Box
      className="ImgBanner"
      key={pelicula.id}
      sx={{
        width: '100%',
        height: '60vh',
        backgroundImage: `url(https://image.tmdb.org/t/p/original${pelicula.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'space-between',
        color: 'white',
        textAlign: 'left',
        padding: 2,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          padding: 2,
        }}
      >
        <Typography
          variant="h2"
          component="div"
          sx={{
            fontWeight: 'bold',
          }}
        >
          {pelicula.title}
        </Typography>
        <Typography
          variant="body1"
          component="div"
          sx={{
            marginTop: 1,
          }}
        >
          {pelicula.overview}
        </Typography>
        <div>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrowIcon />}
            sx={{ marginRight: 2 }}
          >
            Ver Ahora
          </Button>
          <Button
            key={pelicula.id}
            variant="outlined"
            color="warning"
            startIcon={<MovieIcon />}
            onClick={() => AbrirTrailer(pelicula.id)}
          >
            Ver Tráiler
          </Button>
        </div>
      </Box>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="trailer-modal-title"
        aria-describedby="trailer-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <TrailerYoutube trailerKey={trailerKey} />
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default MovieBanner;
