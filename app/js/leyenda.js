import React,{Component} from 'react';


import {variables} from './variables'

const Leyenda=()=> {
    // Declare a new state variable, which we'll call "count"
    const [count, setCount] = React.useState(0);
  
    return (
      <div>
        <p id="titulo">Leyenda</p>
            <div id="dif_catastro_censo" >
              <p className="descripcion">{variables.hot_spot.titulo}  </p>
              <div>
                  {variables.hot_spot.labels.map((i, e) => <div className="item" ><span style={{backgroundColor:variables.hot_spot.colores[e]}}></span><p>{i}</p></div>)}
              </div>
            </div>

      </div>
    );
  }

export default Leyenda;
