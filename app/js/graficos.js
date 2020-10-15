import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Chart from 'react-apexcharts'



class Barras extends Component {

    constructor(props) {
      super(props);
  
      this.state = {
          series: [{
            name: 'Conteo',
            data: this.props.series
        }],
        options: {
          colors:this.props.colors,
          chart: {
                id: 'apexchart-example',
                toolbar: {
                    show: false
                  },
          },
          xaxis: {
            categories: this.props.labels
            },
            legend: {
              show:false
          },
          title: {
            text: this.props.titulo,
            align: 'left'
          },
          yaxis: {
            title: {
              text: 'Número de manzanas',
              rotate: -90,
              offsetX: 0,
              offsetY: 0
          },
          },
          plotOptions: {
              bar: {
              distributed: true,
                  dataLabels: {
                    position: 'top'
                },
              }
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: undefined,
          formatter: function (val, opts) {
              return val
          },
          textAnchor: 'middle',
          distributed: false,
          offsetX: 0,
          offsetY: -20,
          style: {
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              colors: ["#06357A"]
          },

        }
        },

        
      }

    }



    render() {
      return (
        <Chart options={this.state.options} series={this.state.series} type="bar"  height={300} />
      )
    }
}


  /*
var component = ReactDOM.render(<App id_consulta="grafico1" titulo="Avalúos por cliente" />, document.getElementById('grafico1'));

var component = ReactDOM.render(<App id_consulta="grafico2" titulo="Avalúos por año"  />, document.getElementById('grafico2'));

var component = ReactDOM.render(<App id_consulta="grafico5" titulo="Estatus del avalúo" />, document.getElementById('grafico5'));
*/

class Dona extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
      
          series: this.props.series,
          
          options: {
            colors:this.props.colors,
            chart: {
              type: 'pie',
            },
            labels: this.props.labels,

        },
      
      
      };
    }


    render() {
      return (
        
        <div id="chart">
          <Chart options={this.state.options} series={this.state.series} type="pie"  />
        </div>

      );
    }
  }



/*
var component = ReactDOM.render(<Dona id_consulta="grafico3" titulo="Tipos de avalúo" />, document.getElementById('grafico3'));
  
var component = ReactDOM.render(<Dona id_consulta="grafico4" titulo="Estado de la programación" />, document.getElementById('grafico4'));
*/



  /*
  var component = ReactDOM.render(<Date id_consulta="grafico6" titulo="Avalúos solicitados por fecha" width="700"/>, document.getElementById('grafico6'));
*/

const Form=()=>{


return(

<>

    <Barras titulo="Ejemplo de gráfico" />
  
</>

)


}


  export { Form,Barras,Dona};
