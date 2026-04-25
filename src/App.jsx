import { Container, CircularProgress, Box } from "@mui/material";
import NavBar from "./components/NavBar/NavBar";
import { Route, Routes, useLocation } from "react-router-dom";
import Inicio from "./views/Inicio";
import Tendencias from "./views/Tendencias";
import MovieBanner from "./components/MovieBanner";
import { useEffect, useState } from "react";
import CategoriasPelis from "./views/CategoriasPelis";
import Footer from "./components/Footer";
import DetallesPelis from "./views/DetallesPelis";
import Favoritos         from "./views/Favoritos";
import Colecciones       from "./views/Colecciones";
import DetalleColeccion  from "./views/DetalleColeccion";
import Ruleta            from "./views/Ruleta";
import BackToTop         from "./components/BackToTop";

const API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68";
const HEADERS = { "accept": "application/json", "Authorization": API_TOKEN };

const navList = [
  { title: "Inicio",       path: "inicio"       },
  { title: "Tendencias",   path: "tendencias"   },
  { title: "Categorias",   path: "categorias"   },
  { title: "Colecciones",  path: "colecciones"  },
  { title: "Ruleta",       path: "ruleta"       },
  { title: "Favoritos",    path: "favoritos"    },
];

function AppContent({ peliculas, tendencias }) {
  const location  = useLocation();
  const isDetail      = location.pathname.startsWith('/detalle/');
  const isFavPage     = location.pathname.startsWith('/favoritos');
  const isColecciones = location.pathname.startsWith('/colecciones');
  const isRuleta      = location.pathname.startsWith('/ruleta');

  const hideBanner = isDetail || isFavPage || isColecciones || isRuleta;

  return (
    <>
      <NavBar navList={navList} />

      {!hideBanner && (
        <Box sx={{ width: '100%' }}>
          <Container maxWidth={false} disableGutters sx={{ p: 0 }}>
            <MovieBanner Peliculas={peliculas} />
          </Container>
        </Box>
      )}

      <Routes>
        <Route path="/"            element={<Inicio Peliculas={peliculas} />} />
        <Route path="/inicio"      element={<Inicio Peliculas={peliculas} />} />
        <Route path="/tendencias"  element={<Tendencias PeliTendencias={tendencias} />} />
        <Route path="/categorias"  element={<CategoriasPelis Peliculas={peliculas} />} />
        <Route path="/detalle/:id"       element={<DetallesPelis />} />
        <Route path="/favoritos"         element={<Favoritos />} />
        <Route path="/colecciones"       element={<Colecciones />} />
        <Route path="/colecciones/:id"   element={<DetalleColeccion />} />
        <Route path="/ruleta"            element={<Ruleta />} />
      </Routes>

      <Footer />
      <BackToTop />
    </>
  );
}

function App() {
  const [peliculas, setPeliculas]   = useState(null);
  const [tendencias, setTendencias] = useState(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=es&page=1&sort_by=popularity.desc', { headers: HEADERS }).then(r => r.json()),
      fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', { headers: HEADERS }).then(r => r.json()),
    ])
      .then(([movData, trendData]) => {
        setPeliculas(movData.results);
        setTendencias(trendData.results);
      })
      .catch(err => console.error("Error fetching movies:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        height: '100vh', gap: 2,
      }}>
        <CircularProgress color="warning" size={48} thickness={3} />
        <Box sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', letterSpacing: '3px' }}>
          CARGANDO
        </Box>
      </Box>
    );
  }

  return <AppContent peliculas={peliculas} tendencias={tendencias} />;
}

export default App;
