import React, { useState } from 'react';
import { Button, Container, Typography, Collapse, Alert } from '@mui/material';
import SelectionP from '../components/SelectionP';
import BlueCard from '../components/BlueCard';

export default function CategoriasPelis({ Peliculas }) {
    const [generoSeleccionado, setGeneroSeleccionado] = useState('');
    const [peliculas, setPeliculas] = useState([]);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    const handleSearch = () => {
        if (generoSeleccionado) {
            fetch(`http://localhost:5000/categoriaPelicula/${generoSeleccionado}`)
                .then((res) => res.json())
                .then((data) => {
                    setPeliculas(data.results);
                    setBusquedaRealizada(true);
                })
                .catch((error) => {
                    console.error('Error al obtener películas:', error);
                });
        } else {
            setMostrarAlerta(true);
            setTimeout(() => {
                setMostrarAlerta(false);
            }, 3000); // Ocultar la alerta después de 3 segundos
        }
    };

    const handleSelectChange = (event) => {
        setGeneroSeleccionado(event.target.value);
    };

    return (
        <Container maxWidth="xl">
            <Typography variant="h3" component="h1">Categorias</Typography>
            <Collapse in={mostrarAlerta} timeout={1000}>
                <div style={{ top: 80, right: 10 }}>
                    <Alert variant="filled" severity="warning">Por favor, seleccione un género.</Alert>
                </div>
            </Collapse>
            <SelectionP onSelectChange={handleSelectChange} />
            <Button onClick={handleSearch} variant="contained" color="primary">Buscar</Button>
            
            <Container>
                {busquedaRealizada ? <BlueCard Peliculas={peliculas} /> : <BlueCard Peliculas={Peliculas} />}
            </Container>
            
        </Container>
    );
}
