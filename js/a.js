//Inicio mapa de google
//Creacion marcadores de apartamentos
var map;
var AptData = [];

function initMap() {   
    
    map = new google.maps.Map(document.getElementById('map'), {   //Iniciar mapa de google
        center: {lat: 41.8708, lng: -87.6505},
        zoom: 13
    });


    var infowindow = new google.maps.InfoWindow({   
                            content: ""
                        });
   
    var xmlhttp = new XMLHttpRequest();    
    var apurl = "https://data.cityofchicago.org/api/views/s6ha-ppgi/rows.json?accessType=DOWNLOAD"; //
    xmlhttp.open("GET", apurl, true);
    xmlhttp.send();

    
    xmlhttp.onreadystatechange = function() { //Obtencion de datos
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            
            var aptArray = xmlhttp.responseText;
            var text = aptArray;
            json = JSON.parse(text);
            
           
            for (var i = 0; i<263; i++) { //Agregar informacion marcadores
                var datos = [];
                datos.push(json.data[i][19]); //0.Latitud
                datos.push(json.data[i][20]); //1.Longitud
                datos.push(json.data[i][11]); //2.Nombre apartamento
                datos.push(json.data[i][12]); //3.Direccion       
                datos.push(json.data[i][8]);  //4.Localidad
                datos.push(json.data[i][10]); //5.Tipo propiedad
                datos.push(json.data[i][14]); //6.Telefono1
                AptData.push(datos);
            };           
    
            var numMarkers = AptData.length; //Numero de marcadores
            var markers = [];
            google.maps.event.addListener(map, 'idle', function() {  //Añadir marcadores al mapa
            
            elevation = new google.maps.ElevationService(); //Servicio de elevacion
            $.each(markers, function(key, value)
            {
                value.setMap(null);
            });

            //límites de la ubicación
            var boundBox = map.getBounds();
            var southWest = boundBox.getSouthWest();
            var northEast = boundBox.getNorthEast();
            var lngSpan = northEast.lng() - southWest.lng();
            var latSpan = northEast.lat() - southWest.lat();

            // Agregar los marcadores al mapa en ubicaciones aleatorias
            var locations = [];
            for (var j = 0; j < numMarkers; j++)
            {
                var location = new google.maps.LatLng(
                        southWest.lat() + latSpan * Math.random(),
                        southWest.lng() + lngSpan * Math.random()
                        );
                locations.push(location);
            }

            
            var positionalRequest = {
                'locations': locations
            };

            elevation.getElevationForLocations(positionalRequest, function(results, status)
            {
                if (status === google.maps.ElevationStatus.OK)
                {
                    
                    var prev_infowindow =false; 
                                 

                    $.each(results, function(key, value) {

                        
                        markers[key] = new google.maps.Marker({
                            position: {lat: Number(AptData[key][0]), lng: Number(AptData[key][1])},
                            map: map,                                            
                        });

                        google.maps.event.addListener(markers[key], 'click', function() {
                          
                            if( prev_infowindow ) {
                                prev_infowindow.close();
                            }
                            infowindow.setContent(AptData[key][2]);
                            infowindow.open(map, markers[key]);

                            
                            
                        });
                        
                    });
                }
            });
            var contentString = 'Department of Computer Science | University of Illinois';

            var infomarkerU = new google.maps.InfoWindow({
                    content: contentString,
                             });

            var markerU = new google.maps.Marker({ 
                    position: new google.maps.LatLng(41.870750,-87.650086), 
                    map: map,
                    icon: "img/University.png",
                    title: 'Department of Computer Science - University of Illinois',
                    });                     
                
            markerU.addListener('click', function() {            
                infomarkerU.open(map, markerU);
              });
            markerU.setMap(map);  

            var trafficLayer = new google.maps.TrafficLayer();
                    trafficLayer.setMap(map);       
        });

        }
    };

}
