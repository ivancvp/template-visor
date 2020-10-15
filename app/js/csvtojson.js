var JSZip = require("jszip");
var zip = new JSZip();
const CSV = require('csv-string');
const servidor = require('./request.js');

import {getData} from './request'


export function getZip(archivo) {
    
    var datos_geo=[]
    var newdata=[]

     async function datos() {
        const response = await getData('datos/'+archivo);

        return zip.loadAsync(response.data)
        .then(function(zip) {
            // you now have every files contained in the loaded zip
          
          return zip.file(archivo+".csv").async("string").then(function (data) { 
    
            const parsedCsv = CSV.parse(data);
            datos_geo = parsedCsv;
    
            datos_geo.map((row, i) => {
              var cod=row[0]
              newdata[cod] = {
                 row
              }
            })
              return newdata;
    
          })
          
    
    
        }); 
    }
    return datos();
 
}

