import React, {Component} from 'react';
import Logo from './logo.svg'
import './App.css';

//Importamos los componentes que va a utilizar APP
import Buscador from './components/Buscador';
import Resultado from './components/Resultado';

import {Card} from '@material-ui/core';
import { white } from 'color-name';

class App extends Component{
  //definimos los Estados 
  state = {
    termino: '',
    total:1,
    cantidad:1,
    imagenes:[],
    pagina:1
  }

  /// funcion que define el nuevo estado y metodo callback mediante promise (espera a la resolucion de ConsultarAPI)
  BuscarDatos = (termino,cantidad) =>{ 
    this.setState({
      termino:termino,
      cantidad:cantidad,
      pagina:1
    }, () => {
        this.ConsultarAPI();
      }
    )
  }
  
  ///Funcion que solicita los datos al servidor utilizando
  ConsultarAPI = () => {
    const termino = this.state.termino
    const cantidad = this.state.cantidad
    const pagina = this.state.pagina
    const url = `https://api.giphy.com/v1/gifs/search?api_key=LanYkWCgNLIRDm6XZOZWnYH9yZHOProA&q=${termino}&limit=&offset=${pagina * cantidad}&rating=g&lang=es`
    

    //Solicitud de Datos utilizando las constantes y devuelve una funcion que define un nuevo estado de IMAGENES y una Array de Objetos
    fetch(url)
      .then(respuesta => respuesta.json())
      .then(resultado => this.setState({
        imagenes: resultado.data,
        total: resultado.data.length
      }))
  }

  PaginaAnterior = () => {
    let pagina = this.state.pagina
    if (pagina === 1) return null;
    pagina --;
    this.setState({pagina}, () => {this.ConsultarAPI();})
  }

  PaginaSiguiente = () => {
    let total = this.state.total / this.state.cantidad
    let pagina = this.state.pagina
    if (pagina === total) return null;
    pagina ++;
    this.setState({pagina}, () => {this.ConsultarAPI();})
  }

  render(){
    const useStyles = ({
      myHeader:{
        color:'white',
        backgroundColor:'#192168'
      }
    });
    
    return(
    <>
      <header className={useStyles.myHeader}>
        <Card variant="outlined">
          <h1>Gifos</h1>
          <Buscador BuscarDatos={this.BuscarDatos} /> 
        </Card>
      </header>
      <main>
        <Resultado 
          imagenes={this.state.imagenes}
          PaginaActual = {this.state.pagina}
          PaginaAnterior={this.PaginaAnterior}
          PaginaSiguiente={this.PaginaSiguiente}
        />
      </main>
    </>
    )
  }
}

export default App;
