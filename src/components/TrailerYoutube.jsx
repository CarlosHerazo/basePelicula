import React from 'react';
import YouTube from 'react-youtube';

const TrailerYoutube = ({ trailerKey }) => {
    const opts = {
        height: '500',
        width: '1000',
        playerVars: {
            autoplay: 1,
            controls: 0, // Deshabilitar los controles del reproductor
            modestbranding: 0, // Mostrar un reproductor más sencillo sin el logo de YouTube
            showinfo: 0, // Ocultar la información del video
        },
    };


    const _onReady = (event) => {
        // Acceso al reproductor en todos los manejadores de eventos a través de event.target
        event.target.playVideo();
    };

    return (
        <YouTube videoId={trailerKey} opts={opts} onReady={_onReady} />
    );
};

export default TrailerYoutube;
