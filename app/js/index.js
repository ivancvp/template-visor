
import '../css/styles.scss';
//openlayers
import './filtros'

import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import TileGrid from 'ol/tilegrid/TileGrid';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { transform } from 'ol/proj';
import { Style, Fill, Stroke } from 'ol/style';
import { boundingExtent } from 'ol/extent';
import { transformExtent } from 'ol/proj';
import Overlay from 'ol/Overlay';
import MVT from 'ol/format/MVT';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Cluster from 'ol/source/Cluster';
import { Circle as CircleStyle, RegularShape, Text, Icon } from 'ol/style';
import { defaults as defaultControls } from 'ol/control.js';

import { get as getProjection } from 'ol/proj';




import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import geometria from '../json/bbox.json'

import Leyenda from './leyenda.js'


import { getZip } from './csvtojson'

import {variables,urlDeploy} from './variables'

import Load from './util'


import { Barras, Dona } from './graficos'
import { jsPDF } from "jspdf";



ReactDOM.render(<Load visible={true} />, document.getElementById('loader'));

ReactDOM.render(<Leyenda />, document.getElementById('leyenda'));




function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('../img/', false, /\.(png|jpg|svg)$/));


var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

var overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
});

var key = variables.key;

var base = new TileLayer({
  source: new XYZ({
    url: variables.baseMaps.normal + key,
    crossOrigin: "Anonymous"
  })
});
const map = new Map({
  target: 'mapa',
  controls: [],
  overlays: [overlay],
  layers: [
    base
  ],
  view: new View({
    center: transform([-74.1083125, 4.663437], 'EPSG:4326', 'EPSG:3857'),
    zoom: 14
  })
});


var resolutions = [];
for (var i = 0; i <= 8; ++i) {
  resolutions.push(156543.03392804097 / Math.pow(2, i * 2));
}
// Calculation of tile urls for zoom levels 1, 3, 5, 7, 9, 11, 13, 15.
function tileUrlFunction(tileCoord) {

  return (
    'https://api.mapbox.com/v4/ivan12345678.9t8jbmu0/{z}/{x}/{y}.vector.pbf?sku=101h6wrNEIHUF&access_token=' +
    key
  )
    .replace('{z}', String(tileCoord[0] * 2 - 1))
    .replace('{x}', String(tileCoord[1]))
    .replace('{y}', String(tileCoord[2]))
}


function tileUrlFunction_sector(tileCoord) {

  return (
    urlDeploy + 'sector/{x}/{y}/{z}.pbf'
  )
    .replace('{z}', String(tileCoord[0] * 2 - 1))
    .replace('{x}', String(tileCoord[1]))
    .replace('{y}', String(tileCoord[2]))
}
function tileUrlFunction_mpio(tileCoord) {

  return (
    urlDeploy + 'mpio/{x}/{y}/{z}.pbf'
  )
    .replace('{z}', String(tileCoord[0] * 2 - 1))
    .replace('{x}', String(tileCoord[1]))
    .replace('{y}', String(tileCoord[2]))
}
function tileUrlFunction_depto(tileCoord) {

  return (
    urlDeploy + 'depto/{x}/{y}/{z}.pbf'
  )
    .replace('{z}', String(tileCoord[0] * 2 - 1))
    .replace('{x}', String(tileCoord[1]))
    .replace('{y}', String(tileCoord[2]))
}


const vectorTileSource = (tileFunc) => {
  return new VectorTileSource({
    format: new MVT(),
    tileGrid: new TileGrid({
      extent: getProjection('EPSG:900913').getExtent(),
      resolutions: resolutions,
      tileSize: 512,
    }),
    tileUrlFunction: tileFunc,
  });
}

const vectorTileLyr = (source) => {
  return new VectorTileLayer({
    source: source,
  });
}

const mz_source = vectorTileSource(tileUrlFunction)
const sector_source = vectorTileSource(tileUrlFunction_sector) 
const mpio_source = new vectorTileSource(tileUrlFunction_mpio) 
const depto_source = vectorTileSource(tileUrlFunction_depto)  

const sector_hot = vectorTileLyr(sector_source)
map.addLayer(sector_hot);
sector_hot.set('id', 'sector_hot')

const dif_catastro_censo = vectorTileLyr(mz_source)
map.addLayer(dif_catastro_censo);
dif_catastro_censo.set('id', 'dif_catastro_censo')


const mpio = vectorTileLyr(mpio_source)
map.addLayer(mpio);
mpio.set('id', 'mpio')
mpio.setVisible(false)



const depto = vectorTileLyr(depto_source)
map.addLayer(depto);
depto.set('id', 'depto')
depto.setVisible(false)


////

map.on("pointermove", function (evt) {
  var hit = map.hasFeatureAtPixel(evt.pixel);
  map.getTargetElement().style.cursor = (hit ? 'pointer' : '');
});



mpio.setStyle(function (feature) {

  return new Style({
    stroke: new Stroke({
      color: '#015592',
      width: 0.5,
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0)'
    })
  });
});

depto.setStyle(function (feature) {

  return new Style({
    stroke: new Stroke({
      color: '#349C00',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0)'
    })
  });
});



var newdata_mz_hot = []
var newdata_se_hot = []

async function getDatos() {

  newdata_mz_hot = await getZip('hot_spot');
  newdata_se_hot = await getZip('sector_dif_censal');

  layerStyle();

}

getDatos()




const getColor = (valor, var_array, var_colores) => {

  var array = []
  var colores = []

  array = var_array;
  colores = var_colores;

  var filter = array.map((e, i) => {
    return e < valor ? i : false;
  })

  return colores[Math.max(...filter)]

}


const iterador = (info, feature, columna, pk, array, colores) => {

  const key = feature.get(pk);

  var color = 'transparent'
  if (typeof info[key] !== "undefined") {
    //console.log(newdata_mz[key])

    color = getColor(parseFloat(info[key].row[columna]), array, colores)

  }
  return color;
}




const layerStyle = () => {


  const estilo = (color) => {
    return new Style({
      fill: new Fill({
        color: color
      })
    });
  }

  sector_hot.setStyle(function (feature) {

    var color = iterador(newdata_se_hot, feature, 1, 'setr_ccnct', variables.hot_spot.rangos, variables.hot_spot.colores);

    return estilo(color)
  });

  dif_catastro_censo.setStyle(function (feature) {

    var color = iterador(newdata_mz_hot, feature, 4, 'cod_dane', variables.hot_spot.rangos, variables.hot_spot.colores);

    return estilo(color)
  });



  ReactDOM.unmountComponentAtNode(document.getElementById('loader'))
  document.getElementById('background').style.display="none"

  mz_source.on('tileloadend', function () {
    


  });


}




// zoom to municipio 
const sel_municipio = document.querySelector('#municipio');
sel_municipio.addEventListener('change', (event) => {

  var value = sel_municipio.value;

  var boundary = geometria[value]

  var ext = boundingExtent([[boundary[0][0], boundary[0][1]], [boundary[1][0], boundary[1][1]]]);
  ext = transformExtent(ext, 'EPSG:4326', 'EPSG:3857');

  map.getView().fit(ext, map.getSize());

  var center = map.getView().getCenter();
  var resolution = map.getView().getResolution();
  map.getView().setCenter([center[0] + 10*resolution, center[1] + 10*resolution]);

});





// Popup al hacer click sobre una capa
map.on('singleclick', function (evt) {
  var coordinate = evt.coordinate;

  var mensaje = "";
  var id = "";

  var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
    id = layer.get('id')
    return feature;

  }, {
    hitTolerance: 2
  });
 


  if (id == "dif_catastro_censo") {
    var info = newdata_mz_hot[feature.get("cod_dane")].row
    mensaje = "<p>Cod DANE: " + info[0] + "</p><p>diferencia %: " + info[4] + "</p>"
  }

  else if (id == "sector_hot") {
    var info = newdata_se_hot[feature.get("setr_ccnct")].row
    mensaje = "<p>Cod DANE: " + info[0] + "</p><p>diferencia %: " + info[1] + "</p>"
  }
  



  else if (id == "mpio") {
    var info = feature.get("nombre_mpio")
    var info1 = feature.get("nombre_depto")

    mensaje = "<p>Municipio: " + info + "</p>" + "<p>Depto: " + info1 + "</p>"
  } else if (id == "depto") {
    var info = feature.get("nombre")
    mensaje = "<p>Depto: " + info + "</p>"
  }



  if (mensaje != "") {
    content.innerHTML = '<p>' + mensaje + '</p>';
    overlay.setPosition(coordinate);
  }


});


// cambio del mapa base
var radios = document.querySelectorAll('input[type=radio][name=radio1]');

radios.forEach(radio => radio.addEventListener('change', () => {
  const mapa = radio.value;

  const baseMaps = variables.baseMaps;

  base.setSource(
    new XYZ({
      url: baseMaps[mapa]+key,
      crossOrigin: "Anonymous"
    })
  )

}

))


var grafico = document.getElementById('grupo-graficos')

var info_graph = null;


var data = variables[variables["dif_catastro_censo"]]
  
info_graph = data;

map.on('moveend', onMoveEnd);

//visibilidad de las capas de los layer
var check_depto = document.getElementsByClassName('layer');

var prev_layer = "dif_catastro_censo";

const myFunction = (e) => {

  const check = ["depto", "mpio"]


 var layer=e.target.getAttribute("layer");

  if (e.target.checked && check.indexOf(layer)<0) {
    
    eval(prev_layer).setVisible(false)
    
    document.getElementById(prev_layer).style.display = "none";


    sector_hot.setVisible(false)

    prev_layer = layer;

    eval(layer).setVisible(true)
    document.getElementById(prev_layer).style.display = "block";


     if (layer == "dif_catastro_censo") {
      sector_hot.setVisible(true)
    }

    //seccion de graficos
    

    var data = variables[variables[layer]]
  
    info_graph = data;
  
    map.on('moveend', onMoveEnd);

    var center = map.getView().getCenter();
    var resolution = map.getView().getResolution();
    map.getView().setCenter([center[0] + 10*resolution, center[1] + 10*resolution]);
  


  } else  {
    if (e.target.checked) {
      eval(layer).setVisible(true)
    } else {
      eval(layer).setVisible(false)
    }
    
  }



}

for (var i = 0; i < check_depto.length; i++) {
  check_depto[i].addEventListener('change', e => myFunction(e), false);
}


//cambio de transparencia
var slider = document.getElementsByClassName('slider');

const changeSlider = (e) => {
  const transparencia = e.target.value / 10
  eval(e.target.name).setOpacity(transparencia)
  

  if (e.target.name == "dif_catastro_censo") {
    sector_hot.setOpacity(transparencia)
  }


}
for (var i = 0; i < slider.length; i++) {
  slider[i].addEventListener('change', e => changeSlider(e), false);
}



// actualización de las estadisticas


const getEstadistica = (valor, rangos) => {

  var array = []

  array = rangos

  var filter = array.map((e, i) => {
    return e < valor ? i : false;
  })

  return Math.max(...filter)

}






function onMoveEnd(evt) {
  
  evt.stopPropagation();
  evt.preventDefault();

  var info = info_graph;

  if (evt.map.getView().getZoom() > 12) {



    var map = evt.map;
    var extent = map.getView().calculateExtent(map.getSize());


    var elementos = mz_source.getFeaturesInExtent(extent);

    elementos = getUniqueFeatures(elementos, 'cod_dane');


    var est1 = [0, 0, 0, 0, 0];

    var radio = document.querySelector('input[name="radio"]:checked').getAttribute("layer");
    var array_datos;
    if (radio=="dif_catastro_censo") {
      array_datos=newdata_mz_hot
    } 

    if (elementos.length < 50000 && elementos.length >0 ) {

      grafico.style.display = "block";


      elementos.forEach(function (feature) {

        var data = array_datos[feature.get("cod_dane")];
        
        var a = data.row[info.columna]

        var i1 = getEstadistica(a, info.rangos);

        est1[i1] = est1[i1] + 1


      });

      var donita = null;
      var barrita = null;
          
      barrita= ReactDOM.render(<Barras titulo={info.titulo} series={variables.series} colors={info.colores} labels={info.labels} />, document.getElementById('grafico'));
      
      donita = ReactDOM.render(<Dona titulo="Ejemplo de gráfico" series={variables.series} colors={info.colores} labels={info.labels} />, document.getElementById('grafico3'));
      
      barrita.setState({ series: [{ data: est1 }],options:{colors:info.colores,xaxis:{categories:info.labels},title:{text:info.titulo}}})

      donita.setState({ series: est1,options:{colors:info.colores,labels:info.labels} })

    } else {
      grafico.style.display = "none";

    }




  } else {
    grafico.style.display = "none";

  }

}





function getUniqueFeatures(array, comparatorProperty) {
  var existingFeatureKeys = {};
  var uniqueFeatures = array.filter(function (el) {

    if (existingFeatureKeys[el.get(comparatorProperty)]) {
      return false;
    } else {
      existingFeatureKeys[el.get(comparatorProperty)] = true;
      return true;
    }
  });

  return uniqueFeatures;
}



const mq = window.matchMedia("(max-width: 700px)");

if (mq.matches) {
  document.getElementById('ham').checked = false;


  var ham = document.getElementById('ham');
  ham.addEventListener('change', e => {

    if (ham.checked) {
      document.getElementById('leyenda').style.visibility = "hidden";
    } else {
      document.getElementById('leyenda').style.visibility = "visible";

    }

  }

    , false);


} else {
  document.getElementById('ham').checked = true;
}


var buttons = document.querySelectorAll(".toggle-button");
var modal = document.querySelector("#modal");


[].forEach.call(buttons, function(button) {
  button.addEventListener("click", function() {
    modal.classList.toggle("off");
  })
});


//defaults
document.getElementById('titulo_visor').innerHTML = variables.title;
document.getElementById('description').innerHTML = variables.description;
document.getElementById('dane').src=variables.imgHeader
document.getElementById('logo-presidente').src=variables.imgFooter