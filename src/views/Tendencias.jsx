import React from 'react'
import BlueCard from '../components/BlueCard'
import Typography from '@mui/material/Typography'

function Tendencias({ PeliTendencias }) {
  return (
    <>
      <Typography variant="h3" component="h1">Tendencias</Typography>
      <BlueCard Peliculas={PeliTendencias}></BlueCard>

    </>
  )
}

export default Tendencias
