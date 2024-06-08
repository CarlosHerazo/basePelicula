import { Container, CircularProgress, Box } from "@mui/material";
import NavBar from "./components/NavBar/NavBar";
import { Route, Routes } from "react-router-dom";
import Inicio from "./views/Inicio";
import Tendencias from "./views/Tendencias";
import MovieBanner from "./components/MovieBanner";
import { useEffect, useState } from "react";
import CategoriasPelis from "./views/CategoriasPelis";
import Footer from "./components/Footer";
import DetallesPelis from "./views/DetallesPelis";

function App() {
  const [peliculas, setPeliculas] = useState(null);
  const [tendencias, setTendencias] = useState(null);
  const [loading, setLoading] = useState(true);

  const getMovies = async () => {
    try {
      const res = await fetch('http://localhost:5000/movies');
      const data = await res.json();
      console.log(data);
      setPeliculas(data.results);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const getTendencias = async () => {
    try {
      const res = await fetch('http://localhost:5000/movies/tendencias');
      const data = await res.json();
      console.log(data);
      setTendencias(data.results);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getTendencias();
      await getMovies();
      setLoading(false);
    };

    fetchData();
  }, []);

  const navList = [
    {
      title: "Inicio",
      path: "inicio"
    },
    {
      title: "Tendencias",
      path: "tendencias"
    },
    {
      title: "Categorias",
      path: "categorias"
    }
  ];

  return (
    <>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'warning' }}>
          <CircularProgress color="warning" />
        </Box>
      ) : (
        <>
          <NavBar navList={navList} />
          <Box sx={{ width: '100%' }}>
            <Container maxWidth={false} disableGutters sx={{ p: 0 }}>
              <MovieBanner Peliculas={peliculas} />
            </Container>
          </Box>
          <Container sx={{ mt: 10 }} maxWidth="xl">
            <Routes>
              <Route path="/" element={<Inicio Peliculas={peliculas} />} />
              <Route path="/inicio" element={<Inicio Peliculas={peliculas} />} />
              <Route path="/tendencias" element={<Tendencias PeliTendencias={tendencias} />} />
              <Route path="/categorias" element={<CategoriasPelis Peliculas={peliculas} />} />
              <Route path="/detalle/:id" element={<DetallesPelis />} />
            </Routes>
          </Container>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
