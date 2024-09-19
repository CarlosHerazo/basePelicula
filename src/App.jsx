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
      const res = await fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=es&page=1&sort_by=popularity.desc',{
        headers: {
          "accept": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68"
        }
      });
      const data = await res.json();
      console.log(data);
      setPeliculas(data.results);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const getTendencias = async () => {
    try {
      const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US',{
        headers: {
          "accept": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Yzk5ZDM4OTY5YjJjNWMyZDYxMmVjMTJjMzVjN2FiOCIsInN1YiI6IjY2NDM3M2I4Y2QxZWJjOTVjZGI5YjVlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ddqNN6ElsNZUfysbJqkEyIBFvecFFfuS_GaFScbq-68"
        }
      });
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
