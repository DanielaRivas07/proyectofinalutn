import React, { useEffect, useState } from "react";
import axios from 'axios';
import YouTube from 'react-youtube'

import "./App.css";


function App() {
  const API_URL = 'https://api.themoviedb.org/3'
  const API_KEY = '2a91d76fc5e37e78e76691612a9b9866'
  const IMGAGE_PATH = 'https://image.tmdb.org/t/p/original'
  const URL_IMAGE = 'https://image.tmdb.org/t/p/original'
  const [movies, setMovies] = useState([])
  const [buscarKey, setBuscarkey] = useState("")
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Loading Movies"});
  const [playing, setPlaying] = useState(false);
  
  const fetchMovies = async(buscarKey) =>{
    const type = buscarKey ? "search" : "discover"
    const {data: { results },
  } = await axios.get(`${API_URL}/${type}/movie`, {
    params:{
      api_key: API_KEY,
      query: buscarKey,
    },
  });

  setMovies(results)
  setMovie(results[0])

    if(results.length){
      await fetchMovie(results[0].id)
    }
  }

  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos",
      },
    });

    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }
    
    setMovie(data);
  };

  const selectMovie = async(movie)=>{
    fetchMovie(movie.id)
    setMovie(movie)
    window.scrollTo(0,0)
  }

  const buscarMovies = (e)=> {
    e.preventDefault();
    fetchMovies(buscarKey)
  }

  useEffect(()=>{
    fetchMovies();
  },[])

  return (
    
    <div className="todo">
      <div className="buscador">
        <div className="d">
      <h2 className=" titulo">Peliculas</h2> 
       <form className="titulo" onSubmit={buscarMovies}>
        <input type="text"  placeholder='Buscar pelicula' onChange={(e)=> setBuscarkey(e.target.value)}/>
         <button className="btno">Buscar</button> 
         
      </form>
      </div>
      </div>
      

      <div>
        <main>
        {movie ? (
            <div
              className="vertrailer"
              style={{
                backgroundImage: `url("${IMGAGE_PATH}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <YouTube
                    videoId={trailer.key}
                    className="reproductor  "
                    containerClassName={"youtube-container"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="boton">
                    Close
                  </button>
                </>
              ) : (
                <div className="container">
                  <div className="">
                  <h1 className="text-white">{movie.title}</h1>
                    <p className="text-white">{movie.overview}</p>
                    {trailer ? (
                      <button
                        className="boton"
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Play Trailer
                      </button>
                    ) : (
                      "Sorry, no trailer available"
                    )}
                    
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
         
      </div>
      
      
        <div className="peli">
          <div className="pelicu">
          {movies.map((movie)=>(
            <div key={movie.id} className="movie-container" onClick={() => selectMovie(movie)}>
              <img src={`${URL_IMAGE + movie.poster_path }`} alt="" height={400} width="300px"/>
              <h4 className="cen">{movie.title}</h4>
               
            </div>
          ))}
          </div>
        </div>
          
    </div>
      
    
  )
}

export default App
