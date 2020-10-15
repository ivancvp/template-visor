import municipios from '../json/municipios.json'
import departamentos from '../json/departamentos.json'


const sel_departamento = document.querySelector('#departamento');
const sel_municipio = document.querySelector('#municipio');
const mun_container = document.querySelector('.mun');

mun_container.style.display = 'none';

departamentos.map((value, key) => {
  sel_departamento.add(new Option(value.nombre,value.cod_dpto))
})

municipios.map((value, key) => {
  sel_municipio.add(new Option(value.nombre,value.cod_mpio))
})


sel_departamento.addEventListener('change', (event) => {
  
  const cod_depto = parseInt(sel_departamento.value);

  if(isNaN(cod_depto)){
    
    mun_container.style.display = 'none';
    return
  }else{
    mun_container.style.display = 'block';
  }

  const filtro = municipios.filter(dato => {
    return parseInt(dato.cod_dpto)==cod_depto
  })

  sel_municipio.options.length = 0;
  sel_municipio.add(new Option("Seleccione...", ""))
  
  filtro.map((value, key) => {
    sel_municipio.add(new Option(value.nombre,value.cod_mpio))
  })
  
})
