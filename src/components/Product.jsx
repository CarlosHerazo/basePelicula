
import styled from '@emotion/styled'
import {Box, Button, Paper, Typography} from '@mui/material'
import React from 'react'

function Product() {
    const Img = styled("img")({
        width: 200,
        height:"100%",
        objectFit:"cover",
        objectPosition:"center",
    })
  return (
    <Paper
        sx={{
            display:"flex",
            alignItems: "center",
            gap:2,
            overflow:"hidden",
            mt: 5,
        }}
    >
        <Img 
            src="https://via.placeholder.com/200" 
            alt="img con styled" 
        />
        <Box sx={{flexGrow: 1, display:"grid", gap:3}}>
            <Typography variant='h4'>Product Name</Typography>
            <Typography variant='body1'>Product Descriptions</Typography>
            <Button variant="contained">Add Card</Button>
        </Box>
        <Box 
        sx={{mr:3}}
        component="p"
        >$19.99</Box>
    </Paper>
  )
}

export default Product
