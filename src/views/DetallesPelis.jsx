import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Grid, Card, CardMedia, Typography, Box, Chip, Link, Modal, Fade, Button, Backdrop, CircularProgress } from '@mui/material';
import RatingCircle from '../components/RatingCircle';
import MovieIcon from '@mui/icons-material/Movie';
import TrailerYoutube from '../components/TrailerYoutube'; // Asegúrate de importar TrailerYoutube desde su ubicación correcta

export default function DetallesPelis() {
    const { id } = useParams();
    const [pelicula, setPelicula] = useState(null);
    const [error, setError] = useState(null);
    const [trailerKey, setTrailerKey] = useState('');
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:5000/peliculaDetalle/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch');
                }
                return res.json();
            })
            .then((data) => {
                setPelicula(data);
            })
            .catch((error) => {
                setError(error.message);
            });
    }, [id]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!pelicula) {
        return <div>
            <h1>Extrayendo informacion</h1>
            <CircularProgress color="warning" />
        </div>
    }

    const handleCloseModal = () => {
        setOpenModal(false);
        setTrailerKey('');
    };

    const AbrirTrailer = async (idMovie) => {
        try {
            const url = `http://127.0.0.1:5000/moviesVideo/${idMovie}`;
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            // Buscar el trailer oficial
            let trailerKey = null;
            for (let i = 0; i < data.results.length; i++) {
                if (data.results[i].name.includes("Official Trailer")) {
                    trailerKey = data.results[i].key;
                    break; // Termina el bucle una vez que se encuentra el trailer oficial
                } else {
                    trailerKey = data.results[0].key;
                }
            }

            if (trailerKey) {
                setTrailerKey(trailerKey);
                setOpenModal(true);
            } else {
                // Si no se encuentra el trailer oficial, mostrar una alerta o manejarlo de acuerdo a tu aplicación
                console.warn("Esta película no tiene trailer oficial.");
            }
        } catch (error) {
            console.error("Error al obtener el trailer:", error);
            // También puedes mostrar una alerta aquí si hay un error en la solicitud
        }
    };

    return (
        <Container maxWidth="lg" sx={{ marginTop: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
                Detalles de la película
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ maxWidth: 450 }}>
                        <CardMedia
                            component="img"
                            image={`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`}
                            alt={pelicula.title}
                            sx={{ maxWidth: 450, height: 'auto', objectFit: 'contain' }}
                        />
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" component="h2" gutterBottom>
                        {pelicula.title}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        {pelicula.tagline}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Descripción:</strong> {pelicula.overview}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Día de lanzamiento:</strong> {pelicula.release_date}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Presupuesto:</strong> ${pelicula.budget}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Ingresos:</strong> ${pelicula.revenue}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Duración:</strong> {pelicula.runtime} minutes
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>IMDB ID:</strong>{' '}
                        <Link href={`https://www.imdb.com/title/${pelicula.imdb_id}`} color="inherit" target="_blank" rel="noopener noreferrer">
                            {pelicula.imdb_id}
                        </Link>
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Página Principal:</strong>{' '}
                        <Link href={pelicula.homepage} color="inherit" target="_blank" rel="noopener noreferrer">
                            {pelicula.homepage}
                        </Link>
                    </Typography>
                    <Box mt={2}>
                        <Typography variant="body1">
                            <strong>Géneros:</strong>
                        </Typography>
                        <Box display="flex" flexWrap="wrap">
                            {pelicula.genres.map((genre) => (
                                <Chip key={genre.id} label={genre.name} variant="outlined" sx={{ marginRight: 1, marginBottom: 1 }} />
                            ))}
                        </Box>
                    </Box>
                    <Box mt={2}>
                        <Typography variant="body1">
                            <strong>Compañías de producción</strong>
                        </Typography>
                        <Box display="flex" flexWrap="wrap">
                            {pelicula.production_companies.map((company) => (
                                <Chip key={company.id} label={company.name} color="warning" variant="outlined" sx={{ marginRight: 1, marginBottom: 1 }} />
                            ))}
                        </Box>
                    </Box>
                    <Box mt={2}>
                        <Typography variant="body1">
                            <strong>Votaciones</strong>
                        </Typography>
                        <Box display="flex" flexWrap="wrap" sx={{ alignItems: 'center', gap: "50px" }}>
                            <RatingCircle rating={pelicula.vote_average} color="#4CAF50" title="Promedio de votos" />
                            <RatingCircle rating={pelicula.vote_count} color="#FFC107" title="Número de votos" />
                        </Box>
                        <Button
                            key={pelicula.id}
                            variant="outlined"
                            color="warning"
                            startIcon={<MovieIcon />}
                            onClick={() => AbrirTrailer(pelicula.id)}
                        >
                            Ver Tráiler
                        </Button>
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
                </Grid>
            </Grid>
        </Container>
    );
}
