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
import { FavoritesProvider }  from './context/FavoritesContext'
import { WatchlistProvider } from './context/WatchlistContext'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:    { main: "#0D0D0D" },
    secondary:  { main: "#2C2C2C" },
    error:      { main: "#E50914" },
    warning:    { main: "#FFC107" },
    background: { default: "#0D0D0D", paper: "#161616" },
    text: {
      primary:   "#FFFFFF",
      secondary: "rgba(255,255,255,0.6)",
    },
    action: {
      active:   "#FFFFFF",
      hover:    "#FFC107",
      selected: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h1: { color: "#FFFFFF", fontWeight: 900, letterSpacing: "-1.5px" },
    h2: { color: "#FFFFFF", fontWeight: 800, letterSpacing: "-1px"   },
    h3: { color: "#FFFFFF", fontWeight: 700, letterSpacing: "-0.5px" },
    h4: { color: "#FFFFFF", fontWeight: 700 },
    h5: { color: "#FFFFFF", fontWeight: 600 },
    h6: { color: "#FFFFFF", fontWeight: 600 },
    body1: { color: "#FFFFFF" },
    body2: { color: "rgba(255,255,255,0.65)" },
    subtitle1: { color: "rgba(255,255,255,0.75)" },
    caption: { color: "rgba(255,255,255,0.5)" },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.3px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#161616',
          backgroundImage: 'none',
          boxShadow: '0 4px 24px rgba(0,0,0,0.45)',
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 6 } },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiAppBar: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0F0F0F',
          backgroundImage: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,193,7,0.5)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#FFC107',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#FFC107',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'rgba(255,255,255,0.5)',
          '&.Mui-focused': { color: '#FFC107' },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: { color: 'rgba(255,193,7,0.7)' },
      },
    },
  },
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <FavoritesProvider>
        <WatchlistProvider>
          <CssBaseline />
          <App />
        </WatchlistProvider>
      </FavoritesProvider>
    </BrowserRouter>
  </ThemeProvider>,
);
