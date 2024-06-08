import React, { useState } from 'react';
import { Container, Typography, TextField, Box, Grid, Button, Collapse, Alert } from '@mui/material';
import BlueCard from '../components/BlueCard';
import MovieIcon from '@mui/icons-material/Movie';

function Inicio({ Peliculas }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchTerm) {
      fetch(`http://localhost:5000/buscarPelicula/${searchTerm}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.results!=0) {
            setSearchResults(data.results);
            setBusquedaRealizada(true);
            
          }else{
            setMostrarAlerta(true);
            setTimeout(() => {
              setMostrarAlerta(false);
            }, 3000); 
          }
        })
        .catch((error) => {
          console.error('Error al obtener películas:', error);
        });
    } else {

      setMostrarAlerta(true);
      console.log("Hola")
      setTimeout(() => {
        setMostrarAlerta(false);
      }, 3000); // Ocultar la alerta después de 3 segundos
    }
  };

  return (
    <Container maxWidth="xl">

      <Grid container spacing={2}>

        <Grid item xs={12} md={6}>
          <Typography variant="h3" component="h1">Lista de películas</Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <TextField
            label="Buscar película"
            color="warning"
            value={searchTerm}
            sx={{
              width: 300,
              '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFC107', // Color del borde del input
              },
              '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFC107', // Color del borde del input al pasar el cursor
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFC107', // Color del borde del input cuando está enfocado
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#FFC107', // Color del label cuando está enfocado
              },
            }}
            onChange={handleSearchChange}
          />
          <Button
            variant="outlined"
            color="warning"
            startIcon={<MovieIcon />}
            onClick={handleSearchClick}
          >
            Buscar Película
          </Button>
        </Grid>
      </Grid>
      <Box mt={2}>
        <Collapse in={mostrarAlerta} timeout={1000}>
          <div style={{ top: 80, right: 10 }}>
            <Alert variant="filled" severity="warning">Por favor, Ingrese bien el nombre de la pelicula</Alert>
          </div>
        </Collapse>
        {busquedaRealizada ? <BlueCard Peliculas={searchResults} /> : <BlueCard Peliculas={Peliculas} />}
      </Box>
    </Container>
  );
}

export default Inicio;
