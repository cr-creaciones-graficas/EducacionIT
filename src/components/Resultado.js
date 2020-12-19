import React from 'react';
import Imagenes from './Imagenes';
import Paginas from './Paginas';

class Resultado extends React.Component{
    //Funcion que define los valores a utilizar como Props
    MostrarImagenes = () => {
        const imagenes = this.props.imagenes;
        return(
            //iteracion de Imagenes para representar cada objeto y pasar sus PROPS al componente Imagenes
            <>
                {imagenes.map(imagen =>(
                    <article>
                        <Imagenes 
                            key={imagen.id}
                            imagen={imagen} />
                    </article> 
                ))} 
                <Paginas
                    PaginaActual={this.props.PaginaActual}
                    PaginaAnterior={this.props.PaginaAnterior}
                    PaginaSiguiente={this.props.PaginaSiguiente} />
            </> 
        )            
    }
    render(){
        return(
            <section>
                
                {this.MostrarImagenes()}
            </section>
        )
    }
}

export default Resultado;