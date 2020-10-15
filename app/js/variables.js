export const variables= {
    
    title: 'Test viewer',
    description: 'test viewer for rapid display of statistical information',
    
    dif_catastro_censo:'hot_spot',
    
    series:[0,0,0,0,0],

    hot_spot: {
        rangos: [0,0, 0.85, 1, 1.36, 1056],
        colores: ['#1B4F72', '#2E86C1', '#AED6F1', '#F5B7B1', '#E74C3C'],
        labels: ['0%', '0.85%', '1%', '1.36%', '>1.36%'],
        titulo: "Diferencia porcentual del censo vs catastro",
        columna:4
    },
    key:"pk.eyJ1IjoiaXZhbjEyMzQ1Njc4IiwiYSI6ImNqc2ZkOTNtMjA0emgzeXQ3N2ppMng4dXAifQ.2k-OLO6Do2AoH5GLOWt-xw",
    baseMaps:{
        'gris': 'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token=',
        'dark': 'https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}?access_token=',
        'normal':'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token='
    },
    imgFooter: "./img/logo-presidencia.svg",
    imgHeader: "./img/dane.svg",

}

export const urlDeploy='http://localhost:3000/'
