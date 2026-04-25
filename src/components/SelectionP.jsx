import React, { useState } from 'react';
import { Select, MenuItem, FormControl } from '@mui/material';

const generos = {
  "Acción":          28,
  "Aventura":        12,
  "Animación":       16,
  "Comedia":         35,
  "Crimen":          80,
  "Drama":           18,
  "Familia":         10751,
  "Fantasía":        14,
  "Terror":          27,
  "Misterio":        9648,
  "Romance":         10749,
  "Ciencia ficción": 878,
};

function SelectionP({ onSelectChange }) {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    onSelectChange(e);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <Select
        value={value}
        onChange={handleChange}
        displayEmpty
        sx={{
          color: value ? '#fff' : 'rgba(255,255,255,0.4)',
          bgcolor: '#161616',
          fontSize: '0.9rem',
          '& .MuiSelect-icon': { color: 'rgba(255,193,7,0.7)' },
        }}
      >
        <MenuItem value="" disabled sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
          Selecciona un género
        </MenuItem>
        {Object.entries(generos).map(([nombre, id]) => (
          <MenuItem key={id} value={id} sx={{ fontSize: '0.9rem' }}>
            {nombre}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SelectionP;
