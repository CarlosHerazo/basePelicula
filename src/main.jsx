import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";




import { CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { BrowserRouter } from "react-router-dom"


const theme = createTheme({
  palette: {
    primary: {
      main: "#0D0D0D", // Negro Cinemático
    },
    secondary: {
      main: "#2C2C2C", // Gris Oscuro
    },
    tertiary: { // Nota: Material-UI no tiene una paleta terciaria por defecto
      main: "#1F3A93", // Azul Profundo
    },
    error: {
      main: "#E50914", // Rojo Vibrante (puede usarse para botones de acción y errores)
    },
    warning: {
      main: "#FFC107", // Amarillo Dorado (puede usarse para advertencias o elementos destacados)
    },
    background: {
      default: "#0D0D0D", // Fondo principal
      paper: "#2C2C2C", // Fondo de elementos tipo "paper"
    },
    text: {
      primary: "#FFFFFF", // Texto en fondos oscuros
      secondary: "#FFC107", // Texto secundario o destacado
    },
    action: {
      active: "#FFFFFF", // Iconos activos en blanco
      hover: "#FFC107", // Color de los iconos al pasar el cursor
      selected: "#FFFFFF", // Iconos seleccionados en blanco
    },
  },
  typography: {
    h1: {
      color: "#FFFFFF",
    },
    h2: {
      color: "#FFFFFF",
    },
    body1: {
      color: "#FFFFFF",
    },
    body2: {
      color: "#FFFFFF",
    },
  },
  components: {
    MuiInput: {
      styleOverrides: {
        root: {
          color: 'inherit', // Color del texto del input
          borderColor: '#FFC107', // Color del borde del input
          '&:hover': {
            borderColor: '#FFFFFF', // Color del borde del input al pasar el cursor
          },
          '&.Mui-focused': {
            borderColor: '#FFC107', // Color del borde del input cuando está enfocado
          },
        },
      },
    },
  },
});



ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <CssBaseline />
      <App />
    </BrowserRouter>
  </ThemeProvider>,
);
