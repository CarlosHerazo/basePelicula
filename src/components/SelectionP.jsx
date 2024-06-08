import React, { useState } from 'react';
import { Select, MenuItem } from '@mui/material';

function SelectionP({ onSelectChange }) {
    const [generoSeleccionado, setGeneroSeleccionado] = useState('');

    const handleSelectChange = (event) => {
        setGeneroSeleccionado(event.target.value);
        onSelectChange(event); // Llama a la función onSelectChange con el evento para manejar los cambios de selección en el componente padre
    };

    const generos = {
        "Acción": 28,
        "Aventura": 12,
        "Animación": 16,
        "Comedia": 35,
        "Crimen": 80,
        "Drama": 18,
        "Familia": 10751,
        "Fantasía": 14,
        "Terror": 27,
        "Misterio": 9648,
        "Romance": 10749,
        "Ciencia ficción": 878,
    };

    return (
        <Select
            value={generoSeleccionado}
            onChange={handleSelectChange}
            variant="outlined"
            style={{
                minWidth: 200,
                '&:hover': {
                    color: 'black' // Cambiar el color del texto al pasar el ratón por encima
                }
            }}
        >
            <MenuItem value="">Selecciona un género</MenuItem>
            {Object.keys(generos).map((genero) => (
                <MenuItem key={genero} value={generos[genero]}>
                    {genero}
                </MenuItem>
            ))}
        </Select>
    );
}

export default SelectionP;
