import React from 'react';
import {Button} from '@material-ui/core/'

const Paginas = (props) => {
    return(
        <div>
            <div>{props.PaginaActual}</div>
            <Button 
                onClick={props.PaginaAnterior}
                variant="contained"
                color="primary">
                &larr; Anterior
            </Button>
            <Button 
                onClick={props.PaginaSiguiente}
                variant="contained"
                color="primary">
                Siguiente &rarr;
            </Button>
        </div>
    )
}
export default Paginas;