import React from 'react';
import {
        FormGroup,
        Select,
        MenuItem,
        TextField,
        Button    
} from '@material-ui/core';

class Buscador extends React.Component{
    //Definimos cual es el elemento al que vamos a referenciar cuando realicemos el evento Submit del Formulario y levantemos el valor escrito en el mismo.
    BusquedaRef = React.createRef()
    CantidadRef = React.createRef()

    //Funcion cuya finalidad es pasar el valor del Form>TextField al Componente Padre APP
    handleDatos = (e) =>{
        //Evita que el formulario ejecute la recarga de la pagina (comportamiento por defecto del formulario)
        e.preventDefault();
        const termino = this.BusquedaRef.current.value;
        const cantidad = this.CantidadRef.current.value;
        //definimos cual es el parametro que se va a pasar a la funcion BuscarDatos asociada al componete
        this.props.BuscarDatos(termino,cantidad)
    }

    render(){
        return(
        // Efectua la funcion que levanta los datos del tag TextField y los pasa al componente padre (Metodo React.CreateRef() necesario para la vinculacion)
        <form onSubmit={this.handleDatos}>
            <FormGroup
                >
                <TextField 
                    ref={this.BusquedaRef}
                    type="text"
                    placeholder="Escriba lo que desee Buscar"/>
                <Select
                    ref={this.CantidadRef}>
                    <MenuItem value="5">5</MenuItem>
                    <MenuItem value="10">10</MenuItem>
                    <MenuItem value="25">25</MenuItem>
                    <MenuItem value="50">50</MenuItem>
                    <MenuItem value="100">100</MenuItem>
                    <MenuItem value="200">200</MenuItem>
                </Select>
                <Button 
                    type="submit"
                    variant="outlined"
                    color="primary">
                    Buscar
                </Button>
            </FormGroup>
        </form>
        )
    }
}

export default Buscador;