import React, {Component} from 'react';

//Asignamos a los Props los parametros del Array que vamos a utilizar dentro de nuestro componente
const Imagen = (props) =>{
    const {title, url, images, type, username, tags} = props.imagen;
    return(
        <>
            <img
                src={images.downsized.url}
                alt={type} />
            <footer>
                <p>
                    <strong> Usuario: </strong> {username} | 
                    <strong> Title: </strong> {title}
                </p>
                <a 
                    href={url}
                    target="_blank">
                    {type}
                </a>
            </footer> 
        </>
    )
}

export default Imagen;